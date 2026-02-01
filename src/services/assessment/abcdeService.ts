// ============================================
// ABCDE STRUCTURED ASSESSMENT FRAMEWORK
// ============================================
// Implements the Airway, Breathing, Circulation,
// Disability, Exposure approach used in emergency
// medicine for systematic patient assessment.
// ============================================

// ── Types & Interfaces ──────────────────────

export type ABCDECategory =
  | "airway"
  | "breathing"
  | "circulation"
  | "disability"
  | "exposure";

export interface ABCDECheckItem {
  id: string;
  category: ABCDECategory;
  label: string;
  description: string;
  relatedActions: string[];
  completed: boolean;
  completedAt?: number;
}

export interface ABCDECategoryState {
  items: ABCDECheckItem[];
  completed: boolean;
  score: number;
  maxScore: number;
}

export interface ABCDEAssessment {
  categories: Record<ABCDECategory, ABCDECategoryState>;
  totalScore: number;
  maxTotalScore: number;
  percentComplete: number;
  currentPhase: ABCDECategory;
}

export interface ABCDEProgressEntry {
  category: ABCDECategory;
  label: string;
  completed: number;
  total: number;
  percent: number;
}

// ── Category display labels ─────────────────

const CATEGORY_LABELS: Record<ABCDECategory, string> = {
  airway: "A - Airway",
  breathing: "B - Breathing",
  circulation: "C - Circulation",
  disability: "D - Disability",
  exposure: "E - Exposure",
};

// ── Ordered list of phases ──────────────────

const ABCDE_ORDER: ABCDECategory[] = [
  "airway",
  "breathing",
  "circulation",
  "disability",
  "exposure",
];

// ── Default check-item definitions ──────────

const AIRWAY_ITEMS: ABCDECheckItem[] = [
  {
    id: "a-obstruction",
    category: "airway",
    label: "Look for signs of airway obstruction",
    description:
      "Inspect for visible obstructions, listen for stridor or gurgling, and assess for use of accessory muscles.",
    relatedActions: ["check_airway"],
    completed: false,
  },
  {
    id: "a-breath-sounds",
    category: "airway",
    label: "Listen for abnormal breathing sounds",
    description:
      "Auscultate near the mouth and neck for stridor, wheeze, or gurgling that may indicate partial obstruction.",
    relatedActions: ["check_lung_sounds"],
    completed: false,
  },
  {
    id: "a-speech",
    category: "airway",
    label: "Assess ability to speak",
    description:
      "Determine if the patient can vocalise clearly. A patient who can speak in full sentences likely has a patent airway.",
    relatedActions: [],
    completed: false,
  },
  {
    id: "a-head-tilt",
    category: "airway",
    label: "Head tilt / chin lift if needed",
    description:
      "Perform a head-tilt chin-lift manoeuvre to open the airway if the patient is unconscious or has a compromised airway.",
    relatedActions: ["check_airway"],
    completed: false,
  },
  {
    id: "a-adjunct",
    category: "airway",
    label: "Consider airway adjunct",
    description:
      "Consider inserting an oropharyngeal or nasopharyngeal airway, or prepare for bag-valve-mask ventilation if basic manoeuvres are insufficient.",
    relatedActions: ["bag_valve_mask", "check_airway"],
    completed: false,
  },
];

const BREATHING_ITEMS: ABCDECheckItem[] = [
  {
    id: "b-resp-rate",
    category: "breathing",
    label: "Assess respiratory rate",
    description:
      "Count the respiratory rate over 30 seconds and double. Normal adult range is 12-20 breaths per minute.",
    relatedActions: ["check_vitals"],
    completed: false,
  },
  {
    id: "b-spo2",
    category: "breathing",
    label: "Measure SpO2",
    description:
      "Apply pulse oximetry to measure oxygen saturation. Target is typically >= 94% (88-92% in COPD).",
    relatedActions: ["check_vitals", "administer_oxygen"],
    completed: false,
  },
  {
    id: "b-auscultate",
    category: "breathing",
    label: "Auscultate chest bilaterally",
    description:
      "Listen to breath sounds in all lung zones comparing left with right. Note any crackles, wheeze, or absent breath sounds.",
    relatedActions: ["check_lung_sounds"],
    completed: false,
  },
  {
    id: "b-pattern",
    category: "breathing",
    label: "Assess breathing pattern and depth",
    description:
      "Observe the depth and regularity of breathing. Look for Kussmaul, Cheyne-Stokes, or shallow/laboured breathing.",
    relatedActions: ["check_lung_sounds"],
    completed: false,
  },
  {
    id: "b-oxygen",
    category: "breathing",
    label: "Administer oxygen if SpO2 < 94%",
    description:
      "Start supplemental oxygen via nasal cannulae or face mask if saturations are below target. Titrate to response.",
    relatedActions: ["administer_oxygen"],
    completed: false,
  },
  {
    id: "b-cxr",
    category: "breathing",
    label: "Order chest X-ray if indicated",
    description:
      "Request a chest radiograph if there are abnormal breath sounds, respiratory distress, or suspected pathology (pneumothorax, consolidation, effusion).",
    relatedActions: ["order_chest_xray"],
    completed: false,
  },
];

const CIRCULATION_ITEMS: ABCDECheckItem[] = [
  {
    id: "c-hr-rhythm",
    category: "circulation",
    label: "Assess heart rate and rhythm",
    description:
      "Palpate the radial pulse for rate and regularity. Note if the pulse is bounding, thready, or irregular.",
    relatedActions: ["check_vitals", "check_heart_sounds"],
    completed: false,
  },
  {
    id: "c-bp",
    category: "circulation",
    label: "Measure blood pressure",
    description:
      "Obtain a non-invasive blood pressure reading. Compare with normal ranges and previous readings.",
    relatedActions: ["check_vitals"],
    completed: false,
  },
  {
    id: "c-cap-refill",
    category: "circulation",
    label: "Assess capillary refill time",
    description:
      "Press on the sternum or fingertip for 5 seconds and release. Normal refill is < 2 seconds. Prolonged CRT suggests poor perfusion.",
    relatedActions: ["check_vitals"],
    completed: false,
  },
  {
    id: "c-heart-sounds",
    category: "circulation",
    label: "Auscultate heart sounds",
    description:
      "Listen over the four valve areas for murmurs, added sounds (S3, S4), or muffled heart sounds.",
    relatedActions: ["check_heart_sounds"],
    completed: false,
  },
  {
    id: "c-iv-access",
    category: "circulation",
    label: "Establish IV access",
    description:
      "Insert a large-bore (16-18G) intravenous cannula, ideally in the antecubital fossa. Take bloods at the same time.",
    relatedActions: ["establish_iv_access", "fluid_bolus"],
    completed: false,
  },
  {
    id: "c-bloods",
    category: "circulation",
    label: "Order bloods (FBC, U&E, coagulation)",
    description:
      "Send full blood count, urea & electrolytes, and coagulation screen. Consider group & save, lactate, and blood cultures as needed.",
    relatedActions: ["order_cbc", "order_bmp", "order_coagulation"],
    completed: false,
  },
  {
    id: "c-fluid",
    category: "circulation",
    label: "Consider fluid resuscitation",
    description:
      "If signs of hypovolaemia or shock, administer a 500ml crystalloid bolus over 15 minutes and reassess.",
    relatedActions: ["fluid_bolus"],
    completed: false,
  },
];

const DISABILITY_ITEMS: ABCDECheckItem[] = [
  {
    id: "d-consciousness",
    category: "disability",
    label: "Assess consciousness (AVPU/GCS)",
    description:
      "Use AVPU (Alert, Voice, Pain, Unresponsive) for rapid assessment and Glasgow Coma Scale for detailed scoring (E + V + M).",
    relatedActions: ["check_gcs"],
    completed: false,
  },
  {
    id: "d-pupils",
    category: "disability",
    label: "Check pupils",
    description:
      "Assess pupil size, symmetry, and reactivity to light. Note any unilateral dilation which may indicate raised intracranial pressure.",
    relatedActions: ["check_pupils"],
    completed: false,
  },
  {
    id: "d-glucose",
    category: "disability",
    label: "Check blood glucose",
    description:
      "Perform a bedside capillary blood glucose. Hypoglycaemia (< 4 mmol/L) is a reversible cause of altered consciousness.",
    relatedActions: ["check_blood_glucose"],
    completed: false,
  },
  {
    id: "d-medication-hx",
    category: "disability",
    label: "Review medication/drug history",
    description:
      "Review the patient's current medications, recent changes, and any recreational drug use that may contribute to the presentation.",
    relatedActions: [],
    completed: false,
  },
  {
    id: "d-neuro-deficit",
    category: "disability",
    label: "Assess for neurological deficit",
    description:
      "Perform a focused neurological examination including limb power, tone, and sensation. Consider NIHSS for stroke assessment.",
    relatedActions: ["check_nihss", "check_gcs"],
    completed: false,
  },
];

const EXPOSURE_ITEMS: ABCDECheckItem[] = [
  {
    id: "e-expose",
    category: "exposure",
    label: "Expose patient appropriately",
    description:
      "Remove clothing as needed to perform a thorough examination. Inspect the chest, abdomen, and limbs for signs of injury or pathology.",
    relatedActions: ["check_abdomen"],
    completed: false,
  },
  {
    id: "e-temperature",
    category: "exposure",
    label: "Measure temperature",
    description:
      "Record the patient's core temperature. Hypothermia (< 35C) and hyperthermia (> 38.5C) are both clinically significant.",
    relatedActions: ["check_vitals"],
    completed: false,
  },
  {
    id: "e-skin",
    category: "exposure",
    label: "Check skin for rashes/wounds",
    description:
      "Inspect the skin for rashes (e.g. petechiae in meningococcaemia, urticaria in anaphylaxis), wounds, bruising, or needle marks.",
    relatedActions: ["check_abdomen"],
    completed: false,
  },
  {
    id: "e-dignity",
    category: "exposure",
    label: "Protect dignity and prevent hypothermia",
    description:
      "Cover the patient with a blanket after examination. Maintain dignity at all times and keep the environment warm.",
    relatedActions: [],
    completed: false,
  },
];

// ── Factory ─────────────────────────────────

function buildCategoryState(items: ABCDECheckItem[]): ABCDECategoryState {
  return {
    items: items.map((item) => ({ ...item })),
    completed: false,
    score: 0,
    maxScore: items.length,
  };
}

export function createABCDEAssessment(): ABCDEAssessment {
  const categories: Record<ABCDECategory, ABCDECategoryState> = {
    airway: buildCategoryState(AIRWAY_ITEMS),
    breathing: buildCategoryState(BREATHING_ITEMS),
    circulation: buildCategoryState(CIRCULATION_ITEMS),
    disability: buildCategoryState(DISABILITY_ITEMS),
    exposure: buildCategoryState(EXPOSURE_ITEMS),
  };

  const maxTotalScore = ABCDE_ORDER.reduce(
    (sum, cat) => sum + categories[cat].maxScore,
    0,
  );

  return {
    categories,
    totalScore: 0,
    maxTotalScore,
    percentComplete: 0,
    currentPhase: "airway",
  };
}

// ── Update logic ────────────────────────────

/**
 * Determines if a check item should be marked completed based on actions
 * taken so far and contextual signals like chat message count.
 */
function isItemSatisfied(
  item: ABCDECheckItem,
  actionsTaken: string[],
  chatMessageCount: number,
): boolean {
  // "Assess ability to speak" - satisfied by any chat interaction
  if (item.id === "a-speech") {
    return chatMessageCount > 0;
  }

  // "Review medication/drug history" - satisfied when history taking is done
  // (approximated by having at least 3 chat messages, indicating dialogue)
  if (item.id === "d-medication-hx") {
    return chatMessageCount >= 3;
  }

  // "Protect dignity and prevent hypothermia" - auto-completes
  if (item.id === "e-dignity") {
    return true;
  }

  // Items with no relatedActions that aren't special-cased remain incomplete
  if (item.relatedActions.length === 0) {
    return false;
  }

  // Standard check: at least one of the related actions has been taken
  return item.relatedActions.some((action) => actionsTaken.includes(action));
}

/**
 * Returns a new ABCDEAssessment with updated completion status based on
 * the list of action IDs the trainee has performed and how many chat
 * messages have been exchanged.
 */
export function updateABCDEAssessment(
  assessment: ABCDEAssessment,
  actionsTaken: string[],
  chatMessageCount: number,
): ABCDEAssessment {
  const now = Date.now();

  const updatedCategories = { ...assessment.categories };
  let totalScore = 0;
  let firstIncompletePhase: ABCDECategory | null = null;

  for (const cat of ABCDE_ORDER) {
    const prev = assessment.categories[cat];
    const updatedItems: ABCDECheckItem[] = prev.items.map((item) => {
      if (item.completed) {
        return item;
      }

      const satisfied = isItemSatisfied(item, actionsTaken, chatMessageCount);
      if (satisfied) {
        return {
          ...item,
          completed: true,
          completedAt: now,
        };
      }
      return item;
    });

    const score = updatedItems.filter((i) => i.completed).length;
    const completed = score === prev.maxScore;

    if (!completed && firstIncompletePhase === null) {
      firstIncompletePhase = cat;
    }

    totalScore += score;

    updatedCategories[cat] = {
      items: updatedItems,
      completed,
      score,
      maxScore: prev.maxScore,
    };
  }

  const maxTotalScore = assessment.maxTotalScore;
  const percentComplete =
    maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

  return {
    categories: updatedCategories,
    totalScore,
    maxTotalScore,
    percentComplete,
    currentPhase: firstIncompletePhase ?? "exposure",
  };
}

// ── Progress summary ────────────────────────

/**
 * Returns a concise progress summary for each ABCDE category.
 */
export function getABCDEProgress(
  assessment: ABCDEAssessment,
): ABCDEProgressEntry[] {
  return ABCDE_ORDER.map((cat) => {
    const state = assessment.categories[cat];
    const completedCount = state.items.filter((i) => i.completed).length;
    const total = state.items.length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      category: cat,
      label: CATEGORY_LABELS[cat],
      completed: completedCount,
      total,
      percent,
    };
  });
}
