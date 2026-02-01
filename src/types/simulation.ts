export interface Vitals {
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  temp: number;
  respRate: number;
}

export interface LabOrder {
  id: string;
  name: string;
  orderedAt: number;
  completedAt?: number;
  result?: string;
  status: "ordered" | "processing" | "completed";
}

export interface ChatMessage {
  id: string;
  sender: "doctor" | "patient";
  content: string;
  timestamp: number;
}

export interface MDTMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
}

export interface ClinicalEvent {
  id: string;
  type: "action" | "deterioration" | "improvement" | "alert";
  description: string;
  timestamp: number;
}

export interface FeedbackLog {
  id: string;
  type: "jargon" | "error" | "warning" | "info";
  message: string;
  timestamp: number;
}

export interface DeteriorationRule {
  id: string;
  condition: string;
  timerMinutes: number;
  effect: Partial<Vitals>;
  preventedBy: string[];
  triggered: boolean;
  startTime?: number;
}

export interface SimulationScore {
  timeToAntibiotics: number | null;
  timeToOxygen: number | null;
  timeToFluids: number | null;
  communicationErrors: number;
  totalActions: number;
  correctActions: number;
}

export interface SimulationState {
  vitals: Vitals;
  targetVitals: Vitals;
  labsOrdered: LabOrder[];
  labsCompleted: LabOrder[];
  chatMessages: ChatMessage[];
  mdtMessages: MDTMessage[];
  events: ClinicalEvent[];
  feedbackLogs: FeedbackLog[];
  actionsTaken: string[];
  deteriorationRules: DeteriorationRule[];
  score: SimulationScore;
  startTime: number;
  isRunning: boolean;
  isPaused: boolean;
  scenarioId: string;
}

export interface MedicalIntent {
  action: string;
  target?: string;
  value?: string | number;
  raw: string;
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  patientName: string;
  patientPersona: string;
  baselineVitals: Vitals;
  deteriorationRules: Omit<DeteriorationRule, "triggered" | "startTime">[];
  correctActions: string[];
  labResults: Record<string, string>;
  examFindings?: Record<string, string>;
}
