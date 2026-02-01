import type { DemoTranscript } from "../../types/demo";

export const miPoor: DemoTranscript = {
  id: "demo-mi-poor",
  scenarioId: "mi-65m",
  scenarioName: "Myocardial Infarction (STEMI) — Poor Performance",
  level: "poor",
  grade: "F",
  totalScore: 35,
  maxPossibleScore: 180,
  summary:
    "Dangerous management of STEMI. No ECG for over 10 minutes, aspirin never given, jargon used to tell the patient their diagnosis, inappropriate beta-blocker administered causing harm, and GTN given despite hypotension leading to patient deterioration. Multiple critical errors that would result in serious patient harm.",
  steps: [
    {
      id: "mi-poor-1",
      elapsedSeconds: 0,
      vitals: { hr: 95, bpSystolic: 150, bpDiastolic: 95, spo2: 94, temp: 36.8, respRate: 20 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — MI scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Thompson presents with crushing chest pain. Baseline vitals: HR 95, BP 150/95, SpO2 94%. A systematic, time-critical approach is needed — but what follows is a cascade of errors.",
    },
    {
      id: "mi-poor-2",
      elapsedSeconds: 30,
      doctorMessage: "So what seems to be the problem?",
      patientResponse:
        "I've got this awful pain in my chest... it's been going on for about an hour. It's like an elephant sitting on me. Please help me.",
      vitals: { hr: 97, bpSystolic: 152, bpDiastolic: 96, spo2: 94, temp: 36.8, respRate: 21 },
      events: [],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "No introduction or self-identification to patient", timestamp: 30 },
      ],
      annotation:
        "The doctor failed to introduce themselves — a basic communication standard. The patient is describing classic cardiac chest pain ('elephant sitting on me') which should trigger immediate action, but the doctor does not respond with urgency.",
    },
    {
      id: "mi-poor-3",
      elapsedSeconds: 120,
      doctorMessage:
        "Let me take your blood pressure and listen to your chest first. Have you had any surgeries? Any allergies? Family history of heart disease?",
      patientResponse: "I... I don't know... my dad had a heart attack at 60. Please, the pain is getting worse!",
      vitals: { hr: 100, bpSystolic: 158, bpDiastolic: 100, spo2: 93, temp: 36.8, respRate: 22 },
      events: [
        { id: "e2", type: "deterioration", description: "Patient becoming more distressed, vitals worsening", timestamp: 120 },
      ],
      feedbackLogs: [
        { id: "f2", type: "error", message: "2 minutes elapsed — no ECG ordered, no treatment started. Patient is deteriorating", timestamp: 120 },
      ],
      annotation:
        "Two minutes in and no ECG has been ordered, no treatment given. The doctor is taking a detailed history while the patient is in acute distress with worsening vitals. Family history of MI at 60 is a red flag being collected but not acted upon. The patient is pleading for help.",
    },
    {
      id: "mi-poor-4",
      elapsedSeconds: 300,
      doctorMessage:
        "I think we should start you on a beta-blocker to bring your heart rate and blood pressure down. Nurse, can we give metoprolol 5mg IV?",
      actionParsed: "give_beta_blocker",
      actionFeedback: "Metoprolol 5mg IV administered. WARNING: Beta-blockers are NOT first-line in acute STEMI and can be harmful in the acute setting.",
      vitals: { hr: 78, bpSystolic: 118, bpDiastolic: 72, spo2: 92, temp: 36.8, respRate: 22 },
      events: [
        { id: "e3", type: "action", description: "Metoprolol 5mg IV administered — inappropriate in acute STEMI", timestamp: 300 },
        { id: "e4", type: "deterioration", description: "Heart rate dropping rapidly — beta-blocker effect in acute MI", timestamp: 300 },
      ],
      feedbackLogs: [
        { id: "f3", type: "error", message: "HARMFUL ACTION: IV beta-blocker in acute STEMI can worsen cardiogenic shock. Contraindicated as first-line treatment", timestamp: 300 },
        { id: "f4", type: "error", message: "5 minutes elapsed — still no ECG, no aspirin, no GTN", timestamp: 300 },
      ],
      scoringImpact: { pointsEarned: -15, reason: "Harmful action: beta-blocker in acute STEMI setting — risk of cardiogenic shock" },
      annotation:
        "This is a harmful intervention. IV beta-blockers in acute STEMI can precipitate cardiogenic shock, especially when the extent of myocardial damage is unknown. Guidelines state beta-blockers should NOT be given in the first 24 hours to haemodynamically unstable patients. The BP has dropped significantly, setting up a dangerous situation for subsequent interventions.",
    },
    {
      id: "mi-poor-5",
      elapsedSeconds: 420,
      doctorMessage:
        "Mr. Thompson, I need to be honest with you. Based on your symptoms, I believe you're having an ST-elevation myocardial infarction. That's a serious type of heart attack where one of the main coronary arteries is completely occluded.",
      patientResponse:
        "What?! ST... what? Am I going to die? Oh God, oh God...",
      vitals: { hr: 75, bpSystolic: 105, bpDiastolic: 65, spo2: 91, temp: 36.8, respRate: 24 },
      events: [
        { id: "e5", type: "deterioration", description: "Patient in acute distress — anxiety worsening condition", timestamp: 420 },
      ],
      feedbackLogs: [
        { id: "f5", type: "jargon", message: "Used jargon: 'ST-elevation myocardial infarction' — patient is now panicking", timestamp: 420 },
        { id: "f6", type: "jargon", message: "Used jargon: 'coronary arteries' and 'occluded' — incomprehensible to most patients", timestamp: 420 },
        { id: "f7", type: "error", message: "7 minutes elapsed — STILL no ECG ordered despite discussing STEMI diagnosis", timestamp: 420 },
      ],
      annotation:
        "The doctor has used dense medical jargon to tell the patient their suspected diagnosis. 'ST-elevation myocardial infarction', 'coronary arteries', and 'occluded' are incomprehensible to most patients. The patient is now panicking, which worsens cardiac oxygen demand. A simple 'part of your heart isn't getting enough blood' would have been appropriate. Critically, the doctor is discussing STEMI without having even ordered an ECG to confirm it.",
    },
    {
      id: "mi-poor-6",
      elapsedSeconds: 540,
      doctorMessage:
        "Let me put in an IV line and we'll get an ECG. I should have done that sooner.",
      actionParsed: "establish_iv_access",
      actionFeedback: "IV cannula inserted.",
      vitals: { hr: 72, bpSystolic: 95, bpDiastolic: 58, spo2: 90, temp: 36.8, respRate: 25 },
      events: [
        { id: "e6", type: "action", description: "IV access established", timestamp: 540 },
        { id: "e7", type: "deterioration", description: "BP dropping — approaching hypotension. Beta-blocker effect compounding", timestamp: 540 },
      ],
      feedbackLogs: [
        { id: "f8", type: "error", message: "9 minutes elapsed — patient now hypotensive (BP 95/58). Beta-blocker has worsened haemodynamics", timestamp: 540 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "IV access established — but very late" },
      annotation:
        "IV access is finally established at 9 minutes. The patient is now hypotensive (BP 95/58) — a direct consequence of the inappropriate beta-blocker given earlier. The doctor acknowledges the delay ('I should have done that sooner') but the damage is already done. The falling BP creates a dangerous trap for the next step.",
    },
    {
      id: "mi-poor-7",
      elapsedSeconds: 620,
      doctorMessage:
        "Let's do the ECG now and give some GTN for the pain.",
      actionParsed: "order_ecg",
      actionFeedback: "12-lead ECG obtained. Result: ST-elevation in leads II, III, aVF with reciprocal changes — inferior STEMI confirmed.",
      vitals: { hr: 70, bpSystolic: 88, bpDiastolic: 55, spo2: 89, temp: 36.8, respRate: 26 },
      events: [
        { id: "e8", type: "action", description: "12-lead ECG performed — inferior STEMI confirmed", timestamp: 620 },
        { id: "e9", type: "deterioration", description: "Significant hypotension developing — BP 88/55", timestamp: 620 },
      ],
      feedbackLogs: [
        { id: "f9", type: "error", message: "ECG obtained at 10 minutes 20 seconds — critically delayed. STEMI now confirmed but valuable time lost", timestamp: 620 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "ECG obtained but after 10+ minutes — minimal credit for critical delay" },
      isCriticalAction: true,
      annotation:
        "The ECG is finally done at over 10 minutes — an unacceptable delay for a patient with obvious cardiac chest pain. STEMI is confirmed, but the patient is now hypotensive (BP 88/55) from the beta-blocker. This creates a critical contraindication for GTN that the doctor is about to miss.",
    },
    {
      id: "mi-poor-8",
      elapsedSeconds: 660,
      doctorMessage:
        "Here, Mr. Thompson, I'm giving you GTN spray under your tongue for the pain.",
      actionParsed: "give_nitro",
      actionFeedback: "GTN 400mcg sublingual administered. CRITICAL WARNING: GTN given with systolic BP < 90mmHg — this is contraindicated and dangerous.",
      patientResponse: "I feel... dizzy... everything is going dark...",
      vitals: { hr: 110, bpSystolic: 72, bpDiastolic: 42, spo2: 86, temp: 36.7, respRate: 28 },
      events: [
        { id: "e10", type: "action", description: "GTN administered — CONTRAINDICATED at this BP", timestamp: 660 },
        { id: "e11", type: "deterioration", description: "SEVERE hypotension — BP crashed to 72/42 after GTN", timestamp: 660 },
        { id: "e12", type: "deterioration", description: "Compensatory tachycardia — HR spiked to 110", timestamp: 660 },
        { id: "e13", type: "alert", description: "CRITICAL: Patient in pre-shock state", timestamp: 660 },
      ],
      feedbackLogs: [
        { id: "f10", type: "error", message: "DANGEROUS: GTN given with systolic BP 88mmHg — absolute contraindication is BP < 90mmHg", timestamp: 660 },
        { id: "f11", type: "error", message: "Patient now in pre-shock: BP 72/42, HR 110, SpO2 86%. Immediate fluid resuscitation required", timestamp: 660 },
      ],
      scoringImpact: { pointsEarned: -20, reason: "HARMFUL: GTN given to hypotensive patient — precipitated haemodynamic collapse" },
      annotation:
        "This is a life-threatening error. GTN is an absolute contraindication when systolic BP is below 90mmHg. The patient's BP was already 88/55 from the beta-blocker, and GTN has caused it to crash to 72/42. The patient is now in a pre-shock state with compensatory tachycardia (HR 110) and severe hypoxia (SpO2 86%). This error is a direct consequence of not checking vitals before administering GTN.",
    },
    {
      id: "mi-poor-9",
      elapsedSeconds: 720,
      doctorMessage: "We need help in here! Can someone call the crash team?",
      vitals: { hr: 115, bpSystolic: 75, bpDiastolic: 44, spo2: 85, temp: 36.7, respRate: 30 },
      events: [
        { id: "e14", type: "alert", description: "Crash team called — patient in haemodynamic collapse", timestamp: 720 },
        { id: "e15", type: "alert", description: "Simulation complete — terminated due to patient deterioration", timestamp: 720 },
      ],
      feedbackLogs: [
        { id: "f12", type: "error", message: "Aspirin was NEVER given — a critical omission in STEMI management", timestamp: 720 },
        { id: "f13", type: "error", message: "Chest X-ray was never ordered", timestamp: 720 },
        { id: "f14", type: "error", message: "Troponin was never ordered", timestamp: 720 },
        { id: "f15", type: "error", message: "Oxygen was never given despite SpO2 < 94%", timestamp: 720 },
        { id: "f16", type: "error", message: "Two harmful interventions caused patient deterioration: beta-blocker and GTN while hypotensive", timestamp: 720 },
        { id: "f17", type: "info", message: "Final Score: 35/180 — Grade F", timestamp: 720 },
      ],
      annotation:
        "Simulation terminated due to patient deterioration. Critical failures: (1) ECG delayed over 10 minutes, (2) aspirin never given, (3) troponin never ordered, (4) oxygen never administered despite SpO2 < 94%, (5) chest X-ray never ordered, (6) beta-blocker given inappropriately causing hypotension, (7) GTN given to a hypotensive patient causing haemodynamic collapse, (8) medical jargon caused patient panic, (9) no self-introduction. The patient is now in a pre-shock state requiring emergency intervention. Two actively harmful actions (beta-blocker and GTN while hypotensive) resulted in negative scoring. Final score: 35/180 = Grade F.",
    },
  ],
};
