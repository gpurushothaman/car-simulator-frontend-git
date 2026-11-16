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
  // A request counter per mesh prevents a new material request from
  // cancelling pending changes on other meshes in this replacement part.
  const meshRequestRef = useRef(new WeakMap());
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

      // Keep materials already selected on other meshes. Only meshes
      // explicitly mapped to this variant are changed.
      if (!meshExtension) return;

      const mapping = meshExtension.mappings?.find((item) =>
        item.variants?.includes(variantIndex)
      );
      if (!mapping) return;

      const requestId = (meshRequestRef.current.get(object) ?? 0) + 1;
      meshRequestRef.current.set(object, requestId);

      tasks.push(
        parser.getDependency("material", mapping.material).then((material) => {
          // Only a newer request for this exact mesh can invalidate this one.
          if (meshRequestRef.current.get(object) !== requestId) return;
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
