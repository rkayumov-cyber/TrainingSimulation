import { v4 as uuidv4 } from "uuid";
import type {
  ImagingStudy,
  ECGInterpretation,
  ABGValues,
  ABGInterpretation,
  ABGInterpretationStep,
} from "../../types/imaging";

// ============================================
// SCENARIO IMAGING DEFINITIONS
// ============================================

const SCENARIO_IMAGING: Record<
  string,
  Omit<ImagingStudy, "id" | "status" | "orderedAt" | "completedAt">[]
> = {
  "sepsis-72f": [
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 8000,
      findings: {
        summary: "No acute infiltrates. Mild cardiomegaly.",
        details: [
          "Heart size mildly enlarged",
          "Clear lung fields bilaterally",
          "No pleural effusions",
          "No pneumothorax",
        ],
        normalFindings: ["No acute infiltrates", "No bony abnormalities"],
      },
    },
    {
      name: "ECG",
      type: "ecg",
      delayMs: 5000,
      findings: {
        summary: "Sinus tachycardia, rate 105",
        details: [
          "Regular rhythm",
          "Rate 105 bpm",
          "Normal axis",
          "No ST-segment changes",
          "No T-wave inversions",
        ],
      },
    },
  ],
  "mi-65m": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 3000,
      findings: {
        summary: "ST elevation in leads V1-V4",
        details: [
          "Sinus rhythm, rate 95",
          "ST elevation V1-V4 (anterior leads)",
          "Reciprocal ST depression in II, III, aVF",
          "Normal PR interval",
        ],
        urgentFindings: ["STEMI — ST elevation in V1-V4"],
      },
    },
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 8000,
      findings: {
        summary: "Mild pulmonary congestion",
        details: [
          "Heart size upper limit of normal",
          "Mild pulmonary vascular congestion",
          "No pleural effusions",
          "No pneumothorax",
        ],
      },
    },
  ],
  "anaphylaxis-28f": [
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 10000,
      findings: {
        summary: "Hyperinflated lungs. No focal consolidation.",
        details: [
          "Hyperinflation bilateral",
          "No consolidation",
          "No effusions",
          "Mild peribronchial cuffing",
        ],
      },
    },
  ],
  "asthma-19m": [
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 8000,
      findings: {
        summary: "Hyperinflated lungs. No pneumothorax.",
        details: [
          "Bilateral hyperinflation",
          "Flat diaphragms",
          "No consolidation",
          "No pneumothorax",
        ],
        normalFindings: ["No pneumothorax"],
      },
    },
    {
      name: "ABG",
      type: "abg",
      delayMs: 5000,
      findings: {
        summary: "Respiratory alkalosis with hypoxia",
        details: [
          "pH 7.48 (alkalotic)",
          "pCO2 32 mmHg (low)",
          "pO2 72 mmHg (low)",
          "HCO3 23 mEq/L",
        ],
      },
    },
  ],
  "stroke-58m": [
    {
      name: "CT Head",
      type: "ct",
      delayMs: 6000,
      findings: {
        summary: "No acute haemorrhage. No early ischaemic changes.",
        details: [
          "No intracranial haemorrhage",
          "No early ischaemic changes",
          "No mass effect",
          "No midline shift",
          "Age-appropriate atrophy",
        ],
        normalFindings: ["No haemorrhage"],
      },
    },
    {
      name: "CT Angiography",
      type: "ct",
      delayMs: 8000,
      findings: {
        summary: "Right M1 MCA occlusion identified",
        details: [
          "Occlusion of right M1 segment of MCA",
          "No significant carotid stenosis",
          "Circle of Willis patent",
          "Good collateral flow",
        ],
        urgentFindings: ["Right M1 MCA occlusion — thrombolysis candidate"],
      },
    },
    {
      name: "ECG",
      type: "ecg",
      delayMs: 4000,
      findings: {
        summary: "Normal sinus rhythm. No atrial fibrillation.",
        details: [
          "Normal sinus rhythm",
          "Rate 88 bpm",
          "Normal axis",
          "No atrial fibrillation",
          "No ST changes",
        ],
      },
    },
  ],
  "dka-34f": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 4000,
      findings: {
        summary: "Sinus tachycardia with peaked T-waves",
        details: [
          "Sinus tachycardia, rate 118",
          "Peaked T-waves in V2-V4",
          "Consistent with hyperkalaemia",
          "No ST elevation",
        ],
        urgentFindings: ["Peaked T-waves — hyperkalaemia"],
      },
    },
    {
      name: "ABG",
      type: "abg",
      delayMs: 5000,
      findings: {
        summary: "Severe metabolic acidosis with respiratory compensation",
        details: [
          "pH 7.12 (severe acidosis)",
          "pCO2 18 (compensatory hyperventilation)",
          "HCO3 6 (critically low)",
          "Anion gap 28 (elevated)",
        ],
        urgentFindings: ["pH 7.12 — severe acidosis"],
      },
    },
  ],
  "trauma-42m": [
    {
      name: "FAST Scan",
      type: "ultrasound",
      delayMs: 4000,
      findings: {
        summary: "Positive — free fluid in Morrison's pouch",
        details: [
          "Free fluid in Morrison's pouch (RUQ)",
          "Free fluid in left paracolic gutter",
          "Pericardium clear",
          "Pelvis — free fluid present",
        ],
        urgentFindings: ["Positive FAST — intra-abdominal haemorrhage"],
      },
    },
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 6000,
      findings: {
        summary: "Right pneumothorax with rib fractures",
        details: [
          "Right-sided pneumothorax with partial collapse",
          "No mediastinal shift (not tension)",
          "Right rib fractures 5-8",
          "No haemothorax",
        ],
        urgentFindings: ["Right pneumothorax — chest drain needed"],
      },
    },
    {
      name: "Pelvis X-Ray",
      type: "xray",
      delayMs: 6000,
      findings: {
        summary: "Open-book pelvic fracture",
        details: [
          "Disruption of left sacroiliac joint",
          "Widened pubic symphysis >2.5cm",
          "Consistent with APC type II injury",
          "No acetabular fracture",
        ],
        urgentFindings: ["Open-book pelvic fracture — apply binder"],
      },
    },
  ],
  "peds-seizure-4m": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 5000,
      findings: {
        summary: "Sinus tachycardia. Age-appropriate.",
        details: [
          "Sinus tachycardia, rate 160",
          "Age-appropriate intervals",
          "No arrhythmia",
          "Normal QTc",
        ],
      },
    },
  ],
  "eclampsia-29f": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 4000,
      findings: {
        summary: "Sinus tachycardia. LV strain pattern.",
        details: [
          "Sinus tachycardia, rate 105",
          "Left ventricular strain pattern",
          "No ST elevation",
          "No arrhythmia",
        ],
      },
    },
  ],
  "cardiac-arrest-55m": [
    {
      name: "ECG (Post-ROSC)",
      type: "ecg",
      delayMs: 3000,
      findings: {
        summary: "Inferior STEMI post-ROSC",
        details: [
          "Sinus tachycardia transitioning from wide-complex",
          "ST elevation in II, III, aVF",
          "Reciprocal depression in aVL, I",
          "Rate 95 bpm",
        ],
        urgentFindings: ["Inferior STEMI — emergent cath lab"],
      },
    },
    {
      name: "ABG",
      type: "abg",
      delayMs: 5000,
      findings: {
        summary: "Mixed respiratory and metabolic acidosis",
        details: [
          "pH 7.18",
          "pCO2 52 (respiratory component)",
          "pO2 68 (hypoxic)",
          "HCO3 14 (metabolic component)",
          "Lactate 8.4 (severely elevated)",
        ],
        urgentFindings: ["Severe acidosis post-arrest"],
      },
    },
  ],
  "overdose-22m": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 4000,
      findings: {
        summary: "Sinus bradycardia. QTc borderline.",
        details: [
          "Sinus bradycardia, rate 55",
          "QTc 440ms (borderline)",
          "No ST changes",
          "No conduction abnormalities",
        ],
      },
    },
    {
      name: "ABG",
      type: "abg",
      delayMs: 5000,
      findings: {
        summary: "Respiratory acidosis with hypoxia",
        details: [
          "pH 7.22 (acidotic)",
          "pCO2 65 (elevated — hypoventilation)",
          "pO2 55 (hypoxic)",
          "HCO3 24 (normal)",
          "Lactate 3.1",
        ],
        urgentFindings: ["Respiratory acidosis from hypoventilation"],
      },
    },
  ],
  // ═══════════════════════════════════════════════════════════════════
  // MASTER SCENARIO: Massive PE
  // ═══════════════════════════════════════════════════════════════════
  "master-pe-47f": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 3000,
      findings: {
        summary:
          "Sinus tachycardia. S1Q3T3 pattern. RV strain. Incomplete RBBB.",
        details: [
          "Sinus tachycardia, rate 118",
          "S wave in lead I (S1)",
          "Q wave in lead III (Q3)",
          "Inverted T wave in lead III (T3)",
          "T-wave inversions V1-V4 (right ventricular strain pattern)",
          "New incomplete RBBB",
          "Right axis deviation",
          "No ST elevation (argues against STEMI)",
        ],
        urgentFindings: [
          "S1Q3T3 + RV strain pattern — classic acute PE",
          "T-wave inversions V1-V4 differentiate PE from ACS (PE: right precordial, ACS: territory-specific)",
        ],
      },
    },
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 7000,
      findings: {
        summary:
          "Subtle Westermark sign. Fleischner sign. Small right pleural effusion.",
        details: [
          "Heart size normal",
          "Subtle oligemia right lower lobe (Westermark sign)",
          "Prominent right descending pulmonary artery (Fleischner sign)",
          "Small right-sided pleural effusion",
          "No pneumothorax",
          "No consolidation",
          "No widened mediastinum (argues against aortic dissection)",
        ],
        urgentFindings: [
          "Westermark sign + Fleischner sign — suggestive of PE",
        ],
      },
    },
    {
      name: "CT Pulmonary Angiography",
      type: "ct",
      delayMs: 10000,
      findings: {
        summary:
          "MASSIVE SADDLE PE straddling main pulmonary artery bifurcation. RV/LV ratio 1.8.",
        details: [
          "Large saddle embolus at main PA bifurcation",
          "Extensive thrombus in bilateral main, lobar, and segmental pulmonary arteries",
          "RV/LV ratio 1.8 (severely elevated — normal <1.0)",
          "Interventricular septum bowing into LV (D-sign)",
          "Contrast reflux into IVC and hepatic veins",
          "Small bilateral pleural effusions",
          "No aortic dissection",
          "No mediastinal lymphadenopathy",
        ],
        urgentFindings: [
          "MASSIVE BILATERAL PE with severe RV strain",
          "RV/LV ratio 1.8 — high-risk PE, consider thrombolysis",
        ],
      },
    },
    {
      name: "Bedside Echo (Point-of-Care)",
      type: "ultrasound",
      delayMs: 4000,
      findings: {
        summary:
          "Severely dilated RV. McConnell sign POSITIVE. IVC plethoric.",
        details: [
          "RV severely dilated (RV:LV ratio >1.5)",
          "McConnell sign POSITIVE (RV free wall akinesis with preserved apex)",
          "Moderate-severe tricuspid regurgitation",
          "Estimated RVSP 65 mmHg (severely elevated)",
          "Flattened interventricular septum (D-sign)",
          "IVC 2.8cm, non-collapsible",
          "LV small and underfilled",
          "No pericardial effusion",
        ],
        urgentFindings: [
          "McConnell sign + dilated RV — highly specific for acute PE",
          "IVC plethora confirms elevated right-sided pressures",
        ],
      },
    },
    {
      name: "ABG",
      type: "abg",
      delayMs: 5000,
      findings: {
        summary:
          "Respiratory alkalosis with severe hypoxemia. Elevated A-a gradient. Lactic acidosis.",
        details: [
          "pH 7.48 (alkalotic — hyperventilation)",
          "pCO2 28 mmHg (LOW — respiratory alkalosis)",
          "pO2 58 mmHg (SEVERELY HYPOXIC)",
          "HCO3 20 mEq/L",
          "SaO2 88%",
          "Lactate 3.8 mmol/L (elevated — tissue hypoperfusion)",
          "A-a gradient ~45 mmHg (markedly elevated — V/Q mismatch)",
        ],
        urgentFindings: [
          "Severe hypoxemia with elevated A-a gradient — classic PE pattern",
          "Rising lactate indicates obstructive shock",
        ],
      },
    },
    {
      name: "Lower Extremity Duplex",
      type: "ultrasound",
      delayMs: 8000,
      findings: {
        summary: "Acute DVT in right popliteal and superficial femoral veins.",
        details: [
          "Right popliteal vein: non-compressible, echogenic thrombus",
          "Right superficial femoral vein: partial thrombosis",
          "Right common femoral vein: patent, compressible",
          "Left lower extremity: no DVT",
          "Findings consistent with acute right-sided DVT as PE source",
        ],
        urgentFindings: [
          "Acute DVT confirmed — source of pulmonary embolism",
        ],
      },
    },
  ],
  "dengue-myocarditis-43m": [
    {
      name: "ECG",
      type: "ecg",
      delayMs: 3000,
      findings: {
        summary:
          "ST elevation 2mm in II, III, aVF, V4-V6. No reciprocal depression. Sinus rhythm 95 bpm.",
        details: [
          "Sinus rhythm, rate 95 bpm",
          "ST elevation 2mm in leads II, III, aVF (inferior)",
          "ST elevation 2mm in V4, V5, V6 (lateral)",
          "NO reciprocal ST depression (atypical for MI — favors myocarditis)",
          "No pathological Q waves",
          "Normal PR interval (no PR depression — partial pericarditis overlap)",
          "Normal QRS duration",
          "Involvement of multiple vascular territories (LAD + RCA) without reciprocal changes = diffuse process",
        ],
        urgentFindings: [
          "ST elevation pattern involves MULTIPLE vascular territories without reciprocal changes — more consistent with myocarditis/pericarditis than single-vessel MI",
        ],
      },
    },
    {
      name: "Chest X-Ray",
      type: "xray",
      delayMs: 6000,
      findings: {
        summary: "Normal chest radiograph. Heart size normal. Clear lungs.",
        details: [
          "Heart size normal (CTR 48%)",
          "Clear lung fields bilaterally",
          "No pleural effusions",
          "No pulmonary congestion",
          "Mediastinum normal",
        ],
        normalFindings: [
          "Normal cardiac silhouette",
          "No acute cardiopulmonary disease",
        ],
      },
    },
    {
      name: "Transthoracic Echocardiogram",
      type: "ultrasound",
      delayMs: 10000,
      findings: {
        summary:
          "LVEF 66% preserved. Pericardium enlarged and hyperechogenic. Subtle inferoseptal strain changes.",
        details: [
          "LVEF 66% (Simpson's method — preserved systolic function)",
          "Normal biventricular function",
          "Preserved diastolic function",
          "Longitudinal strain: –19.8% (borderline low in inferoseptal segments)",
          "PARIETAL PERICARDIUM: enlarged and diffusely hyperechogenic (pericardial inflammation)",
          "No pericardial effusion",
          "No wall motion abnormalities",
          "No valvular abnormalities",
        ],
        urgentFindings: [
          "Pericardial thickening/hyperechogenicity consistent with acute pericarditis",
          "Subtle strain abnormalities suggest early myocardial involvement",
        ],
      },
    },
    {
      name: "Coronary Angiography",
      type: "ct",
      delayMs: 20000,
      findings: {
        summary:
          "NORMAL CORONARY ARTERIES — no significant obstructive disease.",
        details: [
          "Left main: Normal",
          "LAD: No significant stenosis",
          "LCx: No significant stenosis",
          "RCA: No significant stenosis",
          "LVEF on ventriculography: 60%",
          "No thrombus",
          "IMPRESSION: Normal coronary arteries — ST elevation is NOT from coronary occlusion",
        ],
        urgentFindings: [
          "Clean coronaries EXCLUDES acute MI — myocarditis/pericarditis is the diagnosis",
        ],
      },
    },
    {
      name: "Cardiac MRI with Gadolinium",
      type: "ct",
      delayMs: 25000,
      findings: {
        summary:
          "ACUTE MYOPERICARDITIS — non-ischemic LGE pattern confirms viral myocarditis. LVEF 52%.",
        details: [
          "LVEF 52% (mildly reduced — MRI more accurate than echo)",
          "Normal-sized cardiac chambers",
          "Preserved RV function",
          "Mild hypokinesia of inferior wall (basal and medial segments)",
          "MYOCARDIAL EDEMA on T2-weighted: inferior wall with inferoseptal extension",
          "LATE GADOLINIUM ENHANCEMENT: basal, medial, inferior basal, inferoseptal segments",
          "LGE pattern: SUBEPICARDIAL/MID-WALL (non-ischemic — CONFIRMS myocarditis)",
          "Pericardial gadolinium uptake in basal region (active pericarditis)",
          "No ischemic pattern (subendocardial) LGE",
        ],
        urgentFindings: [
          "Non-ischemic LGE distribution CONFIRMS myocarditis, EXCLUDES MI",
          "Combined myocardial edema + pericardial uptake = acute myopericarditis",
        ],
      },
    },
  ],
};

// ============================================
// SCENARIO ECG INTERPRETATIONS
// ============================================

const SCENARIO_ECG: Record<string, ECGInterpretation> = {
  "sepsis-72f": {
    rhythm: "Sinus tachycardia",
    rate: 105,
    axis: "Normal",
    prInterval: "160ms (normal)",
    qrsDuration: "88ms (normal)",
    qtcInterval: "420ms (normal)",
    stSegment: "No ST elevation or depression",
    tWaves: "Normal morphology",
    urgentFindings: [],
    overallImpression:
      "Sinus tachycardia consistent with sepsis. No acute ischaemic changes.",
  },
  "mi-65m": {
    rhythm: "Normal sinus rhythm",
    rate: 95,
    axis: "Normal",
    prInterval: "170ms (normal)",
    qrsDuration: "92ms (normal)",
    qtcInterval: "440ms (normal)",
    stSegment: "ST elevation V1-V4 (3-4mm), reciprocal depression II, III, aVF",
    tWaves: "Hyperacute T-waves in V2-V3",
    urgentFindings: [
      "STEMI: ST elevation in anterior leads V1-V4",
      "Hyperacute T-waves suggest acute occlusion",
    ],
    overallImpression: "Anterior STEMI — activate cath lab immediately.",
  },
  "stroke-58m": {
    rhythm: "Normal sinus rhythm",
    rate: 88,
    axis: "Normal",
    prInterval: "155ms (normal)",
    qrsDuration: "86ms (normal)",
    qtcInterval: "410ms (normal)",
    stSegment: "No ST changes",
    tWaves: "Normal",
    urgentFindings: [],
    overallImpression:
      "Normal sinus rhythm. No atrial fibrillation — rules out one stroke aetiology.",
  },
  "dka-34f": {
    rhythm: "Sinus tachycardia",
    rate: 118,
    axis: "Normal",
    prInterval: "150ms (normal)",
    qrsDuration: "90ms (normal)",
    qtcInterval: "430ms (normal)",
    stSegment: "No ST changes",
    tWaves: "Peaked T-waves in V2-V4",
    urgentFindings: ["Peaked T-waves consistent with hyperkalaemia (K+ 5.6)"],
    overallImpression:
      "Sinus tachycardia with hyperkalaemic changes. Monitor potassium closely before and during insulin therapy.",
  },
  "cardiac-arrest-55m": {
    rhythm: "Sinus tachycardia (post-ROSC)",
    rate: 95,
    axis: "Right axis deviation",
    prInterval: "165ms (normal)",
    qrsDuration: "96ms (normal)",
    qtcInterval: "460ms (prolonged)",
    stSegment: "ST elevation in II, III, aVF; reciprocal depression in aVL, I",
    tWaves: "Hyperacute in inferior leads",
    urgentFindings: [
      "Inferior STEMI — ST elevation II, III, aVF",
      "Likely cause of cardiac arrest",
    ],
    overallImpression:
      "Inferior STEMI post-ROSC. Emergent cardiac catheterisation indicated.",
  },
  "overdose-22m": {
    rhythm: "Sinus bradycardia",
    rate: 55,
    axis: "Normal",
    prInterval: "180ms (normal)",
    qrsDuration: "88ms (normal)",
    qtcInterval: "440ms (borderline)",
    stSegment: "No ST changes",
    tWaves: "Normal",
    urgentFindings: [],
    overallImpression:
      "Sinus bradycardia consistent with opioid-induced depression. No conduction abnormalities.",
  },
  "master-pe-47f": {
    rhythm: "Sinus tachycardia",
    rate: 118,
    axis: "Right axis deviation",
    prInterval: "145ms (normal)",
    qrsDuration: "110ms (incomplete RBBB)",
    qtcInterval: "430ms (normal)",
    stSegment:
      "No ST elevation. Subtle ST depression in V1-V3. S1Q3T3 pattern present.",
    tWaves:
      "T-wave inversions in V1-V4 (RV strain) AND lead III. Classic acute right heart strain pattern.",
    urgentFindings: [
      "S1Q3T3: S wave lead I + Q wave lead III + T inversion lead III",
      "T-wave inversions V1-V4 = right ventricular strain",
      "Incomplete RBBB — new (not on prior ECGs)",
      "Right axis deviation — acute RV pressure overload",
      "CRITICAL: This is NOT acute MI — no territorial ST elevation. Troponin elevation is from RV strain.",
    ],
    overallImpression:
      "Sinus tachycardia with classic acute right heart strain pattern (S1Q3T3, RBBB, RV strain T-wave inversions). Highly suggestive of significant pulmonary embolism. This ECG pattern + clinical presentation = PE until proven otherwise. Do NOT misinterpret as acute MI.",
  },
  "dengue-myocarditis-43m": {
    rhythm: "Sinus rhythm",
    rate: 95,
    axis: "Normal",
    prInterval: "160ms (normal)",
    qrsDuration: "86ms (normal)",
    qtcInterval: "420ms (normal)",
    stSegment:
      "ST elevation 2mm in leads II, III, aVF (inferior) AND V4-V6 (lateral). NO reciprocal ST depression anywhere.",
    tWaves: "Normal T-wave morphology. No inversions. No hyperacute T-waves.",
    urgentFindings: [
      "ST elevation spans MULTIPLE vascular territories (inferior + lateral) — atypical for single-vessel MI",
      "ABSENCE of reciprocal ST depression — strongly favors myocarditis/pericarditis over MI",
      "No pathological Q waves — no completed infarction",
      "CRITICAL: Diffuse ST elevation pattern + recent viral illness + normal coronaries = myocarditis, NOT MI",
    ],
    overallImpression:
      "Sinus rhythm with diffuse ST elevation in inferior and lateral leads WITHOUT reciprocal changes. This pattern involves multiple coronary territories simultaneously, which is inconsistent with single-vessel ACS. In the context of recent dengue infection, this is highly suggestive of acute myopericarditis. MUST proceed to coronary angiography to exclude MI, then cardiac MRI to confirm myocarditis.",
  },
};

// ============================================
// SCENARIO ABG VALUES
// ============================================

const SCENARIO_ABG: Record<string, ABGValues> = {
  "asthma-19m": {
    pH: 7.48,
    pCO2: 32,
    pO2: 72,
    hco3: 23,
    baseExcess: 0,
    lactate: 1.2,
  },
  "dka-34f": {
    pH: 7.12,
    pCO2: 18,
    pO2: 98,
    hco3: 6,
    baseExcess: -20,
    lactate: 2.8,
  },
  "cardiac-arrest-55m": {
    pH: 7.18,
    pCO2: 52,
    pO2: 68,
    hco3: 14,
    baseExcess: -12,
    lactate: 8.4,
  },
  "overdose-22m": {
    pH: 7.22,
    pCO2: 65,
    pO2: 55,
    hco3: 24,
    baseExcess: -2,
    lactate: 3.1,
  },
  "master-pe-47f": {
    pH: 7.48,
    pCO2: 28,
    pO2: 58,
    hco3: 20,
    baseExcess: -2,
    lactate: 3.8,
  },
};

// ============================================
// ABG INTERPRETATION ALGORITHM
// ============================================

export function interpretABG(values: ABGValues): ABGInterpretation {
  const steps: ABGInterpretationStep[] = [];

  // Step 1: pH assessment
  let phFinding: string;
  let phAbnormal = false;
  if (values.pH < 7.35) {
    phFinding = `pH ${values.pH.toFixed(2)} — Acidaemia`;
    phAbnormal = true;
  } else if (values.pH > 7.45) {
    phFinding = `pH ${values.pH.toFixed(2)} — Alkalaemia`;
    phAbnormal = true;
  } else {
    phFinding = `pH ${values.pH.toFixed(2)} — Normal`;
  }
  steps.push({
    step: 1,
    label: "Assess pH",
    finding: phFinding,
    isAbnormal: phAbnormal,
  });

  // Step 2: Primary disorder
  let primaryDisorder: string;
  let primaryAbnormal = false;
  if (values.pH < 7.35) {
    if (values.pCO2 > 45) {
      primaryDisorder = "Respiratory acidosis (elevated pCO2)";
      primaryAbnormal = true;
    } else if (values.hco3 < 22) {
      primaryDisorder = "Metabolic acidosis (low HCO3)";
      primaryAbnormal = true;
    } else {
      primaryDisorder = "Mixed acidosis";
      primaryAbnormal = true;
    }
  } else if (values.pH > 7.45) {
    if (values.pCO2 < 35) {
      primaryDisorder = "Respiratory alkalosis (low pCO2)";
      primaryAbnormal = true;
    } else if (values.hco3 > 26) {
      primaryDisorder = "Metabolic alkalosis (elevated HCO3)";
      primaryAbnormal = true;
    } else {
      primaryDisorder = "Mixed alkalosis";
      primaryAbnormal = true;
    }
  } else {
    primaryDisorder = "Normal acid-base status";
  }
  steps.push({
    step: 2,
    label: "Primary disorder",
    finding: primaryDisorder,
    isAbnormal: primaryAbnormal,
  });

  // Step 3: Compensation
  let compensation: string;
  let compAbnormal = false;
  if (values.pH < 7.35 && values.pCO2 > 45 && values.hco3 > 26) {
    compensation = "Metabolic compensation present (elevated HCO3)";
  } else if (values.pH < 7.35 && values.hco3 < 22 && values.pCO2 < 35) {
    compensation = "Respiratory compensation present (hyperventilation)";
  } else if (values.pH > 7.45 && values.pCO2 < 35 && values.hco3 < 22) {
    compensation = "Metabolic compensation present (renal HCO3 excretion)";
  } else if (Math.abs(values.pH - 7.4) < 0.05) {
    compensation = "Fully compensated or normal";
  } else {
    compensation = "Partial or no compensation";
    compAbnormal = true;
  }
  steps.push({
    step: 3,
    label: "Compensation",
    finding: compensation,
    isAbnormal: compAbnormal,
  });

  // Step 4: Anion gap (if metabolic acidosis)
  let anionGapFinding: string;
  let agAbnormal = false;
  if (values.hco3 < 22) {
    const estimatedAG = 140 - 105 - values.hco3; // Na - Cl - HCO3 (assuming Cl 105)
    if (estimatedAG > 12) {
      anionGapFinding = `Elevated anion gap (~${estimatedAG}) — HAGMA`;
      agAbnormal = true;
    } else {
      anionGapFinding = `Normal anion gap (~${estimatedAG}) — NAGMA`;
    }
  } else {
    anionGapFinding = "Not applicable (no metabolic acidosis)";
  }
  steps.push({
    step: 4,
    label: "Anion gap",
    finding: anionGapFinding,
    isAbnormal: agAbnormal,
  });

  // Step 5: Oxygenation
  let oxygenation: string;
  let o2Abnormal = false;
  if (values.pO2 < 60) {
    oxygenation = `pO2 ${values.pO2} mmHg — Severe hypoxaemia`;
    o2Abnormal = true;
  } else if (values.pO2 < 80) {
    oxygenation = `pO2 ${values.pO2} mmHg — Moderate hypoxaemia`;
    o2Abnormal = true;
  } else {
    oxygenation = `pO2 ${values.pO2} mmHg — Adequate oxygenation`;
  }
  steps.push({
    step: 5,
    label: "Oxygenation",
    finding: oxygenation,
    isAbnormal: o2Abnormal,
  });

  // Step 6: Clinical correlation
  let clinicalCorrelation: string;
  if (values.lactate > 4) {
    clinicalCorrelation = `Lactate ${values.lactate} mmol/L — tissue hypoperfusion / shock. Correlate with clinical picture.`;
  } else if (values.lactate > 2) {
    clinicalCorrelation = `Lactate ${values.lactate} mmol/L — mildly elevated. May indicate early tissue hypoperfusion.`;
  } else {
    clinicalCorrelation = `Lactate ${values.lactate} mmol/L — normal. No evidence of tissue hypoperfusion.`;
  }
  steps.push({
    step: 6,
    label: "Clinical correlation",
    finding: clinicalCorrelation,
    isAbnormal: values.lactate > 2,
  });

  return {
    values,
    steps,
    primaryDisorder,
    compensation,
    oxygenation,
    clinicalCorrelation,
  };
}

// ============================================
// IMAGING MANAGER
// ============================================

class ImagingManager {
  private studies: ImagingStudy[] = [];
  private scenarioId: string = "";

  initialize(scenarioId: string) {
    this.scenarioId = scenarioId;
    const definitions = SCENARIO_IMAGING[scenarioId] || [];
    this.studies = definitions.map((def) => ({
      ...def,
      id: uuidv4(),
      status: "available" as const,
    }));
  }

  orderStudy(studyId: string): ImagingStudy | null {
    const study = this.studies.find((s) => s.id === studyId);
    if (!study || study.status !== "available") return null;

    study.status = "pending";
    study.orderedAt = Date.now();

    // Auto-complete after delay
    setTimeout(() => {
      study.status = "completed";
      study.completedAt = Date.now();
    }, study.delayMs);

    return study;
  }

  getStudy(studyId: string): ImagingStudy | undefined {
    return this.studies.find((s) => s.id === studyId);
  }

  getAllStudies(): ImagingStudy[] {
    return [...this.studies];
  }

  getECGInterpretation(): ECGInterpretation | null {
    return SCENARIO_ECG[this.scenarioId] || null;
  }

  getABGValues(): ABGValues | null {
    return SCENARIO_ABG[this.scenarioId] || null;
  }

  reset() {
    this.studies = [];
    this.scenarioId = "";
  }
}

// Singleton
let imagingManagerInstance: ImagingManager | null = null;

export function getImagingManager(): ImagingManager {
  if (!imagingManagerInstance) {
    imagingManagerInstance = new ImagingManager();
  }
  return imagingManagerInstance;
}

export function resetImagingManager() {
  if (imagingManagerInstance) {
    imagingManagerInstance.reset();
  }
  imagingManagerInstance = null;
}
