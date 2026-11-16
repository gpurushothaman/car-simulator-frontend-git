"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const SceneVariantContext = createContext(null);

export function SceneVariantProvider({ children }) {
  const [variantRegistry, setVariantRegistry] = useState({});
  const registryRef = useRef(variantRegistry);
  const registrationRef = useRef({});
  const selectedVariantRef = useRef(null);

  // Keep callbacks independent of registry state to avoid recreating them
  // whenever a model registers or a variant selection changes.
  registryRef.current = variantRegistry;

  const registerModelVariants = useCallback(
    (modelId, model, variants, applyVariant) => {
      const registrationId = Symbol(modelId);
      registrationRef.current[modelId] = registrationId;

      setVariantRegistry((previous) => ({
        ...previous,
        [modelId]: {
          model,
          variants,
          applyVariant,
          selectedVariant: null,
        },
      }));

      const selectedName = selectedVariantRef.current;
      if (!selectedName) return;

      const match = variants.find((variant) => variant.name === selectedName);
      if (!match) return;

      Promise.resolve(applyVariant(match.index))
        .then(() => {
          if (registrationRef.current[modelId] !== registrationId) return;
          setVariantRegistry((previous) => {
            const current = previous[modelId];
            if (!current) return previous;
            return {
              ...previous,
              [modelId]: { ...current, selectedVariant: selectedName },
            };
          });
        })
        .catch((error) => {
          console.error(`Failed to apply variant "${selectedName}" to "${modelId}":`, error);
        });
    },
    []
  );

  const unregisterModelVariants = useCallback((modelId) => {
    delete registrationRef.current[modelId];
    setVariantRegistry((previous) => {
      if (!previous[modelId]) return previous;
      const next = { ...previous };
      delete next[modelId];
      return next;
    });
  }, []);

  const selectModelVariant = useCallback(async (modelId, variantName) => {
    const item = registryRef.current[modelId];
    if (!item) return false;

    const variant = item.variants.find((entry) => entry.name === variantName);
    if (!variant) return false;

    const registrationId = registrationRef.current[modelId];
    await item.applyVariant(variant.index);

    if (registrationRef.current[modelId] !== registrationId) return false;

    setVariantRegistry((previous) => {
      const current = previous[modelId];
      if (!current) return previous;
      return {
        ...previous,
        [modelId]: { ...current, selectedVariant: variantName },
      };
    });
    return true;
  }, []);

  const selectGlobalVariant = useCallback(async (variantName) => {
    selectedVariantRef.current = variantName;
    const entries = Object.entries(registryRef.current);

    const results = await Promise.all(
      entries.map(async ([modelId, item]) => {
        const variant = item.variants.find((entry) => entry.name === variantName);
        if (!variant) return null;

        const registrationId = registrationRef.current[modelId];
        try {
          await item.applyVariant(variant.index);
          if (registrationRef.current[modelId] !== registrationId) return null;
          return { modelId, registrationId };
        } catch (error) {
          console.error(`Failed to apply global variant "${variantName}" to "${modelId}":`, error);
          return null;
        }
      })
    );

    const successfulIds = new Set(
      results.filter(Boolean).map(({ modelId }) => modelId)
    );

    if (successfulIds.size > 0) {
      setVariantRegistry((previous) => {
        let changed = false;
        const next = { ...previous };
        for (const modelId of successfulIds) {
          const current = next[modelId];
          if (!current || current.selectedVariant === variantName) continue;
          next[modelId] = { ...current, selectedVariant: variantName };
          changed = true;
        }
        return changed ? next : previous;
      });
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      variantRegistry,
      registerModelVariants,
      unregisterModelVariants,
      selectModelVariant,
      selectGlobalVariant,
    }),
    [
      variantRegistry,
      registerModelVariants,
      unregisterModelVariants,
      selectModelVariant,
      selectGlobalVariant,
    ]
  );

  return (
    <SceneVariantContext.Provider value={contextValue}>
      {children}
    </SceneVariantContext.Provider>
  );
}

export function useSceneVariant() {
  const context = useContext(SceneVariantContext);
  if (!context) {
    throw new Error("useSceneVariant must be used inside SceneVariantProvider");
  }
  return context;
}
