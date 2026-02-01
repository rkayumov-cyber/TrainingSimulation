import type { ScenarioDefinition } from "../types";

export const overdoseScenario: ScenarioDefinition = {
  id: "overdose-22m",
  name: "Opioid Overdose / Poisoning in a 22-Year-Old Male",
  description:
    "Tyler found unresponsive by friends at a party. Pinpoint pupils, respiratory depression, needle marks. Suspected opioid overdose requiring immediate reversal.",
  patientName: "Tyler",
  patientPersona: `You are Tyler, a 22-year-old man. You are barely conscious from an opioid overdose.
Initially you can barely respond — just groaning. Your breathing is very slow and shallow.
If naloxone is given, you wake up confused and agitated. You may deny drug use at first.
After waking: "What... where am I? Leave me alone! I'm fine!" You become irritable.
You eventually admit you used heroin at a party. You're scared but defensive.
A friend brought you in and can say: "We found him on the bathroom floor. He wasn't breathing right. I think he used something."`,
  baselineVitals: {
    hr: 55,
    bpSystolic: 88,
    bpDiastolic: 52,
    spo2: 82,
    temp: 36.0,
    respRate: 6,
  },
  deteriorationRules: [
    {
      id: "no-naloxone",
      condition: "No naloxone administered",
      timerMinutes: 3,
      effect: { spo2: 70, respRate: 4, hr: 45, bpSystolic: 75 },
      preventedBy: ["administer_naloxone"],
    },
    {
      id: "no-oxygen-od",
      condition: "No oxygen administered",
      timerMinutes: 2,
      effect: { spo2: 72 },
      preventedBy: ["administer_oxygen", "bag_valve_mask"],
    },
    {
      id: "no-airway-od",
      condition: "Airway not assessed",
      timerMinutes: 4,
      effect: { spo2: 68, respRate: 3 },
      preventedBy: ["check_airway", "bag_valve_mask"],
    },
  ],
  correctActions: [
    "check_airway",
    "administer_oxygen",
    "bag_valve_mask",
    "administer_naloxone",
    "establish_iv_access",
    "check_pupils",
    "check_vitals",
    "order_toxicology_screen",
    "order_bmp",
  ],
  labResults: {
    toxicology_screen:
      "Urine tox screen: Opioids POSITIVE, Benzodiazepines NEGATIVE, Amphetamines NEGATIVE, Cocaine NEGATIVE, Cannabis POSITIVE, Alcohol: 0.04 g/dL",
    abg: "pH: 7.22, pCO2: 65 mmHg (respiratory acidosis), pO2: 55 mmHg (hypoxic), HCO3: 24 mEq/L, Lactate: 3.1 mmol/L",
    cbc: "WBC: 7,800/uL, Hgb: 14.6 g/dL, Plt: 245,000/uL",
    bmp: "Na: 140, K: 4.1, Cr: 0.8, BUN: 14, Glucose: 5.8 mmol/L",
    blood_glucose: "Glucose: 5.8 mmol/L (normal)",
    ecg: "Sinus bradycardia, rate 55. QTc: 440ms. No ST changes.",
    liver_enzymes: "AST: 32 U/L, ALT: 28 U/L — normal",
  },
};
