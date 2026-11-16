
// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
// } from "react";

// const SceneVariantContext = createContext(null);

// export function SceneVariantProvider({ children }) {
//   const [variantRegistry, setVariantRegistry] = useState({});

//   // Register GLB model variants
//   const registerModelVariants = useCallback(
//     (modelId, model, variants, applyVariant) => {
//       setVariantRegistry((prev) => ({
//         ...prev,
//         [modelId]: {
//           model,
//           variants,
//           applyVariant,
//           selectedVariant: null,
//         },
//       }));
//     },
//     []
//   );

//   // Unregister GLB model
//   const unregisterModelVariants = useCallback((modelId) => {
//     setVariantRegistry((prev) => {
//       const updated = { ...prev };
//       delete updated[modelId];
//       return updated;
//     });
//   }, []);

//   // Change variant for a particular model
//   const selectModelVariant = useCallback(
//     (modelId, variantName) => {
//       const item = variantRegistry[modelId];

//       if (!item) return;

//       const variant = item.variants.find(
//         (v) => v.name === variantName
//       );

//       if (!variant) return;

//       item.applyVariant(variant.index);

//       setVariantRegistry((prev) => ({
//         ...prev,
//         [modelId]: {
//           ...prev[modelId],
//           selectedVariant: variantName,
//         },
//       }));
//     },
//     [variantRegistry]
//   );

//   return (
//     <SceneVariantContext.Provider
//       value={{
//         variantRegistry,
//         registerModelVariants,
//         unregisterModelVariants,
//         selectModelVariant,
//       }}
//     >
//       {children}
//     </SceneVariantContext.Provider>
//   );
// }

// export function useSceneVariant() {
//   return useContext(SceneVariantContext);
// }





// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useRef,
// } from "react";

// const SceneVariantContext = createContext(null);

// export function SceneVariantProvider({ children }) {
//   const [variantRegistry, setVariantRegistry] = useState({});

//   // Store the globally selected variant
//   const selectedVariantRef = useRef(null);

//   // Register GLB model variants
//   const registerModelVariants = useCallback(
//     (modelId, model, variants, applyVariant) => {
//       const selectedVariant = selectedVariantRef.current;
  
//       setVariantRegistry((prev) => ({
//         ...prev,
//         [modelId]: {
//           model,
//           variants,
//           applyVariant,
//           selectedVariant,
//         },
//       }));
  
//       if (selectedVariant) {
//         const matchedVariant = variants.find(
//           (v) => v.name === selectedVariant
//         );
  
//         if (matchedVariant) {
//           requestAnimationFrame(() => {
//             applyVariant(matchedVariant.index);
//           });
//         }
//       }
//     },
//     []
//   );

//   // Unregister GLB model
//   const unregisterModelVariants = useCallback((modelId) => {
//     setVariantRegistry((prev) => {
//       const updated = { ...prev };
//       delete updated[modelId];
//       return updated;
//     });
//   }, []);

//   // Change variant for a particular model
//   const selectModelVariant = useCallback(
//     async (modelId, variantName) => {
//       const item = variantRegistry[modelId];

//       if (!item) return;

//       const variant = item.variants.find(
//         (v) => v.name === variantName
//       );

//       if (!variant) return;

//       await item.applyVariant(variant.index);

//       setVariantRegistry((prev) => ({
//         ...prev,
//         [modelId]: {
//           ...prev[modelId],
//           selectedVariant: variantName,
//         },
//       }));
//     },
//     [variantRegistry]
//   );

//   // Change variant for ALL registered GLB models
//   const selectGlobalVariant = useCallback(
//     async (variantName) => {
//       selectedVariantRef.current = variantName;

//       const entries = Object.entries(variantRegistry);

//       await Promise.all(
//         entries.map(async ([modelId, item]) => {
//           const variant = item.variants.find(
//             (v) => v.name === variantName
//           );

//           if (!variant) return;

//           await item.applyVariant(variant.index);

//           setVariantRegistry((prev) => ({
//             ...prev,
//             [modelId]: {
//               ...prev[modelId],
//               selectedVariant: variantName,
//             },
//           }));
//         })
//       );
//     },
//     [variantRegistry]
//   );

//   return (
//     <SceneVariantContext.Provider
//       value={{
//         variantRegistry,
//         registerModelVariants,
//         unregisterModelVariants,
//         selectModelVariant,
//         selectGlobalVariant,
//       }}
//     >
//       {children}
//     </SceneVariantContext.Provider>
//   );
// }

// export function useSceneVariant() {
//   const context = useContext(SceneVariantContext);

//   if (!context) {
//     throw new Error(
//       "useSceneVariant must be used inside SceneVariantProvider"
//     );
//   }

//   return context;
// }






"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const SceneVariantContext = createContext(null);

export function SceneVariantProvider({ children }) {
  const [variantRegistry, setVariantRegistry] = useState({});

  // Remember the currently selected material variant
  const selectedVariantRef = useRef(null);

  // Track model registrations
  const registrationRef = useRef({});

  // Register GLB model variants
  const registerModelVariants = useCallback(
    (modelId, model, variants, applyVariant) => {
      const registrationId = Symbol(modelId);

      registrationRef.current[modelId] = registrationId;

      const selectedVariant = selectedVariantRef.current;

      setVariantRegistry((prev) => ({
        ...prev,
        [modelId]: {
          model,
          variants,
          applyVariant,
          selectedVariant: null,
        },
      }));

      // Apply current selection to newly loaded GLB
      if (selectedVariant) {
        const matchedVariant = variants.find(
          (v) => v.name === selectedVariant
        );

        if (matchedVariant) {
          Promise.resolve(
            applyVariant(matchedVariant.index)
          )
            .then(() => {
              if (
                registrationRef.current[modelId] !== registrationId
              ) {
                return;
              }

              setVariantRegistry((prev) => ({
                ...prev,
                [modelId]: {
                  ...prev[modelId],
                  selectedVariant,
                },
              }));
            })
            .catch((error) => {
              console.error("Variant application failed:", error);
            });
        }
      }
    },
    []
  );

  // Unregister GLB model
  const unregisterModelVariants = useCallback((modelId) => {
    delete registrationRef.current[modelId];

    setVariantRegistry((prev) => {
      const updated = { ...prev };
      delete updated[modelId];
      return updated;
    });
  }, []);

  // Select variant for a particular model
  const selectModelVariant = useCallback(
    async (modelId, variantName) => {
      const item = variantRegistry[modelId];

      if (!item) return;

      const variant = item.variants.find(
        (v) => v.name === variantName
      );

      if (!variant) return;

      // IMPORTANT: Remember selection for future replacement models
      selectedVariantRef.current = variantName;

      await item.applyVariant(variant.index);

      setVariantRegistry((prev) => ({
        ...prev,
        [modelId]: {
          ...prev[modelId],
          selectedVariant: variantName,
        },
      }));
    },
    [variantRegistry]
  );

  // Select variant globally for all registered models
  const selectGlobalVariant = useCallback(
    async (variantName) => {
      // Remember global selection
      selectedVariantRef.current = variantName;

      const entries = Object.entries(variantRegistry);

      await Promise.all(
        entries.map(async ([modelId, item]) => {
          const variant = item.variants.find(
            (v) => v.name === variantName
          );

          if (!variant) return;

          const registrationId = registrationRef.current[modelId];

          await item.applyVariant(variant.index);

          if (
            registrationRef.current[modelId] !== registrationId
          ) {
            return;
          }

          setVariantRegistry((prev) => ({
            ...prev,
            [modelId]: {
              ...prev[modelId],
              selectedVariant: variantName,
            },
          }));
        })
      );
    },
    [variantRegistry]
  );

  return (
    <SceneVariantContext.Provider
      value={{
        variantRegistry,
        registerModelVariants,
        unregisterModelVariants,
        selectModelVariant,
        selectGlobalVariant,
      }}
    >
      {children}
    </SceneVariantContext.Provider>
  );
}

export function useSceneVariant() {
  const context = useContext(SceneVariantContext);

  if (!context) {
    throw new Error(
      "useSceneVariant must be used inside SceneVariantProvider"
    );
  }

  return context;
}
