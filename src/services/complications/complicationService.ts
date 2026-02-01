import type { ComplicationRule } from "../../types/difficulty";

// ============================================
// COMPLICATION RULE DEFINITIONS
// ============================================

const COMPLICATION_RULES: ComplicationRule[] = [
  // Sepsis complications
  {
    id: "sepsis-fluid-overload",
    scenarioId: "sepsis-72f",
    trigger: { type: "excess_fluids", threshold: 3 },
    name: "Fluid Overload",
    description: "Excessive IV fluid administration causing pulmonary edema",
    vitalsEffect: { spo2: 86, respRate: 30 },
    patientMessage:
      "I... I can't breathe... it's getting worse, not better... *coughing*",
    feedbackMessage:
      "Fluid overload detected — patient developing pulmonary edema from excessive fluid resuscitation. Consider slowing fluids and reassessing.",
    triggered: false,
  },
  {
    id: "sepsis-abx-no-cultures",
    scenarioId: "sepsis-72f",
    trigger: {
      type: "action_without_prerequisite",
      action: "administer_antibiotics",
      missing: "order_blood_cultures",
    },
    name: "Cultures Missed Before Antibiotics",
    description:
      "Antibiotics given before blood cultures drawn — may obscure organism identification",
    vitalsEffect: {},
    patientMessage: "",
    feedbackMessage:
      "Blood cultures should be drawn BEFORE administering antibiotics. Starting antibiotics first may prevent organism identification and targeted therapy.",
    triggered: false,
  },

  // MI complications
  {
    id: "mi-nitro-hypotension",
    scenarioId: "mi-65m",
    trigger: {
      type: "action_without_prerequisite",
      action: "give_nitro",
      missing: "establish_iv_access",
    },
    name: "Nitroglycerin-Induced Hypotension",
    description:
      "GTN given without IV access — patient becomes hypotensive with no route for fluid rescue",
    vitalsEffect: { bpSystolic: 80, bpDiastolic: 50, hr: 120 },
    patientMessage: "I feel really dizzy... everything's going dark...",
    feedbackMessage:
      "Nitroglycerin caused significant hypotension. IV access should be established first to enable fluid rescue if needed.",
    triggered: false,
  },
  {
    id: "mi-excessive-fluids",
    scenarioId: "mi-65m",
    trigger: { type: "action_performed", action: "fluid_bolus" },
    name: "Fluid Overload in MI",
    description: "Aggressive fluids in MI can worsen heart failure",
    vitalsEffect: { spo2: 89, respRate: 26 },
    patientMessage: "I'm having more trouble breathing now... is that normal?",
    feedbackMessage:
      "Caution: aggressive IV fluids in acute MI can precipitate heart failure. This patient does not need large volume resuscitation.",
    triggered: false,
  },

  // Anaphylaxis complications
  {
    id: "anaph-delayed-epi",
    scenarioId: "anaphylaxis-28f",
    trigger: {
      type: "delayed_action",
      action: "give_epinephrine",
      delayMinutes: 4,
    },
    name: "Refractory Anaphylaxis",
    description: "Delayed epinephrine leads to refractory shock",
    vitalsEffect: { bpSystolic: 55, bpDiastolic: 30, hr: 150, spo2: 72 },
    patientMessage: "",
    feedbackMessage:
      "Delayed epinephrine has led to refractory anaphylactic shock. Epinephrine is first-line and should be given within minutes of recognition.",
    triggered: false,
  },
  {
    id: "anaph-morphine",
    scenarioId: "anaphylaxis-28f",
    trigger: { type: "action_performed", action: "give_morphine" },
    name: "Respiratory Depression in Anaphylaxis",
    description: "Morphine causes respiratory depression and histamine release",
    vitalsEffect: { respRate: 10, spo2: 78 },
    patientMessage: "",
    feedbackMessage:
      "Morphine is contraindicated in anaphylaxis — causes respiratory depression and can trigger further histamine release, worsening the reaction.",
    triggered: false,
  },

  // Asthma complications
  {
    id: "asthma-excess-salbutamol",
    scenarioId: "asthma-19m",
    trigger: { type: "excess_fluids", threshold: 3 }, // Re-using threshold for repeated salbutamol
    name: "Salbutamol Toxicity",
    description: "Excessive beta-agonist causing tachycardia and tremor",
    vitalsEffect: { hr: 150 },
    patientMessage:
      "My heart is racing really fast... I feel shaky all over...",
    feedbackMessage:
      "Excessive salbutamol is causing significant tachycardia. Monitor for cardiac arrhythmias and consider IV magnesium sulfate as adjunct.",
    triggered: false,
  },
  {
    id: "asthma-morphine",
    scenarioId: "asthma-19m",
    trigger: { type: "action_performed", action: "give_morphine" },
    name: "Respiratory Depression in Asthma",
    description: "Morphine causes respiratory depression in severe asthma",
    vitalsEffect: { respRate: 8, spo2: 75 },
    patientMessage: "",
    feedbackMessage:
      "Morphine/opioids are CONTRAINDICATED in acute asthma — causes respiratory depression which can be fatal in the setting of severe bronchospasm.",
    triggered: false,
  },

  // Stroke complications
  {
    id: "stroke-tpa-without-ct",
    scenarioId: "stroke-58m",
    trigger: {
      type: "action_without_prerequisite",
      action: "administer_tpa",
      missing: "order_ct_head",
    },
    name: "tPA Without CT Imaging",
    description:
      "Thrombolysis given without ruling out haemorrhagic stroke — risk of fatal bleed",
    vitalsEffect: { bpSystolic: 220, bpDiastolic: 130 },
    patientMessage: "",
    feedbackMessage:
      "CRITICAL ERROR: tPA must NEVER be given without a CT head to exclude haemorrhagic stroke. Giving thrombolytics in haemorrhagic stroke is potentially fatal.",
    triggered: false,
  },
  {
    id: "stroke-excessive-bp-lowering",
    scenarioId: "stroke-58m",
    trigger: { type: "excess_fluids", threshold: 3 },
    name: "Excessive Blood Pressure Reduction",
    description:
      "Over-aggressive BP lowering can worsen cerebral perfusion in acute stroke",
    vitalsEffect: { bpSystolic: 100, bpDiastolic: 60 },
    patientMessage: "I feel very dizzy now... worse than before...",
    feedbackMessage:
      "Excessive blood pressure reduction in acute stroke can worsen cerebral ischaemia. Target BP should be <185/110 if tPA candidate.",
    triggered: false,
  },

  // DKA complications
  {
    id: "dka-insulin-without-potassium",
    scenarioId: "dka-34f",
    trigger: {
      type: "action_without_prerequisite",
      action: "start_insulin_drip",
      missing: "order_bmp",
    },
    name: "Insulin Without Potassium Check",
    description:
      "Insulin given without checking potassium — risk of fatal hypokalaemia",
    vitalsEffect: { hr: 145 },
    patientMessage: "My heart... it feels weird... fluttering...",
    feedbackMessage:
      "CRITICAL: Potassium must be checked before starting insulin in DKA. Insulin drives potassium into cells — if K+ is already low, this can cause fatal cardiac arrhythmias.",
    triggered: false,
  },
  {
    id: "dka-no-fluids-first",
    scenarioId: "dka-34f",
    trigger: {
      type: "action_without_prerequisite",
      action: "start_insulin_drip",
      missing: "fluid_bolus",
    },
    name: "Insulin Before Fluid Resuscitation",
    description: "Insulin started before adequate fluid resuscitation",
    vitalsEffect: { bpSystolic: 75, bpDiastolic: 42 },
    patientMessage: "I feel so weak... everything's going dark...",
    feedbackMessage:
      "IV fluids should be started BEFORE insulin in DKA. Patients are severely dehydrated (average 5-8L deficit). Insulin without fluids can cause cardiovascular collapse.",
    triggered: false,
  },

  // Trauma complications
  {
    id: "trauma-delayed-chest-drain",
    scenarioId: "trauma-42m",
    trigger: {
      type: "delayed_action",
      action: "insert_chest_drain",
      delayMinutes: 8,
    },
    name: "Tension Pneumothorax",
    description:
      "Delayed chest decompression progressing to tension pneumothorax",
    vitalsEffect: { spo2: 72, bpSystolic: 60, bpDiastolic: 30, hr: 150 },
    patientMessage: "",
    feedbackMessage:
      "Pneumothorax has progressed to tension pneumothorax. Immediate needle decompression followed by chest drain is required. Tracheal deviation and absent breath sounds on affected side.",
    triggered: false,
  },
  {
    id: "trauma-morphine-head-injury",
    scenarioId: "trauma-42m",
    trigger: { type: "action_performed", action: "give_morphine" },
    name: "Opioids in Head Injury",
    description:
      "Morphine given in potential head injury — masks neurological signs",
    vitalsEffect: { respRate: 12 },
    patientMessage: "",
    feedbackMessage:
      "Caution: Opioids in trauma with potential head injury can mask neurological deterioration and cause respiratory depression. GCS monitoring becomes unreliable.",
    triggered: false,
  },

  // Peds seizure complications
  {
    id: "peds-delayed-benzo",
    scenarioId: "peds-seizure-4m",
    trigger: {
      type: "delayed_action",
      action: "administer_diazepam",
      delayMinutes: 5,
    },
    name: "Refractory Status Epilepticus",
    description: "Prolonged seizure becoming refractory — brain injury risk",
    vitalsEffect: { spo2: 80, hr: 180 },
    patientMessage: "",
    feedbackMessage:
      "Seizure lasting >5 minutes is status epilepticus and becomes progressively harder to treat. Benzodiazepines should be given as early as possible to prevent brain injury.",
    triggered: false,
  },
  {
    id: "peds-excess-benzo",
    scenarioId: "peds-seizure-4m",
    trigger: { type: "excess_fluids", threshold: 3 },
    name: "Benzodiazepine Respiratory Depression",
    description:
      "Excessive benzodiazepine doses causing respiratory depression",
    vitalsEffect: { respRate: 10, spo2: 82 },
    patientMessage: "",
    feedbackMessage:
      "Multiple benzodiazepine doses have caused respiratory depression. Prepare for intubation. Maximum of 2 doses of first-line benzodiazepine before escalating to second-line agent.",
    triggered: false,
  },

  // Eclampsia complications
  {
    id: "eclampsia-no-magnesium",
    scenarioId: "eclampsia-29f",
    trigger: {
      type: "delayed_action",
      action: "administer_magnesium",
      delayMinutes: 6,
    },
    name: "Recurrent Seizure",
    description: "Repeat eclamptic seizure due to delayed magnesium",
    vitalsEffect: { bpSystolic: 210, bpDiastolic: 140, hr: 120 },
    patientMessage: "",
    feedbackMessage:
      "Patient has had a recurrent eclamptic seizure. Magnesium sulfate is the first-line treatment and prophylaxis for eclamptic seizures and should be given immediately.",
    triggered: false,
  },
  {
    id: "eclampsia-morphine",
    scenarioId: "eclampsia-29f",
    trigger: { type: "action_performed", action: "give_morphine" },
    name: "Opioids in Eclampsia",
    description:
      "Morphine can mask neurological signs and cause fetal depression",
    vitalsEffect: { respRate: 14 },
    patientMessage: "",
    feedbackMessage:
      "Opioids should be avoided in eclampsia — they mask neurological deterioration signs and can cross the placenta causing fetal respiratory depression.",
    triggered: false,
  },

  // Cardiac arrest complications
  {
    id: "cardiac-delayed-defib",
    scenarioId: "cardiac-arrest-55m",
    trigger: {
      type: "delayed_action",
      action: "defibrillate",
      delayMinutes: 3,
    },
    name: "Prolonged VF — Reduced Survival",
    description:
      "Each minute of VF without defibrillation reduces survival by 7-10%",
    vitalsEffect: {},
    patientMessage: "",
    feedbackMessage:
      "Delayed defibrillation significantly reduces survival. Each minute in VF without shock reduces chance of survival by 7-10%. Early defibrillation is the single most important intervention in VF arrest.",
    triggered: false,
  },
  {
    id: "cardiac-no-cpr-first",
    scenarioId: "cardiac-arrest-55m",
    trigger: {
      type: "action_without_prerequisite",
      action: "defibrillate",
      missing: "start_cpr",
    },
    name: "Defibrillation Without CPR",
    description: "Shock delivered without initiating CPR first",
    vitalsEffect: {},
    patientMessage: "",
    feedbackMessage:
      "CPR should be initiated immediately upon recognition of cardiac arrest while the defibrillator is being prepared. High-quality CPR maintains cerebral and coronary perfusion.",
    triggered: false,
  },

  // Overdose complications
  {
    id: "overdose-delayed-naloxone",
    scenarioId: "overdose-22m",
    trigger: {
      type: "delayed_action",
      action: "administer_naloxone",
      delayMinutes: 4,
    },
    name: "Respiratory Arrest from Opioid Toxicity",
    description: "Prolonged respiratory depression leading to arrest",
    vitalsEffect: { spo2: 55, respRate: 2, hr: 35, bpSystolic: 60 },
    patientMessage: "",
    feedbackMessage:
      "Prolonged opioid-induced respiratory depression has led to near-respiratory arrest. Naloxone should be given immediately when opioid overdose is suspected. Begin BVM ventilation.",
    triggered: false,
  },
  {
    id: "overdose-morphine",
    scenarioId: "overdose-22m",
    trigger: { type: "action_performed", action: "give_morphine" },
    name: "Opioid Given to Opioid-Intoxicated Patient",
    description:
      "Additional opioid administered to patient with opioid overdose",
    vitalsEffect: { respRate: 2, spo2: 55, hr: 30 },
    patientMessage: "",
    feedbackMessage:
      "CRITICAL ERROR: Additional opioids given to a patient already in opioid-induced respiratory depression. This is life-threatening. Immediate naloxone and BVM ventilation required.",
    triggered: false,
  },
];

// ============================================
// SERVICE FUNCTIONS
// ============================================

export function getComplicationsForScenario(
  scenarioId: string,
): ComplicationRule[] {
  return COMPLICATION_RULES.filter((r) => r.scenarioId === scenarioId).map(
    (r) => ({ ...r, triggered: false }),
  );
}

export interface ComplicationCheckResult {
  rule: ComplicationRule;
  shouldTrigger: boolean;
}

export function checkComplications(
  rules: ComplicationRule[],
  actionsTaken: string[],
  _actionTimestamps: Record<string, number>,
  startTime: number,
  fluidCount: number,
): ComplicationCheckResult[] {
  const results: ComplicationCheckResult[] = [];

  for (const rule of rules) {
    if (rule.triggered) continue;

    let shouldTrigger = false;
    const trigger = rule.trigger;

    switch (trigger.type) {
      case "action_performed":
        shouldTrigger = actionsTaken.includes(trigger.action);
        break;

      case "action_combination":
        shouldTrigger = trigger.actions.every((a) => actionsTaken.includes(a));
        break;

      case "action_without_prerequisite":
        shouldTrigger =
          actionsTaken.includes(trigger.action) &&
          !actionsTaken.includes(trigger.missing);
        break;

      case "excess_fluids":
        shouldTrigger = fluidCount >= trigger.threshold;
        break;

      case "delayed_action": {
        const now = Date.now();
        const elapsed = (now - startTime) / 60000;
        shouldTrigger =
          elapsed >= trigger.delayMinutes &&
          !actionsTaken.includes(trigger.action);
        break;
      }
    }

    if (shouldTrigger) {
      results.push({ rule, shouldTrigger: true });
    }
  }

  return results;
}

export function markComplicationTriggered(
  rules: ComplicationRule[],
  ruleId: string,
): ComplicationRule[] {
  return rules.map((r) => (r.id === ruleId ? { ...r, triggered: true } : r));
}
