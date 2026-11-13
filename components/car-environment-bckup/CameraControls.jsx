"use client";

import { OrbitControls } from "@react-three/drei";

export default function CameraControls({ modelBounds }) {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enableRotate
      enableZoom
      enablePan={false}
      minDistance={4}
      maxDistance={18}
      minPolarAngle={Math.PI / 3.5}
      maxPolarAngle={Math.PI / 2}
      target={[
        modelBounds?.centerX ?? 0,
        modelBounds?.centerY ?? 0,
        modelBounds?.centerZ ?? 0,
      ]}
    />
  );
}