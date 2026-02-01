import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  SessionRecord,
  SessionSummary,
  ScenarioProgress,
} from "../../types/session";

interface SessionDBSchema extends DBSchema {
  sessions: {
    key: string;
    value: SessionRecord;
    indexes: {
      "by-scenario": string;
      "by-date": number;
    };
  };
}

const DB_NAME = "clinical-sim-sessions";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<SessionDBSchema> | null = null;

async function getDB(): Promise<IDBPDatabase<SessionDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<SessionDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("sessions", { keyPath: "id" });
      store.createIndex("by-scenario", "scenarioId");
      store.createIndex("by-date", "startTime");
    },
  });

  return dbInstance;
}

export async function saveSession(session: SessionRecord): Promise<void> {
  const db = await getDB();
  await db.put("sessions", session);
}

export async function getSession(
  id: string,
): Promise<SessionRecord | undefined> {
  const db = await getDB();
  return db.get("sessions", id);
}

export async function getAllSessions(): Promise<SessionRecord[]> {
  const db = await getDB();
  const sessions = await db.getAllFromIndex("sessions", "by-date");
  return sessions.reverse(); // Most recent first
}

export async function getSessionsByScenario(
  scenarioId: string,
): Promise<SessionRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex("sessions", "by-scenario", scenarioId);
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("sessions", id);
}

export async function clearAllSessions(): Promise<void> {
  const db = await getDB();
  await db.clear("sessions");
}

export async function getSessionSummaries(): Promise<SessionSummary[]> {
  const sessions = await getAllSessions();
  return sessions.map((s) => ({
    id: s.id,
    scenarioId: s.scenarioId,
    scenarioName: s.scenarioName,
    date: s.startTime,
    durationMs: s.durationMs,
    grade: s.grade,
    totalScore: s.totalScore,
    maxPossibleScore: s.maxPossibleScore,
    actionCount: s.actionsTaken.length,
    communicationErrors: s.score.communicationErrors,
  }));
}

const GRADE_ORDER: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, F: 1 };

function bestGrade(a: string, b: string): "A" | "B" | "C" | "D" | "F" {
  return (GRADE_ORDER[a] >= GRADE_ORDER[b] ? a : b) as
    | "A"
    | "B"
    | "C"
    | "D"
    | "F";
}

export async function getScenarioProgress(): Promise<ScenarioProgress[]> {
  const sessions = await getAllSessions();
  const map = new Map<string, SessionRecord[]>();

  for (const session of sessions) {
    const existing = map.get(session.scenarioId) || [];
    existing.push(session);
    map.set(session.scenarioId, existing);
  }

  const progress: ScenarioProgress[] = [];

  for (const [scenarioId, scenarioSessions] of map) {
    const sorted = scenarioSessions.sort((a, b) => a.startTime - b.startTime);
    const scores = sorted.map((s) => s.totalScore);
    const best = sorted.reduce<{
      grade: "A" | "B" | "C" | "D" | "F";
      score: number;
    }>(
      (acc, s) => ({
        grade: bestGrade(acc.grade, s.grade),
        score: Math.max(acc.score, s.totalScore),
      }),
      { grade: "F", score: 0 },
    );

    progress.push({
      scenarioId,
      scenarioName: sorted[0].scenarioName,
      attempts: sorted.length,
      bestGrade: best.grade,
      bestScore: best.score,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      lastAttempt: sorted[sorted.length - 1].startTime,
      gradeHistory: sorted.map((s) => ({
        date: s.startTime,
        grade: s.grade,
        score: s.totalScore,
      })),
    });
  }

  return progress.sort((a, b) => b.lastAttempt - a.lastAttempt);
}

export async function getSessionCount(): Promise<number> {
  const db = await getDB();
  return db.count("sessions");
}
