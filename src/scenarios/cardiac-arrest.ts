import type { ScenarioDefinition } from "../types";

export const cardiacArrestScenario: ScenarioDefinition = {
  id: "cardiac-arrest-55m",
  name: "Cardiac Arrest (VF) in a 55-Year-Old Male",
  description:
    "Mr. Patel collapses in the ED waiting room. Witnessed cardiac arrest with initial rhythm ventricular fibrillation. Immediate ACLS protocol required.",
  patientName: "Mr. Patel",
  patientPersona: `You are Mr. Patel, a 55-year-old man. You are currently in cardiac arrest and CANNOT speak or respond.
Before the arrest, you came to the ED with chest pain and shortness of breath that started 30 minutes ago.
If resuscitated, you will be groggy and confused. You might mumble about chest pain.
A bystander (another patient) can tell the doctor: "He was sitting in the waiting room complaining about his chest, then he just collapsed!"
You have no medical history that anyone knows of. You were carrying a wallet with an ID but no medical alert bracelet.`,
  baselineVitals: {
    hr: 0,
    bpSystolic: 0,
    bpDiastolic: 0,
    spo2: 0,
    temp: 36.5,
    respRate: 0,
  },
  deteriorationRules: [
    {
      id: "no-cpr",
      condition: "CPR not started",
      timerMinutes: 1,
      effect: {},
      preventedBy: ["start_cpr"],
    },
    {
      id: "no-defib",
      condition: "No defibrillation attempt",
      timerMinutes: 2,
      effect: {},
      preventedBy: ["defibrillate"],
    },
    {
      id: "no-airway-management",
      condition: "No airway management",
      timerMinutes: 3,
      effect: {},
      preventedBy: ["bag_valve_mask", "check_airway"],
    },
  ],
  correctActions: [
    "start_cpr",
    "defibrillate",
    "bag_valve_mask",
    "establish_iv_access",
    "give_epinephrine",
    "administer_amiodarone",
    "check_rhythm",
    "order_abg",
    "order_ecg",
  ],
  labResults: {
    rhythm_check: "Ventricular fibrillation (VF) — shockable rhythm",
    ecg: "Post-ROSC: Wide-complex tachycardia transitioning to sinus tachycardia. ST elevation in leads II, III, aVF — inferior STEMI.",
    abg: "pH: 7.18, pCO2: 52 mmHg, pO2: 68 mmHg, HCO3: 14 mEq/L, Lactate: 8.4 mmol/L — mixed respiratory and metabolic acidosis",
    troponin: "Troponin I: 12.4 ng/mL (CRITICAL HIGH)",
    cbc: "WBC: 12,400/uL, Hgb: 13.5 g/dL, Plt: 198,000/uL",
    bmp: "Na: 140, K: 5.8 (HIGH — cardiac arrest), Cr: 1.3, BUN: 24",
    blood_glucose: "Glucose: 14.2 mmol/L (elevated — stress response)",
  },
};
