import type { ScenarioDefinition } from "../types";

export const eclampsiaScenario: ScenarioDefinition = {
  id: "eclampsia-29f",
  name: "Eclampsia in a 29-Year-Old Female (34 weeks)",
  description:
    "Mrs. Okafor, 34 weeks pregnant, presents with severe headache, visual disturbances, and a witnessed tonic-clonic seizure. BP critically elevated.",
  patientName: "Mrs. Okafor",
  patientPersona: `You are Mrs. Okafor, a 29-year-old woman who is 34 weeks pregnant with your first baby.
You just had a seizure and you're confused and scared. Your head is pounding and you see flashing lights.
You feel swollen — your face and hands are puffy. Your stomach hurts on the upper right side.
You speak slowly and are disoriented. You keep asking about your baby.
You can mention: terrible headache, seeing spots/flashing lights, face and hands being swollen, right upper belly pain, feeling confused.
You don't understand medical terms. You just want to know if your baby is safe.`,
  baselineVitals: {
    hr: 105,
    bpSystolic: 180,
    bpDiastolic: 115,
    spo2: 94,
    temp: 37.4,
    respRate: 22,
  },
  deteriorationRules: [
    {
      id: "no-magnesium",
      condition: "No magnesium sulfate given",
      timerMinutes: 4,
      effect: { bpSystolic: 200, bpDiastolic: 130, hr: 115 },
      preventedBy: ["administer_magnesium"],
    },
    {
      id: "no-bp-control-eclampsia",
      condition: "No antihypertensive treatment",
      timerMinutes: 6,
      effect: { bpSystolic: 210, bpDiastolic: 135 },
      preventedBy: ["administer_labetalol", "administer_nicardipine"],
    },
    {
      id: "no-fetal-monitoring",
      condition: "Fetal heart rate not checked",
      timerMinutes: 5,
      effect: {},
      preventedBy: ["check_fetal_heart"],
    },
  ],
  correctActions: [
    "check_vitals",
    "administer_magnesium",
    "administer_labetalol",
    "check_fetal_heart",
    "check_proteinuria",
    "order_cbc",
    "order_bmp",
    "order_liver_enzymes",
    "prepare_for_delivery",
  ],
  labResults: {
    proteinuria: "Urine protein: 3+ (significant proteinuria)",
    cbc: "WBC: 11,200/uL, Hgb: 10.8 g/dL, Plt: 88,000/uL (LOW — concerning for HELLP)",
    bmp: "Na: 138, K: 4.3, Cr: 1.2 (elevated), BUN: 22, Uric acid: 8.1 mg/dL (elevated)",
    liver_enzymes:
      "AST: 185 U/L (HIGH), ALT: 210 U/L (HIGH), LDH: 680 U/L (HIGH) — consistent with HELLP syndrome",
    coagulation:
      "PT: 11.8s, INR: 1.0, aPTT: 29s, Fibrinogen: 2.8 g/L, D-dimer: elevated",
    fetal_heart:
      "Fetal heart rate: 155 bpm. Moderate variability. Occasional late decelerations — concerning for fetal distress.",
    ecg: "Sinus tachycardia, rate 105. No ST changes. Left ventricular strain pattern.",
  },
};
