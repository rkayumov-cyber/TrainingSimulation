import type { ScenarioDefinition } from "../types";

export const miScenario: ScenarioDefinition = {
  id: "mi-65m",
  name: "Acute MI in a 65-Year-Old Male",
  description:
    "Mr. Thompson presents with crushing chest pain radiating to his left arm. Classic STEMI presentation requiring urgent intervention.",
  patientName: "Mr. Thompson",
  patientPersona: `You are Mr. Thompson, a 65-year-old man having a heart attack.
You have severe crushing chest pain that started 30 minutes ago.
The pain radiates to your left arm and jaw. You feel like an elephant is sitting on your chest.
You are sweating profusely and feel nauseous. You are very anxious and scared.
You keep your answers short because talking is difficult with the pain.
You have a history of high blood pressure and diabetes. You smoke half a pack a day.`,
  baselineVitals: {
    hr: 95,
    bpSystolic: 150,
    bpDiastolic: 95,
    spo2: 94,
    temp: 36.8,
    respRate: 20,
  },
  deteriorationRules: [
    {
      id: "no-aspirin",
      condition: "No aspirin given",
      timerMinutes: 5,
      effect: { hr: 110, bpSystolic: 130 },
      preventedBy: ["give_aspirin", "administer_aspirin"],
    },
    {
      id: "no-nitro",
      condition: "No nitroglycerin given",
      timerMinutes: 4,
      effect: { bpSystolic: 170, hr: 105 },
      preventedBy: ["give_nitro", "nitroglycerin", "give_gtn"],
    },
    {
      id: "no-oxygen-mi",
      condition: "No oxygen for hypoxia",
      timerMinutes: 6,
      effect: { spo2: 88 },
      preventedBy: ["administer_oxygen", "apply_oxygen", "give_oxygen"],
    },
  ],
  correctActions: [
    "administer_oxygen",
    "give_aspirin",
    "give_nitro",
    "order_ecg",
    "order_troponin",
    "give_morphine",
    "establish_iv_access",
    "order_chest_xray",
  ],
  labResults: {
    ecg: "ST elevation in leads V1-V4, II, III, aVF. Acute anterolateral STEMI.",
    troponin: "Troponin I: 2.5 ng/mL (elevated, normal <0.04)",
    cbc: "WBC: 11,200/μL, Hgb: 14.1 g/dL, Plt: 245,000/μL",
    bmp: "Na: 140, K: 4.3, Cr: 1.1, Glucose: 185",
    chest_xray: "Mild cardiomegaly. No acute pulmonary edema.",
    coagulation: "PT: 12.5s, INR: 1.0, PTT: 28s",
  },
};
