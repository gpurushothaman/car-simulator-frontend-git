"use client";

import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";

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
  const { scene } = useGLTF(MODEL_PATH);

  const groupRef = useRef(null);

  const model = useMemo(() => {
    return scene.clone(true);
  }, [scene]);

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
          <ReplacementPart  path={steeringPath} />
        )}

        {/* Replacement tyres: four copies of one tyre GLB */}
        {tyrePath && <ReplacementPart  path={tyrePath} />}

        {/* Replacement spoiler: four copies of one tyre GLB */}
        {spoilerPath && <ReplacementPart  path={spoilerPath} />}

        {/* Replacement rearBumper: four copies of one tyre GLB */}
        {rearBumperPath && <ReplacementPart path={rearBumperPath} />}

        {/* Replacement frontBumper: four copies of one tyre GLB */}
        {frontBumperPath && <ReplacementPart path={frontBumperPath} />}
      </group>
    </>
  );
}

useGLTF.preload(MODEL_PATH);
