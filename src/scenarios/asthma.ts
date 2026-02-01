import type { ScenarioDefinition } from "../types";

export const asthmaScenario: ScenarioDefinition = {
  id: "asthma-19m",
  name: "Severe Asthma Exacerbation in a 19-Year-Old",
  description:
    "Jake presents with acute asthma attack after running out of his inhaler. Significant respiratory distress.",
  patientName: "Jake",
  patientPersona: `You are Jake, a 19-year-old college student having a severe asthma attack.
You ran out of your inhaler two days ago and couldn't afford to refill it.
You can barely speak more than a few words at a time because you're so short of breath.
You are sitting forward, using your arms to help you breathe.
You feel like you're breathing through a straw. You are scared and exhausted from trying to breathe.
You have had asthma since childhood but this is the worst attack you've ever had.`,
  baselineVitals: {
    hr: 115,
    bpSystolic: 130,
    bpDiastolic: 80,
    spo2: 88,
    temp: 37.1,
    respRate: 32,
  },
  deteriorationRules: [
    {
      id: "no-bronchodilator",
      condition: "No bronchodilator given",
      timerMinutes: 3,
      effect: { spo2: 82, respRate: 38, hr: 130 },
      preventedBy: [
        "give_salbutamol",
        "give_albuterol",
        "give_nebulizer",
        "bronchodilator",
        "give_ventolin",
      ],
    },
    {
      id: "no-steroids-asthma",
      condition: "No steroids given",
      timerMinutes: 5,
      effect: { respRate: 35 },
      preventedBy: [
        "give_steroids",
        "give_prednisone",
        "give_hydrocortisone",
        "give_methylprednisolone",
      ],
    },
    {
      id: "no-oxygen-asthma",
      condition: "No oxygen given",
      timerMinutes: 3,
      effect: { spo2: 80 },
      preventedBy: ["administer_oxygen", "apply_oxygen", "give_oxygen"],
    },
  ],
  correctActions: [
    "administer_oxygen",
    "give_salbutamol",
    "give_steroids",
    "give_ipratropium",
    "check_peak_flow",
    "order_chest_xray",
    "order_abg",
    "establish_iv_access",
  ],
  labResults: {
    peak_flow:
      "Peak flow: 150 L/min (predicted 550 L/min) - 27% of predicted, severe obstruction",
    chest_xray: "Hyperinflated lungs. No pneumothorax. No focal consolidation.",
    abg: "pH: 7.38, pCO2: 42, pO2: 58, HCO3: 24 (hypoxemia, normal CO2 concerning for fatigue)",
    ecg: "Sinus tachycardia, rate 115. No ischemic changes.",
    cbc: "WBC: 9,800/μL, Hgb: 15.1 g/dL, Plt: 280,000/μL",
  },
};
