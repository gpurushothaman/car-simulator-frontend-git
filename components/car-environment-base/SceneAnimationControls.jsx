import { Html } from "@react-three/drei";
import { useSceneAnimation } from "./SceneAnimationContext";

export default function SceneAnimationControls() {
  const {
    animationRegistry,
    playSceneAnimation,
    stopSceneAnimations,
  } = useSceneAnimation();

  console.log("ani reg:=",animationRegistry)

  const hasOpen = Object.values(animationRegistry).some(
    ({ names }) =>
      names.some((name) =>
        name.includes("open")
      )
  );

  console.log("has open reg:=",hasOpen)

  const hasClose = Object.values(animationRegistry).some(
    ({ names }) =>
      names.some((name) =>
        name.includes("close")
      )
  );

  return (
    <Html fullscreen>
      <div className="animation-panel">
        <button
          disabled={!hasOpen}
          onClick={() => playSceneAnimation("open")}
        >
          Open All
        </button>

        <button
          disabled={!hasClose}
          onClick={() => playSceneAnimation("close")}
        >
          Close All
        </button>

        <button onClick={stopSceneAnimations}>
          Stop
        </button>
      </div>
    </Html>
  );
}