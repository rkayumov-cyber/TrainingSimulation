import type { Vitals } from "./simulation";

// ============================================
// CLINICAL DECISION SCORING
// ============================================

export interface ActionSequenceRule {
  id: string;
  description: string;
  requiredBefore: string; // Action that should come first
  requiredAfter: string; // Action that should come after
  points: number; // Points awarded for correct sequence
  penalty: number; // Points deducted for wrong sequence
  scenarioIds: string[]; // Which scenarios this applies to
}

export interface ClinicalDecisionScore {
  // Timing scores (existing, enhanced)
  timeToFirstCriticalAction: number | null;
  timingScores: Record<
    string,
    { time: number | null; grade: "A" | "B" | "C" | "D" | "F" }
  >;

  // Action sequencing
  sequencingScore: number;
  sequencingErrors: string[];
  correctSequences: string[];

  // Clinical quality
  appropriateActions: number;
  unnecessaryActions: number;
  missedCriticalActions: string[];
  harmfulActions: string[];

  // Communication
  jargonCount: number;
  clarityScore: number;

  // Overall
  totalScore: number;
  maxPossibleScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
}

export interface ActionAssessment {
  action: string;
  isAppropriate: boolean;
  isUnnecessary: boolean;
  isHarmful: boolean;
  feedback: string;
  points: number;
}

// ============================================
// DRUG KINETICS
// ============================================

export type KineticCurve = "linear" | "exponential" | "sigmoid" | "immediate";

export interface DrugKinetics {
  actionId: string;
  name: string;
  onsetSeconds: number; // Time until effect starts
  peakSeconds: number; // Time to maximum effect
  durationSeconds: number; // How long effect lasts
  curve: KineticCurve;
  effects: Partial<Vitals>;
  maxEffect: Partial<Vitals>; // Maximum change possible
  requiresContinuous: boolean; // Does it need to be maintained (like O2)?
}

export interface ActiveDrugEffect {
  kinetics: DrugKinetics;
  startTime: number;
  currentIntensity: number; // 0-1 representing effect strength
  isActive: boolean;
}

// ============================================
// DYNAMIC LABS
// ============================================

export interface DynamicLabValue {
  name: string;
  baselineValue: number;
  currentValue: number;
  unit: string;
  normalRange: { min: number; max: number };
  criticalRange?: { min: number; max: number };
  // How this lab changes over time
  deteriorationRate: number; // Change per minute if untreated
  improvementTriggers: {
    action: string;
    improvementRate: number; // Change per minute after action
    maxImprovement: number; // Cap on improvement
  }[];
}

export interface LabEvolution {
  labName: string;
  history: { time: number; value: number }[];
  trend: "improving" | "stable" | "worsening";
}

// ============================================
// PATIENT EMOTIONAL STATE
// ============================================

export type EmotionalState =
  | "calm"
  | "anxious"
  | "distressed"
  | "panicked"
  | "confused"
  | "lethargic"
  | "relieved"
  | "grateful";

export interface PatientState {
  emotionalState: EmotionalState;
  painLevel: number; // 0-10
  breathingDifficulty: number; // 0-10
  consciousness: "alert" | "drowsy" | "confused" | "unresponsive";
  treatmentAcknowledgments: string[]; // Track what treatments patient noticed
  lastStateChange: number;
}

export interface TreatmentResponse {
  actionId: string;
  patientResponse: string;
  emotionalChange?: EmotionalState;
  painChange?: number;
  breathingChange?: number;
}

// ============================================
// TEAM SIMULATION
// ============================================

export type TeamRole =
  | "attending"
  | "resident"
  | "nurse"
  | "specialist"
  | "pharmacist";

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  isAvailable: boolean;
  currentTask?: string;
  taskStartTime?: number;
  expertise: string[];
}

export interface TaskDelegation {
  id: string;
  taskDescription: string;
  assignedTo: TeamRole;
  assignedAt: number;
  completedAt?: number;
  status: "pending" | "in_progress" | "completed" | "failed";
  result?: string;
}

export interface HandoffEvent {
  id: string;
  fromRole: TeamRole;
  toRole: TeamRole;
  timestamp: number;
  summary: string;
  criticalInfo: string[];
  qualityScore: number; // 0-100
}

// ============================================
// ADVISORY MODE
// ============================================

export interface AdvisoryMessage {
  id: string;
  fromRole: TeamRole;
  fromName: string;
  suggestion: string;
  command: string;
  reasoning: string;
  urgency: "critical" | "important" | "fyi";
  timestamp: number;
  status: "pending" | "accepted" | "dismissed";
}

// ============================================
// KNOWLEDGE INTEGRATION
// ============================================

export interface ClinicalGuideline {
  id: string;
  condition: string;
  keyActions: string[];
  sequenceRecommendations: string[];
  contraindications: string[];
  source: string;
}

export interface ContextualSuggestion {
  trigger: string; // What triggered this suggestion (symptom, action, etc.)
  content: string;
  relevance: number; // 0-1
  source: string;
  isFromKnowledgeBase: boolean;
}

// ============================================
// ENHANCED SCENARIO
// ============================================

export interface EnhancedScenarioDefinition {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";

  // Patient
  patientName: string;
  patientAge: number;
  patientGender: "M" | "F";
  patientPersona: string;
  patientHistory: string[];
  allergies: string[];

  // Clinical
  baselineVitals: Vitals;
  baselineLabs: DynamicLabValue[];

  // Scoring
  criticalActions: string[];
  actionSequenceRules: ActionSequenceRule[];
  unnecessaryActions: string[];
  harmfulActions: { action: string; reason: string }[];

  // Drug kinetics for this scenario
  drugKinetics: DrugKinetics[];

  // Team
  availableTeamMembers: TeamMember[];

  // Learning objectives
  learningObjectives: string[];
  postSimulationReview: string[];
}
