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
  const registryRef = useRef({});
  const registrationRef = useRef({});

  // Keep all active variant selections per model ID. A base GLB can have
  // multiple independent slots (paint, seats, trim), so one selected name
  // is not enough. A replacement bumper has its own model ID and own list.
  const selectedVariantsByModelRef = useRef({});

  const registerModelVariants = useCallback(
    (modelId, model, variants, applyVariant) => {
      const registrationId = Symbol(modelId);
      registrationRef.current[modelId] = registrationId;

      const entry = {
        model,
        variants,
        applyVariant,
        selectedVariant:
          (selectedVariantsByModelRef.current[modelId] ?? []).slice(-1)[0] ?? null,
      };

      registryRef.current = {
        ...registryRef.current,
        [modelId]: entry,
      };
      setVariantRegistry(registryRef.current);

      // Restore every previously selected slot for this model, in selection
      // order. For example, body paint and seat material both survive a remount.
      const selectedNames = selectedVariantsByModelRef.current[modelId] ?? [];
      if (selectedNames.length) {
        (async () => {
          for (const selectedName of selectedNames) {
            const match = variants.find((variant) => variant.name === selectedName);
            if (match) await applyVariant(match.index);
            if (registrationRef.current[modelId] !== registrationId) return;
          }
          if (registrationRef.current[modelId] !== registrationId) return;
          setVariantRegistry((previous) => {
            const current = previous[modelId];
            if (!current) return previous;
            const next = {
              ...previous,
              [modelId]: {
                ...current,
                selectedVariant: selectedNames[selectedNames.length - 1],
              },
            };
            registryRef.current = next;
            return next;
          });
        })().catch((error) => {
          console.error(`Failed to restore variants on "${modelId}":`, error);
        });
      }
    },
    []
  );

  const unregisterModelVariants = useCallback((modelId) => {
    delete registrationRef.current[modelId];
    const next = { ...registryRef.current };
    delete next[modelId];
    registryRef.current = next;
    setVariantRegistry(next);
    // Intentionally keep selectedVariantsByModelRef[modelId] so a replacement
    // component with the same ID can restore its own selections.
  }, []);

  const selectModelVariant = useCallback(async (modelId, variantName) => {
    const item = registryRef.current[modelId];
    if (!item) return false;

    const variant = item.variants.find((entry) => entry.name === variantName);
    if (!variant) return false;

    const registrationId = registrationRef.current[modelId];
    try {
      await item.applyVariant(variant.index);
    } catch (error) {
      console.error(`Failed to apply variant "${variantName}" to "${modelId}":`, error);
      return false;
    }

    if (registrationRef.current[modelId] !== registrationId) return false;

    const previousSelections = selectedVariantsByModelRef.current[modelId] ?? [];
    // Move this variant to the end. If it belongs to a mesh slot already
    // selected, its material overwrites that slot; other slots remain active.
    selectedVariantsByModelRef.current[modelId] = [
      ...previousSelections.filter((name) => name !== variantName),
      variantName,
    ];
    setVariantRegistry((previous) => {
      const current = previous[modelId];
      if (!current) return previous;
      const next = {
        ...previous,
        [modelId]: { ...current, selectedVariant: variantName },
      };
      registryRef.current = next;
      return next;
    });
    return true;
  }, []);

  // Backwards-compatible API. Each matching model gets its own saved state.
  const selectGlobalVariant = useCallback(async (variantName) => {
    const entries = Object.entries(registryRef.current);
    await Promise.all(
      entries.map(async ([modelId, item]) => {
        const variant = item.variants.find((entry) => entry.name === variantName);
        if (!variant) return;
        await selectModelVariant(modelId, variantName);
      })
    );
  }, [selectModelVariant]);

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
