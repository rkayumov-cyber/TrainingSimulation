// ============================================================================
// physicalExamService.ts
//
// Structured physical examination system with exam areas and findings,
// modelled after DxR Clinician's 18 exam tools. Each finding belongs to a
// body-system area and uses a specific clinical technique (inspection,
// palpation, percussion, auscultation, or special test).
// ============================================================================

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export type ExamArea =
  | "general"
  | "head_neck"
  | "cardiovascular"
  | "respiratory"
  | "abdominal"
  | "neurological"
  | "musculoskeletal"
  | "skin"
  | "peripheral_vascular"
  | "genitourinary";

export type ExamTechnique =
  | "inspection"
  | "palpation"
  | "percussion"
  | "auscultation"
  | "special_test";

export interface ExamFinding {
  id: string;
  area: ExamArea;
  technique: ExamTechnique;
  label: string;
  normalFinding: string;
  relatedActions: string[];
}

export interface ExamResult {
  findingId: string;
  finding: string;
  isAbnormal: boolean;
  performedAt: number;
}

export interface PhysicalExamState {
  results: ExamResult[];
  areasExamined: ExamArea[];
  totalFindings: number;
  abnormalFindings: number;
  percentComplete: number;
}

// ---------------------------------------------------------------------------
// Examination Findings Data
// ---------------------------------------------------------------------------

export const EXAM_FINDINGS: ExamFinding[] = [
  // ── General Inspection ──────────────────────────────────────────────────
  {
    id: "gen_appearance",
    area: "general",
    technique: "inspection",
    label: "General appearance",
    normalFinding: "Alert, comfortable, well-nourished",
    relatedActions: ["check_vitals"],
  },
  {
    id: "gen_skin_color",
    area: "general",
    technique: "inspection",
    label: "Skin color and perfusion",
    normalFinding: "Pink, well-perfused, CRT < 2s",
    relatedActions: ["check_vitals"],
  },
  {
    id: "gen_resp_effort",
    area: "general",
    technique: "inspection",
    label: "Respiratory effort",
    normalFinding: "Normal respiratory effort, no accessory muscle use",
    relatedActions: ["check_lung_sounds"],
  },
  {
    id: "gen_consciousness",
    area: "general",
    technique: "inspection",
    label: "Level of consciousness",
    normalFinding: "Alert and oriented x4",
    relatedActions: ["check_gcs"],
  },
  {
    id: "gen_bmi",
    area: "general",
    technique: "inspection",
    label: "BMI/nutritional status",
    normalFinding: "Normal BMI, no cachexia",
    relatedActions: [],
  },

  // ── Head & Neck ─────────────────────────────────────────────────────────
  {
    id: "hn_pupils",
    area: "head_neck",
    technique: "inspection",
    label: "Pupils",
    normalFinding: "PERRL, 3mm bilaterally",
    relatedActions: ["check_pupils"],
  },
  {
    id: "hn_conjunctivae",
    area: "head_neck",
    technique: "inspection",
    label: "Conjunctivae",
    normalFinding: "Pink, no pallor",
    relatedActions: ["check_pupils"],
  },
  {
    id: "hn_lymph_nodes",
    area: "head_neck",
    technique: "palpation",
    label: "Lymph nodes",
    normalFinding: "No lymphadenopathy",
    relatedActions: [],
  },
  {
    id: "hn_jvp",
    area: "head_neck",
    technique: "inspection",
    label: "JVP",
    normalFinding: "JVP not elevated",
    relatedActions: ["check_heart_sounds"],
  },
  {
    id: "hn_oral_cavity",
    area: "head_neck",
    technique: "inspection",
    label: "Oral cavity and throat",
    normalFinding: "Moist mucous membranes, no lesions",
    relatedActions: ["check_airway"],
  },
  {
    id: "hn_neck_stiffness",
    area: "head_neck",
    technique: "inspection",
    label: "Neck stiffness",
    normalFinding: "No meningism",
    relatedActions: [],
  },

  // ── Cardiovascular ──────────────────────────────────────────────────────
  {
    id: "cv_precordial",
    area: "cardiovascular",
    technique: "inspection",
    label: "Precordial inspection",
    normalFinding: "No visible pulsations",
    relatedActions: ["check_heart_sounds"],
  },
  {
    id: "cv_apex_beat",
    area: "cardiovascular",
    technique: "palpation",
    label: "Apex beat",
    normalFinding: "Located 5th ICS MCL, normal character",
    relatedActions: ["check_heart_sounds"],
  },
  {
    id: "cv_heart_sounds",
    area: "cardiovascular",
    technique: "auscultation",
    label: "Heart sounds",
    normalFinding: "S1S2, no murmurs, rubs, or gallops",
    relatedActions: ["check_heart_sounds"],
  },
  {
    id: "cv_peripheral_pulses",
    area: "cardiovascular",
    technique: "palpation",
    label: "Peripheral pulses",
    normalFinding: "Regular, good volume bilaterally",
    relatedActions: ["check_vitals"],
  },
  {
    id: "cv_edema",
    area: "cardiovascular",
    technique: "inspection",
    label: "Peripheral edema",
    normalFinding: "No pitting edema",
    relatedActions: [],
  },
  {
    id: "cv_cap_refill",
    area: "cardiovascular",
    technique: "special_test",
    label: "Capillary refill",
    normalFinding: "CRT < 2 seconds",
    relatedActions: ["check_vitals"],
  },

  // ── Respiratory ─────────────────────────────────────────────────────────
  {
    id: "resp_chest_wall",
    area: "respiratory",
    technique: "inspection",
    label: "Chest wall movement",
    normalFinding: "Equal bilateral chest expansion",
    relatedActions: ["check_lung_sounds"],
  },
  {
    id: "resp_fremitus",
    area: "respiratory",
    technique: "palpation",
    label: "Tactile fremitus",
    normalFinding: "Equal bilateral tactile fremitus",
    relatedActions: ["check_lung_sounds"],
  },
  {
    id: "resp_percussion",
    area: "respiratory",
    technique: "percussion",
    label: "Chest percussion",
    normalFinding: "Resonant throughout",
    relatedActions: ["check_lung_sounds"],
  },
  {
    id: "resp_breath_sounds",
    area: "respiratory",
    technique: "auscultation",
    label: "Breath sounds",
    normalFinding:
      "Vesicular breath sounds bilaterally, no added sounds",
    relatedActions: ["check_lung_sounds"],
  },
  {
    id: "resp_peak_flow",
    area: "respiratory",
    technique: "special_test",
    label: "Peak flow",
    normalFinding: "Normal PEFR for age/height",
    relatedActions: ["check_peak_flow"],
  },
  {
    id: "resp_pattern",
    area: "respiratory",
    technique: "inspection",
    label: "Respiratory pattern",
    normalFinding:
      "Regular rate and rhythm, no use of accessory muscles",
    relatedActions: ["check_vitals"],
  },

  // ── Abdominal ───────────────────────────────────────────────────────────
  {
    id: "abd_inspection",
    area: "abdominal",
    technique: "inspection",
    label: "Abdominal inspection",
    normalFinding: "Soft, non-distended, no scars",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "abd_bowel_sounds",
    area: "abdominal",
    technique: "auscultation",
    label: "Bowel sounds",
    normalFinding: "Active bowel sounds in all quadrants",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "abd_light_palpation",
    area: "abdominal",
    technique: "palpation",
    label: "Light palpation",
    normalFinding: "Soft, non-tender, no guarding",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "abd_deep_palpation",
    area: "abdominal",
    technique: "palpation",
    label: "Deep palpation",
    normalFinding: "No organomegaly, no masses",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "abd_percussion",
    area: "abdominal",
    technique: "percussion",
    label: "Abdominal percussion",
    normalFinding: "Tympanic throughout, no shifting dullness",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "abd_renal_angle",
    area: "abdominal",
    technique: "palpation",
    label: "Renal angle tenderness",
    normalFinding: "No costovertebral angle tenderness",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "abd_dre",
    area: "abdominal",
    technique: "special_test",
    label: "DRE if indicated",
    normalFinding: "Normal tone, no masses",
    relatedActions: [],
  },

  // ── Neurological ────────────────────────────────────────────────────────
  {
    id: "neuro_gcs",
    area: "neurological",
    technique: "special_test",
    label: "GCS assessment",
    normalFinding: "GCS 15/15 (E4V5M6)",
    relatedActions: ["check_gcs"],
  },
  {
    id: "neuro_pupils",
    area: "neurological",
    technique: "inspection",
    label: "Pupil response",
    normalFinding: "PERRL, no RAPD",
    relatedActions: ["check_pupils"],
  },
  {
    id: "neuro_cranial_nerves",
    area: "neurological",
    technique: "special_test",
    label: "Cranial nerves",
    normalFinding: "CN II-XII intact",
    relatedActions: ["check_nihss"],
  },
  {
    id: "neuro_motor",
    area: "neurological",
    technique: "special_test",
    label: "Motor examination",
    normalFinding: "Power 5/5 all limbs, normal tone",
    relatedActions: ["check_nihss", "check_gcs"],
  },
  {
    id: "neuro_sensory",
    area: "neurological",
    technique: "special_test",
    label: "Sensory examination",
    normalFinding: "Intact to light touch and pin-prick",
    relatedActions: ["check_nihss"],
  },
  {
    id: "neuro_reflexes",
    area: "neurological",
    technique: "special_test",
    label: "Reflexes",
    normalFinding: "2+ and symmetrical, downgoing plantars",
    relatedActions: [],
  },
  {
    id: "neuro_cerebellar",
    area: "neurological",
    technique: "special_test",
    label: "Cerebellar signs",
    normalFinding:
      "Finger-nose and heel-shin normal, no dysdiadochokinesia",
    relatedActions: [],
  },
  {
    id: "neuro_nihss",
    area: "neurological",
    technique: "special_test",
    label: "NIHSS Score",
    normalFinding: "NIHSS 0 - No deficit",
    relatedActions: ["check_nihss"],
  },

  // ── Musculoskeletal ─────────────────────────────────────────────────────
  {
    id: "msk_limb_inspection",
    area: "musculoskeletal",
    technique: "inspection",
    label: "Limb inspection",
    normalFinding: "No deformity, swelling, or bruising",
    relatedActions: [],
  },
  {
    id: "msk_bony_tenderness",
    area: "musculoskeletal",
    technique: "palpation",
    label: "Bony tenderness",
    normalFinding: "No point tenderness",
    relatedActions: [],
  },
  {
    id: "msk_rom",
    area: "musculoskeletal",
    technique: "special_test",
    label: "Range of motion",
    normalFinding: "Full ROM all joints",
    relatedActions: [],
  },
  {
    id: "msk_neurovascular",
    area: "musculoskeletal",
    technique: "special_test",
    label: "Neurovascular status",
    normalFinding: "Intact sensation, pulses present, CRT < 2s",
    relatedActions: [],
  },

  // ── Skin ────────────────────────────────────────────────────────────────
  {
    id: "skin_inspection",
    area: "skin",
    technique: "inspection",
    label: "Skin inspection",
    normalFinding: "No rashes, wounds, or lesions",
    relatedActions: ["check_abdomen"],
  },
  {
    id: "skin_wound",
    area: "skin",
    technique: "inspection",
    label: "Wound assessment",
    normalFinding: "No open wounds",
    relatedActions: [],
  },
  {
    id: "skin_turgor",
    area: "skin",
    technique: "palpation",
    label: "Skin turgor",
    normalFinding: "Good skin turgor, no tenting",
    relatedActions: [],
  },
  {
    id: "skin_temperature",
    area: "skin",
    technique: "inspection",
    label: "Temperature by touch",
    normalFinding: "Warm peripheries",
    relatedActions: ["check_vitals"],
  },

  // ── Peripheral Vascular ─────────────────────────────────────────────────
  {
    id: "pv_pedal_pulses",
    area: "peripheral_vascular",
    technique: "palpation",
    label: "Pedal pulses",
    normalFinding:
      "Dorsalis pedis and posterior tibial pulses present bilaterally",
    relatedActions: [],
  },
  {
    id: "pv_lower_limb",
    area: "peripheral_vascular",
    technique: "inspection",
    label: "Lower limb inspection",
    normalFinding: "No calf swelling, erythema, or tenderness",
    relatedActions: [],
  },
  {
    id: "pv_abi",
    area: "peripheral_vascular",
    technique: "special_test",
    label: "Ankle-brachial index",
    normalFinding: "ABI 1.0-1.3 (normal)",
    relatedActions: [],
  },
];

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/** Flat lookup map built once from EXAM_FINDINGS. */
const findingMap: Map<string, ExamFinding> = new Map();
for (const finding of EXAM_FINDINGS) {
  findingMap.set(finding.id, finding);
}

/** Total number of examination findings. */
const TOTAL_FINDINGS: number = EXAM_FINDINGS.length;

/** Human-readable labels for each exam area. */
const AREA_LABELS: Record<ExamArea, string> = {
  general: "General Inspection",
  head_neck: "Head & Neck",
  cardiovascular: "Cardiovascular",
  respiratory: "Respiratory",
  abdominal: "Abdominal",
  neurological: "Neurological",
  musculoskeletal: "Musculoskeletal",
  skin: "Skin",
  peripheral_vascular: "Peripheral Vascular",
  genitourinary: "Genitourinary",
};

/** All distinct exam areas present in the findings data. */
const ALL_AREAS: ExamArea[] = [
  "general",
  "head_neck",
  "cardiovascular",
  "respiratory",
  "abdominal",
  "neurological",
  "musculoskeletal",
  "skin",
  "peripheral_vascular",
  "genitourinary",
];

/**
 * Derive which areas have been examined based on the current results.
 */
function deriveAreasExamined(results: ExamResult[]): ExamArea[] {
  const areas = new Set<ExamArea>();
  for (const result of results) {
    const finding = findingMap.get(result.findingId);
    if (finding) {
      areas.add(finding.area);
    }
  }
  return Array.from(areas);
}

/**
 * Count abnormal findings in a results array.
 */
function countAbnormal(results: ExamResult[]): number {
  return results.filter((r) => r.isAbnormal).length;
}

/**
 * Rebuild a complete PhysicalExamState from a results array.
 */
function rebuildState(results: ExamResult[]): PhysicalExamState {
  const areasExamined = deriveAreasExamined(results);
  const abnormalFindings = countAbnormal(results);
  const percentComplete =
    TOTAL_FINDINGS > 0
      ? Math.round((results.length / TOTAL_FINDINGS) * 100)
      : 0;

  return {
    results,
    areasExamined,
    totalFindings: results.length,
    abnormalFindings,
    percentComplete,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create an initial, blank physical examination state.
 */
export function createPhysicalExamState(): PhysicalExamState {
  return {
    results: [],
    areasExamined: [],
    totalFindings: 0,
    abnormalFindings: 0,
    percentComplete: 0,
  };
}

/**
 * Perform a single examination finding.
 *
 * If `scenarioFindings` contains an entry keyed by `findingId`, that
 * scenario-specific text is used and the finding is marked as abnormal.
 * Otherwise the normal finding text is used.
 *
 * Duplicate findings (same `findingId`) are ignored (idempotent).
 */
export function performExam(
  state: PhysicalExamState,
  findingId: string,
  scenarioFindings?: Record<string, string>,
): PhysicalExamState {
  // Ignore duplicates
  if (state.results.some((r) => r.findingId === findingId)) {
    return state;
  }

  const examFinding = findingMap.get(findingId);
  if (!examFinding) {
    return state;
  }

  const scenarioText = scenarioFindings?.[findingId];
  const isAbnormal = scenarioText !== undefined;
  const findingText = isAbnormal ? scenarioText : examFinding.normalFinding;

  const newResult: ExamResult = {
    findingId,
    finding: findingText,
    isAbnormal,
    performedAt: Date.now(),
  };

  const newResults = [...state.results, newResult];
  return rebuildState(newResults);
}

/**
 * Auto-complete examinations that are related to a set of action IDs.
 *
 * For each action in `actionsTaken`, any `ExamFinding` whose
 * `relatedActions` array includes that action will be performed
 * automatically (using scenario-specific findings where available).
 */
export function updateExamFromActions(
  state: PhysicalExamState,
  actionsTaken: string[],
  scenarioFindings?: Record<string, string>,
): PhysicalExamState {
  const actionsSet = new Set(actionsTaken);
  let currentState = state;

  for (const finding of EXAM_FINDINGS) {
    // Check whether any of this finding's related actions have been taken
    const isRelated = finding.relatedActions.some((a) => actionsSet.has(a));
    if (!isRelated) {
      continue;
    }

    // Perform the exam (performExam handles deduplication)
    currentState = performExam(currentState, finding.id, scenarioFindings);
  }

  return currentState;
}

/**
 * Return per-area progress statistics for the current examination state.
 */
export function getExamProgress(
  state: PhysicalExamState,
): {
  area: ExamArea;
  label: string;
  examined: number;
  total: number;
  abnormal: number;
}[] {
  const performedIds = new Set(state.results.map((r) => r.findingId));

  return ALL_AREAS.map((area) => {
    const areaFindings = EXAM_FINDINGS.filter((f) => f.area === area);
    const total = areaFindings.length;

    const examinedFindings = areaFindings.filter((f) =>
      performedIds.has(f.id),
    );
    const examined = examinedFindings.length;

    const abnormal = examinedFindings.filter((f) => {
      const result = state.results.find((r) => r.findingId === f.id);
      return result?.isAbnormal ?? false;
    }).length;

    return {
      area,
      label: AREA_LABELS[area],
      examined,
      total,
      abnormal,
    };
  });
}

/**
 * Return the human-readable label for an exam area.
 */
export function getExamAreaLabel(area: ExamArea): string {
  return AREA_LABELS[area];
}
