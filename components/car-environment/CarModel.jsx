"use client";

import * as THREE from "three";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { useSceneAnimation } from "./SceneAnimationContext";
import { useSceneVariant } from "./SceneVariantContext";
import ReplacementPart from "./ReplacementPart";
import { MODEL_PATH } from "./carEnvironment.constants";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function enableShadow(model) {
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });
}

function getModelUrl(modelPath) {
  if (typeof modelPath !== "string" || !modelPath.trim()) return null;
  const path = modelPath.trim();

  if (/^https?:\/\//i.test(path)) return path;
  if (!SERVER_URL) {
    console.error("NEXT_PUBLIC_SERVER_URL is not configured; cannot load replacement model:", path);
    return null;
  }

  return `${SERVER_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

export default function CarModel({ onBoundsCalculated, customization }) {
  const { scene, animations, parser } = useGLTF(MODEL_PATH);
  const groupRef = useRef(null);
  const variantRequestRef = useRef(0);
  const { invalidate } = useThree();

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
    const requestId = ++variantRequestRef.current;
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
          // Ignore stale async results if a newer variant was selected.
          if (requestId !== variantRequestRef.current) return;
          object.material = material;
          parser.assignFinalMaterial(object);
        })
      );
    });

    await Promise.all(tasks);
    if (requestId === variantRequestRef.current) invalidate();
  }, [model, parser, invalidate]);

  useLayoutEffect(() => {
    enableShadow(model);
    const group = groupRef.current;
    if (!group) return;

    group.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(group, true);
    if (bounds.isEmpty()) return;

    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    onBoundsCalculated({
      bottomY: bounds.min.y,
      centerX: center.x,
      centerY: center.y,
      centerZ: center.z,
      size: size.toArray(),
      shadowSize: Math.max(size.x, size.z, 1) * 1.5,
    });
  }, [model, onBoundsCalculated]);

  useEffect(() => {
    if (!names.length) return undefined;

    registerModelAnimations("base", actions, names, mixer);
    return () => {
      unregisterModelAnimations("base");
      mixer.stopAllAction();
    };
  }, [
    actions,
    names,
    mixer,
    registerModelAnimations,
    unregisterModelAnimations,
  ]);

  useEffect(() => {
    if (!variants.length) return undefined;

    registerModelVariants("basecar_varients", model, variants, applyVariant);
    return () => unregisterModelVariants("basecar_varients");
  }, [
    variants,
    model,
    applyVariant,
    registerModelVariants,
    unregisterModelVariants,
  ]);

  const steeringPath = getModelUrl(customization?.steering?.modelPath);
  const tyrePath = getModelUrl(customization?.tyre?.modelPath);
  const spoilerPath = getModelUrl(customization?.spoiler?.modelPath);
  const rearBumperPath = getModelUrl(customization?.rearBumper?.modelPath);
  const frontBumperPath = getModelUrl(customization?.frontBumper?.modelPath);

  return (
    <group ref={groupRef}>
      <primitive object={model} />

      {steeringPath && (
        <ReplacementPart key={`steering-${steeringPath}`} path={steeringPath} partId="steering" />
      )}
      {tyrePath && (
        <ReplacementPart key={`tyre-${tyrePath}`} path={tyrePath} partId="tyre" />
      )}
      {spoilerPath && (
        <ReplacementPart key={`spoiler-${spoilerPath}`} path={spoilerPath} partId="spoiler" />
      )}
      {rearBumperPath && (
        <ReplacementPart key={`rearBumper-${rearBumperPath}`} path={rearBumperPath} partId="rearBumper" />
      )}
      {frontBumperPath && (
        <ReplacementPart key={`frontBumper-${frontBumperPath}`} path={frontBumperPath} partId="frontBumper" />
      )}
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
