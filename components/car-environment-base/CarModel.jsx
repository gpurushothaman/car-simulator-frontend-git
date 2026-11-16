"use client";

import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations, Html } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useSceneAnimation } from "./SceneAnimationContext";
import { useSceneVariant } from "./SceneVariantContext";

import ReplacementPart from "./ReplacementPart";

import { MODEL_PATH } from "./carEnvironment.constants";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function enableShadow(model) {
  model.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
}

export default function CarModel({ onBoundsCalculated, customization }) {
  const { scene, animations, parser } = useGLTF(MODEL_PATH);
  console.log("animations:=", animations);

  const groupRef = useRef(null);
  const [activeAnimation, setActiveAnimation] = useState(null);

  const { scene: globalScene } = useThree();
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

  useLayoutEffect(() => {
    enableShadow(model);
    const group = groupRef.current;

    if (!group) return;

    group.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(group, true);

    if (box.isEmpty()) return;

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    onBoundsCalculated({
      bottomY: box.min.y,
      centerX: center.x,
      centerY: center.y,
      centerZ: center.z,
      size: size.toArray(),
      shadowSize: Math.max(size.x, size.z, 1) * 1.5,
    });
  }, [model, onBoundsCalculated]);

  // Play selected animation
  // const playAnimation = (name) => {
  //   console.log("hai");
  //   mixer.stopAllAction();

  //   const action = actions[name];

  //   if (!action) return;

  //   action.reset();
  //   action.setLoop(THREE.LoopOnce, 1);
  //   action.clampWhenFinished = true;
  //   action.play();

  //   setActiveAnimation(name);
  // };

  // // Stop all animations
  // const stopAnimation = () => {
  //   mixer.stopAllAction();
  //   setActiveAnimation(null);
  // };

  // // Register model animations
  useEffect(() => {
    const hasAnimations = names.length > 0;

    if (!hasAnimations) return;

    registerModelAnimations("base", actions, names, mixer);

    return () => {
      unregisterModelAnimations("base");
      mixer.stopAllAction();
    };
  }, [
    "base",
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

    registerModelVariants("basecar_varients", model, variants, applyVariant);

    return () => {
      unregisterModelVariants("basecar_varients");
    };
  }, [
    "basecar_varients",
    model,
    variants,
    parser,
    registerModelVariants,
    unregisterModelVariants,
  ]);

  // Apply selected variant to the cloned model
  const applyVariant = async (variantIndex) => {
    const tasks = [];

    model.traverse((object) => {
      if (!object.isMesh) return;

      const meshExtension =
        object.userData.gltfExtensions?.KHR_materials_variants;

      if (!meshExtension) return;

      // Store the original material only once
      if (!object.userData.originalMaterial) {
        object.userData.originalMaterial = object.material;
      }

      // Find the material mapping for this variant
      const mapping = meshExtension.mappings.find((item) =>
        item.variants.includes(variantIndex)
      );

      if (mapping) {
        tasks.push(
          parser
            .getDependency("material", mapping.material)
            .then((material) => {
              object.material = material;
              parser.assignFinalMaterial(object);
            })
        );
      } else {
        // Restore original material if no mapping exists
        object.material = object.userData.originalMaterial;
      }
    });

    await Promise.all(tasks);
  };

  // const getMaterialVariants = () => {
  //   const extension =
  //     parser.json.extensions?.KHR_materials_variants;

  //   if (!extension) {
  //     console.log("No material variants found");
  //     return [];
  //   }

  //   return extension.variants.map((variant, index) => ({
  //     index,
  //     name: variant.name,
  //   }));
  // };

  // const variants = getMaterialVariants();

  // console.log("All Material Variants=====:", variants);

  const steeringPath = `${SERVER_URL}/${customization.steering?.modelPath}`;

  const tyrePath = `${SERVER_URL}/${customization.tyre?.modelPath}`;

  const spoilerPath = `${SERVER_URL}/${customization.spoiler?.modelPath}`;

  const rearBumperPath = `${SERVER_URL}/${customization.rearBumper?.modelPath}`;

  const frontBumperPath = `${SERVER_URL}/${customization.frontBumper?.modelPath}`;

  return (
    <>
      {/* <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        scale={[0.3, 0.3, 0.3]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>

      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#ff0000" roughness={0.4} metalness={0.1} />
      </mesh> */}

      <group ref={groupRef}>
        {/* Original car body with original parts hidden */}
        <primitive object={model} />

        {/* Replacement steering wheel */}
        {steeringPath && (
          <ReplacementPart
            key={steeringPath}
            path={steeringPath}
            partId="steering"
          />
        )}

        {/* Replacement tyres: four copies of one tyre GLB */}
        {tyrePath && (
          <ReplacementPart key={tyrePath} path={tyrePath} partId="tyre" />
        )}

        {/* Replacement spoiler: four copies of one tyre GLB */}
        {spoilerPath && (
          <ReplacementPart
            key={spoilerPath}
            path={spoilerPath}
            partId="spoiler"
          />
        )}

        {/* Replacement rearBumper: four copies of one tyre GLB */}
        {rearBumperPath && (
          <ReplacementPart
            key={rearBumperPath}
            path={rearBumperPath}
            partId="rearBumper"
          />
        )}

        {/* Replacement frontBumper: four copies of one tyre GLB */}
        {frontBumperPath && (
          <ReplacementPart
            key={frontBumperPath}
            path={frontBumperPath}
            partId="frontBumper"
          />
        )}
      </group>

      {/* Animation UI */}
      {/* <Html fullscreen>
        <div className="animation-panel">
          <h3>Model Animations</h3>

          {names.length === 0 ? (
            <p>No animations found</p>
          ) : (
            names.map((name) => (
              <button
                key={name}
                onClick={() => playAnimation(name)}
                className={activeAnimation === name ? "active" : ""}
              >
                ▶ {name}
              </button>
            ))
          )}

          <button onClick={stopAnimation}>■ Stop</button>
        </div>
      </Html> */}
    </>
  );
}

useGLTF.preload(MODEL_PATH);
