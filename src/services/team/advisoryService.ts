import type { Vitals } from "../../types";
import type { TeamRole } from "../../types/enhanced";
import { DEFAULT_TEAM, SPECIALISTS } from "./teamSimulation";

// ============================================
// ADVISORY MODE — Team members suggest actions
// ============================================

export interface AdvisoryMessage {
  id: string;
  fromRole: TeamRole;
  fromName: string;
  suggestion: string;
  command: string; // The action command to execute if accepted
  reasoning: string;
  urgency: "critical" | "important" | "fyi";
  timestamp: number;
  status: "pending" | "accepted" | "dismissed";
}

interface AdvisoryRule {
  scenarioIds: string[] | "*"; // Which scenarios this applies to, "*" for all
  condition: (ctx: AdvisoryContext) => boolean;
  fromRole: TeamRole;
  fromNameKey: string; // Key into DEFAULT_TEAM or SPECIALISTS
  suggestion: string;
  command: string;
  reasoning: string;
  urgency: AdvisoryMessage["urgency"];
  /** Once generated, don't repeat until this many ms have elapsed */
  cooldownMs: number;
}

interface AdvisoryContext {
  scenarioId: string;
  vitals: Vitals;
  actionsTaken: string[];
  elapsedSeconds: number;
  correctActions: string[];
}

// Registry of advisory rules
const ADVISORY_RULES: AdvisoryRule[] = [
  // ============ NURSE advisories ============
  {
    scenarioIds: "*",
    condition: (ctx) => ctx.vitals.spo2 < 92 && !ctx.actionsTaken.includes("administer_oxygen"),
    fromRole: "nurse",
    fromNameKey: "nurse-1",
    suggestion: "SpO2 is dropping — should we put the patient on oxygen?",
    command: "Give oxygen",
    reasoning: "SpO2 below 92% requires supplemental oxygen",
    urgency: "critical",
    cooldownMs: 30000,
  },
  {
    scenarioIds: "*",
    condition: (ctx) => ctx.vitals.bpSystolic < 90 && !ctx.actionsTaken.includes("fluid_bolus"),
    fromRole: "nurse",
    fromNameKey: "nurse-1",
    suggestion: "BP is low — do you want me to set up a fluid bolus?",
    command: "Give IV fluids",
    reasoning: "Hypotension may respond to fluid resuscitation",
    urgency: "critical",
    cooldownMs: 30000,
  },
  {
    scenarioIds: "*",
    condition: (ctx) =>
      !ctx.actionsTaken.includes("establish_iv_access") &&
      ctx.elapsedSeconds > 30 &&
      ctx.actionsTaken.length >= 1,
    fromRole: "nurse",
    fromNameKey: "nurse-1",
    suggestion: "Should I get IV access? We may need it for meds and fluids.",
    command: "Establish IV access",
    reasoning: "Early IV access enables rapid medication administration",
    urgency: "important",
    cooldownMs: 45000,
  },
  {
    scenarioIds: "*",
    condition: (ctx) => ctx.vitals.hr > 130,
    fromRole: "nurse",
    fromNameKey: "nurse-2",
    suggestion: "Heart rate is climbing above 130 — just flagging for your awareness.",
    command: "Check vitals",
    reasoning: "Persistent tachycardia may indicate worsening condition",
    urgency: "fyi",
    cooldownMs: 60000,
  },

  // ============ RESIDENT advisories ============
  {
    scenarioIds: ["sepsis-72f"],
    condition: (ctx) =>
      ctx.actionsTaken.includes("administer_antibiotics") &&
      !ctx.actionsTaken.includes("order_blood_cultures"),
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "Blood cultures should ideally be drawn before starting antibiotics — should we still send them?",
    command: "Order blood cultures",
    reasoning: "Cultures before antibiotics improves organism yield",
    urgency: "important",
    cooldownMs: 60000,
  },
  {
    scenarioIds: ["sepsis-72f"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("order_lactate") &&
      ctx.elapsedSeconds > 60,
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "We should check a lactate — it'll help guide resuscitation intensity.",
    command: "Order lactate",
    reasoning: "Lactate level helps assess sepsis severity",
    urgency: "important",
    cooldownMs: 60000,
  },
  {
    scenarioIds: ["sepsis-72f"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("administer_antibiotics") &&
      ctx.elapsedSeconds > 120,
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "We're approaching the 1-hour mark — should we push the antibiotics now?",
    command: "Give antibiotics",
    reasoning: "Sepsis mortality increases with each hour of antibiotic delay",
    urgency: "critical",
    cooldownMs: 45000,
  },
  {
    scenarioIds: ["mi-65m"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("order_ecg") && ctx.elapsedSeconds > 30,
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "Should we get a 12-lead ECG? Guidelines say within 10 minutes.",
    command: "Order ECG",
    reasoning: "ECG is the priority diagnostic test for suspected MI",
    urgency: "critical",
    cooldownMs: 30000,
  },
  {
    scenarioIds: ["mi-65m"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("give_aspirin") && ctx.elapsedSeconds > 20,
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "Have we given aspirin yet? Should be given ASAP for suspected MI.",
    command: "Give aspirin",
    reasoning: "Aspirin is first-line antiplatelet for acute MI",
    urgency: "critical",
    cooldownMs: 30000,
  },
  {
    scenarioIds: ["stroke-68m"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("order_ct_head") && ctx.elapsedSeconds > 20,
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "We need a CT head urgently to rule out hemorrhage before we consider tPA.",
    command: "Order CT head",
    reasoning: "CT head must precede thrombolysis decision",
    urgency: "critical",
    cooldownMs: 30000,
  },

  // ============ PHARMACIST advisories ============
  {
    scenarioIds: ["sepsis-72f"],
    condition: (ctx) =>
      ctx.actionsTaken.includes("administer_antibiotics") &&
      !ctx.actionsTaken.includes("order_blood_cultures"),
    fromRole: "pharmacist",
    fromNameKey: "pharmacist",
    suggestion: "Just noting — cultures drawn after antibiotics have lower yield. Something to document.",
    command: "Order blood cultures",
    reasoning: "Pre-antibiotic cultures are preferred per guidelines",
    urgency: "fyi",
    cooldownMs: 90000,
  },
  {
    scenarioIds: ["anaphylaxis-28f"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("give_epinephrine") && ctx.elapsedSeconds > 15,
    fromRole: "pharmacist",
    fromNameKey: "pharmacist",
    suggestion: "Epinephrine is first-line for anaphylaxis — should I draw it up? 0.3mg IM.",
    command: "Give epinephrine",
    reasoning: "Epinephrine is the only first-line treatment for anaphylaxis",
    urgency: "critical",
    cooldownMs: 20000,
  },
  {
    scenarioIds: ["anaphylaxis-28f"],
    condition: (ctx) =>
      ctx.actionsTaken.includes("give_antihistamine") &&
      !ctx.actionsTaken.includes("give_epinephrine"),
    fromRole: "pharmacist",
    fromNameKey: "pharmacist",
    suggestion: "Antihistamines are adjunctive only — we really need epinephrine as the primary treatment.",
    command: "Give epinephrine",
    reasoning: "Never rely on antihistamines alone for anaphylaxis",
    urgency: "critical",
    cooldownMs: 20000,
  },
  {
    scenarioIds: ["mi-65m"],
    condition: (ctx) =>
      ctx.actionsTaken.includes("give_nitro") && ctx.vitals.bpSystolic < 90,
    fromRole: "pharmacist",
    fromNameKey: "pharmacist",
    suggestion: "Caution — BP is low. Nitro may worsen hypotension. Consider holding further doses.",
    command: "Check vitals",
    reasoning: "Nitroglycerin is contraindicated in hypotension",
    urgency: "important",
    cooldownMs: 60000,
  },
  {
    scenarioIds: ["dka-32f"],
    condition: (ctx) =>
      !ctx.actionsTaken.includes("start_insulin_drip") &&
      ctx.actionsTaken.includes("check_blood_glucose") &&
      ctx.elapsedSeconds > 60,
    fromRole: "pharmacist",
    fromNameKey: "pharmacist",
    suggestion: "Glucose confirmed high — should I prepare the insulin infusion?",
    command: "Start insulin drip",
    reasoning: "Insulin infusion is the definitive treatment for DKA",
    urgency: "important",
    cooldownMs: 45000,
  },

  // ============ GENERAL fall-through advisories ============
  {
    scenarioIds: "*",
    condition: (ctx) =>
      ctx.elapsedSeconds > 180 &&
      ctx.actionsTaken.length < 3,
    fromRole: "nurse",
    fromNameKey: "nurse-1",
    suggestion: "Is there anything specific you'd like us to start with? Happy to help prioritize.",
    command: "Check vitals",
    reasoning: "Patient may be deteriorating without intervention",
    urgency: "important",
    cooldownMs: 120000,
  },
  {
    scenarioIds: "*",
    condition: (ctx) => {
      const missingCritical = ctx.correctActions.filter(
        (a) => !ctx.actionsTaken.includes(a),
      );
      return ctx.elapsedSeconds > 300 && missingCritical.length > 3;
    },
    fromRole: "resident",
    fromNameKey: "resident",
    suggestion: "Several key actions still outstanding — should we go through the protocol together?",
    command: "Check vitals",
    reasoning: "Multiple critical actions remain to be completed",
    urgency: "important",
    cooldownMs: 120000,
  },
];

// Track cooldowns so we don't spam the same advisory
const advisoryCooldowns = new Map<string, number>();

/**
 * Generate team advisory messages based on current simulation state.
 * Call this periodically (e.g. every 10-15 seconds) to check for new advisories.
 */
export function generateAdvisoryMessages(
  scenarioId: string,
  vitals: Vitals,
  actionsTaken: string[],
  elapsedSeconds: number,
  correctActions: string[],
  existingAdvisories: AdvisoryMessage[],
): AdvisoryMessage[] {
  const now = Date.now();
  const ctx: AdvisoryContext = {
    scenarioId,
    vitals,
    actionsTaken,
    elapsedSeconds,
    correctActions,
  };

  const newAdvisories: AdvisoryMessage[] = [];

  for (const rule of ADVISORY_RULES) {
    // Check scenario match
    if (rule.scenarioIds !== "*" && !rule.scenarioIds.includes(scenarioId)) {
      continue;
    }

    // Check cooldown
    const ruleKey = `${rule.fromNameKey}-${rule.command}-${rule.suggestion.slice(0, 20)}`;
    const lastFired = advisoryCooldowns.get(ruleKey);
    if (lastFired && now - lastFired < rule.cooldownMs) {
      continue;
    }

    // Don't duplicate an active (pending) advisory with the same command
    const hasPending = existingAdvisories.some(
      (a) => a.command === rule.command && a.status === "pending",
    );
    if (hasPending) continue;

    // Check condition
    try {
      if (!rule.condition(ctx)) continue;
    } catch {
      continue;
    }

    // Find the team member name
    const teamMember =
      DEFAULT_TEAM.find((m) => m.id === rule.fromNameKey) ||
      Object.values(SPECIALISTS).find((m) => m.id === rule.fromNameKey);

    const advisory: AdvisoryMessage = {
      id: `adv-${now}-${newAdvisories.length}`,
      fromRole: rule.fromRole,
      fromName: teamMember?.name || rule.fromNameKey,
      suggestion: rule.suggestion,
      command: rule.command,
      reasoning: rule.reasoning,
      urgency: rule.urgency,
      timestamp: now,
      status: "pending",
    };

    newAdvisories.push(advisory);
    advisoryCooldowns.set(ruleKey, now);

    // Limit to 1 new advisory per tick to avoid overwhelming the user
    if (newAdvisories.length >= 1) break;
  }

  return newAdvisories;
}

/**
 * Reset cooldown tracking (call on simulation reset/start).
 */
export function resetAdvisoryCooldowns(): void {
  advisoryCooldowns.clear();
}
