import type { Vitals } from "../types/simulation";

export type TemplateCategory =
  | "cardiac"
  | "respiratory"
  | "neurological"
  | "obstetric"
  | "pediatric"
  | "trauma"
  | "metabolic"
  | "toxicological"
  | "allergy"
  | "gastrointestinal"
  | "infectious"
  | "renal"
  | "pulmonary"
  | "neonatal"
  | "burns"
  | "psychiatric"
  | "surgical"
  | "geriatric"
  | "chest_pain"
  | "respiratory_failure";

export interface ScenarioTemplate {
  id: string;
  category: TemplateCategory;
  name: string;
  description: string;
  baselineVitals: Vitals;
  deteriorationRules: {
    id: string;
    condition: string;
    timerMinutes: number;
    effect: Partial<Vitals>;
    preventedBy: string[];
  }[];
  correctActions: string[];
  labResults: Record<string, string>;
  suggestedBenchmark: {
    expectedActions: {
      action: string;
      label: string;
      required: boolean;
      maxTimeMinutes: number;
      points: number;
    }[];
    expectedSequences: { before: string; after: string; points: number; penalty: number }[];
    timingThresholds: { action: string; gradeA: number; gradeB: number; gradeC: number; gradeD: number }[];
    passingScore: number;
  };
  patientPersonaTemplate: string;
  tags: string[];
}

export const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
  // ── CARDIAC ──
  {
    id: "tpl-cardiac",
    category: "cardiac",
    name: "Cardiac Emergency — STEMI",
    description:
      "ST-elevation myocardial infarction with acute chest pain, diaphoresis, and hemodynamic instability. Requires rapid ECG, aspirin, anticoagulation, and cath lab activation.",
    baselineVitals: {
      hr: 110,
      bpSystolic: 90,
      bpDiastolic: 60,
      spo2: 94,
      temp: 36.8,
      respRate: 22,
    },
    deteriorationRules: [
      {
        id: "no-aspirin",
        condition: "No aspirin administered",
        timerMinutes: 5,
        effect: { hr: 130, bpSystolic: 75 },
        preventedBy: ["administer_aspirin"],
      },
      {
        id: "no-ecg",
        condition: "ECG not ordered",
        timerMinutes: 3,
        effect: { hr: 140 },
        preventedBy: ["order_ecg", "ecg_12_lead"],
      },
      {
        id: "no-oxygen",
        condition: "No oxygen for desaturation",
        timerMinutes: 4,
        effect: { spo2: 88 },
        preventedBy: ["administer_oxygen"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "administer_aspirin",
      "order_ecg",
      "ecg_12_lead",
      "administer_nitroglycerin",
      "administer_morphine",
      "administer_heparin",
      "order_troponin",
      "order_cbc",
      "order_bmp",
      "check_heart_sounds",
      "check_lung_sounds",
      "iv_access",
      "activate_cath_lab",
    ],
    labResults: {
      troponin: "Elevated: 2.5 ng/mL (Normal < 0.04)",
      ecg: "ST-elevation in leads II, III, aVF — inferior STEMI",
      cbc: "WBC 9,200/uL, Hgb 13.5 g/dL, Platelets 245,000",
      bmp: "Na 140, K 4.1, Cr 1.0, Glucose 165",
      bnp: "BNP 850 pg/mL (elevated)",
      coagulation: "PT 12.5s, INR 1.0, aPTT 28s",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "order_ecg", label: "12-lead ECG", required: true, maxTimeMinutes: 2, points: 25 },
        { action: "administer_aspirin", label: "Aspirin 325mg", required: true, maxTimeMinutes: 5, points: 20 },
        { action: "administer_oxygen", label: "Supplemental O2", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "order_troponin", label: "Troponin", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "activate_cath_lab", label: "Cath Lab Activation", required: true, maxTimeMinutes: 10, points: 20 },
      ],
      expectedSequences: [
        { before: "order_ecg", after: "activate_cath_lab", points: 15, penalty: -10 },
        { before: "iv_access", after: "administer_heparin", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "order_ecg", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "administer_aspirin", gradeA: 120, gradeB: 240, gradeC: 360, gradeD: 600 },
      ],
      passingScore: 65,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}} with crushing chest pain radiating to my left arm. I'm sweating profusely and feel nauseous. The pain started about 45 minutes ago. I have a history of hypertension and smoking.",
    tags: ["cardiac", "STEMI", "emergency", "chest-pain"],
  },

  // ── RESPIRATORY ──
  {
    id: "tpl-respiratory",
    category: "respiratory",
    name: "Respiratory Failure — Severe Pneumonia",
    description:
      "Acute hypoxic respiratory failure from community-acquired pneumonia with septic features. Requires aggressive oxygenation, antibiotics, and close hemodynamic monitoring.",
    baselineVitals: {
      hr: 118,
      bpSystolic: 95,
      bpDiastolic: 58,
      spo2: 85,
      temp: 39.5,
      respRate: 28,
    },
    deteriorationRules: [
      {
        id: "no-oxygen-resp",
        condition: "No oxygen support",
        timerMinutes: 2,
        effect: { spo2: 78, respRate: 34 },
        preventedBy: ["administer_oxygen", "high_flow_nasal_cannula"],
      },
      {
        id: "no-abx-resp",
        condition: "No antibiotics",
        timerMinutes: 8,
        effect: { hr: 135, temp: 40.1, bpSystolic: 80 },
        preventedBy: ["administer_antibiotics"],
      },
      {
        id: "no-fluids-resp",
        condition: "No fluid resuscitation",
        timerMinutes: 5,
        effect: { bpSystolic: 78, bpDiastolic: 45 },
        preventedBy: ["fluid_bolus"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "high_flow_nasal_cannula",
      "administer_antibiotics",
      "fluid_bolus",
      "order_blood_cultures",
      "order_cbc",
      "order_bmp",
      "order_lactate",
      "order_chest_xray",
      "order_abg",
      "check_lung_sounds",
      "iv_access",
    ],
    labResults: {
      cbc: "WBC 22,500/uL (left shift), Hgb 11.2 g/dL, Platelets 180,000",
      bmp: "Na 137, K 3.8, Cr 1.4, BUN 28, Glucose 145",
      lactate: "4.8 mmol/L (elevated)",
      blood_cultures: "Pending (24-48 hours)",
      abg: "pH 7.32, pCO2 32, pO2 55 on RA, HCO3 18, BE -6",
      chest_xray: "Right lower lobe consolidation with air bronchograms. Small right pleural effusion.",
      procalcitonin: "8.5 ng/mL (elevated, suggests bacterial infection)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_oxygen", label: "Oxygen Therapy", required: true, maxTimeMinutes: 1, points: 25 },
        { action: "order_blood_cultures", label: "Blood Cultures", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "administer_antibiotics", label: "IV Antibiotics", required: true, maxTimeMinutes: 8, points: 20 },
        { action: "fluid_bolus", label: "IV Fluids", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "order_lactate", label: "Serum Lactate", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "order_chest_xray", label: "Chest X-ray", required: false, maxTimeMinutes: 10, points: 10 },
      ],
      expectedSequences: [
        { before: "order_blood_cultures", after: "administer_antibiotics", points: 20, penalty: -15 },
      ],
      timingThresholds: [
        { action: "administer_oxygen", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "administer_antibiotics", gradeA: 300, gradeB: 480, gradeC: 600, gradeD: 900 },
      ],
      passingScore: 60,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}} and I can barely breathe. I've had a cough with rusty sputum for 3 days that got much worse today. I feel very hot and my whole body aches. I'm dizzy when I try to stand.",
    tags: ["respiratory", "pneumonia", "sepsis", "hypoxia"],
  },

  // ── NEUROLOGICAL ──
  {
    id: "tpl-neurological",
    category: "neurological",
    name: "Acute Stroke — Large Vessel Occlusion",
    description:
      "Sudden-onset left-sided hemiparesis, facial droop, and aphasia consistent with large vessel ischemic stroke. Time-critical for thrombolysis within the treatment window.",
    baselineVitals: {
      hr: 88,
      bpSystolic: 185,
      bpDiastolic: 105,
      spo2: 96,
      temp: 37.0,
      respRate: 18,
    },
    deteriorationRules: [
      {
        id: "no-ct-stroke",
        condition: "No CT scan ordered",
        timerMinutes: 5,
        effect: { bpSystolic: 200, bpDiastolic: 115 },
        preventedBy: ["order_ct_head", "order_ct"],
      },
      {
        id: "delayed-tpa",
        condition: "tPA not administered in time",
        timerMinutes: 15,
        effect: { bpSystolic: 210 },
        preventedBy: ["administer_tpa", "administer_thrombolytics"],
      },
    ],
    correctActions: [
      "order_ct_head",
      "order_ct",
      "order_cbc",
      "order_bmp",
      "order_coagulation",
      "check_blood_glucose",
      "administer_tpa",
      "administer_thrombolytics",
      "neurological_exam",
      "iv_access",
      "check_pupils",
      "administer_labetalol",
    ],
    labResults: {
      ct_head: "No hemorrhage. Large vessel occlusion of right MCA visible. Hyperdense MCA sign.",
      cbc: "WBC 8,100/uL, Hgb 14.2 g/dL, Platelets 285,000",
      bmp: "Na 141, K 4.0, Cr 0.9, Glucose 128",
      coagulation: "PT 12.2s, INR 1.0, aPTT 27s",
      blood_glucose: "128 mg/dL",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "order_ct_head", label: "CT Head", required: true, maxTimeMinutes: 5, points: 25 },
        { action: "check_blood_glucose", label: "Blood Glucose", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "neurological_exam", label: "Neurological Exam (NIHSS)", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "administer_tpa", label: "tPA Administration", required: true, maxTimeMinutes: 15, points: 30 },
        { action: "order_coagulation", label: "Coagulation Studies", required: true, maxTimeMinutes: 5, points: 10 },
      ],
      expectedSequences: [
        { before: "order_ct_head", after: "administer_tpa", points: 20, penalty: -20 },
        { before: "order_coagulation", after: "administer_tpa", points: 15, penalty: -10 },
      ],
      timingThresholds: [
        { action: "order_ct_head", gradeA: 120, gradeB: 240, gradeC: 360, gradeD: 600 },
        { action: "administer_tpa", gradeA: 600, gradeB: 900, gradeC: 1200, gradeD: 1800 },
      ],
      passingScore: 65,
    },
    patientPersonaTemplate:
      "I... can't... talk right. My left side... won't move. My wife says my face... is drooping. It started... about {{onset}} ago. I take... blood pressure medication.",
    tags: ["neurological", "stroke", "thrombolysis", "time-critical"],
  },

  // ── OBSTETRIC ──
  {
    id: "tpl-obstetric",
    category: "obstetric",
    name: "Eclampsia — Seizure in Pregnancy",
    description:
      "38-week pregnant patient with eclamptic seizure, severe hypertension, and altered consciousness. Requires magnesium sulfate, BP control, and emergency delivery planning.",
    baselineVitals: {
      hr: 105,
      bpSystolic: 175,
      bpDiastolic: 110,
      spo2: 93,
      temp: 37.2,
      respRate: 24,
    },
    deteriorationRules: [
      {
        id: "no-mag-sulfate",
        condition: "No magnesium sulfate",
        timerMinutes: 4,
        effect: { bpSystolic: 190, hr: 120 },
        preventedBy: ["administer_magnesium", "administer_magnesium_sulfate"],
      },
      {
        id: "no-bp-control-obs",
        condition: "Blood pressure not controlled",
        timerMinutes: 6,
        effect: { bpSystolic: 200, bpDiastolic: 125 },
        preventedBy: ["administer_labetalol", "administer_hydralazine"],
      },
    ],
    correctActions: [
      "administer_magnesium",
      "administer_magnesium_sulfate",
      "administer_labetalol",
      "administer_hydralazine",
      "administer_oxygen",
      "iv_access",
      "fetal_monitoring",
      "order_cbc",
      "order_bmp",
      "order_liver_function",
      "order_urine_protein",
      "left_lateral_position",
      "call_obstetrics",
      "prepare_delivery",
    ],
    labResults: {
      cbc: "WBC 12,000/uL, Hgb 10.5 g/dL, Platelets 95,000 (LOW)",
      bmp: "Na 138, K 4.5, Cr 1.2, Uric acid 8.2 (elevated)",
      liver_function: "AST 285, ALT 310 (elevated), LDH 750 (elevated)",
      urine_protein: "3+ protein, protein:creatinine ratio 0.8",
      coagulation: "PT 13s, INR 1.1, Fibrinogen 180 (low-normal)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_magnesium", label: "Magnesium Sulfate", required: true, maxTimeMinutes: 3, points: 30 },
        { action: "administer_labetalol", label: "BP Control", required: true, maxTimeMinutes: 5, points: 20 },
        { action: "administer_oxygen", label: "Oxygen", required: true, maxTimeMinutes: 2, points: 10 },
        { action: "left_lateral_position", label: "Left Lateral Position", required: true, maxTimeMinutes: 2, points: 10 },
        { action: "fetal_monitoring", label: "Fetal Monitoring", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "call_obstetrics", label: "Call Obstetrics", required: true, maxTimeMinutes: 5, points: 15 },
      ],
      expectedSequences: [
        { before: "administer_magnesium", after: "prepare_delivery", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "administer_magnesium", gradeA: 120, gradeB: 180, gradeC: 300, gradeD: 480 },
      ],
      passingScore: 60,
    },
    patientPersonaTemplate:
      "I'm {{age}} years old and {{weeks}} weeks pregnant. I had a terrible headache and then everything went black. I can see spots and my vision is blurry. I'm scared for my baby.",
    tags: ["obstetric", "eclampsia", "hypertension", "pregnancy"],
  },

  // ── PEDIATRIC ──
  {
    id: "tpl-pediatric",
    category: "pediatric",
    name: "Pediatric Status Epilepticus",
    description:
      "5-year-old child with prolonged generalized tonic-clonic seizure. Requires stepwise anticonvulsant therapy, airway management, and identification of underlying cause.",
    baselineVitals: {
      hr: 145,
      bpSystolic: 95,
      bpDiastolic: 60,
      spo2: 90,
      temp: 39.2,
      respRate: 30,
    },
    deteriorationRules: [
      {
        id: "no-benzo-peds",
        condition: "No benzodiazepine given",
        timerMinutes: 3,
        effect: { spo2: 84, hr: 160 },
        preventedBy: ["administer_diazepam", "administer_lorazepam", "administer_midazolam"],
      },
      {
        id: "no-oxygen-peds",
        condition: "No oxygen support",
        timerMinutes: 2,
        effect: { spo2: 82 },
        preventedBy: ["administer_oxygen"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "administer_diazepam",
      "administer_lorazepam",
      "administer_midazolam",
      "check_blood_glucose",
      "iv_access",
      "order_cbc",
      "order_bmp",
      "check_pupils",
      "rectal_temperature",
      "administer_antipyretic",
      "recovery_position",
      "suction_airway",
    ],
    labResults: {
      cbc: "WBC 14,500/uL, Hgb 12.0 g/dL, Platelets 320,000",
      bmp: "Na 136, K 3.9, Cr 0.4, Glucose 85, Ca 9.2",
      blood_glucose: "85 mg/dL (normal)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_oxygen", label: "Oxygen", required: true, maxTimeMinutes: 1, points: 20 },
        { action: "administer_diazepam", label: "Benzodiazepine", required: true, maxTimeMinutes: 3, points: 30 },
        { action: "check_blood_glucose", label: "Blood Glucose Check", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "iv_access", label: "IV/IO Access", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "suction_airway", label: "Airway Management", required: false, maxTimeMinutes: 2, points: 10 },
      ],
      expectedSequences: [],
      timingThresholds: [
        { action: "administer_diazepam", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
      ],
      passingScore: 60,
    },
    patientPersonaTemplate:
      "Parent speaking: My {{age}}-year-old {{gender}} started shaking all over about {{duration}} ago and hasn't stopped. They had a fever this morning. Please help my child!",
    tags: ["pediatric", "seizure", "status-epilepticus", "emergency"],
  },

  // ── TRAUMA ──
  {
    id: "tpl-trauma",
    category: "trauma",
    name: "Major Trauma — Hemorrhagic Shock",
    description:
      "High-speed MVC victim with suspected internal bleeding, unstable pelvis, and Class III hemorrhagic shock. Requires massive transfusion protocol and surgical team activation.",
    baselineVitals: {
      hr: 130,
      bpSystolic: 75,
      bpDiastolic: 45,
      spo2: 92,
      temp: 35.8,
      respRate: 26,
    },
    deteriorationRules: [
      {
        id: "no-fluids-trauma",
        condition: "No fluid resuscitation",
        timerMinutes: 3,
        effect: { bpSystolic: 60, hr: 145 },
        preventedBy: ["fluid_bolus", "blood_transfusion"],
      },
      {
        id: "no-blood",
        condition: "No blood products",
        timerMinutes: 7,
        effect: { bpSystolic: 55, spo2: 86 },
        preventedBy: ["blood_transfusion", "activate_mtp"],
      },
      {
        id: "no-txa",
        condition: "No tranexamic acid",
        timerMinutes: 10,
        effect: { bpSystolic: 50 },
        preventedBy: ["administer_txa"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "fluid_bolus",
      "blood_transfusion",
      "activate_mtp",
      "administer_txa",
      "iv_access",
      "order_type_and_screen",
      "order_cbc",
      "order_bmp",
      "order_coagulation",
      "order_chest_xray",
      "order_pelvis_xray",
      "fast_exam",
      "apply_pelvic_binder",
      "cervical_spine_immobilization",
      "call_surgery",
    ],
    labResults: {
      cbc: "WBC 15,000/uL, Hgb 7.2 g/dL (LOW), Platelets 110,000",
      bmp: "Na 140, K 5.1, Cr 1.3, Lactate 6.5 (elevated)",
      coagulation: "PT 16s, INR 1.4, aPTT 38s, Fibrinogen 120 (low)",
      type_and_screen: "O-positive, antibody screen negative",
      fast_exam: "Positive — free fluid in Morison's pouch and pelvis",
      chest_xray: "No pneumothorax. Possible left hemothorax.",
      pelvis_xray: "Open-book pelvic fracture — widened symphysis pubis",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "fluid_bolus", label: "IV Fluid Resuscitation", required: true, maxTimeMinutes: 3, points: 20 },
        { action: "activate_mtp", label: "Massive Transfusion Protocol", required: true, maxTimeMinutes: 8, points: 25 },
        { action: "fast_exam", label: "FAST Exam", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "apply_pelvic_binder", label: "Pelvic Binder", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "administer_txa", label: "Tranexamic Acid", required: true, maxTimeMinutes: 10, points: 15 },
        { action: "call_surgery", label: "Surgical Consult", required: true, maxTimeMinutes: 10, points: 10 },
      ],
      expectedSequences: [
        { before: "fast_exam", after: "call_surgery", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "fluid_bolus", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "activate_mtp", gradeA: 300, gradeB: 480, gradeC: 600, gradeD: 900 },
      ],
      passingScore: 60,
    },
    patientPersonaTemplate:
      "I was in a car accident... everything hurts... I can't feel my legs... I'm so cold... please don't let me die...",
    tags: ["trauma", "hemorrhage", "MVC", "shock"],
  },

  // ── METABOLIC ──
  {
    id: "tpl-metabolic",
    category: "metabolic",
    name: "Diabetic Ketoacidosis (DKA)",
    description:
      "Young adult with severe DKA — Kussmaul breathing, altered consciousness, severe dehydration. Requires insulin drip, aggressive fluid resuscitation, and electrolyte monitoring.",
    baselineVitals: {
      hr: 120,
      bpSystolic: 95,
      bpDiastolic: 55,
      spo2: 97,
      temp: 37.0,
      respRate: 32,
    },
    deteriorationRules: [
      {
        id: "no-fluids-dka",
        condition: "No IV fluids",
        timerMinutes: 4,
        effect: { bpSystolic: 80, hr: 135 },
        preventedBy: ["fluid_bolus", "iv_normal_saline"],
      },
      {
        id: "no-insulin-dka",
        condition: "No insulin therapy",
        timerMinutes: 8,
        effect: { hr: 140, respRate: 36 },
        preventedBy: ["administer_insulin", "insulin_drip"],
      },
      {
        id: "no-potassium-check",
        condition: "Potassium not monitored",
        timerMinutes: 10,
        effect: { hr: 150 },
        preventedBy: ["order_bmp", "order_potassium"],
      },
    ],
    correctActions: [
      "fluid_bolus",
      "iv_normal_saline",
      "administer_insulin",
      "insulin_drip",
      "order_bmp",
      "order_potassium",
      "order_abg",
      "order_cbc",
      "check_blood_glucose",
      "order_urinalysis",
      "order_hba1c",
      "iv_access",
      "potassium_replacement",
      "cardiac_monitoring",
    ],
    labResults: {
      bmp: "Na 130, K 5.8 (HIGH), Cl 95, CO2 8 (LOW), BUN 32, Cr 1.8, Glucose 520",
      abg: "pH 7.12, pCO2 18, pO2 95, HCO3 6, BE -22, Anion gap 27",
      blood_glucose: "520 mg/dL",
      urinalysis: "Glucose 4+, Ketones 4+, pH 5.0",
      cbc: "WBC 16,000/uL (stress response), Hgb 15.5 g/dL (hemoconcentration)",
      hba1c: "12.5% (poorly controlled diabetes)",
      beta_hydroxybutyrate: "8.2 mmol/L (severely elevated)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "fluid_bolus", label: "IV Normal Saline Bolus", required: true, maxTimeMinutes: 3, points: 25 },
        { action: "order_bmp", label: "Basic Metabolic Panel", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "check_blood_glucose", label: "Blood Glucose", required: true, maxTimeMinutes: 2, points: 10 },
        { action: "administer_insulin", label: "Insulin Drip", required: true, maxTimeMinutes: 8, points: 25 },
        { action: "order_abg", label: "Arterial Blood Gas", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "potassium_replacement", label: "K+ Replacement", required: false, maxTimeMinutes: 15, points: 15 },
      ],
      expectedSequences: [
        { before: "order_bmp", after: "administer_insulin", points: 15, penalty: -10 },
        { before: "fluid_bolus", after: "administer_insulin", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "fluid_bolus", gradeA: 120, gradeB: 180, gradeC: 300, gradeD: 480 },
        { action: "administer_insulin", gradeA: 300, gradeB: 480, gradeC: 600, gradeD: 900 },
      ],
      passingScore: 60,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}} with type 1 diabetes. I've been vomiting for 2 days and couldn't keep my insulin down. I'm so thirsty and I keep going to the bathroom. My stomach hurts and I feel like I can't catch my breath.",
    tags: ["metabolic", "DKA", "diabetes", "acidosis"],
  },

  // ── TOXICOLOGICAL ──
  {
    id: "tpl-toxicological",
    category: "toxicological",
    name: "Opioid Overdose with Respiratory Depression",
    description:
      "Found unresponsive with pinpoint pupils and respiratory rate of 4. Requires immediate naloxone, airway management, and monitoring for re-sedation.",
    baselineVitals: {
      hr: 55,
      bpSystolic: 85,
      bpDiastolic: 50,
      spo2: 78,
      temp: 36.2,
      respRate: 4,
    },
    deteriorationRules: [
      {
        id: "no-naloxone",
        condition: "No naloxone administered",
        timerMinutes: 2,
        effect: { respRate: 2, spo2: 65 },
        preventedBy: ["administer_naloxone", "administer_narcan"],
      },
      {
        id: "no-airway-tox",
        condition: "No airway management",
        timerMinutes: 3,
        effect: { spo2: 60 },
        preventedBy: ["bag_mask_ventilation", "administer_oxygen", "intubation"],
      },
    ],
    correctActions: [
      "administer_naloxone",
      "administer_narcan",
      "administer_oxygen",
      "bag_mask_ventilation",
      "iv_access",
      "check_pupils",
      "check_blood_glucose",
      "cardiac_monitoring",
      "order_urine_drug_screen",
      "order_cbc",
      "order_bmp",
      "recovery_position",
    ],
    labResults: {
      urine_drug_screen: "Positive for opioids, negative for benzodiazepines/amphetamines/cocaine",
      bmp: "Na 139, K 4.2, Cr 1.0, Glucose 95",
      cbc: "WBC 7,500/uL, Hgb 13.0 g/dL, Platelets 230,000",
      blood_glucose: "95 mg/dL",
      abg: "pH 7.18, pCO2 72, pO2 48, HCO3 24 (respiratory acidosis)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_oxygen", label: "Oxygen/BVM", required: true, maxTimeMinutes: 1, points: 25 },
        { action: "administer_naloxone", label: "Naloxone", required: true, maxTimeMinutes: 2, points: 30 },
        { action: "check_pupils", label: "Pupil Check", required: true, maxTimeMinutes: 2, points: 10 },
        { action: "check_blood_glucose", label: "Blood Glucose", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "cardiac_monitoring", label: "Cardiac Monitoring", required: false, maxTimeMinutes: 5, points: 10 },
      ],
      expectedSequences: [
        { before: "administer_oxygen", after: "administer_naloxone", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "administer_naloxone", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "administer_oxygen", gradeA: 15, gradeB: 30, gradeC: 60, gradeD: 120 },
      ],
      passingScore: 65,
    },
    patientPersonaTemplate:
      "... (unresponsive, found by friend) ... Friend says: I found them on the floor, they took some pills. They're not waking up. I think they use heroin sometimes. Please help!",
    tags: ["toxicological", "overdose", "opioid", "naloxone"],
  },

  // ── ALLERGY ──
  {
    id: "tpl-allergy-anaphylaxis",
    category: "allergy",
    name: "Severe Allergic Reaction — Bee Sting Anaphylaxis",
    description:
      "A 28-year-old with anaphylaxis following a bee sting. Presents with urticaria, angioedema, stridor, and cardiovascular collapse. Requires immediate epinephrine, airway management, and aggressive fluid resuscitation.",
    baselineVitals: {
      hr: 125,
      bpSystolic: 80,
      bpDiastolic: 50,
      spo2: 91,
      temp: 37.2,
      respRate: 28,
    },
    deteriorationRules: [
      {
        id: "no-epinephrine-allergy",
        condition: "No epinephrine administered",
        timerMinutes: 3,
        effect: { hr: 150, bpSystolic: 60, bpDiastolic: 35 },
        preventedBy: ["give_epinephrine"],
      },
      {
        id: "no-oxygen-allergy",
        condition: "No oxygen support",
        timerMinutes: 3,
        effect: { spo2: 82 },
        preventedBy: ["administer_oxygen"],
      },
      {
        id: "no-fluids-allergy",
        condition: "No fluid resuscitation",
        timerMinutes: 5,
        effect: { bpSystolic: 55, bpDiastolic: 30 },
        preventedBy: ["fluid_bolus"],
      },
    ],
    correctActions: [
      "give_epinephrine",
      "administer_oxygen",
      "establish_iv_access",
      "fluid_bolus",
      "give_antihistamine",
      "give_steroids",
      "check_airway",
      "check_vitals",
      "order_cbc",
      "order_bmp",
    ],
    labResults: {
      tryptase: "Mast cell tryptase: 85 ng/mL (elevated, normal < 11.5)",
      ige: "Total IgE: 450 IU/mL (elevated)",
      cbc: "WBC 12,500/uL, Hgb 14.0 g/dL, Platelets 260,000, Eosinophils 8%",
      bmp: "Na 138, K 4.3, Cr 1.0, Glucose 155 (stress response)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "give_epinephrine", label: "IM Epinephrine", required: true, maxTimeMinutes: 2, points: 30 },
        { action: "administer_oxygen", label: "Supplemental Oxygen", required: true, maxTimeMinutes: 2, points: 15 },
        { action: "check_airway", label: "Airway Assessment", required: true, maxTimeMinutes: 1, points: 15 },
        { action: "establish_iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "fluid_bolus", label: "IV Fluid Bolus", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "give_antihistamine", label: "Antihistamine", required: false, maxTimeMinutes: 8, points: 10 },
        { action: "give_steroids", label: "IV Steroids", required: false, maxTimeMinutes: 10, points: 10 },
      ],
      expectedSequences: [
        { before: "give_epinephrine", after: "give_antihistamine", points: 10, penalty: -5 },
        { before: "check_airway", after: "administer_oxygen", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "give_epinephrine", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "check_airway", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "administer_oxygen", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}}. I got stung by a bee about 15 minutes ago. My throat is swelling shut, I can barely breathe, and I'm covered in hives. I feel dizzy and like I'm going to pass out. I don't have my EpiPen with me.",
    tags: ["allergy", "anaphylaxis", "bee-sting", "epinephrine", "emergency"],
  },

  // ── GASTROINTESTINAL ──
  {
    id: "tpl-gi-upper-bleed",
    category: "gastrointestinal",
    name: "Upper GI Bleed — Variceal Haemorrhage",
    description:
      "A 55-year-old with known liver cirrhosis presenting with massive hematemesis from oesophageal variceal bleeding. Haemodynamically unstable with signs of hypovolemic shock requiring urgent resuscitation and blood product replacement.",
    baselineVitals: {
      hr: 115,
      bpSystolic: 85,
      bpDiastolic: 55,
      spo2: 95,
      temp: 36.5,
      respRate: 22,
    },
    deteriorationRules: [
      {
        id: "no-fluids-gi",
        condition: "No fluid resuscitation",
        timerMinutes: 3,
        effect: { bpSystolic: 70, bpDiastolic: 40 },
        preventedBy: ["fluid_bolus"],
      },
      {
        id: "no-crossmatch-gi",
        condition: "No blood type and crossmatch ordered",
        timerMinutes: 5,
        effect: { hr: 135 },
        preventedBy: ["order_blood_type_crossmatch"],
      },
      {
        id: "no-iv-gi",
        condition: "No IV access established",
        timerMinutes: 4,
        effect: { bpSystolic: 65, bpDiastolic: 35 },
        preventedBy: ["establish_iv_access"],
      },
    ],
    correctActions: [
      "establish_iv_access",
      "fluid_bolus",
      "order_blood_type_crossmatch",
      "order_cbc",
      "order_bmp",
      "order_coagulation",
      "order_liver_enzymes",
      "check_vitals",
      "administer_oxygen",
    ],
    labResults: {
      cbc: "WBC 10,200/uL, Hgb 7.2 g/dL (LOW), Platelets 95,000 (LOW)",
      coagulation: "PT 18s, INR 1.8, aPTT 35s, Fibrinogen 140",
      liver_enzymes: "AST 125, ALT 98, ALP 180, GGT 220, Bilirubin 3.5 (elevated)",
      bmp: "Na 133, K 3.5, Cr 1.3, BUN 45 (elevated — upper GI source), Glucose 110",
      blood_type_crossmatch: "A-positive, crossmatch 4 units pRBC — pending",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "establish_iv_access", label: "Large-bore IV Access", required: true, maxTimeMinutes: 2, points: 20 },
        { action: "fluid_bolus", label: "IV Fluid Resuscitation", required: true, maxTimeMinutes: 3, points: 20 },
        { action: "order_blood_type_crossmatch", label: "Type & Crossmatch", required: true, maxTimeMinutes: 5, points: 20 },
        { action: "order_cbc", label: "CBC", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "order_coagulation", label: "Coagulation Studies", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "order_liver_enzymes", label: "Liver Function Tests", required: false, maxTimeMinutes: 8, points: 10 },
        { action: "check_vitals", label: "Vital Signs Monitoring", required: false, maxTimeMinutes: 3, points: 10 },
      ],
      expectedSequences: [
        { before: "establish_iv_access", after: "fluid_bolus", points: 15, penalty: -10 },
        { before: "order_cbc", after: "order_blood_type_crossmatch", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "establish_iv_access", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "fluid_bolus", gradeA: 120, gradeB: 180, gradeC: 300, gradeD: 480 },
        { action: "order_blood_type_crossmatch", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}} with liver cirrhosis. I've been vomiting large amounts of bright red blood for the past hour. I feel extremely weak and lightheaded. I can feel my heart racing. I've had variceal bleeds before.",
    tags: ["gastrointestinal", "GI-bleed", "variceal", "haemorrhage", "shock"],
  },

  // ── INFECTIOUS ──
  {
    id: "tpl-infectious-meningitis",
    category: "infectious",
    name: "Bacterial Meningitis — Meningococcal",
    description:
      "A 19-year-old university student presenting with severe headache, neck stiffness, photophobia, and non-blanching petechial rash. Rapidly deteriorating with signs of sepsis. Time-critical antibiotic administration is essential.",
    baselineVitals: {
      hr: 105,
      bpSystolic: 100,
      bpDiastolic: 65,
      spo2: 97,
      temp: 39.5,
      respRate: 20,
    },
    deteriorationRules: [
      {
        id: "no-abx-meningitis",
        condition: "No antibiotics within 5 minutes",
        timerMinutes: 5,
        effect: { hr: 120, bpSystolic: 85, bpDiastolic: 50 },
        preventedBy: ["administer_antibiotics"],
      },
      {
        id: "no-fluids-meningitis",
        condition: "No fluid resuscitation",
        timerMinutes: 6,
        effect: { bpSystolic: 80, bpDiastolic: 45 },
        preventedBy: ["fluid_bolus"],
      },
    ],
    correctActions: [
      "administer_antibiotics",
      "establish_iv_access",
      "fluid_bolus",
      "order_blood_cultures",
      "order_cbc",
      "order_bmp",
      "check_pupils",
      "check_gcs",
      "administer_oxygen",
      "give_antipyretic",
    ],
    labResults: {
      cbc: "WBC 22,000/uL (neutrophilia), Hgb 13.5 g/dL, Platelets 150,000",
      bmp: "Na 132, K 4.0, Cr 1.1, Glucose 60 (low — meningitis consumption)",
      crp: "CRP 350 mg/L (severely elevated)",
      blood_cultures: "Pending (Gram-negative diplococci on preliminary Gram stain)",
      csf: "WCC 2,500/uL (polymorphs 95%), Protein 4.5 g/L, Glucose 1.2 mmol/L (low), Gram stain: Gram-negative diplococci",
      coagulation: "PT 14s, INR 1.2, aPTT 32s, D-dimer 2,500 (elevated)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_antibiotics", label: "IV Antibiotics (Ceftriaxone)", required: true, maxTimeMinutes: 5, points: 30 },
        { action: "establish_iv_access", label: "IV Access", required: true, maxTimeMinutes: 2, points: 15 },
        { action: "order_blood_cultures", label: "Blood Cultures", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "check_gcs", label: "GCS Assessment", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "fluid_bolus", label: "IV Fluid Bolus", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "check_pupils", label: "Pupil Assessment", required: false, maxTimeMinutes: 5, points: 10 },
        { action: "administer_oxygen", label: "Supplemental Oxygen", required: false, maxTimeMinutes: 3, points: 10 },
      ],
      expectedSequences: [
        { before: "order_blood_cultures", after: "administer_antibiotics", points: 15, penalty: -10 },
        { before: "establish_iv_access", after: "administer_antibiotics", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "administer_antibiotics", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
        { action: "establish_iv_access", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "order_blood_cultures", gradeA: 120, gradeB: 240, gradeC: 360, gradeD: 480 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}} university student. I've had the worst headache of my life for about 6 hours. I can't stand the light, my neck is so stiff I can't touch my chin to my chest, and I've developed a rash on my legs. I feel really confused and unwell.",
    tags: ["infectious", "meningitis", "meningococcal", "sepsis", "time-critical"],
  },

  // ── RENAL ──
  {
    id: "tpl-renal-aki-hyperkalaemia",
    category: "renal",
    name: "Acute Kidney Injury — Hyperkalaemia with ECG Changes",
    description:
      "A 68-year-old with acute kidney injury, potassium 7.2 mmol/L, and peaked T-waves on ECG. Bradycardic and at risk of cardiac arrest if hyperkalaemia is not treated promptly. Requires urgent ECG, calcium, insulin-dextrose, and renal consultation.",
    baselineVitals: {
      hr: 55,
      bpSystolic: 150,
      bpDiastolic: 90,
      spo2: 96,
      temp: 36.8,
      respRate: 18,
    },
    deteriorationRules: [
      {
        id: "no-ecg-renal",
        condition: "ECG not ordered — cardiac arrest risk",
        timerMinutes: 3,
        effect: { hr: 35 },
        preventedBy: ["order_ecg"],
      },
      {
        id: "no-treatment-renal",
        condition: "No hyperkalaemia treatment initiated",
        timerMinutes: 5,
        effect: { hr: 40, bpSystolic: 90, bpDiastolic: 60 },
        preventedBy: ["establish_iv_access", "check_blood_glucose"],
      },
    ],
    correctActions: [
      "order_ecg",
      "order_bmp",
      "check_blood_glucose",
      "establish_iv_access",
      "fluid_bolus",
      "order_cbc",
      "order_urinalysis",
      "check_vitals",
      "administer_oxygen",
    ],
    labResults: {
      bmp: "Na 134, K 7.2 (CRITICAL HIGH), Cl 110, CO2 16 (low), BUN 42, Cr 680 umol/L, eGFR 6 mL/min",
      abg: "pH 7.28, pCO2 28, pO2 85, HCO3 14, BE -12 (metabolic acidosis with respiratory compensation)",
      cbc: "WBC 11,000/uL, Hgb 9.5 g/dL, Platelets 210,000",
      ecg: "Sinus bradycardia, peaked T-waves, widened QRS complex — consistent with severe hyperkalaemia",
      urinalysis: "Protein 2+, Blood 1+, Granular casts present, Specific gravity 1.010 (isosthenuria)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "order_ecg", label: "12-lead ECG", required: true, maxTimeMinutes: 2, points: 25 },
        { action: "order_bmp", label: "Electrolytes & Renal Function", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "establish_iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "check_blood_glucose", label: "Blood Glucose (for insulin-dextrose)", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "check_vitals", label: "Continuous Monitoring", required: true, maxTimeMinutes: 2, points: 10 },
        { action: "order_urinalysis", label: "Urinalysis", required: false, maxTimeMinutes: 8, points: 10 },
        { action: "administer_oxygen", label: "Supplemental Oxygen", required: false, maxTimeMinutes: 5, points: 10 },
      ],
      expectedSequences: [
        { before: "order_ecg", after: "establish_iv_access", points: 10, penalty: -5 },
        { before: "establish_iv_access", after: "check_blood_glucose", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "order_ecg", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "establish_iv_access", gradeA: 90, gradeB: 180, gradeC: 300, gradeD: 420 },
        { action: "check_blood_glucose", gradeA: 120, gradeB: 180, gradeC: 300, gradeD: 480 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}}. I've been feeling very unwell for the past two days — barely passing any urine and my legs are swollen. I feel weak and my heart feels like it's going very slowly. I have a history of diabetes and high blood pressure.",
    tags: ["renal", "AKI", "hyperkalaemia", "ECG-changes", "emergency"],
  },

  // ── CHEST PAIN (Pulmonary Embolism) ──
  {
    id: "tpl-chest-pain-pe",
    category: "chest_pain",
    name: "Pulmonary Embolism — Post-Surgical",
    description:
      "A 42-year-old post-surgical patient with sudden-onset dyspnoea and pleuritic chest pain. Tachycardic, hypoxic, and hypotensive. Suspected massive pulmonary embolism requiring urgent CT angiography and anticoagulation consideration.",
    baselineVitals: {
      hr: 120,
      bpSystolic: 95,
      bpDiastolic: 60,
      spo2: 88,
      temp: 37.1,
      respRate: 30,
    },
    deteriorationRules: [
      {
        id: "no-oxygen-pe",
        condition: "No oxygen administered",
        timerMinutes: 3,
        effect: { spo2: 78 },
        preventedBy: ["administer_oxygen"],
      },
      {
        id: "delayed-imaging-pe",
        condition: "CT delayed — ongoing haemodynamic compromise",
        timerMinutes: 8,
        effect: { hr: 140, bpSystolic: 80, bpDiastolic: 50 },
        preventedBy: ["order_ct_angio"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "establish_iv_access",
      "order_ecg",
      "order_chest_xray",
      "order_ct_angio",
      "order_abg",
      "order_cbc",
      "order_bmp",
      "order_coagulation",
      "check_vitals",
      "fluid_bolus",
    ],
    labResults: {
      d_dimer: "D-dimer: 4,500 ng/mL (severely elevated, normal < 500)",
      abg: "pH 7.45, pCO2 28 (low — hyperventilation), PaO2 7.5 kPa (low), HCO3 22",
      troponin: "Troponin I: 0.15 ng/mL (mildly elevated — RV strain)",
      bnp: "BNP: 650 pg/mL (elevated — right heart strain)",
      ecg: "Sinus tachycardia, S1Q3T3 pattern, right axis deviation, T-wave inversion V1-V4",
      cbc: "WBC 11,500/uL, Hgb 13.0 g/dL, Platelets 275,000",
      coagulation: "PT 12.8s, INR 1.0, aPTT 29s",
      ct_angio: "Large saddle pulmonary embolism at bifurcation, extending into bilateral pulmonary arteries. RV dilation present.",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_oxygen", label: "High-flow Oxygen", required: true, maxTimeMinutes: 1, points: 20 },
        { action: "establish_iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "order_ecg", label: "12-lead ECG", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "order_ct_angio", label: "CT Pulmonary Angiography", required: true, maxTimeMinutes: 10, points: 25 },
        { action: "order_abg", label: "Arterial Blood Gas", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "order_coagulation", label: "Coagulation Studies", required: false, maxTimeMinutes: 8, points: 10 },
        { action: "fluid_bolus", label: "Cautious IV Fluids", required: false, maxTimeMinutes: 5, points: 10 },
      ],
      expectedSequences: [
        { before: "order_ecg", after: "order_ct_angio", points: 10, penalty: -5 },
        { before: "administer_oxygen", after: "order_abg", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "administer_oxygen", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "order_ecg", gradeA: 120, gradeB: 180, gradeC: 300, gradeD: 480 },
        { action: "order_ct_angio", gradeA: 300, gradeB: 480, gradeC: 600, gradeD: 900 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}}. I had surgery on my knee 5 days ago. I suddenly can't breathe and I have a sharp pain in my chest that gets worse when I breathe in. I feel like my heart is racing. I'm really scared — something feels very wrong.",
    tags: ["chest-pain", "pulmonary-embolism", "PE", "post-surgical", "dyspnoea"],
  },

  // ── RESPIRATORY FAILURE (COPD) ──
  {
    id: "tpl-resp-failure-copd",
    category: "respiratory_failure",
    name: "COPD Acute Exacerbation — Type 2 Respiratory Failure",
    description:
      "A 72-year-old with known COPD on home oxygen presenting with acute exacerbation. Severely hypoxic with CO2 retention risk. Requires controlled oxygen therapy, bronchodilators, steroids, antibiotics, and ABG monitoring.",
    baselineVitals: {
      hr: 100,
      bpSystolic: 140,
      bpDiastolic: 85,
      spo2: 84,
      temp: 37.8,
      respRate: 28,
    },
    deteriorationRules: [
      {
        id: "no-controlled-o2-copd",
        condition: "No controlled oxygen — CO2 narcosis risk",
        timerMinutes: 3,
        effect: { spo2: 75, respRate: 32 },
        preventedBy: ["administer_oxygen"],
      },
      {
        id: "no-nebs-copd",
        condition: "No bronchodilator nebulizers",
        timerMinutes: 5,
        effect: { spo2: 78, respRate: 34 },
        preventedBy: ["give_salbutamol", "give_ipratropium"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "give_salbutamol",
      "give_ipratropium",
      "give_steroids",
      "administer_antibiotics",
      "order_abg",
      "order_chest_xray",
      "order_cbc",
      "order_bmp",
      "check_peak_flow",
      "check_vitals",
    ],
    labResults: {
      abg: "pH 7.32, PaCO2 7.5 kPa (elevated — CO2 retention), PaO2 7.0 kPa (low), HCO3 30 (compensated), BE +4",
      cbc: "WBC 15,000/uL (neutrophilia), Hgb 16.5 g/dL (polycythaemia), Platelets 280,000",
      bmp: "Na 140, K 4.5, Cr 1.1, Glucose 130",
      crp: "CRP 85 mg/L (moderately elevated)",
      chest_xray: "Hyperinflated lungs, flattened diaphragms. No consolidation. No pneumothorax. Consistent with COPD.",
      peak_flow: "PEFR: 120 L/min (predicted 350 L/min — 34% predicted)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "administer_oxygen", label: "Controlled Oxygen (24-28% Venturi)", required: true, maxTimeMinutes: 1, points: 20 },
        { action: "give_salbutamol", label: "Salbutamol Nebulizer", required: true, maxTimeMinutes: 3, points: 20 },
        { action: "order_abg", label: "Arterial Blood Gas", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "give_steroids", label: "Systemic Corticosteroids", required: true, maxTimeMinutes: 8, points: 15 },
        { action: "administer_antibiotics", label: "Antibiotics (if infective)", required: true, maxTimeMinutes: 10, points: 10 },
        { action: "give_ipratropium", label: "Ipratropium Nebulizer", required: false, maxTimeMinutes: 5, points: 10 },
        { action: "order_chest_xray", label: "Chest X-ray", required: false, maxTimeMinutes: 10, points: 10 },
      ],
      expectedSequences: [
        { before: "administer_oxygen", after: "order_abg", points: 15, penalty: -10 },
        { before: "give_salbutamol", after: "give_steroids", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "administer_oxygen", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "give_salbutamol", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "order_abg", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}} with COPD. I've been on home oxygen for 2 years. My breathing has been getting worse for 3 days and today I can barely speak a full sentence. I'm coughing up green sputum. I feel exhausted just sitting here.",
    tags: ["respiratory-failure", "COPD", "exacerbation", "CO2-retention", "type-2"],
  },

  // ── NEONATAL ──
  {
    id: "tpl-neonatal-resuscitation",
    category: "neonatal",
    name: "Neonatal Resuscitation — Poor Respiratory Effort at Birth",
    description:
      "A term newborn with poor respiratory effort, bradycardia, and cyanosis at birth. Requires immediate stimulation, drying, airway clearance, and escalation to positive pressure ventilation. Follows NLS/NRP algorithm.",
    baselineVitals: {
      hr: 80,
      bpSystolic: 50,
      bpDiastolic: 30,
      spo2: 60,
      temp: 36.0,
      respRate: 10,
    },
    deteriorationRules: [
      {
        id: "no-stimulation-neo",
        condition: "No stimulation or drying performed",
        timerMinutes: 1,
        effect: { hr: 60 },
        preventedBy: ["check_airway"],
      },
      {
        id: "no-bvm-neo",
        condition: "No bag-valve-mask ventilation",
        timerMinutes: 2,
        effect: { hr: 40, spo2: 40 },
        preventedBy: ["bag_valve_mask", "administer_oxygen"],
      },
    ],
    correctActions: [
      "administer_oxygen",
      "bag_valve_mask",
      "check_vitals",
      "check_airway",
      "start_cpr",
    ],
    labResults: {
      cord_gas: "Cord arterial pH 7.15, pCO2 65, pO2 15, HCO3 16, BE -12 (mixed acidosis)",
      lactate: "Lactate: 8.0 mmol/L (elevated)",
      glucose: "Glucose: 2.1 mmol/L (low — neonatal hypoglycaemia risk)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "check_airway", label: "Dry, Stimulate & Open Airway", required: true, maxTimeMinutes: 1, points: 25 },
        { action: "bag_valve_mask", label: "BVM Ventilation", required: true, maxTimeMinutes: 2, points: 30 },
        { action: "check_vitals", label: "Assess HR & SpO2", required: true, maxTimeMinutes: 1, points: 15 },
        { action: "administer_oxygen", label: "Supplemental Oxygen", required: true, maxTimeMinutes: 2, points: 15 },
        { action: "start_cpr", label: "Chest Compressions (if HR < 60)", required: false, maxTimeMinutes: 3, points: 15 },
      ],
      expectedSequences: [
        { before: "check_airway", after: "bag_valve_mask", points: 15, penalty: -10 },
        { before: "bag_valve_mask", after: "start_cpr", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "check_airway", gradeA: 15, gradeB: 30, gradeC: 45, gradeD: 60 },
        { action: "bag_valve_mask", gradeA: 30, gradeB: 60, gradeC: 90, gradeD: 120 },
        { action: "check_vitals", gradeA: 30, gradeB: 60, gradeC: 90, gradeD: 120 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "Midwife speaking: This is a term baby, just delivered. The baby is floppy, not crying, and has poor respiratory effort. The skin colour is dusky blue. Heart rate is dropping. We need help immediately — this baby needs resuscitation.",
    tags: ["neonatal", "resuscitation", "NLS", "newborn", "bradycardia"],
  },

  // ── BURNS ──
  {
    id: "tpl-burns-major",
    category: "burns",
    name: "Major Burn — 30% TBSA House Fire",
    description:
      "A 35-year-old rescued from a house fire with 30% TBSA mixed-depth burns. At risk of airway compromise from inhalation injury, hypovolemic shock, and hypothermia. Requires aggressive Parkland formula fluid resuscitation and early airway assessment.",
    baselineVitals: {
      hr: 125,
      bpSystolic: 95,
      bpDiastolic: 60,
      spo2: 93,
      temp: 35.5,
      respRate: 24,
    },
    deteriorationRules: [
      {
        id: "no-fluids-burns",
        condition: "No fluid resuscitation (Parkland formula)",
        timerMinutes: 4,
        effect: { bpSystolic: 70, bpDiastolic: 40, hr: 150 },
        preventedBy: ["fluid_bolus"],
      },
      {
        id: "no-airway-burns",
        condition: "No airway assessment — inhalation injury risk",
        timerMinutes: 5,
        effect: { spo2: 80, respRate: 32 },
        preventedBy: ["check_airway"],
      },
    ],
    correctActions: [
      "check_airway",
      "administer_oxygen",
      "establish_iv_access",
      "fluid_bolus",
      "check_vitals",
      "order_cbc",
      "order_bmp",
      "order_abg",
      "give_morphine",
      "order_urinalysis",
    ],
    labResults: {
      abg: "pH 7.35, pCO2 35, PaO2 80, HCO3 22, Carboxyhemoglobin 12% (elevated — smoke inhalation)",
      cbc: "WBC 18,000/uL (stress response), Hgb 18.0 g/dL (haemoconcentrated), Platelets 310,000",
      bmp: "Na 142, K 5.8 (elevated — tissue destruction), Cr 1.2, Glucose 180 (stress response)",
      lactate: "Lactate: 4.5 mmol/L (elevated — tissue hypoperfusion)",
      urinalysis: "Dark tea-coloured urine, Myoglobin positive (rhabdomyolysis risk)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "check_airway", label: "Airway Assessment (inhalation injury)", required: true, maxTimeMinutes: 2, points: 25 },
        { action: "administer_oxygen", label: "100% High-flow Oxygen", required: true, maxTimeMinutes: 2, points: 15 },
        { action: "establish_iv_access", label: "Large-bore IV Access", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "fluid_bolus", label: "Parkland Formula Fluids", required: true, maxTimeMinutes: 5, points: 20 },
        { action: "give_morphine", label: "IV Analgesia", required: true, maxTimeMinutes: 8, points: 10 },
        { action: "order_abg", label: "ABG with Carboxyhemoglobin", required: false, maxTimeMinutes: 8, points: 10 },
        { action: "order_urinalysis", label: "Urinalysis (myoglobin)", required: false, maxTimeMinutes: 10, points: 5 },
      ],
      expectedSequences: [
        { before: "check_airway", after: "administer_oxygen", points: 10, penalty: -5 },
        { before: "establish_iv_access", after: "fluid_bolus", points: 15, penalty: -10 },
      ],
      timingThresholds: [
        { action: "check_airway", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "administer_oxygen", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "fluid_bolus", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I was trapped in my burning house... I can't breathe properly... my voice feels hoarse. My arms and chest are burned badly. I'm in so much pain. I'm shivering even though everything feels like it's on fire. Please help me.",
    tags: ["burns", "inhalation-injury", "TBSA", "fluid-resuscitation", "trauma"],
  },

  // ── TOXICOLOGICAL (Paracetamol Overdose) ──
  {
    id: "tpl-tox-paracetamol",
    category: "toxicological",
    name: "Paracetamol Overdose — Staggered Ingestion",
    description:
      "A 22-year-old presenting 4 hours after intentional ingestion of 20g paracetamol. Currently asymptomatic but paracetamol level above treatment line. Requires urgent NAC (N-acetylcysteine) to prevent hepatotoxicity. Time-critical treatment window.",
    baselineVitals: {
      hr: 90,
      bpSystolic: 110,
      bpDiastolic: 70,
      spo2: 99,
      temp: 36.8,
      respRate: 16,
    },
    deteriorationRules: [
      {
        id: "no-nac-paracetamol",
        condition: "No NAC administered — progressive liver failure",
        timerMinutes: 15,
        effect: { hr: 110, bpSystolic: 90, bpDiastolic: 55 },
        preventedBy: ["establish_iv_access"],
      },
    ],
    correctActions: [
      "establish_iv_access",
      "order_liver_enzymes",
      "order_bmp",
      "order_coagulation",
      "check_blood_glucose",
      "order_abg",
      "check_vitals",
      "order_cbc",
    ],
    labResults: {
      paracetamol_level: "Paracetamol level: 200 mg/L at 4 hours (above treatment line on Rumack-Matthew nomogram)",
      liver_enzymes: "AST 45, ALT 40, ALP 80, Bilirubin 12 (initially normal — hepatotoxicity not yet manifest)",
      coagulation: "PT 12.5s, INR 1.0 (initially normal — monitor for rise)",
      bmp: "Na 140, K 4.0, Cr 0.9, Glucose 95, Bicarbonate 24",
      cbc: "WBC 8,500/uL, Hgb 13.0 g/dL, Platelets 250,000",
      abg: "pH 7.38, pCO2 38, pO2 95, HCO3 24 (normal — no acidosis yet)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "establish_iv_access", label: "IV Access (for NAC infusion)", required: true, maxTimeMinutes: 3, points: 20 },
        { action: "order_liver_enzymes", label: "Liver Function Tests", required: true, maxTimeMinutes: 5, points: 20 },
        { action: "order_coagulation", label: "Coagulation (INR)", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "order_bmp", label: "Renal Function & Electrolytes", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "check_blood_glucose", label: "Blood Glucose", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "order_abg", label: "Venous Blood Gas (pH/lactate)", required: false, maxTimeMinutes: 8, points: 10 },
        { action: "check_vitals", label: "Vital Signs", required: false, maxTimeMinutes: 3, points: 5 },
      ],
      expectedSequences: [
        { before: "establish_iv_access", after: "order_liver_enzymes", points: 10, penalty: -5 },
        { before: "order_liver_enzymes", after: "order_coagulation", points: 5, penalty: -3 },
      ],
      timingThresholds: [
        { action: "establish_iv_access", gradeA: 120, gradeB: 180, gradeC: 300, gradeD: 480 },
        { action: "order_liver_enzymes", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
        { action: "order_coagulation", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}}. I took about 40 paracetamol tablets about 4 hours ago. I know it was stupid. I don't feel too bad right now — just a bit sick. I haven't vomited. I'm scared about what might happen to my liver.",
    tags: ["toxicological", "paracetamol", "overdose", "NAC", "hepatotoxicity"],
  },

  // ── PSYCHIATRIC ──
  {
    id: "tpl-psychiatric-hyperthermia",
    category: "psychiatric",
    name: "Acute Psychosis with Hyperthermia — Serotonin Syndrome",
    description:
      "A 30-year-old found agitated and confused with severe hyperthermia (40.5C), rigidity, and autonomic instability. Suspected serotonin syndrome or neuroleptic malignant syndrome. Requires urgent cooling, sedation, and investigation of underlying cause.",
    baselineVitals: {
      hr: 130,
      bpSystolic: 160,
      bpDiastolic: 100,
      spo2: 96,
      temp: 40.5,
      respRate: 22,
    },
    deteriorationRules: [
      {
        id: "no-cooling-psych",
        condition: "No active cooling measures",
        timerMinutes: 5,
        effect: { temp: 41.5, hr: 150 },
        preventedBy: ["give_antipyretic", "fluid_bolus"],
      },
      {
        id: "no-sedation-psych",
        condition: "No sedation — risk of harm and worsening hyperthermia",
        timerMinutes: 6,
        effect: { hr: 155, bpSystolic: 180 },
        preventedBy: ["establish_iv_access"],
      },
    ],
    correctActions: [
      "check_vitals",
      "administer_oxygen",
      "establish_iv_access",
      "fluid_bolus",
      "give_antipyretic",
      "order_cbc",
      "order_bmp",
      "order_liver_enzymes",
      "check_blood_glucose",
      "check_pupils",
      "order_toxicology_screen",
      "check_gcs",
    ],
    labResults: {
      cbc: "WBC 14,000/uL, Hgb 15.0 g/dL, Platelets 190,000",
      bmp: "Na 135, K 5.5 (elevated), Cr 150 umol/L (elevated — dehydration/rhabdomyolysis), Glucose 3.2 mmol/L (low)",
      ck: "CK: 15,000 U/L (severely elevated — rhabdomyolysis)",
      liver_enzymes: "AST 250, ALT 180 (elevated — hepatic involvement), LDH 800",
      toxicology_screen: "Positive: SSRI (sertraline metabolites detected). Negative: amphetamines, cocaine, opioids",
      blood_glucose: "3.2 mmol/L (low — requires correction)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "check_vitals", label: "Full Vital Signs (inc. Temperature)", required: true, maxTimeMinutes: 1, points: 15 },
        { action: "establish_iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "fluid_bolus", label: "IV Fluid Resuscitation", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "check_blood_glucose", label: "Blood Glucose Check", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "order_toxicology_screen", label: "Toxicology Screen", required: true, maxTimeMinutes: 8, points: 15 },
        { action: "check_gcs", label: "GCS Assessment", required: false, maxTimeMinutes: 3, points: 10 },
        { action: "order_bmp", label: "Electrolytes & Renal Function", required: false, maxTimeMinutes: 5, points: 10 },
        { action: "give_antipyretic", label: "Active Cooling / Antipyretic", required: false, maxTimeMinutes: 5, points: 10 },
      ],
      expectedSequences: [
        { before: "check_vitals", after: "establish_iv_access", points: 10, penalty: -5 },
        { before: "establish_iv_access", after: "fluid_bolus", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "check_vitals", gradeA: 30, gradeB: 60, gradeC: 120, gradeD: 180 },
        { action: "establish_iv_access", gradeA: 90, gradeB: 180, gradeC: 300, gradeD: 420 },
        { action: "order_toxicology_screen", gradeA: 240, gradeB: 360, gradeC: 480, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "Friend speaking: My friend is a {{age}}-year-old {{gender}}. They've been on antidepressants and I think they might have taken something else too. They're extremely agitated, confused, drenched in sweat, and burning up. Their muscles are really stiff. They don't know where they are.",
    tags: ["psychiatric", "serotonin-syndrome", "hyperthermia", "agitation", "emergency"],
  },

  // ── SURGICAL ──
  {
    id: "tpl-surgical-appendicitis",
    category: "surgical",
    name: "Acute Abdomen — Appendicitis with Perforation Risk",
    description:
      "A 25-year-old with classic right iliac fossa pain, guarding, rebound tenderness, and fever consistent with acute appendicitis. Risk of perforation if surgical intervention is delayed. Requires analgesia, antibiotics, and surgical referral.",
    baselineVitals: {
      hr: 100,
      bpSystolic: 125,
      bpDiastolic: 80,
      spo2: 98,
      temp: 38.5,
      respRate: 18,
    },
    deteriorationRules: [
      {
        id: "no-imaging-appendicitis",
        condition: "No imaging or surgical assessment — perforation risk",
        timerMinutes: 10,
        effect: { temp: 39.5, hr: 120 },
        preventedBy: ["check_abdomen"],
      },
      {
        id: "no-abx-appendicitis",
        condition: "No antibiotics after perforation signs",
        timerMinutes: 12,
        effect: { bpSystolic: 90, bpDiastolic: 55, hr: 130 },
        preventedBy: ["administer_antibiotics"],
      },
    ],
    correctActions: [
      "check_abdomen",
      "check_vitals",
      "establish_iv_access",
      "give_morphine",
      "order_cbc",
      "order_bmp",
      "order_urinalysis",
      "administer_antibiotics",
      "administer_oxygen",
      "give_antipyretic",
    ],
    labResults: {
      cbc: "WBC 18,000/uL (neutrophils 15,000), Hgb 14.0 g/dL, Platelets 310,000",
      bmp: "Na 139, K 4.1, Cr 0.9, Glucose 110",
      crp: "CRP 120 mg/L (elevated)",
      urinalysis: "UA: Negative for infection (rules out UTI as differential)",
      lactate: "Lactate: 1.8 mmol/L (mildly elevated)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "check_abdomen", label: "Abdominal Examination", required: true, maxTimeMinutes: 3, points: 20 },
        { action: "establish_iv_access", label: "IV Access", required: true, maxTimeMinutes: 3, points: 10 },
        { action: "give_morphine", label: "IV Analgesia", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "order_cbc", label: "CBC with Differential", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "order_urinalysis", label: "Urinalysis (rule out UTI)", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "administer_antibiotics", label: "IV Antibiotics", required: false, maxTimeMinutes: 12, points: 15 },
        { action: "check_vitals", label: "Vital Signs", required: false, maxTimeMinutes: 3, points: 10 },
        { action: "give_antipyretic", label: "Antipyretic", required: false, maxTimeMinutes: 8, points: 10 },
      ],
      expectedSequences: [
        { before: "check_abdomen", after: "give_morphine", points: 10, penalty: -5 },
        { before: "establish_iv_access", after: "administer_antibiotics", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "check_abdomen", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "give_morphine", gradeA: 120, gradeB: 240, gradeC: 360, gradeD: 600 },
        { action: "order_cbc", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "I'm a {{age}}-year-old {{gender}}. The pain started around my belly button yesterday and has moved to my lower right side. It's getting worse and it really hurts when I move or cough. I feel hot and I've been sick twice. I can't eat anything.",
    tags: ["surgical", "appendicitis", "acute-abdomen", "peritonitis-risk"],
  },

  // ── GERIATRIC ──
  {
    id: "tpl-geriatric-delirium",
    category: "geriatric",
    name: "Delirium in Elderly — Falls with Infection",
    description:
      "An 82-year-old found on the floor with new-onset confusion and agitation. On multiple medications (polypharmacy). Suspected UTI as precipitant with concurrent risks of hypoglycaemia, dehydration, and occult injury from fall.",
    baselineVitals: {
      hr: 95,
      bpSystolic: 100,
      bpDiastolic: 55,
      spo2: 93,
      temp: 38.2,
      respRate: 20,
    },
    deteriorationRules: [
      {
        id: "no-infection-screen-geri",
        condition: "No infection screening performed",
        timerMinutes: 8,
        effect: { temp: 39.5, hr: 115 },
        preventedBy: ["order_urinalysis", "order_blood_cultures", "order_cbc"],
      },
      {
        id: "no-glucose-check-geri",
        condition: "No glucose check — risk of undetected hypoglycaemia",
        timerMinutes: 5,
        effect: { hr: 105 },
        preventedBy: ["check_blood_glucose"],
      },
    ],
    correctActions: [
      "check_gcs",
      "check_vitals",
      "check_blood_glucose",
      "check_pupils",
      "administer_oxygen",
      "establish_iv_access",
      "fluid_bolus",
      "order_cbc",
      "order_bmp",
      "order_urinalysis",
      "order_chest_xray",
      "order_blood_cultures",
      "give_antipyretic",
    ],
    labResults: {
      cbc: "WBC 16,000/uL (neutrophilia), Hgb 11.0 g/dL, Platelets 200,000",
      bmp: "Na 128 (LOW — hyponatraemia), K 4.8, Cr 120 umol/L (elevated), eGFR 35, Glucose 3.8 mmol/L (borderline low)",
      crp: "CRP 180 mg/L (significantly elevated)",
      urinalysis: "Nitrites POSITIVE, Leucocytes 3+, Blood 1+, Bacteria ++ (consistent with UTI)",
      blood_cultures: "Pending (48 hours)",
      chest_xray: "No acute consolidation. Mild cardiomegaly. Degenerative changes in thoracic spine.",
      blood_glucose: "3.8 mmol/L (borderline low — risk of symptomatic hypoglycaemia in elderly)",
    },
    suggestedBenchmark: {
      expectedActions: [
        { action: "check_gcs", label: "GCS & Confusion Assessment", required: true, maxTimeMinutes: 2, points: 15 },
        { action: "check_blood_glucose", label: "Blood Glucose", required: true, maxTimeMinutes: 3, points: 15 },
        { action: "check_vitals", label: "Full Vital Signs", required: true, maxTimeMinutes: 2, points: 10 },
        { action: "order_urinalysis", label: "Urinalysis (MSU)", required: true, maxTimeMinutes: 5, points: 15 },
        { action: "order_cbc", label: "CBC with Differential", required: true, maxTimeMinutes: 5, points: 10 },
        { action: "establish_iv_access", label: "IV Access", required: false, maxTimeMinutes: 5, points: 10 },
        { action: "order_bmp", label: "Electrolytes & Renal Function", required: false, maxTimeMinutes: 5, points: 10 },
        { action: "order_chest_xray", label: "Chest X-ray", required: false, maxTimeMinutes: 10, points: 5 },
        { action: "order_blood_cultures", label: "Blood Cultures", required: false, maxTimeMinutes: 8, points: 5 },
        { action: "give_antipyretic", label: "Antipyretic", required: false, maxTimeMinutes: 8, points: 5 },
      ],
      expectedSequences: [
        { before: "check_gcs", after: "check_blood_glucose", points: 10, penalty: -5 },
        { before: "check_vitals", after: "order_urinalysis", points: 10, penalty: -5 },
      ],
      timingThresholds: [
        { action: "check_gcs", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "check_blood_glucose", gradeA: 60, gradeB: 120, gradeC: 180, gradeD: 300 },
        { action: "order_urinalysis", gradeA: 180, gradeB: 300, gradeC: 420, gradeD: 600 },
      ],
      passingScore: 70,
    },
    patientPersonaTemplate:
      "Carer speaking: This is an {{age}}-year-old {{gender}} I look after. I found them on the floor this morning — they don't normally act like this. They're confused, agitated, and don't recognise me. They take about 10 different medications. They felt warm so I called an ambulance.",
    tags: ["geriatric", "delirium", "falls", "UTI", "polypharmacy", "confusion"],
  },
];

export function getTemplateById(id: string): ScenarioTemplate | undefined {
  return SCENARIO_TEMPLATES.find((t) => t.id === id);
}

export function getTemplatesByCategory(
  category: TemplateCategory,
): ScenarioTemplate[] {
  return SCENARIO_TEMPLATES.filter((t) => t.category === category);
}

export const TEMPLATE_CATEGORIES: {
  key: TemplateCategory;
  label: string;
  color: string;
}[] = [
  { key: "cardiac", label: "Cardiac", color: "text-red-400" },
  { key: "respiratory", label: "Respiratory", color: "text-blue-400" },
  { key: "neurological", label: "Neurological", color: "text-purple-400" },
  { key: "obstetric", label: "Obstetric", color: "text-rose-400" },
  { key: "pediatric", label: "Pediatric", color: "text-pink-400" },
  { key: "trauma", label: "Trauma", color: "text-orange-400" },
  { key: "metabolic", label: "Metabolic", color: "text-cyan-400" },
  { key: "toxicological", label: "Toxicological", color: "text-violet-400" },
  { key: "allergy", label: "Allergy", color: "text-amber-400" },
  { key: "gastrointestinal", label: "Gastrointestinal", color: "text-yellow-400" },
  { key: "infectious", label: "Infectious", color: "text-lime-400" },
  { key: "renal", label: "Renal", color: "text-teal-400" },
  { key: "pulmonary", label: "Pulmonary", color: "text-blue-300" },
  { key: "chest_pain", label: "Chest Pain", color: "text-red-300" },
  { key: "respiratory_failure", label: "Respiratory Failure", color: "text-sky-400" },
  { key: "neonatal", label: "Neonatal", color: "text-fuchsia-400" },
  { key: "burns", label: "Burns", color: "text-orange-300" },
  { key: "psychiatric", label: "Psychiatric", color: "text-indigo-400" },
  { key: "surgical", label: "Surgical", color: "text-emerald-400" },
  { key: "geriatric", label: "Geriatric", color: "text-stone-400" },
];
