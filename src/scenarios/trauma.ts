import type { ScenarioDefinition } from "../types";

export const traumaScenario: ScenarioDefinition = {
  id: "trauma-42m",
  name: "Multi-Trauma (ATLS) in a 42-Year-Old Male",
  description:
    "Mr. Kowalski, restrained driver in a high-speed RTC. Presents with chest pain, abdominal guarding, and an unstable pelvis. Primary survey required.",
  patientName: "Mr. Kowalski",
  patientPersona: `You are Mr. Kowalski, a 42-year-old man who was in a car crash. You are in severe pain and very scared.
Your chest hurts badly on the right side, especially when you breathe. Your stomach hurts and you feel dizzy.
You are agitated and keep asking "Am I going to die?" You speak in short, pained bursts.
You can mention: the car crash, chest pain when breathing, stomach pain, feeling dizzy, being scared, pain in your pelvis/hips.
You don't remember everything about the crash. You were wearing a seatbelt.`,
  baselineVitals: {
    hr: 125,
    bpSystolic: 90,
    bpDiastolic: 55,
    spo2: 92,
    temp: 36.2,
    respRate: 26,
  },
  deteriorationRules: [
    {
      id: "no-oxygen-trauma",
      condition: "No oxygen administered",
      timerMinutes: 2,
      effect: { spo2: 84 },
      preventedBy: ["administer_oxygen", "apply_oxygen"],
    },
    {
      id: "no-fluids-trauma",
      condition: "No IV fluids or blood products",
      timerMinutes: 5,
      effect: { bpSystolic: 70, bpDiastolic: 40, hr: 140 },
      preventedBy: ["fluid_bolus", "order_blood_type_crossmatch"],
    },
    {
      id: "no-chest-intervention",
      condition: "No chest drain for pneumothorax",
      timerMinutes: 7,
      effect: { spo2: 78, respRate: 34, bpSystolic: 75 },
      preventedBy: ["insert_chest_drain"],
    },
    {
      id: "no-fast-scan",
      condition: "No FAST scan performed",
      timerMinutes: 10,
      effect: { bpSystolic: 65, bpDiastolic: 35 },
      preventedBy: ["order_fast_scan"],
    },
  ],
  correctActions: [
    "check_airway",
    "administer_oxygen",
    "check_lung_sounds",
    "insert_chest_drain",
    "establish_iv_access",
    "fluid_bolus",
    "order_fast_scan",
    "check_gcs",
    "order_blood_type_crossmatch",
    "order_pelvis_xray",
  ],
  labResults: {
    fast_scan:
      "FAST: Positive — free fluid in Morrison's pouch and left paracolic gutter. Pericardium clear. Pelvis: Free fluid present.",
    gcs: "GCS: E3 V4 M6 = 13/15 (Eyes: to voice, Verbal: confused, Motor: obeys commands)",
    pelvis_xray:
      "Pelvis X-ray: Disruption of left sacroiliac joint. Widened pubic symphysis. Consistent with open-book pelvic fracture.",
    chest_xray:
      "Right-sided pneumothorax with partial lung collapse. No mediastinal shift. Right rib fractures 5-8.",
    blood_type_crossmatch:
      "Blood type: O positive. Crossmatch: 4 units pRBC ready.",
    cbc: "WBC: 16,800/uL, Hgb: 9.2 g/dL (dropping — acute blood loss), Plt: 195,000/uL",
    bmp: "Na: 139, K: 3.8, Cr: 1.1, BUN: 22, Lactate: 4.8 mmol/L (elevated)",
    coagulation: "PT: 13.5s, INR: 1.1, aPTT: 30s, Fibrinogen: 2.1 g/L",
    ecg: "Sinus tachycardia, rate 125. No ST changes. Low voltage in precordial leads.",
  },
};
