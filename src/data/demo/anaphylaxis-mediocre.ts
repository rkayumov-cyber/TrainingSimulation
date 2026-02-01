import type { DemoTranscript } from "../../types/demo";

export const anaphylaxisMediocre: DemoTranscript = {
  id: "demo-anaphylaxis-mediocre",
  scenarioId: "anaphylaxis-28f",
  scenarioName: "Severe Anaphylaxis — Mediocre Performance",
  level: "mediocre",
  grade: "C",
  totalScore: 100,
  maxPossibleScore: 185,
  summary:
    "Delayed and disordered anaphylaxis management. Antihistamine given before epinephrine (incorrect priority), epinephrine delayed to 3 minutes, oxygen applied late, and fluid resuscitation was insufficient. Medical jargon used with the patient. Key actions were eventually completed but timing and sequencing errors reduced effectiveness and endangered the patient.",
  steps: [
    {
      id: "ana-med-1",
      elapsedSeconds: 0,
      vitals: { hr: 120, bpSystolic: 85, bpDiastolic: 50, spo2: 89, temp: 37.0, respRate: 28 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Anaphylaxis scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Patient presents with tachycardia (HR 120), hypotension (85/50), hypoxia (SpO2 89%), and tachypnoea (RR 28). Severe anaphylaxis with cardiovascular compromise. Epinephrine should be given within 60 seconds.",
    },
    {
      id: "ana-med-2",
      elapsedSeconds: 20,
      doctorMessage: "Hi Ms. Chen. What seems to be the problem today?",
      patientResponse:
        "I ate some peanuts... I'm covered in these bumps... my throat feels like it's swelling shut... I can't breathe...",
      vitals: { hr: 122, bpSystolic: 84, bpDiastolic: 49, spo2: 88, temp: 37.0, respRate: 29 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Patient describes classic anaphylaxis symptoms. The doctor's greeting is appropriate but the open-ended question wastes time when the clinical picture is already obvious from the vital signs and presentation.",
    },
    {
      id: "ana-med-3",
      elapsedSeconds: 50,
      doctorMessage: "Okay, it looks like you're having a bad allergic reaction. Let me give you something for the itching and swelling first.",
      actionParsed: "give_antihistamine",
      actionFeedback: "Chlorphenamine 10mg IV administered.",
      vitals: { hr: 124, bpSystolic: 82, bpDiastolic: 48, spo2: 87, temp: 37.0, respRate: 30 },
      events: [
        { id: "e2", type: "action", description: "Chlorphenamine 10mg IV administered", timestamp: 50 },
      ],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "Antihistamine given BEFORE epinephrine — incorrect priority", timestamp: 50 },
        { id: "f2", type: "error", message: "Epinephrine should be the FIRST drug in anaphylaxis, not antihistamines", timestamp: 50 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Antihistamine given but wrong priority — reduced score" },
      annotation:
        "SEQUENCING ERROR: Antihistamines are second-line treatment. They help with urticaria and itching but do NOT reverse bronchospasm, airway oedema, or hypotension. Epinephrine is the ONLY first-line drug. Giving antihistamine first delays the critical intervention and gives a false sense of having 'treated' the patient.",
    },
    {
      id: "ana-med-4",
      elapsedSeconds: 90,
      doctorMessage: "Let me check your airway. Open your mouth for me.",
      actionParsed: "check_airway",
      actionFeedback: "Significant tongue and lip oedema. Audible stridor. Airway compromise imminent.",
      vitals: { hr: 128, bpSystolic: 80, bpDiastolic: 46, spo2: 85, temp: 37.0, respRate: 31 },
      events: [
        { id: "e3", type: "action", description: "Airway assessed — severe angioedema with stridor", timestamp: 90 },
        { id: "e4", type: "deterioration", description: "SpO2 dropping — airway compromise worsening", timestamp: 90 },
      ],
      feedbackLogs: [
        { id: "f3", type: "warning", message: "Airway assessment delayed — should have been done before any drug", timestamp: 90 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Airway assessed but delayed — reduced score" },
      annotation:
        "Airway assessment at 90 seconds is too late. The ABCDE approach mandates airway assessment first. Stridor and worsening oedema confirm the airway is compromising. SpO2 has dropped to 85% — the patient is deteriorating because epinephrine has not been given yet.",
    },
    {
      id: "ana-med-5",
      elapsedSeconds: 130,
      doctorMessage: "I'm going to put an oxygen mask on you now.",
      actionParsed: "administer_oxygen",
      actionFeedback: "High-flow oxygen applied via non-rebreather mask at 15L/min.",
      vitals: { hr: 130, bpSystolic: 78, bpDiastolic: 44, spo2: 86, temp: 37.0, respRate: 32 },
      events: [
        { id: "e5", type: "action", description: "High-flow oxygen applied at 15L/min", timestamp: 130 },
      ],
      feedbackLogs: [
        { id: "f4", type: "warning", message: "Oxygen applied at 130s — delayed beyond 90s target", timestamp: 130 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Oxygen given but late — partial credit" },
      annotation:
        "Oxygen finally applied but at 130 seconds the patient has already desaturated to 86%. Epinephrine STILL has not been given. The patient is deteriorating — BP 78/44, HR 130. Without epinephrine, oxygen alone cannot reverse the underlying pathology.",
    },
    {
      id: "ana-med-6",
      elapsedSeconds: 180,
      doctorMessage:
        "Actually, I think we need to give you adrenaline now. You're going into anaphylactic shock. I'm going to inject it into your thigh.",
      actionParsed: "give_epinephrine",
      actionFeedback: "Epinephrine 0.5mg IM administered to anterolateral thigh.",
      patientResponse: "Ana... anaphylactic shock? Am I dying?!",
      vitals: { hr: 132, bpSystolic: 76, bpDiastolic: 42, spo2: 84, temp: 37.0, respRate: 33 },
      events: [
        { id: "e6", type: "action", description: "Epinephrine 0.5mg IM given — 3 minutes delayed", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f5", type: "error", message: "Epinephrine delayed to 180s — should be given within 60s", timestamp: 180 },
        { id: "f6", type: "jargon", message: "Used 'anaphylactic shock' with patient — caused distress", timestamp: 180 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Epinephrine given but critically delayed — major score reduction" },
      isCriticalAction: true,
      annotation:
        "Epinephrine at 3 minutes is dangerously delayed. The patient has deteriorated significantly — SpO2 84%, BP 76/42. Each minute of delay worsens outcomes. Additionally, telling the patient she is 'in anaphylactic shock' is frightening medical jargon that increased her anxiety. Use plain language: 'strong medicine to help your breathing and blood pressure'.",
    },
    {
      id: "ana-med-7",
      elapsedSeconds: 240,
      doctorMessage: "I need to get a drip into you. Hold still please.",
      actionParsed: "establish_iv_access",
      actionFeedback: "Single 18G IV cannula inserted in left hand.",
      vitals: { hr: 124, bpSystolic: 82, bpDiastolic: 48, spo2: 87, temp: 37.0, respRate: 30 },
      events: [
        { id: "e7", type: "action", description: "IV access established — single cannula", timestamp: 240 },
        { id: "e8", type: "improvement", description: "Epinephrine taking effect — HR and BP beginning to stabilise", timestamp: 240 },
      ],
      feedbackLogs: [
        { id: "f7", type: "warning", message: "Single small-bore cannula — two large-bore recommended for anaphylaxis", timestamp: 240 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "IV access established but suboptimal gauge and quantity" },
      annotation:
        "A single 18G cannula is suboptimal for anaphylaxis resuscitation. Guidelines recommend two large-bore (14–16G) cannulae for rapid fluid administration. The epinephrine is starting to work — the patient is beginning to stabilise, but the 3-minute delay has resulted in unnecessary deterioration.",
    },
    {
      id: "ana-med-8",
      elapsedSeconds: 300,
      doctorMessage: "Let's run some fluids in now.",
      actionParsed: "fluid_bolus",
      actionFeedback: "250ml normal saline bolus administered.",
      vitals: { hr: 118, bpSystolic: 88, bpDiastolic: 54, spo2: 90, temp: 37.0, respRate: 27 },
      events: [
        { id: "e9", type: "action", description: "Fluid bolus — 250ml NaCl 0.9%", timestamp: 300 },
      ],
      feedbackLogs: [
        { id: "f8", type: "warning", message: "250ml is insufficient — 500–1000ml bolus recommended for anaphylactic shock", timestamp: 300 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Fluid given but insufficient volume" },
      annotation:
        "250ml is an inadequate fluid bolus for anaphylaxis with cardiovascular compromise. Guidelines recommend 500–1000ml boluses repeated as needed. With a BP of 88/54, this patient needs aggressive fluid resuscitation. The single small-bore cannula also limits infusion rate.",
    },
    {
      id: "ana-med-9",
      elapsedSeconds: 360,
      doctorMessage: "I'm going to give you some steroids through the drip as well to help with the reaction.",
      actionParsed: "give_steroids",
      actionFeedback: "Hydrocortisone 200mg IV administered.",
      patientResponse: "Am I going to be okay?",
      vitals: { hr: 110, bpSystolic: 94, bpDiastolic: 58, spo2: 92, temp: 37.0, respRate: 24 },
      events: [
        { id: "e10", type: "action", description: "Hydrocortisone 200mg IV administered", timestamp: 360 },
        { id: "e11", type: "improvement", description: "Patient continuing to improve with treatment", timestamp: 360 },
      ],
      feedbackLogs: [],
      scoringImpact: { pointsEarned: 15, reason: "IV steroids administered" },
      annotation:
        "Steroids administered appropriately. The patient is improving but recovery has been slower than it should have been due to the delayed epinephrine. The patient is understandably anxious — earlier jargon about 'anaphylactic shock' contributed to this.",
    },
    {
      id: "ana-med-10",
      elapsedSeconds: 450,
      vitals: { hr: 102, bpSystolic: 100, bpDiastolic: 62, spo2: 94, temp: 37.0, respRate: 21 },
      events: [
        { id: "e12", type: "alert", description: "Simulation complete", timestamp: 450 },
      ],
      feedbackLogs: [
        { id: "f9", type: "warning", message: "Epinephrine delayed by 2+ minutes — most significant error", timestamp: 450 },
        { id: "f10", type: "warning", message: "Antihistamine given before epinephrine — wrong prioritisation", timestamp: 450 },
        { id: "f11", type: "info", message: "Final Score: 100/185 — Grade C", timestamp: 450 },
      ],
      annotation:
        "Mediocre performance. All core treatments were eventually administered but with critical errors: (1) Antihistamine given before epinephrine — incorrect priority, (2) Epinephrine delayed to 180 seconds — patient deteriorated to SpO2 84% and BP 76/42, (3) Oxygen applied late, (4) Insufficient fluid volume (250ml vs recommended 500–1000ml), (5) Medical jargon caused patient distress. The patient survived but experienced unnecessary deterioration. Final score: 100/185 = Grade C.",
    },
  ],
};
