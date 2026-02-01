import type { ScenarioDefinition } from "../types";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MASTER SCENARIO: Massive Pulmonary Embolism with RV Failure → Cardiac Arrest
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This is the most comprehensive and diagnostically challenging scenario in the
 * simulation engine. It tests:
 *
 * 1. DIAGNOSTIC REASONING — PE mimics MI, pneumothorax, aortic dissection, and
 *    panic attack. The trainee must synthesize subtle clues (risk factors,
 *    S1Q3T3 on ECG, elevated D-dimer, RV strain on echo) to reach the correct
 *    diagnosis before catastrophic deterioration.
 *
 * 2. TIME-CRITICAL DECISION MAKING — Massive PE mortality approaches 50% within
 *    48 hours without treatment. Door-to-anticoagulation and door-to-thrombolysis
 *    times directly determine survival.
 *
 * 3. MULTI-PHASE MANAGEMENT — The case evolves through 4 phases:
 *    Phase 1: Initial presentation (tachycardia, dyspnea, chest pain)
 *    Phase 2: Hemodynamic instability (hypotension, RV failure)
 *    Phase 3: Cardiac arrest (PEA → VF)
 *    Phase 4: Post-ROSC stabilization
 *
 * 4. COMPLEX MEDICATION DECISIONS — Anticoagulation (heparin) vs systemic
 *    thrombolysis (tPA 100mg/2h) vs supportive care. Wrong decisions are lethal.
 *
 * 5. DIFFERENTIAL DIAGNOSIS — Must rule out MI (troponin is elevated!), aortic
 *    dissection (tearing pain), tension pneumothorax (dyspnea + hypotension),
 *    and cardiac tamponade.
 *
 * Based on: AHA/ESC PE Guidelines 2019, ACLS 2020, EMCrit IBCC PE protocol
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export const masterPEScenario: ScenarioDefinition = {
  id: "master-pe-47f",
  name: "⭐ MASTER: Massive PE with RV Failure & Cardiac Arrest",
  description: `Mrs. Chen, 47, presents to the ED with sudden-onset severe dyspnea and pleuritic chest pain that started 2 hours ago while watching TV. She had a left knee arthroscopy 10 days ago and has been relatively immobile during recovery. She takes oral contraceptives. She is tachycardic, hypoxic, and increasingly anxious. This case will progress through hemodynamic deterioration to cardiac arrest if the underlying cause is not identified and treated urgently. The most diagnostically challenging and time-critical scenario available — tests differential diagnosis, imaging interpretation, anticoagulation decisions, thrombolysis timing, and full ACLS resuscitation skills.`,

  patientName: "Mrs. Chen",

  patientPersona: `You are Linda Chen, a 47-year-old high school teacher. You are terrified because you cannot breathe.

BACKGROUND:
- You had a left knee arthroscopy (keyhole surgery) 10 days ago for a torn meniscus
- You've been mostly on the couch recovering, only walking short distances to the bathroom
- You take oral contraceptive pills (have for 15 years)
- You're a bit overweight but otherwise healthy
- No previous blood clots, no family history of clots that you know of
- You don't smoke. Occasional glass of wine.

CURRENT SYMPTOMS (describe in your own words, NEVER use medical terms):
- Sudden, severe shortness of breath — "I can't get enough air, like breathing through a straw"
- Sharp chest pain on the RIGHT side that's worse when you breathe in — "Like a knife stabbing me when I try to take a deep breath"
- You feel dizzy and lightheaded, especially when sitting up
- Your heart is racing — "My heart is pounding so hard I can feel it in my throat"
- You feel like you're going to pass out — "Everything keeps going grey around the edges"
- Your right calf has been "a bit sore and swollen" for the past 3 days but you thought it was from the surgery
- You coughed up a small amount of blood-tinged sputum once, about an hour ago — "I coughed and there was a bit of pink in what came up"

BEHAVIOR:
- You are extremely anxious and scared. You keep asking "Am I going to die?"
- You cannot speak in full sentences — only 3-5 words at a time before gasping
- You prefer to sit upright — lying flat makes the breathlessness much worse
- You may become confused or drowsy as the scenario progresses (less responsive)
- If asked about your leg, mention the right calf swelling and soreness
- If asked about recent surgery, describe the knee operation
- If asked about medications, mention "the pill" (contraceptive) and paracetamol for knee pain
- You do NOT know medical terms. You have no idea what a pulmonary embolism is.
- If you become very unwell (BP drops), you become less coherent, just repeating "I can't breathe" and "help me"
- If you lose consciousness, you stop responding entirely.`,

  baselineVitals: {
    hr: 118,
    bpSystolic: 100,
    bpDiastolic: 62,
    spo2: 88,
    temp: 37.2,
    respRate: 28,
  },

  deteriorationRules: [
    // Phase 1: Oxygen — without supplemental O2, rapid desaturation
    {
      id: "pe-no-oxygen",
      condition: "No oxygen administered — V/Q mismatch worsening",
      timerMinutes: 2,
      effect: { spo2: 78, hr: 130, respRate: 34 },
      preventedBy: [
        "administer_oxygen",
        "apply_oxygen",
        "give_oxygen",
        "high_flow_oxygen",
      ],
    },
    // Phase 2: Anticoagulation — without heparin, clot propagation
    {
      id: "pe-no-anticoagulation",
      condition: "No anticoagulation — thrombus propagation and RV pressure overload",
      timerMinutes: 6,
      effect: { bpSystolic: 78, bpDiastolic: 45, hr: 135, spo2: 82 },
      preventedBy: [
        "administer_heparin",
        "give_heparin",
        "start_heparin",
        "anticoagulation",
        "start_anticoagulation",
        "heparin_bolus",
      ],
    },
    // Phase 3: IV Access — without it, can't give critical drugs
    {
      id: "pe-no-iv",
      condition: "No IV access — unable to administer critical medications",
      timerMinutes: 3,
      effect: { bpSystolic: 88, hr: 128 },
      preventedBy: [
        "establish_iv_access",
        "iv_access",
        "get_iv_access",
        "insert_iv",
        "cannulate",
      ],
    },
    // Phase 4: Without CTPA or echo diagnosis — delayed thrombolysis → arrest
    {
      id: "pe-no-diagnosis",
      condition:
        "Underlying PE not diagnosed — RV failure progressing to obstructive shock",
      timerMinutes: 10,
      effect: { bpSystolic: 60, bpDiastolic: 30, hr: 140, spo2: 70, respRate: 38 },
      preventedBy: [
        "order_ctpa",
        "order_ct_chest",
        "order_ct_pulmonary_angiogram",
        "ct_angiography",
        "order_echo",
        "bedside_echo",
        "point_of_care_ultrasound",
        "order_fast_scan",
      ],
    },
    // Phase 5: Without thrombolysis after hemodynamic collapse → PEA arrest
    {
      id: "pe-no-thrombolysis",
      condition:
        "Massive PE with hemodynamic instability — without thrombolysis, progression to cardiac arrest",
      timerMinutes: 14,
      effect: { hr: 30, bpSystolic: 40, bpDiastolic: 20, spo2: 55, respRate: 6 },
      preventedBy: [
        "administer_tpa",
        "give_tpa",
        "thrombolysis",
        "systemic_thrombolysis",
        "alteplase",
        "administer_alteplase",
      ],
    },
  ],

  correctActions: [
    // IMMEDIATE (first 5 minutes)
    "check_vitals",
    "administer_oxygen",
    "establish_iv_access",
    "order_ecg",
    // DIAGNOSTIC (5-15 minutes)
    "order_d_dimer",
    "order_troponin",
    "order_bnp",
    "order_cbc",
    "order_bmp",
    "order_coagulation",
    "order_abg",
    "check_lung_sounds",
    "check_heart_sounds",
    "check_legs",
    // IMAGING (critical diagnostic step)
    "order_ctpa",
    "order_echo",
    "order_chest_xray",
    // TREATMENT
    "administer_heparin",
    "fluid_bolus",
    // ESCALATION (if hemodynamically unstable)
    "administer_tpa",
    "start_vasopressor",
    "call_for_help",
    // IF ARREST
    "start_cpr",
    "bag_valve_mask",
    "defibrillate",
    "give_epinephrine",
    "check_rhythm",
  ],

  labResults: {
    // CRITICAL LABS — each tells part of the story
    d_dimer:
      "D-dimer: >4.0 μg/mL FEU (CRITICAL HIGH — normal <0.5). Strongly suggests acute thromboembolism.",
    troponin:
      "Troponin I: 0.89 ng/mL (ELEVATED — normal <0.04). Indicates RV myocardial injury from acute pressure overload. NOT diagnostic of MI — correlate with ECG and imaging.",
    bnp: "BNP: 892 pg/mL (ELEVATED — normal <100). Indicates significant right ventricular strain and dilatation. Prognostic marker — elevated BNP in PE associated with higher mortality.",
    cbc: "WBC: 12,800/μL (mildly elevated — stress response), Hgb: 13.4 g/dL (normal), Plt: 238,000/μL (normal). No thrombocytopenia (safe for anticoagulation).",
    bmp: "Na: 139, K: 4.3, Cl: 101, CO2: 18 (LOW — metabolic acidosis), BUN: 22, Cr: 1.1, Glucose: 142 (stress hyperglycemia). Anion gap: 20 (elevated — lactic acidosis from shock).",
    coagulation:
      "PT: 12.8s (normal), INR: 1.0 (normal — NOT on anticoagulants), aPTT: 29s (normal). Baseline coagulation normal — safe to anticoagulate and consider thrombolysis.",
    abg: "pH: 7.48, pCO2: 28 mmHg (LOW — hyperventilation), pO2: 58 mmHg (SEVERELY HYPOXIC), HCO3: 20 mEq/L, SaO2: 88%, Lactate: 3.8 mmol/L (elevated — tissue hypoperfusion). Interpretation: Respiratory alkalosis with hypoxemia and early lactic acidosis. A-a gradient markedly elevated (~45 mmHg) indicating V/Q mismatch.",
    lactate:
      "Lactate: 3.8 mmol/L (ELEVATED — normal <2.0). Indicates tissue hypoperfusion from obstructive shock. Will rise if PE untreated.",

    // IMAGING RESULTS
    ecg: "Sinus tachycardia rate 118. S1Q3T3 pattern (S wave in lead I, Q wave in lead III, inverted T wave in lead III). T-wave inversions V1-V4 (RV strain pattern). New incomplete RBBB. Right axis deviation. Overall: Classic acute right heart strain — strongly suggestive of significant PE.",
    chest_xray:
      "PA film: Heart size normal. Subtle oligemia in the right lower lobe (Westermark sign). Prominence of the right descending pulmonary artery (Fleischner sign). Small right-sided pleural effusion. No pneumothorax. No consolidation. No widened mediastinum (argues against aortic dissection).",
    ctpa: "CT PULMONARY ANGIOGRAPHY: LARGE SADDLE EMBOLUS straddling the main pulmonary artery bifurcation, with extensive thrombus extending into both right and left main pulmonary arteries and into lobar branches bilaterally. RV/LV ratio 1.8 (markedly elevated — normal <1.0, severe RV dilatation). Interventricular septum bowing into LV (D-sign). Contrast reflux into the IVC and hepatic veins indicating elevated right-sided pressures. Small bilateral pleural effusions. No evidence of aortic dissection. IMPRESSION: MASSIVE BILATERAL PULMONARY EMBOLISM WITH SEVERE RV STRAIN.",
    echo:
      "Bedside echocardiography (point-of-care): Severely dilated right ventricle (RV:LV ratio >1.5). McConnell sign POSITIVE (RV free wall akinesis with preserved apical contractility — highly specific for acute PE). Moderate-to-severe tricuspid regurgitation. Estimated RVSP 65 mmHg (severely elevated). Flattened interventricular septum in diastole (D-sign). IVC dilated (2.8cm) with no respiratory variation. LV small and underfilled. No pericardial effusion. IMPRESSION: Acute right ventricular pressure overload consistent with massive PE.",
    legs_exam:
      "RIGHT lower extremity: Calf circumference 3cm greater than left. Pitting edema over medial malleolus. Tender on palpation of posterior calf. Positive Homan's sign (pain with dorsiflexion — low specificity). Skin warm, no erythema. LEFT leg: Post-operative knee — small healing arthroscopy wounds, no swelling above surgical site. IMPRESSION: Clinical DVT in right calf — likely source of PE.",
    fast_scan:
      "FAST/Focused echo: No free abdominal fluid. No pericardial effusion. RIGHT VENTRICLE severely dilated (consistent with acute PE). IVC plethoric and non-collapsible.",
    toxicology_screen: "Urine drug screen: Negative for all substances.",
    blood_type: "Type A positive. Crossmatch: Ready.",
    liver_enzymes:
      "AST: 52 U/L (mildly elevated — hepatic congestion from RV failure), ALT: 38 U/L (normal), LDH: 420 U/L (elevated — PE marker).",
  },

  examFindings: {
    // GENERAL
    gen_appearance:
      "Middle-aged female, sitting upright and leaning forward. Severe respiratory distress. Anxious, diaphoretic. Speaking in 3-5 word fragments between gasps.",
    gen_skin_color:
      "Pale, cyanotic lips and nail beds. Mottled lower extremities. CRT 4 seconds.",
    gen_resp_effort:
      "Severe tachypnea (RR 28). Using accessory muscles. Cannot lie flat — orthopnea. Able to speak only 3-5 words per breath.",
    gen_consciousness:
      "Alert initially but increasingly confused and drowsy. Oriented to person and place. Agitated and anxious.",
    // HEAD & NECK
    hn_jvp:
      "JVP markedly elevated (8cm above sternal angle). Distended neck veins visible without positioning.",
    hn_oral_cavity: "Cyanotic oral mucosa. Moist membranes.",
    hn_pupils: "PERRL 3mm bilaterally. No RAPD.",
    // CARDIOVASCULAR — Key diagnostic findings
    cv_heart_sounds:
      "Tachycardic. Loud P2 (accentuated pulmonary component of S2 — pulmonary hypertension). Right ventricular heave (parasternal lift). Soft systolic murmur at left lower sternal border (tricuspid regurgitation). No S3/S4.",
    cv_peripheral_pulses: "Tachycardic, weak, thready pulses",
    cv_cap_refill: "CRT 4 seconds (obstructive shock)",
    cv_edema: "Right lower extremity edema (3cm > left). No bilateral edema.",
    cv_apex_beat: "Apex beat displaced — right ventricular heave palpable at left parasternal area.",
    // RESPIRATORY
    resp_chest_wall: "Bilateral chest expansion — slightly reduced on right.",
    resp_breath_sounds:
      "Bilateral air entry present. Reduced at right base. No wheeze. No crackles. Pleural rub audible at right lower zone.",
    resp_percussion: "Resonant throughout. Mildly dull at right base (small effusion).",
    resp_pattern:
      "Tachypnea RR 28, regular, shallow breaths. No Kussmaul or Cheyne-Stokes pattern.",
    // ABDOMINAL
    abd_light_palpation:
      "Soft, non-tender. Liver edge palpable 3cm below costal margin (hepatic congestion from RV failure).",
    abd_bowel_sounds: "Active bowel sounds.",
    // NEUROLOGICAL
    neuro_gcs: "GCS E4V4M6 = 14 initially (confused but follows commands). Declining as shock progresses.",
    neuro_motor: "Power 5/5 all limbs. Normal tone.",
    // SKIN
    skin_inspection:
      "Healing arthroscopy wounds on left knee (2 small portal scars, clean, no infection). Right calf swollen and tender — 3cm greater circumference than left.",
    skin_temperature: "Cool peripheries. Warm centrally. Core temp 37.2°C.",
    skin_turgor: "Normal turgor.",
    // PERIPHERAL VASCULAR — Critical DVT finding
    pv_lower_limb:
      "RIGHT calf: Swollen (+3cm vs left), warm, tender on posterior palpation. Positive Homan's sign. No erythema or skin changes. LEFT leg: Post-op knee, healing well. No calf swelling.",
    pv_pedal_pulses:
      "Bilateral pedal pulses present but weak. Right dorsalis pedis slightly weaker than left.",
  },
};
