export interface ActionSuggestion {
  command: string;
  description: string;
  category: "treatment" | "exam" | "lab" | "medication" | "imaging";
}

export const actionSuggestions: ActionSuggestion[] = [
  // Treatments
  {
    command: "Give oxygen",
    description: "Apply supplemental oxygen via nasal cannula or mask",
    category: "treatment",
  },
  {
    command: "Give IV fluids",
    description: "Administer IV normal saline bolus",
    category: "treatment",
  },
  {
    command: "Give antibiotics",
    description: "Administer broad-spectrum antibiotics",
    category: "treatment",
  },
  {
    command: "Establish IV access",
    description: "Place peripheral IV cannula",
    category: "treatment",
  },
  {
    command: "Give paracetamol",
    description: "Administer antipyretic medication",
    category: "medication",
  },
  {
    command: "Start vasopressors",
    description: "Begin norepinephrine infusion",
    category: "medication",
  },

  // Physical Examination
  {
    command: "Listen to heart sounds",
    description: "Auscultate cardiac exam",
    category: "exam",
  },
  {
    command: "Listen to lung sounds",
    description: "Auscultate respiratory exam",
    category: "exam",
  },
  {
    command: "Check abdomen",
    description: "Perform abdominal examination",
    category: "exam",
  },
  {
    command: "Check pupils",
    description: "Assess pupillary response",
    category: "exam",
  },
  {
    command: "Check vitals",
    description: "Review current vital signs",
    category: "exam",
  },

  // Lab Orders
  {
    command: "Order blood cultures",
    description: "Send blood cultures before antibiotics",
    category: "lab",
  },
  {
    command: "Order lactate",
    description: "Check serum lactate level",
    category: "lab",
  },
  {
    command: "Order CBC",
    description: "Complete blood count",
    category: "lab",
  },
  {
    command: "Order BMP",
    description: "Basic metabolic panel",
    category: "lab",
  },
  {
    command: "Order urinalysis",
    description: "Urine analysis",
    category: "lab",
  },
  {
    command: "Order chest X-ray",
    description: "Chest radiograph",
    category: "lab",
  },
  { command: "Order ECG", description: "Electrocardiogram", category: "lab" },

  // Stroke
  {
    command: "Order CT head",
    description: "Urgent CT scan of the brain",
    category: "imaging",
  },
  {
    command: "Order CT angiography",
    description: "CT angiogram for vessel occlusion",
    category: "imaging",
  },
  {
    command: "Check NIHSS",
    description: "NIH Stroke Scale assessment",
    category: "exam",
  },
  {
    command: "Give tPA",
    description: "Thrombolysis with alteplase",
    category: "medication",
  },
  {
    command: "Give labetalol",
    description: "IV labetalol for blood pressure control",
    category: "medication",
  },
  {
    command: "Order coagulation",
    description: "PT/INR/aPTT coagulation panel",
    category: "lab",
  },

  // DKA
  {
    command: "Check blood glucose",
    description: "Point-of-care blood glucose",
    category: "exam",
  },
  {
    command: "Start insulin drip",
    description: "Fixed-rate IV insulin infusion",
    category: "medication",
  },
  {
    command: "Check urine ketones",
    description: "Urine ketone dipstick",
    category: "lab",
  },
  {
    command: "Order liver enzymes",
    description: "Liver function tests (AST/ALT)",
    category: "lab",
  },

  // Trauma
  {
    command: "Order FAST scan",
    description: "Focused abdominal sonography for trauma",
    category: "imaging",
  },
  {
    command: "Check GCS",
    description: "Glasgow Coma Scale assessment",
    category: "exam",
  },
  {
    command: "Insert chest drain",
    description: "Intercostal chest tube insertion",
    category: "treatment",
  },
  {
    command: "Order blood type crossmatch",
    description: "Type and crossmatch for transfusion",
    category: "lab",
  },
  {
    command: "Order pelvis X-ray",
    description: "AP pelvis radiograph",
    category: "imaging",
  },

  // Peds seizure
  {
    command: "Give diazepam",
    description: "Benzodiazepine to stop seizure",
    category: "medication",
  },

  // Eclampsia
  {
    command: "Give magnesium",
    description: "Magnesium sulfate for seizure prevention",
    category: "medication",
  },
  {
    command: "Check proteinuria",
    description: "Urine protein dipstick",
    category: "lab",
  },
  {
    command: "Check fetal heart rate",
    description: "CTG / fetal heart monitoring",
    category: "exam",
  },
  {
    command: "Prepare for delivery",
    description: "Alert obstetrics for emergency delivery",
    category: "treatment",
  },

  // Cardiac arrest
  {
    command: "Start CPR",
    description: "Begin chest compressions",
    category: "treatment",
  },
  {
    command: "Defibrillate",
    description: "Deliver defibrillation shock",
    category: "treatment",
  },
  {
    command: "Bag valve mask",
    description: "Manual ventilation with BVM",
    category: "treatment",
  },
  {
    command: "Give amiodarone",
    description: "Amiodarone 300mg IV for VF/VT",
    category: "medication",
  },
  {
    command: "Check rhythm",
    description: "Analyze cardiac rhythm",
    category: "exam",
  },

  // Overdose
  {
    command: "Give naloxone",
    description: "Opioid reversal agent (Narcan)",
    category: "medication",
  },
  {
    command: "Order toxicology screen",
    description: "Urine and serum tox screen",
    category: "lab",
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
