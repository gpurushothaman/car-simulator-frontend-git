
"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { useSceneAnimation } from "./SceneAnimationContext";

export default function SceneAnimationControls() {
  const {
    animationRegistry,
    playSceneAnimation,
    stopSceneAnimations,
  } = useSceneAnimation();

  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const allNames = Object.values(animationRegistry).flatMap(
    ({ names }) => names
  );

  const hasOpen = allNames.some((name) =>
    name.toLowerCase().includes("open")
  );

  const hasClose = allNames.some((name) =>
    name.toLowerCase().includes("close")
  );

  return (
   <Html fullscreen pointerEvents="none" zIndexRange={[100, 100]}>
      <div
        className={`scene-controls-shell ${
          isControlsOpen ? "is-open" : "is-closed"
        }`}
      >
        {/* RIGHT SIDE ARROW */}

        <button
          type="button"
          className="scene-controls-toggle"
          onClick={() => setIsControlsOpen((prev) => !prev)}
          aria-label={
            isControlsOpen
              ? "Close animation controls"
              : "Open animation controls"
          }
          aria-expanded={isControlsOpen}
        >
          <span className="scene-controls-arrow">
            {isControlsOpen ? "›" : "‹"}
          </span>
        </button>

        {/* ANIMATION CONTROLS */}

        {isControlsOpen && (
          <div className="scene-controls-panel">

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

            <button
              type="button"
              onClick={stopSceneAnimations}
            >
              Stop
            </button>

          </div>
        )}
      </div>
    </Html>
  );
}
