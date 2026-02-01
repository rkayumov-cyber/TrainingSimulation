// ============================================================================
// historyTakingService.ts
//
// Structured history-taking system with preset questions organised by category.
// Modelled after DxR Clinician's approach: the patient responds to questions
// based on their scenario persona.
// ============================================================================

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export type HistoryCategory =
  | "presenting_complaint"
  | "hpi"
  | "pmh"
  | "drug_history"
  | "family_history"
  | "social_history"
  | "systems_review";

export interface HistoryQuestion {
  id: string;
  category: HistoryCategory;
  text: string;
  shortLabel: string;
  followUpIds?: string[];
}

export interface HistoryCategoryInfo {
  id: HistoryCategory;
  name: string;
  description: string;
  icon: string; // lucide icon name
  questions: HistoryQuestion[];
}

export interface HistoryTakingState {
  questionsAsked: string[];
  completedCategories: HistoryCategory[];
  totalQuestions: number;
  askedCount: number;
  percentComplete: number;
}

// ---------------------------------------------------------------------------
// Category & Question Data
// ---------------------------------------------------------------------------

export const HISTORY_CATEGORIES: HistoryCategoryInfo[] = [
  // ── Presenting Complaint (SOCRATES) ─────────────────────────────────────
  {
    id: "presenting_complaint",
    name: "Presenting Complaint",
    description:
      "Explore the patient's main symptom using the SOCRATES framework.",
    icon: "stethoscope",
    questions: [
      {
        id: "pc_chief",
        category: "presenting_complaint",
        text: "What brought you in today?",
        shortLabel: "Chief complaint",
        followUpIds: ["pc_site", "pc_onset"],
      },
      {
        id: "pc_site",
        category: "presenting_complaint",
        text: "Where exactly is the pain/problem?",
        shortLabel: "Site",
        followUpIds: ["pc_radiation"],
      },
      {
        id: "pc_onset",
        category: "presenting_complaint",
        text: "When did it start?",
        shortLabel: "Onset",
        followUpIds: ["pc_timing"],
      },
      {
        id: "pc_character",
        category: "presenting_complaint",
        text: "Can you describe the character of the pain?",
        shortLabel: "Character",
      },
      {
        id: "pc_radiation",
        category: "presenting_complaint",
        text: "Does it spread anywhere else?",
        shortLabel: "Radiation",
      },
      {
        id: "pc_alleviating",
        category: "presenting_complaint",
        text: "What makes it better or worse?",
        shortLabel: "Alleviating/Aggravating",
      },
      {
        id: "pc_severity",
        category: "presenting_complaint",
        text: "How would you rate the severity 1-10?",
        shortLabel: "Severity",
      },
      {
        id: "pc_timing",
        category: "presenting_complaint",
        text: "Is it constant or does it come and go?",
        shortLabel: "Timing",
      },
      {
        id: "pc_associated",
        category: "presenting_complaint",
        text: "Have you had any other symptoms?",
        shortLabel: "Associated symptoms",
      },
      {
        id: "pc_previous",
        category: "presenting_complaint",
        text: "Have you experienced this before?",
        shortLabel: "Previous episodes",
      },
    ],
  },

  // ── History of Presenting Illness ───────────────────────────────────────
  {
    id: "hpi",
    name: "History of Presenting Illness",
    description: "Detailed timeline and impact of the current illness episode.",
    icon: "clock",
    questions: [
      {
        id: "hpi_progression",
        category: "hpi",
        text: "How has this progressed since it started?",
        shortLabel: "Progression",
      },
      {
        id: "hpi_treatment",
        category: "hpi",
        text: "Have you tried any treatments?",
        shortLabel: "Prior treatment",
      },
      {
        id: "hpi_consultation",
        category: "hpi",
        text: "Have you seen a doctor about this before?",
        shortLabel: "Previous consultation",
      },
      {
        id: "hpi_context",
        category: "hpi",
        text: "What were you doing when it started?",
        shortLabel: "Context",
      },
      {
        id: "hpi_appetite",
        category: "hpi",
        text: "Have you noticed any changes in your appetite?",
        shortLabel: "Appetite",
      },
      {
        id: "hpi_weight",
        category: "hpi",
        text: "Any changes in weight recently?",
        shortLabel: "Weight changes",
      },
      {
        id: "hpi_functional",
        category: "hpi",
        text: "How has this affected your daily activities?",
        shortLabel: "Functional impact",
      },
      {
        id: "hpi_travel",
        category: "hpi",
        text: "Any recent travel or contact with sick people?",
        shortLabel: "Travel/contacts",
      },
    ],
  },

  // ── Past Medical History ────────────────────────────────────────────────
  {
    id: "pmh",
    name: "Past Medical History",
    description:
      "Previous illnesses, operations, and long-term health conditions.",
    icon: "file-text",
    questions: [
      {
        id: "pmh_conditions",
        category: "pmh",
        text: "Do you have any medical conditions?",
        shortLabel: "Conditions",
      },
      {
        id: "pmh_surgeries",
        category: "pmh",
        text: "Have you had any operations or surgeries?",
        shortLabel: "Surgeries",
      },
      {
        id: "pmh_hospital",
        category: "pmh",
        text: "Have you been in hospital before?",
        shortLabel: "Hospitalizations",
      },
      {
        id: "pmh_chronic",
        category: "pmh",
        text: "Any history of heart disease, diabetes, or high BP?",
        shortLabel: "Chronic diseases",
      },
      {
        id: "pmh_haem",
        category: "pmh",
        text: "Have you ever had blood clots or bleeding problems?",
        shortLabel: "Haematological",
      },
      {
        id: "pmh_immunisations",
        category: "pmh",
        text: "Are you up to date on vaccinations?",
        shortLabel: "Immunizations",
      },
    ],
  },

  // ── Drug History ────────────────────────────────────────────────────────
  {
    id: "drug_history",
    name: "Drug History",
    description: "Current medications, allergies, supplements, and compliance.",
    icon: "pill",
    questions: [
      {
        id: "dh_current",
        category: "drug_history",
        text: "What medications are you currently taking?",
        shortLabel: "Current meds",
        followUpIds: ["dh_changes", "dh_compliance"],
      },
      {
        id: "dh_otc",
        category: "drug_history",
        text: "Do you take any over-the-counter medications?",
        shortLabel: "OTC meds",
      },
      {
        id: "dh_allergies",
        category: "drug_history",
        text: "Do you have any drug allergies?",
        shortLabel: "Allergies",
      },
      {
        id: "dh_supplements",
        category: "drug_history",
        text: "Are you taking any herbal remedies or supplements?",
        shortLabel: "Supplements",
      },
      {
        id: "dh_changes",
        category: "drug_history",
        text: "Have any of your medications changed recently?",
        shortLabel: "Recent changes",
      },
      {
        id: "dh_compliance",
        category: "drug_history",
        text: "Are you taking your medications as prescribed?",
        shortLabel: "Compliance",
      },
    ],
  },

  // ── Family History ──────────────────────────────────────────────────────
  {
    id: "family_history",
    name: "Family History",
    description:
      "Relevant medical conditions among first- and second-degree relatives.",
    icon: "users",
    questions: [
      {
        id: "fh_conditions",
        category: "family_history",
        text: "Any medical conditions in your family?",
        shortLabel: "Family conditions",
        followUpIds: ["fh_cardiovascular", "fh_cancer", "fh_diabetes"],
      },
      {
        id: "fh_cardiovascular",
        category: "family_history",
        text: "Any family history of heart disease or stroke?",
        shortLabel: "Cardiovascular",
      },
      {
        id: "fh_cancer",
        category: "family_history",
        text: "Any family history of cancer?",
        shortLabel: "Cancer",
      },
      {
        id: "fh_diabetes",
        category: "family_history",
        text: "Any family history of diabetes?",
        shortLabel: "Diabetes",
      },
    ],
  },

  // ── Social History ──────────────────────────────────────────────────────
  {
    id: "social_history",
    name: "Social History",
    description:
      "Lifestyle factors, living situation, and psychosocial context.",
    icon: "home",
    questions: [
      {
        id: "sh_smoking",
        category: "social_history",
        text: "Do you smoke or have you ever smoked?",
        shortLabel: "Smoking",
      },
      {
        id: "sh_alcohol",
        category: "social_history",
        text: "How much alcohol do you drink?",
        shortLabel: "Alcohol",
      },
      {
        id: "sh_drugs",
        category: "social_history",
        text: "Do you use any recreational drugs?",
        shortLabel: "Recreational drugs",
      },
      {
        id: "sh_occupation",
        category: "social_history",
        text: "What is your occupation?",
        shortLabel: "Occupation",
      },
      {
        id: "sh_living",
        category: "social_history",
        text: "Who do you live with?",
        shortLabel: "Living situation",
      },
      {
        id: "sh_dependents",
        category: "social_history",
        text: "Do you have any dependents?",
        shortLabel: "Dependents",
      },
      {
        id: "sh_adls",
        category: "social_history",
        text: "Can you manage daily activities independently?",
        shortLabel: "ADLs",
      },
      {
        id: "sh_mental",
        category: "social_history",
        text: "Have you been feeling stressed or low?",
        shortLabel: "Mental health",
      },
    ],
  },

  // ── Systems Review ──────────────────────────────────────────────────────
  {
    id: "systems_review",
    name: "Systems Review",
    description:
      "Systematic screen of each organ system for additional symptoms.",
    icon: "layout-list",
    questions: [
      {
        id: "sr_cardiovascular",
        category: "systems_review",
        text: "Any chest pain or palpitations?",
        shortLabel: "Cardiovascular",
      },
      {
        id: "sr_respiratory",
        category: "systems_review",
        text: "Any shortness of breath or cough?",
        shortLabel: "Respiratory",
      },
      {
        id: "sr_gi",
        category: "systems_review",
        text: "Any nausea, vomiting, or diarrhoea?",
        shortLabel: "GI",
      },
      {
        id: "sr_urinary",
        category: "systems_review",
        text: "Any urinary problems?",
        shortLabel: "Urinary",
      },
      {
        id: "sr_neuro",
        category: "systems_review",
        text: "Any headaches or dizziness?",
        shortLabel: "Neurological",
      },
      {
        id: "sr_msk",
        category: "systems_review",
        text: "Any joint pain or swelling?",
        shortLabel: "MSK",
      },
      {
        id: "sr_derm",
        category: "systems_review",
        text: "Any skin rashes or changes?",
        shortLabel: "Dermatological",
      },
      {
        id: "sr_ent",
        category: "systems_review",
        text: "Any changes in vision or hearing?",
        shortLabel: "ENT",
      },
      {
        id: "sr_constitutional",
        category: "systems_review",
        text: "Any fevers, night sweats, or weight loss?",
        shortLabel: "Constitutional",
      },
      {
        id: "sr_gynae",
        category: "systems_review",
        text: "For women: any menstrual irregularities or pregnancy?",
        shortLabel: "Gynaecological",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/** Flat lookup map built once from HISTORY_CATEGORIES. */
const questionMap: Map<string, HistoryQuestion> = new Map();
for (const category of HISTORY_CATEGORIES) {
  for (const question of category.questions) {
    questionMap.set(question.id, question);
  }
}

/** Total number of questions across all categories. */
const TOTAL_QUESTIONS: number = HISTORY_CATEGORIES.reduce(
  (sum, cat) => sum + cat.questions.length,
  0,
);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create an initial, blank history-taking state.
 */
export function createHistoryTakingState(): HistoryTakingState {
  return {
    questionsAsked: [],
    completedCategories: [],
    totalQuestions: TOTAL_QUESTIONS,
    askedCount: 0,
    percentComplete: 0,
  };
}

/**
 * Return a new state reflecting the fact that `questionId` has been asked.
 *
 * - Ignores duplicate question IDs (idempotent).
 * - Automatically marks a category as complete when all its questions have
 *   been asked.
 */
export function updateHistoryTakingState(
  state: HistoryTakingState,
  questionId: string,
): HistoryTakingState {
  // Ignore duplicates
  if (state.questionsAsked.includes(questionId)) {
    return state;
  }

  const newQuestionsAsked = [...state.questionsAsked, questionId];
  const newAskedCount = newQuestionsAsked.length;
  const newPercentComplete = Math.round(
    (newAskedCount / TOTAL_QUESTIONS) * 100,
  );

  // Determine which categories are now fully completed
  const newCompletedCategories: HistoryCategory[] = HISTORY_CATEGORIES.filter(
    (cat) => cat.questions.every((q) => newQuestionsAsked.includes(q.id)),
  ).map((cat) => cat.id);

  return {
    questionsAsked: newQuestionsAsked,
    completedCategories: newCompletedCategories,
    totalQuestions: TOTAL_QUESTIONS,
    askedCount: newAskedCount,
    percentComplete: newPercentComplete,
  };
}

/**
 * Look up a single question by its unique ID.
 */
export function getQuestionById(id: string): HistoryQuestion | undefined {
  return questionMap.get(id);
}

/**
 * Return per-category progress statistics for the given state.
 */
export function getCategoryProgress(state: HistoryTakingState): {
  category: HistoryCategory;
  name: string;
  asked: number;
  total: number;
  percent: number;
}[] {
  return HISTORY_CATEGORIES.map((cat) => {
    const total = cat.questions.length;
    const asked = cat.questions.filter((q) =>
      state.questionsAsked.includes(q.id),
    ).length;
    const percent = total > 0 ? Math.round((asked / total) * 100) : 0;

    return {
      category: cat.id,
      name: cat.name,
      asked,
      total,
      percent,
    };
  });
}
