import type { MedicalIntent } from "../../types";

interface IntentPattern {
  pattern: RegExp;
  action: string;
  extractTarget?: (match: RegExpMatchArray) => string;
}

const intentPatterns: IntentPattern[] = [
  // Oxygen administration
  {
    pattern:
      /\b(give|administer|apply|start|put on)\s+(oxygen|o2|nasal cannula|face mask|non-?rebreather)\b/i,
    action: "administer_oxygen",
  },
  {
    pattern: /\boxygen\s+(on|therapy|supplement)/i,
    action: "administer_oxygen",
  },
  {
    pattern: /\bspo2\b.*\b(increase|improve|raise)\b/i,
    action: "administer_oxygen",
  },

  // Fluid administration
  {
    pattern:
      /\b(give|administer|start|bolus|run)\s+(\d+\s*ml\s+)?(saline|fluid|iv|crystalloid|ns|normal saline|lactated ringer)/i,
    action: "fluid_bolus",
  },
  {
    pattern: /\bfluid\s+(bolus|challenge|resuscitation)\b/i,
    action: "fluid_bolus",
  },
  { pattern: /\biv\s+(access|line|fluids)\b/i, action: "fluid_bolus" },

  // Antibiotics
  {
    pattern:
      /\b(give|administer|start|order)\s+(antibiotics?|abx|ceftriaxone|vancomycin|piperacillin|tazobactam|zosyn|rocephin|broad[- ]spectrum)/i,
    action: "administer_antibiotics",
  },
  { pattern: /\bantibiotics?\b/i, action: "administer_antibiotics" },

  // Lab orders
  {
    pattern: /\b(order|get|draw|send)\s+(blood\s+)?cultures?\b/i,
    action: "order_blood_cultures",
  },
  { pattern: /\bblood\s+cultures?\b/i, action: "order_blood_cultures" },
  {
    pattern: /\b(order|get|check|draw)\s+(a\s+)?lactate\b/i,
    action: "order_lactate",
  },
  {
    pattern:
      /\b(order|get|draw|send)\s+(a\s+)?(cbc|complete blood count|full blood count)\b/i,
    action: "order_cbc",
  },
  {
    pattern:
      /\b(order|get|draw|send)\s+(a\s+)?(bmp|basic metabolic|chem[- ]?7|metabolic panel)\b/i,
    action: "order_bmp",
  },
  {
    pattern: /\b(order|get|send)\s+(a\s+)?(ua|urinalysis|urine)\b/i,
    action: "order_urinalysis",
  },
  {
    pattern:
      /\b(order|get|send)\s+(a\s+)?(chest\s+)?(x[- ]?ray|cxr|radiograph)\b/i,
    action: "order_chest_xray",
  },
  {
    pattern: /\b(order|get|do)\s+(an?\s+)?(ecg|ekg|electrocardiogram)\b/i,
    action: "order_ecg",
  },

  // Physical examination
  {
    pattern:
      /\b(listen|auscultate|check)\s+(to\s+)?(the\s+)?(heart|cardiac|chest)\s*(sounds?)?\b/i,
    action: "check_heart_sounds",
  },
  {
    pattern:
      /\b(listen|auscultate|check)\s+(to\s+)?(the\s+)?(lung|breath|respiratory)\s*(sounds?)?\b/i,
    action: "check_lung_sounds",
  },
  {
    pattern: /\b(check|feel|palpate)\s+(the\s+)?(abdomen|belly|stomach)\b/i,
    action: "check_abdomen",
  },
  {
    pattern: /\b(check|assess)\s+(the\s+)?(pupils?|eyes?)\b/i,
    action: "check_pupils",
  },
  {
    pattern:
      /\b(check|assess|measure)\s+(the\s+)?(vital|vitals|observations?)\b/i,
    action: "check_vitals",
  },

  // IV access
  {
    pattern:
      /\b(get|establish|place|insert)\s+(an?\s+)?(iv|intravenous|line|cannula|access)\b/i,
    action: "establish_iv_access",
  },

  // Medications - General
  {
    pattern: /\b(give|administer)\s+(paracetamol|acetaminophen|tylenol)\b/i,
    action: "give_antipyretic",
  },
  {
    pattern:
      /\b(give|administer)\s+(vasopressor|norepinephrine|noradrenaline|levophed)\b/i,
    action: "start_vasopressors",
  },

  // MI-specific medications
  { pattern: /\b(give|administer)\s+(aspirin|asa)\b/i, action: "give_aspirin" },
  { pattern: /\baspirin\b/i, action: "give_aspirin" },
  {
    pattern:
      /\b(give|administer)\s+(nitro|nitroglycerin|nitrate|gtn|glyceryl trinitrate)\b/i,
    action: "give_nitro",
  },
  {
    pattern:
      /\b(give|administer)\s+(morphine|fentanyl|pain\s*(relief|killer|medication))\b/i,
    action: "give_morphine",
  },
  {
    pattern:
      /\b(order|get|check|draw)\s+(a\s+)?(troponin|cardiac enzymes|cardiac markers)\b/i,
    action: "order_troponin",
  },

  // Anaphylaxis-specific
  {
    pattern:
      /\b(give|administer|inject)\s+(epinephrine|adrenaline|epipen|epi)\b/i,
    action: "give_epinephrine",
  },
  {
    pattern: /\b(epinephrine|adrenaline|epipen)\b/i,
    action: "give_epinephrine",
  },
  {
    pattern:
      /\b(give|administer)\s+(antihistamine|benadryl|diphenhydramine|cetirizine|chlorpheniramine)\b/i,
    action: "give_antihistamine",
  },
  {
    pattern:
      /\b(give|administer)\s+(steroids?|hydrocortisone|methylprednisolone|prednisone|dexamethasone|corticosteroid)\b/i,
    action: "give_steroids",
  },
  {
    pattern: /\b(check|assess|secure)\s+(the\s+)?(airway)\b/i,
    action: "check_airway",
  },

  // Asthma-specific
  {
    pattern:
      /\b(give|administer|start)\s+(salbutamol|albuterol|ventolin|nebulizer|neb|bronchodilator)\b/i,
    action: "give_salbutamol",
  },
  { pattern: /\b(nebulizer|neb|bronchodilator)\b/i, action: "give_salbutamol" },
  {
    pattern: /\b(give|administer)\s+(ipratropium|atrovent)\b/i,
    action: "give_ipratropium",
  },
  {
    pattern: /\b(check|measure|do)\s+(a\s+)?(peak\s*flow|pefr)\b/i,
    action: "check_peak_flow",
  },
  {
    pattern:
      /\b(order|get|draw)\s+(an?\s+)?(abg|arterial blood gas|blood gas)\b/i,
    action: "order_abg",
  },

  // Stroke-specific
  {
    pattern:
      /\b(order|get|do)\s+(a\s+)?(ct|cat)\s*(scan)?\s*(of\s+)?(the\s+)?(head|brain)\b/i,
    action: "order_ct_head",
  },
  { pattern: /\bct\s*(head|brain)\b/i, action: "order_ct_head" },
  {
    pattern: /\b(order|get|do)\s+(a\s+)?(ct\s*angio|cta)\b/i,
    action: "order_ct_angio",
  },
  {
    pattern:
      /\b(check|assess|do|perform|calculate)\s+(the\s+)?(nihss|nih\s+stroke\s+scale|stroke\s+scale)\b/i,
    action: "check_nihss",
  },
  { pattern: /\bnihss\b/i, action: "check_nihss" },
  {
    pattern:
      /\b(give|administer|start)\s+(tpa|alteplase|tenecteplase|thrombolysis|thrombolytics?|tissue plasminogen)\b/i,
    action: "administer_tpa",
  },
  { pattern: /\bthrombolysis\b/i, action: "administer_tpa" },
  {
    pattern: /\b(give|administer)\s+(labetalol)\b/i,
    action: "administer_labetalol",
  },
  {
    pattern: /\b(give|administer)\s+(nicardipine|cleviprex)\b/i,
    action: "administer_nicardipine",
  },
  {
    pattern:
      /\b(order|get|check|draw)\s+(a\s+)?(coagulation|coags?|inr|pt|aptt|clotting)\b/i,
    action: "order_coagulation",
  },

  // DKA-specific
  {
    pattern:
      /\b(check|get|measure|test)\s+(the\s+)?(blood\s+)?(glucose|sugar|bgl|bsl|dextrose)\b/i,
    action: "check_blood_glucose",
  },
  { pattern: /\bblood\s+(glucose|sugar)\b/i, action: "check_blood_glucose" },
  {
    pattern:
      /\b(start|begin|give|administer)\s+(an?\s+)?(insulin\s+(drip|infusion|gtt)|iv\s+insulin|actrapid)\b/i,
    action: "start_insulin_drip",
  },
  { pattern: /\binsulin\s+(drip|infusion)\b/i, action: "start_insulin_drip" },
  {
    pattern: /\b(check|test|order)\s+(urine\s+)?(ketones?|ketonuria)\b/i,
    action: "check_urine_ketones",
  },
  {
    pattern:
      /\b(order|get|check)\s+(liver\s+(enzymes?|function)|lft|lfts|ast|alt)\b/i,
    action: "order_liver_enzymes",
  },

  // Trauma-specific
  {
    pattern:
      /\b(do|perform|order|get)\s+(a\s+)?(fast|focused\s+assessment)\s*(scan|exam|ultrasound)?\b/i,
    action: "order_fast_scan",
  },
  { pattern: /\bfast\s*(scan|exam|ultrasound)\b/i, action: "order_fast_scan" },
  {
    pattern:
      /\b(check|assess|calculate)\s+(the\s+)?(gcs|glasgow|glasgow\s+coma)\b/i,
    action: "check_gcs",
  },
  { pattern: /\bgcs\b/i, action: "check_gcs" },
  {
    pattern:
      /\b(insert|place|do)\s+(a\s+)?(chest\s+(drain|tube)|intercostal\s+drain|icd|thoracostomy)\b/i,
    action: "insert_chest_drain",
  },
  { pattern: /\bchest\s+(drain|tube)\b/i, action: "insert_chest_drain" },
  {
    pattern:
      /\b(order|get|send)\s+(a?\s*)?(blood\s+)?(type\s*(and|&)\s*crossmatch|crossmatch|group\s*(and|&)\s*(save|cross)|xmatch)\b/i,
    action: "order_blood_type_crossmatch",
  },
  { pattern: /\bcrossmatch\b/i, action: "order_blood_type_crossmatch" },
  {
    pattern:
      /\b(order|get)\s+(a\s+)?(pelvis|pelvic)\s*(x[- ]?ray|radiograph|film)\b/i,
    action: "order_pelvis_xray",
  },
  { pattern: /\bpelvi[sc]\s*(x[- ]?ray|film)\b/i, action: "order_pelvis_xray" },

  // Pediatric seizure
  {
    pattern:
      /\b(give|administer)\s+(diazepam|valium|midazolam|versed|lorazepam|ativan|benzo|benzodiazepine)\b/i,
    action: "administer_diazepam",
  },
  {
    pattern: /\b(rectal\s+diazepam|buccal\s+midazolam)\b/i,
    action: "administer_diazepam",
  },

  // Eclampsia-specific
  {
    pattern: /\b(give|administer|start)\s+(magnesium|mag\s*sulfate|mgso4)\b/i,
    action: "administer_magnesium",
  },
  { pattern: /\bmagnesium\b/i, action: "administer_magnesium" },
  {
    pattern:
      /\b(check|test|order|dip)\s+(for\s+)?(proteinuria|urine\s+protein|protein\s+in\s+urine)\b/i,
    action: "check_proteinuria",
  },
  { pattern: /\bproteinuria\b/i, action: "check_proteinuria" },
  {
    pattern:
      /\b(check|monitor|assess)\s+(the\s+)?(fetal|foetal|baby'?s?)\s*(heart|hr|heart\s*rate|ctg)\b/i,
    action: "check_fetal_heart",
  },
  { pattern: /\b(ctg|cardiotocograph)\b/i, action: "check_fetal_heart" },
  {
    pattern:
      /\b(prepare|plan|arrange)\s+(for\s+)?(delivery|c[- ]?section|caesarean|cesarean|birth)\b/i,
    action: "prepare_for_delivery",
  },

  // Cardiac arrest (ACLS)
  {
    pattern:
      /\b(start|begin|do|perform)\s+(cpr|chest\s+compressions?|cardiopulmonary\s+resuscitation)\b/i,
    action: "start_cpr",
  },
  { pattern: /\bcpr\b/i, action: "start_cpr" },
  { pattern: /\b(defibrillate|shock|defib)\b/i, action: "defibrillate" },
  {
    pattern: /\b(use|apply|charge)\s+(the\s+)?(defibrillator|defib|aed)\b/i,
    action: "defibrillate",
  },
  {
    pattern: /\b(bag|bvm|bag[- ]?valve[- ]?mask|ambu\s*bag)\b/i,
    action: "bag_valve_mask",
  },
  {
    pattern: /\b(give|administer|push)\s+(amiodarone|cordarone)\b/i,
    action: "administer_amiodarone",
  },
  { pattern: /\bamiodarone\b/i, action: "administer_amiodarone" },
  {
    pattern:
      /\b(check|assess|analyze)\s+(the\s+)?(rhythm|cardiac\s+rhythm|ecg\s+rhythm)\b/i,
    action: "check_rhythm",
  },
  { pattern: /\brhythm\s+check\b/i, action: "check_rhythm" },

  // Overdose-specific
  {
    pattern: /\b(give|administer|push)\s+(naloxone|narcan|naxone)\b/i,
    action: "administer_naloxone",
  },
  { pattern: /\bnaloxone\b/i, action: "administer_naloxone" },
  { pattern: /\bnarcan\b/i, action: "administer_naloxone" },
  {
    pattern:
      /\b(order|get|send)\s+(a\s+)?(tox|toxicology)\s*(screen|panel|test)\b/i,
    action: "order_toxicology_screen",
  },
  { pattern: /\btox\s*screen\b/i, action: "order_toxicology_screen" },
];

export function parseIntent(input: string): MedicalIntent | null {
  const normalizedInput = input.toLowerCase().trim();

  for (const { pattern, action, extractTarget } of intentPatterns) {
    const match = normalizedInput.match(pattern);
    if (match) {
      return {
        action,
        target: extractTarget ? extractTarget(match) : undefined,
        raw: input,
      };
    }
  }

  return null;
}

// Deduplicated list of all known action strings (for builder autocomplete)
export const KNOWN_ACTIONS: string[] = Array.from(
  new Set(intentPatterns.map((p) => p.action)),
);

export function parseAllIntents(input: string): MedicalIntent[] {
  const intents: MedicalIntent[] = [];
  const seenActions = new Set<string>();

  for (const { pattern, action } of intentPatterns) {
    if (seenActions.has(action)) continue;

    const match = input.toLowerCase().match(pattern);
    if (match) {
      intents.push({
        action,
        raw: input,
      });
      seenActions.add(action);
    }
  }

  return intents;
}
