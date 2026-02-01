import { allDemoTranscripts, getAllDemoIds } from "../../data/demo";
import { saveSession, getSession, deleteSession } from "../persistence";
import type { SessionRecord } from "../../types/session";
import type { DemoTranscript } from "../../types/demo";

const DEMO_SEEDED_KEY = "demo-sessions-seeded";

function transcriptToSession(transcript: DemoTranscript): SessionRecord {
  const lastStep = transcript.steps[transcript.steps.length - 1];
  const durationMs = lastStep.elapsedSeconds * 1000;
  const startTime = Date.now() - durationMs - 86400000; // backdate 1 day

  const gradeMap: Record<string, "A" | "B" | "C" | "D" | "F"> = {
    A: "A",
    C: "C",
    F: "F",
  };

  const actionsTaken = transcript.steps
    .filter((s) => s.actionParsed)
    .map((s) => ({
      action: s.actionParsed!,
      timestamp: startTime + s.elapsedSeconds * 1000,
      elapsedSeconds: s.elapsedSeconds,
    }));

  const allEvents = transcript.steps.flatMap((s) =>
    s.events.map((e) => ({
      ...e,
      timestamp: startTime + s.elapsedSeconds * 1000,
    })),
  );

  const allFeedback = transcript.steps.flatMap((s) =>
    s.feedbackLogs.map((f) => ({
      ...f,
      timestamp: startTime + s.elapsedSeconds * 1000,
    })),
  );

  const vitalsSnapshots = transcript.steps.map((s) => ({
    timestamp: startTime + s.elapsedSeconds * 1000,
    vitals: s.vitals,
  }));

  const correctActions = actionsTaken.filter(
    (a) =>
      !transcript.steps.some(
        (s) =>
          s.actionParsed === a.action &&
          s.feedbackLogs.some((f) => f.type === "error"),
      ),
  );

  const communicationErrors = allFeedback.filter(
    (f) => f.type === "jargon",
  ).length;

  const missedActions = transcript.steps
    .filter(
      (s) =>
        s.isCriticalAction &&
        s.scoringImpact &&
        s.scoringImpact.pointsEarned < 0,
    )
    .map((s) => s.actionParsed || s.id);

  return {
    id: transcript.id,
    scenarioId: transcript.scenarioId,
    scenarioName: transcript.scenarioName,
    startTime,
    endTime: startTime + durationMs,
    durationMs,
    score: {
      timeToAntibiotics: null,
      timeToOxygen: null,
      timeToFluids: null,
      communicationErrors,
      totalActions: actionsTaken.length,
      correctActions: correctActions.length,
    },
    clinicalScore: {
      timeToFirstCriticalAction: null,
      timingScores: {},
      sequencingScore: 0,
      sequencingErrors: [],
      correctSequences: [],
      appropriateActions: correctActions.length,
      unnecessaryActions: 0,
      missedCriticalActions: missedActions,
      harmfulActions: [],
      jargonCount: communicationErrors,
      clarityScore: communicationErrors === 0 ? 100 : Math.max(0, 100 - communicationErrors * 15),
      totalScore: transcript.totalScore,
      maxPossibleScore: transcript.maxPossibleScore,
      grade: gradeMap[transcript.grade] || "F",
    },
    actionsTaken,
    events: allEvents,
    feedbackLogs: allFeedback,
    vitalsSnapshots,
    missedActions,
    grade: gradeMap[transcript.grade] || "F",
    totalScore: transcript.totalScore,
    maxPossibleScore: transcript.maxPossibleScore,
  };
}

export async function seedDemoSessions(): Promise<void> {
  for (const transcript of allDemoTranscripts) {
    const existing = await getSession(transcript.id);
    if (!existing) {
      const session = transcriptToSession(transcript);
      await saveSession(session);
    }
  }
  localStorage.setItem(DEMO_SEEDED_KEY, "true");
}

export async function removeDemoSessions(): Promise<void> {
  const demoIds = getAllDemoIds();
  for (const id of demoIds) {
    await deleteSession(id);
  }
  localStorage.removeItem(DEMO_SEEDED_KEY);
}

export function isDemoSeeded(): boolean {
  return localStorage.getItem(DEMO_SEEDED_KEY) === "true";
}

export function isDemoSession(sessionId: string): boolean {
  return sessionId.startsWith("demo-");
}
