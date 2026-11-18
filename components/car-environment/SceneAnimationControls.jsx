"use client";

import { Html } from "@react-three/drei";
import { useSceneAnimation } from "./SceneAnimationContext";

export default function SceneAnimationControls() {
  const { animationRegistry, playSceneAnimation, stopSceneAnimations } =
    useSceneAnimation();

  const allNames = Object.values(animationRegistry).flatMap(({ names }) => names);
  const hasOpen = allNames.some((name) => name.toLowerCase().includes("open"));
  const hasClose = allNames.some((name) => name.toLowerCase().includes("close"));

  return (
    <Html fullscreen>
      <div className="animation-panel">
        <button
          type="button"
          disabled={!hasOpen}
          onClick={() => playSceneAnimation("open")}
        >
          Open All
        </button>
        <button
          type="button"
          disabled={!hasClose}
          onClick={() => playSceneAnimation("close")}
        >
          Close All
        </button>
        <button type="button" onClick={stopSceneAnimations}>
          Stop
        </button>
      </div>
    </Html>
  );
}
