import type { ScenarioDefinition } from "../types";

export const anaphylaxisScenario: ScenarioDefinition = {
  id: "anaphylaxis-28f",
  name: "Anaphylaxis in a 28-Year-Old Female",
  description:
    "Ms. Chen develops severe allergic reaction after eating at a restaurant. Rapid deterioration requiring immediate treatment.",
  patientName: "Ms. Chen",
  patientPersona: `You are Ms. Chen, a 28-year-old woman having a severe allergic reaction.
You ate something with peanuts 15 minutes ago and now you can barely breathe.
Your throat feels like it's closing up. Your skin is itchy everywhere and you have hives.
You are terrified and panicking. You feel dizzy and your heart is racing.
You have a known peanut allergy but forgot to ask about ingredients.
Speak in short, gasping sentences because breathing is very difficult.`,
  baselineVitals: {
    hr: 120,
    bpSystolic: 85,
    bpDiastolic: 50,
    spo2: 89,
    temp: 37.0,
    respRate: 28,
  },
  deteriorationRules: [
    {
      id: "no-epi",
      condition: "No epinephrine given",
      timerMinutes: 2,
      effect: { bpSystolic: 60, bpDiastolic: 35, spo2: 80, hr: 140 },
      preventedBy: [
        "give_epinephrine",
        "administer_epinephrine",
        "give_adrenaline",
        "epipen",
      ],
    },
    {
      id: "no-fluids-anaph",
      condition: "No IV fluids given",
      timerMinutes: 3,
      effect: { bpSystolic: 70, bpDiastolic: 40 },
      preventedBy: ["fluid_bolus", "give_fluids", "iv_fluids", "saline"],
    },
    {
      id: "no-oxygen-anaph",
      condition: "No oxygen given",
      timerMinutes: 2,
      effect: { spo2: 75 },
      preventedBy: ["administer_oxygen", "apply_oxygen", "give_oxygen"],
    },
  ],
  correctActions: [
    "give_epinephrine",
    "administer_oxygen",
    "fluid_bolus",
    "give_antihistamine",
    "give_steroids",
    "establish_iv_access",
    "check_airway",
  ],
  labResults: {
    ecg: "Sinus tachycardia, rate 120. No ischemic changes.",
    cbc: "WBC: 8,500/μL, Hgb: 13.2 g/dL, Plt: 220,000/μL",
    bmp: "Na: 139, K: 3.9, Cr: 0.8, Glucose: 110",
    tryptase: "Serum tryptase: 45 ng/mL (elevated, confirms anaphylaxis)",
    abg: "pH: 7.32, pCO2: 32, pO2: 65, HCO3: 18 (respiratory alkalosis with hypoxemia)",
  },
};
