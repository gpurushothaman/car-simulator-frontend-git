
"use client";

import { useState } from "react";
import { Html } from "@react-three/drei";
import { useSceneVariant } from "./SceneVariantContext";
import { useSceneAnimation } from "./SceneAnimationContext";

export default function CustomizationUI() {
  const {
    variantRegistry,
    selectModelVariant,
    selectGlobalVariant,
  } = useSceneVariant();

  const {
    animationRegistry,
    playSceneAnimation,
  } = useSceneAnimation();

  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  const baseModel = variantRegistry.basecar_varients;
  const variants = baseModel?.variants ?? [];

  const allNames = Object.values(animationRegistry).flatMap(
    ({ names }) => names
  );

  const hasOpen = allNames.some((name) =>
    name.toLowerCase().includes("open")
  );

  const hasClose = allNames.some((name) =>
    name.toLowerCase().includes("close")
  );

  if (variants.length === 0) return null;

  return (
    <Html fullscreen pointerEvents="none" zIndexRange={[101, 101]}>
      <div
        className={`animation-panel-shell ${
          isMaterialsOpen ? "is-open" : "is-closed"
        }`}
      >
        {/* LEFT SIDE TOGGLE */}

        <button
          type="button"
          className="animation-panel-toggle"
          onClick={() => setIsMaterialsOpen((prev) => !prev)}
          aria-label={
            isMaterialsOpen ? "Close car materials" : "Open car materials"
          }
          aria-expanded={isMaterialsOpen}
        >
          <span className="animation-toggle-arrow">
            {isMaterialsOpen ? "‹" : "›"}
          </span>
        </button>

        {/* CAR MATERIALS PANEL */}

        {isMaterialsOpen && (
          <div className="animation-panel">

            {/* HEADER WITH OPEN / CLOSE ICONS */}

            <div className="animation-panel-header">

              <h3 className="animation-panel-title">
                Car Materials
              </h3>

              <div className="scene-controls-panel">

                {/* CAR OPEN */}

                <button
                  type="button"
                  className="scene-icon-button"
                  disabled={!hasOpen}
                  onClick={() => playSceneAnimation("open")}
                  aria-label="Open car"
                  title="Open car"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 13l2-5h14l2 5" />
                    <path d="M3 13h18v6H3z" />
                    <path d="M6 19v2M18 19v2" />
                    <path d="M12 8V4h6v5" />
                    <path d="M18 9l3 2" />
                    <circle cx="7" cy="16" r="1" />
                    <circle cx="17" cy="16" r="1" />
                  </svg>
                </button>

                {/* CAR CLOSE */}

                <button
                  type="button"
                  className="scene-icon-button"
                  disabled={!hasClose}
                  onClick={() => playSceneAnimation("close")}
                  aria-label="Close car"
                  title="Close car"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 13l2-5h14l2 5" />
                    <path d="M3 13h18v6H3z" />
                    <path d="M6 19v2M18 19v2" />
                    <path d="M7 8V5h10v3" />
                    <path d="M7 8h10" />
                    <circle cx="7" cy="16" r="1" />
                    <circle cx="17" cy="16" r="1" />
                  </svg>
                </button>

              </div>
            </div>

            {/* MATERIAL LIST */}

            <div className="animation-material-list">
              {variants.map((variant) => (
                <button
                  key={`${variant.index}-${variant.name}`}
                  type="button"
                  className={`animation-material-button ${
                    baseModel.selectedVariant === variant.name
                      ? "active"
                      : ""
                  }`}
                  aria-pressed={
                    baseModel.selectedVariant === variant.name
                  }
                  onClick={() => {
                    void selectModelVariant(
                      "basecar_varients",
                      variant.name
                    );

                    void selectGlobalVariant(variant.name);
                  }}
                >
                  <span className="material-button-indicator" />

                  <span className="material-button-label">
                    {variant.name}
                  </span>
                </button>
              ))}
            </div>

          </div>
        )}
      </div>
    </Html>
  );
}
