import type { Vitals, DeteriorationRule, ScenarioDefinition } from "./simulation";

// ── Benchmark Types ──

export interface ExpectedAction {
  action: string;
  label: string;
  required: boolean;
  maxTimeMinutes: number;
  points: number;
}

export interface ExpectedSequence {
  before: string;
  after: string;
  points: number;
  penalty: number;
}

export interface TimingThreshold {
  action: string;
  gradeA: number; // seconds
  gradeB: number;
  gradeC: number;
  gradeD: number;
}

export interface BenchmarkDefinition {
  scenarioId: string;
  expectedActions: ExpectedAction[];
  expectedSequences: ExpectedSequence[];
  timingThresholds: TimingThreshold[];
  passingScore: number; // 0-100
}

export interface BenchmarkActionResult {
  action: string;
  label: string;
  completed: boolean;
  required: boolean;
  timeSeconds: number | null;
  pointsEarned: number;
  pointsPossible: number;
}

export interface BenchmarkSequenceResult {
  before: string;
  after: string;
  correct: boolean;
  pointsEarned: number;
}

export interface BenchmarkTimingResult {
  action: string;
  grade: "A" | "B" | "C" | "D" | "F";
  timeSeconds: number | null;
}

export interface BenchmarkResult {
  actionResults: BenchmarkActionResult[];
  sequenceResults: BenchmarkSequenceResult[];
  timingResults: BenchmarkTimingResult[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
}

// ── Attachment Types ──

export interface ScenarioAttachment {
  id: string;
  scenarioId: string;
  filename: string;
  mimeType: string;
  size: number;
  data: ArrayBuffer;
  description: string;
  extractedText?: string;
}

// ── Custom Scenario Types ──

export interface CustomScenarioDefinition extends ScenarioDefinition {
  isCustom: true;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  attachmentIds: string[];
  benchmark?: BenchmarkDefinition;
}

// ── Builder Form State ──

export interface DeteriorationRuleForm {
  id: string;
  condition: string;
  timerMinutes: number;
  effect: Partial<Vitals>;
  preventedBy: string[];
}

export interface ScenarioBuilderFormState {
  // Step 1: Metadata
  name: string;
  description: string;
  tags: string[];

  // Step 2: Patient
  patientName: string;
  patientPersona: string;

  // Step 3: Vitals
  baselineVitals: Vitals;

  // Step 4: Deterioration
  deteriorationRules: DeteriorationRuleForm[];

  // Step 5: Actions & Labs
  correctActions: string[];
  labResults: Record<string, string>;

  // Step 6: Attachments
  attachments: ScenarioAttachment[];

  // Step 7: Benchmark
  benchmark: BenchmarkDefinition;
}

export type BuilderStep =
  | "metadata"
  | "patient"
  | "vitals"
  | "deterioration"
  | "actions"
  | "attachments"
  | "benchmark";

export const BUILDER_STEPS: { key: BuilderStep; label: string }[] = [
  { key: "metadata", label: "Metadata" },
  { key: "patient", label: "Patient" },
  { key: "vitals", label: "Vitals" },
  { key: "deterioration", label: "Deterioration" },
  { key: "actions", label: "Actions & Labs" },
  { key: "attachments", label: "Attachments" },
  { key: "benchmark", label: "Benchmark" },
];

// ── Template Types (re-exported from data) ──

export type { ScenarioTemplate, TemplateCategory } from "../data/scenarioTemplates";

// ── Preview State ──

export interface PreviewState {
  vitals: Vitals;
  targetVitals: Vitals;
  actionsTaken: string[];
  chatMessages: { sender: "doctor" | "patient"; content: string; intents?: string[] }[];
  deteriorationRules: DeteriorationRule[];
  elapsedMs: number;
  isRunning: boolean;
  speed: 1 | 5 | 10;
}
