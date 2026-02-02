import { createContext } from "react";
import type { SimulationState, ScenarioDefinition } from "../types";
import type { SimulationAction } from "../reducers/simulationReducer";
import type {
  ClinicalDecisionScore,
  PatientState,
  TaskDelegation,
} from "../types/enhanced";
import type {
  DifficultyLevel,
  DifficultyModifiers,
  CompetencyChecklist,
  ChecklistResult,
  ComplicationRule,
} from "../types/difficulty";
import type { BenchmarkResult } from "../types/scenarioBuilder";

export interface SimulationContextType {
  state: SimulationState;
  scenario: ScenarioDefinition;
  dispatch: React.Dispatch<SimulationAction>;
  sendDoctorMessage: (message: string) => void;
  sendMDTMessage: (sender: string, message: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  endSimulation: () => void;
  resetSimulation: () => void;
  changeScenario: (scenario: ScenarioDefinition) => void;
  elapsedTime: number;
  // Enhanced features
  clinicalScore: ClinicalDecisionScore | null;
  patientState: PatientState | null;
  teamTasks: TaskDelegation[];
  contextualHints: string[];
  actionTimestamps: Record<string, number>;
  // Session persistence
  lastSessionId: string | null;
  // P1: Difficulty, Checklists, Complications
  difficulty: DifficultyLevel;
  difficultyModifiers: DifficultyModifiers;
  changeDifficulty: (level: DifficultyLevel) => void;
  checklist: CompetencyChecklist | null;
  checklistResult: ChecklistResult | null;
  complications: ComplicationRule[];
  // Benchmark
  benchmarkResult: BenchmarkResult | null;
}

export const SimulationContext = createContext<SimulationContextType | null>(
  null,
);
