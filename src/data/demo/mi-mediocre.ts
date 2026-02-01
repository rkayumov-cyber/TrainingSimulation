import type { DemoTranscript } from "../../types/demo";

export const miMediocre: DemoTranscript = {
  id: "demo-mi-mediocre",
  scenarioId: "mi-65m",
  scenarioName: "Myocardial Infarction (STEMI) — Mediocre Performance",
  level: "mediocre",
  grade: "C",
  totalScore: 95,
  maxPossibleScore: 180,
  summary:
    "Delayed ECG (5+ minutes), late aspirin, jargon use ('sublingual GTN'), morphine given before nitro (incorrect sequencing), and chest X-ray missed entirely. The correct treatments were eventually given but timing and order were suboptimal, reducing potential benefit.",
  steps: [
    {
      id: "mi-med-1",
      elapsedSeconds: 0,
      vitals: { hr: 95, bpSystolic: 150, bpDiastolic: 95, spo2: 94, temp: 36.8, respRate: 20 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — MI scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Thompson presents with crushing chest pain. Baseline vitals: HR 95, BP 150/95, SpO2 94%. The clock is ticking — ECG should be obtained within the first 10 minutes, ideally much sooner.",
    },
    {
      id: "mi-med-2",
      elapsedSeconds: 20,
      doctorMessage:
        "Hello, I'm Dr. Jones. Tell me what's been going on today.",
      patientResponse:
        "I've got this terrible pain in my chest. It started about an hour ago. It feels like something crushing me.",
      vitals: { hr: 96, bpSystolic: 152, bpDiastolic: 96, spo2: 94, temp: 36.8, respRate: 20 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Adequate introduction but could be more empathetic. The patient is clearly describing cardiac-sounding chest pain — this should trigger an immediate ECG order, but the doctor continues with history-taking instead.",
    },
    {
      id: "mi-med-3",
      elapsedSeconds: 90,
      doctorMessage:
        "Have you had any pain like this before? Any medical conditions? Are you on any medications?",
      patientResponse:
        "No, never this bad. I take tablets for high blood pressure. I can't remember the names. Please, it really hurts.",
      vitals: { hr: 98, bpSystolic: 155, bpDiastolic: 98, spo2: 93, temp: 36.8, respRate: 21 },
      events: [
        { id: "e2", type: "deterioration", description: "SpO2 dropping — patient becoming more distressed", timestamp: 90 },
      ],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "90 seconds elapsed — ECG not yet ordered. In suspected MI, ECG should be a top priority", timestamp: 90 },
      ],
      annotation:
        "While taking a medication history is important, it should not delay the ECG in a patient with obvious cardiac chest pain. SpO2 is dropping and the patient is in distress. The history-taking has caused a critical delay.",
    },
    {
      id: "mi-med-4",
      elapsedSeconds: 180,
      doctorMessage:
        "I'm going to give you something for the pain first. Nurse, can we get some morphine 10mg IV please?",
      actionParsed: "give_morphine",
      actionFeedback: "Morphine 10mg IV administered. Note: dose is at the upper end — 5mg is standard initial dose.",
      patientResponse: "Thank you... I feel a bit woozy now.",
      vitals: { hr: 90, bpSystolic: 140, bpDiastolic: 88, spo2: 93, temp: 36.8, respRate: 19 },
      events: [
        { id: "e3", type: "action", description: "Morphine 10mg IV administered", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f2", type: "warning", message: "Morphine given BEFORE GTN — nitrates should be tried first for MI chest pain", timestamp: 180 },
        { id: "f3", type: "warning", message: "Morphine 10mg is a high initial dose — 5mg IV is recommended to start", timestamp: 180 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Morphine given but wrong sequence and high dose — partial credit only" },
      annotation:
        "Two issues: (1) Morphine was given before nitrates. Guidelines recommend GTN first for MI pain, with morphine reserved for pain unresponsive to nitrates. (2) The initial dose of 10mg is too high — standard is 2.5-5mg IV titrated to effect. Higher doses increase risk of hypotension and respiratory depression.",
    },
    {
      id: "mi-med-5",
      elapsedSeconds: 240,
      doctorMessage:
        "I'm going to put a drip in your arm now so we have access if we need it.",
      actionParsed: "establish_iv_access",
      actionFeedback: "20G IV cannula inserted in right hand.",
      vitals: { hr: 88, bpSystolic: 138, bpDiastolic: 86, spo2: 93, temp: 36.8, respRate: 19 },
      events: [
        { id: "e4", type: "action", description: "IV access established", timestamp: 240 },
      ],
      feedbackLogs: [
        { id: "f4", type: "warning", message: "IV access established AFTER IV morphine — should have been done first", timestamp: 240 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "IV access established but after morphine was already given IV — sequencing error" },
      annotation:
        "IV access was established after morphine was already given intravenously, which is a sequencing error. In reality, IV morphine requires IV access first. This suggests the doctor was not thinking systematically about the order of interventions.",
    },
    {
      id: "mi-med-6",
      elapsedSeconds: 320,
      doctorMessage:
        "Actually, we should get a heart tracing done. Can we do an ECG please?",
      actionParsed: "order_ecg",
      actionFeedback: "12-lead ECG obtained. Result: ST-elevation in leads II, III, aVF — inferior STEMI.",
      vitals: { hr: 88, bpSystolic: 136, bpDiastolic: 85, spo2: 93, temp: 36.8, respRate: 19 },
      events: [
        { id: "e5", type: "action", description: "12-lead ECG performed — inferior STEMI identified", timestamp: 320 },
      ],
      feedbackLogs: [
        { id: "f5", type: "error", message: "ECG delayed until 5 minutes 20 seconds — should be within 10 minutes but ideally < 2 minutes in suspected MI", timestamp: 320 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "ECG obtained but significantly delayed — reduced score" },
      isCriticalAction: true,
      annotation:
        "The ECG was delayed by over 5 minutes — a significant miss. In suspected MI, the ECG is the single most important diagnostic test and should be the first investigation ordered. Morphine, IV access, and history-taking all took priority here, which is incorrect. The STEMI is now confirmed but valuable time has been lost.",
    },
    {
      id: "mi-med-7",
      elapsedSeconds: 360,
      doctorMessage:
        "Right, this is a STEMI. Let's give sublingual GTN and 300mg aspirin stat.",
      actionParsed: "give_aspirin",
      actionFeedback: "Aspirin 300mg given orally.",
      vitals: { hr: 87, bpSystolic: 134, bpDiastolic: 84, spo2: 93, temp: 36.8, respRate: 19 },
      events: [
        { id: "e6", type: "action", description: "Aspirin 300mg administered", timestamp: 360 },
      ],
      feedbackLogs: [
        { id: "f6", type: "error", message: "Aspirin given at 6 minutes — significantly delayed. Should be given as soon as MI is suspected", timestamp: 360 },
        { id: "f7", type: "jargon", message: "Doctor used jargon: 'STEMI' and 'stat' — patient-facing communication should use plain language", timestamp: 360 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Aspirin given but very late — reduced benefit" },
      isCriticalAction: true,
      annotation:
        "Aspirin was given 6 minutes into the scenario — far too late. It should have been given within the first 2 minutes alongside the ECG. Every minute of delay reduces the antiplatelet benefit. Additionally, the doctor used medical jargon ('STEMI', 'stat') in front of the patient, which is poor communication practice.",
    },
    {
      id: "mi-med-8",
      elapsedSeconds: 390,
      doctorMessage:
        "Mr. Thompson, I'm giving you sublingual GTN now — put this spray under your tongue.",
      actionParsed: "give_nitro",
      actionFeedback: "GTN 400mcg sublingual spray administered.",
      patientResponse: "What's GTN? Is that safe with the other injection you gave me?",
      vitals: { hr: 84, bpSystolic: 125, bpDiastolic: 78, spo2: 93, temp: 36.8, respRate: 18 },
      events: [
        { id: "e7", type: "action", description: "GTN sublingual administered", timestamp: 390 },
      ],
      feedbackLogs: [
        { id: "f8", type: "jargon", message: "Doctor used jargon: 'sublingual GTN' — should explain in plain terms (e.g., 'a spray under your tongue to help open the blood vessels')", timestamp: 390 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "GTN given but after morphine (wrong order) and with jargon" },
      annotation:
        "GTN was given after morphine, which is the wrong order — nitrates should be tried first for MI chest pain. The doctor also used the term 'sublingual GTN' without explanation. The patient's confused response highlights why jargon-free communication matters. The patient deserves to understand what is being given to them.",
    },
    {
      id: "mi-med-9",
      elapsedSeconds: 450,
      doctorMessage:
        "I'm ordering a troponin blood test and putting you on some oxygen.",
      actionParsed: "order_troponin",
      actionFeedback: "Troponin ordered. Oxygen applied via nasal cannula at 2L/min.",
      vitals: { hr: 82, bpSystolic: 122, bpDiastolic: 76, spo2: 96, temp: 36.8, respRate: 17 },
      events: [
        { id: "e8", type: "action", description: "Troponin ordered", timestamp: 450 },
        { id: "e9", type: "action", description: "Supplemental oxygen applied", timestamp: 450 },
        { id: "e10", type: "improvement", description: "SpO2 improving with oxygen", timestamp: 450 },
      ],
      feedbackLogs: [
        { id: "f9", type: "info", message: "Troponin and oxygen ordered — appropriate investigations", timestamp: 450 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Troponin ordered and oxygen administered" },
      annotation:
        "Troponin and oxygen are both appropriate here. SpO2 was 93%, warranting supplemental oxygen. However, oxygen could have been given earlier when SpO2 first dropped below 94%. Bundling multiple orders together is efficient but suggests reactive rather than proactive management.",
    },
    {
      id: "mi-med-10",
      elapsedSeconds: 520,
      doctorMessage:
        "We need to get cardiology involved. Mr. Thompson, we're going to send you to a specialist team to sort out the blockage.",
      patientResponse: "What blockage? What's happening to me?",
      vitals: { hr: 80, bpSystolic: 120, bpDiastolic: 75, spo2: 96, temp: 36.8, respRate: 17 },
      events: [
        { id: "e11", type: "action", description: "Cardiology referral initiated", timestamp: 520 },
        { id: "e12", type: "alert", description: "Simulation complete", timestamp: 520 },
      ],
      feedbackLogs: [
        { id: "f10", type: "warning", message: "Chest X-ray was never ordered — missed investigation", timestamp: 520 },
        { id: "f11", type: "warning", message: "Patient still confused about their diagnosis — inadequate explanation given", timestamp: 520 },
        { id: "f12", type: "info", message: "Final Score: 95/180 — Grade C", timestamp: 520 },
      ],
      annotation:
        "Mediocre overall performance. Key issues: (1) ECG delayed by 5+ minutes, (2) aspirin given late, (3) morphine given before nitrates in wrong sequence and at too high a dose, (4) jargon used multiple times ('STEMI', 'sublingual GTN', 'stat'), (5) chest X-ray never ordered, (6) IV access established after IV morphine was already given. The correct drugs were eventually administered, but timing and sequencing were poor, and patient communication was inadequate. Final score: 95/180 = Grade C.",
    },
  ],
};
