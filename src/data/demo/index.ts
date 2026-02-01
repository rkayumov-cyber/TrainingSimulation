import type { DemoTranscript, DemoIndex } from "../../types/demo";

import { sepsisExcellent } from "./sepsis-excellent";
import { sepsisMediocre } from "./sepsis-mediocre";
import { sepsisPoor } from "./sepsis-poor";
import { miExcellent } from "./mi-excellent";
import { miMediocre } from "./mi-mediocre";
import { miPoor } from "./mi-poor";
import { anaphylaxisExcellent } from "./anaphylaxis-excellent";
import { anaphylaxisMediocre } from "./anaphylaxis-mediocre";
import { anaphylaxisPoor } from "./anaphylaxis-poor";
import { strokeExcellent } from "./stroke-excellent";
import { strokeMediocre } from "./stroke-mediocre";
import { strokePoor } from "./stroke-poor";
import { cardiacArrestExcellent } from "./cardiac-arrest-excellent";
import { cardiacArrestMediocre } from "./cardiac-arrest-mediocre";
import { cardiacArrestPoor } from "./cardiac-arrest-poor";

export const allDemoTranscripts: DemoTranscript[] = [
  sepsisExcellent,
  sepsisMediocre,
  sepsisPoor,
  miExcellent,
  miMediocre,
  miPoor,
  anaphylaxisExcellent,
  anaphylaxisMediocre,
  anaphylaxisPoor,
  strokeExcellent,
  strokeMediocre,
  strokePoor,
  cardiacArrestExcellent,
  cardiacArrestMediocre,
  cardiacArrestPoor,
];

export const demoRegistry: DemoIndex[] = [
  {
    scenarioId: "sepsis-72f",
    scenarioName: "Acute Sepsis",
    scenarioIcon: "thermometer",
    transcripts: {
      excellent: sepsisExcellent,
      mediocre: sepsisMediocre,
      poor: sepsisPoor,
    },
  },
  {
    scenarioId: "mi-65m",
    scenarioName: "Acute MI",
    scenarioIcon: "heart",
    transcripts: {
      excellent: miExcellent,
      mediocre: miMediocre,
      poor: miPoor,
    },
  },
  {
    scenarioId: "anaphylaxis-28f",
    scenarioName: "Anaphylaxis",
    scenarioIcon: "syringe",
    transcripts: {
      excellent: anaphylaxisExcellent,
      mediocre: anaphylaxisMediocre,
      poor: anaphylaxisPoor,
    },
  },
  {
    scenarioId: "stroke-58m",
    scenarioName: "Acute Stroke",
    scenarioIcon: "brain",
    transcripts: {
      excellent: strokeExcellent,
      mediocre: strokeMediocre,
      poor: strokePoor,
    },
  },
  {
    scenarioId: "cardiac-arrest-55m",
    scenarioName: "Cardiac Arrest",
    scenarioIcon: "heart-off",
    transcripts: {
      excellent: cardiacArrestExcellent,
      mediocre: cardiacArrestMediocre,
      poor: cardiacArrestPoor,
    },
  },
];

export function getDemoTranscript(
  scenarioId: string,
  level: "excellent" | "mediocre" | "poor",
): DemoTranscript | undefined {
  const entry = demoRegistry.find((d) => d.scenarioId === scenarioId);
  return entry?.transcripts[level];
}

export function getAllDemoIds(): string[] {
  return allDemoTranscripts.map((t) => t.id);
}

export {
  sepsisExcellent,
  sepsisMediocre,
  sepsisPoor,
  miExcellent,
  miMediocre,
  miPoor,
  anaphylaxisExcellent,
  anaphylaxisMediocre,
  anaphylaxisPoor,
  strokeExcellent,
  strokeMediocre,
  strokePoor,
  cardiacArrestExcellent,
  cardiacArrestMediocre,
  cardiacArrestPoor,
};
