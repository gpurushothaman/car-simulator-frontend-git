"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

export default function ReplacementPart({
  path,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const { scene } = useGLTF(path);

  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;
    });

    return clone;
  }, [scene]);

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <primitive object={model} />
    </group>
  );
}