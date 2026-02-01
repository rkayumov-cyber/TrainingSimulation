import type {
  ChecklistItem,
  CompetencyChecklist,
  ChecklistResult,
  CompetencyDomain,
} from "../../types/difficulty";

// ============================================
// SCENARIO CHECKLIST DEFINITIONS
// ============================================

const SEPSIS_CHECKLIST: ChecklistItem[] = [
  // Assessment
  {
    id: "s-assess-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    matchPatterns: [/\b(check|take|assess)\b.*\b(vitals?|observations?)\b/i],
    isCritical: false,
    completed: false,
    order: 1,
  },
  {
    id: "s-assess-airway",
    label: "Assess airway & breathing",
    domain: "assessment",
    matchActions: ["check_lung_sounds", "check_airway"],
    isCritical: false,
    completed: false,
    order: 2,
  },
  {
    id: "s-assess-heart",
    label: "Auscultate heart sounds",
    domain: "assessment",
    matchActions: ["check_heart_sounds"],
    isCritical: false,
    completed: false,
    order: 3,
  },
  // Investigation
  {
    id: "s-blood-cultures",
    label: "Order blood cultures BEFORE antibiotics",
    domain: "investigation",
    matchActions: ["order_blood_cultures"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "s-lactate",
    label: "Order serum lactate",
    domain: "investigation",
    matchActions: ["order_lactate"],
    isCritical: true,
    completed: false,
    order: 5,
  },
  {
    id: "s-cbc",
    label: "Order CBC",
    domain: "investigation",
    matchActions: ["order_cbc"],
    isCritical: false,
    completed: false,
    order: 6,
  },
  {
    id: "s-bmp",
    label: "Order BMP/metabolic panel",
    domain: "investigation",
    matchActions: ["order_bmp"],
    isCritical: false,
    completed: false,
    order: 7,
  },
  // Treatment
  {
    id: "s-oxygen",
    label: "Administer supplemental oxygen",
    domain: "treatment",
    matchActions: ["administer_oxygen"],
    isCritical: true,
    completed: false,
    order: 8,
  },
  {
    id: "s-iv-access",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access", "fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 9,
  },
  {
    id: "s-fluids",
    label: "Administer IV fluid bolus (30ml/kg)",
    domain: "treatment",
    matchActions: ["fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 10,
  },
  {
    id: "s-antibiotics",
    label: "Administer broad-spectrum antibiotics",
    domain: "treatment",
    matchActions: ["administer_antibiotics"],
    isCritical: true,
    completed: false,
    order: 11,
  },
  // Communication
  {
    id: "s-comm-plain",
    label: "Communicate using plain language",
    domain: "communication",
    matchActions: [],
    matchPatterns: [],
    isCritical: false,
    completed: false,
    order: 12,
  },
  // Safety
  {
    id: "s-allergy-check",
    label: "Check for drug allergies",
    domain: "safety",
    matchActions: [],
    matchPatterns: [/\b(allerg|react)\b/i],
    isCritical: false,
    completed: false,
    order: 13,
  },
];

const MI_CHECKLIST: ChecklistItem[] = [
  {
    id: "m-assess-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    matchPatterns: [/\b(check|take|assess)\b.*\b(vitals?|observations?)\b/i],
    isCritical: false,
    completed: false,
    order: 1,
  },
  {
    id: "m-assess-chest",
    label: "Auscultate heart & lungs",
    domain: "assessment",
    matchActions: ["check_heart_sounds", "check_lung_sounds"],
    isCritical: false,
    completed: false,
    order: 2,
  },
  {
    id: "m-ecg",
    label: "Obtain 12-lead ECG",
    domain: "investigation",
    matchActions: ["order_ecg"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "m-troponin",
    label: "Order cardiac troponin",
    domain: "investigation",
    matchActions: ["order_troponin"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "m-cxr",
    label: "Order chest X-ray",
    domain: "investigation",
    matchActions: ["order_chest_xray"],
    isCritical: false,
    completed: false,
    order: 5,
  },
  {
    id: "m-oxygen",
    label: "Administer oxygen if SpO2 < 94%",
    domain: "treatment",
    matchActions: ["administer_oxygen"],
    isCritical: false,
    completed: false,
    order: 6,
  },
  {
    id: "m-aspirin",
    label: "Give aspirin 300mg",
    domain: "treatment",
    matchActions: ["give_aspirin"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "m-nitro",
    label: "Administer sublingual GTN/nitroglycerin",
    domain: "treatment",
    matchActions: ["give_nitro"],
    isCritical: true,
    completed: false,
    order: 8,
  },
  {
    id: "m-iv-access",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: true,
    completed: false,
    order: 9,
  },
  {
    id: "m-morphine",
    label: "Provide pain relief (morphine if needed)",
    domain: "treatment",
    matchActions: ["give_morphine"],
    isCritical: false,
    completed: false,
    order: 10,
  },
  {
    id: "m-allergy",
    label: "Check for drug allergies",
    domain: "safety",
    matchActions: [],
    matchPatterns: [/\b(allerg|react)\b/i],
    isCritical: false,
    completed: false,
    order: 11,
  },
];

const ANAPHYLAXIS_CHECKLIST: ChecklistItem[] = [
  {
    id: "a-airway",
    label: "Assess and secure airway (A)",
    domain: "assessment",
    matchActions: ["check_airway"],
    isCritical: true,
    completed: false,
    order: 1,
  },
  {
    id: "a-breathing",
    label: "Assess breathing (B)",
    domain: "assessment",
    matchActions: ["check_lung_sounds"],
    isCritical: false,
    completed: false,
    order: 2,
  },
  {
    id: "a-circulation",
    label: "Assess circulation (C)",
    domain: "assessment",
    matchActions: ["check_vitals"],
    matchPatterns: [/\b(pulse|circulation|bp)\b/i],
    isCritical: false,
    completed: false,
    order: 3,
  },
  {
    id: "a-epi",
    label: "Administer IM epinephrine (0.5mg)",
    domain: "treatment",
    matchActions: ["give_epinephrine"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "a-oxygen",
    label: "Administer high-flow oxygen",
    domain: "treatment",
    matchActions: ["administer_oxygen"],
    isCritical: true,
    completed: false,
    order: 5,
  },
  {
    id: "a-iv-access",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access", "fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 6,
  },
  {
    id: "a-fluids",
    label: "IV fluid challenge (500-1000ml)",
    domain: "treatment",
    matchActions: ["fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "a-antihistamine",
    label: "Give antihistamine",
    domain: "treatment",
    matchActions: ["give_antihistamine"],
    isCritical: false,
    completed: false,
    order: 8,
  },
  {
    id: "a-steroids",
    label: "Give IV hydrocortisone",
    domain: "treatment",
    matchActions: ["give_steroids"],
    isCritical: false,
    completed: false,
    order: 9,
  },
  {
    id: "a-monitor",
    label: "Continuous monitoring",
    domain: "safety",
    matchActions: ["check_vitals"],
    matchPatterns: [/\bmonitor\b/i],
    isCritical: false,
    completed: false,
    order: 10,
  },
];

const ASTHMA_CHECKLIST: ChecklistItem[] = [
  {
    id: "as-assess-severity",
    label: "Assess severity (can speak?)",
    domain: "assessment",
    matchActions: ["check_vitals"],
    matchPatterns: [/\b(speak|sentence|word|severity)\b/i],
    isCritical: false,
    completed: false,
    order: 1,
  },
  {
    id: "as-peak-flow",
    label: "Measure peak flow / PEFR",
    domain: "investigation",
    matchActions: ["check_peak_flow"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "as-oxygen",
    label: "Administer high-flow oxygen",
    domain: "treatment",
    matchActions: ["administer_oxygen"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "as-salbutamol",
    label: "Nebulised salbutamol (5mg)",
    domain: "treatment",
    matchActions: ["give_salbutamol"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "as-ipratropium",
    label: "Add ipratropium bromide",
    domain: "treatment",
    matchActions: ["give_ipratropium"],
    isCritical: false,
    completed: false,
    order: 5,
  },
  {
    id: "as-steroids",
    label: "Give systemic corticosteroids",
    domain: "treatment",
    matchActions: ["give_steroids"],
    isCritical: true,
    completed: false,
    order: 6,
  },
  {
    id: "as-abg",
    label: "Order arterial blood gas",
    domain: "investigation",
    matchActions: ["order_abg"],
    isCritical: false,
    completed: false,
    order: 7,
  },
  {
    id: "as-cxr",
    label: "Order chest X-ray",
    domain: "investigation",
    matchActions: ["order_chest_xray"],
    isCritical: false,
    completed: false,
    order: 8,
  },
  {
    id: "as-iv-access",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: false,
    completed: false,
    order: 9,
  },
];

const STROKE_CHECKLIST: ChecklistItem[] = [
  {
    id: "st-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    isCritical: false,
    completed: false,
    order: 1,
  },
  {
    id: "st-nihss",
    label: "Perform NIHSS assessment",
    domain: "assessment",
    matchActions: ["check_nihss"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "st-glucose",
    label: "Check blood glucose",
    domain: "investigation",
    matchActions: ["check_blood_glucose"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "st-ct-head",
    label: "Order urgent CT head",
    domain: "investigation",
    matchActions: ["order_ct_head"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "st-ct-angio",
    label: "Order CT angiography",
    domain: "investigation",
    matchActions: ["order_ct_angio"],
    isCritical: false,
    completed: false,
    order: 5,
  },
  {
    id: "st-coag",
    label: "Order coagulation panel",
    domain: "investigation",
    matchActions: ["order_coagulation"],
    isCritical: true,
    completed: false,
    order: 6,
  },
  {
    id: "st-tpa",
    label: "Administer tPA (thrombolysis)",
    domain: "treatment",
    matchActions: ["administer_tpa"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "st-bp",
    label: "Control blood pressure",
    domain: "treatment",
    matchActions: ["administer_labetalol", "administer_nicardipine"],
    isCritical: true,
    completed: false,
    order: 8,
  },
  {
    id: "st-iv",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: false,
    completed: false,
    order: 9,
  },
];

const DKA_CHECKLIST: ChecklistItem[] = [
  {
    id: "d-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    isCritical: false,
    completed: false,
    order: 1,
  },
  {
    id: "d-glucose",
    label: "Check blood glucose",
    domain: "investigation",
    matchActions: ["check_blood_glucose"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "d-bmp",
    label: "Order BMP (check potassium)",
    domain: "investigation",
    matchActions: ["order_bmp"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "d-ketones",
    label: "Check urine ketones",
    domain: "investigation",
    matchActions: ["check_urine_ketones"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "d-abg",
    label: "Order arterial blood gas",
    domain: "investigation",
    matchActions: ["order_abg"],
    isCritical: false,
    completed: false,
    order: 5,
  },
  {
    id: "d-iv",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access", "fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 6,
  },
  {
    id: "d-fluids",
    label: "Administer IV fluids (NS bolus)",
    domain: "treatment",
    matchActions: ["fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "d-insulin",
    label: "Start insulin infusion",
    domain: "treatment",
    matchActions: ["start_insulin_drip"],
    isCritical: true,
    completed: false,
    order: 8,
  },
  {
    id: "d-ecg",
    label: "Order ECG (check for hyperkalaemia)",
    domain: "investigation",
    matchActions: ["order_ecg"],
    isCritical: false,
    completed: false,
    order: 9,
  },
];

const TRAUMA_CHECKLIST: ChecklistItem[] = [
  {
    id: "t-airway",
    label: "Assess airway (A)",
    domain: "assessment",
    matchActions: ["check_airway"],
    isCritical: true,
    completed: false,
    order: 1,
  },
  {
    id: "t-oxygen",
    label: "Administer oxygen (B)",
    domain: "treatment",
    matchActions: ["administer_oxygen"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "t-lungs",
    label: "Auscultate lung sounds",
    domain: "assessment",
    matchActions: ["check_lung_sounds"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "t-chest-drain",
    label: "Insert chest drain for pneumothorax",
    domain: "treatment",
    matchActions: ["insert_chest_drain"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "t-iv",
    label: "Establish IV access (2 large bore)",
    domain: "treatment",
    matchActions: ["establish_iv_access", "fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 5,
  },
  {
    id: "t-fluids",
    label: "Administer IV fluids / blood",
    domain: "treatment",
    matchActions: ["fluid_bolus"],
    isCritical: true,
    completed: false,
    order: 6,
  },
  {
    id: "t-fast",
    label: "Perform FAST scan",
    domain: "investigation",
    matchActions: ["order_fast_scan"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "t-gcs",
    label: "Assess GCS (D)",
    domain: "assessment",
    matchActions: ["check_gcs"],
    isCritical: true,
    completed: false,
    order: 8,
  },
  {
    id: "t-crossmatch",
    label: "Order blood type & crossmatch",
    domain: "investigation",
    matchActions: ["order_blood_type_crossmatch"],
    isCritical: false,
    completed: false,
    order: 9,
  },
  {
    id: "t-pelvis",
    label: "Order pelvis X-ray",
    domain: "investigation",
    matchActions: ["order_pelvis_xray"],
    isCritical: false,
    completed: false,
    order: 10,
  },
];

const PEDS_SEIZURE_CHECKLIST: ChecklistItem[] = [
  {
    id: "ps-airway",
    label: "Assess airway",
    domain: "assessment",
    matchActions: ["check_airway"],
    isCritical: true,
    completed: false,
    order: 1,
  },
  {
    id: "ps-oxygen",
    label: "Administer oxygen",
    domain: "treatment",
    matchActions: ["administer_oxygen"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "ps-benzo",
    label: "Give benzodiazepine to stop seizure",
    domain: "treatment",
    matchActions: ["administer_diazepam"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "ps-glucose",
    label: "Check blood glucose",
    domain: "investigation",
    matchActions: ["check_blood_glucose"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "ps-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    isCritical: false,
    completed: false,
    order: 5,
  },
  {
    id: "ps-iv",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: false,
    completed: false,
    order: 6,
  },
  {
    id: "ps-temp",
    label: "Give antipyretic for fever",
    domain: "treatment",
    matchActions: ["give_antipyretic"],
    isCritical: false,
    completed: false,
    order: 7,
  },
  {
    id: "ps-comm",
    label: "Communicate with parent clearly",
    domain: "communication",
    matchActions: [],
    matchPatterns: [/\b(mum|mom|mother|parent|sarah)\b/i],
    isCritical: false,
    completed: false,
    order: 8,
  },
];

const ECLAMPSIA_CHECKLIST: ChecklistItem[] = [
  {
    id: "e-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    isCritical: false,
    completed: false,
    order: 1,
  },
  {
    id: "e-magnesium",
    label: "Administer magnesium sulfate",
    domain: "treatment",
    matchActions: ["administer_magnesium"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "e-bp",
    label: "Administer antihypertensive",
    domain: "treatment",
    matchActions: ["administer_labetalol", "administer_nicardipine"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "e-fetal",
    label: "Check fetal heart rate / CTG",
    domain: "assessment",
    matchActions: ["check_fetal_heart"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "e-protein",
    label: "Check for proteinuria",
    domain: "investigation",
    matchActions: ["check_proteinuria"],
    isCritical: true,
    completed: false,
    order: 5,
  },
  {
    id: "e-bloods",
    label: "Order CBC and BMP",
    domain: "investigation",
    matchActions: ["order_cbc", "order_bmp"],
    isCritical: false,
    completed: false,
    order: 6,
  },
  {
    id: "e-liver",
    label: "Order liver enzymes (rule out HELLP)",
    domain: "investigation",
    matchActions: ["order_liver_enzymes"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "e-delivery",
    label: "Prepare for emergency delivery",
    domain: "treatment",
    matchActions: ["prepare_for_delivery"],
    isCritical: false,
    completed: false,
    order: 8,
  },
  {
    id: "e-iv",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: false,
    completed: false,
    order: 9,
  },
];

const CARDIAC_ARREST_CHECKLIST: ChecklistItem[] = [
  {
    id: "ca-cpr",
    label: "Start CPR immediately",
    domain: "treatment",
    matchActions: ["start_cpr"],
    isCritical: true,
    completed: false,
    order: 1,
  },
  {
    id: "ca-defib",
    label: "Defibrillate (shockable rhythm)",
    domain: "treatment",
    matchActions: ["defibrillate"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "ca-bvm",
    label: "Bag-valve-mask ventilation",
    domain: "treatment",
    matchActions: ["bag_valve_mask"],
    isCritical: true,
    completed: false,
    order: 3,
  },
  {
    id: "ca-iv",
    label: "Establish IV/IO access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "ca-epi",
    label: "Give epinephrine (after 2nd shock)",
    domain: "treatment",
    matchActions: ["give_epinephrine"],
    isCritical: true,
    completed: false,
    order: 5,
  },
  {
    id: "ca-amio",
    label: "Give amiodarone (after 3rd shock)",
    domain: "treatment",
    matchActions: ["administer_amiodarone"],
    isCritical: false,
    completed: false,
    order: 6,
  },
  {
    id: "ca-rhythm",
    label: "Check rhythm every 2 min",
    domain: "assessment",
    matchActions: ["check_rhythm"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "ca-abg",
    label: "Order ABG post-ROSC",
    domain: "investigation",
    matchActions: ["order_abg"],
    isCritical: false,
    completed: false,
    order: 8,
  },
  {
    id: "ca-ecg",
    label: "Order 12-lead ECG post-ROSC",
    domain: "investigation",
    matchActions: ["order_ecg"],
    isCritical: false,
    completed: false,
    order: 9,
  },
];

const OVERDOSE_CHECKLIST: ChecklistItem[] = [
  {
    id: "o-airway",
    label: "Assess airway",
    domain: "assessment",
    matchActions: ["check_airway"],
    isCritical: true,
    completed: false,
    order: 1,
  },
  {
    id: "o-oxygen",
    label: "Administer oxygen / BVM",
    domain: "treatment",
    matchActions: ["administer_oxygen", "bag_valve_mask"],
    isCritical: true,
    completed: false,
    order: 2,
  },
  {
    id: "o-pupils",
    label: "Check pupils (pinpoint = opioid)",
    domain: "assessment",
    matchActions: ["check_pupils"],
    isCritical: false,
    completed: false,
    order: 3,
  },
  {
    id: "o-naloxone",
    label: "Administer naloxone",
    domain: "treatment",
    matchActions: ["administer_naloxone"],
    isCritical: true,
    completed: false,
    order: 4,
  },
  {
    id: "o-iv",
    label: "Establish IV access",
    domain: "treatment",
    matchActions: ["establish_iv_access"],
    isCritical: false,
    completed: false,
    order: 5,
  },
  {
    id: "o-vitals",
    label: "Assess vital signs",
    domain: "assessment",
    matchActions: ["check_vitals"],
    isCritical: false,
    completed: false,
    order: 6,
  },
  {
    id: "o-tox",
    label: "Order toxicology screen",
    domain: "investigation",
    matchActions: ["order_toxicology_screen"],
    isCritical: true,
    completed: false,
    order: 7,
  },
  {
    id: "o-bmp",
    label: "Order basic metabolic panel",
    domain: "investigation",
    matchActions: ["order_bmp"],
    isCritical: false,
    completed: false,
    order: 8,
  },
  {
    id: "o-monitor",
    label: "Continuous monitoring (naloxone may wear off)",
    domain: "safety",
    matchActions: ["check_vitals"],
    matchPatterns: [/\bmonitor\b/i],
    isCritical: false,
    completed: false,
    order: 9,
  },
];

const SCENARIO_CHECKLISTS: Record<
  string,
  { items: ChecklistItem[]; passThreshold: number }
> = {
  "sepsis-72f": { items: SEPSIS_CHECKLIST, passThreshold: 70 },
  "mi-65m": { items: MI_CHECKLIST, passThreshold: 70 },
  "anaphylaxis-28f": { items: ANAPHYLAXIS_CHECKLIST, passThreshold: 70 },
  "asthma-19m": { items: ASTHMA_CHECKLIST, passThreshold: 70 },
  "stroke-58m": { items: STROKE_CHECKLIST, passThreshold: 70 },
  "dka-34f": { items: DKA_CHECKLIST, passThreshold: 70 },
  "trauma-42m": { items: TRAUMA_CHECKLIST, passThreshold: 70 },
  "peds-seizure-4m": { items: PEDS_SEIZURE_CHECKLIST, passThreshold: 70 },
  "eclampsia-29f": { items: ECLAMPSIA_CHECKLIST, passThreshold: 70 },
  "cardiac-arrest-55m": { items: CARDIAC_ARREST_CHECKLIST, passThreshold: 70 },
  "overdose-22m": { items: OVERDOSE_CHECKLIST, passThreshold: 70 },
};

// ============================================
// SERVICE FUNCTIONS
// ============================================

export function getChecklistForScenario(
  scenarioId: string,
): CompetencyChecklist {
  const def = SCENARIO_CHECKLISTS[scenarioId];
  if (!def) {
    return {
      scenarioId,
      items: [],
      passThreshold: 70,
      criticalPassRequired: true,
    };
  }
  return {
    scenarioId,
    items: def.items.map((item) => ({
      ...item,
      completed: false,
      completedAt: undefined,
    })),
    passThreshold: def.passThreshold,
    criticalPassRequired: true,
  };
}

export function updateChecklist(
  checklist: CompetencyChecklist,
  actionsTaken: string[],
  chatMessages: string[],
  communicationErrors: number,
  currentTime: number,
): CompetencyChecklist {
  const updatedItems = checklist.items.map((item) => {
    if (item.completed) return item;

    // Check action matches
    const actionMatch = item.matchActions.some((a) => actionsTaken.includes(a));

    // Check pattern matches against chat messages
    const patternMatch =
      item.matchPatterns &&
      item.matchPatterns.length > 0 &&
      chatMessages.some((msg) => item.matchPatterns!.some((p) => p.test(msg)));

    // Special: communication domain checks jargon count
    if (
      item.id.endsWith("-comm-plain") &&
      communicationErrors === 0 &&
      actionsTaken.length > 0
    ) {
      return { ...item, completed: true, completedAt: currentTime };
    }

    if (actionMatch || patternMatch) {
      return { ...item, completed: true, completedAt: currentTime };
    }

    return item;
  });

  return { ...checklist, items: updatedItems };
}

export function calculateChecklistResult(
  checklist: CompetencyChecklist,
): ChecklistResult {
  const total = checklist.items.length;
  const completed = checklist.items.filter((i) => i.completed).length;
  const criticalTotal = checklist.items.filter((i) => i.isCritical).length;
  const criticalCompleted = checklist.items.filter(
    (i) => i.isCritical && i.completed,
  ).length;

  const domainScores: Record<
    CompetencyDomain,
    { total: number; completed: number }
  > = {
    assessment: { total: 0, completed: 0 },
    investigation: { total: 0, completed: 0 },
    treatment: { total: 0, completed: 0 },
    communication: { total: 0, completed: 0 },
    safety: { total: 0, completed: 0 },
    escalation: { total: 0, completed: 0 },
  };

  for (const item of checklist.items) {
    domainScores[item.domain].total++;
    if (item.completed) domainScores[item.domain].completed++;
  }

  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const criticalPassed =
    !checklist.criticalPassRequired || criticalCompleted === criticalTotal;
  const passed = percentage >= checklist.passThreshold && criticalPassed;

  return {
    total,
    completed,
    criticalTotal,
    criticalCompleted,
    passed,
    domainScores,
  };
}
