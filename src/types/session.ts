import type {
  Vitals,
  SimulationScore,
  ClinicalEvent,
  FeedbackLog,
} from "./simulation";
import type { ClinicalDecisionScore } from "./enhanced";

export interface VitalsSnapshot {
  timestamp: number;
  vitals: Vitals;
}

export interface ActionRecord {
  action: string;
  timestamp: number;
  elapsedSeconds: number;
}

export interface SessionRecord {
  id: string;
  scenarioId: string;
  scenarioName: string;
  startTime: number;
  endTime: number;
  durationMs: number;
  score: SimulationScore;
  clinicalScore: ClinicalDecisionScore | null;
  actionsTaken: ActionRecord[];
  events: ClinicalEvent[];
  feedbackLogs: FeedbackLog[];
  vitalsSnapshots: VitalsSnapshot[];
  missedActions: string[];
  grade: "A" | "B" | "C" | "D" | "F";
  totalScore: number;
  maxPossibleScore: number;
}

export interface SessionSummary {
  id: string;
  scenarioId: string;
  scenarioName: string;
  date: number;
  durationMs: number;
  grade: "A" | "B" | "C" | "D" | "F";
  totalScore: number;
  maxPossibleScore: number;
  actionCount: number;
  communicationErrors: number;
}

export interface ScenarioProgress {
  scenarioId: string;
  scenarioName: string;
  attempts: number;
  bestGrade: "A" | "B" | "C" | "D" | "F";
  bestScore: number;
  averageScore: number;
  lastAttempt: number;
  gradeHistory: {
    date: number;
    grade: "A" | "B" | "C" | "D" | "F";
    score: number;
  }[];
}
