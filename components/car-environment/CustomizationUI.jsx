"use client";

import { Html } from "@react-three/drei";
import { useSceneVariant } from "./SceneVariantContext";

export default function CustomizationUI() {
  const { variantRegistry, selectModelVariant, selectGlobalVariant } = useSceneVariant();
  const baseModel = variantRegistry.basecar_varients;
  const variants = baseModel?.variants ?? [];

  if (variants.length === 0) return null;

  return (
    <Html fullscreen>
      <div className="animation-panel">
        <h3>Car Materials</h3>
        {variants.map((variant) => (
          <button
            key={`${variant.index}-${variant.name}`}
            type="button"
            aria-pressed={baseModel.selectedVariant === variant.name}
            onClick={() => {
              // Apply this variant to the base car only. Seat/part variants
              // registered under other model IDs remain independent.
              void selectModelVariant("basecar_varients", variant.name);
              void selectGlobalVariant(variant.name);
            }}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </Html>
  );
}
