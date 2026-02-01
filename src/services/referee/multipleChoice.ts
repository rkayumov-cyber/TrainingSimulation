import type { Vitals } from "../../types";
import { actionSuggestions } from "./actionSuggestions";

// ============================================
// MULTIPLE CHOICE OPTIONS FOR BEGINNER MODE
// ============================================

export interface MultipleChoiceOption {
  id: string;
  command: string;
  description: string;
  category: "treatment" | "exam" | "lab" | "medication" | "imaging";
  isCorrect: boolean; // Is this a correct next action for the scenario?
  urgency: "critical" | "important" | "supportive" | "distractor";
}

// Map scenario IDs to their priority action sequences
const SCENARIO_ACTION_PRIORITIES: Record<
  string,
  { action: string; command: string; description: string; category: MultipleChoiceOption["category"]; urgency: MultipleChoiceOption["urgency"] }[]
> = {
  "sepsis-72f": [
    { action: "administer_oxygen", command: "Give oxygen", description: "Apply supplemental oxygen — SpO2 is low", category: "treatment", urgency: "critical" },
    { action: "establish_iv_access", command: "Establish IV access", description: "Place peripheral IV for fluids and meds", category: "treatment", urgency: "critical" },
    { action: "fluid_bolus", command: "Give IV fluids", description: "Start 30mL/kg crystalloid bolus", category: "treatment", urgency: "critical" },
    { action: "order_blood_cultures", command: "Order blood cultures", description: "Obtain cultures before antibiotics", category: "lab", urgency: "critical" },
    { action: "administer_antibiotics", command: "Give antibiotics", description: "Broad-spectrum antibiotics within 1 hour", category: "treatment", urgency: "critical" },
    { action: "order_lactate", command: "Order lactate", description: "Check serum lactate level", category: "lab", urgency: "important" },
    { action: "check_heart_sounds", command: "Listen to heart sounds", description: "Cardiac auscultation", category: "exam", urgency: "important" },
    { action: "check_lung_sounds", command: "Listen to lung sounds", description: "Respiratory auscultation", category: "exam", urgency: "important" },
    { action: "order_cbc", command: "Order CBC", description: "Complete blood count", category: "lab", urgency: "supportive" },
    { action: "order_bmp", command: "Order BMP", description: "Basic metabolic panel", category: "lab", urgency: "supportive" },
    { action: "order_urinalysis", command: "Order urinalysis", description: "Urine analysis for source", category: "lab", urgency: "supportive" },
  ],
  "mi-65m": [
    { action: "order_ecg", command: "Order ECG", description: "12-lead ECG within 10 minutes", category: "lab", urgency: "critical" },
    { action: "give_aspirin", command: "Give aspirin", description: "325mg chewed immediately", category: "medication", urgency: "critical" },
    { action: "administer_oxygen", command: "Give oxygen", description: "Supplemental oxygen for hypoxia", category: "treatment", urgency: "critical" },
    { action: "establish_iv_access", command: "Establish IV access", description: "IV access for medications", category: "treatment", urgency: "critical" },
    { action: "give_nitro", command: "Give nitroglycerin", description: "Sublingual nitro for chest pain", category: "medication", urgency: "important" },
    { action: "give_morphine", command: "Give morphine", description: "Pain management if nitro insufficient", category: "medication", urgency: "important" },
    { action: "order_troponin", command: "Order troponin", description: "Serial cardiac biomarkers", category: "lab", urgency: "important" },
    { action: "order_chest_xray", command: "Order chest X-ray", description: "Evaluate for pulmonary edema", category: "lab", urgency: "supportive" },
    { action: "check_heart_sounds", command: "Listen to heart sounds", description: "Check for murmurs or gallop", category: "exam", urgency: "supportive" },
  ],
  "anaphylaxis-28f": [
    { action: "give_epinephrine", command: "Give epinephrine", description: "IM epinephrine 0.3-0.5mg — FIRST LINE", category: "medication", urgency: "critical" },
    { action: "administer_oxygen", command: "Give oxygen", description: "High-flow oxygen immediately", category: "treatment", urgency: "critical" },
    { action: "check_airway", command: "Check airway", description: "Assess and secure airway", category: "exam", urgency: "critical" },
    { action: "establish_iv_access", command: "Establish IV access", description: "Large-bore IV for fluids", category: "treatment", urgency: "critical" },
    { action: "fluid_bolus", command: "Give IV fluids", description: "Rapid fluid bolus for hypotension", category: "treatment", urgency: "important" },
    { action: "give_antihistamine", command: "Give antihistamine", description: "Diphenhydramine (adjunctive only)", category: "medication", urgency: "supportive" },
    { action: "give_steroids", command: "Give steroids", description: "Prevent biphasic reaction", category: "medication", urgency: "supportive" },
  ],
  "asthma-45m": [
    { action: "administer_oxygen", command: "Give oxygen", description: "Maintain SpO2 > 92%", category: "treatment", urgency: "critical" },
    { action: "give_salbutamol", command: "Give salbutamol", description: "Inhaled SABA nebulizer", category: "medication", urgency: "critical" },
    { action: "give_steroids", command: "Give steroids", description: "Systemic corticosteroids early", category: "medication", urgency: "critical" },
    { action: "give_ipratropium", command: "Give ipratropium", description: "Add if severe exacerbation", category: "medication", urgency: "important" },
    { action: "check_peak_flow", command: "Check peak flow", description: "Measure PEFR before/after treatment", category: "exam", urgency: "important" },
    { action: "order_abg", command: "Order ABG", description: "Arterial blood gas if severe", category: "lab", urgency: "supportive" },
    { action: "order_chest_xray", command: "Order chest X-ray", description: "Rule out pneumothorax", category: "lab", urgency: "supportive" },
  ],
  "stroke-68m": [
    { action: "order_ct_head", command: "Order CT head", description: "Urgent CT to rule out hemorrhage", category: "imaging", urgency: "critical" },
    { action: "check_nihss", command: "Check NIHSS", description: "NIH Stroke Scale assessment", category: "exam", urgency: "critical" },
    { action: "check_blood_glucose", command: "Check blood glucose", description: "Rule out hypoglycemia", category: "exam", urgency: "critical" },
    { action: "establish_iv_access", command: "Establish IV access", description: "IV access for medications", category: "treatment", urgency: "important" },
    { action: "order_ecg", command: "Order ECG", description: "Check for atrial fibrillation", category: "lab", urgency: "important" },
    { action: "order_coagulation", command: "Order coagulation", description: "PT/INR before thrombolysis", category: "lab", urgency: "important" },
    { action: "administer_tpa", command: "Give tPA", description: "Thrombolysis if eligible", category: "medication", urgency: "critical" },
  ],
  "dka-32f": [
    { action: "check_blood_glucose", command: "Check blood glucose", description: "Confirm hyperglycemia", category: "exam", urgency: "critical" },
    { action: "establish_iv_access", command: "Establish IV access", description: "Large-bore IV access", category: "treatment", urgency: "critical" },
    { action: "fluid_bolus", command: "Give IV fluids", description: "Normal saline resuscitation", category: "treatment", urgency: "critical" },
    { action: "start_insulin_drip", command: "Start insulin drip", description: "Fixed-rate IV insulin infusion", category: "medication", urgency: "critical" },
    { action: "order_bmp", command: "Order BMP", description: "Check electrolytes and creatinine", category: "lab", urgency: "important" },
    { action: "check_urine_ketones", command: "Check urine ketones", description: "Confirm ketoacidosis", category: "lab", urgency: "important" },
    { action: "order_abg", command: "Order ABG", description: "Assess acidosis severity", category: "lab", urgency: "important" },
  ],
  "cardiac-arrest": [
    { action: "start_cpr", command: "Start CPR", description: "Begin chest compressions immediately", category: "treatment", urgency: "critical" },
    { action: "check_rhythm", command: "Check rhythm", description: "Analyze cardiac rhythm", category: "exam", urgency: "critical" },
    { action: "defibrillate", command: "Defibrillate", description: "Shock if shockable rhythm", category: "treatment", urgency: "critical" },
    { action: "bag_valve_mask", command: "Bag valve mask", description: "Ventilate with BVM", category: "treatment", urgency: "critical" },
    { action: "establish_iv_access", command: "Establish IV access", description: "IV/IO access for medications", category: "treatment", urgency: "important" },
    { action: "give_epinephrine", command: "Give epinephrine", description: "1mg IV every 3-5 minutes", category: "medication", urgency: "important" },
    { action: "administer_amiodarone", command: "Give amiodarone", description: "300mg for refractory VF/VT", category: "medication", urgency: "supportive" },
  ],
};

// Distractor actions that are common but wrong for certain scenarios
const DISTRACTOR_OPTIONS: MultipleChoiceOption[] = [
  { id: "d-fluids-excess", command: "Give another fluid bolus", description: "Additional 1L crystalloid", category: "treatment", isCorrect: false, urgency: "distractor" },
  { id: "d-ct-head", command: "Order CT head", description: "CT scan of the brain", category: "imaging", isCorrect: false, urgency: "distractor" },
  { id: "d-insulin", command: "Start insulin drip", description: "IV insulin infusion", category: "medication", isCorrect: false, urgency: "distractor" },
  { id: "d-tpa", command: "Give tPA", description: "Thrombolytic therapy", category: "medication", isCorrect: false, urgency: "distractor" },
  { id: "d-defibrillate", command: "Defibrillate", description: "Apply electrical shock", category: "treatment", isCorrect: false, urgency: "distractor" },
  { id: "d-morphine", command: "Give morphine", description: "IV opioid analgesia", category: "medication", isCorrect: false, urgency: "distractor" },
  { id: "d-antihistamine", command: "Give antihistamine", description: "Diphenhydramine IV", category: "medication", isCorrect: false, urgency: "distractor" },
  { id: "d-magnesium", command: "Give magnesium", description: "Magnesium sulfate IV", category: "medication", isCorrect: false, urgency: "distractor" },
  { id: "d-naloxone", command: "Give naloxone", description: "Opioid reversal agent", category: "medication", isCorrect: false, urgency: "distractor" },
  { id: "d-sedation", command: "Give sedation", description: "Midazolam for agitation", category: "medication", isCorrect: false, urgency: "distractor" },
];

/**
 * Generate context-aware multiple choice options for the current simulation state.
 * Returns 4 options: mix of correct next actions + plausible distractors.
 */
export function generateMultipleChoiceOptions(
  scenarioId: string,
  actionsTaken: string[],
  vitals: Vitals,
  correctActions: string[],
): MultipleChoiceOption[] {
  const priorities = SCENARIO_ACTION_PRIORITIES[scenarioId];

  // If no scenario-specific priorities, fall back to generic approach
  if (!priorities) {
    return generateGenericOptions(actionsTaken, correctActions);
  }

  // Filter out actions already taken
  const remainingPriorities = priorities.filter(
    (p) => !actionsTaken.includes(p.action),
  );

  if (remainingPriorities.length === 0) {
    return []; // All actions done
  }

  // Boost urgency based on current vitals
  const boostedPriorities = remainingPriorities.map((p) => ({
    ...p,
    boostedUrgency: getVitalUrgencyBoost(p.action, vitals),
  }));

  // Sort: critical > boosted > important > supportive
  boostedPriorities.sort((a, b) => {
    const urgencyOrder = { critical: 0, important: 1, supportive: 2, distractor: 3 };
    const aScore = urgencyOrder[a.urgency] - (a.boostedUrgency ? 1 : 0);
    const bScore = urgencyOrder[b.urgency] - (b.boostedUrgency ? 1 : 0);
    return aScore - bScore;
  });

  // Pick 2-3 correct options (prioritized)
  const correctCount = Math.min(3, boostedPriorities.length);
  const correctOptions: MultipleChoiceOption[] = boostedPriorities
    .slice(0, correctCount)
    .map((p, i) => ({
      id: `mc-correct-${i}`,
      command: p.command,
      description: p.description,
      category: p.category,
      isCorrect: true,
      urgency: p.urgency,
    }));

  // Pick 1 distractor that doesn't overlap with correct actions
  const distractorCount = 4 - correctOptions.length;
  const distractors = pickDistractors(
    scenarioId,
    correctActions,
    actionsTaken,
    distractorCount,
  );

  // Combine and shuffle
  const options = [...correctOptions, ...distractors];
  return shuffleArray(options);
}

function getVitalUrgencyBoost(action: string, vitals: Vitals): boolean {
  if (action === "administer_oxygen" && vitals.spo2 < 92) return true;
  if (action === "fluid_bolus" && vitals.bpSystolic < 90) return true;
  if (action === "give_epinephrine" && vitals.bpSystolic < 85) return true;
  if (action === "start_cpr" && vitals.hr < 30) return true;
  if (action === "check_airway" && vitals.spo2 < 85) return true;
  return false;
}

function pickDistractors(
  scenarioId: string,
  correctActions: string[],
  _actionsTaken: string[],
  count: number,
): MultipleChoiceOption[] {
  // Filter distractors that aren't correct for this scenario and haven't been shown
  const validDistractors = DISTRACTOR_OPTIONS.filter((d) => {
    const commandLower = d.command.toLowerCase();
    // Don't pick a distractor if it matches a correct action's command
    const isCorrectAction = correctActions.some((ca) => {
      const caReadable = ca.replace(/_/g, " ");
      return commandLower.includes(caReadable) || caReadable.includes(commandLower.replace(/^give |^order |^start /, ""));
    });
    return !isCorrectAction;
  });

  // Scenario-specific distractor weighting — pick ones that seem plausible but wrong
  const scenarioDistractors: Record<string, string[]> = {
    "sepsis-72f": ["d-ct-head", "d-morphine", "d-magnesium"],
    "mi-65m": ["d-tpa", "d-insulin", "d-naloxone"],
    "anaphylaxis-28f": ["d-morphine", "d-insulin", "d-defibrillate"],
    "asthma-45m": ["d-morphine", "d-tpa", "d-naloxone"],
    "cardiac-arrest": ["d-ct-head", "d-insulin", "d-antihistamine"],
  };

  const preferred = scenarioDistractors[scenarioId] || [];
  const preferredDistractors = validDistractors.filter((d) =>
    preferred.includes(d.id),
  );
  const otherDistractors = validDistractors.filter(
    (d) => !preferred.includes(d.id),
  );

  const pool = [...preferredDistractors, ...otherDistractors];
  return shuffleArray(pool).slice(0, count);
}

function generateGenericOptions(
  actionsTaken: string[],
  correctActions: string[],
): MultipleChoiceOption[] {
  // Use the actionSuggestions catalog for unknown scenarios
  const remaining = correctActions.filter((a) => !actionsTaken.includes(a));
  if (remaining.length === 0) return [];

  const options: MultipleChoiceOption[] = remaining.slice(0, 3).map((action, i) => {
    const readable = action.replace(/_/g, " ");
    const suggestion = actionSuggestions.find(
      (s) => s.command.toLowerCase().includes(readable) || readable.includes(s.command.toLowerCase().replace(/^give |^order /, "")),
    );
    return {
      id: `mc-generic-${i}`,
      command: suggestion?.command || capitalizeFirst(readable),
      description: suggestion?.description || `Perform: ${readable}`,
      category: (suggestion?.category || "treatment") as MultipleChoiceOption["category"],
      isCorrect: true,
      urgency: i === 0 ? "critical" : "important",
    };
  });

  // Add a distractor
  const distractor = DISTRACTOR_OPTIONS.find(
    (d) => !correctActions.some((ca) => d.command.toLowerCase().includes(ca.replace(/_/g, " "))),
  );
  if (distractor) {
    options.push(distractor);
  }

  return shuffleArray(options);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
