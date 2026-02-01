import type { Vitals } from "../../types/simulation";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface NEWS2Parameter {
  /** Human-readable name of the physiological parameter */
  name: string;
  /** Raw measured value (number for vitals, boolean-as-number for O2) */
  value: number;
  /** NEWS2 sub-score for this parameter (0-3) */
  score: number;
  /** Textual description of the scoring range that was matched */
  rangeDescription: string;
}

export interface NEWS2Result {
  /** Aggregate NEWS2 score (0-20) */
  totalScore: number;
  /** Clinical risk classification */
  riskLevel: "low" | "low-key" | "medium" | "high";
  /** Individual parameter breakdowns */
  parameters: NEWS2Parameter[];
  /** Recommended clinical response */
  clinicalResponse: string;
  /** Whether the patient is receiving supplemental oxygen */
  supplementalOxygen: boolean;
}

// ---------------------------------------------------------------------------
// Clinical response look-up
// ---------------------------------------------------------------------------

const CLINICAL_RESPONSES: Record<NEWS2Result["riskLevel"], string> = {
  low: "Continue routine monitoring (minimum every 12 hours)",
  "low-key":
    "Urgent assessment by ward nurse, inform team if needed (minimum every 4-6 hours)",
  medium:
    "Urgent review by clinician with competency in acute illness (minimum hourly monitoring)",
  high: "Emergency assessment by critical care team, consider transfer to higher level of care (continuous monitoring)",
};

// ---------------------------------------------------------------------------
// Individual parameter scoring functions
// ---------------------------------------------------------------------------

function scoreRespirationRate(rate: number): NEWS2Parameter {
  let score: number;
  let rangeDescription: string;

  if (rate <= 8) {
    score = 3;
    rangeDescription = "\u226488 breaths/min";
  } else if (rate <= 11) {
    score = 1;
    rangeDescription = "9-11 breaths/min";
  } else if (rate <= 20) {
    score = 0;
    rangeDescription = "12-20 breaths/min";
  } else if (rate <= 24) {
    score = 2;
    rangeDescription = "21-24 breaths/min";
  } else {
    score = 3;
    rangeDescription = "\u226525 breaths/min";
  }

  return { name: "Respiration Rate", value: rate, score, rangeDescription };
}

/**
 * SpO2 Scale 1 -- used when the patient is NOT on supplemental oxygen.
 */
function scoreSpO2Scale1(spo2: number): NEWS2Parameter {
  let score: number;
  let rangeDescription: string;

  if (spo2 <= 91) {
    score = 3;
    rangeDescription = "\u226491%";
  } else if (spo2 <= 93) {
    score = 2;
    rangeDescription = "92-93%";
  } else if (spo2 <= 95) {
    score = 1;
    rangeDescription = "94-95%";
  } else {
    score = 0;
    rangeDescription = "\u226596%";
  }

  return { name: "SpO2 (Scale 1)", value: spo2, score, rangeDescription };
}

/**
 * SpO2 Scale 2 -- used when the patient IS on supplemental oxygen.
 *
 * Scale 2 is designed for patients with a target SpO2 of 88-92%
 * (e.g. those at risk of hypercapnic respiratory failure).
 *
 * Scoring on O2:
 *   <=83  -> 3
 *   84-85 -> 2
 *   86-87 -> 1
 *   88-92 -> 0  (on air) | the target range
 *   93-94 -> 1  (on O2)
 *   95-96 -> 2  (on O2)
 *   >=97  -> 3  (on O2)
 *
 * When supplemental oxygen is being administered the higher saturations
 * are penalised because they indicate the patient is being over-oxygenated.
 */
function scoreSpO2Scale2(spo2: number, onOxygen: boolean): NEWS2Parameter {
  let score: number;
  let rangeDescription: string;

  if (spo2 <= 83) {
    score = 3;
    rangeDescription = "\u226483%";
  } else if (spo2 <= 85) {
    score = 2;
    rangeDescription = "84-85%";
  } else if (spo2 <= 87) {
    score = 1;
    rangeDescription = "86-87%";
  } else if (spo2 <= 92) {
    score = 0;
    rangeDescription = "88-92% (target range)";
  } else if (onOxygen) {
    // Patient is on supplemental O2 with spo2 >= 93 -- penalise
    if (spo2 <= 94) {
      score = 1;
      rangeDescription = "93-94% on O\u2082";
    } else if (spo2 <= 96) {
      score = 2;
      rangeDescription = "95-96% on O\u2082";
    } else {
      score = 3;
      rangeDescription = "\u226597% on O\u2082";
    }
  } else {
    // On air and >= 93 -- this is fine
    score = 0;
    rangeDescription = "\u226593% on air";
  }

  return { name: "SpO2 (Scale 2)", value: spo2, score, rangeDescription };
}

function scoreSystolicBP(sbp: number): NEWS2Parameter {
  let score: number;
  let rangeDescription: string;

  if (sbp <= 90) {
    score = 3;
    rangeDescription = "\u226490 mmHg";
  } else if (sbp <= 100) {
    score = 2;
    rangeDescription = "91-100 mmHg";
  } else if (sbp <= 110) {
    score = 1;
    rangeDescription = "101-110 mmHg";
  } else if (sbp <= 219) {
    score = 0;
    rangeDescription = "111-219 mmHg";
  } else {
    score = 3;
    rangeDescription = "\u2265220 mmHg";
  }

  return { name: "Systolic Blood Pressure", value: sbp, score, rangeDescription };
}

function scoreHeartRate(hr: number): NEWS2Parameter {
  let score: number;
  let rangeDescription: string;

  if (hr <= 40) {
    score = 3;
    rangeDescription = "\u226440 bpm";
  } else if (hr <= 50) {
    score = 1;
    rangeDescription = "41-50 bpm";
  } else if (hr <= 90) {
    score = 0;
    rangeDescription = "51-90 bpm";
  } else if (hr <= 110) {
    score = 1;
    rangeDescription = "91-110 bpm";
  } else if (hr <= 130) {
    score = 2;
    rangeDescription = "111-130 bpm";
  } else {
    score = 3;
    rangeDescription = "\u2265131 bpm";
  }

  return { name: "Heart Rate", value: hr, score, rangeDescription };
}

function scoreTemperature(temp: number): NEWS2Parameter {
  let score: number;
  let rangeDescription: string;

  if (temp <= 35.0) {
    score = 3;
    rangeDescription = "\u226435.0\u00b0C";
  } else if (temp <= 36.0) {
    score = 1;
    rangeDescription = "35.1-36.0\u00b0C";
  } else if (temp <= 38.0) {
    score = 0;
    rangeDescription = "36.1-38.0\u00b0C";
  } else if (temp <= 39.0) {
    score = 1;
    rangeDescription = "38.1-39.0\u00b0C";
  } else {
    score = 2;
    rangeDescription = "\u226539.1\u00b0C";
  }

  return { name: "Temperature", value: temp, score, rangeDescription };
}

function scoreConsciousness(): NEWS2Parameter {
  // We do not currently track GCS / AVPU so consciousness always scores 0.
  return {
    name: "Consciousness (AVPU)",
    value: 0,
    score: 0,
    rangeDescription: "Alert (default -- GCS/AVPU not tracked)",
  };
}

function scoreSupplementalOxygen(onOxygen: boolean): NEWS2Parameter {
  return {
    name: "Supplemental Oxygen",
    value: onOxygen ? 1 : 0,
    score: onOxygen ? 2 : 0,
    rangeDescription: onOxygen ? "Yes (supplemental O\u2082)" : "No (room air)",
  };
}

// ---------------------------------------------------------------------------
// Risk level determination
// ---------------------------------------------------------------------------

function determineRiskLevel(
  totalScore: number,
  parameters: NEWS2Parameter[],
): NEWS2Result["riskLevel"] {
  if (totalScore >= 7) {
    return "high";
  }

  if (totalScore >= 5) {
    return "medium";
  }

  // Check for any single parameter scoring 3 (individual trigger)
  const hasIndividualTrigger = parameters.some((p) => p.score === 3);
  if (hasIndividualTrigger) {
    return "low-key";
  }

  return "low";
}

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

/**
 * Calculate the NEWS2 (National Early Warning Score 2) for the given vitals.
 *
 * When `supplementalOxygen` is `true` the SpO2 Scale 2 scoring table is used
 * and 2 extra points are added for the supplemental oxygen parameter.
 *
 * @param vitals - Current patient vitals from the simulation state.
 * @param supplementalOxygen - Whether the patient is receiving supplemental
 *   oxygen. Defaults to `false`.
 * @returns A full NEWS2 result including total score, risk level, individual
 *   parameter breakdowns and the recommended clinical response.
 */
export function calculateNEWS2(
  vitals: Vitals,
  supplementalOxygen: boolean = false,
): NEWS2Result {
  const respirationParam = scoreRespirationRate(vitals.respRate);

  // Choose the appropriate SpO2 scale
  const spo2Param = supplementalOxygen
    ? scoreSpO2Scale2(vitals.spo2, true)
    : scoreSpO2Scale1(vitals.spo2);

  const systolicParam = scoreSystolicBP(vitals.bpSystolic);
  const heartRateParam = scoreHeartRate(vitals.hr);
  const temperatureParam = scoreTemperature(vitals.temp);
  const consciousnessParam = scoreConsciousness();
  const oxygenParam = scoreSupplementalOxygen(supplementalOxygen);

  const parameters: NEWS2Parameter[] = [
    respirationParam,
    spo2Param,
    systolicParam,
    heartRateParam,
    temperatureParam,
    consciousnessParam,
    oxygenParam,
  ];

  const totalScore = parameters.reduce((sum, p) => sum + p.score, 0);
  const riskLevel = determineRiskLevel(totalScore, parameters);
  const clinicalResponse = CLINICAL_RESPONSES[riskLevel];

  return {
    totalScore,
    riskLevel,
    parameters,
    clinicalResponse,
    supplementalOxygen,
  };
}

// ---------------------------------------------------------------------------
// Colour helper
// ---------------------------------------------------------------------------

/**
 * Return a Tailwind CSS colour class appropriate for the given NEWS2 risk
 * level. Useful for badges, borders, and text colouring in the UI.
 */
export function getNews2Color(riskLevel: NEWS2Result["riskLevel"]): string {
  switch (riskLevel) {
    case "low":
      return "text-green-600";
    case "low-key":
      return "text-yellow-500";
    case "medium":
      return "text-orange-500";
    case "high":
      return "text-red-600";
    default: {
      // Exhaustive check -- should never be reached
      const _exhaustive: never = riskLevel;
      return _exhaustive;
    }
  }
}
