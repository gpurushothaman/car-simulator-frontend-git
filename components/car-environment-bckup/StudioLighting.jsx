"use client";

export default function StudioLighting() {
  return (
    // <>
    //   <ambientLight intensity={0.3} />

    //   <directionalLight
    //     position={[0, 8, 6]}
    //     intensity={2}
    //     color="#ffffff"
    //     castShadow
    //     shadow-mapSize-width={2048}
    //     shadow-mapSize-height={2048}
    //     shadow-bias={-0.0001}
    //     shadow-normalBias={0.02}
    //   />

    //   <directionalLight
    //     position={[-6, 4, -4]}
    //     intensity={0.65}
    //     color="#ffffff"
    //   />
    // </>

    <>
  


    {/* Main light: top-front */}
    <directionalLight
      position={[4, 8, 6]}
      intensity={1.5}
      color="#ffffff"
      //castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-bias={-0.0001}
      shadow-normalBias={0.02}
    />

    {/* Front fill */}
    <directionalLight
      position={[0, 3, 8]}
      intensity={0.7}
      color="#ffffff"
    />

    {/* Rear fill */}
    <directionalLight
      position={[0, 4, -8]}
      intensity={1.5}
      color="#ffffff"
    />

    {/* Left fill */}
    <directionalLight
      position={[-7, 4, 0]}
      intensity={0.7}
      color="#ffffff"
    />

    {/* Right fill */}
    <directionalLight
      position={[7, 4, 0]}
      intensity={0.7}
      color="#ffffff"
    />
  </>
  );
}