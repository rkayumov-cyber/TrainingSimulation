// ============================================================================
// Medical Image Catalog
//
// Pre-configured clinical image sets for each scenario, leveraging
// the existing SVG generators. Also provides reference image metadata
// for clinical education (descriptions, clinical significance, tags).
// ============================================================================

import type { ECGPattern, ChestXrayFinding, PupilState } from "./svgGenerators";

// ============================================================================
// Types
// ============================================================================

export interface CatalogImage {
  id: string;
  name: string;
  category: ImageCategory;
  subcategory: string;
  description: string;
  clinicalSignificance: string;
  tags: string[];
  scenarioIds: string[];
  generator?: ImageGenerator;
}

export type ImageCategory =
  | "ecg"
  | "chest_xray"
  | "ct"
  | "ultrasound"
  | "physical_exam"
  | "procedure"
  | "monitoring"
  | "anatomy";

export type ImageGenerator =
  | { type: "ecg"; pattern: ECGPattern; hr?: number }
  | { type: "cxr"; finding: ChestXrayFinding }
  | { type: "pupils"; left: PupilState; right: PupilState }
  | { type: "gcs"; score: number }
  | { type: "burns"; tbsa: number }
  | { type: "abg"; pH: number; pCO2: number; pO2: number; hco3: number };

// ============================================================================
// ECG Reference Library
// ============================================================================

const ECG_CATALOG: CatalogImage[] = [
  {
    id: "ecg-normal-sinus",
    name: "Normal Sinus Rhythm",
    category: "ecg",
    subcategory: "Normal",
    description:
      "Regular rhythm, rate 60-100 bpm. P wave before every QRS, QRS < 120ms. Normal PR interval (120-200ms). Normal QTc.",
    clinicalSignificance:
      "Baseline normal ECG. Important to recognize as normal so abnormalities can be identified.",
    tags: ["normal", "sinus rhythm", "baseline"],
    scenarioIds: ["*"],
    generator: { type: "ecg", pattern: "normal", hr: 75 },
  },
  {
    id: "ecg-sinus-tachy",
    name: "Sinus Tachycardia",
    category: "ecg",
    subcategory: "Rate abnormality",
    description:
      "Regular sinus rhythm with rate > 100 bpm. Normal P waves, QRS, and intervals. Often a physiological response.",
    clinicalSignificance:
      "Usually a response to: pain, fever, hypovolemia, anxiety, sepsis, PE, thyrotoxicosis. Treat the underlying cause, not the rate.",
    tags: [
      "tachycardia",
      "sepsis",
      "pain",
      "hypovolemia",
      "fever",
      "anxiety",
    ],
    scenarioIds: [
      "sepsis-72f",
      "anaphylaxis-28f",
      "dka-34f",
      "trauma-42m",
      "eclampsia-29f",
    ],
    generator: { type: "ecg", pattern: "normal", hr: 120 },
  },
  {
    id: "ecg-sinus-brady",
    name: "Sinus Bradycardia",
    category: "ecg",
    subcategory: "Rate abnormality",
    description:
      "Regular sinus rhythm with rate < 60 bpm. Normal morphology otherwise. May be physiological (athletes) or pathological.",
    clinicalSignificance:
      "Pathological causes: opioid overdose, beta-blocker toxicity, hypothyroidism, raised ICP, inferior MI, hypothermia. Treat if symptomatic (atropine).",
    tags: ["bradycardia", "overdose", "opioid", "hypothermia"],
    scenarioIds: ["overdose-22m"],
    generator: { type: "ecg", pattern: "normal", hr: 50 },
  },
  {
    id: "ecg-anterior-stemi",
    name: "Anterior STEMI",
    category: "ecg",
    subcategory: "Acute coronary syndrome",
    description:
      "ST elevation in leads V1-V4 (>2mm in contiguous leads). Reciprocal ST depression in inferior leads (II, III, aVF). Hyperacute T-waves early.",
    clinicalSignificance:
      "LAD occlusion → anterior wall MI. High mortality. Activate cath lab immediately. Door-to-balloon goal <90 min.",
    tags: [
      "STEMI",
      "anterior",
      "LAD",
      "ST elevation",
      "myocardial infarction",
      "cath lab",
    ],
    scenarioIds: ["mi-65m"],
    generator: { type: "ecg", pattern: "stemi" },
  },
  {
    id: "ecg-inferior-stemi",
    name: "Inferior STEMI",
    category: "ecg",
    subcategory: "Acute coronary syndrome",
    description:
      "ST elevation in leads II, III, aVF. Reciprocal depression in aVL and I. May involve RCA or LCx.",
    clinicalSignificance:
      "RCA occlusion most common. Check right-sided leads (V4R) for RV involvement. Avoid nitrates if RV MI. Emergent PCI.",
    tags: [
      "STEMI",
      "inferior",
      "RCA",
      "ST elevation",
      "right ventricle",
      "post-arrest",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: { type: "ecg", pattern: "stemi" },
  },
  {
    id: "ecg-vfib",
    name: "Ventricular Fibrillation (VF)",
    category: "ecg",
    subcategory: "Cardiac arrest",
    description:
      "Chaotic, irregular waveform with no discernible P waves, QRS complexes, or T waves. Completely disorganized electrical activity.",
    clinicalSignificance:
      "SHOCKABLE rhythm. Immediate defibrillation (120-200J biphasic). CPR between shocks. Best prognosis of arrest rhythms if defibrillated early.",
    tags: [
      "VF",
      "cardiac arrest",
      "shockable",
      "defibrillation",
      "emergency",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: { type: "ecg", pattern: "vfib" },
  },
  {
    id: "ecg-vtach",
    name: "Ventricular Tachycardia (VT)",
    category: "ecg",
    subcategory: "Cardiac arrest",
    description:
      "Wide-complex tachycardia (QRS > 120ms), regular rate 150-250 bpm. Monomorphic or polymorphic. AV dissociation if present is diagnostic.",
    clinicalSignificance:
      "Pulseless VT: treat as VF (shockable). Stable VT: amiodarone 150mg IV. Unstable with pulse: synchronized cardioversion. Always assume VT until proven otherwise.",
    tags: [
      "VT",
      "wide complex tachycardia",
      "shockable",
      "amiodarone",
      "cardioversion",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: { type: "ecg", pattern: "vtach" },
  },
  {
    id: "ecg-afib",
    name: "Atrial Fibrillation",
    category: "ecg",
    subcategory: "Arrhythmia",
    description:
      "Irregularly irregular rhythm. No discrete P waves (fibrillatory baseline). Variable RR intervals. Rate may be controlled or rapid.",
    clinicalSignificance:
      "Common cause of cardioembolic stroke. Rate control (beta-blocker/CCB) vs rhythm control. Anticoagulation if CHA2DS2-VASc ≥2 in males, ≥3 in females.",
    tags: [
      "AF",
      "atrial fibrillation",
      "irregular",
      "stroke risk",
      "anticoagulation",
    ],
    scenarioIds: ["stroke-58m"],
    generator: { type: "ecg", pattern: "afib" },
  },
  {
    id: "ecg-asystole",
    name: "Asystole",
    category: "ecg",
    subcategory: "Cardiac arrest",
    description:
      "Flat line — no electrical activity. May have very low-amplitude fibrillatory waves (confirm in 2 leads and check connections).",
    clinicalSignificance:
      "NON-SHOCKABLE rhythm. CPR + epinephrine. Worst prognosis of arrest rhythms. Confirm in 2 leads. Check leads, gain, connections before declaring.",
    tags: [
      "asystole",
      "flatline",
      "non-shockable",
      "cardiac arrest",
      "CPR",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: { type: "ecg", pattern: "asystole" },
  },
  {
    id: "ecg-peaked-t",
    name: "Hyperkalemia — Peaked T-waves",
    category: "ecg",
    subcategory: "Metabolic",
    description:
      "Tall, peaked, symmetrical T-waves (especially V2-V4). May progress to: widened QRS, sine wave pattern, VF/asystole.",
    clinicalSignificance:
      "K+ > 5.5: peaked T-waves. K+ > 6.5: widened QRS, P wave loss. K+ > 7.0: sine wave → VF. Treat urgently: calcium gluconate (cardioprotection), insulin+dextrose, salbutamol.",
    tags: [
      "hyperkalemia",
      "peaked T-waves",
      "potassium",
      "DKA",
      "renal failure",
    ],
    scenarioIds: ["dka-34f", "cardiac-arrest-55m"],
    generator: { type: "ecg", pattern: "normal", hr: 118 },
  },
];

// ============================================================================
// Chest X-Ray Reference Library
// ============================================================================

const CXR_CATALOG: CatalogImage[] = [
  {
    id: "cxr-normal",
    name: "Normal Chest X-Ray",
    category: "chest_xray",
    subcategory: "Normal",
    description:
      "Clear lung fields bilaterally. Normal heart size (CTR < 50%). No pleural effusions. No pneumothorax. Mediastinum midline. Bony thorax intact.",
    clinicalSignificance:
      "Important to recognize normal anatomy for comparison. Systematic approach: Airway, Breathing, Cardiac, Diaphragm, Everything else (ABCDE).",
    tags: ["normal", "baseline", "clear lungs"],
    scenarioIds: ["*"],
    generator: { type: "cxr", finding: "normal" },
  },
  {
    id: "cxr-pneumothorax",
    name: "Pneumothorax",
    category: "chest_xray",
    subcategory: "Emergency",
    description:
      "Visible pleural line with absent lung markings beyond it. Lung collapse. In tension: mediastinal shift away from affected side, flattened hemidiaphragm.",
    clinicalSignificance:
      "Simple: observation (small) or chest drain (large/>2cm). Tension: needle decompression at 2nd ICS MCL followed by chest drain. CLINICAL DIAGNOSIS — don't wait for CXR in tension.",
    tags: [
      "pneumothorax",
      "tension",
      "chest drain",
      "trauma",
      "emergency",
    ],
    scenarioIds: ["trauma-42m", "asthma-19m"],
    generator: { type: "cxr", finding: "pneumothorax" },
  },
  {
    id: "cxr-pleural-effusion",
    name: "Pleural Effusion",
    category: "chest_xray",
    subcategory: "Fluid",
    description:
      "Blunting of costophrenic angle. Meniscus sign. In large effusion: opacification of hemithorax, mediastinal shift. Need >200mL to be visible on upright CXR.",
    clinicalSignificance:
      "Causes: heart failure (bilateral), pneumonia (parapneumonic), malignancy, PE, hepatic/renal. Diagnostic aspiration if cause unclear. Drain if respiratory compromise.",
    tags: [
      "effusion",
      "fluid",
      "heart failure",
      "pneumonia",
      "malignancy",
    ],
    scenarioIds: ["sepsis-72f"],
    generator: { type: "cxr", finding: "pleural_effusion" },
  },
  {
    id: "cxr-cardiomegaly",
    name: "Cardiomegaly",
    category: "chest_xray",
    subcategory: "Cardiac",
    description:
      "Cardiothoracic ratio > 50% on PA film. Heart shadow extends beyond expected borders. May see upper lobe pulmonary venous distension (congestion).",
    clinicalSignificance:
      "Causes: heart failure, valvular disease, pericardial effusion, cardiomyopathy. Correlate with echocardiography. If acute + hypotension: consider tamponade.",
    tags: [
      "cardiomegaly",
      "heart failure",
      "pericardial effusion",
      "tamponade",
    ],
    scenarioIds: ["mi-65m", "sepsis-72f"],
    generator: { type: "cxr", finding: "cardiomegaly" },
  },
];

// ============================================================================
// Physical Exam Reference Images
// ============================================================================

const EXAM_CATALOG: CatalogImage[] = [
  {
    id: "pupils-normal",
    name: "Normal Pupils (PERRL)",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "Pupils Equal, Round, Reactive to Light and accommodation. Size 3-4mm in normal lighting. Brisk constriction to light.",
    clinicalSignificance:
      "Normal pupil exam excludes many neurological emergencies. Document baseline for serial comparison.",
    tags: ["pupils", "normal", "PERRL", "neurological"],
    scenarioIds: ["*"],
    generator: {
      type: "pupils",
      left: { size: 3, reactive: true },
      right: { size: 3, reactive: true },
    },
  },
  {
    id: "pupils-pinpoint",
    name: "Pinpoint Pupils (Miosis)",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "Bilateral pinpoint pupils (1-2mm). Still reactive under magnification. Classic opioid toxidrome.",
    clinicalSignificance:
      "Opioid overdose (most common). Also: organophosphate poisoning, pontine hemorrhage, pilocarpine drops. Response to naloxone is diagnostic AND therapeutic.",
    tags: [
      "pinpoint",
      "miosis",
      "opioid",
      "overdose",
      "organophosphate",
    ],
    scenarioIds: ["overdose-22m"],
    generator: {
      type: "pupils",
      left: { size: 1, reactive: true },
      right: { size: 1, reactive: true },
    },
  },
  {
    id: "pupils-fixed-dilated",
    name: "Fixed Dilated Pupils",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "Bilateral fixed, dilated pupils (6-8mm). Non-reactive to light. Can be unilateral (CN III palsy) or bilateral.",
    clinicalSignificance:
      "Bilateral: cardiac arrest, brain death, anticholinergic toxicity, post-seizure (transient). Unilateral: uncal herniation (EMERGENCY — contralateral hemiparesis, ipsilateral pupil dilation).",
    tags: [
      "dilated",
      "fixed",
      "mydriasis",
      "brain death",
      "herniation",
      "cardiac arrest",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: {
      type: "pupils",
      left: { size: 7, reactive: false },
      right: { size: 7, reactive: false },
    },
  },
  {
    id: "pupils-unequal",
    name: "Anisocoria (Unequal Pupils)",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "Asymmetric pupil size. The abnormal pupil may be the larger (CN III palsy, herniation) or smaller (Horner's syndrome).",
    clinicalSignificance:
      "NEW anisocoria is an EMERGENCY until proven otherwise. Large pupil + headache + focal neurology = uncal herniation until CT excludes. Small pupil + ptosis + anhidrosis = Horner's syndrome.",
    tags: [
      "anisocoria",
      "unequal",
      "herniation",
      "Horner",
      "CN III",
      "stroke",
    ],
    scenarioIds: ["stroke-58m", "trauma-42m"],
    generator: {
      type: "pupils",
      left: { size: 3, reactive: true },
      right: { size: 6, reactive: false },
    },
  },
  {
    id: "gcs-15",
    name: "GCS 15/15 — Normal",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "E4 (spontaneous eye opening) + V5 (oriented speech) + M6 (obeys commands) = 15. Fully conscious and alert.",
    clinicalSignificance:
      "Normal consciousness. Document as baseline. Any decline from GCS 15 requires investigation.",
    tags: ["GCS", "normal", "consciousness", "neurological"],
    scenarioIds: ["*"],
    generator: { type: "gcs", score: 15 },
  },
  {
    id: "gcs-8",
    name: "GCS 8/15 — Coma",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "GCS ≤ 8 = unable to protect airway. Commonly E2V2M4 (eyes to pain, incomprehensible sounds, withdrawal).",
    clinicalSignificance:
      "GCS ≤ 8: INTUBATION indicated for airway protection. Cannot maintain protective reflexes. Investigate cause: stroke, overdose, TBI, metabolic, infection.",
    tags: [
      "GCS",
      "coma",
      "intubation",
      "airway",
      "unresponsive",
    ],
    scenarioIds: ["overdose-22m", "stroke-58m", "peds-seizure-4m"],
    generator: { type: "gcs", score: 8 },
  },
  {
    id: "gcs-3",
    name: "GCS 3/15 — Unresponsive",
    category: "physical_exam",
    subcategory: "Neurological",
    description:
      "E1 (no eye opening) + V1 (no verbal response) + M1 (no motor response) = 3. Minimum score. Deep coma or death.",
    clinicalSignificance:
      "Minimum possible GCS. Seen in: cardiac arrest, brain death, deep coma, barbiturate overdose. Does NOT equal brain death — must perform formal brainstem testing.",
    tags: [
      "GCS",
      "unresponsive",
      "cardiac arrest",
      "brain death",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: { type: "gcs", score: 3 },
  },
];

// ============================================================================
// ABG Reference Images
// ============================================================================

// ============================================================================
// PE-Specific ECG & CXR (Master PE scenario)
// ============================================================================

const PE_CATALOG: CatalogImage[] = [
  {
    id: "ecg-s1q3t3-rvstrain",
    name: "S1Q3T3 — Acute RV Strain (PE)",
    category: "ecg",
    subcategory: "Right heart",
    description:
      "S wave in lead I, Q wave in lead III, inverted T wave in lead III (S1Q3T3). T-wave inversions V1-V4 (RV strain pattern). New incomplete RBBB. Right axis deviation. Sinus tachycardia 118 bpm.",
    clinicalSignificance:
      "Classic acute right heart strain — highly suggestive of significant PE. Not specific (also seen in acute cor pulmonale from any cause). S1Q3T3 seen in ~20% of PE, but T-wave inversions V1-V4 are more sensitive. DO NOT mistake for STEMI — troponin may be elevated from RV ischemia, not coronary occlusion.",
    tags: [
      "S1Q3T3",
      "PE",
      "right ventricular strain",
      "RBBB",
      "right axis deviation",
      "pulmonary embolism",
      "T-wave inversion",
    ],
    scenarioIds: ["master-pe-47f"],
    generator: { type: "ecg", pattern: "normal", hr: 118 },
  },
  {
    id: "cxr-pe-westermark",
    name: "CXR — Westermark & Fleischner Signs (PE)",
    category: "chest_xray",
    subcategory: "Vascular",
    description:
      "Subtle oligemia (decreased vascular markings) in the right lower lobe (Westermark sign). Prominence of the right descending pulmonary artery (Fleischner sign). Small right-sided pleural effusion. No pneumothorax. No widened mediastinum.",
    clinicalSignificance:
      "CXR is often normal in PE — these subtle findings are easily missed. Westermark sign (focal oligemia) is specific but insensitive (~2%). Fleischner sign (enlarged central PA) indicates proximal clot. Hampton hump (wedge-shaped peripheral opacity) indicates pulmonary infarction. Normal CXR does NOT exclude PE.",
    tags: [
      "Westermark",
      "Fleischner",
      "PE",
      "oligemia",
      "pulmonary embolism",
      "pleural effusion",
    ],
    scenarioIds: ["master-pe-47f"],
    generator: { type: "cxr", finding: "normal" },
  },
  {
    id: "abg-pe-resp-alkalosis",
    name: "ABG — Respiratory Alkalosis with Hypoxemia (PE)",
    category: "monitoring",
    subcategory: "Blood Gas",
    description:
      "pH 7.48 (alkalotic), pCO2 28 mmHg (LOW — hyperventilation), pO2 58 mmHg (SEVERELY HYPOXIC), HCO3 20, Lactate 3.8 mmol/L (elevated). A-a gradient markedly elevated (~45 mmHg).",
    clinicalSignificance:
      "Classic PE ABG: respiratory alkalosis (hyperventilation compensation) with significant hypoxemia and elevated A-a gradient (V/Q mismatch). Lactate elevation indicates tissue hypoperfusion from obstructive shock. Normal pCO2 in a tachypneic patient is OMINOUS (tiring out). This ABG pattern should increase PE suspicion.",
    tags: [
      "PE",
      "respiratory alkalosis",
      "hypoxemia",
      "A-a gradient",
      "V/Q mismatch",
      "lactate",
    ],
    scenarioIds: ["master-pe-47f"],
    generator: { type: "abg", pH: 7.48, pCO2: 28, pO2: 58, hco3: 20 },
  },
];

// ============================================================================
// ABG Reference Images
// ============================================================================

const ABG_CATALOG: CatalogImage[] = [
  {
    id: "abg-normal",
    name: "Normal ABG",
    category: "monitoring",
    subcategory: "Blood Gas",
    description:
      "pH 7.35-7.45, pCO2 35-45 mmHg, pO2 80-100 mmHg, HCO3 22-26 mEq/L. Normal acid-base balance.",
    clinicalSignificance:
      "Baseline reference. Important to interpret in clinical context — a 'normal' ABG in a tachypneic patient may indicate early compensation.",
    tags: ["ABG", "normal", "acid-base", "baseline"],
    scenarioIds: ["*"],
    generator: { type: "abg", pH: 7.40, pCO2: 40, pO2: 95, hco3: 24 },
  },
  {
    id: "abg-respiratory-acidosis",
    name: "Respiratory Acidosis",
    category: "monitoring",
    subcategory: "Blood Gas",
    description:
      "pH < 7.35, pCO2 > 45 mmHg (elevated). Caused by hypoventilation. HCO3 may rise as metabolic compensation.",
    clinicalSignificance:
      "Causes: opioid overdose, COPD exacerbation, severe asthma (tiring), neuromuscular disease, obesity hypoventilation. Treatment: ventilatory support (NIV or intubation).",
    tags: [
      "respiratory acidosis",
      "hypercarbia",
      "hypoventilation",
      "overdose",
    ],
    scenarioIds: ["overdose-22m"],
    generator: { type: "abg", pH: 7.22, pCO2: 65, pO2: 55, hco3: 24 },
  },
  {
    id: "abg-metabolic-acidosis-hagma",
    name: "Metabolic Acidosis (HAGMA)",
    category: "monitoring",
    subcategory: "Blood Gas",
    description:
      "pH < 7.35, HCO3 < 22, low pCO2 (respiratory compensation). High Anion Gap (>12). Mnemonic: MUDPILES — Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates.",
    clinicalSignificance:
      "DKA: severe AG metabolic acidosis with respiratory compensation (Kussmaul breathing). Lactic acidosis in sepsis/shock. Always calculate anion gap: Na - (Cl + HCO3).",
    tags: [
      "metabolic acidosis",
      "anion gap",
      "DKA",
      "lactic acidosis",
      "MUDPILES",
    ],
    scenarioIds: ["dka-34f", "sepsis-72f", "cardiac-arrest-55m"],
    generator: { type: "abg", pH: 7.12, pCO2: 18, pO2: 98, hco3: 6 },
  },
  {
    id: "abg-respiratory-alkalosis",
    name: "Respiratory Alkalosis",
    category: "monitoring",
    subcategory: "Blood Gas",
    description:
      "pH > 7.45, pCO2 < 35 mmHg (low). Caused by hyperventilation. May have mild hypoxemia.",
    clinicalSignificance:
      "Causes: anxiety/pain, early asthma exacerbation, PE, early sepsis, pregnancy, high altitude. In asthma: respiratory alkalosis → normal pCO2 → rising pCO2 shows TIRING (ominous).",
    tags: [
      "respiratory alkalosis",
      "hyperventilation",
      "asthma",
      "anxiety",
      "PE",
    ],
    scenarioIds: ["asthma-19m"],
    generator: { type: "abg", pH: 7.48, pCO2: 32, pO2: 72, hco3: 23 },
  },
  {
    id: "abg-mixed-acidosis",
    name: "Mixed Respiratory & Metabolic Acidosis",
    category: "monitoring",
    subcategory: "Blood Gas",
    description:
      "pH significantly low, both pCO2 elevated (respiratory component) and HCO3 low (metabolic component). Most severe acid-base disturbance.",
    clinicalSignificance:
      "Seen in cardiac arrest (poor ventilation + tissue hypoxia), severe septic shock, multi-organ failure. Requires aggressive treatment of both components.",
    tags: [
      "mixed acidosis",
      "cardiac arrest",
      "shock",
      "lactate",
    ],
    scenarioIds: ["cardiac-arrest-55m"],
    generator: { type: "abg", pH: 7.18, pCO2: 52, pO2: 68, hco3: 14 },
  },
];

// ============================================================================
// Complete Catalog
// ============================================================================

export const MEDICAL_IMAGE_CATALOG: CatalogImage[] = [
  ...ECG_CATALOG,
  ...CXR_CATALOG,
  ...PE_CATALOG,
  ...EXAM_CATALOG,
  ...ABG_CATALOG,
];

// ============================================================================
// Scenario Image Sets (pre-configured sets for each scenario)
// ============================================================================

export interface ScenarioImageSet {
  scenarioId: string;
  scenarioName: string;
  images: string[]; // CatalogImage IDs
  description: string;
}

export const SCENARIO_IMAGE_SETS: ScenarioImageSet[] = [
  {
    scenarioId: "sepsis-72f",
    scenarioName: "Sepsis",
    images: ["ecg-sinus-tachy", "cxr-normal", "cxr-pleural-effusion", "abg-normal", "abg-metabolic-acidosis-hagma"],
    description:
      "ECG showing sinus tachycardia, CXR findings (normal vs effusion), ABG interpretation for sepsis-associated lactic acidosis.",
  },
  {
    scenarioId: "mi-65m",
    scenarioName: "Myocardial Infarction",
    images: ["ecg-normal-sinus", "ecg-anterior-stemi", "cxr-cardiomegaly", "gcs-15"],
    description:
      "Normal sinus rhythm for comparison, anterior STEMI pattern, CXR for pulmonary congestion, baseline neurological assessment.",
  },
  {
    scenarioId: "anaphylaxis-28f",
    scenarioName: "Anaphylaxis",
    images: ["ecg-sinus-tachy", "cxr-normal", "pupils-normal"],
    description:
      "Sinus tachycardia from distributive shock, CXR to exclude pneumothorax/aspiration, pupil assessment.",
  },
  {
    scenarioId: "asthma-19m",
    scenarioName: "Asthma Exacerbation",
    images: ["cxr-normal", "cxr-pneumothorax", "abg-respiratory-alkalosis", "ecg-sinus-tachy"],
    description:
      "CXR showing hyperinflation, pneumothorax (complication), ABG interpretation (early respiratory alkalosis → late respiratory acidosis), ECG tachycardia.",
  },
  {
    scenarioId: "stroke-58m",
    scenarioName: "Acute Ischemic Stroke",
    images: ["ecg-normal-sinus", "ecg-afib", "pupils-normal", "pupils-unequal", "gcs-8"],
    description:
      "ECG to detect atrial fibrillation (stroke cause), pupil assessment for herniation, GCS monitoring.",
  },
  {
    scenarioId: "dka-34f",
    scenarioName: "Diabetic Ketoacidosis",
    images: ["ecg-peaked-t", "ecg-sinus-tachy", "abg-metabolic-acidosis-hagma", "abg-normal"],
    description:
      "ECG showing hyperkalemic changes (peaked T-waves), ABG showing severe metabolic acidosis with respiratory compensation, normal ABG for comparison.",
  },
  {
    scenarioId: "trauma-42m",
    scenarioName: "Multi-Trauma (ATLS)",
    images: [
      "cxr-pneumothorax",
      "cxr-normal",
      "pupils-normal",
      "pupils-unequal",
      "gcs-8",
      "gcs-15",
    ],
    description:
      "CXR showing pneumothorax, pupil assessment for TBI screening, GCS monitoring, normal comparisons for each.",
  },
  {
    scenarioId: "peds-seizure-4m",
    scenarioName: "Pediatric Febrile Status Epilepticus",
    images: ["ecg-sinus-tachy", "pupils-normal", "gcs-8", "gcs-15"],
    description:
      "ECG showing age-appropriate sinus tachycardia, pupil and GCS monitoring during and after seizure.",
  },
  {
    scenarioId: "eclampsia-29f",
    scenarioName: "Eclampsia",
    images: ["ecg-sinus-tachy", "cxr-normal", "pupils-normal"],
    description:
      "ECG for LV strain pattern, CXR to exclude pulmonary edema, pupil assessment post-seizure.",
  },
  {
    scenarioId: "cardiac-arrest-55m",
    scenarioName: "Cardiac Arrest (VF)",
    images: [
      "ecg-vfib",
      "ecg-vtach",
      "ecg-asystole",
      "ecg-inferior-stemi",
      "pupils-fixed-dilated",
      "gcs-3",
      "abg-mixed-acidosis",
    ],
    description:
      "All cardiac arrest rhythms (VF, VT, asystole), post-ROSC STEMI, pupil and GCS assessment, ABG showing mixed acidosis.",
  },
  {
    scenarioId: "overdose-22m",
    scenarioName: "Opioid Overdose",
    images: [
      "ecg-sinus-brady",
      "pupils-pinpoint",
      "gcs-8",
      "abg-respiratory-acidosis",
    ],
    description:
      "ECG showing sinus bradycardia, pinpoint pupils (opioid toxidrome), reduced GCS, ABG showing respiratory acidosis from hypoventilation.",
  },
  {
    scenarioId: "master-pe-47f",
    scenarioName: "⭐ MASTER: Massive PE with RV Failure & Cardiac Arrest",
    images: [
      "ecg-s1q3t3-rvstrain",
      "ecg-sinus-tachy",
      "ecg-vfib",
      "ecg-asystole",
      "cxr-pe-westermark",
      "cxr-normal",
      "abg-pe-resp-alkalosis",
      "abg-normal",
      "pupils-normal",
      "pupils-fixed-dilated",
      "gcs-15",
      "gcs-3",
    ],
    description:
      "Comprehensive image set for massive PE: S1Q3T3 ECG with RV strain pattern, sinus tachycardia, VF/asystole (if arrest), CXR with Westermark/Fleischner signs, ABG showing respiratory alkalosis with severe hypoxemia and elevated A-a gradient, pupil assessment (normal → fixed dilated if arrest), GCS monitoring. 12 images covering the full clinical trajectory.",
  },
  {
    scenarioId: "dengue-myocarditis-43m",
    scenarioName: "Dengue Myocarditis Mimicking ACS",
    images: [
      "ecg-normal-sinus",
      "ecg-anterior-stemi",
      "ecg-inferior-stemi",
      "cxr-normal",
      "abg-normal",
      "abg-respiratory-alkalosis",
      "pupils-normal",
      "gcs-15",
    ],
    description:
      "ECG comparison set (normal vs STEMI patterns to differentiate from myocarditis), normal CXR, ABG reference for near-normal values, baseline neurological assessment. The key diagnostic images (echo, coronary angiography, cardiac MRI) are scenario-specific and not in the generic catalog.",
  },
];

// ============================================================================
// Lookup Functions
// ============================================================================

export function getCatalogImage(id: string): CatalogImage | undefined {
  return MEDICAL_IMAGE_CATALOG.find((img) => img.id === id);
}

export function getCatalogByCategory(category: ImageCategory): CatalogImage[] {
  return MEDICAL_IMAGE_CATALOG.filter((img) => img.category === category);
}

export function getCatalogForScenario(scenarioId: string): CatalogImage[] {
  const base = scenarioId.replace(/-\d+[mf]$/i, "");
  return MEDICAL_IMAGE_CATALOG.filter(
    (img) =>
      img.scenarioIds.includes("*") ||
      img.scenarioIds.includes(scenarioId) ||
      img.scenarioIds.includes(base),
  );
}

export function getScenarioImageSet(
  scenarioId: string,
): ScenarioImageSet | undefined {
  return SCENARIO_IMAGE_SETS.find((s) => s.scenarioId === scenarioId);
}

export function searchCatalog(query: string): CatalogImage[] {
  const q = query.toLowerCase();
  return MEDICAL_IMAGE_CATALOG.filter(
    (img) =>
      img.name.toLowerCase().includes(q) ||
      img.description.toLowerCase().includes(q) ||
      img.tags.some((t) => t.toLowerCase().includes(q)) ||
      img.subcategory.toLowerCase().includes(q),
  );
}
