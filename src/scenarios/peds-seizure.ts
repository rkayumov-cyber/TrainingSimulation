import type { ScenarioDefinition } from "../types";

export const pedsSeizureScenario: ScenarioDefinition = {
  id: "peds-seizure-4m",
  name: "Pediatric Febrile Status Epilepticus in a 4-Year-Old Male",
  description:
    "Liam, 4 years old, brought in by his mother while actively seizing. He has a fever and has been seizing for over 5 minutes. Mother is hysterical.",
  patientName: "Liam (via Mum)",
  patientPersona: `You are Liam's mother, Sarah. Your 4-year-old son is having a seizure and you are terrified.
You speak frantically and quickly. You keep asking if your son is going to be okay.
You can tell the doctor: Liam had a runny nose and fever since yesterday, he was playing and then started shaking, his eyes rolled back, he hasn't stopped shaking for about 5 minutes, he has no history of seizures, he's not on any medications, no allergies that you know of.
You don't understand medical terminology. You call the seizure "shaking" or "fitting".
If the doctor uses big words, ask them to explain.`,
  baselineVitals: {
    hr: 160,
    bpSystolic: 95,
    bpDiastolic: 55,
    spo2: 91,
    temp: 39.8,
    respRate: 30,
  },
  deteriorationRules: [
    {
      id: "no-benzo",
      condition: "No benzodiazepine given to stop seizure",
      timerMinutes: 3,
      effect: { spo2: 85, hr: 175, respRate: 36 },
      preventedBy: ["administer_diazepam"],
    },
    {
      id: "no-oxygen-peds",
      condition: "No oxygen administered",
      timerMinutes: 2,
      effect: { spo2: 82 },
      preventedBy: ["administer_oxygen", "apply_oxygen"],
    },
    {
      id: "no-glucose-check",
      condition: "Blood glucose not checked",
      timerMinutes: 6,
      effect: { hr: 170 },
      preventedBy: ["check_blood_glucose"],
    },
  ],
  correctActions: [
    "check_airway",
    "administer_oxygen",
    "administer_diazepam",
    "check_blood_glucose",
    "check_vitals",
    "establish_iv_access",
    "give_antipyretic",
    "order_cbc",
    "order_bmp",
  ],
  labResults: {
    blood_glucose: "Glucose: 4.8 mmol/L (normal)",
    cbc: "WBC: 15,400/uL (elevated — infection), Hgb: 11.8 g/dL, Plt: 320,000/uL",
    bmp: "Na: 136, K: 4.2, Cr: 0.3, BUN: 12, HCO3: 20",
    urinalysis: "Clear, no infection",
    blood_cultures: "Pending (results in 24-48 hours)",
    ecg: "Sinus tachycardia, rate 160. Age-appropriate. No arrhythmia.",
  },
};
