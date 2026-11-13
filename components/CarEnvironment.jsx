"use client";

import * as THREE from "three";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";

const MODEL_PATH = "/Car.glb";
const MODEL_SCALE = 1.6;
const MODEL_ROTATION = [0, Math.PI / 5, 0];
const SHADOW_GAP = 0.02;

// Main viewer
export default function CarEnvironment({ optionsData }) {
  console.log("optionsData", optionsData);
  const [modelBounds, setModelBounds] = useState(null);
  const [shadowColor, setShadowColor] = useState("#e5edff");
  const handleBoundsCalculated = useCallback((bounds) => {
    setModelBounds(bounds);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        shadows
        camera={{
          position: [5, 2.5, 10],
          fov: 35,
          near: 0.1,
          far: 1000,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: THREE.LinearToneMapping,
          toneMappingExposure: 0.85,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.LinearToneMapping;
          gl.toneMappingExposure = 0.85;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = new THREE.Color("#eeeeee");
        }}
      >
        {/* Studio lighting */}
        <ambientLight intensity={0.3} />

        <directionalLight
          position={[5, 8, 6]}
          intensity={2}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        <directionalLight
          position={[-6, 4, -4]}
          intensity={0.65}
          color="#ffffff"
        />

        {/* Car and automatic bounds */}
        <CarModel onBoundsCalculated={handleBoundsCalculated} />

        {/* Shadow automatically positioned beneath the model */}
        {modelBounds && (
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
            color="#000000"
          >
            <RandomizedLight
              amount={6}
              radius={5}
              ambient={0.35}
              intensity={1}
              position={[4, 6, 4]}
              bias={0.0001}
            />
          </AccumulativeShadows>
        )}

        {/* Studio reflections */}
        <Environment resolution={512}>
          <Lightformer
            form="rect"
            intensity={1.5}
            color="#ffffff"
            position={[0, 5, -2]}
            rotation-x={Math.PI / 2}
            scale={[9, 7, 1]}
          />

          <Lightformer
            form="rect"
            intensity={2}
            color="#ffffff"
            position={[-5, 1.5, 0]}
            rotation-y={Math.PI / 2}
            scale={[8, 3, 1]}
          />

          <Lightformer
            form="rect"
            intensity={1.6}
            color="#ffffff"
            position={[5, 1.5, 0]}
            rotation-y={-Math.PI / 2}
            scale={[8, 3, 1]}
          />

          <Lightformer
            form="rect"
            intensity={1.1}
            color="#ffffff"
            position={[0, 2, 6]}
            scale={[6, 4, 1]}
          />

          <Lightformer
            form="rect"
            intensity={1.4}
            color="#ffffff"
            position={[0, 2, -6]}
            rotation-y={Math.PI}
            scale={[7, 4, 1]}
          />
        </Environment>

        {/* Interactive camera */}
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
      </Canvas>
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderRadius: 12,
          background: "rgba(25, 25, 25, 0.9)",
          color: "#fff",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        <label htmlFor="shadow-color" style={{ fontSize: 14, fontWeight: 600 }}>
          Shadow Color
        </label>

        <input
          id="shadow-color"
          type="color"
          value={shadowColor}
          onChange={(event) => setShadowColor(event.target.value)}
          style={{
            width: 42,
            height: 36,
            padding: 2,
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            background: "transparent",
          }}
        />

        <span
          style={{
            fontSize: 12,
            color: "#ddd",
            minWidth: 70,
          }}
        >
          {shadowColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// Car model and automatic world-space bounds
function CarModel({ onBoundsCalculated }) {
  const { scene } = useGLTF(MODEL_PATH);

  // Clone so the original cached GLB scene is not transformed directly.
  const model = useMemo(() => scene.clone(true), [scene]);

  const boundsGroupRef = useMemo(() => ({ current: null }), []);

  useLayoutEffect(() => {
    if (!boundsGroupRef.current) return;

    const group = boundsGroupRef.current;

    group.updateMatrixWorld(true);

    // Calculate bounds including scale, rotation and position.
    const box = new THREE.Box3().setFromObject(group, true);

    if (box.isEmpty()) return;

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Enable shadows and preserve the original materials.
    model.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;
    });

    const shadowSize = Math.max(size.x, size.z, 1) * 1.5;

    onBoundsCalculated({
      bottomY: box.min.y,
      centerX: center.x,
      centerY: center.y,
      centerZ: center.z,
      size: size.toArray(),
      shadowSize,
    });
  }, [model, onBoundsCalculated, boundsGroupRef]);

  return (
    <group
      ref={(node) => {
        boundsGroupRef.current = node;
      }}
      scale={MODEL_SCALE}
      rotation={MODEL_ROTATION}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
