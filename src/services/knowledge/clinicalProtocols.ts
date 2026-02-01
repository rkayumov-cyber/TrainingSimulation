// ============================================
// COMPREHENSIVE CLINICAL PROTOCOLS SERVICE
// Drug dosing, procedures, algorithms, and assessment tools
// ============================================

// ============================================
// DRUG DOSING REFERENCE
// ============================================

export interface DrugDosing {
  name: string;
  genericName: string;
  category: string;
  indications: string[];
  adultDose: string;
  pediatricDose?: string;
  route: string;
  frequency: string;
  maxDose: string;
  onsetTime: string;
  duration: string;
  contraindications: string[];
  sideEffects: string[];
  monitoringParameters: string[];
  nursingConsiderations: string[];
}

export const DRUG_DOSING_REFERENCE: DrugDosing[] = [
  // CARDIOVASCULAR
  {
    name: "Epinephrine (Adrenaline)",
    genericName: "epinephrine",
    category: "Vasopressor / Sympathomimetic",
    indications: [
      "Cardiac arrest",
      "Anaphylaxis",
      "Severe bronchospasm",
      "Symptomatic bradycardia (after atropine fails)",
    ],
    adultDose:
      "Cardiac arrest: 1mg IV/IO q3-5min. Anaphylaxis: 0.3-0.5mg IM (1:1000). Infusion: 2-10 mcg/min",
    pediatricDose:
      "Cardiac arrest: 0.01mg/kg IV/IO (max 1mg). Anaphylaxis: 0.01mg/kg IM (max 0.3mg)",
    route: "IV, IO, IM (anaphylaxis: IM preferred)",
    frequency: "q3-5min in arrest; q5-15min IM in anaphylaxis",
    maxDose: "No max in cardiac arrest; 0.5mg IM per dose in anaphylaxis",
    onsetTime: "IV: immediate; IM: 3-5 min",
    duration: "IV: 5-10 min; IM: 15-20 min",
    contraindications: [
      "No absolute contraindications in cardiac arrest or anaphylaxis",
    ],
    sideEffects: [
      "Tachycardia",
      "Hypertension",
      "Tremor",
      "Anxiety",
      "Palpitations",
      "Headache",
    ],
    monitoringParameters: [
      "Heart rate",
      "Blood pressure",
      "ECG rhythm",
      "SpO2",
    ],
    nursingConsiderations: [
      "IM injection in anterolateral thigh is preferred for anaphylaxis",
      "1:10,000 for IV use, 1:1,000 for IM use — concentration matters",
      "Flush IV line after each dose in arrest",
    ],
  },
  {
    name: "Amiodarone",
    genericName: "amiodarone",
    category: "Antiarrhythmic (Class III)",
    indications: [
      "Refractory VF/pulseless VT",
      "Stable VT",
      "Atrial fibrillation (rate/rhythm control)",
    ],
    adultDose:
      "Cardiac arrest: 300mg IV/IO bolus (1st dose), 150mg (2nd dose). Stable: 150mg IV over 10 min, then 1mg/min x6h, then 0.5mg/min x18h",
    pediatricDose: "5mg/kg IV/IO bolus (max 300mg), repeat 5mg/kg x2",
    route: "IV, IO",
    frequency: "As per protocol",
    maxDose: "2.2g in 24 hours",
    onsetTime: "Minutes (IV bolus)",
    duration: "Half-life 40-55 days",
    contraindications: [
      "Cardiogenic shock",
      "Severe sinus node disease",
      "2nd/3rd degree heart block without pacemaker",
      "Known hypersensitivity",
    ],
    sideEffects: [
      "Hypotension (rapid infusion)",
      "Bradycardia",
      "QT prolongation",
      "Phlebitis",
      "Long-term: thyroid, pulmonary, hepatic toxicity",
    ],
    monitoringParameters: [
      "Continuous ECG",
      "Blood pressure",
      "QTc interval",
      "Thyroid function (long-term)",
      "LFTs (long-term)",
    ],
    nursingConsiderations: [
      "Use central line for infusion when possible (peripheral causes phlebitis)",
      "Mix in D5W only — incompatible with normal saline",
      "Slow bolus over 10 min for stable patients (hypotension risk)",
    ],
  },
  {
    name: "Atropine",
    genericName: "atropine sulfate",
    category: "Anticholinergic",
    indications: [
      "Symptomatic bradycardia",
      "Organophosphate poisoning",
      "Pre-intubation in pediatrics",
    ],
    adultDose: "Bradycardia: 0.5mg IV q3-5min (max 3mg)",
    pediatricDose: "0.02mg/kg IV (min 0.1mg, max 0.5mg)",
    route: "IV, IO, ET (less reliable)",
    frequency: "q3-5min",
    maxDose: "3mg total for bradycardia",
    onsetTime: "1-2 minutes IV",
    duration: "30-60 minutes",
    contraindications: [
      "Narrow-angle glaucoma (relative)",
      "Myasthenia gravis",
      "Obstructive uropathy",
    ],
    sideEffects: [
      "Tachycardia",
      "Dry mouth",
      "Urinary retention",
      "Mydriasis",
      "Confusion (especially elderly)",
    ],
    monitoringParameters: ["Heart rate", "ECG rhythm", "Blood pressure"],
    nursingConsiderations: [
      "Doses <0.5mg may cause paradoxical bradycardia",
      "Ineffective in infranodal (Mobitz II or 3rd degree) blocks — prepare pacing",
      "Not recommended in cardiac arrest (removed from AHA guidelines)",
    ],
  },
  {
    name: "Aspirin",
    genericName: "acetylsalicylic acid",
    category: "Antiplatelet",
    indications: ["Acute coronary syndrome", "Acute ischemic stroke (after CT)"],
    adultDose:
      "ACS: 325mg chewed immediately. Secondary prevention: 81mg daily",
    route: "PO (chewed for rapid absorption)",
    frequency: "Single loading dose, then daily",
    maxDose: "325mg loading dose",
    onsetTime: "15-20 min (chewed)",
    duration: "Irreversible platelet inhibition (7-10 days)",
    contraindications: [
      "Active GI bleeding",
      "True aspirin allergy",
      "Before CT in stroke (hemorrhage not excluded)",
      "Last 7 days if surgery planned",
    ],
    sideEffects: [
      "GI upset/bleeding",
      "Tinnitus (toxicity)",
      "Bronchospasm (aspirin-sensitive asthma)",
    ],
    monitoringParameters: [
      "Signs of bleeding",
      "GI symptoms",
      "Platelet function",
    ],
    nursingConsiderations: [
      "CHEW — do not swallow whole (delays absorption by 30+ min)",
      "Give even with enteric-coated — crush if needed",
      "Rectal can be used if patient cannot take PO",
    ],
  },
  {
    name: "Nitroglycerin",
    genericName: "nitroglycerin",
    category: "Vasodilator / Antianginal",
    indications: [
      "Chest pain (angina, ACS)",
      "Acute pulmonary edema",
      "Hypertensive emergency",
    ],
    adultDose:
      "SL: 0.4mg q5min x3. Infusion: start 5-10 mcg/min, titrate by 5-10 mcg/min q5min",
    route: "SL, IV infusion, topical",
    frequency: "SL q5min x3; infusion continuous",
    maxDose: "3 SL tablets; infusion titrated to effect",
    onsetTime: "SL: 1-3 min; IV: immediate",
    duration: "SL: 25-30 min; IV: 3-5 min after stopping",
    contraindications: [
      "SBP < 90 mmHg",
      "Right ventricular MI",
      "PDE5 inhibitor use within 24-48h (sildenafil/tadalafil)",
      "Severe aortic stenosis",
      "Constrictive pericarditis",
    ],
    sideEffects: [
      "Hypotension",
      "Headache",
      "Tachycardia",
      "Flushing",
      "Syncope",
    ],
    monitoringParameters: [
      "Blood pressure (q5min with SL, continuous with infusion)",
      "Heart rate",
      "Chest pain severity",
    ],
    nursingConsiderations: [
      "Check BP before EACH sublingual dose",
      "Ask about PDE5 inhibitor use (Viagra, Cialis)",
      "Use non-PVC tubing for IV infusion (drug adsorbs to PVC)",
    ],
  },
  // RESPIRATORY
  {
    name: "Salbutamol (Albuterol)",
    genericName: "salbutamol",
    category: "Short-acting Beta-2 Agonist (SABA)",
    indications: [
      "Acute bronchospasm",
      "Asthma exacerbation",
      "COPD exacerbation",
      "Hyperkalemia (drives K+ intracellular)",
    ],
    adultDose:
      "Nebulizer: 2.5-5mg q20min x3, then q1-4h. MDI: 4-8 puffs q20min x3",
    pediatricDose:
      "Nebulizer: 0.15mg/kg (min 2.5mg) q20min x3. MDI: 2-4 puffs q20min",
    route: "Inhaled (nebulizer or MDI with spacer), IV (refractory cases)",
    frequency: "q20min for acute, then q1-4h",
    maxDose: "Continuous nebulization 10-15mg/hr for severe exacerbation",
    onsetTime: "5-15 minutes",
    duration: "4-6 hours",
    contraindications: [
      "Hypersensitivity (rare)",
      "Use cautiously in severe cardiac disease",
    ],
    sideEffects: [
      "Tachycardia",
      "Tremor",
      "Hypokalemia",
      "Anxiety",
      "Palpitations",
    ],
    monitoringParameters: [
      "Heart rate",
      "SpO2",
      "Peak flow (before and after)",
      "Respiratory rate",
      "Potassium (if prolonged use)",
    ],
    nursingConsiderations: [
      "Use spacer with MDI for better delivery to lower airways",
      "Continuous nebulization for life-threatening exacerbation",
      "Can be mixed with ipratropium in same nebulizer",
    ],
  },
  {
    name: "Ipratropium Bromide",
    genericName: "ipratropium",
    category: "Anticholinergic Bronchodilator",
    indications: [
      "Severe asthma exacerbation (adjunct to SABA)",
      "COPD exacerbation",
    ],
    adultDose: "Nebulizer: 500mcg q20min x3, then q4-6h",
    pediatricDose: "Nebulizer: 250-500mcg q20min x3",
    route: "Inhaled (nebulizer)",
    frequency: "q20min in acute phase, then q4-6h",
    maxDose: "2mg/day",
    onsetTime: "15-30 minutes",
    duration: "4-6 hours",
    contraindications: [
      "Soy or peanut allergy (some formulations contain soy lecithin)",
      "Narrow-angle glaucoma (nebulizer near eyes)",
    ],
    sideEffects: [
      "Dry mouth",
      "Blurred vision (if in eyes)",
      "Urinary retention",
      "Cough",
    ],
    monitoringParameters: [
      "SpO2",
      "Peak flow",
      "Respiratory rate",
      "Work of breathing",
    ],
    nursingConsiderations: [
      "Most effective when combined with SABA (synergistic bronchodilation)",
      "Use mouthpiece rather than face mask to avoid ocular exposure",
      "Not a rescue medication alone — always use with beta-agonist",
    ],
  },
  // NEUROLOGICAL
  {
    name: "Alteplase (tPA)",
    genericName: "alteplase",
    category: "Thrombolytic",
    indications: [
      "Acute ischemic stroke (within 4.5 hours)",
      "STEMI (if PCI not available within 120 min)",
      "Massive pulmonary embolism",
    ],
    adultDose:
      "Stroke: 0.9mg/kg (max 90mg) — 10% bolus over 1 min, rest over 60 min. STEMI: 15mg bolus, then weight-based infusion",
    route: "IV",
    frequency: "Single administration",
    maxDose: "90mg for stroke",
    onsetTime: "Minutes (peak fibrinolysis 30-45 min)",
    duration: "Half-life 4-5 minutes, but lytic effect hours",
    contraindications: [
      "Active internal bleeding",
      "Recent (3 months) intracranial surgery, stroke, or head trauma",
      "Intracranial hemorrhage on CT",
      "INR > 1.7 or platelets < 100,000",
      "BP > 185/110 not controlled",
      "Blood glucose < 50 mg/dL",
    ],
    sideEffects: [
      "Hemorrhage (intracranial most feared)",
      "Angioedema (especially with ACEi use)",
      "Reperfusion arrhythmias",
    ],
    monitoringParameters: [
      "Neurological checks q15min during and for 24h after",
      "BP q15min x2h, q30min x6h, q1h x16h",
      "Signs of bleeding (any site)",
      "CT head if neurological deterioration",
    ],
    nursingConsiderations: [
      "Two nurse verification of dose calculation required",
      "No anticoagulants or antiplatelets for 24 hours after administration",
      "If angioedema: stop infusion, diphenhydramine, ranitidine, consider epinephrine",
      "Keep BP < 180/105 for 24h post-tPA",
    ],
  },
  {
    name: "Naloxone",
    genericName: "naloxone hydrochloride",
    category: "Opioid Antagonist",
    indications: [
      "Opioid overdose with respiratory depression",
      "Opioid-induced altered mental status",
      "Neonatal opioid depression",
    ],
    adultDose:
      "0.4-2mg IV/IM/SC q2-3min. Intranasal: 4mg per nostril. Infusion: 0.25-6.25 mcg/kg/hr for long-acting opioid OD",
    pediatricDose: "0.1mg/kg IV/IM (max 2mg per dose)",
    route: "IV, IM, SC, IN, ET",
    frequency: "q2-3min until respiratory effort improves",
    maxDose: "10mg total (if no response, reconsider diagnosis)",
    onsetTime: "IV: 2 min; IM: 5 min; IN: 3-5 min",
    duration: "30-90 minutes (shorter than most opioids)",
    contraindications: [
      "Hypersensitivity (rare)",
      "Use caution in opioid-dependent patients (withdrawal)",
    ],
    sideEffects: [
      "Acute opioid withdrawal (nausea, vomiting, diaphoresis, tachycardia)",
      "Pulmonary edema (rare, with excessive dosing)",
      "Agitation/combativeness",
    ],
    monitoringParameters: [
      "Respiratory rate (primary target)",
      "SpO2",
      "Level of consciousness",
      "Pupil size",
      "Re-sedation (monitor 4+ hours)",
    ],
    nursingConsiderations: [
      "Titrate to respiratory effort, NOT full consciousness (prevents withdrawal)",
      "Re-dosing usually needed — naloxone wears off before opioid",
      "Consider infusion for long-acting opioid overdose (methadone, fentanyl patch)",
      "Ensure patient cannot leave AMA during monitoring period",
    ],
  },
  {
    name: "Diazepam",
    genericName: "diazepam",
    category: "Benzodiazepine",
    indications: [
      "Status epilepticus",
      "Seizures (acute management)",
      "Alcohol withdrawal seizures",
      "Anxiolysis/sedation",
    ],
    adultDose:
      "Seizure: 5-10mg IV q5-10min (max 30mg). Rectal: 0.2mg/kg. Alcohol withdrawal: 10-20mg IV/PO",
    pediatricDose:
      "0.2-0.5mg/kg IV (max 10mg) or 0.5mg/kg PR (max 20mg). Neonatal: 0.1-0.3mg/kg IV",
    route: "IV (slowly over 2 min), PR, PO, IM (erratic absorption)",
    frequency: "q5-10min for active seizure",
    maxDose: "30mg for seizure; weight-based in children",
    onsetTime: "IV: 1-3 min; PR: 5-10 min",
    duration: "15-20 min (redistribution), half-life 20-100h",
    contraindications: [
      "Acute narrow-angle glaucoma",
      "Severe respiratory depression",
      "Myasthenia gravis",
    ],
    sideEffects: [
      "Respiratory depression",
      "Hypotension",
      "Sedation",
      "Paradoxical agitation (children, elderly)",
    ],
    monitoringParameters: [
      "Respiratory rate",
      "SpO2",
      "Blood pressure",
      "Level of sedation",
      "Seizure cessation",
    ],
    nursingConsiderations: [
      "Have airway equipment and flumazenil available",
      "Inject slowly — rapid IV push causes respiratory arrest",
      "PR route useful when IV access not available (pediatric seizure)",
      "Long half-life — accumulates with repeated dosing",
    ],
  },
  // METABOLIC / ENDOCRINE
  {
    name: "Regular Insulin (IV)",
    genericName: "insulin regular",
    category: "Hormone (glucose management)",
    indications: [
      "Diabetic ketoacidosis (DKA)",
      "Hyperglycemic hyperosmolar state (HHS)",
      "Severe hyperkalemia",
    ],
    adultDose:
      "DKA: 0.1 units/kg/hr infusion (no bolus). Hyperkalemia: 10 units IV with 25g dextrose",
    pediatricDose: "DKA: 0.05-0.1 units/kg/hr infusion",
    route: "IV infusion (only regular insulin can be given IV)",
    frequency: "Continuous infusion for DKA; hourly glucose checks",
    maxDose: "Titrate to glucose decline of 50-75 mg/dL/hr",
    onsetTime: "IV: 15-30 minutes",
    duration: "IV: 30-60 minutes after stopping",
    contraindications: [
      "Hypokalemia (K+ < 3.3 — must correct FIRST)",
      "Hypoglycemia",
    ],
    sideEffects: [
      "Hypoglycemia",
      "Hypokalemia (drives K+ into cells)",
      "Cerebral edema (pediatric — rapid correction)",
    ],
    monitoringParameters: [
      "Blood glucose hourly",
      "Potassium q2h (q1h if abnormal)",
      "Anion gap q4h",
      "Sodium, BUN, creatinine",
      "Fluid balance",
    ],
    nursingConsiderations: [
      "ALWAYS check potassium before starting — fatal arrhythmia risk",
      "Start D5W when glucose reaches 250 mg/dL (keep insulin running)",
      "Do NOT stop insulin until anion gap closes",
      "Transition to SubQ insulin 1-2h before stopping IV (overlap needed)",
    ],
  },
  {
    name: "Magnesium Sulfate",
    genericName: "magnesium sulfate",
    category: "Electrolyte / Anticonvulsant / Tocolytic",
    indications: [
      "Eclampsia / pre-eclampsia with severe features",
      "Severe asthma (refractory to SABA)",
      "Torsades de pointes",
      "Hypomagnesemia",
    ],
    adultDose:
      "Eclampsia: 4g IV over 15-20 min, then 1-2g/hr. Asthma: 2g IV over 20 min. Torsades: 2g IV over 2-5 min",
    pediatricDose: "Asthma: 25-50mg/kg IV (max 2g) over 20 min",
    route: "IV (slow infusion), IM (painful)",
    frequency: "Loading dose then maintenance infusion for eclampsia",
    maxDose: "Eclampsia: 40g/24h; monitor levels",
    onsetTime: "IV: 5-15 minutes",
    duration: "30-60 minutes (IV bolus); 3-4 hours (infusion)",
    contraindications: [
      "Myasthenia gravis",
      "Heart block",
      "Renal failure (accumulates — requires dose adjustment)",
    ],
    sideEffects: [
      "Flushing",
      "Hypotension",
      "Loss of deep tendon reflexes (early sign of toxicity)",
      "Respiratory depression",
      "Cardiac arrest (severe toxicity >7 mmol/L)",
    ],
    monitoringParameters: [
      "Deep tendon reflexes (patellar) — check hourly",
      "Respiratory rate (>12/min)",
      "Urine output (>25 mL/hr)",
      "Magnesium levels if renal impairment",
    ],
    nursingConsiderations: [
      "Calcium gluconate 1g at bedside as antidote for Mg toxicity",
      "Loss of reflexes = FIRST sign of toxicity — stop infusion",
      "Continue for 24-48h post-delivery in eclampsia",
      "Monitor fetal heart rate if antepartum",
    ],
  },
  {
    name: "Labetalol",
    genericName: "labetalol hydrochloride",
    category: "Alpha/Beta Blocker",
    indications: [
      "Hypertensive emergency",
      "Pre-eclampsia / eclampsia BP control",
      "Stroke BP management (pre- and post-tPA)",
      "Aortic dissection",
    ],
    adultDose:
      "IV push: 20mg over 2 min, then 40-80mg q10min (max 300mg). Infusion: 0.5-2mg/min",
    route: "IV, PO",
    frequency: "q10min IV push; continuous infusion",
    maxDose: "300mg cumulative IV; 2400mg/day PO",
    onsetTime: "IV: 2-5 minutes",
    duration: "IV: 2-6 hours",
    contraindications: [
      "Severe bradycardia or heart block",
      "Decompensated heart failure",
      "Severe asthma/bronchospasm (beta-blocker component)",
      "Cardiogenic shock",
    ],
    sideEffects: [
      "Orthostatic hypotension",
      "Bradycardia",
      "Bronchospasm",
      "Fatigue",
      "Dizziness",
      "Nausea",
    ],
    monitoringParameters: [
      "Blood pressure q5min during IV titration",
      "Heart rate",
      "Symptoms of dizziness/lightheadedness",
    ],
    nursingConsiderations: [
      "Keep patient supine during and for 3h after IV injection (orthostatic hypotension)",
      "Safe in pregnancy (unlike ACEi/ARBs)",
      "Stroke targets: <185/110 pre-tPA, <180/105 post-tPA",
    ],
  },
  // FLUIDS & ELECTROLYTES
  {
    name: "Normal Saline (0.9% NaCl)",
    genericName: "sodium chloride 0.9%",
    category: "Isotonic Crystalloid",
    indications: [
      "Volume resuscitation",
      "DKA fluid replacement",
      "Hyponatremia correction",
      "Drug dilution vehicle",
    ],
    adultDose:
      "Sepsis: 30 mL/kg bolus. DKA: 1-1.5L/hr x1-2h, then 250-500 mL/hr. Maintenance: 125 mL/hr",
    pediatricDose: "Bolus: 20 mL/kg over 5-20 min, repeat as needed",
    route: "IV",
    frequency: "Continuous or bolus as needed",
    maxDose: "Guided by clinical response and signs of overload",
    onsetTime: "Immediate (volume expansion)",
    duration: "~25% remains intravascular after 1 hour",
    contraindications: [
      "Fluid overload / decompensated heart failure",
      "Hypernatremia",
      "Hyperchloremic metabolic acidosis (consider balanced crystalloid)",
    ],
    sideEffects: [
      "Hyperchloremic metabolic acidosis (large volumes)",
      "Peripheral edema",
      "Pulmonary edema (overload)",
    ],
    monitoringParameters: [
      "Blood pressure",
      "Urine output",
      "JVP / CVP",
      "Lung sounds (crackles = overload)",
      "Sodium, chloride, lactate",
    ],
    nursingConsiderations: [
      "Reassess after each bolus — look for response and overload signs",
      "Warm fluids in trauma/hypothermia (cold fluid worsens coagulopathy)",
      "Balanced crystalloid (Ringer's lactate) may be preferred for large volumes",
    ],
  },
  // ANTI-INFLAMMATORY / DENGUE MYOCARDITIS
  {
    name: "Colchicine",
    genericName: "colchicine",
    category: "Anti-inflammatory (Pericarditis)",
    indications: [
      "Acute pericarditis (first-line adjunct to NSAIDs)",
      "Recurrent pericarditis prevention",
      "Post-pericardiotomy syndrome",
    ],
    adultDose:
      "Acute pericarditis: 0.5mg BID x3 months (>70kg) or 0.5mg daily (<70kg). Loading: 1mg then 0.5mg 1h later on day 1",
    route: "PO",
    frequency: "BID (>70kg) or daily (<70kg)",
    maxDose: "1.5mg/day",
    onsetTime: "24-48 hours for anti-inflammatory effect",
    duration: "3 months for acute pericarditis; 6 months for recurrent",
    contraindications: [
      "Severe hepatic impairment",
      "Severe renal impairment (CrCl <30 — dose adjust)",
      "Concurrent strong CYP3A4 inhibitors (clarithromycin, ketoconazole)",
      "Blood dyscrasias",
    ],
    sideEffects: [
      "Diarrhea (most common — up to 10%)",
      "Nausea/vomiting",
      "Abdominal pain",
      "Bone marrow suppression (rare, dose-related)",
    ],
    monitoringParameters: [
      "GI symptoms",
      "CBC (prolonged use)",
      "Renal function",
      "Hepatic function",
    ],
    nursingConsiderations: [
      "ESC first-line ADJUNCT to NSAIDs for acute pericarditis — reduces recurrence by 50%",
      "Take with food to reduce GI side effects",
      "In dengue: benefits outweigh hemorrhage risk when pericarditis confirmed",
      "Do NOT use with grapefruit juice (inhibits metabolism)",
    ],
  },
  {
    name: "Ibuprofen (High-dose for Pericarditis)",
    genericName: "ibuprofen",
    category: "NSAID (Anti-inflammatory)",
    indications: [
      "Acute pericarditis (first-line treatment)",
      "Myopericarditis",
      "Pain and inflammation",
    ],
    adultDose:
      "Pericarditis: 600mg TID for 1-2 weeks, then taper over 2-4 weeks. Alternative: Aspirin 750-1000mg TID",
    route: "PO",
    frequency: "TID (every 8 hours)",
    maxDose: "2400mg/day",
    onsetTime: "30-60 minutes",
    duration: "4-6 hours per dose; treatment course 1-4 weeks",
    contraindications: [
      "Active GI bleeding or peptic ulcer",
      "Severe renal impairment",
      "Third trimester pregnancy",
      "Post-CABG (within 10-14 days)",
      "Dengue with thrombocytopenia (<100,000) — relative contraindication",
    ],
    sideEffects: [
      "GI bleeding (especially in dengue)",
      "Renal impairment",
      "Cardiovascular risk (prolonged use)",
      "Platelet dysfunction",
    ],
    monitoringParameters: [
      "Platelet count (critical in dengue)",
      "GI symptoms and stool guaiac",
      "Renal function",
      "CRP (response to treatment)",
    ],
    nursingConsiderations: [
      "In dengue myocarditis: NSAIDs are INDICATED despite general dengue caution — benefits outweigh risks when platelets are normal",
      "Co-prescribe PPI (omeprazole) for GI protection",
      "Monitor platelet count closely — discontinue if <100,000",
      "Aspirin 750mg TID is the alternative in the source case report",
    ],
  },
];

// ============================================
// CLINICAL PROCEDURE CHECKLISTS
// ============================================

export interface ProcedureStep {
  step: number;
  action: string;
  detail: string;
  criticalStep: boolean;
}

export interface ClinicalProcedure {
  id: string;
  name: string;
  category: string;
  indications: string[];
  contraindications: string[];
  equipment: string[];
  steps: ProcedureStep[];
  complications: string[];
  postProcedureCare: string[];
}

export const CLINICAL_PROCEDURES: ClinicalProcedure[] = [
  {
    id: "rsi",
    name: "Rapid Sequence Intubation (RSI)",
    category: "Airway Management",
    indications: [
      "Failure to protect airway (GCS ≤ 8)",
      "Respiratory failure despite non-invasive support",
      "Airway obstruction not relieved by positioning",
      "Anticipated clinical deterioration requiring airway control",
    ],
    contraindications: [
      "Anticipated difficult airway without backup plan",
      "Complete upper airway obstruction (surgical airway needed)",
    ],
    equipment: [
      "Laryngoscope (direct or video)",
      "ETT (7.0-8.0 adult male, 6.5-7.5 adult female)",
      "Bougie / stylet",
      "BVM with O2 connected",
      "Suction (Yankauer)",
      "End-tidal CO2 detector",
      "Induction agent (propofol, ketamine, or etomidate)",
      "Paralytic (succinylcholine or rocuronium)",
      "Backup airway (LMA, surgical cricothyrotomy kit)",
    ],
    steps: [
      {
        step: 1,
        action: "Preparation",
        detail:
          "Check equipment, suction, monitoring. Pre-oxygenate with 100% O2 for 3-5 min or 8 vital capacity breaths",
        criticalStep: true,
      },
      {
        step: 2,
        action: "Positioning",
        detail:
          'Sniffing position (ear to sternal notch alignment). Ramped position for obese patients. C-spine inline stabilization if trauma',
        criticalStep: false,
      },
      {
        step: 3,
        action: "Induction",
        detail:
          "Push induction agent: Propofol 1-2mg/kg OR Ketamine 1.5mg/kg OR Etomidate 0.3mg/kg IV",
        criticalStep: true,
      },
      {
        step: 4,
        action: "Paralysis",
        detail:
          "Immediately after induction: Succinylcholine 1.5mg/kg OR Rocuronium 1.2mg/kg IV",
        criticalStep: true,
      },
      {
        step: 5,
        action: "Wait for paralysis",
        detail:
          "Succinylcholine: 45-60 sec. Rocuronium: 60-90 sec. Do NOT attempt intubation before full paralysis",
        criticalStep: false,
      },
      {
        step: 6,
        action: "Laryngoscopy & intubation",
        detail:
          "Insert laryngoscope, visualize cords, pass ETT through cords until cuff 2-3cm past cords. Single best attempt in <30 sec",
        criticalStep: true,
      },
      {
        step: 7,
        action: "Confirm placement",
        detail:
          "End-tidal CO2 (GOLD STANDARD), bilateral chest auscultation, misting in tube, SpO2 improvement, CXR",
        criticalStep: true,
      },
      {
        step: 8,
        action: "Secure tube",
        detail:
          "Note depth at teeth (typically 21-23cm for adult male). Secure with tape or commercial holder. Post-intubation sedation",
        criticalStep: false,
      },
    ],
    complications: [
      "Esophageal intubation (most dangerous — check ETCO2)",
      "Right mainstem bronchus intubation (too deep)",
      "Hypotension (induction agents)",
      "Aspiration",
      "Dental/mucosal trauma",
      "Failed airway (cannot intubate/cannot oxygenate)",
    ],
    postProcedureCare: [
      "Confirm ETT position on CXR (tip 2-4cm above carina)",
      "Set ventilator: tidal volume 6-8 mL/kg ideal body weight",
      "Continuous sedation and analgesia",
      "Elevate head of bed 30 degrees",
      "NG/OG tube for gastric decompression",
    ],
  },
  {
    id: "chest-drain",
    name: "Chest Drain (Intercostal Drain / Tube Thoracostomy)",
    category: "Thoracic Procedure",
    indications: [
      "Pneumothorax (traumatic or spontaneous >2cm)",
      "Hemothorax",
      "Empyema / parapneumonic effusion",
      "Post tension pneumothorax decompression",
    ],
    contraindications: [
      "No absolute contraindications in emergency",
      "Relative: coagulopathy, known adhesions, diaphragmatic hernia",
    ],
    equipment: [
      "Chest drain (24-32Fr adult, 12-20Fr pediatric)",
      "Sterile drape, gown, gloves",
      "Local anesthetic (lidocaine 1-2%)",
      "Scalpel (#10 blade)",
      "Large curved clamp (Kelly/Roberts)",
      "Suture (1-0 silk)",
      "Underwater seal drainage system",
      "Sterile dressing",
    ],
    steps: [
      {
        step: 1,
        action: "Identify insertion site",
        detail:
          "Safe triangle: 4th-5th intercostal space, anterior axillary line to mid-axillary line. Mark with pen",
        criticalStep: true,
      },
      {
        step: 2,
        action: "Prepare and drape",
        detail:
          "Sterile technique. Position patient semi-recumbent with arm abducted on affected side",
        criticalStep: false,
      },
      {
        step: 3,
        action: "Local anesthesia",
        detail:
          "Infiltrate skin, subcutaneous tissue, and parietal pleura with lidocaine. Always aspirate before injecting (avoid intercostal vessels)",
        criticalStep: false,
      },
      {
        step: 4,
        action: "Incision",
        detail:
          "2-3cm incision along the UPPER border of the rib (neurovascular bundle runs along lower border)",
        criticalStep: true,
      },
      {
        step: 5,
        action: "Blunt dissection",
        detail:
          "Dissect through intercostal muscles with Kelly clamp. Pop through parietal pleura. Sweep finger inside to clear adhesions",
        criticalStep: true,
      },
      {
        step: 6,
        action: "Insert drain",
        detail:
          "Guide drain posteriorly and apically (pneumothorax) or posteriorly and basally (effusion). Advance until all holes within pleural space",
        criticalStep: true,
      },
      {
        step: 7,
        action: "Connect and secure",
        detail:
          "Connect to underwater seal. Confirm swing and bubbling. Suture drain in place. Apply dressing",
        criticalStep: false,
      },
    ],
    complications: [
      "Injury to intercostal artery (insert above rib)",
      "Lung laceration",
      "Subcutaneous placement (not in pleural space)",
      "Infection / empyema",
      "Re-expansion pulmonary edema (rapid large volume drainage)",
      "Diaphragmatic injury (too low insertion)",
    ],
    postProcedureCare: [
      "CXR to confirm position and lung re-expansion",
      "Daily drain output monitoring",
      "Never clamp chest drain in transit (tension pneumothorax risk)",
      "Remove when <200mL/24h output and lung expanded, no air leak for 24h",
    ],
  },
  {
    id: "needle-decompression",
    name: "Needle Thoracostomy (Tension Pneumothorax Decompression)",
    category: "Emergency Thoracic Procedure",
    indications: [
      "Clinical diagnosis of tension pneumothorax",
      "Cardiac arrest with suspected tension pneumothorax",
    ],
    contraindications: ["No absolute contraindications in emergency"],
    equipment: [
      "14G or 16G IV cannula (minimum 5cm length for adults)",
      "10mL syringe",
      "Antiseptic swab",
    ],
    steps: [
      {
        step: 1,
        action: "Identify landmarks",
        detail:
          "2nd intercostal space, mid-clavicular line on affected side. Alternative: 4th-5th ICS, mid-axillary line (preferred in some guidelines — less muscle/fat)",
        criticalStep: true,
      },
      {
        step: 2,
        action: "Prepare",
        detail: "Attach syringe to cannula. Quick swab if time permits",
        criticalStep: false,
      },
      {
        step: 3,
        action: "Insert cannula",
        detail:
          "Insert perpendicular to chest wall, ABOVE the rib. Advance until rush of air / syringe plunger pushed back. Remove needle, leave cannula in situ",
        criticalStep: true,
      },
      {
        step: 4,
        action: "Definitive management",
        detail:
          "This is a TEMPORIZING measure. Must proceed to chest drain (tube thoracostomy) as definitive treatment",
        criticalStep: true,
      },
    ],
    complications: [
      "Failure to decompress (cannula too short, wrong diagnosis)",
      "Pneumothorax if no prior pneumothorax",
      "Local hematoma",
      "Cardiac tamponade (very rare, if aim too medially)",
    ],
    postProcedureCare: [
      "Insert formal chest drain as soon as possible",
      "Monitor for recurrence of tension",
      "CXR after chest drain insertion",
    ],
  },
];

// ============================================
// RESUSCITATION ALGORITHMS
// ============================================

export interface AlgorithmStep {
  id: string;
  label: string;
  detail: string;
  nextSteps: { condition: string; targetId: string }[];
}

export interface ResuscitationAlgorithm {
  id: string;
  name: string;
  source: string;
  description: string;
  steps: AlgorithmStep[];
}

export const RESUSCITATION_ALGORITHMS: ResuscitationAlgorithm[] = [
  {
    id: "acls-cardiac-arrest",
    name: "ACLS Cardiac Arrest Algorithm",
    source: "AHA ACLS 2020",
    description:
      "Systematic approach to adult cardiac arrest management for shockable and non-shockable rhythms",
    steps: [
      {
        id: "start",
        label: "Start CPR",
        detail:
          "Give O2, attach monitor/defibrillator. Push hard (5-6cm), push fast (100-120/min). Minimize interruptions.",
        nextSteps: [{ condition: "Rhythm check", targetId: "rhythm-check" }],
      },
      {
        id: "rhythm-check",
        label: "Check Rhythm",
        detail:
          "Is the rhythm shockable? VF = chaotic, irregular. pVT = wide complex, organized. PEA = organized rhythm but no pulse. Asystole = flatline.",
        nextSteps: [
          { condition: "VF / pVT (shockable)", targetId: "shock" },
          {
            condition: "PEA / Asystole (non-shockable)",
            targetId: "non-shockable",
          },
        ],
      },
      {
        id: "shock",
        label: "Defibrillate",
        detail:
          "120-200J biphasic (or max if unknown). Resume CPR immediately for 2 min. Access IV/IO.",
        nextSteps: [{ condition: "After 2 min CPR", targetId: "rhythm-2" }],
      },
      {
        id: "rhythm-2",
        label: "Rhythm Check #2",
        detail: "Check rhythm after 2 minutes of CPR.",
        nextSteps: [
          {
            condition: "Still shockable",
            targetId: "shock-2-epi",
          },
          { condition: "Non-shockable", targetId: "non-shockable" },
          { condition: "ROSC", targetId: "rosc" },
        ],
      },
      {
        id: "shock-2-epi",
        label: "Shock + Epinephrine",
        detail:
          "Defibrillate again. Resume CPR. Give Epinephrine 1mg IV/IO. Repeat epi q3-5min.",
        nextSteps: [{ condition: "After 2 min CPR", targetId: "rhythm-3" }],
      },
      {
        id: "rhythm-3",
        label: "Rhythm Check #3",
        detail: "Check rhythm after 2 min CPR.",
        nextSteps: [
          { condition: "Still shockable", targetId: "shock-3-amio" },
          { condition: "Non-shockable", targetId: "non-shockable" },
          { condition: "ROSC", targetId: "rosc" },
        ],
      },
      {
        id: "shock-3-amio",
        label: "Shock + Amiodarone",
        detail:
          "Defibrillate. Resume CPR. Give Amiodarone 300mg IV/IO. Continue epi q3-5min. Consider advanced airway. Treat reversible causes (H's and T's).",
        nextSteps: [
          {
            condition: "After 2 min CPR",
            targetId: "rhythm-check",
          },
        ],
      },
      {
        id: "non-shockable",
        label: "PEA / Asystole Pathway",
        detail:
          "CPR 2 min. Epinephrine 1mg ASAP, then q3-5min. Advanced airway. Treat reversible causes (H's and T's).",
        nextSteps: [
          {
            condition: "After 2 min CPR",
            targetId: "rhythm-check",
          },
          { condition: "ROSC", targetId: "rosc" },
        ],
      },
      {
        id: "rosc",
        label: "Return of Spontaneous Circulation (ROSC)",
        detail:
          "Post-cardiac arrest care: 12-lead ECG, targeted temperature management (32-36°C), PCI if STEMI, optimize ventilation (SpO2 92-98%, ETCO2 35-45), treat cause.",
        nextSteps: [],
      },
    ],
  },
  {
    id: "anaphylaxis-algorithm",
    name: "Anaphylaxis Management Algorithm",
    source: "World Allergy Organization / Resuscitation Council UK",
    description:
      "Step-by-step approach to acute anaphylaxis management",
    steps: [
      {
        id: "recognize",
        label: "Recognize Anaphylaxis",
        detail:
          "Sudden onset (minutes to hours) of: Skin/mucosal (urticaria, angioedema) + respiratory (wheeze, stridor) and/or cardiovascular compromise (hypotension, tachycardia). Can occur without skin findings.",
        nextSteps: [{ condition: "Confirmed/suspected", targetId: "epi" }],
      },
      {
        id: "epi",
        label: "Epinephrine IM (FIRST-LINE)",
        detail:
          "Adult: 0.5mg IM (1:1000) anterolateral thigh. Child: 0.01mg/kg (max 0.3mg). Repeat q5-15min if needed.",
        nextSteps: [
          { condition: "After epinephrine", targetId: "position" },
        ],
      },
      {
        id: "position",
        label: "Position Patient",
        detail:
          "Supine with legs elevated IF hypotensive. Sitting up IF respiratory distress. Recovery position IF vomiting/unconscious.",
        nextSteps: [{ condition: "Next", targetId: "support" }],
      },
      {
        id: "support",
        label: "Supportive Care",
        detail:
          "High-flow O2. IV access. Fluid bolus 20 mL/kg NS if hypotensive. Remove trigger if possible.",
        nextSteps: [{ condition: "Next", targetId: "adjuncts" }],
      },
      {
        id: "adjuncts",
        label: "Adjunctive Medications",
        detail:
          "Antihistamine (cetirizine 10mg or diphenhydramine 50mg IV). Hydrocortisone 200mg IV (prevents biphasic). Nebulized salbutamol for bronchospasm.",
        nextSteps: [{ condition: "Next", targetId: "observe" }],
      },
      {
        id: "observe",
        label: "Observation",
        detail:
          "Minimum 6-8h observation for biphasic reaction. 24h if severe or required >1 dose epinephrine. Discharge with EpiPen prescription and allergy referral.",
        nextSteps: [],
      },
    ],
  },
];

// ============================================
// ASSESSMENT MNEMONICS & TOOLS
// ============================================

export interface AssessmentMnemonic {
  id: string;
  name: string;
  fullName: string;
  purpose: string;
  components: { letter: string; meaning: string; detail: string }[];
}

export const ASSESSMENT_MNEMONICS: AssessmentMnemonic[] = [
  {
    id: "abcde",
    name: "ABCDE",
    fullName: "Airway, Breathing, Circulation, Disability, Exposure",
    purpose:
      "Systematic approach to assess and manage critically ill patients. Used in all emergencies.",
    components: [
      {
        letter: "A",
        meaning: "Airway",
        detail:
          "Look: chest rise, accessory muscles. Listen: stridor, gurgling, snoring. Feel: air movement. Actions: head tilt-chin lift, jaw thrust, suction, OPA/NPA, intubation if needed. C-spine protection in trauma.",
      },
      {
        letter: "B",
        meaning: "Breathing",
        detail:
          "RR, SpO2, work of breathing, auscultation, percussion, tracheal position. Actions: O2, BVM, chest drain for pneumothorax, nebulizers for bronchospasm.",
      },
      {
        letter: "C",
        meaning: "Circulation",
        detail:
          "HR, BP, CRT, skin color/temp, JVP, urine output, ECG. Actions: IV access (x2 large bore), fluid bolus, vasopressors, hemorrhage control, blood products.",
      },
      {
        letter: "D",
        meaning: "Disability",
        detail:
          "GCS/AVPU, pupil size/reactivity, blood glucose, lateralizing signs, posturing. Actions: treat hypoglycemia, naloxone for opioid OD, anticonvulsants for seizure.",
      },
      {
        letter: "E",
        meaning: "Exposure",
        detail:
          "Fully expose patient (maintain dignity/warmth). Temperature. Head-to-toe examination. Rashes, wounds, injection marks, medical alert bracelets. Log roll for posterior exam in trauma.",
      },
    ],
  },
  {
    id: "sample",
    name: "SAMPLE",
    fullName:
      "Signs/Symptoms, Allergies, Medications, Past history, Last intake, Events",
    purpose:
      "Focused patient history-taking mnemonic for emergency situations.",
    components: [
      {
        letter: "S",
        meaning: "Signs & Symptoms",
        detail:
          "What happened? When did it start? Onset sudden or gradual? Associated symptoms? Pain (use OPQRST)?",
      },
      {
        letter: "A",
        meaning: "Allergies",
        detail:
          "Medications, food, latex, contrast dye, environmental. Specify reaction type (anaphylaxis vs rash vs GI).",
      },
      {
        letter: "M",
        meaning: "Medications",
        detail:
          "Current prescribed, OTC, supplements, recreational drugs. Compliance? Recent changes? Anticoagulants are critical to document.",
      },
      {
        letter: "P",
        meaning: "Past Medical History",
        detail:
          "Previous illnesses, surgeries, hospitalizations. Relevant family history. Pregnancy status in women of childbearing age.",
      },
      {
        letter: "L",
        meaning: "Last Oral Intake",
        detail:
          "Last meal/drink (timing and content). Important for aspiration risk and surgical planning. NPO status.",
      },
      {
        letter: "E",
        meaning: "Events Leading Up",
        detail:
          "What was happening before the incident? Mechanism of injury? Progression of symptoms? Witnessed event details.",
      },
    ],
  },
  {
    id: "opqrst",
    name: "OPQRST",
    fullName:
      "Onset, Provocation, Quality, Radiation, Severity, Time",
    purpose: "Systematic pain assessment mnemonic.",
    components: [
      {
        letter: "O",
        meaning: "Onset",
        detail:
          "When did the pain start? Sudden or gradual? What were you doing? First episode or recurrent?",
      },
      {
        letter: "P",
        meaning: "Provocation / Palliation",
        detail:
          "What makes it worse? What makes it better? Position changes? Deep breathing? Movement? Medications tried?",
      },
      {
        letter: "Q",
        meaning: "Quality",
        detail:
          "Describe the pain: sharp, dull, burning, crushing, tearing, stabbing, cramping, pressure?",
      },
      {
        letter: "R",
        meaning: "Radiation",
        detail:
          "Does it spread anywhere? MI: left arm/jaw. Aortic dissection: between shoulder blades. Renal colic: groin.",
      },
      {
        letter: "S",
        meaning: "Severity",
        detail:
          "Rate 0-10 scale. What is it now vs at worst? Comparison to previous pain episodes?",
      },
      {
        letter: "T",
        meaning: "Time / Temporal",
        detail:
          "How long has it lasted? Constant or intermittent? Getting better, worse, or staying the same? Any pattern?",
      },
    ],
  },
  {
    id: "sbar",
    name: "SBAR",
    fullName: "Situation, Background, Assessment, Recommendation",
    purpose:
      "Structured communication tool for clinical handoff and escalation.",
    components: [
      {
        letter: "S",
        meaning: "Situation",
        detail:
          "I am calling about [patient name], [age], in [location]. The problem is [brief description of current concern].",
      },
      {
        letter: "B",
        meaning: "Background",
        detail:
          "Admitted for [diagnosis]. Relevant history: [key points]. Current treatment: [relevant meds/interventions]. Recent changes: [what's different].",
      },
      {
        letter: "A",
        meaning: "Assessment",
        detail:
          "I think the problem is [your clinical assessment]. Vital signs are [key vitals]. The patient is [stable/unstable]. NEWS2 score is [X].",
      },
      {
        letter: "R",
        meaning: "Recommendation",
        detail:
          "I recommend [specific action needed]. I need you to [clear request]. Is there anything else I should do? When should I call back?",
      },
    ],
  },
];

// ============================================
// DIFFERENTIAL DIAGNOSES BY PRESENTATION
// ============================================

export interface DifferentialDiagnosis {
  presentation: string;
  scenarioIds: string[];
  differentials: {
    condition: string;
    likelihood: "high" | "moderate" | "low";
    keyFeatures: string[];
    ruledOutBy: string[];
  }[];
}

export const DIFFERENTIAL_DIAGNOSES: DifferentialDiagnosis[] = [
  {
    presentation: "Chest Pain",
    scenarioIds: ["mi", "cardiac-arrest"],
    differentials: [
      {
        condition: "Acute Coronary Syndrome (STEMI/NSTEMI)",
        likelihood: "high",
        keyFeatures: [
          "Crushing/pressure chest pain",
          "Radiation to arm/jaw",
          "Diaphoresis",
          "ECG changes",
          "Troponin elevation",
        ],
        ruledOutBy: [
          "Normal serial ECGs",
          "Normal serial troponins (6h+)",
          "Pleuritic quality (suggests PE/pneumothorax)",
        ],
      },
      {
        condition: "Pulmonary Embolism",
        likelihood: "moderate",
        keyFeatures: [
          "Sudden dyspnea",
          "Pleuritic pain",
          "Tachycardia",
          "Risk factors (immobility, surgery, OCP)",
          "D-dimer elevation",
        ],
        ruledOutBy: [
          "Low Wells score + negative D-dimer",
          "Normal CTPA",
        ],
      },
      {
        condition: "Aortic Dissection",
        likelihood: "low",
        keyFeatures: [
          "Tearing pain radiating to back",
          "BP differential between arms",
          "Widened mediastinum on CXR",
          "New aortic regurgitation murmur",
        ],
        ruledOutBy: [
          "Normal CT aortogram",
          "No BP differential",
          "Gradual onset (dissection is sudden)",
        ],
      },
      {
        condition: "Tension Pneumothorax",
        likelihood: "moderate",
        keyFeatures: [
          "Sudden pleuritic pain + dyspnea",
          "Absent breath sounds unilaterally",
          "Tracheal deviation",
          "Hypotension + distended neck veins",
        ],
        ruledOutBy: [
          "Equal bilateral breath sounds",
          "Normal CXR",
          "Gradual onset",
        ],
      },
    ],
  },
  {
    presentation: "Altered Consciousness",
    scenarioIds: ["stroke", "dka", "overdose", "peds-seizure"],
    differentials: [
      {
        condition: "Stroke (Ischemic or Hemorrhagic)",
        likelihood: "high",
        keyFeatures: [
          "Focal neurological deficit",
          "Sudden onset",
          "Lateralizing signs",
          "NIHSS abnormal",
        ],
        ruledOutBy: [
          "Normal CT and MRI",
          "Symmetric deficits",
          "Metabolic cause identified",
        ],
      },
      {
        condition: "Hypoglycemia",
        likelihood: "high",
        keyFeatures: [
          "Glucose < 3.3 mmol/L",
          "Diaphoresis",
          "Tremor",
          "Rapid response to dextrose",
          "Diabetes/insulin history",
        ],
        ruledOutBy: ["Normal blood glucose"],
      },
      {
        condition: "Opioid Overdose",
        likelihood: "moderate",
        keyFeatures: [
          "Pinpoint pupils",
          "Respiratory depression (RR < 8)",
          "Needle marks",
          "Response to naloxone",
        ],
        ruledOutBy: [
          "Normal pupils",
          "No response to naloxone",
          "No exposure history",
        ],
      },
      {
        condition: "DKA / HHS",
        likelihood: "moderate",
        keyFeatures: [
          "Kussmaul breathing",
          "Fruity breath",
          "Glucose > 14 mmol/L",
          "Ketones present",
          "High anion gap",
        ],
        ruledOutBy: ["Normal glucose", "Normal anion gap", "Normal ketones"],
      },
    ],
  },
  {
    presentation: "Seizure",
    scenarioIds: ["peds-seizure", "eclampsia"],
    differentials: [
      {
        condition: "Febrile Seizure (Pediatric)",
        likelihood: "high",
        keyFeatures: [
          "Age 6 months - 5 years",
          "Temperature > 38°C",
          "Generalized tonic-clonic",
          "Duration < 15 min",
          "No focal features",
        ],
        ruledOutBy: [
          "Age > 6 years",
          "Afebrile",
          "Focal features",
          "Prolonged (>15 min = complex)",
        ],
      },
      {
        condition: "Eclampsia",
        likelihood: "high",
        keyFeatures: [
          "Pregnant >20 weeks or postpartum",
          "Hypertension (>140/90)",
          "Proteinuria",
          "Edema",
          "Headache/visual changes preceding seizure",
        ],
        ruledOutBy: [
          "Not pregnant",
          "Normal BP",
          "No proteinuria",
        ],
      },
      {
        condition: "Hypoglycemia",
        likelihood: "moderate",
        keyFeatures: [
          "Glucose < 2.6 mmol/L",
          "Rapid improvement with dextrose",
          "Diabetes history",
        ],
        ruledOutBy: ["Normal glucose at time of seizure"],
      },
      {
        condition: "Meningitis/Encephalitis",
        likelihood: "moderate",
        keyFeatures: [
          "Fever",
          "Neck stiffness",
          "Photophobia",
          "Rash (meningococcal)",
          "Altered consciousness",
        ],
        ruledOutBy: ["Normal CSF", "No meningism", "Afebrile"],
      },
    ],
  },
  {
    presentation: "Respiratory Distress",
    scenarioIds: ["asthma", "anaphylaxis", "trauma"],
    differentials: [
      {
        condition: "Asthma Exacerbation",
        likelihood: "high",
        keyFeatures: [
          "Known asthma history",
          "Wheeze",
          "Prolonged expiration",
          "Trigger exposure",
          "Response to bronchodilators",
        ],
        ruledOutBy: [
          "No wheeze or bronchospasm",
          "No response to SABA",
          "Inspiratory stridor (suggests upper airway)",
        ],
      },
      {
        condition: "Anaphylaxis",
        likelihood: "moderate",
        keyFeatures: [
          "Allergen exposure",
          "Urticaria/angioedema",
          "Stridor (laryngeal edema)",
          "Hypotension",
          "Multi-system involvement",
        ],
        ruledOutBy: [
          "No allergen exposure",
          "No skin/mucosal findings",
          "Isolated respiratory symptoms",
        ],
      },
      {
        condition: "Pneumothorax",
        likelihood: "moderate",
        keyFeatures: [
          "Sudden onset",
          "Unilateral reduced breath sounds",
          "Pleuritic pain",
          "Trauma history or tall/thin habitus",
        ],
        ruledOutBy: [
          "Equal bilateral breath sounds",
          "Normal CXR",
        ],
      },
    ],
  },
  {
    presentation: "Hypotension / Shock",
    scenarioIds: ["sepsis", "trauma", "anaphylaxis", "cardiac-arrest"],
    differentials: [
      {
        condition: "Hypovolemic Shock (Hemorrhagic)",
        likelihood: "high",
        keyFeatures: [
          "Visible bleeding or trauma mechanism",
          "Tachycardia",
          "Cold, clammy extremities",
          "Positive FAST",
          "Dropping hemoglobin",
        ],
        ruledOutBy: [
          "No source of bleeding",
          "Warm peripheries (suggests distributive)",
        ],
      },
      {
        condition: "Septic Shock (Distributive)",
        likelihood: "high",
        keyFeatures: [
          "Fever or hypothermia",
          "Source of infection",
          "Warm peripheries initially",
          "Elevated lactate",
          "WBC abnormality",
        ],
        ruledOutBy: [
          "No evidence of infection",
          "Cold peripheries from onset",
        ],
      },
      {
        condition: "Cardiogenic Shock",
        likelihood: "moderate",
        keyFeatures: [
          "JVP elevated",
          "Pulmonary edema (crackles)",
          "Known cardiac history",
          "ECG changes",
          "Poor response to fluids",
        ],
        ruledOutBy: [
          "Good response to fluids",
          "Normal echo/cardiac function",
        ],
      },
      {
        condition: "Anaphylactic Shock (Distributive)",
        likelihood: "moderate",
        keyFeatures: [
          "Allergen exposure",
          "Urticaria, angioedema",
          "Bronchospasm",
          "Rapid onset",
          "Response to epinephrine",
        ],
        ruledOutBy: [
          "No allergen exposure",
          "No skin/respiratory involvement",
        ],
      },
    ],
  },
  {
    presentation: "ST Elevation with Chest Pain",
    scenarioIds: ["mi", "dengue-myocarditis", "cardiac-arrest"],
    differentials: [
      {
        condition: "STEMI (Acute MI)",
        likelihood: "high",
        keyFeatures: [
          "Crushing chest pain with radiation",
          "ST elevation in contiguous leads with reciprocal depression",
          "Elevated troponin with rising pattern",
          "Risk factors: age, smoking, diabetes, hypertension, family history",
        ],
        ruledOutBy: [
          "Normal coronary angiography",
          "Diffuse ST elevation without reciprocal changes",
          "Young patient without cardiac risk factors",
        ],
      },
      {
        condition: "Acute Myocarditis",
        likelihood: "moderate",
        keyFeatures: [
          "Recent viral illness (1-4 weeks prior)",
          "Diffuse ST elevation (multiple territories)",
          "Elevated troponin but normal CPK ratio",
          "Pericardial friction rub",
          "Cardiac MRI: subepicardial/mid-wall LGE",
        ],
        ruledOutBy: [
          "Coronary occlusion on angiography",
          "No preceding illness",
          "Subendocardial LGE pattern on MRI (ischemic)",
        ],
      },
      {
        condition: "Acute Pericarditis",
        likelihood: "moderate",
        keyFeatures: [
          "Diffuse concave ST elevation",
          "PR depression",
          "Pericardial friction rub",
          "Pleuritic chest pain (worse with inspiration, better leaning forward)",
          "Pericardial effusion on echo",
        ],
        ruledOutBy: [
          "Reciprocal ST depression (suggests MI)",
          "Rising troponin (suggests myo- not just pericarditis)",
          "Regional wall motion abnormality (suggests MI)",
        ],
      },
      {
        condition: "Dengue Myopericarditis",
        likelihood: "low",
        keyFeatures: [
          "Recent dengue infection (confirmed serology)",
          "Travel to endemic region",
          "Prodromal fever, retro-orbital pain, arthralgias",
          "ST elevation with pericardial rub",
          "Normal coronary angiography",
          "Cardiac MRI with non-ischemic LGE pattern",
        ],
        ruledOutBy: [
          "No dengue exposure or travel history",
          "Negative dengue serology",
          "Coronary occlusion on angiography",
        ],
      },
    ],
  },
];

// ============================================
// LOOKUP FUNCTIONS
// ============================================

export function getDrugInfo(drugName: string): DrugDosing | undefined {
  const lower = drugName.toLowerCase();
  return DRUG_DOSING_REFERENCE.find(
    (d) =>
      d.genericName.toLowerCase().includes(lower) ||
      d.name.toLowerCase().includes(lower),
  );
}

export function getDrugsByCategory(category: string): DrugDosing[] {
  const lower = category.toLowerCase();
  return DRUG_DOSING_REFERENCE.filter((d) =>
    d.category.toLowerCase().includes(lower),
  );
}

export function getProcedure(procedureId: string): ClinicalProcedure | undefined {
  return CLINICAL_PROCEDURES.find((p) => p.id === procedureId);
}

export function getAlgorithm(algorithmId: string): ResuscitationAlgorithm | undefined {
  return RESUSCITATION_ALGORITHMS.find((a) => a.id === algorithmId);
}

export function getMnemonic(mnemonicId: string): AssessmentMnemonic | undefined {
  return ASSESSMENT_MNEMONICS.find((m) => m.id === mnemonicId);
}

export function getDifferentialsForPresentation(
  presentation: string,
): DifferentialDiagnosis | undefined {
  const lower = presentation.toLowerCase();
  return DIFFERENTIAL_DIAGNOSES.find((d) =>
    d.presentation.toLowerCase().includes(lower),
  );
}

export function getDifferentialsForScenario(
  scenarioId: string,
): DifferentialDiagnosis[] {
  // Extract base condition from scenario ID (e.g., "stroke-58m" → "stroke")
  const base = scenarioId.replace(/-\d+[mf]$/i, "");
  return DIFFERENTIAL_DIAGNOSES.filter(
    (d) =>
      d.scenarioIds.includes(scenarioId) || d.scenarioIds.includes(base),
  );
}
