import type { DemoTranscript } from "../../types/demo";

export const cardiacArrestMediocre: DemoTranscript = {
  id: "demo-cardiac-arrest-mediocre",
  scenarioId: "cardiac-arrest-55m",
  scenarioName: "Cardiac Arrest (VF) — Mediocre Performance",
  level: "mediocre",
  grade: "C",
  totalScore: 100,
  maxPossibleScore: 190,
  summary:
    "Delayed recognition and action throughout. CPR not started until 90 seconds, first defibrillation at over 3 minutes. Prolonged pauses in CPR for unnecessary pulse checks. Epinephrine given but with suboptimal timing. Amiodarone omitted entirely. ROSC eventually achieved but resuscitation was inefficient with significant deviations from ACLS protocol.",
  steps: [
    {
      id: "ca-med-1",
      elapsedSeconds: 0,
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Cardiac Arrest scenario", timestamp: 0 },
        { id: "e2", type: "alert", description: "55yo male collapsed in ED waiting room, bystanders calling for help", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Patel, a 55-year-old male, has collapsed in the ED waiting room. This scenario requires immediate action — every second of delay reduces survival.",
    },
    {
      id: "ca-med-2",
      elapsedSeconds: 30,
      doctorMessage: "Sir? Sir, can you hear me? Can someone tell me what happened? Did anyone see him fall?",
      patientResponse: "Patient is unresponsive. No movement, no breathing.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e3", type: "action", description: "Doctor assessing patient — gathering history from bystanders", timestamp: 30 },
      ],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "30 seconds elapsed — no pulse check performed yet", timestamp: 30 },
      ],
      annotation:
        "The doctor is spending valuable time gathering history instead of immediately checking for a pulse. In an unresponsive patient, the priority is assessing for cardiac arrest (check pulse, check breathing) — history can wait.",
    },
    {
      id: "ca-med-3",
      elapsedSeconds: 55,
      doctorMessage: "No pulse... He's not breathing either. Okay, we need... someone get me a crash cart! Is there a nurse around?",
      actionParsed: "check_rhythm",
      actionFeedback: "No pulse detected. Patient is in cardiac arrest.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e4", type: "action", description: "Cardiac arrest confirmed at 55 seconds", timestamp: 55 },
      ],
      feedbackLogs: [
        { id: "f2", type: "warning", message: "Cardiac arrest recognition delayed — 55 seconds elapsed", timestamp: 55 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Cardiac arrest recognised but delayed (>30 seconds)" },
      annotation:
        "Recognition took 55 seconds — nearly a minute wasted. The doctor appeared hesitant and was still organising resources rather than acting. In cardiac arrest, you must act first and delegate simultaneously.",
    },
    {
      id: "ca-med-4",
      elapsedSeconds: 90,
      doctorMessage: "Right, I need to start compressions. Let me get him on his back on the floor. Okay... starting CPR now.",
      actionParsed: "start_cpr",
      actionFeedback: "CPR initiated. Rate: 95/min, depth: 4cm — compressions shallow and slow.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e5", type: "action", description: "CPR started at 90 seconds — delayed beyond 30-second target", timestamp: 90 },
      ],
      feedbackLogs: [
        { id: "f3", type: "error", message: "CPR delayed to 90 seconds — target is < 30 seconds", timestamp: 90 },
        { id: "f4", type: "warning", message: "Compression rate 95/min — target is 100-120/min", timestamp: 90 },
        { id: "f5", type: "warning", message: "Compression depth 4cm — target is 5-6cm", timestamp: 90 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "CPR started but significantly delayed and suboptimal quality" },
      isCriticalAction: true,
      annotation:
        "CPR started at 90 seconds — triple the target time. Additionally, compressions are too slow (95/min vs. target 100-120/min) and too shallow (4cm vs. target 5-6cm). Poor quality CPR generates less than 25% of normal cardiac output, drastically reducing chances of ROSC.",
    },
    {
      id: "ca-med-5",
      elapsedSeconds: 200,
      doctorMessage: "Wait, let me stop and check if he has a pulse now... No, nothing. Where is that defibrillator? Can someone bring it faster?",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e6", type: "deterioration", description: "Prolonged CPR interruption — 15 seconds for unnecessary pulse check", timestamp: 200 },
      ],
      feedbackLogs: [
        { id: "f6", type: "error", message: "Unnecessary pulse check — CPR interrupted for 15 seconds", timestamp: 200 },
        { id: "f7", type: "warning", message: "Do not stop CPR to check pulse before completing a 2-minute cycle", timestamp: 200 },
      ],
      scoringImpact: { pointsEarned: -5, reason: "Prolonged CPR interruption — unnecessary pulse check" },
      annotation:
        "The doctor stopped CPR to check for a pulse after only 110 seconds. ACLS guidelines specify completing a full 2-minute cycle before any rhythm or pulse check. Each interruption in compressions drops coronary perfusion pressure, which takes 30-60 seconds to rebuild.",
    },
    {
      id: "ca-med-6",
      elapsedSeconds: 225,
      doctorMessage: "Okay the defib is here. Let me put the pads on... everyone stand back. Analysing... it says VF. Charging... shock!",
      actionParsed: "defibrillate",
      actionFeedback: "Defibrillator applied. Rhythm: VF confirmed. Shock delivered at 200J biphasic.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e7", type: "action", description: "First defibrillation at 225 seconds — delayed beyond 2-minute target", timestamp: 225 },
      ],
      feedbackLogs: [
        { id: "f8", type: "error", message: "First shock at 3:45 — target is < 2 minutes", timestamp: 225 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Defibrillation performed but significantly delayed" },
      isCriticalAction: true,
      annotation:
        "First defibrillation at 3 minutes 45 seconds — nearly double the target. For every minute defibrillation is delayed in VF arrest, survival decreases by 7-10%. This patient's chances have already been substantially reduced by the delay.",
    },
    {
      id: "ca-med-7",
      elapsedSeconds: 240,
      doctorMessage: "Did the shock work? Let me check... no pulse. Okay, back on the chest. We need IV access. And can someone ventilate him?",
      actionParsed: "bag_valve_mask",
      actionFeedback: "BVM ventilation started. CPR resumed after 15-second pause post-shock.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e8", type: "action", description: "BVM ventilation initiated", timestamp: 240 },
        { id: "e9", type: "deterioration", description: "15-second pause between shock and CPR resumption", timestamp: 228 },
      ],
      feedbackLogs: [
        { id: "f9", type: "error", message: "Do not check pulse immediately after shock — resume CPR for a full cycle first", timestamp: 228 },
        { id: "f10", type: "warning", message: "BVM ventilation started late — should be concurrent with early CPR", timestamp: 240 },
      ],
      annotation:
        "Two errors here: (1) Checking for a pulse immediately after the shock wastes critical time. ACLS says resume CPR immediately post-shock and reassess after 2 minutes. (2) BVM ventilation should have been started much earlier alongside initial CPR.",
    },
    {
      id: "ca-med-8",
      elapsedSeconds: 330,
      doctorMessage: "We need to get IV access. Someone cannulate him. And let me get the epinephrine ready... give 1mg IV now.",
      actionParsed: "give_epinephrine",
      actionFeedback: "IV access established. Epinephrine 1mg IV administered.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e10", type: "action", description: "IV access established", timestamp: 320 },
        { id: "e11", type: "action", description: "Epinephrine 1mg IV given", timestamp: 330 },
      ],
      feedbackLogs: [
        { id: "f11", type: "warning", message: "Epinephrine timing suboptimal — ideally given after 2nd shock per ACLS", timestamp: 330 },
        { id: "f12", type: "info", message: "Correct dose: 1mg IV — good", timestamp: 330 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Epinephrine given at correct dose but delayed" },
      annotation:
        "Epinephrine dose is correct (1mg IV), but timing is suboptimal. In the ACLS VF algorithm, epinephrine should be given after the 2nd shock. Here it was given late and the sequencing with CPR cycles was disorganised.",
    },
    {
      id: "ca-med-9",
      elapsedSeconds: 480,
      doctorMessage: "Two minutes, rhythm check. Still VF. Shocking again. Clear!",
      actionParsed: "defibrillate",
      actionFeedback: "Second shock delivered at 200J. CPR resumed.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e12", type: "action", description: "2nd shock delivered", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f13", type: "warning", message: "No amiodarone given — should be considered for refractory VF after 3rd shock", timestamp: 480 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Second defibrillation performed" },
      annotation:
        "The second shock was delivered, but the overall CPR cycle management is disorganised. Amiodarone should be considered after the 3rd shock for refractory VF, but this doctor does not appear to be following a systematic approach to the ACLS algorithm.",
    },
    {
      id: "ca-med-10",
      elapsedSeconds: 660,
      doctorMessage: "Another rhythm check... wait, I think I see something on the monitor. Check a pulse! Yes! There is a pulse! We got him back!",
      actionParsed: "check_rhythm",
      actionFeedback: "Organised rhythm on monitor. Pulse confirmed — ROSC achieved.",
      vitals: { hr: 120, bpSystolic: 82, bpDiastolic: 50, spo2: 85, temp: 36.3, respRate: 6 },
      events: [
        { id: "e13", type: "improvement", description: "ROSC achieved at 11 minutes", timestamp: 660 },
      ],
      feedbackLogs: [
        { id: "f14", type: "warning", message: "ROSC at 11 minutes — delayed due to suboptimal resuscitation", timestamp: 660 },
        { id: "f15", type: "error", message: "Amiodarone was never administered — missed intervention for refractory VF", timestamp: 660 },
        { id: "f16", type: "info", message: "Final Score: 100/190 — Grade C", timestamp: 660 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "ROSC achieved but delayed" },
      annotation:
        "ROSC at 11 minutes — significantly longer than optimal. Key deficiencies: CPR delayed to 90 seconds, first shock at 3:45, multiple prolonged CPR interruptions for unnecessary pulse checks, no amiodarone given for refractory VF, and airway management was late. Amiodarone omission is a significant protocol deviation — it improves survival for shock-refractory VF. Post-ROSC vitals are worse (lower BP, lower SpO2) reflecting the longer arrest time. Final score: 100/190 = Grade C.",
    },
  ],
};
