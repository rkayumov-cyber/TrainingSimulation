import type { DemoTranscript } from "../../types/demo";

export const strokeMediocre: DemoTranscript = {
  id: "demo-stroke-mediocre",
  scenarioId: "stroke-58m",
  scenarioName: "Acute Ischaemic Stroke — Mediocre Performance",
  level: "mediocre",
  grade: "C",
  totalScore: 90,
  maxPossibleScore: 175,
  summary:
    "Stroke eventually recognised and treated, but significant delays throughout. CT head ordered late (8+ minutes), NIHSS incomplete, blood glucose missed initially, BP not adequately controlled before tPA. Thrombolysis given but near the end of the safe window. Medical jargon used with patient on multiple occasions. Outcome likely worse due to cumulative delays.",
  steps: [
    {
      id: "str-med-1",
      elapsedSeconds: 0,
      vitals: { hr: 88, bpSystolic: 185, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Acute Stroke scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Davis presents with classic stroke signs: sudden left-sided weakness, facial droop, and slurred speech. BP is 185/105. The clock starts now — every minute of delay costs approximately 1.9 million neurons.",
    },
    {
      id: "str-med-2",
      elapsedSeconds: 30,
      doctorMessage: "Hello Mr. Davis. What's brought you in today?",
      patientResponse: "I... I can't move my left side properly. My face feels droopy. Something's really wrong.",
      actionParsed: "check_vitals",
      actionFeedback: "Vitals confirmed: HR 88, BP 185/105, SpO2 96%, Temp 36.9°C, RR 18.",
      vitals: { hr: 88, bpSystolic: 185, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e2", type: "action", description: "Vitals checked", timestamp: 30 },
      ],
      feedbackLogs: [],
      annotation:
        "Vitals checked, but no formal FAST assessment performed. The open question is reasonable but lacks the urgency of targeted stroke screening. Time is already ticking.",
    },
    {
      id: "str-med-3",
      elapsedSeconds: 120,
      doctorMessage: "I'd like to do a neurological exam. Can you follow my finger? Now squeeze my hands.",
      actionParsed: "check_nihss",
      actionFeedback: "Partial NIHSS assessment. Left facial palsy and left arm weakness documented, but several domains skipped (visual fields, sensory, neglect, language subtests). Estimated NIHSS: 10-14.",
      vitals: { hr: 89, bpSystolic: 186, bpDiastolic: 106, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e3", type: "action", description: "NIHSS attempted — incomplete assessment", timestamp: 120 },
      ],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "NIHSS incomplete — several domains not assessed", timestamp: 120 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "NIHSS attempted but incomplete — partial credit" },
      annotation:
        "The NIHSS must be completed in full to accurately quantify deficit severity and guide treatment. Skipping domains like visual fields, sensory, and neglect can underestimate stroke severity and may miss important clinical findings. An incomplete NIHSS is better than none, but it reduces diagnostic confidence.",
    },
    {
      id: "str-med-4",
      elapsedSeconds: 240,
      doctorMessage: "Mr. Davis, I think you may be having a cerebrovascular accident. We need to investigate this urgently.",
      patientResponse: "A what? A cerebro... what does that mean? Am I dying?",
      vitals: { hr: 90, bpSystolic: 187, bpDiastolic: 107, spo2: 96, temp: 36.9, respRate: 18 },
      events: [],
      feedbackLogs: [
        { id: "f2", type: "jargon", message: "Jargon detected: 'cerebrovascular accident' — patient does not understand", timestamp: 240 },
      ],
      annotation:
        "Using 'cerebrovascular accident' with a patient is poor communication. The patient is visibly distressed and confused by the terminology. Plain language such as 'stroke' or 'a problem with blood flow to your brain' is far more appropriate. Jargon increases patient anxiety and undermines the therapeutic relationship.",
    },
    {
      id: "str-med-5",
      elapsedSeconds: 480,
      doctorMessage: "Let's get a CT head to see what's going on. Can we get him to the scanner?",
      actionParsed: "order_ct_head",
      actionFeedback: "Non-contrast CT head ordered. Delayed — 8 minutes from presentation.",
      vitals: { hr: 91, bpSystolic: 188, bpDiastolic: 108, spo2: 96, temp: 36.9, respRate: 19 },
      events: [
        { id: "e4", type: "action", description: "CT head ordered — delayed (8 minutes)", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f3", type: "warning", message: "CT head delayed — ordered at 8 minutes (target: <5 minutes)", timestamp: 480 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "CT head ordered but significantly delayed" },
      isCriticalAction: true,
      annotation:
        "CT head ordered at 8 minutes — this is a significant delay. Best practice is to order CT within minutes of stroke recognition. Every minute of delay pushes the 'door-to-needle' time further out. In this time, ischaemic penumbra tissue is progressively dying. The delay is not catastrophic but reduces the benefit of eventual thrombolysis.",
    },
    {
      id: "str-med-6",
      elapsedSeconds: 540,
      doctorMessage: "We should also get a CT angio to check the vessels.",
      actionParsed: "order_ct_angio",
      actionFeedback: "CT angiography ordered. Will be performed after non-contrast CT.",
      vitals: { hr: 91, bpSystolic: 187, bpDiastolic: 107, spo2: 96, temp: 36.9, respRate: 19 },
      events: [
        { id: "e5", type: "action", description: "CT angiography ordered", timestamp: 540 },
      ],
      feedbackLogs: [
        { id: "f4", type: "info", message: "CTA ordered — should have been requested alongside CT head", timestamp: 540 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "CTA ordered but not simultaneously with CT head" },
      annotation:
        "CTA should ideally be ordered at the same time as the CT head to avoid a second trip to the scanner or additional delays. Ordering it separately adds time to the workflow. The investigation itself is correct — it will identify the occlusion site — but the sequencing is suboptimal.",
    },
    {
      id: "str-med-7",
      elapsedSeconds: 660,
      doctorMessage: "Oh — we should check his blood sugar. Can someone do a finger-prick glucose?",
      actionParsed: "check_blood_glucose",
      actionFeedback: "Blood glucose: 7.1 mmol/L (normal). Hypoglycaemia ruled out.",
      vitals: { hr: 90, bpSystolic: 186, bpDiastolic: 106, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e6", type: "action", description: "Blood glucose checked — 7.1 mmol/L (normal)", timestamp: 660 },
      ],
      feedbackLogs: [
        { id: "f5", type: "warning", message: "Blood glucose checked late — should be done in initial assessment", timestamp: 660 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Blood glucose checked but delayed" },
      annotation:
        "Blood glucose should be one of the first tests in any acute neurological presentation. Hypoglycaemia can perfectly mimic stroke and is rapidly reversible. Checking it at 11 minutes rather than in the first 2 minutes means that if this had been hypoglycaemia, the patient would have suffered unnecessary delays and investigations.",
    },
    {
      id: "str-med-8",
      elapsedSeconds: 780,
      doctorMessage: "The CT is back — no haemorrhage. The CTA shows an M1 occlusion. Let's get coags and start thinking about thrombolysis.",
      actionParsed: "order_coagulation",
      actionFeedback: "Coagulation screen ordered. Result: INR 1.1, APTT 30s, platelets 210,000/µL — normal.",
      vitals: { hr: 92, bpSystolic: 188, bpDiastolic: 108, spo2: 96, temp: 36.9, respRate: 19 },
      events: [
        { id: "e7", type: "action", description: "CT results: no haemorrhage. CTA: M1 MCA occlusion. Coagulation screen ordered — normal", timestamp: 780 },
      ],
      feedbackLogs: [
        { id: "f6", type: "jargon", message: "Jargon detected: 'thrombolysis' and 'M1 occlusion' used in patient's presence", timestamp: 780 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Coagulation screen ordered" },
      annotation:
        "Results confirm ischaemic stroke with M1 MCA occlusion — thrombolysis is indicated. However, discussing 'thrombolysis' and 'M1 occlusion' within earshot of the patient without explanation is poor practice. Medical terminology should be reserved for team discussions away from the bedside, or translated into plain language for the patient.",
    },
    {
      id: "str-med-9",
      elapsedSeconds: 900,
      doctorMessage: "His BP is still too high for tPA. Let's give labetalol. Mr. Davis, we need to bring your blood pressure down before we can give you the treatment.",
      actionParsed: "administer_labetalol",
      actionFeedback: "IV labetalol 20mg administered. BP slow to respond — still 180/104 after first dose.",
      vitals: { hr: 84, bpSystolic: 180, bpDiastolic: 104, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e8", type: "action", description: "IV labetalol administered — BP partially responding", timestamp: 900 },
      ],
      feedbackLogs: [
        { id: "f7", type: "warning", message: "BP management delayed — should have been initiated earlier to enable tPA", timestamp: 900 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "BP management attempted but late" },
      annotation:
        "BP is still 180/104 after labetalol — above the 185/110 threshold but only just. The issue is that BP management should have been started much earlier in parallel with imaging. Starting it at 15 minutes means additional delays while waiting for BP to reach target. A second dose may be needed, pushing door-to-needle time further out.",
    },
    {
      id: "str-med-10",
      elapsedSeconds: 1080,
      doctorMessage: "BP is now 174/98 — that's within range. Let's give the tPA now. Mr. Davis, we're going to give you a medicine to help dissolve the clot. There are some risks of bleeding but it should help.",
      actionParsed: "administer_tpa",
      actionFeedback: "Alteplase (tPA) 0.9mg/kg administered. Door-to-needle time: 18 minutes. Within window but significantly delayed.",
      vitals: { hr: 82, bpSystolic: 174, bpDiastolic: 98, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e9", type: "action", description: "tPA administered — door-to-needle 18 minutes", timestamp: 1080 },
      ],
      feedbackLogs: [
        { id: "f8", type: "warning", message: "tPA given but door-to-needle time 18 minutes — target is <10 minutes for best outcomes", timestamp: 1080 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "tPA administered within window but with significant delay" },
      isCriticalAction: true,
      annotation:
        "tPA given at 18 minutes — within the treatment window but far from optimal. Research shows that every 15-minute reduction in door-to-needle time results in measurably better outcomes. The cumulative delays (late CT, late glucose, late BP management) all contributed. The treatment will still help, but the patient has lost precious brain tissue during the delays.",
    },
    {
      id: "str-med-11",
      elapsedSeconds: 1200,
      vitals: { hr: 80, bpSystolic: 170, bpDiastolic: 96, spo2: 96, temp: 36.9, respRate: 17 },
      events: [
        { id: "e10", type: "alert", description: "Simulation complete", timestamp: 1200 },
      ],
      feedbackLogs: [
        { id: "f9", type: "info", message: "Final Score: 90/175 — Grade C", timestamp: 1200 },
      ],
      annotation:
        "Adequate but delayed stroke management. The correct diagnosis was made and appropriate treatment was eventually given, but cumulative delays significantly reduced the benefit. Key areas for improvement: (1) Order CT head immediately on stroke recognition, (2) Complete full NIHSS, (3) Check blood glucose in initial assessment, (4) Start BP management early in parallel with imaging, (5) Use plain language with patients — avoid 'cerebrovascular accident' and 'thrombolysis'. Final score: 90/175 = Grade C.",
    },
  ],
};
