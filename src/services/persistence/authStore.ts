import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { AuthSettings, ActivityLogEntry } from "../../types/auth";

interface AuthDBSchema extends DBSchema {
  settings: {
    key: string;
    value: { key: string; value: string };
  };
  activityLog: {
    key: string;
    value: ActivityLogEntry;
    indexes: {
      "by-user": string;
      "by-date": number;
    };
  };
}

const DB_NAME = "clinical-sim-auth";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<AuthDBSchema> | null = null;

async function getDB(): Promise<IDBPDatabase<AuthDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<AuthDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore("settings", { keyPath: "key" });

      const activityStore = db.createObjectStore("activityLog", {
        keyPath: "id",
      });
      activityStore.createIndex("by-user", "userName");
      activityStore.createIndex("by-date", "timestamp");
    },
  });

  return dbInstance;
}

// ── PIN Hashing ──

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + "clinical-sim-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPin(
  pin: string,
  storedHash: string,
): Promise<boolean> {
  const pinHash = await hashPin(pin);
  return pinHash === storedHash;
}

// ── Auth Settings ──

export async function getAuthSettings(): Promise<AuthSettings | null> {
  const db = await getDB();
  const pinRow = await db.get("settings", "adminPinHash");
  const setupRow = await db.get("settings", "setupComplete");

  if (!pinRow) return null;

  return {
    adminPinHash: pinRow.value,
    setupComplete: setupRow?.value === "true",
  };
}

export async function saveAuthSettings(
  settings: AuthSettings,
): Promise<void> {
  const db = await getDB();
  await db.put("settings", {
    key: "adminPinHash",
    value: settings.adminPinHash,
  });
  await db.put("settings", {
    key: "setupComplete",
    value: settings.setupComplete ? "true" : "false",
  });
}

// ── Activity Log ──

export async function logActivity(
  entry: ActivityLogEntry,
): Promise<void> {
  const db = await getDB();
  await db.put("activityLog", entry);
}

export async function getActivityLog(
  limit?: number,
): Promise<ActivityLogEntry[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("activityLog", "by-date");
  const sorted = all.reverse();
  return limit ? sorted.slice(0, limit) : sorted;
}

export async function getActivityByUser(
  userName: string,
): Promise<ActivityLogEntry[]> {
  const db = await getDB();
  const entries = await db.getAllFromIndex("activityLog", "by-user", userName);
  return entries.reverse();
}

export async function clearActivityLog(): Promise<void> {
  const db = await getDB();
  await db.clear("activityLog");
}
