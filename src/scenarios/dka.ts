import type { ScenarioDefinition } from "../types";

export const dkaScenario: ScenarioDefinition = {
  id: "dka-34f",
  name: "Diabetic Ketoacidosis in a 34-Year-Old Female",
  description:
    "Ms. Reyes presents with nausea, vomiting, abdominal pain, and Kussmaul breathing. Known type 1 diabetic who ran out of insulin.",
  patientName: "Ms. Reyes",
  patientPersona: `You are Ms. Reyes, a 34-year-old woman with type 1 diabetes. You ran out of insulin three days ago because you lost your job and couldn't afford it.
You feel terrible — nauseous, vomiting, stomach pain, and you're breathing fast. Your mouth is very dry and you feel weak.
You speak in short sentences because you're exhausted. You feel guilty about not taking your insulin.
You can mention: running out of insulin, feeling sick for 3 days, vomiting, stomach cramps, being very thirsty, peeing a lot.
You don't know your blood sugar numbers - just that you feel awful.`,
  baselineVitals: {
    hr: 118,
    bpSystolic: 95,
    bpDiastolic: 58,
    spo2: 97,
    temp: 37.3,
    respRate: 28,
  },
  deteriorationRules: [
    {
      id: "no-fluids-dka",
      condition: "No IV fluids given",
      timerMinutes: 4,
      effect: { bpSystolic: 78, bpDiastolic: 45, hr: 130 },
      preventedBy: ["fluid_bolus", "give_fluids", "iv_fluids", "saline"],
    },
    {
      id: "no-insulin",
      condition: "No insulin infusion started",
      timerMinutes: 8,
      effect: { hr: 135, respRate: 34 },
      preventedBy: ["start_insulin_drip"],
    },
    {
      id: "no-potassium-check",
      condition: "Potassium not checked before insulin",
      timerMinutes: 12,
      effect: { hr: 140 },
      preventedBy: ["order_bmp", "check_blood_glucose"],
    },
  ],
  correctActions: [
    "check_vitals",
    "check_blood_glucose",
    "order_bmp",
    "fluid_bolus",
    "start_insulin_drip",
    "check_urine_ketones",
    "order_cbc",
    "order_abg",
    "establish_iv_access",
  ],
  labResults: {
    blood_glucose: "Glucose: 32.4 mmol/L (583 mg/dL) — CRITICAL HIGH",
    bmp: "Na: 131 (low), K: 5.6 (high — check before insulin), Cr: 1.6 (elevated), BUN: 34, HCO3: 8 (critically low), Anion Gap: 28 (elevated)",
    urine_ketones: "Urine ketones: 3+ (large)",
    abg: "pH: 7.12 (acidotic), pCO2: 18 mmHg (compensatory), pO2: 98 mmHg, HCO3: 6 mEq/L, BE: -20",
    cbc: "WBC: 14,200/uL (elevated — stress response), Hgb: 15.8 g/dL (hemoconcentration), Plt: 280,000/uL",
    lactate: "Lactate: 2.8 mmol/L (mildly elevated)",
    liver_enzymes: "AST: 45 U/L (mildly elevated), ALT: 38 U/L, ALP: 95 U/L",
    ecg: "Sinus tachycardia, rate 118. Peaked T-waves in V2-V4 consistent with hyperkalaemia. No ST changes.",
  },
};
