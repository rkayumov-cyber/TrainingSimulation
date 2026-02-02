/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { Vitals } from "../types";
import type { ActiveDrugEffect } from "../types/enhanced";
import { getDrugEffectManager } from "../services/pharmacology";
import type { SimulationLoop } from "../services/simulation/simulationLoop";

interface PharmacologyContextType {
  activeDrugEffects: ActiveDrugEffect[];
}

const PharmacologyCtx = createContext<PharmacologyContextType | null>(null);

export function usePharmacology(): PharmacologyContextType {
  const ctx = useContext(PharmacologyCtx);
  if (!ctx) {
    throw new Error("usePharmacology must be used within PharmacologyProvider");
  }
  return ctx;
}

export function PharmacologyProvider({
  children,
  loopRef,
  isRunning,
  baselineVitals,
  dispatch,
}: {
  children: React.ReactNode;
  loopRef: React.RefObject<SimulationLoop | null>;
  isRunning: boolean;
  baselineVitals: Vitals;
  dispatch: React.Dispatch<{ type: "SET_TARGET_VITALS"; payload: Partial<Vitals> }>;
}) {
  const [activeDrugEffects, setActiveDrugEffects] = useState<ActiveDrugEffect[]>([]);
  const baselineRef = useRef(baselineVitals);
  useEffect(() => {
    baselineRef.current = baselineVitals;
  }, [baselineVitals]);

  useEffect(() => {
    const loop = loopRef.current;
    if (!loop || !isRunning) return;

    loop.registerHandler({
      id: "drug-effects",
      intervalMs: 2000,
      callback: () => {
        const drugManager = getDrugEffectManager();
        const effects = drugManager.calculateTotalEffects(
          Date.now(),
          baselineRef.current,
        );

        if (
          Object.keys(effects).some((k) => effects[k as keyof Vitals] !== 0)
        ) {
          const vitalUpdates: Partial<Vitals> = {};
          for (const [key, value] of Object.entries(effects)) {
            if (value !== 0) {
              const baseValue = baselineRef.current[key as keyof Vitals];
              vitalUpdates[key as keyof Vitals] = baseValue + value;
            }
          }
          dispatch({ type: "SET_TARGET_VITALS", payload: vitalUpdates });
        }

        setActiveDrugEffects(drugManager.getActiveEffects());
      },
    });

    return () => {
      loop.unregisterHandler("drug-effects");
    };
  }, [loopRef, isRunning, dispatch]);

  return (
    <PharmacologyCtx.Provider value={{ activeDrugEffects }}>
      {children}
    </PharmacologyCtx.Provider>
  );
}
