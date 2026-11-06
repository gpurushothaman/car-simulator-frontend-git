import * as THREE from "three";

export const MODEL_PATH = "/Car.glb";

export const SHADOW_GAP = 0.02;

export const CAMERA_CONFIG = {
  position: [5, 2.5, 10],
  fov: 35,
  near: 0.1,
  far: 1000,
};

export const RENDERER_CONFIG = {
  toneMapping: THREE.LinearToneMapping,
  toneMappingExposure: 1.0,
  outputColorSpace: THREE.SRGBColorSpace,
};

export const DEFAULT_SHADOW_COLOR = "#e5edff";
