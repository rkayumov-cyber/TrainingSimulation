export interface JargonMatch {
  term: string;
  plainEnglish: string;
  position: number;
}

const medicalJargon: Record<string, string> = {
  // Vital signs jargon
  tachycardia: "fast heart rate",
  tachycardic: "fast heart rate",
  bradycardia: "slow heart rate",
  bradycardic: "slow heart rate",
  hypotension: "low blood pressure",
  hypotensive: "low blood pressure",
  hypertension: "high blood pressure",
  hypertensive: "high blood pressure",
  hypoxia: "low oxygen levels",
  hypoxic: "low oxygen levels",
  hypoxemia: "low oxygen in your blood",
  pyrexia: "fever",
  pyrexial: "fever",
  febrile: "fever",
  afebrile: "no fever",
  hypothermia: "low body temperature",
  hypothermic: "low body temperature",
  tachypnea: "fast breathing",
  tachypneic: "fast breathing",
  dyspnea: "difficulty breathing",
  dyspneic: "difficulty breathing",

  // Conditions
  sepsis: "serious infection",
  septic: "serious infection",
  pneumonia: "lung infection",
  uti: "bladder infection",
  cellulitis: "skin infection",
  meningitis: "brain infection",
  endocarditis: "heart infection",
  osteomyelitis: "bone infection",
  bacteremia: "bacteria in your blood",

  // Symptoms jargon
  diaphoresis: "sweating",
  diaphoretic: "sweating",
  cyanosis: "blue color",
  cyanotic: "blue color",
  pallor: "pale color",
  edema: "swelling",
  ascites: "fluid in your belly",
  jaundice: "yellow skin",
  icteric: "yellow skin",
  syncope: "fainting",
  presyncope: "feeling faint",
  lethargy: "extreme tiredness",
  lethargic: "extremely tired",
  malaise: "feeling unwell",

  // Exam findings
  crackles: "crackling sounds in lungs",
  rales: "crackling sounds in lungs",
  rhonchi: "rumbling sounds in lungs",
  wheezing: "whistling sounds when breathing",
  stridor: "high-pitched breathing sound",
  murmur: "extra heart sound",
  bruit: "whooshing sound",
  hepatomegaly: "enlarged liver",
  splenomegaly: "enlarged spleen",

  // Lab terms
  leukocytosis: "high white blood cell count",
  leukopenia: "low white blood cell count",
  thrombocytopenia: "low platelet count",
  anemia: "low red blood cells",
  hyponatremia: "low sodium",
  hyperkalemia: "high potassium",
  hypokalemia: "low potassium",
  azotemia: "kidney problems",
  acidosis: "too much acid in blood",
  alkalosis: "too little acid in blood",

  // Procedures
  intubation: "breathing tube",
  intubate: "put in a breathing tube",
  cannulate: "put in a small tube",
  catheterize: "put in a tube to drain urine",
  venipuncture: "blood draw",
  phlebotomy: "blood draw",

  // Medications
  antipyretic: "fever medicine",
  vasopressor: "blood pressure medicine",
  inotrope: "heart strengthening medicine",
  antibiotic: "medicine for infection",
  analgesic: "pain medicine",
  antiemetic: "medicine for nausea",

  // Medical abbreviations spoken aloud
  prn: "as needed",
  bid: "twice a day",
  tid: "three times a day",
  qid: "four times a day",
  stat: "right away",
  po: "by mouth",
  iv: "through a vein",
  im: "into muscle",
  subq: "under the skin",
};

export function detectJargon(text: string): JargonMatch[] {
  const matches: JargonMatch[] = [];
  const lowerText = text.toLowerCase();

  for (const [term, plainEnglish] of Object.entries(medicalJargon)) {
    const regex = new RegExp(`\\b${term}\\b`, "gi");
    let match;

    while ((match = regex.exec(lowerText)) !== null) {
      matches.push({
        term: match[0],
        plainEnglish,
        position: match.index,
      });
    }
  }

  return matches.sort((a, b) => a.position - b.position);
}

export function hasJargon(text: string): boolean {
  return detectJargon(text).length > 0;
}

export function getJargonSuggestion(jargonMatches: JargonMatch[]): string {
  if (jargonMatches.length === 0) return "";

  const suggestions = jargonMatches.map(
    (m) => `"${m.term}" → "${m.plainEnglish}"`,
  );

  return `Consider simpler language: ${suggestions.join(", ")}`;
}
