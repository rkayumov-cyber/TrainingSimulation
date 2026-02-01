import type {
  ContextualSuggestion,
  ClinicalGuideline,
} from "../../types/enhanced";

// Built-in clinical guidelines
export const CLINICAL_GUIDELINES: ClinicalGuideline[] = [
  {
    id: "sepsis-bundle",
    condition: "sepsis",
    keyActions: [
      "Measure lactate level",
      "Obtain blood cultures before antibiotics",
      "Administer broad-spectrum antibiotics within 1 hour",
      "Begin fluid resuscitation with 30mL/kg crystalloid",
      "Apply supplemental oxygen if SpO2 < 94%",
    ],
    sequenceRecommendations: [
      "Blood cultures should be drawn BEFORE antibiotics to improve yield",
      "Lactate should be measured within 3 hours of presentation",
      "Reassess volume status and repeat lactate if initial lactate elevated",
    ],
    contraindications: [
      "Avoid excessive fluids if signs of volume overload",
      "Consider source control early (drain abscesses, remove infected devices)",
    ],
    source: "Surviving Sepsis Campaign 2021",
  },
  {
    id: "mi-management",
    condition: "mi",
    keyActions: [
      "Obtain 12-lead ECG within 10 minutes",
      "Aspirin 325mg chewed immediately",
      "Nitroglycerin for chest pain (avoid if hypotensive)",
      "Morphine for pain unrelieved by nitro",
      "Serial troponins",
      "Anticoagulation per protocol",
    ],
    sequenceRecommendations: [
      "ECG should be first diagnostic test",
      "Aspirin should be given as soon as MI suspected",
      "Door-to-balloon time goal < 90 minutes for STEMI",
    ],
    contraindications: [
      "Avoid nitrates if systolic BP < 90 or suspected right ventricular MI",
      "Avoid beta-blockers if heart failure signs present acutely",
    ],
    source: "AHA/ACC STEMI Guidelines 2021",
  },
  {
    id: "anaphylaxis-management",
    condition: "anaphylaxis",
    keyActions: [
      "Epinephrine IM 0.3-0.5mg (mid-lateral thigh) FIRST",
      "Call for help and prepare for airway management",
      "High-flow oxygen",
      "IV access and fluid bolus",
      "Antihistamines (second-line)",
      "Steroids (prevent biphasic reaction)",
    ],
    sequenceRecommendations: [
      "EPINEPHRINE IS FIRST-LINE - do not delay for antihistamines",
      "Repeat epinephrine every 5-15 minutes if needed",
      "Position patient supine with legs elevated (unless respiratory distress)",
    ],
    contraindications: [
      "Do not rely on antihistamines alone - they are adjunctive only",
      "IV epinephrine only if IM fails and patient in shock",
    ],
    source: "World Allergy Organization Guidelines 2020",
  },
  {
    id: "asthma-exacerbation",
    condition: "asthma",
    keyActions: [
      "Supplemental oxygen to maintain SpO2 > 92%",
      "Inhaled SABA (albuterol) - can repeat every 20 minutes x3",
      "Ipratropium if severe",
      "Systemic corticosteroids early",
      "Consider magnesium sulfate if severe",
    ],
    sequenceRecommendations: [
      "Beta-agonists should be first-line bronchodilator",
      "Steroids should be given within first hour",
      "Check peak flow before and after treatment",
    ],
    contraindications: [
      "Avoid sedatives which may cause respiratory depression",
      "Chest X-ray not routinely needed unless complications suspected",
    ],
    source: "GINA Guidelines 2023",
  },
  {
    id: "stroke-management",
    condition: "stroke",
    keyActions: [
      "Perform NIHSS assessment immediately",
      "Order CT head (non-contrast) within 20 minutes of arrival",
      "Check blood glucose (exclude hypoglycemia as stroke mimic)",
      "Order coagulation studies (PT/INR) before thrombolysis",
      "CT angiography to identify large vessel occlusion",
      "Administer IV alteplase (tPA) within 4.5 hours of onset if eligible",
      "BP management: labetalol if >185/110 pre-tPA, <180/105 post-tPA",
      "Establish IV access — avoid dextrose-containing fluids",
    ],
    sequenceRecommendations: [
      "CT head must be obtained and read BEFORE tPA administration",
      "Blood glucose check before CT — hypoglycemia mimics stroke",
      "Coagulation studies must result before tPA (INR < 1.7)",
      "NIHSS score documents baseline severity and guides treatment",
      "Door-to-needle time goal < 60 minutes for IV tPA",
    ],
    contraindications: [
      "tPA contraindicated if: onset >4.5h, INR >1.7, platelets <100k, recent surgery/trauma",
      "Avoid aggressive BP lowering beyond targets — risk of watershed infarction",
      "Do NOT give anticoagulants within 24 hours of tPA",
      "Avoid hypotonic or dextrose-containing IV fluids (worsen edema)",
    ],
    source: "AHA/ASA Acute Ischemic Stroke Guidelines 2019",
  },
  {
    id: "dka-management",
    condition: "dka",
    keyActions: [
      "Check blood glucose immediately",
      "Order basic metabolic panel (electrolytes, creatinine, BUN)",
      "Order ABG/VBG for acid-base status",
      "Check urine ketones or serum beta-hydroxybutyrate",
      "Aggressive IV fluid resuscitation: 1-1.5L NS in first hour",
      "Start insulin drip at 0.1 units/kg/hr (AFTER fluids and K+ check)",
      "Monitor potassium — replace if K+ < 5.3 before starting insulin",
      "Establish IV access and continuous monitoring",
      "Order CBC to evaluate for infection trigger",
    ],
    sequenceRecommendations: [
      "FLUIDS FIRST — begin resuscitation before insulin",
      "Check potassium BEFORE starting insulin — hypokalemia risk is lethal",
      "If K+ < 3.3: hold insulin, aggressively replace potassium",
      "If K+ 3.3-5.3: give 20-40 mEq K+ in each liter of IV fluid + start insulin",
      "If K+ > 5.3: start insulin, recheck K+ in 2 hours",
      "Switch to dextrose-containing fluids when glucose < 14 mmol/L (250 mg/dL)",
    ],
    contraindications: [
      "NEVER start insulin before checking potassium — can cause fatal arrhythmia",
      "Avoid bolus insulin — use continuous infusion only in DKA",
      "Do not correct sodium for hyperglycemia until glucose normalizing",
      "Avoid bicarbonate unless pH < 6.9 (may worsen intracellular acidosis)",
      "Do not stop insulin drip until anion gap closes, even if glucose normalizes",
    ],
    source: "ADA Diabetes Care: DKA Management Guidelines 2023",
  },
  {
    id: "trauma-management",
    condition: "trauma",
    keyActions: [
      "A: Assess airway with cervical spine protection",
      "B: Administer high-flow oxygen, check lung sounds bilaterally",
      "C: Establish large-bore IV access x2, start fluid resuscitation",
      "Insert chest drain for pneumothorax",
      "Order FAST scan (Focused Assessment with Sonography in Trauma)",
      "Order pelvic X-ray if mechanism suggests pelvic injury",
      "Check GCS (Glasgow Coma Scale) for neurological status",
      "Order blood type and crossmatch for massive transfusion protocol",
      "Fluid bolus — warm crystalloid, then switch to blood products",
      "Apply pelvic binder if pelvic fracture suspected",
    ],
    sequenceRecommendations: [
      "Follow ATLS primary survey: A-B-C-D-E in strict order",
      "Airway is ALWAYS first — secure before addressing circulation",
      "Life-threatening injuries (tension pneumothorax, massive hemorrhage) treated during primary survey",
      "FAST scan during C assessment — identifies free fluid requiring surgery",
      "Pelvic binder BEFORE fluids if pelvic fracture suspected (reduce bleeding)",
      "Massive transfusion protocol: 1:1:1 ratio (pRBC:FFP:platelets)",
    ],
    contraindications: [
      "Avoid excessive crystalloid — permissive hypotension (target SBP 80-90) in penetrating trauma",
      "Do not remove impaled objects — stabilize in place",
      "Avoid nasogastric tube if suspected base of skull fracture (use orogastric)",
      "Do not delay surgical consult for complete workup if hemodynamically unstable",
    ],
    source: "ATLS 10th Edition, American College of Surgeons 2018",
  },
  {
    id: "peds-seizure-management",
    condition: "peds-seizure",
    keyActions: [
      "Protect airway — position on side (recovery position)",
      "Administer high-flow oxygen",
      "Check blood glucose immediately (hypoglycemia causes seizures)",
      "Administer benzodiazepine: diazepam 0.2-0.5 mg/kg IV/PR or midazolam IM/IN",
      "Establish IV access (may need IO if IV fails)",
      "Give antipyretic if febrile (paracetamol/ibuprofen)",
      "Order CBC and BMP to evaluate for infection and metabolic cause",
      "Note seizure duration — status epilepticus if >5 minutes",
    ],
    sequenceRecommendations: [
      "ABCs first — airway protection before medication",
      "Benzodiazepine is FIRST-LINE anti-seizure medication",
      "If seizure continues >5 min after first benzo: repeat dose",
      "If seizure continues >10 min: second-line agent (phenytoin 20mg/kg or levetiracetam)",
      "Check glucose early — treat with dextrose 0.5-1g/kg if low",
      "After seizure stops: full neurological assessment and temperature management",
    ],
    contraindications: [
      "Do NOT restrain the child during seizure",
      "Do NOT put anything in the mouth",
      "Avoid phenytoin in infants < 1 month (use phenobarbital instead)",
      "Do not assume febrile seizure in children >6 years — investigate further",
      "Avoid rapid correction of sodium if hyponatremia found (osmotic demyelination risk)",
    ],
    source: "NICE Epilepsy Guidelines 2022, APLS 6th Edition",
  },
  {
    id: "eclampsia-management",
    condition: "eclampsia",
    keyActions: [
      "Administer IV magnesium sulfate 4g loading dose over 15-20 min (FIRST-LINE)",
      "Control blood pressure: IV labetalol 20mg or hydralazine 5mg",
      "Check fetal heart rate with continuous CTG monitoring",
      "Check urine for proteinuria (dipstick or protein:creatinine ratio)",
      "Order CBC with platelets (screen for HELLP syndrome)",
      "Order BMP, liver enzymes (AST/ALT), LDH",
      "Check vitals including BP every 5 minutes during acute phase",
      "Prepare for emergency delivery — definitive treatment is delivery",
    ],
    sequenceRecommendations: [
      "MAGNESIUM is first priority — treats AND prevents eclamptic seizures",
      "Stabilize mother BEFORE assessing fetus (maternal resuscitation first)",
      "BP target: <160/110 but NOT below 140/90 (maintain placental perfusion)",
      "HELLP labs (platelets, LFTs, LDH) must be checked — affects delivery urgency",
      "Delivery is the definitive treatment — plan once mother stabilized",
      "Continue magnesium for 24-48 hours post-delivery (recurrence prevention)",
    ],
    contraindications: [
      "Do NOT use diazepam or phenytoin as first-line — magnesium is superior",
      "Avoid ACE inhibitors and ARBs in pregnancy (teratogenic)",
      "Do not use ergometrine for PPH if hypertensive (causes vasoconstriction)",
      "Avoid NSAIDs if platelets < 100k or renal impairment",
      "Do not aggressively lower BP — fetal distress risk from placental hypoperfusion",
    ],
    source: "ACOG Practice Bulletin: Gestational Hypertension and Preeclampsia 2020, NICE Hypertension in Pregnancy 2019",
  },
  {
    id: "cardiac-arrest-management",
    condition: "cardiac-arrest",
    keyActions: [
      "Start high-quality CPR immediately (100-120 compressions/min, 5-6cm depth)",
      "Defibrillate for VF/pVT — first shock within 3 minutes",
      "Bag-valve-mask ventilation with high-flow O2 (30:2 ratio, or continuous if advanced airway)",
      "Establish IV/IO access",
      "Give epinephrine 1mg IV/IO every 3-5 minutes",
      "Amiodarone 300mg IV after 3rd shock (then 150mg after 5th)",
      "Check rhythm every 2 minutes — minimize interruptions to CPR",
      "Order 12-lead ECG post-ROSC, ABG for metabolic status",
    ],
    sequenceRecommendations: [
      "CPR is the HIGHEST PRIORITY — do not interrupt for anything",
      "Shockable rhythm (VF/pVT): Shock → CPR 2min → Rhythm check → repeat",
      "Epinephrine timing: give IMMEDIATELY for non-shockable, after 2nd shock for shockable",
      "H's and T's: identify reversible causes (Hypovolemia, Hypoxia, Hydrogen ion, Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis PE, Thrombosis coronary)",
      "Post-ROSC: 12-lead ECG → targeted temperature management → PCI if STEMI",
      "Minimize compression interruptions — aim for >80% chest compression fraction",
    ],
    contraindications: [
      "NEVER delay defibrillation for VF/pVT — survival decreases ~10% per minute",
      "Do not stop CPR for pulse checks >10 seconds",
      "Avoid high-dose epinephrine (>1mg) — no survival benefit, may worsen outcomes",
      "Do not give calcium routinely — only for hyperkalemia, hypocalcemia, or calcium channel blocker OD",
      "Avoid excessive ventilation (hyperventilation decreases venous return and coronary perfusion)",
    ],
    source: "AHA ACLS Guidelines 2020, European Resuscitation Council Guidelines 2021",
  },
  {
    id: "overdose-management",
    condition: "overdose",
    keyActions: [
      "Assess and secure airway — suction if needed",
      "Administer high-flow oxygen or bag-valve-mask for RR < 10",
      "Administer naloxone 0.4-2mg IV/IM/IN for suspected opioid OD",
      "Establish IV access",
      "Check pupils (pinpoint = opioid, dilated = sympathomimetic)",
      "Check vitals including temperature and glucose",
      "Order toxicology screen (urine drug screen + specific levels)",
      "Order BMP (renal function, electrolytes, anion gap)",
      "Continuous monitoring — naloxone half-life < opioid half-life",
    ],
    sequenceRecommendations: [
      "Airway management is FIRST — many overdose deaths are from respiratory failure",
      "Naloxone before intubation in suspected opioid OD (may avoid intubation)",
      "Start with lower naloxone dose (0.04-0.4mg) in known opioid-dependent patients to avoid withdrawal",
      "If no IV access: naloxone IM or intranasal (IN) — both effective",
      "Toxidrome recognition: opioid (pinpoint pupils, bradypnea, CNS depression), sympathomimetic (dilated pupils, tachycardia, agitation), cholinergic (SLUDGE), anticholinergic (dry, flushed, confused)",
      "Monitor for re-sedation — naloxone duration (30-90min) shorter than most opioids",
    ],
    contraindications: [
      "Avoid excessive naloxone in opioid-dependent patients — precipitates acute withdrawal",
      "Do NOT induce vomiting in altered consciousness (aspiration risk)",
      "Avoid flumazenil in chronic benzodiazepine users or mixed overdoses (seizure risk)",
      "Do not give activated charcoal if airway not protected",
      "Avoid restraints if agitated — chemical sedation preferred (benzodiazepines)",
    ],
    source: "ACMT Guidelines on Opioid Overdose 2020, WHO Naloxone Guidelines",
  },
  {
    id: "master-pe-management",
    condition: "master-pe",
    keyActions: [
      "Administer high-flow oxygen (target SpO2 >92%)",
      "Establish large-bore IV access immediately",
      "12-lead ECG — look for S1Q3T3, RBBB, RV strain pattern",
      "Order D-dimer (screening), troponin and BNP (prognostic)",
      "CTPA — gold standard diagnostic imaging for PE",
      "Bedside echo (point-of-care) — RV dilatation, McConnell sign, IVC plethora",
      "Examine legs for DVT (unilateral calf swelling is a critical clue)",
      "Start IV unfractionated heparin empirically when PE strongly suspected",
      "ABG — expect respiratory alkalosis, hypoxemia, elevated A-a gradient",
      "For massive PE with hemodynamic instability: systemic thrombolysis (tPA 100mg IV/2h)",
      "Call for help early — activate PERT/ICU/senior physician",
      "Cautious fluid resuscitation only (250-500mL max — RV is preload-dependent)",
      "If cardiac arrest: ACLS + continue thrombolysis, extend CPR to 60-90 min",
    ],
    sequenceRecommendations: [
      "ABC stabilisation FIRST — oxygen and IV access before investigations",
      "ECG should be obtained within 2 minutes of presentation",
      "Start heparin BEFORE CTPA results if clinical probability is high (Wells ≥7)",
      "Bedside echo can be done in <5 minutes and gives rapid RV assessment",
      "CTPA is definitive — order urgently but do NOT delay anticoagulation for it",
      "D-dimer useful for exclusion only — do NOT delay treatment if high clinical suspicion",
      "If hemodynamically unstable: bedside echo → thrombolysis decision (no time for CT)",
      "Do NOT give aggressive fluids — max 500mL bolus, then reassess",
    ],
    contraindications: [
      "Do NOT give nitroglycerin — preload-dependent RV failure will crash",
      "Do NOT give aspirin as primary treatment (this is NOT MI despite elevated troponin)",
      "Do NOT send unstable patient to CT scanner without escort and resuscitation equipment",
      "Avoid aggressive fluid resuscitation — worsens RV failure through ventricular interdependence",
      "tPA relative contraindications: recent surgery (10 days) — benefit outweighs risk in massive PE with shock",
      "Avoid beta-blockers — tachycardia is compensatory for low cardiac output",
    ],
    source:
      "ESC/ERS Guidelines on Acute PE 2019, AHA Scientific Statement: Management of Massive PE 2011, ACLS 2020",
  },
  {
    id: "dengue-myocarditis-management",
    condition: "dengue-myocarditis",
    keyActions: [
      "Take TRAVEL HISTORY — this is the key to the correct diagnosis",
      "12-lead ECG — look for diffuse ST elevation WITHOUT reciprocal changes (myocarditis pattern)",
      "Order troponin and NT-proBNP (both elevated in myocarditis)",
      "Order CRP/ESR — elevated inflammatory markers support myocarditis over MI",
      "Order dengue serology (ELISA IgM, RT-PCR) if travel/endemic exposure",
      "Order CBC — check platelets (normal = safe for NSAIDs; <100k = dengue hemorrhagic risk)",
      "Transthoracic echocardiography — look for pericardial thickening, LV function, effusion",
      "Coronary angiography — MUST rule out ACS when ECG shows ST elevation + elevated troponin",
      "Cardiac MRI with gadolinium — GOLD STANDARD for myocarditis (non-ischemic LGE pattern)",
      "Start NSAIDs + colchicine for myopericarditis (first-line per ESC guidelines)",
      "Monitor for dengue warning signs: hemorrhage, thrombocytopenia, hepatomegaly, plasma leakage",
      "Continuous cardiac monitoring — arrhythmia risk in myocarditis",
    ],
    sequenceRecommendations: [
      "ABCs first — assess vitals, establish IV access, oxygen if needed",
      "ECG within 5 minutes for any patient with chest pain",
      "ASK ABOUT TRAVEL HISTORY early — this changes the entire differential",
      "Check CRP before committing to ACS pathway — elevated CRP favors inflammatory cause",
      "Echo before angiography if pericardial friction rub heard (supports myocarditis)",
      "Angiography is required to EXCLUDE MI when ST elevation + elevated troponin present",
      "Cardiac MRI after angiography confirms clean coronaries — establishes myocarditis diagnosis",
      "Start anti-inflammatory treatment once myocarditis confirmed and platelets are safe",
    ],
    contraindications: [
      "Do NOT treat as STEMI and rush to PCI — the coronaries are normal",
      "Do NOT give anticoagulation (heparin) without angiographic evidence of thrombosis",
      "NSAIDs are USUALLY avoided in dengue — but INDICATED for pericarditis if platelets >100k",
      "Avoid aspirin as antiplatelet dose (81mg) — use HIGH-DOSE aspirin (750mg TID) for pericarditis",
      "Avoid corticosteroids — increase recurrence risk in pericarditis (ESC Class III)",
      "Do NOT discharge without cardiac MRI confirmation and cardiology follow-up",
    ],
    source:
      "ESC Myocarditis Guidelines 2013, WHO Dengue Classification 2009, AHA Cardiac MRI Recommendations, PMC10402786",
  },
];

// Action to suggestion mapping
const ACTION_SUGGESTIONS: Record<string, string[]> = {
  administer_oxygen: [
    "Target SpO2 > 94% in most patients",
    "Start with nasal cannula 2-4L, escalate as needed",
    "In COPD, target SpO2 88-92% to avoid CO2 retention",
  ],
  administer_fluids: [
    "Initial bolus: 30mL/kg crystalloid for sepsis",
    "Reassess after each bolus - check JVP, lung sounds, BP response",
    "Consider vasopressors if not responding to fluids",
  ],
  administer_antibiotics: [
    "Give within 1 hour of sepsis recognition",
    "Broad-spectrum initially, narrow based on cultures",
    "Check allergies before administration",
  ],
  order_blood_cultures: [
    "Draw from 2 separate sites before antibiotics",
    "At least 20mL total blood volume improves yield",
    "Peripheral cultures preferred over line draws",
  ],
  administer_epinephrine: [
    "IM is preferred route (anterolateral thigh)",
    "Dose: 0.3-0.5mg for adults, can repeat q5-15min",
    "IV only for refractory shock with careful monitoring",
  ],
  administer_aspirin: [
    "Give 325mg chewed for fastest absorption",
    "Contraindicated if true aspirin allergy or active bleeding",
    "Continue indefinitely post-MI unless contraindicated",
  ],
  order_ecg: [
    "Should be done within 10 minutes of arrival for chest pain",
    "Look for ST changes, new LBBB, Q waves",
    "Compare to prior ECGs if available",
  ],
  administer_salbutamol: [
    "Can give continuously for severe exacerbation",
    "Watch for tachycardia and tremor (common side effects)",
    "If not improving, consider IV magnesium",
  ],
  administer_tpa: [
    "IV alteplase 0.9mg/kg (max 90mg): 10% bolus, rest over 60 min",
    "Window: within 4.5 hours of symptom onset (or last known well time)",
    "Must exclude hemorrhage on CT before administration",
    "Monitor for angioedema and bleeding complications",
  ],
  check_nihss: [
    "National Institutes of Health Stroke Scale — 11 categories, score 0-42",
    "NIHSS ≥6 generally associated with large vessel occlusion",
    "Serial NIHSS monitors improvement or deterioration",
    "Key domains: consciousness, gaze, visual, facial palsy, motor, ataxia, sensory, language, dysarthria, extinction",
  ],
  order_ct_head: [
    "Non-contrast CT excludes hemorrhagic stroke before thrombolysis",
    "Must be interpreted within 45 minutes of arrival",
    "Look for: hemorrhage, early ischemic changes, hyperdense vessel sign",
    "CT angiography identifies large vessel occlusion for thrombectomy",
  ],
  start_insulin_drip: [
    "Standard rate: 0.1 units/kg/hr continuous IV infusion",
    "Check glucose hourly — target decrease 3-4 mmol/L/hr (50-75 mg/dL/hr)",
    "Do NOT bolus insulin in DKA — increases hypokalemia risk",
    "Continue until anion gap normalizes, not just until glucose normalizes",
  ],
  check_blood_glucose: [
    "Point-of-care fingerstick for rapid result",
    "DKA: glucose typically >14 mmol/L (250 mg/dL)",
    "Hypoglycemia (<3.3 mmol/L) must be excluded — common stroke mimic",
    "Neonatal/pediatric hypoglycemia threshold: <2.6 mmol/L",
  ],
  order_bmp: [
    "Includes: Na, K, Cl, CO2, BUN, Creatinine, Glucose, Ca",
    "Anion gap = Na - (Cl + HCO3) — normal 8-12",
    "Critical for DKA (AG acidosis), renal function, electrolyte emergencies",
    "Potassium level guides insulin and potassium replacement in DKA",
  ],
  insert_chest_drain: [
    "Indications: pneumothorax, hemothorax, empyema",
    "Safe triangle: 4th-5th intercostal space, mid-axillary line",
    "Always above the rib to avoid neurovascular bundle",
    "Needle decompression first for tension pneumothorax (2nd ICS, MCL)",
  ],
  order_fast_scan: [
    "FAST: Focused Assessment with Sonography in Trauma",
    "Four views: Morrison's pouch, splenorenal, subxiphoid (pericardium), suprapubic (pelvis)",
    "Positive FAST + hemodynamic instability → immediate surgical intervention",
    "Cannot quantify blood loss or detect retroperitoneal hemorrhage",
  ],
  start_cpr: [
    "Rate: 100-120 compressions/minute, depth 5-6 cm (2-2.4 inches)",
    "Allow full chest recoil — do not lean on chest between compressions",
    "Minimize interruptions — aim for >80% compression fraction",
    "Switch compressors every 2 minutes to prevent fatigue",
  ],
  defibrillate: [
    "VF/pVT: first shock 120-200J biphasic (or max if unknown device)",
    "Resume CPR immediately after shock — do not check rhythm for 2 minutes",
    "Clear patient and oxygen before delivering shock",
    "Stacked shocks only during witnessed, monitored VF arrest with defibrillator immediately available",
  ],
  give_epinephrine: [
    "Cardiac arrest: 1mg IV/IO every 3-5 minutes",
    "Shockable rhythm: give after 2nd failed defibrillation",
    "Non-shockable rhythm (PEA/asystole): give as soon as IV/IO access",
    "Vasopressin 40 units may replace first or second epinephrine dose",
  ],
  administer_amiodarone: [
    "Refractory VF/pVT: 300mg IV/IO bolus after 3rd shock",
    "Second dose: 150mg IV/IO after 5th shock",
    "Can cause hypotension — infuse slowly post-ROSC",
    "Alternative: lidocaine 1-1.5 mg/kg if amiodarone unavailable",
  ],
  administer_naloxone: [
    "Initial dose: 0.4-2mg IV/IM/IN for opioid reversal",
    "Lower starting dose (0.04mg) in known opioid-dependent patients",
    "Onset: IV 2 min, IM 5 min, IN 3-5 min",
    "Duration 30-90 min — SHORTER than most opioids, watch for re-sedation",
  ],
  administer_magnesium: [
    "Eclampsia: 4g IV loading dose over 15-20 minutes, then 1g/hr maintenance",
    "Severe asthma: 2g IV over 20 minutes",
    "Torsades de pointes: 2g IV over 2-5 minutes",
    "Monitor for toxicity: loss of reflexes, respiratory depression, cardiac arrest (>7 mmol/L)",
  ],
  administer_labetalol: [
    "Hypertensive emergency: 20mg IV push, then 40-80mg q10min (max 300mg)",
    "Pre-tPA stroke: target BP <185/110",
    "Post-tPA stroke: target BP <180/105 for 24 hours",
    "Contraindicated in: severe bradycardia, heart block, decompensated heart failure",
  ],
  administer_diazepam: [
    "Pediatric seizure: 0.2-0.5mg/kg IV (max 10mg) or 0.5mg/kg PR",
    "Adult status epilepticus: 5-10mg IV q5-10min (max 30mg)",
    "Onset IV: 1-3 minutes, Duration: 15-20 minutes",
    "Respiratory depression risk — have airway equipment ready",
  ],
  check_airway: [
    "Look-Listen-Feel: chest rise, air movement, stridor, gurgling",
    "Head tilt-chin lift (no c-spine concern) or jaw thrust (trauma)",
    "Suction if secretions, blood, or vomit present",
    "Airway adjuncts: OPA if no gag reflex, NPA if gag present",
  ],
  bag_valve_mask: [
    "Two-person technique preferred (better seal)",
    "Rate: 10-12 breaths/min for adults, 12-20 for pediatric",
    "Watch for chest rise — avoid excessive volume (gastric distension)",
    "C-E grip: thumb and index around mask, other fingers lift jaw",
  ],
  order_abg: [
    "Arterial blood gas: pH, pCO2, pO2, HCO3, BE, lactate",
    "Interpret using: pH → pCO2 (respiratory) → HCO3 (metabolic) → compensation",
    "DKA: expect metabolic acidosis with respiratory compensation (low pCO2)",
    "Respiratory failure: type 1 (hypoxic, low pO2) vs type 2 (hypercapnic, high pCO2)",
  ],
  give_antipyretic: [
    "Paracetamol (acetaminophen): 15mg/kg PO/PR q4-6h (max 60mg/kg/day peds)",
    "Ibuprofen: 10mg/kg PO q6-8h (if >6 months, no contraindications)",
    "Tepid sponging is no longer recommended as sole therapy",
    "Fever may be protective — treat for comfort, not number alone",
  ],
  prepare_for_delivery: [
    "Call obstetric team, neonatal team, and anesthesia",
    "Confirm gestational age and fetal heart rate status",
    "Cesarean section if: severe fetal distress, failed induction, maternal instability",
    "Left lateral tilt position to avoid aortocaval compression",
  ],
  order_toxicology_screen: [
    "Urine drug screen: opioids, benzodiazepines, amphetamines, cannabis, cocaine",
    "Specific levels if suspected: paracetamol, salicylate, ethanol, lithium, digoxin",
    "Urine drug screens have significant false positives and negatives",
    "Treat the patient, not the drug screen — clinical assessment takes priority",
  ],
  check_pupils: [
    "Pinpoint/miotic: opioids, organophosphates, pontine hemorrhage",
    "Dilated/mydriatic: sympathomimetics, anticholinergics, brain death",
    "Unequal (anisocoria): uncal herniation, CN III palsy — EMERGENCY",
    "Fixed mid-position: significant brain injury or barbiturate toxicity",
  ],
};

// Symptom/vital sign to suggestion mapping
const VITAL_SUGGESTIONS: Record<string, (value: number) => string | null> = {
  spo2: (value) => {
    if (value < 88)
      return "CRITICAL: SpO2 < 88% - escalate oxygen, consider intubation";
    if (value < 92)
      return "Low SpO2 - ensure oxygen delivered, check for obstruction";
    if (value < 94) return "Mild hypoxemia - increase supplemental oxygen";
    return null;
  },
  bpSystolic: (value) => {
    if (value < 70)
      return "CRITICAL: Severe hypotension - start pressors, call for help";
    if (value < 90)
      return "Hypotension - fluid bolus indicated, reassess frequently";
    if (value > 180)
      return "Severe hypertension - consider IV antihypertensive";
    return null;
  },
  hr: (value) => {
    if (value < 50)
      return "Bradycardia - check medications, consider atropine if symptomatic";
    if (value > 150)
      return "Severe tachycardia - identify cause, consider rate control";
    if (value > 120)
      return "Tachycardia - consider underlying cause (pain, hypovolemia, anxiety)";
    return null;
  },
  temp: (value) => {
    if (value > 40)
      return "CRITICAL: Hyperpyrexia - active cooling, investigate source";
    if (value > 38.3)
      return "Fever - obtain cultures, consider antipyretics after cultures drawn";
    if (value < 36)
      return "Hypothermia - warm patient, may indicate severe sepsis";
    return null;
  },
  respRate: (value) => {
    if (value > 30)
      return "CRITICAL: Severe tachypnea - prepare for airway intervention";
    if (value > 24)
      return "Tachypnea - assess respiratory effort, consider BiPAP";
    if (value < 10)
      return "CRITICAL: Bradypnea - assess airway, naloxone if opioid suspected";
    return null;
  },
};

// Extract base condition from scenario ID (e.g., "stroke-58m" → "stroke", "peds-seizure-4m" → "peds-seizure")
function getBaseCondition(scenarioId: string): string {
  // Known multi-word conditions
  const multiWordConditions = [
    "peds-seizure",
    "cardiac-arrest",
  ];
  for (const cond of multiWordConditions) {
    if (scenarioId.startsWith(cond)) return cond;
  }
  // Default: take first segment before the patient identifier
  // e.g., "stroke-58m" → "stroke", "dka-34f" → "dka", "sepsis" → "sepsis"
  const match = scenarioId.match(/^([a-z-]+?)(?:-\d+[mf])?$/i);
  return match ? match[1] : scenarioId;
}

export function getGuidelineForScenario(
  scenarioId: string,
): ClinicalGuideline | null {
  const base = getBaseCondition(scenarioId);
  return (
    CLINICAL_GUIDELINES.find(
      (g) => g.condition === scenarioId || g.condition === base,
    ) || null
  );
}

export function getSuggestionsForAction(action: string): string[] {
  return ACTION_SUGGESTIONS[action] || [];
}

export function getSuggestionForVital(
  vitalName: string,
  value: number,
): string | null {
  const suggestionFn = VITAL_SUGGESTIONS[vitalName];
  return suggestionFn ? suggestionFn(value) : null;
}

export function generateContextualSuggestions(
  scenarioId: string,
  currentAction: string | null,
  vitals: Record<string, number>,
  actionsTaken: string[],
  knowledgeBaseResults: { content: string; score: number }[] = [],
): ContextualSuggestion[] {
  const suggestions: ContextualSuggestion[] = [];

  // 1. Add guideline-based suggestions
  const guideline = getGuidelineForScenario(scenarioId);
  if (guideline) {
    // Check for missed critical actions
    for (const action of guideline.keyActions) {
      const actionId = action.toLowerCase().replace(/[^a-z]/g, "_");
      const taken = actionsTaken.some(
        (a) => a.includes(actionId) || actionId.includes(a),
      );
      if (!taken) {
        suggestions.push({
          trigger: "guideline",
          content: `Guideline reminder: ${action}`,
          relevance: 0.8,
          source: guideline.source,
          isFromKnowledgeBase: false,
        });
      }
    }

    // Add sequence recommendations if relevant
    for (const rec of guideline.sequenceRecommendations) {
      suggestions.push({
        trigger: "sequence",
        content: rec,
        relevance: 0.7,
        source: guideline.source,
        isFromKnowledgeBase: false,
      });
    }
  }

  // 2. Add action-specific suggestions
  if (currentAction) {
    const actionSuggestions = getSuggestionsForAction(currentAction);
    for (const suggestion of actionSuggestions) {
      suggestions.push({
        trigger: currentAction,
        content: suggestion,
        relevance: 0.9,
        source: "Clinical Practice",
        isFromKnowledgeBase: false,
      });
    }
  }

  // 3. Add vital-based alerts
  for (const [vitalName, value] of Object.entries(vitals)) {
    const suggestion = getSuggestionForVital(vitalName, value);
    if (suggestion) {
      suggestions.push({
        trigger: vitalName,
        content: suggestion,
        relevance: suggestion.includes("CRITICAL") ? 1.0 : 0.85,
        source: "Vital Sign Alert",
        isFromKnowledgeBase: false,
      });
    }
  }

  // 4. Add knowledge base results
  for (const result of knowledgeBaseResults) {
    suggestions.push({
      trigger: "knowledge_base",
      content: result.content.slice(0, 200) + "...",
      relevance: result.score,
      source: "Uploaded Knowledge Base",
      isFromKnowledgeBase: true,
    });
  }

  // Sort by relevance
  suggestions.sort((a, b) => b.relevance - a.relevance);

  return suggestions.slice(0, 5); // Return top 5
}

// Post-simulation recommendations
export function generatePostSimulationReview(
  scenarioId: string,
  _actionsTaken: string[],
  sequencingErrors: string[],
  missedActions: string[],
): string[] {
  const recommendations: string[] = [];
  const guideline = getGuidelineForScenario(scenarioId);

  if (missedActions.length > 0) {
    recommendations.push(
      `Review: ${missedActions.length} critical actions were missed in this scenario.`,
    );
    for (const action of missedActions.slice(0, 3)) {
      recommendations.push(`- Consider why "${action}" was not performed`);
    }
  }

  if (sequencingErrors.length > 0) {
    recommendations.push("Review action sequencing:");
    for (const error of sequencingErrors) {
      recommendations.push(`- ${error}`);
    }
  }

  if (guideline) {
    recommendations.push(`Suggested reading: ${guideline.source}`);
  }

  // Scenario-specific tips
  const scenarioTips: Record<string, string[]> = {
    sepsis: [
      "Remember the Hour-1 Bundle: cultures, antibiotics, lactate, fluids",
      "Sepsis mortality increases 7.6% per hour of antibiotic delay",
      "qSOFA ≥2 identifies patients at risk: altered mentation, RR ≥22, SBP ≤100",
    ],
    mi: [
      "Door-to-balloon time is critical - every minute counts",
      "MONA is outdated - morphine may increase mortality in some cases",
      "Right ventricular MI (inferior STEMI) - avoid nitrates and fluid-deplete with caution",
    ],
    anaphylaxis: [
      "Epinephrine is the ONLY first-line treatment - never delay",
      "Most deaths occur from delayed or missing epinephrine",
      "Biphasic reaction can occur up to 72 hours later - observe minimum 6-8 hours",
    ],
    asthma: [
      "Silent chest is ominous - prepare for intubation",
      "Magnesium sulfate for severe exacerbations not responding to SABA",
      "PEF <25% predicted or inability to speak = life-threatening exacerbation",
    ],
    stroke: [
      "Time is brain: 1.9 million neurons lost per minute in ischemic stroke",
      "Door-to-needle (tPA) goal: <60 minutes",
      "NIHSS ≥6 with LVO on CTA → consider mechanical thrombectomy (up to 24h in select patients)",
      "Always check glucose — hypoglycemia is a common stroke mimic",
    ],
    dka: [
      "The three pillars: Fluids → Potassium → Insulin (in that order)",
      "Cerebral edema risk in children — avoid rapid osmolality shifts",
      "Continue insulin drip until AG closes, NOT until glucose normalizes",
      "Look for the precipitant: Infection, Insulin non-compliance, Infarction (5 I's)",
    ],
    trauma: [
      "C-A-B-C-D-E: massive hemorrhage control, airway, breathing, circulation, disability, exposure",
      "Permissive hypotension (SBP 80-90) in penetrating trauma until surgical control",
      "Massive transfusion: activate early, use 1:1:1 ratio (pRBC:FFP:platelets)",
      "The lethal triad: hypothermia, acidosis, coagulopathy — treat aggressively",
    ],
    "peds-seizure": [
      "Status epilepticus = seizure >5 minutes — treat aggressively",
      "Febrile seizures are common (2-4% of children) but must rule out meningitis in <18 months",
      "Benzodiazepine dose ladder: midazolam buccal/IN → lorazepam/diazepam IV → phenytoin/levetiracetam",
      "Always check glucose — hypoglycemia is a treatable seizure cause in children",
    ],
    eclampsia: [
      "Magnesium sulfate is THE anti-seizure drug in eclampsia — NOT diazepam or phenytoin",
      "HELLP = Hemolysis, Elevated Liver enzymes, Low Platelets — requires urgent delivery",
      "Definitive treatment is DELIVERY — stabilize mother first, then plan delivery",
      "Eclampsia can occur postpartum (up to 6 weeks) — not just antepartum",
    ],
    "cardiac-arrest": [
      "High-quality CPR saves lives: push hard (5-6cm), push fast (100-120/min), full recoil",
      "Defibrillation is the only effective treatment for VF/pVT — shock early",
      "H's and T's: systematically review reversible causes every cycle",
      "Post-ROSC care: targeted temperature management, coronary angiography if STEMI, avoid hyperoxia",
    ],
    overdose: [
      "Naloxone wears off before the opioid — monitor for re-sedation for 4+ hours",
      "Toxidrome recognition: opioid (constricted pupils + bradypnea + CNS depression)",
      "Mixed overdoses are common — don't stop at one diagnosis",
      "Supportive care (ABC management) is the cornerstone of all overdose management",
    ],
    "master-pe": [
      "PE kills by obstructive shock — the RV cannot pump against a blocked pulmonary circulation",
      "S1Q3T3 is classic but only present in ~20% of PE cases — absence does NOT rule out PE",
      "Troponin is elevated from RV strain, NOT coronary occlusion — do NOT treat as MI",
      "30% of untreated PE patients die vs 8% with timely therapy — diagnosis is everything",
      "Nitroglycerin is DANGEROUS in RV failure — the RV is preload-dependent",
      "In arrest from PE: give thrombolysis during CPR and continue for 60-90 minutes",
      "Bedside echo can diagnose RV strain in seconds — faster than any lab or CT",
      "Always examine the legs — unilateral calf swelling is the smoking gun for DVT → PE",
    ],
    "dengue-myocarditis": [
      "TRAVEL HISTORY is the single most important question — without it, you'll treat this as a heart attack",
      "ST elevation + elevated troponin does NOT always mean MI — myocarditis is the great mimicker",
      "Key ECG clue: DIFFUSE ST elevation across multiple vascular territories WITHOUT reciprocal depression = myocarditis, not MI",
      "Normal CPK with elevated troponin is atypical for large MI — think myocarditis",
      "Pericardial friction rub is pathognomonic for pericarditis — listen carefully, best heard leaning forward",
      "Dengue myocarditis affects ~3-5% of dengue patients — it's NOT rare in endemic settings",
      "NSAIDs are the treatment PARADOX: avoided in dengue (bleeding risk) but FIRST-LINE for pericarditis — safe if platelets >100k",
      "Cardiac MRI with late gadolinium enhancement is the GOLD STANDARD — subepicardial/mid-wall pattern confirms myocarditis",
      "Normal coronary angiography is the key pivot point — it EXCLUDES MI and redirects to myocarditis",
      "WHO dengue warning signs: persistent vomiting, abdominal pain, mucosal bleeding, hepatomegaly, hematocrit rise",
    ],
  };

  const base = getBaseCondition(scenarioId);
  const tips = scenarioTips[scenarioId] || scenarioTips[base] || [];
  for (const tip of tips) {
    recommendations.push(`Tip: ${tip}`);
  }

  return recommendations;
}
