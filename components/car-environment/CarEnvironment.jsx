"use client";

import * as THREE from "three";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";

import CarModel from "./CarModel";
import StudioLighting from "./StudioLighting";
import StudioEnvironment from "./StudioEnvironment";
import CarShadows from "./CarShadows";
import CameraControls from "./CameraControls";
import ShadowColorPicker from "./ShadowColorPicker";
import CarCustomization from "./CarCustomization";
import {
  SceneAnimationProvider,
} from "./SceneAnimationContext";
import SceneAnimationControls from "./SceneAnimationControls";
import { SceneVariantProvider } from "./SceneVariantContext";
import CustomizationUI from "./CustomizationUI";

import {
  CAMERA_CONFIG,
  RENDERER_CONFIG,
  DEFAULT_SHADOW_COLOR,
} from "./carEnvironment.constants";

import {
  carCustomizationReducer,
  INITIAL_CAR_CUSTOMIZATION_STATE,
} from "@/components/redux/carCustomization";
import { setInitialCustomization } from "@/components/redux/carCustomization/actions";

function getDefaultValue(options, fallback) {
  if (!Array.isArray(options) || options.length === 0) return fallback;
  return options.find((item) => item?.default) ?? options[0];
}

// Parent components may recreate optionsData on every render. Build a stable
// key from the available part choices so a random bumper selection does not
// accidentally reinitialize every customization back to its defaults.
function getOptionsDataKey(data) {
  if (!data) return "";
  const getIds = (items) =>
    (Array.isArray(items) ? items : []).map(
      (item) => item?._id ?? item?.id ?? item?.modelPath ?? item?.path ?? ""
    );
  return JSON.stringify({
    tyres: getIds(data.tyres),
    steering: getIds(data.steering),
    spoiler: getIds(data.spoiler),
    rearbumper: getIds(data.rearbumper),
    frontbumper: getIds(data.frontbumper),
  });
}

export default function CarEnvironment({ optionsData }) {
  const [customization, dispatch] = useReducer(
    carCustomizationReducer,
    INITIAL_CAR_CUSTOMIZATION_STATE
  );
  const [modelBounds, setModelBounds] = useState(null);
  const [shadowColor, setShadowColor] = useState(DEFAULT_SHADOW_COLOR);
  const initializedOptionsKeyRef = useRef(null);
  const optionsDataKey = getOptionsDataKey(optionsData);

  useEffect(() => {
    if (!optionsData) return;
    if (initializedOptionsKeyRef.current === optionsDataKey) return;
    initializedOptionsKeyRef.current = optionsDataKey;

    dispatch(
      setInitialCustomization({
        tyre: getDefaultValue(optionsData.tyres, INITIAL_CAR_CUSTOMIZATION_STATE.tyre),
        steering: getDefaultValue(optionsData.steering, INITIAL_CAR_CUSTOMIZATION_STATE.steering),
        spoiler: getDefaultValue(optionsData.spoiler, INITIAL_CAR_CUSTOMIZATION_STATE.spoiler),
        rearBumper: getDefaultValue(optionsData.rearbumper, INITIAL_CAR_CUSTOMIZATION_STATE.rearBumper),
        frontBumper: getDefaultValue(optionsData.frontbumper, INITIAL_CAR_CUSTOMIZATION_STATE.frontBumper),
        customizationData: optionsData,
      })
    );
  }, [optionsData, optionsDataKey]);

  const handleBoundsCalculated = useCallback((bounds) => {
    setModelBounds((previous) => {
      if (
        previous &&
        previous.bottomY === bounds.bottomY &&
        previous.centerX === bounds.centerX &&
        previous.centerY === bounds.centerY &&
        previous.centerZ === bounds.centerZ &&
        previous.shadowSize === bounds.shadowSize
      ) {
        return previous;
      }
      return bounds;
    });
  }, []);

  const handleShadowColorChange = useCallback((color) => {
    setShadowColor(color);
  }, []);

  return (
    <div style={{ width: "100%",height: "auto",minHeight: 0, background: "#f8fafc" }}>
      <div style={{ width: "100%", height: "85vh", minHeight: 450, position: "relative" }}>
        <SceneAnimationProvider>
          <SceneVariantProvider>
            <Canvas
              shadows
              camera={CAMERA_CONFIG}
              dpr={[1, 2]}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: "high-performance",
                ...RENDERER_CONFIG,
              }}
              onCreated={({ gl, scene }) => {
                gl.toneMapping = RENDERER_CONFIG.toneMapping;
                gl.toneMappingExposure = RENDERER_CONFIG.toneMappingExposure;
                gl.outputColorSpace = RENDERER_CONFIG.outputColorSpace;
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
                scene.background = new THREE.Color("#eeeeee");
              }}
            >
              <StudioLighting />
              <CarModel
                onBoundsCalculated={handleBoundsCalculated}
                customization={customization}
              />
              <CarShadows modelBounds={modelBounds} shadowColor={shadowColor} />
              <StudioEnvironment />              
              <CameraControls modelBounds={modelBounds} />
              <CustomizationUI />
              {/* <SceneAnimationControls /> */}
            </Canvas>
          </SceneVariantProvider>
        </SceneAnimationProvider>

        {/* <ShadowColorPicker
          shadowColor={shadowColor}
          onShadowColorChange={handleShadowColorChange}
        /> */}
      </div>

      <CarCustomization customization={customization} dispatch={dispatch} />
    </div>
  );
}
