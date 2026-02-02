/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { AdvisoryMessage } from "../types/enhanced";
import type { SimulationLoop } from "../services/simulation/simulationLoop";
import type { Vitals } from "../types";
import type { DifficultyModifiers } from "../types/difficulty";
import {
  generateAdvisoryMessages,
} from "../services/team/advisoryService";
import type { SimulationAction } from "../reducers/simulationReducer";

interface TeamContextType {
  advisoryMessages: AdvisoryMessage[];
  acceptAdvisory: (id: string) => void;
  dismissAdvisory: (id: string) => void;
}

const TeamCtx = createContext<TeamContextType | null>(null);

export function useTeam(): TeamContextType {
  const ctx = useContext(TeamCtx);
  if (!ctx) {
    throw new Error("useTeam must be used within TeamProvider");
  }
  return ctx;
}

export function TeamProvider({
  children,
  loopRef,
  isRunning,
  sendDoctorMessage,
  dispatch,
  stateRef,
  scenarioRef,
  difficultyModifiersRef,
}: {
  children: React.ReactNode;
  loopRef: React.RefObject<SimulationLoop | null>;
  isRunning: boolean;
  sendDoctorMessage: (message: string) => void;
  dispatch: React.Dispatch<SimulationAction>;
  stateRef: React.RefObject<{ vitals: Vitals; actionsTaken: string[]; startTime: number }>;
  scenarioRef: React.RefObject<{ id: string; correctActions: string[] }>;
  difficultyModifiersRef: React.RefObject<DifficultyModifiers | null>;
}) {
  const [advisoryMessages, setAdvisoryMessages] = useState<AdvisoryMessage[]>([]);
  const advisoryMessagesRef = useRef(advisoryMessages);
  useEffect(() => {
    advisoryMessagesRef.current = advisoryMessages;
  }, [advisoryMessages]);

  useEffect(() => {
    const loop = loopRef.current;
    if (!loop || !isRunning) return;

    loop.registerHandler({
      id: "advisory",
      intervalMs: 12000,
      callback: () => {
        if (!difficultyModifiersRef.current?.advisoryModeEnabled) return;
        const s = stateRef.current;
        const sc = scenarioRef.current;
        const elapsedSeconds = (Date.now() - s.startTime) / 1000;
        const newAdvisories = generateAdvisoryMessages(
          sc.id,
          s.vitals,
          s.actionsTaken,
          elapsedSeconds,
          sc.correctActions,
          advisoryMessagesRef.current,
        );
        if (newAdvisories.length > 0) {
          setAdvisoryMessages((prev) => [...prev, ...newAdvisories]);
          for (const adv of newAdvisories) {
            dispatch({
              type: "ADD_MDT_MESSAGE",
              payload: {
                sender: adv.fromName,
                content: adv.suggestion,
              },
            });
          }
        }
      },
    });

    return () => {
      loop.unregisterHandler("advisory");
    };
  }, [loopRef, isRunning, dispatch, stateRef, scenarioRef, difficultyModifiersRef]);

  const acceptAdvisory = React.useCallback(
    (id: string) => {
      setAdvisoryMessages((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "accepted" as const } : a)),
      );
      const advisory = advisoryMessagesRef.current.find((a) => a.id === id);
      if (advisory) {
        sendDoctorMessage(advisory.command);
      }
    },
    [sendDoctorMessage],
  );

  const dismissAdvisory = React.useCallback((id: string) => {
    setAdvisoryMessages((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "dismissed" as const } : a)),
    );
  }, []);

  return (
    <TeamCtx.Provider
      value={{
        advisoryMessages,
        acceptAdvisory,
        dismissAdvisory,
      }}
    >
      {children}
    </TeamCtx.Provider>
  );
}
