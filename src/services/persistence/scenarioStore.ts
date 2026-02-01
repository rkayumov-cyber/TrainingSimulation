import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type {
  CustomScenarioDefinition,
  ScenarioAttachment,
  BenchmarkDefinition,
} from "../../types/scenarioBuilder";

interface ScenarioDBSchema extends DBSchema {
  scenarios: {
    key: string;
    value: CustomScenarioDefinition;
    indexes: {
      "by-date": number;
    };
  };
  attachments: {
    key: string;
    value: ScenarioAttachment;
    indexes: {
      "by-scenario": string;
    };
  };
  benchmarks: {
    key: string;
    value: BenchmarkDefinition;
  };
}

const DB_NAME = "clinical-sim-custom-scenarios";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<ScenarioDBSchema> | null = null;

async function getDB(): Promise<IDBPDatabase<ScenarioDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ScenarioDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const scenarioStore = db.createObjectStore("scenarios", { keyPath: "id" });
      scenarioStore.createIndex("by-date", "createdAt");

      const attachmentStore = db.createObjectStore("attachments", { keyPath: "id" });
      attachmentStore.createIndex("by-scenario", "scenarioId");

      db.createObjectStore("benchmarks", { keyPath: "scenarioId" });
    },
  });

  return dbInstance;
}

// ── Scenario CRUD ──

export async function saveCustomScenario(
  scenario: CustomScenarioDefinition,
): Promise<void> {
  const db = await getDB();
  await db.put("scenarios", scenario);
}

export async function getAllCustomScenarios(): Promise<CustomScenarioDefinition[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("scenarios", "by-date");
  return all.reverse();
}

export async function getCustomScenario(
  id: string,
): Promise<CustomScenarioDefinition | undefined> {
  const db = await getDB();
  return db.get("scenarios", id);
}

export async function deleteCustomScenario(id: string): Promise<void> {
  const db = await getDB();
  // Delete scenario
  await db.delete("scenarios", id);
  // Delete associated attachments
  const attachments = await db.getAllFromIndex("attachments", "by-scenario", id);
  for (const att of attachments) {
    await db.delete("attachments", att.id);
  }
  // Delete associated benchmark
  await db.delete("benchmarks", id);
}

// ── Attachment Operations ──

export async function saveAttachment(
  attachment: ScenarioAttachment,
): Promise<void> {
  const db = await getDB();
  await db.put("attachments", attachment);
}

export async function getAttachmentsByScenario(
  scenarioId: string,
): Promise<ScenarioAttachment[]> {
  const db = await getDB();
  return db.getAllFromIndex("attachments", "by-scenario", scenarioId);
}

export async function deleteAttachment(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("attachments", id);
}

// ── Benchmark Operations ──

export async function saveBenchmark(
  benchmark: BenchmarkDefinition,
): Promise<void> {
  const db = await getDB();
  await db.put("benchmarks", benchmark);
}

export async function getBenchmarkByScenario(
  scenarioId: string,
): Promise<BenchmarkDefinition | undefined> {
  const db = await getDB();
  return db.get("benchmarks", scenarioId);
}

// ── Export / Import ──

export interface ExportedScenario {
  scenario: CustomScenarioDefinition;
  attachments: ScenarioAttachment[];
  benchmark?: BenchmarkDefinition;
}

export async function exportScenario(id: string): Promise<ExportedScenario | null> {
  const db = await getDB();
  const scenario = await db.get("scenarios", id);
  if (!scenario) return null;

  const attachments = await db.getAllFromIndex("attachments", "by-scenario", id);
  const benchmark = await db.get("benchmarks", id);

  return { scenario, attachments, benchmark };
}

export async function importScenario(data: ExportedScenario): Promise<void> {
  const db = await getDB();
  await db.put("scenarios", data.scenario);
  for (const att of data.attachments) {
    await db.put("attachments", att);
  }
  if (data.benchmark) {
    await db.put("benchmarks", data.benchmark);
  }
}
