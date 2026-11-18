"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

const SceneAnimationContext = createContext(null);

export function SceneAnimationProvider({ children }) {
  const [animationRegistry, setAnimationRegistry] = useState({});
  const registryRef = useRef(animationRegistry);
  registryRef.current = animationRegistry;

  const registerModelAnimations = useCallback((modelId, actions, names, mixer) => {
    console.log("names:=",names)
    setAnimationRegistry((previous) => ({
      ...previous,
      [modelId]: { actions, names, mixer },
    }));
  }, []);

  const unregisterModelAnimations = useCallback((modelId) => {
    setAnimationRegistry((previous) => {
      if (!previous[modelId]) return previous;
      const next = { ...previous };
      delete next[modelId];
      return next;
    });
  }, []);

  const stopSceneAnimations = useCallback(() => {
    Object.values(registryRef.current).forEach(({ mixer }) => {
      mixer?.stopAllAction();
    });
  }, []);

  const playSceneAnimation = useCallback((type) => {
    const normalizedType = String(type ?? "").toLowerCase();
    if (!normalizedType) return;

    stopSceneAnimations();

    Object.values(registryRef.current).forEach(({ actions, names }) => {
      names.forEach((name) => {
        if (!name.toLowerCase().includes(normalizedType)) return;

        const action = actions[name];
        if (!action) return;

        action.reset();
        action.enabled = true;
        action.paused = false;
        action.timeScale = 1;
        action.setEffectiveWeight(1);
        action.setEffectiveTimeScale(1);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      });
    });
  }, [stopSceneAnimations]);

  const contextValue = useMemo(
    () => ({
      animationRegistry,
      registerModelAnimations,
      unregisterModelAnimations,
      playSceneAnimation,
      stopSceneAnimations,
    }),
    [
      animationRegistry,
      registerModelAnimations,
      unregisterModelAnimations,
      playSceneAnimation,
      stopSceneAnimations,
    ]
  );

  return (
    <SceneAnimationContext.Provider value={contextValue}>
      {children}
    </SceneAnimationContext.Provider>
  );
}

export function useSceneAnimation() {
  const context = useContext(SceneAnimationContext);
  if (!context) {
    throw new Error("useSceneAnimation must be used inside SceneAnimationProvider");
  }
  return context;
}
