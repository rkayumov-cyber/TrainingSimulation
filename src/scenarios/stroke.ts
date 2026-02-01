import type { ScenarioDefinition } from "../types";

export const strokeScenario: ScenarioDefinition = {
  id: "stroke-58m",
  name: "Acute Ischaemic Stroke in a 58-Year-Old Male",
  description:
    "Mr. Davis presents with sudden-onset left-sided weakness, facial droop, and slurred speech. Time-critical assessment for thrombolysis eligibility.",
  patientName: "Mr. Davis",
  patientPersona: `You are Mr. Davis, a 58-year-old man. You woke up with weakness on your left side and your speech is slurred.
You are frightened and confused. Your left arm feels heavy and won't move properly. Your face feels droopy on the left.
You speak slowly and your words come out garbled sometimes. You may struggle to find the right words.
You can mention: your arm not working, face feeling numb, trouble speaking, headache, feeling scared.
You don't understand medical terms - you're a retired electrician.`,
  baselineVitals: {
    hr: 88,
    bpSystolic: 185,
    bpDiastolic: 105,
    spo2: 96,
    temp: 36.9,
    respRate: 18,
  },
  deteriorationRules: [
    {
      id: "no-ct-head",
      condition: "No CT head ordered",
      timerMinutes: 8,
      effect: { bpSystolic: 210, bpDiastolic: 120 },
      preventedBy: ["order_ct_head", "order_ct_angio"],
    },
    {
      id: "no-bp-control",
      condition: "No blood pressure management",
      timerMinutes: 10,
      effect: { bpSystolic: 220, bpDiastolic: 130, hr: 55 },
      preventedBy: ["administer_labetalol", "administer_nicardipine"],
    },
    {
      id: "no-tpa",
      condition: "No thrombolysis within window",
      timerMinutes: 15,
      effect: { bpSystolic: 200, bpDiastolic: 115 },
      preventedBy: ["administer_tpa"],
    },
  ],
  correctActions: [
    "check_vitals",
    "check_nihss",
    "order_ct_head",
    "order_ct_angio",
    "check_blood_glucose",
    "order_coagulation",
    "administer_tpa",
    "administer_labetalol",
  ],
  labResults: {
    ct_head:
      "No acute haemorrhage. No early ischaemic changes. No mass effect.",
    ct_angio:
      "Occlusion of right M1 segment of middle cerebral artery. No significant carotid stenosis.",
    blood_glucose: "Glucose: 6.2 mmol/L (normal)",
    coagulation:
      "PT: 12.1s, INR: 1.0, aPTT: 28s, Fibrinogen: 3.2 g/L — all within normal limits",
    cbc: "WBC: 8,200/uL, Hgb: 14.1 g/dL, Plt: 210,000/uL",
    bmp: "Na: 141, K: 4.0, Cr: 0.9, BUN: 18",
    ecg: "Normal sinus rhythm, rate 88. No atrial fibrillation. No ST changes.",
    nihss:
      "NIHSS Score: 14 — Left facial droop (1), left arm drift (3), left leg drift (2), dysarthria (2), sensory loss (1), gaze preference (1), extinction (1), language (3)",
  },
};
