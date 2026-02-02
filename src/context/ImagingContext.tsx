/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";
import type { ImagingStudy } from "../types/imaging";
import { getImagingManager } from "../services/imaging";
import type { SimulationAction } from "../reducers/simulationReducer";

interface ImagingContextType {
  imagingStudies: ImagingStudy[];
  orderImaging: (studyId: string) => void;
}

const ImagingCtx = createContext<ImagingContextType | null>(null);

export function useImaging(): ImagingContextType {
  const ctx = useContext(ImagingCtx);
  if (!ctx) {
    throw new Error("useImaging must be used within ImagingProvider");
  }
  return ctx;
}

export function ImagingProvider({
  children,
  dispatch,
}: {
  children: React.ReactNode;
  dispatch: React.Dispatch<SimulationAction>;
}) {
  const [imagingStudies, setImagingStudies] = useState<ImagingStudy[]>([]);

  const orderImaging = useCallback(
    (studyId: string) => {
      const imgManager = getImagingManager();
      const study = imgManager.orderStudy(studyId);
      if (study) {
        setImagingStudies(imgManager.getAllStudies());
        dispatch({
          type: "ADD_EVENT",
          payload: {
            type: "action",
            description: `Imaging ordered: ${study.name}`,
          },
        });
        setTimeout(() => {
          setImagingStudies(imgManager.getAllStudies());
        }, study.delayMs + 100);
      }
    },
    [dispatch],
  );

  return (
    <ImagingCtx.Provider value={{ imagingStudies, orderImaging }}>
      {children}
    </ImagingCtx.Provider>
  );
}

// Export setter for use by SimulationContext startup
export { ImagingCtx };
