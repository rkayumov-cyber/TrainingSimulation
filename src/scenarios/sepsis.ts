import type { ScenarioDefinition } from "../types";

export const sepsisScenario: ScenarioDefinition = {
  id: "sepsis-72f",
  name: "Acute Sepsis in a 72-Year-Old Female",
  description:
    "Mrs. Gable presents with confusion, shivering, and signs of sepsis. Requires prompt assessment and Sepsis Bundle initiation.",
  patientName: "Mrs. Gable",
  patientPersona: `You are Mrs. Gable, a 72-year-old woman. You are confused, shivering, and just want to sleep.
You speak in simple, non-medical language. You don't understand medical jargon.
You feel very cold and weak. Your thinking is foggy. You might repeat yourself or give vague answers.
You can mention: feeling cold, being tired, not remembering much, wanting to sleep, having a headache.
You don't know your blood pressure or heart rate - you're not a medical professional.`,
  baselineVitals: {
    hr: 105,
    bpSystolic: 105,
    bpDiastolic: 65,
    spo2: 91,
    temp: 39.1,
    respRate: 22,
  },
  deteriorationRules: [
    {
      id: "no-oxygen",
      condition: "No oxygen administered",
      timerMinutes: 3,
      effect: { spo2: 85 },
      preventedBy: ["administer_oxygen", "apply_oxygen", "give_oxygen"],
    },
    {
      id: "no-fluids",
      condition: "No IV fluids given",
      timerMinutes: 4,
      effect: { bpSystolic: 85, bpDiastolic: 50 },
      preventedBy: ["fluid_bolus", "give_fluids", "iv_fluids", "saline"],
    },
    {
      id: "no-antibiotics",
      condition: "No antibiotics administered",
      timerMinutes: 10,
      effect: { hr: 130, bpSystolic: 70, bpDiastolic: 40 },
      preventedBy: [
        "administer_antibiotics",
        "give_antibiotics",
        "start_antibiotics",
      ],
    },
  ],
  correctActions: [
    "administer_oxygen",
    "fluid_bolus",
    "order_blood_cultures",
    "administer_antibiotics",
    "check_heart_sounds",
    "check_lung_sounds",
    "order_lactate",
    "order_cbc",
    "order_bmp",
  ],
  labResults: {
    blood_cultures: "Pending (results in 24-48 hours)",
    lactate: "4.2 mmol/L (elevated)",
    cbc: "WBC: 18,500/μL (elevated), Hgb: 11.2 g/dL, Plt: 145,000/μL",
    bmp: "Na: 138, K: 4.1, Cr: 1.8 (elevated), BUN: 32",
    urinalysis:
      "WBC: 50-100/hpf, Nitrites: Positive, Leukocyte esterase: Positive",
    chest_xray: "No acute infiltrates. Mild cardiomegaly.",
    ecg: "Sinus tachycardia, rate 105. No ST changes.",
  },
};
