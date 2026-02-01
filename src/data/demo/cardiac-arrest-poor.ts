import type { DemoTranscript } from "../../types/demo";

export const cardiacArrestPoor: DemoTranscript = {
  id: "demo-cardiac-arrest-poor",
  scenarioId: "cardiac-arrest-55m",
  scenarioName: "Cardiac Arrest (VF) — Poor Performance",
  level: "poor",
  grade: "F",
  totalScore: 30,
  maxPossibleScore: 190,
  summary:
    "Critically delayed response throughout. Doctor attempted to take history from an unconscious patient, wasting over 2 minutes. CPR not started until 2:30, first defibrillation at 5+ minutes. Multiple prolonged CPR interruptions exceeding 10 seconds. Dangerous epinephrine dosing error (10mg instead of 1mg). No amiodarone given. No airway management. ROSC was never achieved. Patient did not survive.",
  steps: [
    {
      id: "ca-poor-1",
      elapsedSeconds: 0,
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Cardiac Arrest scenario", timestamp: 0 },
        { id: "e2", type: "alert", description: "55yo male collapsed in ED waiting room, bystanders calling for help", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Patel, a 55-year-old male, has collapsed in the ED waiting room. Immediate action is required — this patient needs CPR and defibrillation within seconds, not minutes.",
    },
    {
      id: "ca-poor-2",
      elapsedSeconds: 30,
      doctorMessage: "Sir? Sir, can you hear me? What is your name? Do you have any medical conditions? Is he a patient here — can someone pull up his chart?",
      patientResponse: "Patient is completely unresponsive. No movement, no breathing, no sounds.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e3", type: "deterioration", description: "Doctor attempting to take history from unconscious patient", timestamp: 30 },
      ],
      feedbackLogs: [
        { id: "f1", type: "error", message: "Patient is unconscious and not breathing — do not attempt history taking", timestamp: 30 },
        { id: "f2", type: "warning", message: "30 seconds elapsed — no pulse check, no CPR", timestamp: 30 },
      ],
      annotation:
        "Critical error: the doctor is trying to take a medical history from an unconscious, non-breathing patient. This is a fundamental failure to recognise the emergency. An unresponsive patient with no breathing requires immediate pulse check and CPR — history is completely irrelevant at this point.",
    },
    {
      id: "ca-poor-3",
      elapsedSeconds: 80,
      doctorMessage: "He's not responding at all. Let me try a sternal rub... nothing. Does anyone know his medical history? Is he diabetic? Could this be a hypoglycaemic episode?",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e4", type: "deterioration", description: "Continued delay — doctor considering differential diagnoses instead of checking pulse", timestamp: 80 },
      ],
      feedbackLogs: [
        { id: "f3", type: "error", message: "80 seconds with no pulse check — unacceptable delay", timestamp: 80 },
        { id: "f4", type: "error", message: "Stop considering differentials — check for a pulse NOW", timestamp: 80 },
      ],
      annotation:
        "Over a minute has passed and the doctor still has not checked for a pulse. Considering differential diagnoses like hypoglycaemia before establishing whether the patient has a pulse is a dangerous cognitive error. The ABCDE approach starts with basic life support — check responsiveness, check breathing, check pulse.",
    },
    {
      id: "ca-poor-4",
      elapsedSeconds: 135,
      doctorMessage: "Wait... let me check his pulse. I can't feel anything. Is he... oh God, I think he's in cardiac arrest. Nurse! I need help!",
      actionParsed: "check_rhythm",
      actionFeedback: "No pulse detected. Patient has been in cardiac arrest for over 2 minutes.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e5", type: "action", description: "Cardiac arrest finally recognised at 2 minutes 15 seconds", timestamp: 135 },
      ],
      feedbackLogs: [
        { id: "f5", type: "error", message: "Cardiac arrest recognised at 135 seconds — critically delayed", timestamp: 135 },
      ],
      scoringImpact: { pointsEarned: 0, reason: "Cardiac arrest recognition catastrophically delayed (>2 minutes)" },
      annotation:
        "Over 2 minutes wasted before even recognising cardiac arrest. Brain damage begins within 4-6 minutes without CPR. The doctor appeared panicked and unprepared, lacking the systematic approach needed for emergency management.",
    },
    {
      id: "ca-poor-5",
      elapsedSeconds: 155,
      doctorMessage: "Okay, I need to do CPR. Let me... is he on a hard surface? Help me get him on the floor. Right, starting compressions.",
      actionParsed: "start_cpr",
      actionFeedback: "CPR initiated. Rate: 80/min, depth: 3.5cm — compressions too slow and far too shallow.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e6", type: "action", description: "CPR started at 2 minutes 35 seconds — critically delayed", timestamp: 155 },
      ],
      feedbackLogs: [
        { id: "f6", type: "error", message: "CPR started at 155 seconds — target is < 30 seconds", timestamp: 155 },
        { id: "f7", type: "error", message: "Compression rate 80/min — well below target of 100-120/min", timestamp: 155 },
        { id: "f8", type: "error", message: "Compression depth 3.5cm — must be at least 5cm for adequate perfusion", timestamp: 155 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "CPR started but catastrophically delayed with poor quality" },
      isCriticalAction: true,
      annotation:
        "CPR finally started at 2 minutes 35 seconds — over 5 times the target. Quality is also very poor: rate of 80/min (target 100-120) and depth of 3.5cm (target 5-6cm). At this rate and depth, CPR is generating less than 15% of normal cardiac output. With over 2.5 minutes of no circulation followed by inadequate CPR, brain injury is increasingly likely.",
    },
    {
      id: "ca-poor-6",
      elapsedSeconds: 310,
      doctorMessage: "Where is the defibrillator? Let me stop and check for a pulse again... still nothing. Has someone brought the defib yet? Let me stop CPR and go get it.",
      actionParsed: "defibrillate",
      actionFeedback: "Defibrillator finally applied. Rhythm: VF. Shock delivered at 200J after 20-second pause in CPR.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e7", type: "action", description: "First defibrillation at 5 minutes 10 seconds — critically delayed", timestamp: 310 },
        { id: "e8", type: "deterioration", description: "CPR interrupted for 20 seconds to apply defibrillator", timestamp: 295 },
      ],
      feedbackLogs: [
        { id: "f9", type: "error", message: "First shock at 5:10 — target is < 2 minutes. Survival significantly reduced.", timestamp: 310 },
        { id: "f10", type: "error", message: "20-second CPR interruption to apply defibrillator — far too long", timestamp: 295 },
        { id: "f11", type: "error", message: "Doctor left patient to get defibrillator — should delegate to team member", timestamp: 300 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Defibrillation performed but critically delayed (>5 minutes)" },
      isCriticalAction: true,
      annotation:
        "First shock at 5 minutes 10 seconds. Survival from VF arrest drops by 7-10% for every minute defibrillation is delayed. At 5 minutes, survival probability has dropped from ~70% to approximately 20%. The doctor also stopped CPR to personally fetch the defibrillator rather than delegating — a leadership failure that compounded the delays.",
    },
    {
      id: "ca-poor-7",
      elapsedSeconds: 420,
      doctorMessage: "Give him adrenaline. Umm... give 10mg IV — we need a big dose to get his heart going. Push it fast.",
      actionParsed: "give_epinephrine",
      actionFeedback: "WARNING: Epinephrine 10mg IV administered — this is 10x the correct dose. Standard dose is 1mg.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e9", type: "action", description: "Epinephrine administered — WRONG DOSE: 10mg instead of 1mg", timestamp: 420 },
        { id: "e10", type: "deterioration", description: "Dangerous drug error — 10x epinephrine overdose", timestamp: 420 },
      ],
      feedbackLogs: [
        { id: "f12", type: "error", message: "DRUG ERROR: Epinephrine 10mg given — correct dose is 1mg IV (1:10,000)", timestamp: 420 },
        { id: "f13", type: "error", message: "10x overdose of epinephrine can cause refractory VF and myocardial injury", timestamp: 420 },
      ],
      scoringImpact: { pointsEarned: -10, reason: "Dangerous drug error — 10x epinephrine overdose" },
      annotation:
        "Critical medication error. The standard cardiac arrest dose of epinephrine is 1mg IV (1:10,000 concentration), not 10mg. A 10x overdose of epinephrine causes excessive vasoconstriction, worsens myocardial oxygen demand, and can make VF more refractory to defibrillation. This error demonstrates a fundamental knowledge gap in ACLS pharmacology.",
    },
    {
      id: "ca-poor-8",
      elapsedSeconds: 600,
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.2, respRate: 0 },
      events: [
        { id: "e11", type: "deterioration", description: "No ROSC achieved — resuscitation efforts continue to fail", timestamp: 600 },
        { id: "e12", type: "alert", description: "Simulation complete", timestamp: 600 },
      ],
      feedbackLogs: [
        { id: "f14", type: "error", message: "No airway management performed — BVM never used", timestamp: 600 },
        { id: "f15", type: "error", message: "Amiodarone never administered for refractory VF", timestamp: 600 },
        { id: "f16", type: "error", message: "No IV access obtained before drug administration", timestamp: 420 },
        { id: "f17", type: "error", message: "ROSC not achieved — resuscitation failed", timestamp: 600 },
        { id: "f18", type: "info", message: "Final Score: 30/190 — Grade F", timestamp: 600 },
      ],
      scoringImpact: { pointsEarned: 0, reason: "ROSC never achieved — patient did not survive" },
      annotation:
        "Resuscitation failed. ROSC was never achieved. Critical failures: (1) Over 2 minutes of inaction while attempting history from an unconscious patient. (2) CPR delayed to 2:35 with poor quality. (3) First defibrillation at 5:10 — survival already severely compromised. (4) Multiple prolonged CPR interruptions. (5) No airway management — BVM ventilation was never initiated, so the patient received no oxygen throughout the arrest. (6) 10x epinephrine overdose likely worsened VF refractoriness. (7) Amiodarone never given despite refractory VF. (8) No post-ROSC investigations because ROSC was never achieved. This case demonstrates how compounding delays and errors in cardiac arrest management lead to patient death. Final score: 30/190 = Grade F.",
    },
  ],
};
