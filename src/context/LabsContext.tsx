/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import type { DynamicLabValue } from "../types/enhanced";
import { getDynamicLabManager } from "../services/labs";
import type { SimulationLoop } from "../services/simulation/simulationLoop";

interface LabsContextType {
  dynamicLabs: DynamicLabValue[];
}

const LabsCtx = createContext<LabsContextType | null>(null);

export function useLabs(): LabsContextType {
  const ctx = useContext(LabsCtx);
  if (!ctx) {
    throw new Error("useLabs must be used within LabsProvider");
  }
  return ctx;
}

export function LabsProvider({
  children,
  loopRef,
  isRunning,
}: {
  children: React.ReactNode;
  loopRef: React.RefObject<SimulationLoop | null>;
  isRunning: boolean;
}) {
  const [dynamicLabs, setDynamicLabs] = useState<DynamicLabValue[]>([]);

  useEffect(() => {
    const loop = loopRef.current;
    if (!loop || !isRunning) return;

    loop.registerHandler({
      id: "labs-update",
      intervalMs: 30000,
      callback: () => {
        const labManager = getDynamicLabManager();
        labManager.updateLabs(Date.now());
        setDynamicLabs(labManager.getAllLabs());
      },
    });

    return () => {
      loop.unregisterHandler("labs-update");
    };
  }, [loopRef, isRunning]);

  return (
    <LabsCtx.Provider value={{ dynamicLabs }}>
      {children}
    </LabsCtx.Provider>
  );
}
