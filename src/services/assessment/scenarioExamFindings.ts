// ============================================================================
// Scenario-Specific Physical Exam Findings
//
// Maps scenario IDs to their abnormal physical examination findings.
// Keys are exam finding IDs from physicalExamService.ts (EXAM_FINDINGS).
// Values are the abnormal finding text that replaces the normal finding.
//
// Only abnormal findings need to be listed — anything not listed will show
// the default normal finding from EXAM_FINDINGS.
// ============================================================================

export const SCENARIO_EXAM_FINDINGS: Record<string, Record<string, string>> = {
  // ══════════════════════════════════════════════════════════════════════════
  // SEPSIS — 72F (Mrs. Gable)
  // ══════════════════════════════════════════════════════════════════════════
  "sepsis-72f": {
    gen_appearance:
      "Elderly female, appears acutely unwell, confused, shivering. Lying in bed with eyes closed.",
    gen_skin_color:
      "Pale, mottled peripheries. CRT 4 seconds. Cool extremities.",
    gen_resp_effort:
      "Mildly increased respiratory effort, no accessory muscle use",
    gen_consciousness:
      "Confused, oriented to person only. GCS E3V4M6 = 13. Fluctuating attention.",
    hn_conjunctivae: "Pale conjunctivae suggesting anaemia",
    hn_oral_cavity:
      "Dry mucous membranes, coated tongue. No oral lesions.",
    cv_heart_sounds: "S1S2 present, tachycardic. No murmurs.",
    cv_peripheral_pulses: "Weak, thready, tachycardic peripherally",
    cv_cap_refill: "CRT 4 seconds (prolonged — poor perfusion)",
    resp_breath_sounds:
      "Reduced air entry right base. Coarse crackles right lower zone. Left lung clear.",
    abd_light_palpation:
      "Soft, mild suprapubic tenderness. No guarding or rigidity.",
    skin_temperature: "Cool peripheries, warm centrally. Temperature 39.1°C.",
    skin_turgor: "Reduced skin turgor — tenting noted. Dehydrated.",
    pv_pedal_pulses: "Weak pedal pulses bilaterally",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MI — 65M (Mr. Thompson)
  // ══════════════════════════════════════════════════════════════════════════
  "mi-65m": {
    gen_appearance:
      "Middle-aged male, diaphoretic, clutching chest. Appears anxious and in distress.",
    gen_skin_color:
      "Grey/ashen complexion. Diaphoretic. CRT 3 seconds.",
    gen_consciousness: "Alert but anxious. Oriented x4.",
    hn_jvp: "JVP mildly elevated at 4cm above sternal angle",
    cv_heart_sounds:
      "S1S2 present. Faint S4 gallop at apex. No murmurs. Tachycardic.",
    cv_peripheral_pulses: "Regular but weak peripheral pulses",
    cv_cap_refill: "CRT 3 seconds (mildly prolonged)",
    cv_edema: "No peripheral edema",
    resp_breath_sounds:
      "Bilateral fine basal crackles (early pulmonary congestion). No wheeze.",
    skin_temperature:
      "Cool, clammy skin. Diaphoresis noted across forehead and palms.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ANAPHYLAXIS — 28F
  // ══════════════════════════════════════════════════════════════════════════
  "anaphylaxis-28f": {
    gen_appearance:
      "Young female, acutely distressed, visibly swollen face and lips. Audible wheeze. Scratching arms.",
    gen_skin_color:
      "Flushed face and trunk. Pale peripherally. CRT 3 seconds.",
    gen_resp_effort:
      "Marked respiratory distress, using accessory muscles. Audible inspiratory stridor and expiratory wheeze.",
    hn_oral_cavity:
      "Significant lip and tongue angioedema. Uvula swollen. Voice hoarse.",
    hn_lymph_nodes: "No lymphadenopathy",
    cv_heart_sounds: "S1S2 tachycardic. No murmurs.",
    cv_peripheral_pulses: "Tachycardic, weak peripheral pulses",
    cv_cap_refill: "CRT 3 seconds",
    resp_chest_wall: "Bilateral hyperexpansion. Using accessory muscles.",
    resp_breath_sounds:
      "Widespread bilateral expiratory wheeze. Reduced air entry throughout. Inspiratory stridor.",
    skin_inspection:
      "Widespread urticaria (raised, erythematous welts) over trunk, arms, and legs. Facial and periorbital angioedema.",
    skin_temperature: "Warm, flushed centrally. Cool peripherally.",
    abd_light_palpation: "Soft, mild diffuse tenderness. Active bowel sounds (cramping).",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ASTHMA — 19M
  // ══════════════════════════════════════════════════════════════════════════
  "asthma-19m": {
    gen_appearance:
      "Young male, sitting upright (tripod position), unable to complete sentences. Visibly tachypnoeic.",
    gen_resp_effort:
      "Severe respiratory distress. Using accessory muscles (sternocleidomastoid, intercostal recession). Cannot speak in full sentences.",
    gen_consciousness: "Alert but fatigued. Oriented x4.",
    resp_chest_wall:
      "Hyperexpanded chest. Bilateral reduced chest expansion. Intercostal recession.",
    resp_percussion: "Hyper-resonant throughout bilaterally",
    resp_breath_sounds:
      "Widespread bilateral polyphonic expiratory wheeze. Prolonged expiratory phase. Reduced air entry at bases.",
    resp_peak_flow:
      "PEF 35% predicted (severe — life-threatening if <33%)",
    resp_pattern:
      "RR 28, prolonged expiration, accessory muscle use. I:E ratio approximately 1:4.",
    cv_heart_sounds: "S1S2 tachycardic. Difficult to auscultate through wheeze.",
    skin_temperature: "Warm, slightly diaphoretic",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // STROKE — 58M (Mr. Davis)
  // ══════════════════════════════════════════════════════════════════════════
  "stroke-58m": {
    gen_appearance:
      "Middle-aged male, lying in bed. Left facial droop obvious. Left arm lying limp at side.",
    gen_consciousness:
      "Drowsy but rousable. Oriented to person and place, not time. Dysarthric speech.",
    hn_pupils: "Right pupil 3mm reactive, left pupil 3mm reactive. PERRL. No RAPD.",
    neuro_gcs: "GCS E3V4M5 = 12. Confused speech, localises to pain on left.",
    neuro_pupils: "PERRL. No relative afferent pupillary defect. Normal fundoscopy.",
    neuro_cranial_nerves:
      "Left facial droop (UMN pattern — forehead sparing). Left tongue deviation. Dysarthria. Right gaze preference.",
    neuro_motor:
      "LEFT hemiparesis: arm 2/5, leg 3/5. Right limbs 5/5. Increased tone left side.",
    neuro_sensory:
      "Reduced sensation to light touch and pin-prick on LEFT side (face, arm, leg). Extinction on bilateral simultaneous stimulation.",
    neuro_reflexes:
      "Brisk reflexes left side (3+). Left Babinski positive (upgoing plantar). Right side 2+ with downgoing plantar.",
    neuro_cerebellar: "Unable to assess left side due to weakness. Right side normal.",
    neuro_nihss:
      "NIHSS 14: Gaze preference (1), visual field deficit (1), facial palsy (2), left arm motor (3), left leg motor (2), limb ataxia (0), sensory (1), language (1), dysarthria (1), extinction (2).",
    cv_heart_sounds: "S1S2, regular rate. No murmurs. No atrial fibrillation detected.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // DKA — 34F (Ms. Reyes)
  // ══════════════════════════════════════════════════════════════════════════
  "dka-34f": {
    gen_appearance:
      "Young female, appears dehydrated and lethargic. Deep, rapid breathing (Kussmaul).",
    gen_skin_color:
      "Dry skin, reduced turgor. Sunken eyes. CRT 3 seconds.",
    gen_resp_effort:
      "Kussmaul breathing — deep, laboured breathing at rate 28/min. No wheeze or stridor.",
    gen_consciousness:
      "Drowsy but rousable. Confused — oriented to person only. Slow to respond.",
    hn_oral_cavity:
      "Dry, cracked lips. Dry mucous membranes. Fruity odour to breath (ketones).",
    hn_conjunctivae: "Sunken eyes. No pallor.",
    cv_heart_sounds: "S1S2 tachycardic. No murmurs.",
    cv_peripheral_pulses: "Tachycardic, weak and thready",
    cv_cap_refill: "CRT 3 seconds (dehydration)",
    resp_breath_sounds:
      "Clear lung fields bilaterally. Deep Kussmaul respiratory pattern.",
    resp_pattern:
      "Kussmaul breathing: deep, regular, rate 28/min. Compensatory respiratory alkalosis.",
    abd_light_palpation:
      "Diffuse abdominal tenderness (DKA-related). No guarding or rigidity. Active bowel sounds.",
    skin_turgor: "Markedly reduced — skin tenting present. Severely dehydrated.",
    skin_temperature: "Warm centrally, cool peripheries. Dry skin throughout.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TRAUMA — 42M (Mr. Kowalski)
  // ══════════════════════════════════════════════════════════════════════════
  "trauma-42m": {
    gen_appearance:
      "Male on spinal board with cervical collar. Multiple visible injuries. Moaning in pain.",
    gen_skin_color:
      "Pale, diaphoretic. Mottled lower extremities. CRT 4 seconds.",
    gen_consciousness:
      "Opens eyes to voice, confused speech, localises pain. GCS E3V4M5 = 12.",
    hn_pupils: "PERRL, 4mm bilaterally. No RAPD.",
    hn_oral_cavity: "Blood in oropharynx. Airway patent with jaw thrust.",
    resp_chest_wall:
      "Asymmetric chest expansion — reduced on RIGHT side. Subcutaneous emphysema right chest wall.",
    resp_percussion:
      "Hyper-resonant RIGHT chest (pneumothorax). Normal resonance LEFT.",
    resp_breath_sounds:
      "ABSENT breath sounds RIGHT hemithorax. Normal vesicular sounds LEFT. Right-sided pneumothorax.",
    resp_fremitus:
      "Reduced tactile fremitus RIGHT side. Normal LEFT.",
    cv_heart_sounds: "S1S2 tachycardic. Heart sounds not displaced.",
    cv_peripheral_pulses: "Weak, rapid, thready pulses",
    cv_cap_refill: "CRT 4 seconds (hypovolaemic shock)",
    abd_inspection:
      "Abdominal distension. Bruising left flank (Grey Turner sign). Seat belt mark across abdomen.",
    abd_light_palpation:
      "Diffuse tenderness. Involuntary guarding. Peritonism. Do not perform deep palpation.",
    msk_limb_inspection:
      "Obvious deformity RIGHT femur (mid-shaft). Swelling and bruising over pelvis. Left forearm laceration.",
    msk_bony_tenderness:
      "Tenderness over pelvis bilaterally. Unstable pelvis on gentle springing (DO NOT repeat). Right femoral tenderness.",
    pv_pedal_pulses:
      "Left pedal pulses present. Right pedal pulses difficult to palpate (femoral fracture).",
    skin_wound:
      "4cm laceration left forearm (controlled). Multiple abrasions. Right leg shortened and externally rotated.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PEDIATRIC SEIZURE — 4M (Liam)
  // ══════════════════════════════════════════════════════════════════════════
  "peds-seizure-4m": {
    gen_appearance:
      "4-year-old male, actively seizing (tonic-clonic). Mother at bedside, very distressed.",
    gen_skin_color: "Cyanotic centrally. CRT 3 seconds.",
    gen_resp_effort:
      "Irregular respiratory effort during seizure. Intermittent apnoea with desaturation.",
    gen_consciousness:
      "Unresponsive during seizure. Post-ictal: opens eyes to pain, incomprehensible sounds, flexion withdrawal. GCS E2V2M4 = 8.",
    hn_pupils:
      "Pupils 5mm bilaterally, sluggishly reactive (during seizure). Post-ictal: 4mm, reactive.",
    hn_oral_cavity:
      "Excess saliva. No blood or tongue injury. Airway patency intermittent during seizure.",
    hn_neck_stiffness:
      "Unable to assess during seizure. Post-ictal: no neck stiffness (reassuring for meningitis).",
    cv_heart_sounds: "S1S2 tachycardic (rate ~160). No murmurs.",
    skin_temperature:
      "Hot to touch — temperature 39.8°C. Flushed. No rash (excludes meningococcal).",
    skin_inspection:
      "No petechial or purpuric rash. No signs of non-accidental injury.",
    neuro_gcs:
      "During seizure: GCS 3 (unresponsive). Post-ictal (5 min): E2V2M4 = 8. Improving gradually.",
    neuro_motor:
      "During seizure: bilateral tonic-clonic movements, symmetrical. Post-ictal: generalised hypotonia.",
    neuro_reflexes: "Post-ictal: brisk but symmetrical. Plantars downgoing.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // ECLAMPSIA — 29F (Mrs. Okafor)
  // ══════════════════════════════════════════════════════════════════════════
  "eclampsia-29f": {
    gen_appearance:
      "Pregnant female (34 weeks), post-seizure. Confusion and agitation. Facial and pedal oedema.",
    gen_skin_color: "Flushed face. Peripheral pallor. CRT 2 seconds.",
    gen_consciousness:
      "Post-ictal confusion. Oriented to person only. Severe headache reported. Visual disturbance (blurring, flashing lights).",
    gen_resp_effort: "Slightly increased respiratory rate. No distress.",
    hn_pupils: "PERRL 3mm bilaterally. No papilloedema on fundoscopy.",
    cv_heart_sounds: "S1S2 tachycardic (rate 105). No murmurs. Hyperdynamic circulation of pregnancy.",
    cv_peripheral_pulses: "Bounding pulses bilaterally",
    cv_edema:
      "Significant bilateral pedal oedema (3+ pitting). Facial oedema. Puffy hands.",
    resp_breath_sounds: "Clear bilaterally. No pulmonary oedema.",
    abd_inspection:
      "Gravid uterus consistent with 34 weeks gestation. No surgical scars.",
    abd_light_palpation:
      "Non-tender gravid uterus. Fundal height 34cm. Cephalic presentation. Right upper quadrant tenderness (liver capsule distension — HELLP).",
    neuro_reflexes:
      "Hyperreflexia (3+) bilateral. Clonus present at ankles (4 beats bilaterally). Upgoing plantars.",
    pv_lower_limb:
      "Bilateral significant pitting oedema to mid-shin. No erythema or tenderness (not DVT).",
    skin_turgor: "Normal turgor. Third-space fluid shifts.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CARDIAC ARREST — 55M (Mr. Patel)
  // ══════════════════════════════════════════════════════════════════════════
  "cardiac-arrest-55m": {
    gen_appearance:
      "Unresponsive male, collapsed on floor/bed. No breathing. Cyanotic.",
    gen_skin_color:
      "Cyanotic centrally and peripherally. Grey/ashen. CRT >5 seconds (no perfusion).",
    gen_resp_effort: "ABSENT respiratory effort. Apnoeic.",
    gen_consciousness: "UNRESPONSIVE. GCS 3 (E1V1M1). No response to pain.",
    hn_pupils:
      "Fixed, dilated pupils (6mm bilaterally). Non-reactive. (May improve post-ROSC.)",
    cv_heart_sounds:
      "NO heart sounds. No pulse. Ventricular fibrillation on monitor.",
    cv_peripheral_pulses: "NO palpable pulses (carotid, radial, femoral)",
    cv_cap_refill: "CRT >5 seconds — no perfusion",
    resp_breath_sounds: "NO breath sounds. Apnoeic.",
    neuro_gcs: "GCS 3/15 (E1V1M1). Unresponsive to all stimuli.",
    neuro_pupils:
      "Fixed dilated pupils 6mm. Non-reactive. (Post-ROSC: may return to reactive.)",
    skin_temperature: "Warm centrally (recent arrest). Core temperature 36.5°C.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // OVERDOSE — 22M (Tyler)
  // ══════════════════════════════════════════════════════════════════════════
  "overdose-22m": {
    gen_appearance:
      "Young male, obtunded, found by flatmate. Multiple needle marks on arms. Drug paraphernalia nearby.",
    gen_skin_color:
      "Cyanotic lips and nail beds. Pale. CRT 3 seconds.",
    gen_resp_effort:
      "Minimal respiratory effort. RR 6. Shallow breathing. Intermittent apnoea.",
    gen_consciousness:
      "Obtunded. Responds to pain only (withdrawal). GCS E2V2M4 = 8.",
    hn_pupils:
      "Pinpoint pupils bilaterally (1-2mm). Reactive but miotic. Classic opioid toxidrome.",
    hn_oral_cavity:
      "Airway at risk — secretions pooling. Weak gag reflex. No vomitus currently.",
    cv_heart_sounds: "S1S2, bradycardic (rate 55). No murmurs.",
    cv_peripheral_pulses: "Bradycardic, weak but palpable",
    resp_breath_sounds:
      "Reduced air entry bilaterally. No crackles or wheeze. Hypoventilation pattern.",
    resp_pattern:
      "RR 6, shallow breaths. Intermittent apnoeic pauses of 5-8 seconds.",
    skin_inspection:
      "Multiple track marks (needle puncture scars) on bilateral antecubital fossae and forearms. No cellulitis or abscess.",
    skin_temperature: "Cool peripheries. Core temperature 36.0°C (mildly hypothermic).",
    neuro_gcs:
      "GCS E2V2M4 = 8. Opens eyes to pain. Incomprehensible sounds. Withdrawal to pain.",
    neuro_reflexes: "Globally reduced reflexes. Downgoing plantars.",
  },
  // ══════════════════════════════════════════════════════════════════════════
  // DENGUE MYOCARDITIS — 43M (Mr. Mendez)
  // ══════════════════════════════════════════════════════════════════════════
  "dengue-myocarditis-43m": {
    gen_appearance:
      "Middle-aged male, alert, mildly distressed from chest pain. Sitting upright. Able to speak in full sentences. Mild diaphoresis.",
    gen_skin_color:
      "Normal skin color. No petechiae or purpura (no hemorrhagic dengue). No rash. No jaundice.",
    cv_heart_sounds:
      "Regular rhythm ~95 bpm. Normal S1/S2. PERICARDIAL FRICTION RUB at left lower sternal border — scratchy, triphasic sound best heard with patient leaning forward. Pathognomonic for pericarditis. No murmurs.",
    cv_peripheral_pulses:
      "Regular, normal volume bilaterally. No radio-radial delay. No BP differential between arms.",
    cv_cap_refill: "CRT 2 seconds (normal).",
    resp_breath_sounds:
      "Clear air entry bilaterally. No wheeze. No crackles. No pleural rub.",
    abd_light_palpation:
      "Soft, non-tender. Liver NOT palpable (no hepatomegaly — important dengue warning sign to exclude). No splenomegaly.",
    hn_oral_cavity:
      "Moist mucous membranes. No gingival bleeding. No oral petechiae.",
    skin_inspection:
      "No petechiae. No purpura. No ecchymoses. No tourniquet test petechiae. Old insect bite marks on forearms (tropical exposure). No maculopapular rash.",
    skin_temperature: "Warm peripherally. Core temp 37.4°C (low-grade fever).",
    neuro_gcs: "GCS E4V5M6 = 15. Fully alert and oriented.",
    ms_joints:
      "Mild residual tenderness in large joints (knees, shoulders) — residual dengue arthralgia. No swelling or erythema.",
  },
};

/**
 * Get scenario-specific exam findings by scenario ID.
 * Returns undefined if no specific findings are defined (all findings will be normal).
 */
export function getScenarioExamFindings(
  scenarioId: string,
): Record<string, string> | undefined {
  return SCENARIO_EXAM_FINDINGS[scenarioId];
}
