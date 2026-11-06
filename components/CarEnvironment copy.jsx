"use client";

import * as THREE from "three";
import { useLayoutEffect, useRef, useState } from "react";
import {
  Canvas,
  applyProps,
  useFrame,
} from "@react-three/fiber";
import {
  PerformanceMonitor,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  Lightformer,
  Float,
  useGLTF,
  OrbitControls
} from "@react-three/drei";
import { LayerMaterial, Color, Depth } from "lamina";

// Load the GLB from the public folder.
const porscheModel = "/Car.glb";

export default function CarViewer() {
  const [degraded, setDegraded] = useState(false);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas
        shadows
        camera={{ position: [5, 0, 15], fov: 30 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <spotLight
          position={[0, 15, 0]}
          angle={0.3}
          penumbra={1}
          castShadow
          intensity={2 * Math.PI}
          decay={0}
          shadow-bias={-0.0001}
        />

        <ambientLight intensity={0.5 * Math.PI} />

        <Porsche
          scale={1.6}
          position={[-0.5, -0.18, 0]}
          rotation={[0, Math.PI / 5, 0]}
        />

        <AccumulativeShadows
          position={[0, -1.16, 0]}
          frames={100}
          alphaTest={0.4}
          scale={10}
        >
          <RandomizedLight
            amount={8}
            radius={10}
            ambient={0.5}
            position={[1, 5, -1]}
          />
        </AccumulativeShadows>

        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
        />

        <Environment
          frames={degraded ? 1 : Infinity}
          resolution={256}
          background
          blur={1}
        >
          <Lightformers />
        </Environment>

        <CameraRig />

        <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enableRotate
      enableZoom
      enablePan={false}
      minDistance={5}
      maxDistance={20}
      minPolarAngle={Math.PI / 3.5}
      maxPolarAngle={Math.PI / 2}
      target={[0, 0, 0]}
    />
      </Canvas>
    </div>
  );
}

/**
 * Porsche 911 Carrera 4S
 * Original model attribution:
 * Karol Miklas — Sketchfab
 * License: CC-BY-SA-4.0
 */

function useSceneEnvironment() {
  const [environment, setEnvironment] = useState(null);

  useFrame(({ scene }) => {
    if (scene.environment !== environment) {
      setEnvironment(scene.environment);
    }
  });

  return environment;
}

function Porsche(props) {
  const { scene, nodes, materials } = useGLTF(porscheModel);
  const environment = useSceneEnvironment();

  useLayoutEffect(() => {
    Object.values(nodes).forEach((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    // applyProps(materials.rubber, {
    //   color: "#222",
    //   roughness: 0.6,
    //   roughnessMap: null,
    //   normalScale: [4, 4],
    // });

    // applyProps(materials.window, {
    //   color: "black",
    //   roughness: 0,
    //   clearcoat: 0.1,
    // });

    // applyProps(materials.coat, {
    //   envMap: environment,
    //   envMapIntensity: 4,
    //   roughness: 0.5,
    //   metalness: 1,
    // });

    // applyProps(materials.paint, {
    //   envMap: environment,
    //   envMapIntensity: 2,
    //   roughness: 0.45,
    //   metalness: 0.8,
    //   color: "#555",
    // });
  }, [nodes, materials, environment]);

  return <primitive object={scene} {...props} />;
}

function CameraRig() {
  const target = useRef(new THREE.Vector3());

  // useFrame((state) => {
  //   const t = state.clock.elapsedTime;

  //   state.camera.position.lerp(
  //     target.current.set(
  //       Math.sin(t / 5),
  //       0,
  //       12 + Math.cos(t / 5) / 2
  //     ),
  //     0.05
  //   );

  //   state.camera.lookAt(0, 0, 0);
  // });

  return null;
}

function Lightformers({
  positions = [2, 0, 2, 0, 2, 0, 2, 0],
}) {
  const group = useRef(null);

  // useFrame((state, delta) => {
  //   if (!group.current) return;

  //   group.current.position.z += delta * 10;

  //   if (group.current.position.z > 20) {
  //     group.current.position.z = -60;
  //   }
  // });

  return (
    <>
      {/* Ceiling reflection */}
      <Lightformer
        intensity={0.75}
        rotation-x={Math.PI / 2}
        position={[0, 5, -9]}
        scale={[10, 10, 1]}
      />

      {/* Moving studio lights */}
      {/* <group rotation={[0, 0.5, 0]}>
        <group ref={group}>
          {positions.map((x, i) => (
            <Lightformer
              key={i}
              form="circle"
              intensity={2}
              rotation={[Math.PI / 2, 0, 0]}
              position={[x, 4, i * 4]}
              scale={[3, 1, 1]}
            />
          ))}
        </group>
      </group> */}

      {/* Left side reflection */}
      <Lightformer
        intensity={4}
        rotation-y={Math.PI / 2}
        position={[-5, 1, -1]}
        scale={[20, 0.1, 1]}
      />

      <Lightformer
        rotation-y={Math.PI / 2}
        position={[-5, -1, -1]}
        scale={[20, 0.5, 1]}
      />

      {/* Right side reflection */}
      <Lightformer
        rotation-y={-Math.PI / 2}
        position={[10, 1, 0]}
        scale={[20, 1, 1]}
      />

      {/* Red accent reflection */}
      {/* <Float
        speed={5}
        floatIntensity={2}
        rotationIntensity={2}
      >
        <Lightformer
          form="ring"
          color="red"
          intensity={1}
          scale={10}
          position={[-15, 4, -18]}
          target={[0, 0, 0]}
        />
      </Float> */}

      {/* Procedural environment background */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />

        <LayerMaterial side={THREE.BackSide}>
          <Color
            color="#eeeeee"
            alpha={1}
            mode="normal"
          />

          <Depth
            colorA="#eeeeee"
            colorB="#eeeeee"
            alpha={0.5}
            mode="normal"
            near={0}
            far={300}
            origin={[100, 100, 100]}
          />
        </LayerMaterial>
      </mesh>
    </>
  );
}

useGLTF.preload(porscheModel);
