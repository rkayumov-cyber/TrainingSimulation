// ============================================
// DIAGNOSTIC TESTS SERVICE
// ============================================
// Comprehensive library of diagnostic tests with
// reference ranges, categories, and simulated
// turnaround times. Inspired by InSimu (500+)
// and DxR Clinician (670+) test catalogues.
// ============================================

// ── Types & Interfaces ──────────────────────

export type DiagnosticCategory =
  | "haematology"
  | "biochemistry"
  | "blood_gases"
  | "microbiology"
  | "cardiac"
  | "imaging"
  | "urinalysis"
  | "toxicology"
  | "endocrine"
  | "immunology"
  | "coagulation";

export interface DiagnosticTest {
  id: string;
  name: string;
  category: DiagnosticCategory;
  normalRange: string;
  unit: string;
  turnaroundMinutes: number;
  actionId: string;
  description: string;
}

// ── Category Metadata ───────────────────────

export const DIAGNOSTIC_CATEGORIES: {
  id: DiagnosticCategory;
  label: string;
  icon: string;
}[] = [
  { id: "haematology", label: "Haematology", icon: "droplet" },
  { id: "biochemistry", label: "Biochemistry", icon: "flask" },
  { id: "blood_gases", label: "Blood Gases", icon: "wind" },
  { id: "coagulation", label: "Coagulation", icon: "clock" },
  { id: "cardiac", label: "Cardiac", icon: "heart" },
  { id: "microbiology", label: "Microbiology", icon: "bug" },
  { id: "imaging", label: "Imaging", icon: "scan" },
  { id: "urinalysis", label: "Urinalysis", icon: "test-tube" },
  { id: "toxicology", label: "Toxicology", icon: "skull" },
  { id: "endocrine", label: "Endocrine", icon: "activity" },
  { id: "immunology", label: "Immunology", icon: "shield" },
];

// ── Diagnostic Test Catalogue ───────────────

export const DIAGNOSTIC_TESTS: DiagnosticTest[] = [
  // ────────────────────────────────────────────
  // HAEMATOLOGY (10 tests)
  // ────────────────────────────────────────────
  {
    id: "haem_fbc",
    name: "Full Blood Count (FBC)",
    category: "haematology",
    normalRange: "4.0-11.0 \u00d7 10\u2079/L (WBC)",
    unit: "\u00d7 10\u2079/L",
    turnaroundMinutes: 30,
    actionId: "order_cbc",
    description:
      "Complete blood count including WBC, RBC, haemoglobin, haematocrit, and platelet count. First-line screening test for anaemia, infection, and haematological disorders.",
  },
  {
    id: "haem_hb",
    name: "Haemoglobin",
    category: "haematology",
    normalRange: "130-170 g/L (M), 120-150 g/L (F)",
    unit: "g/L",
    turnaroundMinutes: 30,
    actionId: "order_cbc",
    description:
      "Oxygen-carrying protein in red blood cells. Low values indicate anaemia; elevated values may suggest polycythaemia or dehydration.",
  },
  {
    id: "haem_plt",
    name: "Platelet Count",
    category: "haematology",
    normalRange: "150-400 \u00d7 10\u2079/L",
    unit: "\u00d7 10\u2079/L",
    turnaroundMinutes: 30,
    actionId: "order_cbc",
    description:
      "Quantifies circulating platelets. Thrombocytopenia increases bleeding risk; thrombocytosis may indicate reactive or myeloproliferative causes.",
  },
  {
    id: "haem_wcc_diff",
    name: "White Cell Differential",
    category: "haematology",
    normalRange: "Neutrophils 2-7.5, Lymphocytes 1.5-4.0 \u00d7 10\u2079/L",
    unit: "\u00d7 10\u2079/L",
    turnaroundMinutes: 45,
    actionId: "order_cbc",
    description:
      "Breakdown of white cell subtypes including neutrophils, lymphocytes, monocytes, eosinophils, and basophils. Helps differentiate bacterial from viral infections and identify haematological malignancies.",
  },
  {
    id: "haem_retic",
    name: "Reticulocyte Count",
    category: "haematology",
    normalRange: "0.5-2.5%",
    unit: "%",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Measures immature red blood cells released from bone marrow. Elevated in haemolytic anaemia and blood loss; low in aplastic anaemia and marrow failure.",
  },
  {
    id: "haem_esr",
    name: "ESR",
    category: "haematology",
    normalRange: "1-20 mm/hr",
    unit: "mm/hr",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Erythrocyte sedimentation rate. Non-specific marker of inflammation. Elevated in infection, autoimmune disease, and malignancy.",
  },
  {
    id: "haem_film",
    name: "Blood Film",
    category: "haematology",
    normalRange: "Normal morphology",
    unit: "",
    turnaroundMinutes: 90,
    actionId: "",
    description:
      "Microscopic examination of a peripheral blood smear. Identifies abnormal cell morphology including sickle cells, schistocytes, blast cells, and parasites such as malaria.",
  },
  {
    id: "haem_ferritin",
    name: "Ferritin",
    category: "haematology",
    normalRange: "15-300 \u00b5g/L (M), 15-200 \u00b5g/L (F)",
    unit: "\u00b5g/L",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Iron storage protein and acute-phase reactant. Low levels confirm iron deficiency; elevated levels seen in iron overload, inflammation, and liver disease.",
  },
  {
    id: "haem_b12",
    name: "Vitamin B12",
    category: "haematology",
    normalRange: "200-900 ng/L",
    unit: "ng/L",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Essential vitamin for DNA synthesis and neurological function. Deficiency causes megaloblastic anaemia and subacute combined degeneration of the spinal cord.",
  },
  {
    id: "haem_folate",
    name: "Folate",
    category: "haematology",
    normalRange: "3.0-20.0 \u00b5g/L",
    unit: "\u00b5g/L",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Water-soluble B vitamin required for DNA synthesis. Deficiency causes megaloblastic anaemia and is associated with neural tube defects in pregnancy.",
  },

  // ────────────────────────────────────────────
  // BIOCHEMISTRY (15 tests)
  // ────────────────────────────────────────────
  {
    id: "biochem_bmp",
    name: "Basic Metabolic Panel",
    category: "biochemistry",
    normalRange: "Na 135-145, K 3.5-5.0 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 30,
    actionId: "order_bmp",
    description:
      "Panel of electrolytes, glucose, and renal function markers. Essential for assessing metabolic status, fluid balance, and kidney function.",
  },
  {
    id: "biochem_urea",
    name: "Urea",
    category: "biochemistry",
    normalRange: "2.5-7.8 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 30,
    actionId: "order_bmp",
    description:
      "End product of protein metabolism cleared by the kidneys. Elevated in renal impairment, dehydration, upper GI bleeding, and high-protein diets.",
  },
  {
    id: "biochem_creatinine",
    name: "Creatinine",
    category: "biochemistry",
    normalRange: "60-110 \u00b5mol/L (M), 45-90 (F)",
    unit: "\u00b5mol/L",
    turnaroundMinutes: 30,
    actionId: "order_bmp",
    description:
      "Byproduct of muscle creatine metabolism. More specific marker of renal function than urea. Used to calculate eGFR and stage chronic kidney disease.",
  },
  {
    id: "biochem_egfr",
    name: "eGFR",
    category: "biochemistry",
    normalRange: "> 90 mL/min/1.73m\u00b2",
    unit: "mL/min/1.73m\u00b2",
    turnaroundMinutes: 30,
    actionId: "order_bmp",
    description:
      "Estimated glomerular filtration rate calculated from serum creatinine, age, and sex. Primary measure for staging chronic kidney disease (CKD stages 1-5).",
  },
  {
    id: "biochem_lft",
    name: "Liver Function Tests",
    category: "biochemistry",
    normalRange: "ALT 7-56, AST 10-40, ALP 44-147 U/L",
    unit: "U/L",
    turnaroundMinutes: 45,
    actionId: "order_liver_enzymes",
    description:
      "Panel including transaminases (ALT, AST), alkaline phosphatase, GGT, bilirubin, and albumin. Differentiates hepatocellular from cholestatic liver disease.",
  },
  {
    id: "biochem_bilirubin",
    name: "Bilirubin",
    category: "biochemistry",
    normalRange: "3-17 \u00b5mol/L",
    unit: "\u00b5mol/L",
    turnaroundMinutes: 45,
    actionId: "order_liver_enzymes",
    description:
      "Breakdown product of haem metabolism. Elevated in liver disease, biliary obstruction, and haemolysis. Conjugated vs unconjugated helps localise pathology.",
  },
  {
    id: "biochem_albumin",
    name: "Albumin",
    category: "biochemistry",
    normalRange: "35-50 g/L",
    unit: "g/L",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Major plasma protein synthesised by the liver. Low levels indicate chronic liver disease, nephrotic syndrome, malnutrition, or sepsis. Used to correct calcium levels.",
  },
  {
    id: "biochem_crp",
    name: "CRP",
    category: "biochemistry",
    normalRange: "< 5 mg/L",
    unit: "mg/L",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "C-reactive protein, an acute-phase reactant produced by the liver. Rises rapidly in infection, inflammation, and tissue injury. More responsive than ESR.",
  },
  {
    id: "biochem_glucose",
    name: "Glucose (Random)",
    category: "biochemistry",
    normalRange: "4.0-7.8 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 5,
    actionId: "check_blood_glucose",
    description:
      "Point-of-care or laboratory blood glucose measurement. Critical for diagnosing hypoglycaemia, diabetic ketoacidosis, and hyperosmolar states.",
  },
  {
    id: "biochem_hba1c",
    name: "HbA1c",
    category: "biochemistry",
    normalRange: "< 42 mmol/mol (non-diabetic)",
    unit: "mmol/mol",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Glycated haemoglobin reflecting average blood glucose over the preceding 2-3 months. Used for diabetes diagnosis (>= 48 mmol/mol) and monitoring glycaemic control.",
  },
  {
    id: "biochem_calcium",
    name: "Calcium (corrected)",
    category: "biochemistry",
    normalRange: "2.2-2.6 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Adjusted for albumin level. Hypercalcaemia associated with malignancy and hyperparathyroidism; hypocalcaemia seen in vitamin D deficiency and hypoparathyroidism.",
  },
  {
    id: "biochem_phosphate",
    name: "Phosphate",
    category: "biochemistry",
    normalRange: "0.8-1.5 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Essential for bone mineralisation and energy metabolism. Abnormal levels seen in CKD, refeeding syndrome, diabetic ketoacidosis, and parathyroid disorders.",
  },
  {
    id: "biochem_magnesium",
    name: "Magnesium",
    category: "biochemistry",
    normalRange: "0.7-1.0 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Intracellular cation important for neuromuscular function and cardiac rhythm. Hypomagnesaemia causes arrhythmias, tetany, and refractory hypokalaemia.",
  },
  {
    id: "biochem_urate",
    name: "Uric Acid",
    category: "biochemistry",
    normalRange: "200-430 \u00b5mol/L (M), 140-360 (F)",
    unit: "\u00b5mol/L",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "End product of purine metabolism. Elevated in gout, tumour lysis syndrome, and renal impairment. Supersaturation leads to crystal deposition in joints.",
  },
  {
    id: "biochem_amylase",
    name: "Amylase",
    category: "biochemistry",
    normalRange: "28-100 U/L",
    unit: "U/L",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Pancreatic enzyme elevated in acute pancreatitis (typically > 3x upper limit of normal). Also mildly raised in other abdominal pathologies and salivary gland disease.",
  },

  // ────────────────────────────────────────────
  // BLOOD GASES (4 tests)
  // ────────────────────────────────────────────
  {
    id: "gas_abg",
    name: "ABG",
    category: "blood_gases",
    normalRange: "pH 7.35-7.45, PaCO2 4.7-6.0 kPa, PaO2 10.6-13.3 kPa",
    unit: "kPa",
    turnaroundMinutes: 5,
    actionId: "order_abg",
    description:
      "Arterial blood gas analysis measuring pH, partial pressures of O2 and CO2, bicarbonate, and base excess. Essential for assessing respiratory failure and acid-base disturbances.",
  },
  {
    id: "gas_vbg",
    name: "VBG",
    category: "blood_gases",
    normalRange: "pH 7.31-7.41, PvCO2 5.5-6.8 kPa",
    unit: "kPa",
    turnaroundMinutes: 5,
    actionId: "",
    description:
      "Venous blood gas. Less invasive alternative to ABG for assessing acid-base status. pH correlates well with arterial values but PO2 is not interpretable.",
  },
  {
    id: "gas_lactate",
    name: "Lactate",
    category: "blood_gases",
    normalRange: "0.5-2.0 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 5,
    actionId: "order_lactate",
    description:
      "Marker of tissue hypoperfusion and anaerobic metabolism. Elevated in sepsis, shock, mesenteric ischaemia, and seizures. Serial measurements guide resuscitation.",
  },
  {
    id: "gas_bicarb",
    name: "Bicarbonate",
    category: "blood_gases",
    normalRange: "22-28 mmol/L",
    unit: "mmol/L",
    turnaroundMinutes: 5,
    actionId: "order_abg",
    description:
      "Major buffer in the blood. Low bicarbonate indicates metabolic acidosis (DKA, lactic acidosis, renal tubular acidosis); elevated in metabolic alkalosis (vomiting, diuretic use).",
  },

  // ────────────────────────────────────────────
  // COAGULATION (5 tests)
  // ────────────────────────────────────────────
  {
    id: "coag_ptinr",
    name: "PT/INR",
    category: "coagulation",
    normalRange: "PT 10-14s, INR 0.8-1.2",
    unit: "seconds / ratio",
    turnaroundMinutes: 30,
    actionId: "order_coagulation",
    description:
      "Prothrombin time and international normalised ratio. Assesses the extrinsic coagulation pathway. Prolonged in warfarin therapy, liver disease, vitamin K deficiency, and DIC.",
  },
  {
    id: "coag_aptt",
    name: "APTT",
    category: "coagulation",
    normalRange: "25-35 seconds",
    unit: "seconds",
    turnaroundMinutes: 30,
    actionId: "order_coagulation",
    description:
      "Activated partial thromboplastin time. Assesses the intrinsic coagulation pathway. Prolonged in heparin therapy, haemophilia, and lupus anticoagulant.",
  },
  {
    id: "coag_ddimer",
    name: "D-dimer",
    category: "coagulation",
    normalRange: "< 500 ng/mL FEU",
    unit: "ng/mL FEU",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "Fibrin degradation product. High sensitivity for VTE exclusion when pre-test probability is low. Elevated in PE, DVT, DIC, sepsis, malignancy, and post-surgery.",
  },
  {
    id: "coag_fibrinogen",
    name: "Fibrinogen",
    category: "coagulation",
    normalRange: "1.5-4.0 g/L",
    unit: "g/L",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Clotting factor and acute-phase reactant. Low levels in DIC, massive transfusion, and liver failure. Target replacement level in active bleeding is > 1.5 g/L.",
  },
  {
    id: "coag_bleeding_time",
    name: "Bleeding Time",
    category: "coagulation",
    normalRange: "2-9 minutes",
    unit: "minutes",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "In-vivo assessment of primary haemostasis. Prolonged in platelet disorders, von Willebrand disease, and antiplatelet drug use. Largely replaced by PFA-100 testing.",
  },

  // ────────────────────────────────────────────
  // CARDIAC (5 tests)
  // ────────────────────────────────────────────
  {
    id: "cardiac_troponin",
    name: "Troponin I/T",
    category: "cardiac",
    normalRange: "< 14 ng/L (high-sensitivity)",
    unit: "ng/L",
    turnaroundMinutes: 60,
    actionId: "order_troponin",
    description:
      "Cardiac-specific biomarker of myocardial injury. Elevated in acute coronary syndromes, myocarditis, PE, and renal failure. Serial measurements at 0 and 3 hours for rule-out protocols.",
  },
  {
    id: "cardiac_bnp",
    name: "BNP",
    category: "cardiac",
    normalRange: "< 100 pg/mL",
    unit: "pg/mL",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "B-type natriuretic peptide released by ventricular myocytes in response to wall stress. Elevated in heart failure. Useful for differentiating cardiac from pulmonary causes of dyspnoea.",
  },
  {
    id: "cardiac_ckmb",
    name: "CK-MB",
    category: "cardiac",
    normalRange: "< 25 U/L",
    unit: "U/L",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Creatine kinase MB isoenzyme. Less specific than troponin for myocardial injury but useful for detecting reinfarction. Peaks at 24 hours and normalises by 72 hours.",
  },
  {
    id: "cardiac_ecg",
    name: "ECG (12-lead)",
    category: "cardiac",
    normalRange: "Normal sinus rhythm",
    unit: "",
    turnaroundMinutes: 5,
    actionId: "order_ecg",
    description:
      "Standard 12-lead electrocardiogram recording cardiac electrical activity. Identifies arrhythmias, ST-segment changes, conduction abnormalities, and chamber hypertrophy.",
  },
  {
    id: "cardiac_echo",
    name: "Echocardiogram",
    category: "cardiac",
    normalRange: "Normal LV function, EF > 55%",
    unit: "",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "Transthoracic ultrasound assessment of cardiac structure and function. Evaluates ejection fraction, valvular pathology, wall motion abnormalities, and pericardial effusion.",
  },

  // ────────────────────────────────────────────
  // MICROBIOLOGY (6 tests)
  // ────────────────────────────────────────────
  {
    id: "micro_blood_cx",
    name: "Blood Cultures",
    category: "microbiology",
    normalRange: "No growth at 48h",
    unit: "",
    turnaroundMinutes: 2880,
    actionId: "order_blood_cultures",
    description:
      "Aerobic and anaerobic cultures from peripheral venepuncture. Gold standard for diagnosing bacteraemia and fungaemia. Two sets from different sites recommended before antibiotics.",
  },
  {
    id: "micro_urine_mcs",
    name: "Urine MC&S",
    category: "microbiology",
    normalRange: "No significant growth",
    unit: "",
    turnaroundMinutes: 1440,
    actionId: "order_urinalysis",
    description:
      "Urine microscopy, culture, and sensitivity. Identifies urinary tract pathogens and antibiotic sensitivities. Significant bacteriuria typically > 10\u2075 CFU/mL.",
  },
  {
    id: "micro_sputum",
    name: "Sputum Culture",
    category: "microbiology",
    normalRange: "Normal oral flora",
    unit: "",
    turnaroundMinutes: 2880,
    actionId: "",
    description:
      "Culture of expectorated or induced sputum for respiratory pathogens. Useful in community and hospital-acquired pneumonia. Gram stain provides rapid preliminary identification.",
  },
  {
    id: "micro_wound",
    name: "Wound Swab",
    category: "microbiology",
    normalRange: "No pathogenic organisms",
    unit: "",
    turnaroundMinutes: 1440,
    actionId: "",
    description:
      "Microbiological sampling of wound or surgical site. Identifies causative organisms and antibiotic sensitivities to guide targeted therapy in wound infections.",
  },
  {
    id: "micro_stool",
    name: "Stool Culture",
    category: "microbiology",
    normalRange: "No enteric pathogens",
    unit: "",
    turnaroundMinutes: 2880,
    actionId: "",
    description:
      "Culture for enteric pathogens including Salmonella, Shigella, Campylobacter, and E. coli O157. Indicated in persistent or bloody diarrhoea and suspected foodborne illness.",
  },
  {
    id: "micro_csf",
    name: "CSF Analysis",
    category: "microbiology",
    normalRange: "WCC < 5, Protein 0.15-0.45 g/L, Glucose 2.2-3.3",
    unit: "",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Cerebrospinal fluid analysis from lumbar puncture. Includes cell count, protein, glucose, Gram stain, and culture. Differentiates bacterial, viral, and tuberculous meningitis.",
  },

  // ────────────────────────────────────────────
  // IMAGING (8 tests)
  // ────────────────────────────────────────────
  {
    id: "img_cxr",
    name: "Chest X-ray",
    category: "imaging",
    normalRange: "Normal cardiomediastinal silhouette",
    unit: "",
    turnaroundMinutes: 15,
    actionId: "order_chest_xray",
    description:
      "PA or AP radiograph of the chest. First-line imaging for pneumonia, pneumothorax, pleural effusion, cardiomegaly, and rib fractures. Quick and widely available.",
  },
  {
    id: "img_ct_head",
    name: "CT Head",
    category: "imaging",
    normalRange: "No acute intracranial pathology",
    unit: "",
    turnaroundMinutes: 30,
    actionId: "order_ct_head",
    description:
      "Non-contrast CT of the brain. Rapidly identifies acute haemorrhage, large territory infarction, mass effect, hydrocephalus, and skull fractures. First-line neuroimaging in the emergency setting.",
  },
  {
    id: "img_cta",
    name: "CT Angiogram",
    category: "imaging",
    normalRange: "No filling defects",
    unit: "",
    turnaroundMinutes: 30,
    actionId: "order_ct_angio",
    description:
      "Contrast-enhanced CT for vascular pathology. CTPA is the gold standard for diagnosing pulmonary embolism. Also used for aortic dissection, mesenteric ischaemia, and vascular injury.",
  },
  {
    id: "img_ct_abdo",
    name: "CT Abdomen/Pelvis",
    category: "imaging",
    normalRange: "No acute abdominal pathology",
    unit: "",
    turnaroundMinutes: 45,
    actionId: "",
    description:
      "Cross-sectional imaging of the abdomen and pelvis with or without contrast. Identifies appendicitis, diverticulitis, bowel obstruction, AAA, renal calculi, and abdominal trauma.",
  },
  {
    id: "img_pelvis_xr",
    name: "Pelvic X-ray",
    category: "imaging",
    normalRange: "No fracture or dislocation",
    unit: "",
    turnaroundMinutes: 15,
    actionId: "order_pelvis_xray",
    description:
      "AP radiograph of the pelvis. Used in trauma to identify pelvic ring fractures, hip fractures, and dislocations. Part of the ATLS primary survey in major trauma.",
  },
  {
    id: "img_fast",
    name: "FAST Scan",
    category: "imaging",
    normalRange: "No free fluid",
    unit: "",
    turnaroundMinutes: 10,
    actionId: "order_fast_scan",
    description:
      "Focused Assessment with Sonography in Trauma. Bedside ultrasound assessing for free fluid in the perihepatic, perisplenic, pelvic, and pericardial spaces.",
  },
  {
    id: "img_mri_brain",
    name: "MRI Brain",
    category: "imaging",
    normalRange: "No acute infarct or haemorrhage",
    unit: "",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Magnetic resonance imaging of the brain. Superior soft tissue contrast compared to CT. Gold standard for acute ischaemic stroke (DWI), demyelination, posterior fossa, and spinal cord pathology.",
  },
  {
    id: "img_us_abdo",
    name: "Ultrasound Abdomen",
    category: "imaging",
    normalRange:
      "Normal hepatobiliary, renal, and splenic appearances",
    unit: "",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "Non-ionising imaging of abdominal organs. First-line for biliary disease (gallstones, cholecystitis), renal obstruction, AAA screening, and free fluid assessment.",
  },

  // ────────────────────────────────────────────
  // URINALYSIS (3 tests)
  // ────────────────────────────────────────────
  {
    id: "urine_dipstick",
    name: "Urine Dipstick",
    category: "urinalysis",
    normalRange: "pH 5-7, SG 1.005-1.030, no blood/protein/glucose",
    unit: "",
    turnaroundMinutes: 2,
    actionId: "order_urinalysis",
    description:
      "Point-of-care urine reagent strip test. Detects blood, protein, glucose, nitrites, leucocytes, ketones, and bilirubin. Rapid screening for UTI, renal disease, and metabolic disorders.",
  },
  {
    id: "urine_ketones",
    name: "Urine Ketones",
    category: "urinalysis",
    normalRange: "Negative",
    unit: "",
    turnaroundMinutes: 2,
    actionId: "check_urine_ketones",
    description:
      "Detection of ketone bodies (acetoacetate) in urine. Positive in diabetic ketoacidosis, starvation ketosis, and alcoholic ketoacidosis. Does not detect beta-hydroxybutyrate.",
  },
  {
    id: "urine_pregnancy",
    name: "Urine Pregnancy Test",
    category: "urinalysis",
    normalRange: "Negative",
    unit: "",
    turnaroundMinutes: 5,
    actionId: "",
    description:
      "Qualitative detection of human chorionic gonadotropin (hCG) in urine. Essential in all women of childbearing age presenting with abdominal pain, vaginal bleeding, or before imaging.",
  },

  // ────────────────────────────────────────────
  // TOXICOLOGY (3 tests)
  // ────────────────────────────────────────────
  {
    id: "tox_screen",
    name: "Toxicology Screen",
    category: "toxicology",
    normalRange: "Negative",
    unit: "",
    turnaroundMinutes: 60,
    actionId: "order_toxicology_screen",
    description:
      "Urine or serum screening for common drugs of abuse and toxins. Typically includes opioids, benzodiazepines, amphetamines, cannabinoids, and cocaine metabolites.",
  },
  {
    id: "tox_paracetamol",
    name: "Paracetamol Level",
    category: "toxicology",
    normalRange: "< 10 mg/L (therapeutic)",
    unit: "mg/L",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "Serum paracetamol concentration. Must be taken at 4 hours post-ingestion for accurate assessment. Plotted on the treatment nomogram to determine need for N-acetylcysteine.",
  },
  {
    id: "tox_salicylate",
    name: "Salicylate Level",
    category: "toxicology",
    normalRange: "< 300 mg/L",
    unit: "mg/L",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "Serum salicylate concentration. Toxicity causes mixed respiratory alkalosis and metabolic acidosis. Severe poisoning (> 700 mg/L) may require haemodialysis.",
  },

  // ────────────────────────────────────────────
  // ENDOCRINE (4 tests)
  // ────────────────────────────────────────────
  {
    id: "endo_tft",
    name: "Thyroid Function (TSH, fT4)",
    category: "endocrine",
    normalRange: "TSH 0.4-4.0 mU/L, fT4 12-22 pmol/L",
    unit: "mU/L / pmol/L",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Thyroid-stimulating hormone and free thyroxine. First-line investigation for thyroid dysfunction. Low TSH with high fT4 in hyperthyroidism; high TSH with low fT4 in hypothyroidism.",
  },
  {
    id: "endo_cortisol",
    name: "Cortisol",
    category: "endocrine",
    normalRange: "171-536 nmol/L (AM)",
    unit: "nmol/L",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Morning serum cortisol level. Low values suggest adrenal insufficiency (Addison disease); elevated values in Cushing syndrome. Random cortisol > 500 nmol/L excludes adrenal crisis.",
  },
  {
    id: "endo_insulin",
    name: "Insulin Level",
    category: "endocrine",
    normalRange: "2.6-24.9 mU/L (fasting)",
    unit: "mU/L",
    turnaroundMinutes: 180,
    actionId: "",
    description:
      "Fasting serum insulin. Elevated with hypoglycaemia suggests insulinoma or exogenous insulin. Used with C-peptide to differentiate endogenous from exogenous sources.",
  },
  {
    id: "endo_hcg",
    name: "HCG",
    category: "endocrine",
    normalRange: "< 5 IU/L (non-pregnant)",
    unit: "IU/L",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Quantitative serum beta-hCG. Confirms pregnancy and monitors early pregnancy viability. Doubling time < 48h expected in normal intrauterine pregnancy. Also a tumour marker for gestational trophoblastic disease.",
  },

  // ────────────────────────────────────────────
  // IMMUNOLOGY (3 tests)
  // ────────────────────────────────────────────
  {
    id: "immuno_crp",
    name: "CRP",
    category: "immunology",
    normalRange: "< 5 mg/L",
    unit: "mg/L",
    turnaroundMinutes: 30,
    actionId: "",
    description:
      "C-reactive protein as an immunological inflammatory marker. Acute-phase reactant useful for monitoring disease activity in autoimmune conditions and response to anti-inflammatory therapy.",
  },
  {
    id: "immuno_procalcitonin",
    name: "Procalcitonin",
    category: "immunology",
    normalRange: "< 0.1 \u00b5g/L",
    unit: "\u00b5g/L",
    turnaroundMinutes: 60,
    actionId: "",
    description:
      "Biomarker more specific for bacterial infection than CRP. Helps differentiate bacterial from viral infections and guides antibiotic stewardship. Levels correlate with sepsis severity.",
  },
  {
    id: "immuno_immunoglobulins",
    name: "Immunoglobulins",
    category: "immunology",
    normalRange: "IgG 6-16, IgA 0.8-3.0, IgM 0.4-2.5 g/L",
    unit: "g/L",
    turnaroundMinutes: 120,
    actionId: "",
    description:
      "Quantitative measurement of immunoglobulin classes. Identifies immunodeficiency (low levels) and paraproteinaemia (monoclonal bands). IgA deficiency is the most common primary immunodeficiency.",
  },
];

// ── Helper Functions ────────────────────────

/**
 * Returns all diagnostic tests belonging to a given category.
 */
export function getTestsByCategory(
  category: DiagnosticCategory
): DiagnosticTest[] {
  return DIAGNOSTIC_TESTS.filter((test) => test.category === category);
}

/**
 * Finds a single diagnostic test by its unique ID.
 */
export function getTestById(id: string): DiagnosticTest | undefined {
  return DIAGNOSTIC_TESTS.find((test) => test.id === id);
}

/**
 * Returns a human-readable label for a diagnostic category.
 */
export function getCategoryLabel(category: DiagnosticCategory): string {
  const entry = DIAGNOSTIC_CATEGORIES.find((c) => c.id === category);
  return entry?.label ?? category;
}
