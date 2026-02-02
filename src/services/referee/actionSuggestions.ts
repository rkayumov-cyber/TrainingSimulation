export type ActionCategory =
  | "treatment"
  | "exam"
  | "lab"
  | "medication"
  | "imaging";

export interface ActionSuggestion {
  command: string;
  description: string;
  category: ActionCategory;
  actionId: string;
}

export interface CategoryMeta {
  label: string;
  icon: string;
  category: ActionCategory;
}

export const CATEGORY_META: CategoryMeta[] = [
  { label: "Exam", icon: "🩺", category: "exam" },
  { label: "Labs", icon: "🧪", category: "lab" },
  { label: "Meds", icon: "💊", category: "medication" },
  { label: "Treat", icon: "⚕", category: "treatment" },
  { label: "Imaging", icon: "📷", category: "imaging" },
];

export const actionSuggestions: ActionSuggestion[] = [
  // Treatments
  {
    command: "Give oxygen",
    description: "Apply supplemental oxygen via nasal cannula or mask",
    category: "treatment",
    actionId: "administer_oxygen",
  },
  {
    command: "Give IV fluids",
    description: "Administer IV normal saline bolus",
    category: "treatment",
    actionId: "fluid_bolus",
  },
  {
    command: "Give antibiotics",
    description: "Administer broad-spectrum antibiotics",
    category: "treatment",
    actionId: "administer_antibiotics",
  },
  {
    command: "Establish IV access",
    description: "Place peripheral IV cannula",
    category: "treatment",
    actionId: "establish_iv_access",
  },
  {
    command: "Give paracetamol",
    description: "Administer antipyretic medication",
    category: "medication",
    actionId: "give_antipyretic",
  },
  {
    command: "Start vasopressors",
    description: "Begin norepinephrine infusion",
    category: "medication",
    actionId: "start_vasopressors",
  },

  // Physical Examination
  {
    command: "Listen to heart sounds",
    description: "Auscultate cardiac exam",
    category: "exam",
    actionId: "check_heart_sounds",
  },
  {
    command: "Listen to lung sounds",
    description: "Auscultate respiratory exam",
    category: "exam",
    actionId: "check_lung_sounds",
  },
  {
    command: "Check abdomen",
    description: "Perform abdominal examination",
    category: "exam",
    actionId: "check_abdomen",
  },
  {
    command: "Check pupils",
    description: "Assess pupillary response",
    category: "exam",
    actionId: "check_pupils",
  },
  {
    command: "Check vitals",
    description: "Review current vital signs",
    category: "exam",
    actionId: "check_vitals",
  },

  // Lab Orders
  {
    command: "Order blood cultures",
    description: "Send blood cultures before antibiotics",
    category: "lab",
    actionId: "order_blood_cultures",
  },
  {
    command: "Order lactate",
    description: "Check serum lactate level",
    category: "lab",
    actionId: "order_lactate",
  },
  {
    command: "Order CBC",
    description: "Complete blood count",
    category: "lab",
    actionId: "order_cbc",
  },
  {
    command: "Order BMP",
    description: "Basic metabolic panel",
    category: "lab",
    actionId: "order_bmp",
  },
  {
    command: "Order urinalysis",
    description: "Urine analysis",
    category: "lab",
    actionId: "order_urinalysis",
  },
  {
    command: "Order chest X-ray",
    description: "Chest radiograph",
    category: "lab",
    actionId: "order_chest_xray",
  },
  {
    command: "Order ECG",
    description: "Electrocardiogram",
    category: "lab",
    actionId: "order_ecg",
  },

  // Stroke
  {
    command: "Order CT head",
    description: "Urgent CT scan of the brain",
    category: "imaging",
    actionId: "order_ct_head",
  },
  {
    command: "Order CT angiography",
    description: "CT angiogram for vessel occlusion",
    category: "imaging",
    actionId: "order_ct_angio",
  },
  {
    command: "Check NIHSS",
    description: "NIH Stroke Scale assessment",
    category: "exam",
    actionId: "check_nihss",
  },
  {
    command: "Give tPA",
    description: "Thrombolysis with alteplase",
    category: "medication",
    actionId: "administer_tpa",
  },
  {
    command: "Give labetalol",
    description: "IV labetalol for blood pressure control",
    category: "medication",
    actionId: "administer_labetalol",
  },
  {
    command: "Order coagulation",
    description: "PT/INR/aPTT coagulation panel",
    category: "lab",
    actionId: "order_coagulation",
  },

  // DKA
  {
    command: "Check blood glucose",
    description: "Point-of-care blood glucose",
    category: "exam",
    actionId: "check_blood_glucose",
  },
  {
    command: "Start insulin drip",
    description: "Fixed-rate IV insulin infusion",
    category: "medication",
    actionId: "start_insulin_drip",
  },
  {
    command: "Check urine ketones",
    description: "Urine ketone dipstick",
    category: "lab",
    actionId: "check_urine_ketones",
  },
  {
    command: "Order liver enzymes",
    description: "Liver function tests (AST/ALT)",
    category: "lab",
    actionId: "order_liver_enzymes",
  },

  // Trauma
  {
    command: "Order FAST scan",
    description: "Focused abdominal sonography for trauma",
    category: "imaging",
    actionId: "order_fast_scan",
  },
  {
    command: "Check GCS",
    description: "Glasgow Coma Scale assessment",
    category: "exam",
    actionId: "check_gcs",
  },
  {
    command: "Insert chest drain",
    description: "Intercostal chest tube insertion",
    category: "treatment",
    actionId: "insert_chest_drain",
  },
  {
    command: "Order blood type crossmatch",
    description: "Type and crossmatch for transfusion",
    category: "lab",
    actionId: "order_blood_type_crossmatch",
  },
  {
    command: "Order pelvis X-ray",
    description: "AP pelvis radiograph",
    category: "imaging",
    actionId: "order_pelvis_xray",
  },

  // Peds seizure
  {
    command: "Give diazepam",
    description: "Benzodiazepine to stop seizure",
    category: "medication",
    actionId: "administer_diazepam",
  },

  // Eclampsia
  {
    command: "Give magnesium",
    description: "Magnesium sulfate for seizure prevention",
    category: "medication",
    actionId: "administer_magnesium",
  },
  {
    command: "Check proteinuria",
    description: "Urine protein dipstick",
    category: "lab",
    actionId: "check_proteinuria",
  },
  {
    command: "Check fetal heart rate",
    description: "CTG / fetal heart monitoring",
    category: "exam",
    actionId: "check_fetal_heart",
  },
  {
    command: "Prepare for delivery",
    description: "Alert obstetrics for emergency delivery",
    category: "treatment",
    actionId: "prepare_for_delivery",
  },

  // Cardiac arrest
  {
    command: "Start CPR",
    description: "Begin chest compressions",
    category: "treatment",
    actionId: "start_cpr",
  },
  {
    command: "Defibrillate",
    description: "Deliver defibrillation shock",
    category: "treatment",
    actionId: "defibrillate",
  },
  {
    command: "Bag valve mask",
    description: "Manual ventilation with BVM",
    category: "treatment",
    actionId: "bag_valve_mask",
  },
  {
    command: "Give amiodarone",
    description: "Amiodarone 300mg IV for VF/VT",
    category: "medication",
    actionId: "administer_amiodarone",
  },
  {
    command: "Check rhythm",
    description: "Analyze cardiac rhythm",
    category: "exam",
    actionId: "check_rhythm",
  },

  // Overdose
  {
    command: "Give naloxone",
    description: "Opioid reversal agent (Narcan)",
    category: "medication",
    actionId: "administer_naloxone",
  },
  {
    command: "Order toxicology screen",
    description: "Urine and serum tox screen",
    category: "lab",
    actionId: "order_toxicology_screen",
  },

  // MI
  {
    command: "Give aspirin",
    description: "Antiplatelet therapy",
    category: "medication",
    actionId: "give_aspirin",
  },
  {
    command: "Give epinephrine",
    description: "Epinephrine (adrenaline) injection",
    category: "medication",
    actionId: "give_epinephrine",
  },
  {
    command: "Give antihistamine",
    description: "Antihistamine for allergic reaction",
    category: "medication",
    actionId: "give_antihistamine",
  },
  {
    command: "Give steroids",
    description: "Corticosteroid administration",
    category: "medication",
    actionId: "give_steroids",
  },
  {
    command: "Give salbutamol",
    description: "Beta-2 agonist bronchodilator",
    category: "medication",
    actionId: "give_salbutamol",
  },
  {
    command: "Give ipratropium",
    description: "Anticholinergic bronchodilator",
    category: "medication",
    actionId: "give_ipratropium",
  },
  {
    command: "Check peak flow",
    description: "Peak expiratory flow measurement",
    category: "exam",
    actionId: "check_peak_flow",
  },
  {
    command: "Order ABG",
    description: "Arterial blood gas analysis",
    category: "lab",
    actionId: "order_abg",
  },
  {
    command: "Give nitroglycerin",
    description: "Sublingual nitroglycerin for chest pain",
    category: "medication",
    actionId: "give_nitro",
  },
  {
    command: "Give morphine",
    description: "Opioid analgesic for severe pain",
    category: "medication",
    actionId: "give_morphine",
  },
  {
    command: "Order troponin",
    description: "Cardiac troponin level",
    category: "lab",
    actionId: "order_troponin",
  },
  {
    command: "Check airway",
    description: "Assess and secure airway",
    category: "exam",
    actionId: "check_airway",
  },
];

export function filterSuggestions(input: string): ActionSuggestion[] {
  if (!input || input.length < 2) return [];

  const lowerInput = input.toLowerCase();

  return actionSuggestions.filter(
    (suggestion) =>
      suggestion.command.toLowerCase().includes(lowerInput) ||
      suggestion.description.toLowerCase().includes(lowerInput),
  );
}

export function getCategoryColor(
  category: ActionSuggestion["category"],
): string {
  switch (category) {
    case "treatment":
      return "text-emerald-400";
    case "exam":
      return "text-blue-400";
    case "lab":
      return "text-purple-400";
    case "medication":
      return "text-amber-400";
    case "imaging":
      return "text-cyan-400";
    default:
      return "text-slate-400";
  }
}

export function getCategoryBgColor(
  category: ActionSuggestion["category"],
): string {
  switch (category) {
    case "treatment":
      return "bg-emerald-900/30";
    case "exam":
      return "bg-blue-900/30";
    case "lab":
      return "bg-purple-900/30";
    case "medication":
      return "bg-amber-900/30";
    case "imaging":
      return "bg-cyan-900/30";
    default:
      return "bg-slate-800";
  }
}

export function isActionTaken(
  suggestion: ActionSuggestion,
  actionsTaken: string[],
): boolean {
  return actionsTaken.includes(suggestion.actionId);
}

export function getActionsByCategory(): Record<
  ActionCategory,
  ActionSuggestion[]
> {
  const grouped: Record<ActionCategory, ActionSuggestion[]> = {
    exam: [],
    lab: [],
    medication: [],
    treatment: [],
    imaging: [],
  };

  for (const suggestion of actionSuggestions) {
    grouped[suggestion.category].push(suggestion);
  }

  return grouped;
}

export interface GroupedSuggestions {
  category: ActionCategory;
  suggestions: ActionSuggestion[];
}

export function filterSuggestionsGrouped(
  input: string,
  maxTotal: number = 8,
  maxPerCategory: number = 3,
): GroupedSuggestions[] {
  const matches = filterSuggestions(input);
  if (matches.length === 0) return [];

  // Group by category
  const groups = new Map<ActionCategory, ActionSuggestion[]>();
  for (const match of matches) {
    const existing = groups.get(match.category) || [];
    if (existing.length < maxPerCategory) {
      existing.push(match);
    }
    groups.set(match.category, existing);
  }

  // Flatten, cap at maxTotal, then re-group
  const allCapped: ActionSuggestion[] = [];
  for (const [, items] of groups) {
    for (const item of items) {
      if (allCapped.length >= maxTotal) break;
      allCapped.push(item);
    }
    if (allCapped.length >= maxTotal) break;
  }

  // Re-group capped results preserving CATEGORY_META order
  const categoryOrder: ActionCategory[] = [
    "exam",
    "lab",
    "medication",
    "treatment",
    "imaging",
  ];
  const result: GroupedSuggestions[] = [];

  for (const cat of categoryOrder) {
    const catItems = allCapped.filter((s) => s.category === cat);
    if (catItems.length > 0) {
      result.push({ category: cat, suggestions: catItems });
    }
  }

  return result;
}
