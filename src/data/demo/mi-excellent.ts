import type { DemoTranscript } from "../../types/demo";

export const miExcellent: DemoTranscript = {
  id: "demo-mi-excellent",
  scenarioId: "mi-65m",
  scenarioName: "Myocardial Infarction (STEMI) — Excellent Performance",
  level: "excellent",
  grade: "A",
  totalScore: 165,
  maxPossibleScore: 180,
  summary:
    "Textbook STEMI management. ECG obtained within 60 seconds, aspirin and GTN given promptly, correct medication sequencing, IV access established early, and cath lab activation initiated. Clear, empathetic patient communication throughout with no jargon.",
  steps: [
    {
      id: "mi-ex-1",
      elapsedSeconds: 0,
      vitals: { hr: 95, bpSystolic: 150, bpDiastolic: 95, spo2: 94, temp: 36.8, respRate: 20 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — MI scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Thompson, 65-year-old male, presents with crushing chest pain. Vitals show mild hypertension, borderline SpO2, and slightly elevated heart rate — a classic acute coronary syndrome presentation. Rapid assessment and early ECG are paramount.",
    },
    {
      id: "mi-ex-2",
      elapsedSeconds: 15,
      doctorMessage:
        "Hello Mr. Thompson, I'm Dr. Patel. I can see you're in a lot of discomfort. Can you tell me about the pain you're feeling?",
      patientResponse:
        "It's... a crushing pain right in my chest. Like someone is sitting on me. It started about an hour ago. It goes into my left arm and my jaw.",
      vitals: { hr: 96, bpSystolic: 152, bpDiastolic: 96, spo2: 94, temp: 36.8, respRate: 20 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Excellent opening — introduces self and uses an open question. The patient describes textbook cardiac chest pain: crushing, central, radiating to the left arm and jaw. This history alone should trigger immediate ECG.",
    },
    {
      id: "mi-ex-3",
      elapsedSeconds: 45,
      doctorMessage:
        "Mr. Thompson, I need to do a heart tracing right away to see what's happening. I'm going to attach some sticky pads to your chest — you'll feel them go on.",
      actionParsed: "order_ecg",
      actionFeedback: "12-lead ECG obtained. Result: ST-elevation in leads II, III, aVF — inferior STEMI.",
      vitals: { hr: 97, bpSystolic: 151, bpDiastolic: 95, spo2: 94, temp: 36.8, respRate: 20 },
      events: [
        { id: "e2", type: "action", description: "12-lead ECG performed — inferior STEMI identified", timestamp: 45 },
      ],
      feedbackLogs: [
        { id: "f1", type: "info", message: "ECG obtained within 60s — excellent, well within 10-minute target", timestamp: 45 },
      ],
      scoringImpact: { pointsEarned: 25, reason: "ECG within 60 seconds — critical first action in suspected MI" },
      isCriticalAction: true,
      annotation:
        "ECG is the single most important early investigation in suspected MI. Guidelines require a 12-lead ECG within 10 minutes of first medical contact. Obtaining it in under 60 seconds is outstanding. ST-elevation in II, III, aVF confirms an inferior STEMI.",
    },
    {
      id: "mi-ex-4",
      elapsedSeconds: 75,
      doctorMessage:
        "Mr. Thompson, the heart tracing shows that part of your heart isn't getting enough blood. I'm going to give you a tablet to chew — it's aspirin, and it will help thin your blood to improve flow to your heart.",
      actionParsed: "give_aspirin",
      actionFeedback: "Aspirin 300mg given orally — patient chewed and swallowed.",
      patientResponse: "Okay... it tastes bitter but I'll take anything to stop this pain.",
      vitals: { hr: 96, bpSystolic: 148, bpDiastolic: 94, spo2: 94, temp: 36.8, respRate: 20 },
      events: [
        { id: "e3", type: "action", description: "Aspirin 300mg administered", timestamp: 75 },
      ],
      feedbackLogs: [
        { id: "f2", type: "info", message: "Aspirin given within 2 minutes of ECG — excellent timing", timestamp: 75 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "Aspirin 300mg given promptly — antiplatelet therapy initiated" },
      isCriticalAction: true,
      annotation:
        "Aspirin 300mg is a critical early intervention in STEMI. It inhibits platelet aggregation and reduces mortality. Loading dose should be chewed for faster absorption. The doctor explained the reason in plain language without using medical jargon.",
    },
    {
      id: "mi-ex-5",
      elapsedSeconds: 120,
      doctorMessage:
        "Now I'm going to give you a small spray under your tongue. It helps open up the blood vessels to your heart and should ease the pain.",
      actionParsed: "give_nitro",
      actionFeedback: "GTN 400mcg sublingual spray administered.",
      patientResponse: "That tastes funny... but the pain is easing a little. Thank you.",
      vitals: { hr: 94, bpSystolic: 138, bpDiastolic: 88, spo2: 94, temp: 36.8, respRate: 19 },
      events: [
        { id: "e4", type: "action", description: "GTN sublingual spray administered", timestamp: 120 },
        { id: "e5", type: "improvement", description: "Patient reports partial pain relief", timestamp: 120 },
      ],
      feedbackLogs: [
        { id: "f3", type: "info", message: "GTN given after confirming adequate BP (150/95) — safe and appropriate", timestamp: 120 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Nitro given with appropriate BP check" },
      isCriticalAction: true,
      annotation:
        "GTN (nitroglycerin) causes coronary vasodilation and reduces preload. It is contraindicated if systolic BP < 90mmHg or if the patient has taken PDE5 inhibitors. BP was 150/95, so it is safe. The doctor described the spray simply as something to 'open up blood vessels' — clear and reassuring.",
    },
    {
      id: "mi-ex-6",
      elapsedSeconds: 160,
      doctorMessage:
        "I'm going to put a small tube into a vein in your arm so we can give you fluids and medicine quickly if needed. You'll feel a sharp scratch.",
      actionParsed: "establish_iv_access",
      actionFeedback: "18G IV cannula inserted in left antecubital fossa. Flushed and patent.",
      vitals: { hr: 93, bpSystolic: 136, bpDiastolic: 87, spo2: 94, temp: 36.8, respRate: 19 },
      events: [
        { id: "e6", type: "action", description: "IV access established", timestamp: 160 },
      ],
      feedbackLogs: [
        { id: "f4", type: "info", message: "IV access established early — enables rapid drug delivery", timestamp: 160 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "IV access established before morphine administration" },
      annotation:
        "IV access is essential before administering IV morphine or any emergency medications. Large-bore cannula (18G) is appropriate for potential emergency access. Establishing this before morphine shows good sequencing.",
    },
    {
      id: "mi-ex-7",
      elapsedSeconds: 200,
      doctorMessage:
        "Mr. Thompson, I can see you're still in pain. I'm going to give you a strong painkiller through the drip. It should help significantly.",
      actionParsed: "give_morphine",
      actionFeedback: "Morphine 5mg IV administered slowly with antiemetic (metoclopramide 10mg).",
      patientResponse: "Oh... that's much better. The crushing feeling is easing off. Thank you, doctor.",
      vitals: { hr: 88, bpSystolic: 132, bpDiastolic: 84, spo2: 94, temp: 36.8, respRate: 18 },
      events: [
        { id: "e7", type: "action", description: "Morphine 5mg IV + antiemetic administered", timestamp: 200 },
        { id: "e8", type: "improvement", description: "Significant pain relief achieved", timestamp: 200 },
      ],
      feedbackLogs: [
        { id: "f5", type: "info", message: "Morphine given after GTN — correct sequencing (try nitrates first)", timestamp: 200 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Morphine with antiemetic, correct dose and sequence" },
      annotation:
        "Morphine is given for pain unresponsive to GTN. The dose of 5mg IV is appropriate. An antiemetic is co-administered because morphine commonly causes nausea. Importantly, morphine was given AFTER nitro — correct sequencing, as GTN should be tried first for pain relief.",
    },
    {
      id: "mi-ex-8",
      elapsedSeconds: 240,
      doctorMessage:
        "I'm also ordering a blood test called troponin — it tells us if any heart muscle has been damaged.",
      actionParsed: "order_troponin",
      actionFeedback: "High-sensitivity troponin ordered. Result pending (typically 60 minutes).",
      vitals: { hr: 86, bpSystolic: 130, bpDiastolic: 82, spo2: 94, temp: 36.8, respRate: 18 },
      events: [
        { id: "e9", type: "action", description: "Troponin ordered", timestamp: 240 },
      ],
      feedbackLogs: [],
      scoringImpact: { pointsEarned: 10, reason: "Troponin ordered — confirms myocardial injury" },
      annotation:
        "Troponin is the gold-standard biomarker for myocardial injury. While the ECG has already confirmed STEMI (and treatment should not be delayed for troponin results), ordering it supports the diagnosis and establishes a baseline for monitoring. The doctor explained what the test measures in plain terms.",
    },
    {
      id: "mi-ex-9",
      elapsedSeconds: 280,
      doctorMessage:
        "Your oxygen level is a little low, so I'm going to put a mask on you to give you some extra oxygen. It should help you feel a bit less breathless.",
      actionParsed: "administer_oxygen",
      actionFeedback: "Oxygen administered via nasal cannula at 4L/min.",
      vitals: { hr: 85, bpSystolic: 128, bpDiastolic: 82, spo2: 97, temp: 36.8, respRate: 17 },
      events: [
        { id: "e10", type: "action", description: "Supplemental oxygen applied", timestamp: 280 },
        { id: "e11", type: "improvement", description: "SpO2 improving with oxygen therapy", timestamp: 280 },
      ],
      feedbackLogs: [
        { id: "f6", type: "info", message: "Oxygen appropriate — SpO2 was 94%, now improving to 97%", timestamp: 280 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Oxygen administered for SpO2 < 95%" },
      annotation:
        "Current guidelines recommend supplemental oxygen when SpO2 < 94-95%. At 94%, oxygen is appropriate. Nasal cannula at 4L/min is a reasonable starting point — avoids unnecessary high-flow oxygen which can be harmful in MI. SpO2 is now improving.",
    },
    {
      id: "mi-ex-10",
      elapsedSeconds: 330,
      doctorMessage:
        "I'm also going to order a chest X-ray. It helps us check your lungs and the size of your heart to make sure nothing else is going on.",
      actionParsed: "order_chest_xray",
      actionFeedback: "Portable chest X-ray ordered. Result: mild pulmonary congestion, no pneumothorax, normal cardiac silhouette.",
      vitals: { hr: 84, bpSystolic: 126, bpDiastolic: 80, spo2: 97, temp: 36.8, respRate: 17 },
      events: [
        { id: "e12", type: "action", description: "Chest X-ray ordered", timestamp: 330 },
      ],
      feedbackLogs: [],
      scoringImpact: { pointsEarned: 10, reason: "Chest X-ray ordered — rules out differentials" },
      annotation:
        "Chest X-ray helps exclude aortic dissection, pneumothorax, and other causes of chest pain. It also assesses for pulmonary oedema (a complication of MI). Mild congestion here is consistent with left ventricular dysfunction from the infarct. Should not delay definitive treatment.",
    },
    {
      id: "mi-ex-11",
      elapsedSeconds: 400,
      doctorMessage:
        "Mr. Thompson, the heart tracing confirms that a blood vessel to your heart is blocked. We need to get you to a specialist team who can open it up using a small tube through your wrist. I'm calling them now — they'll take excellent care of you.",
      patientResponse:
        "Is it serious, doctor? Am I going to be alright?",
      vitals: { hr: 82, bpSystolic: 125, bpDiastolic: 80, spo2: 97, temp: 36.8, respRate: 16 },
      events: [
        { id: "e13", type: "action", description: "Cardiology referral — cath lab activation initiated", timestamp: 400 },
      ],
      feedbackLogs: [
        { id: "f7", type: "info", message: "Cath lab activation discussed — door-to-balloon time awareness", timestamp: 400 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Early cath lab activation — reducing door-to-balloon time" },
      isCriticalAction: true,
      annotation:
        "Primary PCI (percutaneous coronary intervention) is the gold-standard treatment for STEMI. The target door-to-balloon time is < 90 minutes. Early cath lab activation is critical. The doctor explained the procedure in lay terms ('open it up using a small tube through your wrist') and was reassuring without being dismissive.",
    },
    {
      id: "mi-ex-12",
      elapsedSeconds: 450,
      doctorMessage:
        "The specialist team is on their way. You're in safe hands, Mr. Thompson. We've given you everything we can to protect your heart, and the team will take it from here.",
      patientResponse: "Thank you, doctor. I feel much better than when I came in.",
      vitals: { hr: 80, bpSystolic: 124, bpDiastolic: 78, spo2: 97, temp: 36.8, respRate: 16 },
      events: [
        { id: "e14", type: "alert", description: "Simulation complete", timestamp: 450 },
      ],
      feedbackLogs: [
        { id: "f8", type: "info", message: "Final Score: 165/180 — Grade A", timestamp: 450 },
      ],
      annotation:
        "Outstanding performance. All 8 critical actions completed: ECG within 60 seconds, aspirin 300mg, GTN after BP check, IV access before morphine, morphine with antiemetic, troponin ordered, oxygen for low SpO2, chest X-ray, and cath lab activation. Medication sequencing was correct throughout. Communication was clear, empathetic, and entirely free of medical jargon. Final score: 165/180 = Grade A.",
    },
  ],
};
