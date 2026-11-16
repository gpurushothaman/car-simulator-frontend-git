"use client";

import { useMemo, useEffect, useRef } from "react";
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
  console.log("replace part:=", animations);

  //Model & animations & mixer
  const { actions, names, mixer } = useAnimations(animations, groupRef);
  const { registerModelAnimations, unregisterModelAnimations } =
    useSceneAnimation();

  const model = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

  //Material variants
  const { registerModelVariants, unregisterModelVariants } = useSceneVariant();

  const variants = useMemo(() => {
    const extension = parser.json.extensions?.KHR_materials_variants;

    return (
      extension?.variants?.map((variant, index) => ({
        index,
        name: variant.name || `Variant ${index + 1}`,
      })) || []
    );
  }, [parser]);

  //Register model animations
  useEffect(() => {
    const hasAnimations = names.length > 0;

    if (!hasAnimations) return;

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
    if (!variants.length) return;

    const extension = parser.json.extensions?.KHR_materials_variants;

    if (!extension) {
      console.warn("KHR_materials_variants extension not found");
      return;
    }

    // Apply selected variant to the cloned model
    // const applyVariant = async (variantIndex) => {
    //   const tasks = [];

    //   model.traverse((object) => {
    //     if (!object.isMesh) return;

    //     const meshExtension =
    //       object.userData.gltfExtensions?.KHR_materials_variants;

    //     if (!meshExtension) return;

    //     // Store the original material only once
    //     if (!object.userData.originalMaterial) {
    //       object.userData.originalMaterial = object.material;
    //     }

    //     // Find the material mapping for this variant
    //     const mapping = meshExtension.mappings.find((item) =>
    //       item.variants.includes(variantIndex)
    //     );

    //     if (mapping) {
    //       tasks.push(
    //         parser
    //           .getDependency("material", mapping.material)
    //           .then((material) => {
    //             object.material = material;
    //             parser.assignFinalMaterial(object);
    //           })
    //       );
    //     } else {
    //       // Restore original material if no mapping exists
    //       object.material = object.userData.originalMaterial;
    //     }
    //   });

    //   await Promise.all(tasks);
    // };

    const applyVariant = async (variantIndex) => {
      const tasks = [];
    
      model.traverse((object) => {
        if (!object.isMesh) return;
    
        const meshExtension =
          object.userData.gltfExtensions?.KHR_materials_variants;
    
        if (!object.userData.originalMaterial) {
          object.userData.originalMaterial = object.material;
        }
    
        // Always restore original material first
        object.material = object.userData.originalMaterial;
    
        if (!meshExtension) return;
    
        const mapping = meshExtension.mappings.find((item) =>
          item.variants.includes(variantIndex)
        );
    
        if (!mapping) return;
    
        tasks.push(
          parser
            .getDependency("material", mapping.material)
            .then((material) => {
              object.material = material;
              parser.assignFinalMaterial(object);
            })
        );
      });
    
      await Promise.all(tasks);
    };

    registerModelVariants(partId, model, variants, applyVariant);

    return () => {
      unregisterModelVariants(partId);
    };
  }, [
    partId,
    model,
    variants,
    parser,
    registerModelVariants,
    unregisterModelVariants,
  ]);

  return (
    <group position={position} rotation={rotation} scale={scale} ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}
