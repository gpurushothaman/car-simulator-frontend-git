"use client";

import {
  Environment,
  Lightformer,
} from "@react-three/drei";

export default function StudioEnvironment() {
  return (

  //   <Environment
  //   files="/hdr/envmap.hdr"
  //   resolution={512}
  //   background={false}
  //   environmentIntensity={1}
  // />

<>
  {/* <ambientLight intensity={0.35} color="#ffffff" /> */}


  <Environment resolution={512} environmentIntensity={0.5} files="/hdr/envmap.hdr" background={false}>
    {/* Large overhead softbox */}
    <Lightformer
      form="rect"
      intensity={10}
      color="#ffffff"
      position={[0, 6, 0]}
      rotation-x={Math.PI / 2}
      scale={[3,3,3]}
    />

    {/* Front softbox */}
    <Lightformer
      form="rect"
      intensity={10}
      color="#ffffff"
      position={[0, 3, 7]}
      scale={[3,3,3]}
    />

    {/* Rear softbox */}
    <Lightformer
      form="rect"
      intensity={10}
      color="#ffffff"
      position={[0, 3, -7]}
      rotation-y={Math.PI}
      scale={[3,3,3]}
    />

    {/* Left softbox */}
    <Lightformer
      form="rect"
      intensity={10}
      color="#ffffff"
      position={[-6, 3, 0]}
      rotation-y={Math.PI / 2}
      scale={[3,3,3]}
    />

    {/* Right softbox */}
    <Lightformer
      form="rect"
      intensity={10}
      color="#ffffff"
      position={[6, 3, 0]}
      rotation-y={-Math.PI / 2}
      scale={[3,3,3]}
    />
  </Environment>

  </>
    // <Environment resolution={512}>
    //   <Lightformer
    //     form="rect"
    //     intensity={1.5}
    //     color="#ffffff"
    //     position={[0, 5, -2]}
    //     rotation-x={Math.PI / 2}
    //     scale={[9, 7, 1]}
    //   />

    //   <Lightformer
    //     form="rect"
    //     intensity={2}
    //     color="#ffffff"
    //     position={[-5, 1.5, 0]}
    //     rotation-y={Math.PI / 2}
    //     scale={[8, 3, 1]}
    //   />

    //   <Lightformer
    //     form="rect"
    //     intensity={1.6}
    //     color="#ffffff"
    //     position={[5, 1.5, 0]}
    //     rotation-y={-Math.PI / 2}
    //     scale={[8, 3, 1]}
    //   />

    //   <Lightformer
    //     form="rect"
    //     intensity={1.1}
    //     color="#ffffff"
    //     position={[0, 2, 6]}
    //     scale={[6, 4, 1]}
    //   />

    //   <Lightformer
    //     form="rect"
    //     intensity={1.4}
    //     color="#ffffff"
    //     position={[0, 2, -6]}
    //     rotation-y={Math.PI}
    //     scale={[7, 4, 1]}
    //   />
    // </Environment>
  );
}