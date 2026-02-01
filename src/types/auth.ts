export type UserRole = "manager" | "doctor";

export interface AuthUser {
  name: string;
  role: UserRole;
  loginTime: number;
}

export interface AuthSettings {
  adminPinHash: string;
  setupComplete: boolean;
}

export interface ActivityLogEntry {
  id: string;
  userName: string;
  userRole: UserRole;
  action: string;
  scenarioId?: string;
  scenarioName?: string;
  details?: string;
  timestamp: number;
}
