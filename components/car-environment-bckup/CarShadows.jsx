"use client";

import {
  AccumulativeShadows,
  RandomizedLight,
} from "@react-three/drei";

import { SHADOW_GAP } from "./carEnvironment.constants";

export default function CarShadows({
  modelBounds,
  shadowColor,
}) {
  console.log(modelBounds)
  if (!modelBounds) return null;

  return (
    <AccumulativeShadows
      key={`${modelBounds.bottomY}-${modelBounds.shadowSize}`}
      position={[
        modelBounds.centerX,
        modelBounds.bottomY - SHADOW_GAP,
        modelBounds.centerZ,
      ]}
      scale={modelBounds.shadowSize}

   
      frames={60}
      alphaTest={0.1}
      opacity={0.65}
      color={shadowColor}
    >
      <RandomizedLight
        amount={6}
        radius={5}
        ambient={0.35}
        intensity={1}
        position={[0, 6, 0]}
        bias={0.0001}
      />
    </AccumulativeShadows>
  );
}