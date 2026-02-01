import type {
  ActionSequenceRule,
  ClinicalDecisionScore,
  ActionAssessment,
} from "../../types/enhanced";

// Action sequence rules - actions that should happen in specific order
export const ACTION_SEQUENCE_RULES: ActionSequenceRule[] = [
  {
    id: "cultures-before-antibiotics",
    description: "Blood cultures should be drawn before antibiotics",
    requiredBefore: "order_blood_cultures",
    requiredAfter: "administer_antibiotics",
    points: 20,
    penalty: -15,
    scenarioIds: ["sepsis"],
  },
  {
    id: "ecg-before-nitro",
    description: "ECG should be obtained before nitroglycerin",
    requiredBefore: "order_ecg",
    requiredAfter: "administer_nitro",
    points: 15,
    penalty: -10,
    scenarioIds: ["mi"],
  },
  {
    id: "aspirin-before-morphine",
    description: "Aspirin should be given before morphine in MI",
    requiredBefore: "administer_aspirin",
    requiredAfter: "administer_morphine",
    points: 10,
    penalty: -5,
    scenarioIds: ["mi"],
  },
  {
    id: "oxygen-first-anaphylaxis",
    description: "Oxygen should be started early in anaphylaxis",
    requiredBefore: "administer_oxygen",
    requiredAfter: "administer_antihistamine",
    points: 10,
    penalty: -5,
    scenarioIds: ["anaphylaxis"],
  },
  {
    id: "epi-before-steroids",
    description: "Epinephrine before steroids in anaphylaxis",
    requiredBefore: "administer_epinephrine",
    requiredAfter: "administer_steroids",
    points: 15,
    penalty: -10,
    scenarioIds: ["anaphylaxis"],
  },
  {
    id: "bronchodilator-first-asthma",
    description: "Bronchodilator should be first-line in asthma",
    requiredBefore: "administer_salbutamol",
    requiredAfter: "administer_steroids",
    points: 10,
    penalty: -5,
    scenarioIds: ["asthma"],
  },
  // Stroke
  {
    id: "ct-before-tpa",
    description: "CT head must be done before thrombolysis",
    requiredBefore: "order_ct_head",
    requiredAfter: "administer_tpa",
    points: 25,
    penalty: -25,
    scenarioIds: ["stroke"],
  },
  {
    id: "nihss-before-tpa",
    description: "NIHSS should be assessed before thrombolysis decision",
    requiredBefore: "check_nihss",
    requiredAfter: "administer_tpa",
    points: 15,
    penalty: -10,
    scenarioIds: ["stroke"],
  },
  {
    id: "glucose-before-tpa",
    description: "Blood glucose should be checked before tPA",
    requiredBefore: "check_blood_glucose",
    requiredAfter: "administer_tpa",
    points: 10,
    penalty: -5,
    scenarioIds: ["stroke"],
  },
  // DKA
  {
    id: "glucose-before-insulin",
    description: "Blood glucose must be confirmed before starting insulin",
    requiredBefore: "check_blood_glucose",
    requiredAfter: "start_insulin_drip",
    points: 15,
    penalty: -15,
    scenarioIds: ["dka"],
  },
  {
    id: "potassium-before-insulin",
    description: "Potassium (BMP) should be checked before insulin",
    requiredBefore: "order_bmp",
    requiredAfter: "start_insulin_drip",
    points: 20,
    penalty: -15,
    scenarioIds: ["dka"],
  },
  {
    id: "fluids-before-insulin",
    description: "IV fluids should be started before insulin in DKA",
    requiredBefore: "fluid_bolus",
    requiredAfter: "start_insulin_drip",
    points: 15,
    penalty: -10,
    scenarioIds: ["dka"],
  },
  // Trauma
  {
    id: "airway-first-trauma",
    description: "Airway should be assessed first (A of ABCDE)",
    requiredBefore: "check_airway",
    requiredAfter: "order_fast_scan",
    points: 10,
    penalty: -5,
    scenarioIds: ["trauma"],
  },
  // Eclampsia
  {
    id: "magnesium-before-delivery",
    description: "Magnesium should be given before preparing for delivery",
    requiredBefore: "administer_magnesium",
    requiredAfter: "prepare_for_delivery",
    points: 15,
    penalty: -10,
    scenarioIds: ["eclampsia"],
  },
  // Cardiac arrest
  {
    id: "cpr-before-defib",
    description: "CPR should be started before defibrillation",
    requiredBefore: "start_cpr",
    requiredAfter: "defibrillate",
    points: 15,
    penalty: -10,
    scenarioIds: ["cardiac-arrest"],
  },
  {
    id: "defib-before-amiodarone",
    description: "Defibrillation should be attempted before amiodarone",
    requiredBefore: "defibrillate",
    requiredAfter: "administer_amiodarone",
    points: 10,
    penalty: -5,
    scenarioIds: ["cardiac-arrest"],
  },
];

// Critical actions per scenario - must be done
export const CRITICAL_ACTIONS: Record<string, string[]> = {
  sepsis: [
    "administer_oxygen",
    "administer_fluids",
    "administer_antibiotics",
    "order_blood_cultures",
    "order_lactate",
  ],
  mi: [
    "administer_oxygen",
    "administer_aspirin",
    "order_ecg",
    "order_troponin",
    "administer_nitro",
  ],
  anaphylaxis: [
    "administer_epinephrine",
    "administer_oxygen",
    "administer_fluids",
    "check_airway",
  ],
  asthma: ["administer_oxygen", "administer_salbutamol", "order_peak_flow"],
  stroke: [
    "check_nihss",
    "order_ct_head",
    "check_blood_glucose",
    "order_coagulation",
    "administer_tpa",
    "administer_labetalol",
  ],
  dka: [
    "check_blood_glucose",
    "order_bmp",
    "fluid_bolus",
    "start_insulin_drip",
    "check_urine_ketones",
  ],
  trauma: [
    "check_airway",
    "administer_oxygen",
    "order_fast_scan",
    "establish_iv_access",
    "fluid_bolus",
    "insert_chest_drain",
    "order_blood_type_crossmatch",
  ],
  "peds-seizure": [
    "check_airway",
    "administer_oxygen",
    "administer_diazepam",
    "check_blood_glucose",
  ],
  eclampsia: [
    "administer_magnesium",
    "administer_labetalol",
    "check_fetal_heart",
    "check_proteinuria",
    "order_liver_enzymes",
  ],
  "cardiac-arrest": [
    "start_cpr",
    "defibrillate",
    "bag_valve_mask",
    "give_epinephrine",
    "administer_amiodarone",
    "check_rhythm",
  ],
  overdose: [
    "check_airway",
    "administer_oxygen",
    "administer_naloxone",
    "order_toxicology_screen",
  ],
};

// Unnecessary actions per scenario - shouldn't be done or low priority
export const UNNECESSARY_ACTIONS: Record<string, string[]> = {
  sepsis: ["order_chest_xray", "administer_antipyretic"], // Fever is diagnostic, don't mask it
  mi: ["administer_antibiotics", "order_blood_cultures"],
  anaphylaxis: ["order_troponin", "administer_antibiotics"],
  asthma: ["administer_antibiotics", "order_troponin", "administer_fluids"],
  stroke: ["administer_antibiotics", "fluid_bolus"],
  dka: ["administer_antibiotics"],
  trauma: ["administer_antibiotics", "give_antipyretic"],
  "peds-seizure": ["administer_antibiotics"],
  eclampsia: ["administer_antibiotics"],
  "cardiac-arrest": ["give_antipyretic", "administer_antibiotics"],
  overdose: ["administer_antibiotics", "give_antipyretic"],
};

// Harmful actions - should never be done in scenario
export const HARMFUL_ACTIONS: Record<
  string,
  { action: string; reason: string }[]
> = {
  sepsis: [
    {
      action: "administer_morphine",
      reason: "Can mask signs of deterioration and cause hypotension",
    },
  ],
  mi: [
    {
      action: "administer_fluids",
      reason: "Excessive fluids can worsen heart failure in MI",
    },
  ],
  anaphylaxis: [
    {
      action: "administer_morphine",
      reason: "Can cause respiratory depression and hypotension",
    },
  ],
  asthma: [
    {
      action: "administer_morphine",
      reason: "Causes respiratory depression in asthma",
    },
    {
      action: "administer_fluids",
      reason: "Generally not needed unless dehydrated",
    },
  ],
  stroke: [
    {
      action: "administer_fluids",
      reason: "Excessive fluids can worsen cerebral edema in stroke",
    },
  ],
  dka: [
    {
      action: "administer_morphine",
      reason:
        "Opioids mask abdominal signs and can cause respiratory depression",
    },
  ],
  trauma: [],
  "peds-seizure": [
    {
      action: "administer_morphine",
      reason: "Opioids cause respiratory depression in pediatric patients",
    },
  ],
  eclampsia: [
    {
      action: "administer_morphine",
      reason: "Can cause respiratory depression and mask neurological signs",
    },
  ],
  "cardiac-arrest": [
    {
      action: "administer_morphine",
      reason: "Patient is in cardiac arrest — morphine is inappropriate",
    },
  ],
  overdose: [
    {
      action: "administer_morphine",
      reason: "Contraindicated — patient is already opioid-intoxicated",
    },
    {
      action: "administer_fluids",
      reason: "Fluids alone will not reverse opioid toxicity",
    },
  ],
};

// Time targets for critical actions (in seconds)
export const TIME_TARGETS: Record<string, Record<string, number>> = {
  sepsis: {
    administer_oxygen: 120, // 2 minutes
    administer_fluids: 300, // 5 minutes
    administer_antibiotics: 600, // 10 minutes (hour-1 bundle)
    order_blood_cultures: 600,
    order_lactate: 300,
  },
  mi: {
    administer_oxygen: 120,
    administer_aspirin: 300,
    order_ecg: 180, // 3 minutes
    administer_nitro: 600,
  },
  anaphylaxis: {
    administer_epinephrine: 120, // Critical - must be fast
    administer_oxygen: 60,
    check_airway: 30,
  },
  asthma: {
    administer_oxygen: 60,
    administer_salbutamol: 120,
  },
  stroke: {
    check_nihss: 300, // 5 min
    order_ct_head: 300, // 5 min — door to CT
    administer_tpa: 900, // 15 min — door to needle target
    administer_labetalol: 600,
  },
  dka: {
    check_blood_glucose: 120,
    fluid_bolus: 300,
    order_bmp: 300,
    start_insulin_drip: 600,
  },
  trauma: {
    check_airway: 30,
    administer_oxygen: 60,
    order_fast_scan: 300,
    insert_chest_drain: 600,
  },
  "peds-seizure": {
    administer_diazepam: 120, // Stop seizure ASAP
    administer_oxygen: 60,
    check_blood_glucose: 180,
  },
  eclampsia: {
    administer_magnesium: 180,
    administer_labetalol: 300,
    check_fetal_heart: 300,
  },
  "cardiac-arrest": {
    start_cpr: 30, // Immediate
    defibrillate: 60, // Within 1 min
    bag_valve_mask: 120,
    give_epinephrine: 240,
  },
  overdose: {
    check_airway: 30,
    administer_oxygen: 60,
    administer_naloxone: 120,
  },
};

export function calculateTimeGrade(
  actualSeconds: number,
  targetSeconds: number,
): "A" | "B" | "C" | "D" | "F" {
  const ratio = actualSeconds / targetSeconds;
  if (ratio <= 1) return "A";
  if (ratio <= 1.5) return "B";
  if (ratio <= 2) return "C";
  if (ratio <= 3) return "D";
  return "F";
}

export function gradeToPoints(grade: "A" | "B" | "C" | "D" | "F"): number {
  switch (grade) {
    case "A":
      return 20;
    case "B":
      return 15;
    case "C":
      return 10;
    case "D":
      return 5;
    case "F":
      return 0;
  }
}

export function assessAction(
  action: string,
  scenarioId: string,
  _actionsTaken: string[],
  elapsedSeconds: number,
): ActionAssessment {
  const critical = CRITICAL_ACTIONS[scenarioId] || [];
  const unnecessary = UNNECESSARY_ACTIONS[scenarioId] || [];
  const harmful = HARMFUL_ACTIONS[scenarioId] || [];

  const harmfulEntry = harmful.find((h) => h.action === action);
  const isHarmful = !!harmfulEntry;
  const isUnnecessary = unnecessary.includes(action);
  const isAppropriate = critical.includes(action) && !isHarmful;

  let feedback = "";
  let points = 0;

  if (isHarmful) {
    feedback = `⚠️ Harmful: ${harmfulEntry?.reason}`;
    points = -20;
  } else if (isUnnecessary) {
    feedback = `Consider if this is necessary for this presentation`;
    points = -5;
  } else if (isAppropriate) {
    const timeTarget = TIME_TARGETS[scenarioId]?.[action];
    if (timeTarget) {
      const grade = calculateTimeGrade(elapsedSeconds, timeTarget);
      points = gradeToPoints(grade);
      feedback = `Good timing (Grade ${grade})`;
    } else {
      points = 10;
      feedback = `Appropriate action`;
    }
  } else {
    points = 5;
    feedback = `Action noted`;
  }

  return {
    action,
    isAppropriate,
    isUnnecessary,
    isHarmful,
    feedback,
    points,
  };
}

export function checkActionSequencing(
  actionsTaken: string[],
  scenarioId: string,
): { score: number; errors: string[]; correct: string[] } {
  const rules = ACTION_SEQUENCE_RULES.filter((r) =>
    r.scenarioIds.includes(scenarioId),
  );
  let score = 0;
  const errors: string[] = [];
  const correct: string[] = [];

  for (const rule of rules) {
    const beforeIndex = actionsTaken.indexOf(rule.requiredBefore);
    const afterIndex = actionsTaken.indexOf(rule.requiredAfter);

    // Only evaluate if both actions were taken
    if (beforeIndex !== -1 && afterIndex !== -1) {
      if (beforeIndex < afterIndex) {
        score += rule.points;
        correct.push(rule.description);
      } else {
        score += rule.penalty;
        errors.push(`Sequence error: ${rule.description}`);
      }
    } else if (afterIndex !== -1 && beforeIndex === -1) {
      // After action taken but before action never done
      score += rule.penalty;
      errors.push(
        `${rule.requiredBefore} should be done before ${rule.requiredAfter}`,
      );
    }
  }

  return { score, errors, correct };
}

export function calculateClinicalScore(
  actionsTaken: string[],
  actionTimestamps: Record<string, number>,
  scenarioId: string,
  startTime: number,
  jargonCount: number,
): ClinicalDecisionScore {
  const critical = CRITICAL_ACTIONS[scenarioId] || [];
  const timeTargets = TIME_TARGETS[scenarioId] || {};

  // Calculate timing scores
  const timingScores: Record<
    string,
    { time: number | null; grade: "A" | "B" | "C" | "D" | "F" }
  > = {};
  let timingPoints = 0;

  for (const action of Object.keys(timeTargets)) {
    const timestamp = actionTimestamps[action];
    if (timestamp) {
      const elapsedSeconds = (timestamp - startTime) / 1000;
      const grade = calculateTimeGrade(elapsedSeconds, timeTargets[action]);
      timingScores[action] = { time: elapsedSeconds, grade };
      timingPoints += gradeToPoints(grade);
    } else {
      timingScores[action] = { time: null, grade: "F" };
    }
  }

  // Check sequencing
  const sequencing = checkActionSequencing(actionsTaken, scenarioId);

  // Count action types
  const unnecessary = UNNECESSARY_ACTIONS[scenarioId] || [];
  const harmful = HARMFUL_ACTIONS[scenarioId] || [];
  const harmfulActions = harmful.map((h) => h.action);

  let appropriateActions = 0;
  let unnecessaryActions = 0;
  const harmfulTaken: string[] = [];

  for (const action of actionsTaken) {
    if (harmfulActions.includes(action)) {
      harmfulTaken.push(action);
    } else if (unnecessary.includes(action)) {
      unnecessaryActions++;
    } else if (critical.includes(action)) {
      appropriateActions++;
    }
  }

  // Find missed critical actions
  const missedCriticalActions = critical.filter(
    (a) => !actionsTaken.includes(a),
  );

  // Calculate total score
  const maxTimingPoints = Object.keys(timeTargets).length * 20;
  const maxSequencingPoints = ACTION_SEQUENCE_RULES.filter((r) =>
    r.scenarioIds.includes(scenarioId),
  ).reduce((sum, r) => sum + r.points, 0);

  const totalScore = Math.max(
    0,
    timingPoints +
      sequencing.score +
      appropriateActions * 10 -
      unnecessaryActions * 5 -
      harmfulTaken.length * 20 -
      jargonCount * 2,
  );

  const maxPossibleScore =
    maxTimingPoints + maxSequencingPoints + critical.length * 10;

  // Calculate grade
  const percentage = (totalScore / maxPossibleScore) * 100;
  let grade: "A" | "B" | "C" | "D" | "F";
  if (percentage >= 90) grade = "A";
  else if (percentage >= 80) grade = "B";
  else if (percentage >= 70) grade = "C";
  else if (percentage >= 60) grade = "D";
  else grade = "F";

  // Get first critical action time
  let timeToFirstCriticalAction: number | null = null;
  for (const action of critical) {
    const timestamp = actionTimestamps[action];
    if (timestamp) {
      const elapsed = (timestamp - startTime) / 1000;
      if (
        timeToFirstCriticalAction === null ||
        elapsed < timeToFirstCriticalAction
      ) {
        timeToFirstCriticalAction = elapsed;
      }
    }
  }

  return {
    timeToFirstCriticalAction,
    timingScores,
    sequencingScore: sequencing.score,
    sequencingErrors: sequencing.errors,
    correctSequences: sequencing.correct,
    appropriateActions,
    unnecessaryActions,
    missedCriticalActions,
    harmfulActions: harmfulTaken,
    jargonCount,
    clarityScore: Math.max(0, 100 - jargonCount * 10),
    totalScore,
    maxPossibleScore,
    grade,
  };
}
