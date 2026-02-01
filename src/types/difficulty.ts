import type { Vitals } from "./simulation";

// ============================================
// DIFFICULTY SYSTEM
// ============================================

export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "expert"
  | "adaptive";

export interface DifficultyModifiers {
  deteriorationTimerMultiplier: number; // >1 = slower, <1 = faster
  hintsVisible: boolean;
  checklistVisible: boolean;
  showIdealTiming: boolean;
  complicationsEnabled: boolean;
  feedbackVerbosity: "detailed" | "standard" | "minimal";
  multipleChoiceEnabled: boolean;
  advisoryModeEnabled: boolean;
}

export const DIFFICULTY_PRESETS: Record<
  Exclude<DifficultyLevel, "adaptive">,
  DifficultyModifiers
> = {
  beginner: {
    deteriorationTimerMultiplier: 2.0,
    hintsVisible: true,
    checklistVisible: true,
    showIdealTiming: true,
    complicationsEnabled: false,
    feedbackVerbosity: "detailed",
    multipleChoiceEnabled: true,
    advisoryModeEnabled: true,
  },
  intermediate: {
    deteriorationTimerMultiplier: 1.0,
    hintsVisible: false,
    checklistVisible: false,
    showIdealTiming: false,
    complicationsEnabled: false,
    feedbackVerbosity: "standard",
    multipleChoiceEnabled: false,
    advisoryModeEnabled: true,
  },
  expert: {
    deteriorationTimerMultiplier: 0.6,
    hintsVisible: false,
    checklistVisible: false,
    showIdealTiming: false,
    complicationsEnabled: true,
    feedbackVerbosity: "minimal",
    multipleChoiceEnabled: false,
    advisoryModeEnabled: false,
  },
};

// ============================================
// OSCE COMPETENCY CHECKLISTS
// ============================================

export type CompetencyDomain =
  | "assessment"
  | "investigation"
  | "treatment"
  | "communication"
  | "safety"
  | "escalation";

export interface ChecklistItem {
  id: string;
  label: string;
  domain: CompetencyDomain;
  matchActions: string[]; // Actions that satisfy this item
  matchPatterns?: RegExp[]; // Chat patterns that satisfy this item
  isCritical: boolean; // Must-pass item
  completed: boolean;
  completedAt?: number;
  order: number; // Display order
}

export interface CompetencyChecklist {
  scenarioId: string;
  items: ChecklistItem[];
  passThreshold: number; // Percentage needed to pass (e.g. 70)
  criticalPassRequired: boolean; // Must all critical items pass?
}

export interface ChecklistResult {
  total: number;
  completed: number;
  criticalTotal: number;
  criticalCompleted: number;
  passed: boolean;
  domainScores: Record<CompetencyDomain, { total: number; completed: number }>;
}

// ============================================
// SCENARIO COMPLICATIONS / BRANCHING
// ============================================

export interface ComplicationRule {
  id: string;
  scenarioId: string;
  trigger: ComplicationTrigger;
  name: string;
  description: string;
  vitalsEffect: Partial<Vitals>;
  patientMessage: string;
  feedbackMessage: string;
  triggered: boolean;
}

export type ComplicationTrigger =
  | { type: "action_performed"; action: string }
  | { type: "action_combination"; actions: string[] }
  | { type: "action_without_prerequisite"; action: string; missing: string }
  | { type: "excess_fluids"; threshold: number }
  | { type: "delayed_action"; action: string; delayMinutes: number };
