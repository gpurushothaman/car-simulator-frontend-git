"use client";
import { Html } from "@react-three/drei";
import { useSceneVariant } from "./SceneVariantContext";

export default function CustomizationUI() {
  const { variantRegistry, selectModelVariant, selectGlobalVariant } =
    useSceneVariant();

  const spoiler = variantRegistry["spoiler"];
  console.log("spoil:=", variantRegistry);

  return (
    <Html fullscreen>
      <div className="animation-panel">
        <h3>Spoiler Materials</h3>

        {spoiler?.variants.map((variant) => (
          <button
            key={variant.name}
            onClick={() => {
              selectModelVariant("spoiler", variant.name);
              selectModelVariant("basecar_varients", variant.name);
              selectModelVariant("frontBumper", variant.name);
              //selectGlobalVariant(variant.name);
            }}
          >
            {variant.name}
          </button>
        ))}
      </div>
    </Html>
  );
}
