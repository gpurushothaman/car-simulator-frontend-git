"use client";

import * as THREE from "three";
import { useCallback, useReducer, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import CarModel from "./CarModel";
import StudioLighting from "./StudioLighting";
import StudioEnvironment from "./StudioEnvironment";
import CarShadows from "./CarShadows";
import CameraControls from "./CameraControls";
import ShadowColorPicker from "./ShadowColorPicker";
import CarCustomization from "./CarCustomization";

import {
  CAMERA_CONFIG,
  RENDERER_CONFIG,
  DEFAULT_SHADOW_COLOR,
} from "./carEnvironment.constants";

import {
  carCustomizationReducer,
  INITIAL_CAR_CUSTOMIZATION_STATE,
} from "@/components/redux/carCustomization";

import {
    setInitialCustomization,
  } from "@/components/redux/carCustomization/actions";

function getDefaultValue(options, fallback) {
  if (!Array.isArray(options) || options.length === 0) {
    return fallback;
  }

  const selected = options.find((item) => item.default);

  return (selected ?? options[0]);
}

export default function CarEnvironment({ optionsData }) {
    console.log("data:=",optionsData)
  const [modelBounds, setModelBounds] = useState(null);

  const [shadowColor, setShadowColor] = useState(DEFAULT_SHADOW_COLOR);

  useEffect(() => {
    if (!optionsData) return;

    dispatch(
      setInitialCustomization({
        tyre: getDefaultValue(
          optionsData.tyres,
          INITIAL_CAR_CUSTOMIZATION_STATE.tyre
        ),

        steering: getDefaultValue(
          optionsData.steering,
          INITIAL_CAR_CUSTOMIZATION_STATE.steering
        ),

        spoiler: getDefaultValue(
          optionsData.spoiler,
          INITIAL_CAR_CUSTOMIZATION_STATE.spoiler
        ),

        rearBumper: getDefaultValue(
          optionsData.rearbumper,
          INITIAL_CAR_CUSTOMIZATION_STATE.rearBumper
        ),

        frontBumper: getDefaultValue(
          optionsData.frontbumper,
          INITIAL_CAR_CUSTOMIZATION_STATE.frontBumper
        ),

        customizationData : optionsData
      })
    );
  }, [optionsData]);

  const [customization, dispatch] = useReducer(
    carCustomizationReducer,
    INITIAL_CAR_CUSTOMIZATION_STATE
  );

  const handleBoundsCalculated = useCallback((bounds) => {
    setModelBounds(bounds);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* 3D viewer */}
      <div
        style={{
          width: "100%",
          height: "70vh",
          minHeight: 450,
          position: "relative",
        }}
      >
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
            gl.toneMapping = THREE.LinearToneMapping;
            gl.toneMappingExposure = 1.0;
            gl.outputColorSpace = THREE.SRGBColorSpace;
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
        </Canvas>

        <ShadowColorPicker
          shadowColor={shadowColor}
          onShadowColorChange={setShadowColor}
        />
      </div>

      {/* Customization UI below Canvas */}
      <CarCustomization customization={customization} dispatch={dispatch} />
    </div>
  );
}
