import type { ScenarioDefinition } from "../types";

/**
 * ===========================================================================
 * SCENARIO: Dengue Myocarditis Mimicking Acute Coronary Syndrome
 * ===========================================================================
 *
 * Based on: PMC10402786 — Clinical case report and literature review of
 * dengue myocarditis presenting as STEMI-equivalent.
 *
 * This is a diagnostically challenging scenario that tests:
 *
 * 1. TRAVEL/ENDEMIC HISTORY — The key to unlocking the correct diagnosis.
 *    Without asking about travel history to endemic regions, the trainee
 *    will treat this as ACS and miss the viral etiology.
 *
 * 2. ST-ELEVATION INTERPRETATION — ST elevation in II, III, aVF, V4-V6
 *    with elevated troponin mimics STEMI. The trainee must consider
 *    myocarditis vs MI when angiography is clean.
 *
 * 3. DENGUE CLASSIFICATION — WHO classification framework, warning signs
 *    for hemorrhagic/shock progression, and organ-specific complications.
 *
 * 4. TREATMENT PARADOX — NSAIDs are typically AVOIDED in dengue due to
 *    hemorrhage risk, but are FIRST-LINE for pericarditis/myocarditis.
 *    The trainee must weigh risk vs benefit.
 *
 * 5. CARDIAC MRI DECISION — Recognizing that cardiac MRI with gadolinium
 *    is the key diagnostic tool for myocarditis when angiography is normal.
 *
 * Based on: WHO Dengue Classification 2009, ESC Myocarditis Guidelines,
 * AHA Cardiac MRI Recommendations, PMC10402786 case data.
 * ===========================================================================
 */

export const dengueMycoarditisScenario: ScenarioDefinition = {
  id: "dengue-myocarditis-43m",
  name: "Dengue Myocarditis Mimicking ACS",
  description: `Mr. Carlos Mendez, 43, presents to the ED with moderate-intensity, continuous crushing chest pain radiating to the lower jaw and left shoulder that has been worsening over 2 days. Five days earlier he presented with fever, headache, retro-orbital pain, myalgias, and arthralgias — dengue IgM was positive. He recently traveled from Bolivia. His ECG shows ST elevation in II, III, aVF, and V4-V6 with troponin markedly elevated. This case challenges the trainee to differentiate viral myocarditis from acute MI, navigate dengue-specific complications, and make nuanced treatment decisions where standard protocols conflict.`,

  patientName: "Mr. Mendez",

  patientPersona: `You are Carlos Mendez, a 43-year-old construction foreman who moved from Santa Cruz, Bolivia to the US about 3 years ago. You speak English well but with a noticeable accent.

BACKGROUND:
- You visited family in Bolivia 3 weeks ago and returned 10 days ago
- About 5 days ago you got really sick: high fever, terrible headache (especially behind your eyes), body aches everywhere, and joint pain
- You went to the ER then and they told you it was "dengue" and sent you home with instructions to rest and drink fluids
- No significant past medical history — you consider yourself healthy and strong
- You don't take any regular medications
- You don't smoke. You drink beer on weekends, maybe 3-4 per sitting.
- No family history of heart disease that you know of
- You work hard physical labor normally

CURRENT SYMPTOMS (describe in your own words, NEVER use medical terms):
- Crushing chest pain in the center of your chest — "Like someone is sitting on my chest, squeezing hard"
- The pain goes up to your jaw and down your left arm — "It aches in my jaw and my left arm feels heavy and sore"
- The pain started 2 days ago as mild discomfort but has gotten much worse — "It was just a little tight feeling at first, now it's really bad"
- You feel short of breath — "It's harder to breathe, especially when I try to take a deep breath"
- You still have some body aches from the dengue — "My muscles are still sore from being sick"
- You had the hiccups for a few hours yesterday — "I kept hiccupping and couldn't stop"
- You feel nauseated — "My stomach feels upset, like I could throw up"
- You're very worried because the chest pain reminds you of what you heard heart attacks feel like

BEHAVIOR:
- You are anxious but not in extreme distress — you can speak in full sentences
- You are cooperative and answer questions honestly
- You are worried this is a heart attack — "Am I having a heart attack? My uncle died of one at 50"
- If asked about travel: immediately mention Bolivia trip and the dengue diagnosis
- If asked about fever: say you still feel a bit warm but much better than 5 days ago
- If asked about bleeding: say no unusual bleeding, no rashes, no bruising
- If asked about the dengue: describe the fever, headache behind the eyes, terrible body aches, joint pain
- You do NOT know medical terms. You don't know what "myocarditis" means.
- If they tell you it's not a heart attack, you're relieved but confused — "Then what is it? Why does my chest hurt so bad?"`,

  baselineVitals: {
    hr: 95,
    bpSystolic: 118,
    bpDiastolic: 72,
    spo2: 97,
    temp: 37.4,
    respRate: 18,
  },

  deteriorationRules: [
    // Phase 1: Without ECG — can't identify ST changes
    {
      id: "dengue-no-ecg",
      condition: "No ECG — ST elevation pattern undetected",
      timerMinutes: 4,
      effect: { hr: 105 },
      preventedBy: [
        "order_ecg",
        "check_rhythm",
      ],
    },
    // Phase 2: Without cardiac monitoring — arrhythmia risk
    {
      id: "dengue-no-monitoring",
      condition: "No continuous cardiac monitoring — dengue myocarditis arrhythmia risk",
      timerMinutes: 8,
      effect: { hr: 115, bpSystolic: 100, bpDiastolic: 60 },
      preventedBy: [
        "check_vitals",
        "order_ecg",
        "continuous_monitoring",
      ],
    },
    // Phase 3: Incorrect ACS treatment with aggressive anticoagulation
    // (Not a timer-based deterioration — handled by scoring)

    // Phase 4: Without echo — structural damage undetected
    {
      id: "dengue-no-echo",
      condition: "Myocardial inflammation undetected — pericardial effusion developing",
      timerMinutes: 12,
      effect: { hr: 110, bpSystolic: 95, bpDiastolic: 58 },
      preventedBy: [
        "order_echo",
        "bedside_echo",
        "order_cardiac_mri",
      ],
    },
    // Phase 5: Without anti-inflammatory treatment — progressive myocarditis
    {
      id: "dengue-no-treatment",
      condition: "Untreated myocarditis — progressive myocardial inflammation and dysfunction",
      timerMinutes: 18,
      effect: { hr: 120, bpSystolic: 85, bpDiastolic: 50, spo2: 93 },
      preventedBy: [
        "administer_nsaids",
        "administer_colchicine",
        "administer_aspirin_hd",
        "give_aspirin",
      ],
    },
  ],

  correctActions: [
    // IMMEDIATE
    "check_vitals",
    "establish_iv_access",
    "order_ecg",
    "administer_oxygen",
    // HISTORY (critical for diagnosis)
    "take_travel_history",
    "check_heart_sounds",
    "check_lung_sounds",
    "check_abdomen",
    // DIAGNOSTIC LABS
    "order_troponin",
    "order_bnp",
    "order_cbc",
    "order_bmp",
    "order_coagulation",
    "order_crp",
    "order_dengue_serology",
    "order_liver_enzymes",
    // IMAGING (critical pathway)
    "order_chest_xray",
    "order_echo",
    "order_coronary_angiography",
    "order_cardiac_mri",
    // TREATMENT
    "administer_nsaids",
    "administer_colchicine",
    "administer_aspirin_hd",
    // MONITORING
    "continuous_monitoring",
    "call_for_help",
    "consult_cardiology",
  ],

  labResults: {
    // CARDIAC BIOMARKERS
    troponin:
      "Troponin T: 154 ng/L (ELEVATED — normal <14). Indicates myocardial injury. In the context of ST elevation, this is consistent with either acute MI or myocarditis. MUST correlate with angiography to differentiate.",
    bnp: "NT-proBNP: 678 pg/mL (ELEVATED — normal <125). Indicates myocardial stress/strain. Elevated in both MI and myocarditis. Correlate with echocardiography for ventricular function.",
    cpk: "Creatine Phosphokinase (CPK): 88 U/L (NORMAL — normal <308). Normal CPK with elevated troponin is atypical for large MI. More consistent with focal myocardial inflammation (myocarditis).",

    // HEMATOLOGY & METABOLIC
    cbc: "WBC: 8,700/μL (normal differential — no left shift). Hgb: 12.6 g/dL (normal). Hct: 39.2% (normal — no hemoconcentration, argues against dengue hemorrhagic fever). Plt: 263,000/μL (normal — no thrombocytopenia, favorable prognostic sign).",
    bmp: "Na: 142, K: 4.6, Cl: 103, CO2: 24, BUN: 15, Cr: 0.7 (normal renal function), Glucose: 108. All within normal limits. No electrolyte derangement.",
    coagulation:
      "PT: 12.5s (normal), INR: 1.0, aPTT: 30s (normal). Normal coagulation — no DIC (important in dengue). Safe for procedures but caution with anticoagulation in viral myocarditis.",
    liver_enzymes:
      "AST: 45 U/L (mildly elevated), ALT: 52 U/L (mildly elevated), LDH: 280 U/L (mildly elevated). Mild transaminitis — can be seen in dengue (hepatic involvement) or from myocardial injury. No acute liver failure.",
    crp: "CRP: 48 mg/L (ELEVATED — normal <5). Indicates active inflammatory process. Supports myocarditis/pericarditis over pure ischemic ACS. Serial CRP useful to monitor treatment response.",

    // INFECTIOUS
    dengue_serology:
      "Dengue ELISA IgM: POSITIVE (confirms recent dengue infection — IgM detectable from first week up to 3 months). Dengue RT-PCR: POSITIVE (confirms active/recent viral replication). Dengue IgG: Negative (primary infection — not secondary, lower hemorrhagic risk). NS1 Antigen: Weakly positive (late in course, typically positive within first 7 days).",

    // ECG
    ecg: "Sinus rhythm, rate 95 bpm. ST segment elevation of 2mm in leads II, III, aVF, and V4 to V6. No reciprocal ST depression. No pathological Q waves. Normal PR interval. Normal QRS duration. INTERPRETATION: Diffuse ST elevation pattern (multiple vascular territories) is more consistent with myocarditis/pericarditis than single-vessel ACS. The ABSENCE of reciprocal changes and involvement of non-contiguous territories favors inflammatory etiology.",

    // IMAGING
    chest_xray:
      "PA and lateral: Heart size normal (CTR 48%). Lungs clear bilaterally. No pleural effusions. No pneumothorax. No pulmonary congestion. Mediastinum normal. IMPRESSION: Normal chest radiograph.",
    echo: "Transthoracic echocardiography: LVEF 66% (Simpson's method — preserved). Normal systolic function in both ventricles. Preserved diastolic function. Longitudinal deformation (strain): –19.8% (borderline — minor decrease in basal and medial inferoseptal segments). PARIETAL PERICARDIUM: enlarged and diffusely hyperechogenic (consistent with pericardial inflammation). No pericardial effusion. No wall motion abnormalities. No valvular abnormalities. IMPRESSION: Preserved ventricular function with pericardial thickening suggesting acute pericarditis. Subtle strain abnormalities in inferoseptal wall.",
    coronary_angiography:
      "Coronary angiography: LEFT MAIN: Normal. LAD: No significant stenosis. LCx: No significant stenosis. RCA: No significant stenosis. IMPRESSION: NORMAL CORONARY ARTERIES — no significant obstructive disease. ST elevation is NOT from coronary occlusion. Myocarditis/pericarditis is the most likely etiology.",
    cardiac_mri:
      "Cardiac MRI with Gadolinium: LVEF 52% (mildly reduced — lower than echo, MRI is more accurate). Normal-sized cardiac chambers. Preserved RV function. MILD HYPOKINESIA of inferior wall (basal and medial segments). MYOCARDIAL EDEMA in inferior wall with inferoseptal extension on T2-weighted sequences (active inflammation). LATE GADOLINIUM ENHANCEMENT (LGE) in basal, medial, inferior basal, and inferoseptal segments — subepicardial/mid-wall pattern (NON-ISCHEMIC pattern — confirms myocarditis, NOT MI). Pericardial gadolinium uptake in basal region (active pericarditis). IMPRESSION: ACUTE MYOPERICARDITIS — pattern consistent with viral myocarditis. Non-ischemic LGE distribution confirms inflammatory etiology, excluding MI.",

    // ADDITIONAL
    blood_type: "Type O positive. Crossmatch: Ready.",
    toxicology_screen: "Urine drug screen: Negative for all substances.",
  },

  examFindings: {
    // GENERAL
    gen_appearance:
      "Middle-aged male, alert, mildly distressed from chest pain. Sitting upright in bed. Able to speak in full sentences. Mild diaphoresis. BMI appears normal.",
    gen_skin_color:
      "Normal skin color. No pallor. No cyanosis. No jaundice. No petechiae or purpura (important — no hemorrhagic dengue manifestations). No rash.",
    gen_resp_effort:
      "Mild tachypnea (RR 18). No accessory muscle use. Comfortable at rest. Slight increase in effort with deep breathing (pleuritic component).",
    gen_consciousness:
      "Alert and oriented x4. Anxious but cooperative. GCS 15/15. No confusion.",
    // HEAD & NECK
    hn_jvp:
      "JVP normal (3cm above sternal angle). No jugular venous distension.",
    hn_oral_cavity:
      "Moist mucous membranes. No gingival bleeding (important — hemorrhagic dengue marker). No oral petechiae.",
    hn_pupils: "PERRL 3mm bilaterally. No RAPD.",
    // CARDIOVASCULAR
    cv_heart_sounds:
      "Regular rhythm, rate ~95 bpm. Normal S1/S2. PERICARDIAL FRICTION RUB heard best at left lower sternal border with patient leaning forward — a scratchy, triphasic sound (atrial systole, ventricular systole, early diastole). This is the KEY FINDING — pathognomonic for pericarditis. No murmurs. No gallop.",
    cv_peripheral_pulses:
      "Regular, normal volume bilaterally. No radio-radial delay. No BP differential between arms (argues against aortic dissection).",
    cv_cap_refill: "CRT 2 seconds (normal — no shock).",
    cv_edema: "No peripheral edema. No ascites.",
    // RESPIRATORY
    resp_breath_sounds:
      "Clear air entry bilaterally. No wheeze. No crackles. No pleural rub. No reduced breath sounds.",
    resp_percussion: "Resonant throughout. No dullness.",
    // ABDOMINAL
    abd_light_palpation:
      "Soft, non-tender. Liver edge NOT palpable (no hepatomegaly — important dengue warning sign to check). Spleen not palpable. No guarding. No rebound.",
    abd_bowel_sounds: "Active, normal bowel sounds in all quadrants.",
    // NEUROLOGICAL
    neuro_gcs: "GCS E4V5M6 = 15. Fully alert and oriented.",
    neuro_motor: "Power 5/5 all limbs. Normal tone. No focal deficits.",
    // SKIN
    skin_inspection:
      "No petechiae. No purpura. No ecchymoses. No tourniquet test petechiae. No maculopapular rash (can be seen in recovery phase of dengue). Old insect bite marks on forearms (consistent with tropical exposure).",
    skin_temperature: "Warm peripherally. Core temp 37.4°C (low-grade).",
    skin_turgor: "Normal turgor. Well hydrated.",
    // MUSCULOSKELETAL
    ms_joints:
      "Mild residual tenderness in large joints (knees, shoulders) — consistent with recent dengue arthralgia. No joint swelling or erythema. Full range of motion.",
  },
};
