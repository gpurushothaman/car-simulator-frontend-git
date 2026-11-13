"use client";

import * as THREE from "three";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";

import ReplacementPart from "./ReplacementPart";

import {
  MODEL_PATH,
  MODEL_SCALE,
  MODEL_ROTATION,
} from "./carEnvironment.constants";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;





function hideOriginalParts(model) {
  model.traverse((object) => {
    const name = object.name.toLowerCase();

    // Change these checks to match your actual GLB mesh names.
    if (
      name.includes("steering") ||
      name.includes("steeringwheel") ||
      name === "steering_wheel"
    ) {
      console.log("name:=", object.name);
      object.visible = false;
    }

    if (
      name.includes("tyre") ||
      name.includes("tire") ||
      name.includes("wheel")
    ) {
      console.log("name:=", object.name);
      object.visible = false;
    }

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
    hideOriginalParts(model);

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

  return (
<>
    {/* <mesh
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 0, 0]}
   receiveShadow
   scale={[0.3,0.3,0.3]}
 >
   <planeGeometry args={[20, 20]} />
   <meshStandardMaterial
     color="#ff0000"
    
   />
 </mesh> 

 <mesh position={[0, 0, 0]} castShadow receiveShadow>
  <sphereGeometry args={[1, 32, 32]} />
  <meshStandardMaterial
    color="#ff0000"
    roughness={0.4}
    metalness={0.1}
  />
</mesh> */}

 <group ref={groupRef} >
    {/* <group ref={groupRef} scale={MODEL_SCALE} rotation={MODEL_ROTATION}> */}
      {/* Original car body with original parts hidden */}
      <primitive object={model} />




      {/* Replacement steering wheel */}
      {steeringPath && (
        <ReplacementPart
          key={steeringPath}
          path={steeringPath}
          // position={[0, 0, 0]}
          // rotation={[0, 0, 0]}
          // scale={1}
        />
      )}

      {/* Replacement tyres: four copies of one tyre GLB */}
      {tyrePath && (
        <ReplacementPart
          key={`${tyrePath}`}
          path={tyrePath}
          // position={position}
          // rotation={[
          //   0,
          //   index % 2 === 0 ? 0 : Math.PI,
          //   Math.PI / 2,
          // ]}
          // scale={1}
        />
      )}
    </group>
    </>
  );
}

useGLTF.preload(MODEL_PATH);

// Object.values(STEERING_MODELS).forEach((path) => {
//   useGLTF.preload(path);
// });

// Object.values(TYRE_MODELS).forEach((path) => {
//   useGLTF.preload(path);
// });
