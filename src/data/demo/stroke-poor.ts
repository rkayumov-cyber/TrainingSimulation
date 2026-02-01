import type { DemoTranscript } from "../../types/demo";

export const strokePoor: DemoTranscript = {
  id: "demo-stroke-poor",
  scenarioId: "stroke-58m",
  scenarioName: "Acute Ischaemic Stroke — Poor Performance",
  level: "poor",
  grade: "F",
  totalScore: 25,
  maxPossibleScore: 175,
  summary:
    "Dangerous stroke mismanagement. No NIHSS performed, CT head critically delayed (15+ minutes), aspirin given before ruling out haemorrhage (potentially fatal), aggressive antihypertensives dropped BP too low worsening ischaemia, and tPA window missed entirely. Heavy use of medical jargon with patient. Patient deteriorated significantly due to management errors.",
  steps: [
    {
      id: "str-poor-1",
      elapsedSeconds: 0,
      vitals: { hr: 88, bpSystolic: 185, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Acute Stroke scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Davis presents with sudden left-sided weakness, facial droop, and slurred speech — classic acute stroke. BP is 185/105. Rapid assessment and imaging are critical. The treatment window for thrombolysis is time-limited and every minute matters.",
    },
    {
      id: "str-poor-2",
      elapsedSeconds: 45,
      doctorMessage: "Hello Mr. Davis. So you've got some weakness on the left side? Let me have a look at you. Can you tell me about your medical history?",
      patientResponse: "I... I take blood pressure tablets. Please, something's really wrong with me.",
      actionParsed: "check_vitals",
      actionFeedback: "Vitals confirmed: HR 88, BP 185/105, SpO2 96%, Temp 36.9°C, RR 18.",
      vitals: { hr: 88, bpSystolic: 185, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e2", type: "action", description: "Vitals checked", timestamp: 45 },
      ],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "No FAST assessment or stroke screening performed", timestamp: 45 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Vitals checked but no stroke-specific assessment" },
      annotation:
        "Taking a detailed medical history while the patient is actively stroking is a misuse of critical time. A focused FAST screen should be the immediate priority, not a general history. The patient is clearly distressed and the doctor's approach lacks the urgency that acute stroke demands.",
    },
    {
      id: "str-poor-3",
      elapsedSeconds: 180,
      doctorMessage: "Your blood pressure is very high. I'm going to bring that down aggressively with some IV medication.",
      actionParsed: "administer_antihypertensive",
      actionFeedback: "IV enalaprilat 1.25mg administered. Aggressive BP reduction initiated.",
      vitals: { hr: 92, bpSystolic: 170, bpDiastolic: 98, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e3", type: "action", description: "IV antihypertensive administered — aggressive BP reduction", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f2", type: "error", message: "Dangerous: aggressive BP reduction before imaging — may worsen cerebral ischaemia", timestamp: 180 },
      ],
      annotation:
        "This is a dangerous error. In acute ischaemic stroke, elevated BP is a compensatory mechanism that maintains perfusion to the ischaemic penumbra. Aggressively lowering BP before confirming stroke type can catastrophically reduce blood flow to at-risk brain tissue, converting salvageable penumbra into permanent infarct. BP should only be lowered to <185/110 if thrombolysis is planned, and only with gentle agents like labetalol — not aggressive IV reduction.",
    },
    {
      id: "str-poor-4",
      elapsedSeconds: 300,
      doctorMessage: "I'm going to start you on aspirin as well — 300mg. That should help with the clot.",
      actionParsed: "administer_aspirin",
      actionFeedback: "Aspirin 300mg administered orally. WARNING: No CT head performed — haemorrhagic stroke not excluded.",
      vitals: { hr: 94, bpSystolic: 152, bpDiastolic: 88, spo2: 95, temp: 36.9, respRate: 19 },
      events: [
        { id: "e4", type: "action", description: "Aspirin 300mg given BEFORE CT head", timestamp: 300 },
        { id: "e5", type: "deterioration", description: "BP dropping below safe threshold — cerebral perfusion compromised", timestamp: 300 },
      ],
      feedbackLogs: [
        { id: "f3", type: "error", message: "CRITICAL ERROR: Aspirin given before CT head — if haemorrhagic stroke, aspirin could be fatal", timestamp: 300 },
        { id: "f4", type: "error", message: "BP dropping too low (152/88) — ischaemic penumbra at risk", timestamp: 300 },
      ],
      annotation:
        "This is a potentially fatal error. Aspirin is an antiplatelet agent — if this were a haemorrhagic stroke (intracerebral bleed), aspirin would worsen the bleeding and could kill the patient. CT head MUST be performed BEFORE any antithrombotic therapy. Additionally, BP has now dropped to 152/88 due to the aggressive antihypertensive — this is dangerously low for an acute stroke patient, as it reduces perfusion pressure to ischaemic brain tissue.",
    },
    {
      id: "str-poor-5",
      elapsedSeconds: 480,
      doctorMessage: "Mr. Davis, it appears you're suffering from an MCA occlusion causing an ischaemic event in the left hemisphere. We need to assess the ischaemic penumbra.",
      patientResponse: "I don't... I don't understand any of that. What's happening to me? Am I going to die?",
      vitals: { hr: 96, bpSystolic: 145, bpDiastolic: 84, spo2: 95, temp: 36.9, respRate: 20 },
      events: [
        { id: "e6", type: "deterioration", description: "Patient increasingly distressed and confused", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f5", type: "jargon", message: "Jargon detected: 'MCA occlusion', 'ischaemic event', 'ischaemic penumbra' — patient does not understand", timestamp: 480 },
        { id: "f6", type: "warning", message: "Patient distress increasing — poor communication contributing to anxiety", timestamp: 480 },
      ],
      annotation:
        "Using 'MCA occlusion', 'ischaemic event', and 'ischaemic penumbra' with a distressed patient is completely inappropriate. The patient is terrified and has no medical background. Simple language like 'You're having a stroke — a blood clot is blocking blood flow to part of your brain' is what's needed. Poor communication compounds the clinical errors already made.",
    },
    {
      id: "str-poor-6",
      elapsedSeconds: 600,
      doctorMessage: "We should probably get some imaging. Let's organise a CT when the scanner is free.",
      vitals: { hr: 98, bpSystolic: 142, bpDiastolic: 82, spo2: 95, temp: 36.9, respRate: 20 },
      events: [],
      feedbackLogs: [
        { id: "f7", type: "error", message: "CT head still not ordered at 10 minutes — critical pathway failure", timestamp: 600 },
      ],
      annotation:
        "At 10 minutes, no CT head has been ordered. The phrase 'when the scanner is free' demonstrates a fundamental lack of urgency. Acute stroke is a medical emergency — the patient should be fast-tracked to CT immediately, not waiting for routine availability. Meanwhile, aspirin has already been given without imaging, and BP has been aggressively lowered. The management is now dangerously off-track.",
    },
    {
      id: "str-poor-7",
      elapsedSeconds: 900,
      doctorMessage: "Right, let's get that CT head done now.",
      actionParsed: "order_ct_head",
      actionFeedback: "Non-contrast CT head ordered. Critically delayed — 15 minutes from presentation.",
      vitals: { hr: 100, bpSystolic: 140, bpDiastolic: 80, spo2: 94, temp: 36.9, respRate: 21 },
      events: [
        { id: "e7", type: "action", description: "CT head finally ordered — 15-minute delay", timestamp: 900 },
        { id: "e8", type: "deterioration", description: "Neurological status worsening — left arm now plegic", timestamp: 900 },
      ],
      feedbackLogs: [
        { id: "f8", type: "error", message: "CT head ordered at 15 minutes — catastrophic delay in stroke pathway", timestamp: 900 },
        { id: "f9", type: "warning", message: "Patient deteriorating — left arm now completely paralysed", timestamp: 900 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "CT head ordered but critically delayed — minimal credit" },
      annotation:
        "CT head finally ordered at 15 minutes. During this delay, the ischaemic penumbra has been converting to permanent infarct, exacerbated by the low BP reducing perfusion. The patient's left arm is now completely paralysed (was previously weak) — this is clinical evidence of infarct progression. The aspirin given earlier is now confirmed as reckless — fortunately the CT will show ischaemic rather than haemorrhagic stroke, but this was pure luck.",
    },
    {
      id: "str-poor-8",
      elapsedSeconds: 1200,
      patientResponse: "I can't... I can't move my leg now either. Something's getting worse.",
      doctorMessage: "The CT shows no bleed. We could consider thrombolysis but his BP has been fluctuating and we've already given aspirin...",
      vitals: { hr: 102, bpSystolic: 138, bpDiastolic: 78, spo2: 94, temp: 36.9, respRate: 22 },
      events: [
        { id: "e9", type: "action", description: "CT result: no haemorrhage — ischaemic stroke confirmed", timestamp: 1200 },
        { id: "e10", type: "deterioration", description: "Left leg weakness progressing — now 2/5 power", timestamp: 1200 },
      ],
      feedbackLogs: [
        { id: "f10", type: "error", message: "tPA window closing — aspirin complicates thrombolysis decision", timestamp: 1200 },
        { id: "f11", type: "warning", message: "No NIHSS assessment performed at any point", timestamp: 1200 },
      ],
      annotation:
        "The CT confirms ischaemic stroke (no haemorrhage), so the aspirin was not immediately fatal — but this was luck, not judgement. Now the team faces a dilemma: tPA after aspirin carries higher bleeding risk. Combined with the low BP (138/78 — well below the compensatory level the brain needs), the patient has deteriorated significantly. No NIHSS was ever performed, so there is no objective measure of deficit progression. The treatment window for tPA is rapidly closing.",
    },
    {
      id: "str-poor-9",
      elapsedSeconds: 1500,
      doctorMessage: "I think we've missed the window for safe thrombolysis given the aspirin and BP issues. Let's just continue supportive care and get the stroke team to review.",
      patientResponse: "Please... help me... I can't move...",
      vitals: { hr: 104, bpSystolic: 136, bpDiastolic: 76, spo2: 93, temp: 36.9, respRate: 22 },
      events: [
        { id: "e11", type: "deterioration", description: "Patient significantly worse — dense left hemiplegia developing", timestamp: 1500 },
        { id: "e12", type: "alert", description: "Simulation complete", timestamp: 1500 },
      ],
      feedbackLogs: [
        { id: "f12", type: "error", message: "tPA NOT administered — treatment window missed due to cumulative errors", timestamp: 1500 },
        { id: "f13", type: "error", message: "No NIHSS, no CTA, no coagulation screen ordered", timestamp: 1500 },
        { id: "f14", type: "info", message: "Final Score: 25/175 — Grade F", timestamp: 1500 },
      ],
      scoringImpact: { pointsEarned: 0, reason: "tPA not administered — definitive treatment missed" },
      annotation:
        "Catastrophic outcome. The patient has progressed from partial left-sided weakness to dense left hemiplegia — a devastating neurological deficit that will likely be permanent. Key failures: (1) No NIHSS — deficit severity never formally quantified, (2) CT head delayed 15 minutes — unacceptable in acute stroke, (3) Aspirin given before CT — potentially fatal if haemorrhagic, (4) Aggressive BP lowering worsened ischaemia by reducing perfusion to vulnerable brain tissue, (5) tPA never given — the single most important treatment was missed, (6) No CTA or coagulation screen ordered, (7) Heavy medical jargon distressed an already frightened patient. This case illustrates how cascading errors compound: each mistake made subsequent correct management harder. Final score: 25/175 = Grade F.",
    },
  ],
};
