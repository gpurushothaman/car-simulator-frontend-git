import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import * as THREE from "three";

const SceneAnimationContext = createContext(null);

export function SceneAnimationProvider({ children }) {
  const [animationRegistry, setAnimationRegistry] = useState({});

  // Register animations from each model
  const registerModelAnimations = useCallback(
    (modelId, actions, names, mixer) => {

      console.log("replace part model:",modelId.name)
      setAnimationRegistry((prev) => ({
        ...prev,
        [modelId]: {
          actions,
          names,
          mixer,
        },
      }));
    },
    []
  );

  // Remove model animations
  const unregisterModelAnimations = useCallback((modelId) => {
    setAnimationRegistry((prev) => {
      const updated = { ...prev };
      delete updated[modelId];
      return updated;
    });
  }, []);

  const playSceneAnimation = useCallback(
    (type) => {
  
      // First stop all currently running animations
      Object.values(animationRegistry).forEach(({ mixer }) => {
        mixer.stopAllAction();
      });
  
      // Then play all matching animations
      Object.values(animationRegistry).forEach(
        ({ actions, names }) => {
  
          names.forEach((name) => {
  
            if (name.includes(type.toLowerCase())) {
              console.log("fff:=",name)
  
              const action = actions[name];
  
              if (!action) return;
  
              // Reset previous animation state
              action.reset();
  
              action.enabled = true;
              action.paused = false;
  
              action.timeScale = 1;
              action.setEffectiveWeight(1);
              action.setEffectiveTimeScale(1);
  
              // Play complete animation
              action.setLoop(THREE.LoopOnce, 1);
              action.clampWhenFinished = true;
  
              action.play();
            }
  
          });
  
        }
      );
  
    },
    [animationRegistry]
  );

  const stopSceneAnimations = useCallback(() => {
    Object.values(animationRegistry).forEach(({ mixer }) => {
      mixer.stopAllAction();
    });
  }, [animationRegistry]);

  return (
    <SceneAnimationContext.Provider
      value={{
        animationRegistry,
        registerModelAnimations,
        unregisterModelAnimations,
        playSceneAnimation,
        stopSceneAnimations,
      }}
    >
      {children}
    </SceneAnimationContext.Provider>
  );
}

export function useSceneAnimation() {
  return useContext(SceneAnimationContext);
}