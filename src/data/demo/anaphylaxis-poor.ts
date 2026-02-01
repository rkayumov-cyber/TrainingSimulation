import type { DemoTranscript } from "../../types/demo";

export const anaphylaxisPoor: DemoTranscript = {
  id: "demo-anaphylaxis-poor",
  scenarioId: "anaphylaxis-28f",
  scenarioName: "Severe Anaphylaxis — Poor Performance",
  level: "poor",
  grade: "F",
  totalScore: 30,
  maxPossibleScore: 185,
  summary:
    "Dangerous anaphylaxis mismanagement. Epinephrine never given IM — IV epinephrine administered instead (harmful in non-arrest setting). Only antihistamine given as primary treatment (grossly insufficient). Oral steroids given instead of IV (ineffective acutely). Heavy medical jargon caused patient distress. Patient deteriorated to SpO2 75% with imminent airway loss. Multiple critical actions missed or performed incorrectly.",
  steps: [
    {
      id: "ana-poor-1",
      elapsedSeconds: 0,
      vitals: { hr: 120, bpSystolic: 85, bpDiastolic: 50, spo2: 89, temp: 37.0, respRate: 28 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Anaphylaxis scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Patient presents with tachycardia (HR 120), hypotension (85/50), hypoxia (SpO2 89%), and tachypnoea (RR 28). This is a time-critical emergency requiring immediate epinephrine IM.",
    },
    {
      id: "ana-poor-2",
      elapsedSeconds: 30,
      doctorMessage: "Ms. Chen, it looks like you're in distributive shock with angioedema. We need to act quickly. What did you eat?",
      patientResponse:
        "Shock?! Angio-what?! I ate peanuts... oh God am I going to die?! I can't breathe!",
      vitals: { hr: 124, bpSystolic: 83, bpDiastolic: 48, spo2: 88, temp: 37.0, respRate: 30 },
      events: [],
      feedbackLogs: [
        { id: "f1", type: "jargon", message: "Used 'distributive shock' and 'angioedema' with patient — caused severe distress", timestamp: 30 },
        { id: "f2", type: "error", message: "Patient now panicking — medical terminology is inappropriate for patient communication", timestamp: 30 },
      ],
      scoringImpact: { pointsEarned: -5, reason: "Jargon caused patient panic and worsened clinical situation" },
      annotation:
        "Telling a frightened patient she has 'distributive shock with angioedema' is harmful. The patient has no way to understand these terms and is now panicking, which increases oxygen demand and worsens her condition. Plain language like 'a serious allergic reaction' is appropriate. Also — asking about food history is a waste of critical seconds when the diagnosis is already obvious.",
    },
    {
      id: "ana-poor-3",
      elapsedSeconds: 75,
      doctorMessage: "Let me give you some Piriton to help with this allergic reaction. This should settle things down.",
      actionParsed: "give_antihistamine",
      actionFeedback: "Chlorphenamine 10mg IV administered.",
      vitals: { hr: 128, bpSystolic: 80, bpDiastolic: 45, spo2: 86, temp: 37.0, respRate: 31 },
      events: [
        { id: "e2", type: "action", description: "Chlorphenamine 10mg IV administered", timestamp: 75 },
        { id: "e3", type: "deterioration", description: "Patient continuing to deteriorate — no epinephrine given", timestamp: 75 },
      ],
      feedbackLogs: [
        { id: "f3", type: "error", message: "Antihistamine alone is INSUFFICIENT for anaphylaxis — epinephrine is mandatory", timestamp: 75 },
        { id: "f4", type: "warning", message: "75 seconds elapsed with no epinephrine — critical delay", timestamp: 75 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Antihistamine given but used as primary treatment — dangerous" },
      annotation:
        "Antihistamine as the sole treatment for severe anaphylaxis is grossly insufficient and dangerous. Chlorphenamine cannot reverse bronchospasm, reduce airway oedema, or restore blood pressure. The doctor's statement that it 'should settle things down' demonstrates a fundamental misunderstanding of anaphylaxis severity. Epinephrine is the ONLY first-line treatment.",
    },
    {
      id: "ana-poor-4",
      elapsedSeconds: 150,
      doctorMessage: "Hmm, you're not improving. Let me also give you some oral prednisolone tablets for the inflammation.",
      actionParsed: "give_steroids",
      actionFeedback: "Prednisolone 40mg oral tablets given. Patient struggling to swallow due to throat swelling.",
      patientResponse: "I... can't... swallow... them... *choking sounds*",
      vitals: { hr: 134, bpSystolic: 75, bpDiastolic: 40, spo2: 82, temp: 37.0, respRate: 34 },
      events: [
        { id: "e4", type: "action", description: "Oral prednisolone attempted — patient unable to swallow", timestamp: 150 },
        { id: "e5", type: "deterioration", description: "Severe airway compromise — patient choking on oral medication", timestamp: 150 },
      ],
      feedbackLogs: [
        { id: "f5", type: "error", message: "Oral steroids given to patient with airway swelling — aspiration risk and ineffective", timestamp: 150 },
        { id: "f6", type: "error", message: "IV hydrocortisone should be used, not oral prednisolone, in acute anaphylaxis", timestamp: 150 },
        { id: "f7", type: "error", message: "STILL no epinephrine at 150 seconds — life-threatening delay", timestamp: 150 },
      ],
      scoringImpact: { pointsEarned: 0, reason: "Oral steroids inappropriate — aspiration risk with airway oedema, no points awarded" },
      annotation:
        "Multiple critical errors: (1) Oral medication given to a patient with severe throat swelling — aspiration risk, (2) Oral steroids are ineffective acutely as they take 4–6 hours to work, (3) IV hydrocortisone 200mg is the correct route and formulation, (4) Steroids are a third-line adjunct — the patient still has not received epinephrine. The patient is now in severe danger with SpO2 82% and worsening airway compromise.",
    },
    {
      id: "ana-poor-5",
      elapsedSeconds: 210,
      doctorMessage: "Your oxygen is quite low. Let me get you some oxygen.",
      actionParsed: "administer_oxygen",
      actionFeedback: "Oxygen applied via simple face mask at 10L/min.",
      vitals: { hr: 138, bpSystolic: 72, bpDiastolic: 38, spo2: 80, temp: 37.0, respRate: 36 },
      events: [
        { id: "e6", type: "action", description: "Oxygen applied — simple face mask at 10L/min", timestamp: 210 },
        { id: "e7", type: "deterioration", description: "Patient in severe cardiovascular and respiratory compromise", timestamp: 210 },
      ],
      feedbackLogs: [
        { id: "f8", type: "warning", message: "Oxygen at 210 seconds — critically delayed", timestamp: 210 },
        { id: "f9", type: "warning", message: "Simple face mask at 10L/min is suboptimal — should use non-rebreather at 15L/min", timestamp: 210 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Oxygen applied but late and suboptimal delivery method" },
      annotation:
        "Oxygen finally applied at 3.5 minutes but with the wrong equipment. A simple face mask at 10L/min delivers only ~40-60% FiO2. This patient with SpO2 of 80% requires a non-rebreather mask at 15L/min (delivering ~85% FiO2). More importantly, without epinephrine the airway oedema is progressing — oxygen delivery will become impossible if the airway occludes completely.",
    },
    {
      id: "ana-poor-6",
      elapsedSeconds: 270,
      patientResponse: "*Stridor worsening* ...can't... breathe...",
      vitals: { hr: 142, bpSystolic: 68, bpDiastolic: 35, spo2: 77, temp: 37.0, respRate: 38 },
      events: [
        { id: "e8", type: "deterioration", description: "Critical desaturation — SpO2 77%, imminent respiratory arrest", timestamp: 270 },
        { id: "e9", type: "alert", description: "WARNING: Airway obstruction imminent — epinephrine urgently required", timestamp: 270 },
      ],
      feedbackLogs: [
        { id: "f10", type: "error", message: "CRITICAL: 4.5 minutes without epinephrine — patient at risk of cardiac arrest", timestamp: 270 },
      ],
      annotation:
        "The patient is in extremis. SpO2 77%, BP 68/35, HR 142. The airway is nearly occluded from progressive angioedema untreated by epinephrine. Without immediate intervention, complete airway obstruction and cardiac arrest are imminent. This was entirely preventable with timely epinephrine IM.",
    },
    {
      id: "ana-poor-7",
      elapsedSeconds: 330,
      doctorMessage: "She's crashing! Push 1mg of adrenaline IV now!",
      actionParsed: "give_epinephrine",
      actionFeedback: "Epinephrine 1mg IV push administered. WARNING: IV epinephrine at this dose is for cardiac arrest only — causes dangerous hypertension and arrhythmia in non-arrest patients.",
      vitals: { hr: 165, bpSystolic: 180, bpDiastolic: 110, spo2: 75, temp: 37.0, respRate: 10 },
      events: [
        { id: "e10", type: "action", description: "Epinephrine 1mg IV push — WRONG ROUTE AND DOSE for non-arrest", timestamp: 330 },
        { id: "e11", type: "deterioration", description: "Dangerous tachycardia and hypertensive surge from IV epinephrine overdose", timestamp: 330 },
      ],
      feedbackLogs: [
        { id: "f11", type: "error", message: "IV epinephrine 1mg is for CARDIAC ARREST ONLY — causes life-threatening arrhythmia", timestamp: 330 },
        { id: "f12", type: "error", message: "Correct dose is 0.5mg IM (1:1000) for anaphylaxis, NOT 1mg IV (1:10,000)", timestamp: 330 },
      ],
      scoringImpact: { pointsEarned: 0, reason: "Epinephrine given by wrong route (IV) at wrong dose (1mg) — harmful, no points" },
      isCriticalAction: true,
      annotation:
        "DANGEROUS ERROR: 1mg IV epinephrine is 10x the correct anaphylaxis dose and via the wrong route. This is the cardiac arrest dose (1:10,000 IV). For anaphylaxis, the correct treatment is 0.5mg IM (1:1000) into the anterolateral thigh. IV epinephrine in a non-arrest patient causes severe hypertension (BP shot to 180/110) and tachyarrhythmia (HR 165) — this can trigger myocardial ischaemia, pulmonary oedema, or ventricular fibrillation.",
    },
    {
      id: "ana-poor-8",
      elapsedSeconds: 390,
      vitals: { hr: 155, bpSystolic: 150, bpDiastolic: 95, spo2: 78, temp: 37.0, respRate: 12 },
      events: [
        { id: "e12", type: "deterioration", description: "Sustained tachyarrhythmia from IV epinephrine overdose", timestamp: 390 },
        { id: "e13", type: "alert", description: "Anaesthetics crash call initiated for emergency intubation", timestamp: 390 },
      ],
      feedbackLogs: [
        { id: "f13", type: "error", message: "Patient now has iatrogenic complications ON TOP of untreated anaphylaxis", timestamp: 390 },
      ],
      annotation:
        "The patient now has TWO problems: (1) inadequately treated anaphylaxis with near-complete airway obstruction, and (2) iatrogenic epinephrine toxicity causing dangerous tachyarrhythmia and hypertensive crisis. Emergency anaesthetic support has been called for definitive airway management. This patient may require emergency surgical airway if intubation fails due to the severe oedema.",
    },
    {
      id: "ana-poor-9",
      elapsedSeconds: 450,
      vitals: { hr: 148, bpSystolic: 140, bpDiastolic: 88, spo2: 75, temp: 37.0, respRate: 10 },
      events: [
        { id: "e14", type: "alert", description: "Simulation complete — patient transferred to critical care", timestamp: 450 },
      ],
      feedbackLogs: [
        { id: "f14", type: "error", message: "No IM epinephrine given — the single most important treatment was missed", timestamp: 450 },
        { id: "f15", type: "error", message: "IV epinephrine at arrest dose caused iatrogenic harm", timestamp: 450 },
        { id: "f16", type: "error", message: "No IV fluids given — hypotension never addressed", timestamp: 450 },
        { id: "f17", type: "info", message: "Final Score: 30/185 — Grade F", timestamp: 450 },
      ],
      annotation:
        "Critically poor performance resulting in life-threatening patient deterioration. Key failures: (1) No IM epinephrine — the single most important intervention in anaphylaxis was never given correctly, (2) IV epinephrine at cardiac arrest dose caused iatrogenic tachyarrhythmia and hypertension, (3) Antihistamine used as primary treatment — grossly insufficient, (4) Oral steroids given to a patient with airway swelling — aspiration risk and ineffective route, (5) Oxygen delayed and delivered suboptimally, (6) No IV fluids or fluid bolus given — hypotension never addressed, (7) Medical jargon ('distributive shock', 'angioedema') caused patient panic. Patient required emergency anaesthetic intervention and critical care admission. Final score: 30/185 = Grade F.",
    },
  ],
};
