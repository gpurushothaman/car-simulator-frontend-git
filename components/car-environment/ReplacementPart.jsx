"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useSceneAnimation } from "./SceneAnimationContext";
import { useSceneVariant } from "./SceneVariantContext";

export default function ReplacementPart({
  path,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  partId,
}) {
  const groupRef = useRef(null);
  const { scene, animations, parser } = useGLTF(path);
  const { actions, names, mixer } = useAnimations(animations, groupRef);

  const { registerModelAnimations, unregisterModelAnimations } = useSceneAnimation();
  const { registerModelVariants, unregisterModelVariants } = useSceneVariant();

  const model = useMemo(() => scene.clone(true), [scene]);

  const variants = useMemo(() => {
    const definitions = parser.json?.extensions?.KHR_materials_variants?.variants ?? [];
    return definitions.map((variant, index) => ({
      index,
      name: variant.name || `Variant ${index + 1}`,
    }));
  }, [parser]);

  const applyVariant = useCallback(async (variantIndex) => {
    const tasks = [];

    model.traverse((object) => {
      if (!object.isMesh) return;

      const meshExtension =
        object.userData?.gltfExtensions?.KHR_materials_variants;

      if (!Object.prototype.hasOwnProperty.call(object.userData, "originalMaterial")) {
        object.userData.originalMaterial = object.material;
      }

      object.material = object.userData.originalMaterial;
      if (!meshExtension) return;

      const mapping = meshExtension.mappings?.find((item) =>
        item.variants?.includes(variantIndex)
      );
      if (!mapping) return;

      tasks.push(
        parser.getDependency("material", mapping.material).then((material) => {
          object.material = material;
          parser.assignFinalMaterial(object);
        })
      );
    });

    await Promise.all(tasks);
  }, [model, parser]);

  useEffect(() => {
    if (!names.length) return undefined;

    registerModelAnimations(partId, actions, names, mixer);
    return () => {
      unregisterModelAnimations(partId);
      mixer.stopAllAction();
    };
  }, [
    partId,
    actions,
    names,
    mixer,
    registerModelAnimations,
    unregisterModelAnimations,
  ]);

  useEffect(() => {
    if (!variants.length) return undefined;

    registerModelVariants(partId, model, variants, applyVariant);
    return () => unregisterModelVariants(partId);
  }, [
    partId,
    model,
    variants,
    applyVariant,
    registerModelVariants,
    unregisterModelVariants,
  ]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}
