import type { Vitals, ClinicalEvent, FeedbackLog } from "./simulation";

export interface DemoStep {
  id: string;
  elapsedSeconds: number;
  doctorMessage?: string;
  patientResponse?: string;
  actionParsed?: string;
  actionFeedback?: string;
  vitals: Vitals;
  events: ClinicalEvent[];
  feedbackLogs: FeedbackLog[];
  annotation?: string;
  scoringImpact?: { pointsEarned: number; reason: string };
  isCriticalAction?: boolean;
  communicationNote?: string;
  speakerTone?: "calm" | "urgent" | "empathetic" | "confused";
}

export type DemoGrade = "A" | "C" | "F";

export interface DemoTranscript {
  id: string;
  scenarioId: string;
  scenarioName: string;
  level: "excellent" | "mediocre" | "poor";
  grade: DemoGrade;
  totalScore: number;
  maxPossibleScore: number;
  steps: DemoStep[];
  summary: string;
}

export interface DemoIndex {
  scenarioId: string;
  scenarioName: string;
  scenarioIcon: string;
  transcripts: {
    excellent: DemoTranscript;
    mediocre: DemoTranscript;
    poor: DemoTranscript;
  };
}
