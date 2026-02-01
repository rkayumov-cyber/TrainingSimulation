// ============================================================================
// ADVANCED PERFORMANCE METRICS ENGINE
//
// Provides deep analytics for simulation performance including:
// - Time-to-key-action benchmarks
// - Diagnostic accuracy scoring
// - Test sequencing efficiency (ordering tests in optimal order)
// - Resource utilization (unnecessary tests, duplicate orders)
// - Communication quality
// - Critical decision points analysis
// - Overall performance grade with domain breakdown
// - Comparative benchmarking against expert standards
//
// Based on: QSAT (Queen's Simulation Assessment Tool), ACGME milestones,
// AHA ACLS metrics, and published simulation assessment literature.
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export interface TimeMetric {
  label: string;
  description: string;
  actualSeconds: number | null;
  benchmarkSeconds: number;
  gradeThresholds: { A: number; B: number; C: number; D: number };
  grade: "A" | "B" | "C" | "D" | "F" | "N/A";
  achieved: boolean;
}

export interface DiagnosticAccuracy {
  correctDiagnosis: string;
  differentialConsidered: string[];
  differentialExpected: string[];
  workingDiagnosisCorrect: boolean;
  diagnosticConfidence: number; // 0-100
  keyCluesIdentified: { clue: string; identified: boolean }[];
  redHerringsFallenFor: string[];
  score: number; // 0-100
}

export interface SequencingMetric {
  optimalSequence: string[];
  actualSequence: string[];
  sequenceScore: number; // 0-100
  outOfOrderActions: { action: string; shouldHaveBeenBefore: string; explanation: string }[];
  criticalSequenceErrors: string[];
}

export interface ResourceUtilization {
  totalTestsOrdered: number;
  relevantTests: number;
  unnecessaryTests: string[];
  missedCriticalTests: string[];
  duplicateOrders: string[];
  resourceScore: number; // 0-100
  costEfficiency: "excellent" | "good" | "fair" | "poor";
}

export interface CriticalDecisionPoint {
  id: string;
  timestamp: number | null;
  description: string;
  correctDecision: string;
  actualDecision: string | null;
  wasCorrect: boolean;
  impact: "life-saving" | "critical" | "important" | "minor";
  feedback: string;
}

export interface CommunicationScore {
  jargonInstances: number;
  patientReassurance: boolean;
  teamCommunication: boolean;
  sbarUsed: boolean;
  closedLoopCommunication: boolean;
  informedConsent: boolean;
  score: number; // 0-100
}

export interface DomainScore {
  domain: string;
  score: number; // 0-100
  weight: number; // Relative weight for overall score
  grade: "A" | "B" | "C" | "D" | "F";
  feedback: string;
}

export interface PerformanceReport {
  scenarioId: string;
  scenarioName: string;
  totalDurationSeconds: number;
  overallScore: number; // 0-100
  overallGrade: "A" | "B" | "C" | "D" | "F";

  // Domain scores
  domains: DomainScore[];

  // Detailed metrics
  timeMetrics: TimeMetric[];
  diagnosticAccuracy: DiagnosticAccuracy;
  sequencing: SequencingMetric;
  resourceUtilization: ResourceUtilization;
  criticalDecisions: CriticalDecisionPoint[];
  communication: CommunicationScore;

  // Expert comparison
  expertBenchmark: {
    averageExpertScore: number;
    percentile: number; // Where this performance falls
    areasAboveExpert: string[];
    areasBelowExpert: string[];
  };

  // Learning recommendations
  recommendations: string[];
  suggestedReadings: string[];
}

// ============================================================================
// Master PE Scenario Metrics Configuration
// ============================================================================

interface ScenarioMetricsConfig {
  scenarioId: string;
  correctDiagnosis: string;
  expectedDifferentials: string[];
  keyDiagnosticClues: string[];
  optimalActionSequence: string[];
  criticalTests: string[];
  unnecessaryTests: string[];
  timeTargets: Record<string, { benchmark: number; thresholds: { A: number; B: number; C: number; D: number }; label: string; description: string }>;
  criticalDecisionPoints: Omit<CriticalDecisionPoint, "timestamp" | "actualDecision" | "wasCorrect">[];
  expertAverageScore: number;
}

const SCENARIO_METRICS_CONFIG: Record<string, ScenarioMetricsConfig> = {
  "master-pe-47f": {
    scenarioId: "master-pe-47f",
    correctDiagnosis: "Massive Pulmonary Embolism",
    expectedDifferentials: [
      "Pulmonary Embolism",
      "Acute Coronary Syndrome / MI",
      "Tension Pneumothorax",
      "Aortic Dissection",
      "Cardiac Tamponade",
      "Pneumonia / Sepsis",
    ],
    keyDiagnosticClues: [
      "Recent surgery with immobilisation (DVT risk factor)",
      "Oral contraceptive use (hypercoagulable state)",
      "Unilateral calf swelling (DVT source)",
      "Pleuritic chest pain with hemoptysis",
      "S1Q3T3 pattern on ECG",
      "Elevated D-dimer (>4.0)",
      "Elevated troponin with RV strain pattern (not MI)",
      "Elevated BNP (RV strain)",
      "JVP elevation with RV heave and loud P2",
      "CTPA showing saddle embolus",
      "Echo McConnell sign and RV dilatation",
      "ABG showing respiratory alkalosis with hypoxemia and elevated A-a gradient",
    ],
    optimalActionSequence: [
      "check_vitals",
      "administer_oxygen",
      "establish_iv_access",
      "order_ecg",
      "check_heart_sounds",
      "check_lung_sounds",
      "check_legs",
      "order_d_dimer",
      "order_troponin",
      "order_abg",
      "order_cbc",
      "order_bmp",
      "order_coagulation",
      "order_ctpa",
      "order_echo",
      "administer_heparin",
      "fluid_bolus",
      "call_for_help",
      "administer_tpa",
      "start_vasopressor",
    ],
    criticalTests: [
      "order_ecg",
      "order_d_dimer",
      "order_troponin",
      "order_ctpa",
      "order_echo",
      "order_abg",
      "order_coagulation",
      "order_chest_xray",
      "check_legs",
    ],
    unnecessaryTests: [
      "order_lumbar_puncture",
      "order_ct_head",
      "order_mri",
      "order_urine_culture",
      "order_blood_cultures",
      "order_hba1c",
      "order_thyroid",
      "order_amylase",
    ],
    timeTargets: {
      administer_oxygen: {
        benchmark: 60,
        thresholds: { A: 60, B: 120, C: 180, D: 300 },
        label: "Time to Oxygen",
        description: "SpO2 88% — supplemental O2 should be immediate",
      },
      establish_iv_access: {
        benchmark: 120,
        thresholds: { A: 120, B: 180, C: 300, D: 420 },
        label: "Time to IV Access",
        description: "Large-bore IV needed for resuscitation medications",
      },
      order_ecg: {
        benchmark: 120,
        thresholds: { A: 120, B: 180, C: 300, D: 600 },
        label: "Time to ECG",
        description: "12-lead ECG within 2 minutes for chest pain and dyspnea",
      },
      check_legs: {
        benchmark: 300,
        thresholds: { A: 300, B: 420, C: 600, D: 900 },
        label: "Time to Leg Examination",
        description: "Examining legs for DVT — a key diagnostic clue easily missed",
      },
      order_d_dimer: {
        benchmark: 300,
        thresholds: { A: 300, B: 420, C: 600, D: 900 },
        label: "Time to D-dimer",
        description: "D-dimer is a critical screening test for PE",
      },
      order_ctpa: {
        benchmark: 600,
        thresholds: { A: 600, B: 900, C: 1200, D: 1800 },
        label: "Time to CTPA Order",
        description: "CT Pulmonary Angiography — definitive diagnostic test for PE",
      },
      order_echo: {
        benchmark: 480,
        thresholds: { A: 480, B: 600, C: 900, D: 1200 },
        label: "Time to Bedside Echo",
        description: "Point-of-care echo can diagnose RV strain at the bedside in seconds",
      },
      administer_heparin: {
        benchmark: 600,
        thresholds: { A: 600, B: 900, C: 1200, D: 1800 },
        label: "Time to Anticoagulation",
        description: "Heparin should be given as soon as PE is suspected — do not wait for CTPA confirmation",
      },
      administer_tpa: {
        benchmark: 1200,
        thresholds: { A: 1200, B: 1500, C: 1800, D: 2400 },
        label: "Time to Thrombolysis",
        description: "tPA for massive PE with hemodynamic instability — every minute counts",
      },
      call_for_help: {
        benchmark: 300,
        thresholds: { A: 300, B: 600, C: 900, D: 1200 },
        label: "Time to Call for Help",
        description: "Critically ill patient — should activate PERT/ICU/senior support early",
      },
    },
    criticalDecisionPoints: [
      {
        id: "cdp-oxygen-first",
        description: "Immediate oxygen for SpO2 88%",
        correctDecision: "Apply high-flow oxygen immediately",
        impact: "critical",
        feedback: "SpO2 88% requires immediate supplemental oxygen. Hypoxemia in PE is from V/Q mismatch — oxygen helps while you diagnose the cause.",
      },
      {
        id: "cdp-consider-pe",
        description: "Suspect PE based on clinical presentation",
        correctDecision: "Consider PE in differential based on risk factors (recent surgery, immobility, OCP) + pleuritic pain + dyspnea + tachycardia + hypoxia",
        impact: "life-saving",
        feedback: "The combination of recent surgery, immobility, OCP use, pleuritic chest pain, hemoptysis, unilateral calf swelling, and unexplained hypoxia with tachycardia should immediately raise suspicion for PE. Missing this diagnosis is often fatal.",
      },
      {
        id: "cdp-ecg-interpretation",
        description: "Correctly interpret ECG as RV strain (not MI)",
        correctDecision: "Recognize S1Q3T3, RBBB, RV strain pattern as PE, NOT acute MI (despite elevated troponin)",
        impact: "life-saving",
        feedback: "S1Q3T3 with T-wave inversions in V1-V4 is classic acute right heart strain from PE. Troponin is elevated from RV ischemia, NOT from primary coronary occlusion. Misinterpreting this as MI leads to wrong treatment (antiplatelet/PCI instead of anticoagulation/thrombolysis).",
      },
      {
        id: "cdp-heparin-empiric",
        description: "Start anticoagulation before CTPA confirmation",
        correctDecision: "Give heparin bolus when PE is strongly suspected — do NOT wait for CTPA",
        impact: "critical",
        feedback: "In high clinical probability PE, heparin should be started BEFORE the CTPA. The risk of PE progression and death outweighs the small risk of anticoagulation. ESC Guidelines: Class I recommendation.",
      },
      {
        id: "cdp-fluid-caution",
        description: "Careful fluid management in RV failure",
        correctDecision: "Small fluid challenge (250-500mL max), NOT aggressive volume resuscitation",
        impact: "critical",
        feedback: "Aggressive fluid loading in acute RV failure worsens biventricular function through ventricular interdependence. The RV is already over-distended — more fluid pushes the septum into the LV, reducing cardiac output further. Maximum 500mL initial bolus.",
      },
      {
        id: "cdp-thrombolysis-decision",
        description: "Decision to give systemic thrombolysis for massive PE",
        correctDecision: "Administer tPA 100mg IV over 2 hours when massive PE confirmed with hemodynamic instability",
        impact: "life-saving",
        feedback: "Systemic thrombolysis is the treatment of choice for massive PE with hemodynamic instability. tPA reduces mortality from >50% to <20%. The only absolute contraindication in this scenario would be active bleeding. Recent knee arthroscopy (10 days) is a relative contraindication — but the benefit outweighs risk in massive PE with shock.",
      },
      {
        id: "cdp-arrest-pe",
        description: "Recognize PE as cause of cardiac arrest and continue thrombolysis during CPR",
        correctDecision: "If arrest occurs: standard ACLS + continue/give thrombolysis. Extend CPR to 60-90 minutes if thrombolytic given (time to work).",
        impact: "life-saving",
        feedback: "PE is a reversible cause of cardiac arrest (one of the 'T's). If thrombolytic is given during arrest, CPR should continue for 60-90 minutes to allow lysis. Do NOT terminate resuscitation early. ROSC can occur late after thrombolysis.",
      },
    ],
    expertAverageScore: 78,
  },
  "dengue-myocarditis-43m": {
    scenarioId: "dengue-myocarditis-43m",
    correctDiagnosis: "Dengue Myopericarditis",
    expectedDifferentials: [
      "Acute Coronary Syndrome (STEMI)",
      "Myocarditis / Myopericarditis",
      "Acute Pericarditis",
      "Aortic Dissection",
      "Pulmonary Embolism",
      "Dengue Myocarditis",
    ],
    keyDiagnosticClues: [
      "Recent travel to dengue-endemic region (Bolivia)",
      "Prodromal viral illness 5 days prior (fever, retro-orbital pain, arthralgias)",
      "Positive dengue serology (IgM + RT-PCR)",
      "Diffuse ST elevation without reciprocal depression",
      "Elevated troponin with normal CPK (atypical for large MI)",
      "Elevated CRP (inflammatory marker — favors myocarditis over MI)",
      "Pericardial friction rub on auscultation",
      "Normal coronary angiography (excludes MI)",
      "Cardiac MRI: non-ischemic LGE pattern (confirms myocarditis)",
      "Echo: pericardial thickening and hyperechogenicity",
      "Normal platelet count (safe for NSAIDs)",
    ],
    optimalActionSequence: [
      "check_vitals",
      "establish_iv_access",
      "order_ecg",
      "check_heart_sounds",
      "check_lung_sounds",
      "take_travel_history",
      "order_troponin",
      "order_bnp",
      "order_crp",
      "order_cbc",
      "order_bmp",
      "order_dengue_serology",
      "order_chest_xray",
      "order_echo",
      "order_coronary_angiography",
      "order_cardiac_mri",
      "administer_nsaids",
      "administer_colchicine",
      "consult_cardiology",
      "continuous_monitoring",
    ],
    criticalTests: [
      "order_ecg",
      "order_troponin",
      "order_crp",
      "order_dengue_serology",
      "order_echo",
      "order_coronary_angiography",
      "order_cardiac_mri",
      "order_cbc",
      "check_heart_sounds",
    ],
    unnecessaryTests: [
      "order_ctpa",
      "order_ct_head",
      "order_d_dimer",
      "order_fast_scan",
      "order_lumbar_puncture",
      "order_toxicology_screen",
    ],
    timeTargets: {
      order_ecg: {
        benchmark: 120,
        thresholds: { A: 120, B: 180, C: 300, D: 600 },
        label: "Time to ECG",
        description: "12-lead ECG within 2 minutes for chest pain with ST changes",
      },
      take_travel_history: {
        benchmark: 300,
        thresholds: { A: 300, B: 480, C: 600, D: 900 },
        label: "Time to Travel History",
        description: "Travel history is THE key question — unlocks the correct diagnosis",
      },
      check_heart_sounds: {
        benchmark: 180,
        thresholds: { A: 180, B: 300, C: 480, D: 600 },
        label: "Time to Cardiac Auscultation",
        description: "Pericardial friction rub is pathognomonic — must listen carefully",
      },
      order_troponin: {
        benchmark: 180,
        thresholds: { A: 180, B: 300, C: 480, D: 600 },
        label: "Time to Troponin",
        description: "Cardiac biomarkers essential for ST elevation workup",
      },
      order_crp: {
        benchmark: 300,
        thresholds: { A: 300, B: 480, C: 600, D: 900 },
        label: "Time to CRP",
        description: "Inflammatory markers differentiate myocarditis from MI",
      },
      order_dengue_serology: {
        benchmark: 600,
        thresholds: { A: 600, B: 900, C: 1200, D: 1800 },
        label: "Time to Dengue Serology",
        description: "Confirms dengue etiology — requires travel history first",
      },
      order_echo: {
        benchmark: 600,
        thresholds: { A: 600, B: 900, C: 1200, D: 1800 },
        label: "Time to Echocardiogram",
        description: "Identifies pericardial thickening and LV function",
      },
      order_coronary_angiography: {
        benchmark: 900,
        thresholds: { A: 900, B: 1200, C: 1800, D: 2400 },
        label: "Time to Angiography Decision",
        description: "Must rule out ACS with ST elevation + elevated troponin",
      },
      order_cardiac_mri: {
        benchmark: 1200,
        thresholds: { A: 1200, B: 1800, C: 2400, D: 3600 },
        label: "Time to Cardiac MRI Order",
        description: "Gold standard for myocarditis — should follow clean angiography",
      },
    },
    criticalDecisionPoints: [
      {
        id: "cdp-travel-history",
        description: "Ask about travel history to endemic region",
        correctDecision: "Take travel history early — dengue exposure is the diagnostic key",
        impact: "life-saving",
        feedback: "Travel history to a dengue-endemic region (Bolivia) completely changes the differential diagnosis. Without this information, the case appears to be straightforward STEMI. The prodromal viral illness + endemic travel + ST elevation = viral myocarditis must be considered.",
      },
      {
        id: "cdp-recognize-diffuse-st",
        description: "Recognize diffuse ST elevation pattern as non-ischemic",
        correctDecision: "Identify that ST elevation in multiple vascular territories WITHOUT reciprocal changes suggests myocarditis/pericarditis, not MI",
        impact: "critical",
        feedback: "STEMI from coronary occlusion typically shows ST elevation in one vascular territory with reciprocal depression in opposing leads. Diffuse ST elevation across inferior + lateral leads WITHOUT reciprocal changes is the ECG hallmark of myocarditis/pericarditis.",
      },
      {
        id: "cdp-not-treat-as-mi",
        description: "Avoid treating as STEMI before excluding myocarditis",
        correctDecision: "Do NOT rush to antiplatelet/anticoagulation therapy — proceed to angiography to differentiate MI from myocarditis",
        impact: "critical",
        feedback: "Treating myocarditis as MI leads to unnecessary anticoagulation, antiplatelet therapy, and potentially harmful cath lab activation. The correct approach is urgent angiography to define anatomy, then cardiac MRI if coronaries are clean.",
      },
      {
        id: "cdp-order-angiography",
        description: "Order coronary angiography to exclude MI",
        correctDecision: "Proceed to angiography — cannot reliably differentiate MI from myocarditis without visualizing coronary anatomy",
        impact: "life-saving",
        feedback: "When ECG shows ST elevation and troponin is elevated, coronary angiography is MANDATORY to exclude acute MI — even when myocarditis is suspected. Normal coronaries are the pivotal finding that redirects management.",
      },
      {
        id: "cdp-cardiac-mri",
        description: "Order cardiac MRI after clean angiography",
        correctDecision: "Order cardiac MRI with gadolinium to confirm myocarditis diagnosis and assess extent of inflammation",
        impact: "critical",
        feedback: "Cardiac MRI is the gold standard for non-invasive diagnosis of myocarditis (ESC recommendation). Late gadolinium enhancement pattern differentiates: subendocardial = ischemic (MI), subepicardial/mid-wall = non-ischemic (myocarditis).",
      },
      {
        id: "cdp-nsaid-dengue-paradox",
        description: "Navigate the NSAID/dengue treatment paradox",
        correctDecision: "Start NSAIDs + colchicine for myopericarditis — safe because platelets are normal (>100k)",
        impact: "important",
        feedback: "NSAIDs are typically AVOIDED in dengue due to hemorrhage risk. However, for dengue myopericarditis, NSAIDs are FIRST-LINE treatment per ESC guidelines. The key safety check is platelet count: if >100,000 (as in this case at 263,000), the benefit of treating pericarditis outweighs the bleeding risk.",
      },
    ],
    expertAverageScore: 72,
  },
};

// ============================================================================
// Metrics Generation Engine
// ============================================================================

function gradeTime(actual: number | null, thresholds: { A: number; B: number; C: number; D: number }): "A" | "B" | "C" | "D" | "F" | "N/A" {
  if (actual === null) return "N/A";
  if (actual <= thresholds.A) return "A";
  if (actual <= thresholds.B) return "B";
  if (actual <= thresholds.C) return "C";
  if (actual <= thresholds.D) return "D";
  return "F";
}

function gradeScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function computeSequenceScore(optimal: string[], actual: string[]): {
  score: number;
  outOfOrder: { action: string; shouldHaveBeenBefore: string; explanation: string }[];
  criticalErrors: string[];
} {
  const outOfOrder: { action: string; shouldHaveBeenBefore: string; explanation: string }[] = [];
  const criticalErrors: string[] = [];

  // Build position maps
  const optimalPos = new Map<string, number>();
  optimal.forEach((a, i) => optimalPos.set(a, i));

  const actualPos = new Map<string, number>();
  actual.forEach((a, i) => {
    if (!actualPos.has(a)) actualPos.set(a, i);
  });

  let inversions = 0;
  const filtered = actual.filter((a) => optimalPos.has(a));

  for (let i = 0; i < filtered.length; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      const optI = optimalPos.get(filtered[i])!;
      const optJ = optimalPos.get(filtered[j])!;
      if (optI > optJ) {
        inversions++;
        if (inversions <= 5) {
          outOfOrder.push({
            action: filtered[i],
            shouldHaveBeenBefore: filtered[j],
            explanation: `"${filtered[j].replace(/_/g, " ")}" should ideally precede "${filtered[i].replace(/_/g, " ")}"`,
          });
        }
      }
    }
  }

  // Critical sequence errors
  const oxygenPos = actualPos.get("administer_oxygen");
  const ecgPos = actualPos.get("order_ecg");
  const ctpaPos = actualPos.get("order_ctpa");
  const heparinPos = actualPos.get("administer_heparin");
  const tpaPos = actualPos.get("administer_tpa");

  if (oxygenPos !== undefined && oxygenPos > 3) {
    criticalErrors.push("Oxygen should be one of the first actions for a hypoxic patient");
  }
  if (tpaPos !== undefined && heparinPos !== undefined && tpaPos < heparinPos) {
    criticalErrors.push("Heparin should be started before escalating to thrombolysis");
  }
  if (ctpaPos !== undefined && ecgPos !== undefined && ctpaPos < ecgPos) {
    criticalErrors.push("ECG should be obtained before CTPA — it's faster and may show RV strain");
  }

  const maxInversions = Math.max(1, (filtered.length * (filtered.length - 1)) / 2);
  const score = Math.max(0, Math.round(100 * (1 - inversions / maxInversions)));

  return { score, outOfOrder, criticalErrors };
}

export function generatePerformanceReport(
  scenarioId: string,
  scenarioName: string,
  actionsTaken: string[],
  actionTimestamps: Record<string, number>,
  startTime: number,
  endTime: number,
  jargonCount: number,
  mdtMessageCount: number,
): PerformanceReport {
  const config = SCENARIO_METRICS_CONFIG[scenarioId];
  const totalDuration = Math.round((endTime - startTime) / 1000);

  // ---- TIME METRICS ----
  const timeMetrics: TimeMetric[] = [];
  if (config) {
    for (const [action, target] of Object.entries(config.timeTargets)) {
      const ts = actionTimestamps[action];
      const actual = ts ? Math.round((ts - startTime) / 1000) : null;
      const grade = gradeTime(actual, target.thresholds);
      timeMetrics.push({
        label: target.label,
        description: target.description,
        actualSeconds: actual,
        benchmarkSeconds: target.benchmark,
        gradeThresholds: target.thresholds,
        grade,
        achieved: actual !== null,
      });
    }
  }

  // ---- DIAGNOSTIC ACCURACY ----
  const diagnosticActions = new Set(actionsTaken);
  const keyCluesIdentified = (config?.keyDiagnosticClues || []).map((clue) => {
    // Heuristic: mark as identified if related action was taken
    const identified = inferClueIdentified(clue, diagnosticActions);
    return { clue, identified };
  });
  const identifiedCount = keyCluesIdentified.filter((c) => c.identified).length;
  const totalClues = keyCluesIdentified.length;
  const diagnosticScore = totalClues > 0 ? Math.round((identifiedCount / totalClues) * 100) : 0;

  const ctpaOrdered = diagnosticActions.has("order_ctpa") || diagnosticActions.has("order_ct_pulmonary_angiogram");
  const echoOrdered = diagnosticActions.has("order_echo") || diagnosticActions.has("bedside_echo");
  const heparinGiven = diagnosticActions.has("administer_heparin") || diagnosticActions.has("start_heparin");
  const tpaGiven = diagnosticActions.has("administer_tpa") || diagnosticActions.has("thrombolysis");
  const workingDiagnosisCorrect = ctpaOrdered || (echoOrdered && heparinGiven);

  const diagnosticAccuracy: DiagnosticAccuracy = {
    correctDiagnosis: config?.correctDiagnosis || "Unknown",
    differentialConsidered: inferDifferentials(actionsTaken),
    differentialExpected: config?.expectedDifferentials || [],
    workingDiagnosisCorrect,
    diagnosticConfidence: workingDiagnosisCorrect
      ? (tpaGiven ? 95 : heparinGiven ? 80 : 60)
      : 20,
    keyCluesIdentified,
    redHerringsFallenFor: inferRedHerrings(actionsTaken),
    score: diagnosticScore,
  };

  // ---- SEQUENCING ----
  const { score: seqScore, outOfOrder, criticalErrors } = computeSequenceScore(
    config?.optimalActionSequence || [],
    actionsTaken,
  );
  const sequencing: SequencingMetric = {
    optimalSequence: config?.optimalActionSequence || [],
    actualSequence: actionsTaken,
    sequenceScore: seqScore,
    outOfOrderActions: outOfOrder,
    criticalSequenceErrors: criticalErrors,
  };

  // ---- RESOURCE UTILIZATION ----
  const criticalTests = new Set(config?.criticalTests || []);
  const unnecessaryTestsList = config?.unnecessaryTests || [];
  const orderedUnnecessary = actionsTaken.filter((a) => unnecessaryTestsList.includes(a));
  const missedCritical = [...criticalTests].filter((t) => !diagnosticActions.has(t));
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const a of actionsTaken) {
    if (seen.has(a)) duplicates.push(a);
    seen.add(a);
  }

  const totalOrdered = actionsTaken.filter((a) => a.startsWith("order_") || a.startsWith("check_")).length;
  const relevantOrdered = totalOrdered - orderedUnnecessary.length - duplicates.length;
  const resourceScore = Math.max(0, Math.min(100,
    100 - (orderedUnnecessary.length * 10) - (missedCritical.length * 15) - (duplicates.length * 5),
  ));

  const resourceUtilization: ResourceUtilization = {
    totalTestsOrdered: totalOrdered,
    relevantTests: relevantOrdered,
    unnecessaryTests: orderedUnnecessary,
    missedCriticalTests: missedCritical,
    duplicateOrders: duplicates,
    resourceScore,
    costEfficiency: resourceScore >= 90 ? "excellent" : resourceScore >= 75 ? "good" : resourceScore >= 60 ? "fair" : "poor",
  };

  // ---- CRITICAL DECISIONS ----
  const criticalDecisions: CriticalDecisionPoint[] = (config?.criticalDecisionPoints || []).map((cdp) => {
    const { wasCorrect, actualDecision } = evaluateCriticalDecision(cdp.id, actionsTaken, actionTimestamps, startTime);
    return {
      ...cdp,
      timestamp: null,
      actualDecision,
      wasCorrect,
    };
  });

  // ---- COMMUNICATION ----
  const communication: CommunicationScore = {
    jargonInstances: jargonCount,
    patientReassurance: actionsTaken.some((a) => a.includes("reassure") || a.includes("explain")),
    teamCommunication: mdtMessageCount > 0,
    sbarUsed: mdtMessageCount > 2,
    closedLoopCommunication: mdtMessageCount > 3,
    informedConsent: false,
    score: Math.max(0, 100 - (jargonCount * 10) + (mdtMessageCount > 0 ? 10 : 0)),
  };

  // ---- DOMAIN SCORES ----
  const timeScore = timeMetrics.length > 0
    ? Math.round(timeMetrics.reduce((acc, tm) => {
        if (tm.grade === "A") return acc + 100;
        if (tm.grade === "B") return acc + 80;
        if (tm.grade === "C") return acc + 65;
        if (tm.grade === "D") return acc + 50;
        if (tm.grade === "F") return acc + 20;
        return acc + 0; // N/A
      }, 0) / timeMetrics.length)
    : 0;

  const cdpScore = criticalDecisions.length > 0
    ? Math.round(
        (criticalDecisions.filter((c) => c.wasCorrect).length / criticalDecisions.length) * 100,
      )
    : 0;

  const domains: DomainScore[] = [
    {
      domain: "Time Management",
      score: timeScore,
      weight: 20,
      grade: gradeScore(timeScore),
      feedback: timeScore >= 80
        ? "Excellent time management — actions were timely and prioritised correctly."
        : timeScore >= 60
          ? "Adequate timing but some delays in critical actions."
          : "Significant delays in critical interventions — time is the enemy in massive PE.",
    },
    {
      domain: "Diagnostic Accuracy",
      score: diagnosticScore,
      weight: 25,
      grade: gradeScore(diagnosticScore),
      feedback: workingDiagnosisCorrect
        ? "Correct diagnosis reached. " + (identifiedCount >= totalClues * 0.8 ? "Excellent clue identification." : "Some key clues were missed.")
        : "The underlying diagnosis was not correctly identified. Review PE presentation and risk factors.",
    },
    {
      domain: "Action Sequencing",
      score: seqScore,
      weight: 15,
      grade: gradeScore(seqScore),
      feedback: seqScore >= 80
        ? "Actions were performed in a logical and efficient sequence."
        : "Action sequencing could be improved — follow ABCDE systematic approach.",
    },
    {
      domain: "Critical Decisions",
      score: cdpScore,
      weight: 25,
      grade: gradeScore(cdpScore),
      feedback: cdpScore >= 80
        ? "Excellent decision-making at critical junctures."
        : cdpScore >= 50
          ? "Some critical decisions were correct, but key decision points were missed."
          : "Several life-critical decision points were handled incorrectly — review PE management protocol.",
    },
    {
      domain: "Resource Efficiency",
      score: resourceScore,
      weight: 10,
      grade: gradeScore(resourceScore),
      feedback: resourceScore >= 80
        ? "Efficient and targeted test ordering."
        : "Some unnecessary tests were ordered or critical tests were missed.",
    },
    {
      domain: "Communication",
      score: communication.score,
      weight: 5,
      grade: gradeScore(communication.score),
      feedback: communication.score >= 70
        ? "Good communication with team and patient."
        : "Communication could be improved — use plain language with patients and SBAR with team.",
    },
  ];

  // ---- OVERALL SCORE ----
  const totalWeight = domains.reduce((acc, d) => acc + d.weight, 0);
  const overallScore = Math.round(
    domains.reduce((acc, d) => acc + d.score * d.weight, 0) / totalWeight,
  );

  // ---- EXPERT COMPARISON ----
  const expertAvg = config?.expertAverageScore || 75;
  const percentile = Math.min(99, Math.max(1, Math.round(
    50 + ((overallScore - expertAvg) / expertAvg) * 100,
  )));
  const areasAbove = domains.filter((d) => d.score > expertAvg + 5).map((d) => d.domain);
  const areasBelow = domains.filter((d) => d.score < expertAvg - 10).map((d) => d.domain);

  // ---- RECOMMENDATIONS ----
  const recommendations: string[] = [];
  if (!workingDiagnosisCorrect) {
    recommendations.push("CRITICAL: The correct diagnosis (Massive PE) was not reached. Review PE presentation: pleuritic chest pain + dyspnea + tachycardia + hypoxia + DVT risk factors.");
  }
  if (missedCritical.length > 0) {
    recommendations.push(`Missed critical tests: ${missedCritical.map((t) => t.replace(/_/g, " ")).join(", ")}. These are essential for diagnosis and management.`);
  }
  if (!diagnosticActions.has("check_legs")) {
    recommendations.push("IMPORTANT: The leg examination was missed. In suspected PE, always examine the legs for DVT — it's the source of the embolism and a key diagnostic clue.");
  }
  if (criticalErrors.length > 0) {
    recommendations.push(`Sequencing errors: ${criticalErrors.join(". ")}`);
  }
  if (!heparinGiven) {
    recommendations.push("Anticoagulation was not started. In high-probability PE, heparin should be given empirically BEFORE confirmatory imaging.");
  }
  if (orderedUnnecessary.length > 0) {
    recommendations.push(`Unnecessary tests ordered: ${orderedUnnecessary.map((t) => t.replace(/_/g, " ")).join(", ")}. Focus on targeted investigations.`);
  }

  const suggestedReadings: string[] = [
    "ESC/ERS Guidelines on Acute Pulmonary Embolism (2019)",
    "AHA Scientific Statement: Management of Massive PE (Circulation 2011)",
    "EMCrit IBCC: Submassive & Massive PE Protocol",
    "ACLS Provider Manual: PEA Arrest & Reversible Causes (H's and T's)",
    "LITFL: ECG Changes in Pulmonary Embolism",
  ];

  return {
    scenarioId,
    scenarioName,
    totalDurationSeconds: totalDuration,
    overallScore,
    overallGrade: gradeScore(overallScore),
    domains,
    timeMetrics,
    diagnosticAccuracy,
    sequencing,
    resourceUtilization,
    criticalDecisions,
    communication,
    expertBenchmark: {
      averageExpertScore: expertAvg,
      percentile,
      areasAboveExpert: areasAbove,
      areasBelowExpert: areasBelow,
    },
    recommendations,
    suggestedReadings,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

function inferClueIdentified(clue: string, actions: Set<string>): boolean {
  const clueToActions: Record<string, string[]> = {
    "Recent surgery with immobilisation": ["check_legs", "check_vitals"],
    "Oral contraceptive use": [],
    "Unilateral calf swelling": ["check_legs"],
    "Pleuritic chest pain with hemoptysis": ["check_lung_sounds", "check_vitals"],
    "S1Q3T3 pattern on ECG": ["order_ecg"],
    "Elevated D-dimer": ["order_d_dimer"],
    "Elevated troponin with RV strain": ["order_troponin", "order_ecg"],
    "Elevated BNP": ["order_bnp"],
    "JVP elevation with RV heave and loud P2": ["check_heart_sounds"],
    "CTPA showing saddle embolus": ["order_ctpa"],
    "Echo McConnell sign": ["order_echo", "bedside_echo"],
    "ABG showing respiratory alkalosis": ["order_abg"],
    // Dengue myocarditis clues
    "Recent travel to dengue-endemic region": ["take_travel_history"],
    "Prodromal viral illness": ["take_travel_history"],
    "Positive dengue serology": ["order_dengue_serology"],
    "Diffuse ST elevation without reciprocal": ["order_ecg"],
    "Elevated troponin with normal CPK": ["order_troponin"],
    "Elevated CRP": ["order_crp"],
    "Pericardial friction rub": ["check_heart_sounds"],
    "Normal coronary angiography": ["order_coronary_angiography"],
    "Cardiac MRI: non-ischemic LGE": ["order_cardiac_mri"],
    "Echo: pericardial thickening": ["order_echo", "bedside_echo"],
    "Normal platelet count": ["order_cbc"],
  };

  for (const [key, requiredActions] of Object.entries(clueToActions)) {
    if (clue.includes(key) || key.includes(clue.substring(0, 20))) {
      if (requiredActions.length === 0) return true; // No action needed (history)
      return requiredActions.some((a) => actions.has(a));
    }
  }
  return false;
}

function inferDifferentials(actions: string[]): string[] {
  const diffs: string[] = [];
  const set = new Set(actions);
  if (set.has("order_ctpa") || set.has("order_d_dimer") || set.has("administer_heparin")) {
    diffs.push("Pulmonary Embolism");
  }
  if (set.has("order_troponin") || set.has("administer_aspirin") || set.has("administer_nitroglycerin")) {
    diffs.push("Acute Coronary Syndrome / MI");
  }
  if (set.has("order_ct_head") || set.has("check_nihss")) {
    diffs.push("Stroke");
  }
  if (set.has("insert_chest_drain") || set.has("needle_decompression")) {
    diffs.push("Tension Pneumothorax");
  }
  if (set.has("order_chest_xray")) {
    diffs.push("Pneumothorax / Pneumonia");
  }
  if (set.has("order_echo") || set.has("bedside_echo")) {
    diffs.push("Cardiac Tamponade / RV Failure");
  }
  if (set.has("order_dengue_serology") || set.has("take_travel_history")) {
    diffs.push("Dengue Myocarditis");
  }
  if (set.has("order_cardiac_mri") || set.has("order_crp")) {
    diffs.push("Myocarditis / Pericarditis");
  }
  if (set.has("order_coronary_angiography")) {
    diffs.push("Acute Coronary Syndrome / MI");
  }
  return [...new Set(diffs)];
}

function inferRedHerrings(actions: string[]): string[] {
  const herrings: string[] = [];
  const set = new Set(actions);
  if (set.has("administer_aspirin")) {
    herrings.push("Treated as MI (aspirin) — troponin is elevated from RV strain, not coronary occlusion");
  }
  if (set.has("administer_nitroglycerin")) {
    herrings.push("Gave nitroglycerin — contraindicated in RV failure (preload dependent)");
  }
  if (set.has("administer_antibiotics")) {
    herrings.push("Treated as infection — no evidence of sepsis in this case");
  }
  if (set.has("insert_chest_drain") && !set.has("order_chest_xray")) {
    herrings.push("Inserted chest drain without imaging — no pneumothorax present");
  }
  return herrings;
}

function evaluateCriticalDecision(
  cdpId: string,
  actions: string[],
  _timestamps: Record<string, number>,
  _startTime: number,
): { wasCorrect: boolean; actualDecision: string | null } {
  const set = new Set(actions);

  switch (cdpId) {
    case "cdp-oxygen-first":
      return {
        wasCorrect: set.has("administer_oxygen"),
        actualDecision: set.has("administer_oxygen") ? "Oxygen administered" : "Oxygen not given",
      };
    case "cdp-consider-pe":
      return {
        wasCorrect: set.has("order_ctpa") || set.has("order_d_dimer") || set.has("administer_heparin"),
        actualDecision: set.has("order_ctpa") ? "CTPA ordered (PE suspected)" :
          set.has("order_d_dimer") ? "D-dimer ordered (PE considered)" :
          set.has("administer_heparin") ? "Empiric anticoagulation (PE suspected)" : "PE not suspected",
      };
    case "cdp-ecg-interpretation":
      return {
        wasCorrect: set.has("order_ecg") && !set.has("administer_aspirin") && (set.has("order_ctpa") || set.has("administer_heparin")),
        actualDecision: set.has("order_ecg") ?
          (set.has("administer_aspirin") ? "ECG ordered but treated as MI" : "ECG interpreted — pursued PE workup") :
          "ECG not ordered",
      };
    case "cdp-heparin-empiric":
      return {
        wasCorrect: set.has("administer_heparin"),
        actualDecision: set.has("administer_heparin") ? "Heparin administered" : "Anticoagulation not started",
      };
    case "cdp-fluid-caution": {
      const fluidGiven = set.has("fluid_bolus");
      const aggressiveFluids = actions.filter((a) => a === "fluid_bolus").length > 2;
      return {
        wasCorrect: !aggressiveFluids,
        actualDecision: aggressiveFluids ? "Aggressive fluid loading (harmful in RV failure)" :
          fluidGiven ? "Cautious fluid challenge (appropriate)" : "No fluids given",
      };
    }
    case "cdp-thrombolysis-decision":
      return {
        wasCorrect: set.has("administer_tpa") || set.has("thrombolysis"),
        actualDecision: set.has("administer_tpa") ? "tPA administered for massive PE" : "Thrombolysis not given",
      };
    case "cdp-arrest-pe":
      return {
        wasCorrect: set.has("start_cpr"),
        actualDecision: set.has("start_cpr") ? "CPR initiated" : "Arrest management not documented",
      };
    // Dengue myocarditis decisions
    case "cdp-travel-history":
      return {
        wasCorrect: set.has("take_travel_history"),
        actualDecision: set.has("take_travel_history") ? "Travel history obtained" : "Travel history not taken",
      };
    case "cdp-recognize-diffuse-st":
      return {
        wasCorrect: set.has("order_ecg") && (set.has("order_crp") || set.has("order_echo") || set.has("order_coronary_angiography")),
        actualDecision: set.has("order_ecg") ?
          (set.has("order_coronary_angiography") ? "ECG obtained, pursued angiography" : "ECG obtained, non-ischemic workup started") :
          "ECG not ordered",
      };
    case "cdp-not-treat-as-mi": {
      const treatedAsMI = set.has("give_aspirin") || set.has("administer_heparin") || set.has("administer_tpa");
      return {
        wasCorrect: !treatedAsMI,
        actualDecision: treatedAsMI ? "Treated as MI (incorrect — aspirin/heparin/tPA given)" : "Did not commit to MI treatment pathway",
      };
    }
    case "cdp-order-angiography":
      return {
        wasCorrect: set.has("order_coronary_angiography"),
        actualDecision: set.has("order_coronary_angiography") ? "Coronary angiography ordered" : "Angiography not ordered",
      };
    case "cdp-cardiac-mri":
      return {
        wasCorrect: set.has("order_cardiac_mri"),
        actualDecision: set.has("order_cardiac_mri") ? "Cardiac MRI ordered" : "Cardiac MRI not ordered",
      };
    case "cdp-nsaid-dengue-paradox":
      return {
        wasCorrect: set.has("administer_nsaids") || set.has("administer_colchicine") || set.has("administer_aspirin_hd"),
        actualDecision: set.has("administer_nsaids") ? "NSAIDs started for myopericarditis" :
          set.has("administer_colchicine") ? "Colchicine started" :
          set.has("administer_aspirin_hd") ? "High-dose aspirin started" : "Anti-inflammatory treatment not started",
      };
    default:
      return { wasCorrect: false, actualDecision: null };
  }
}

// ============================================================================
// Exports for checking if a scenario has advanced metrics
// ============================================================================

export function hasAdvancedMetrics(scenarioId: string): boolean {
  return scenarioId in SCENARIO_METRICS_CONFIG;
}

export function getMetricsConfig(scenarioId: string): ScenarioMetricsConfig | undefined {
  return SCENARIO_METRICS_CONFIG[scenarioId];
}
