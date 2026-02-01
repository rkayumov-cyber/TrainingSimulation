import type {
  TeamMember,
  TeamRole,
  TaskDelegation,
  HandoffEvent,
} from "../../types/enhanced";
import { v4 as uuidv4 } from "uuid";

// Default team members available
export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "nurse-1",
    name: "Sarah (RN)",
    role: "nurse",
    isAvailable: true,
    expertise: [
      "IV access",
      "medication administration",
      "vital monitoring",
      "patient positioning",
    ],
  },
  {
    id: "nurse-2",
    name: "Mike (RN)",
    role: "nurse",
    isAvailable: true,
    expertise: ["lab draws", "ECG", "documentation", "family communication"],
  },
  {
    id: "resident",
    name: "Dr. Chen (Resident)",
    role: "resident",
    isAvailable: true,
    expertise: ["history taking", "physical exam", "procedures", "orders"],
  },
  {
    id: "pharmacist",
    name: "Dr. Patel (PharmD)",
    role: "pharmacist",
    isAvailable: true,
    expertise: [
      "drug interactions",
      "dosing",
      "antibiotic selection",
      "allergies",
    ],
  },
];

// Specialist consultants
export const SPECIALISTS: Record<string, TeamMember> = {
  cardiology: {
    id: "cardio-consult",
    name: "Dr. Williams (Cardiology)",
    role: "specialist",
    isAvailable: true,
    expertise: ["MI management", "cath lab", "arrhythmias", "heart failure"],
  },
  pulmonology: {
    id: "pulm-consult",
    name: "Dr. Garcia (Pulmonology)",
    role: "specialist",
    isAvailable: true,
    expertise: ["respiratory failure", "ventilator", "asthma", "COPD"],
  },
  infectious: {
    id: "id-consult",
    name: "Dr. Johnson (ID)",
    role: "specialist",
    isAvailable: true,
    expertise: ["sepsis", "antibiotic selection", "cultures", "source control"],
  },
  allergy: {
    id: "allergy-consult",
    name: "Dr. Lee (Allergy/Immunology)",
    role: "specialist",
    isAvailable: true,
    expertise: ["anaphylaxis", "allergies", "immunotherapy", "testing"],
  },
};

// Task definitions - what can be delegated
export const DELEGATABLE_TASKS: Record<
  string,
  { roles: TeamRole[]; duration: number; result?: string }
> = {
  get_iv_access: {
    roles: ["nurse", "resident"],
    duration: 120, // 2 minutes
    result: "Two large-bore IVs placed successfully.",
  },
  draw_labs: {
    roles: ["nurse"],
    duration: 60,
    result: "Labs drawn and sent to lab.",
  },
  get_ecg: {
    roles: ["nurse"],
    duration: 90,
    result: "12-lead ECG obtained and ready for review.",
  },
  prepare_medications: {
    roles: ["nurse", "pharmacist"],
    duration: 60,
    result: "Medications prepared and verified.",
  },
  call_cardiology: {
    roles: ["resident", "attending"],
    duration: 180,
    result:
      "Cardiology on the way. They recommend emergent cath if STEMI confirmed.",
  },
  call_icu: {
    roles: ["resident", "attending"],
    duration: 120,
    result: "ICU bed available. Ready for transfer when patient stabilized.",
  },
  document_events: {
    roles: ["nurse", "resident"],
    duration: 300,
    result: "Events documented in chart.",
  },
  notify_family: {
    roles: ["nurse", "resident", "attending"],
    duration: 180,
    result: "Family notified and updated on condition.",
  },
  prepare_intubation: {
    roles: ["nurse", "resident"],
    duration: 90,
    result: "Intubation equipment at bedside. RSI meds ready.",
  },
  monitor_vitals: {
    roles: ["nurse"],
    duration: Infinity, // Continuous
    result: "Continuous monitoring in place.",
  },
};

// Parse delegation commands from chat
export function parseDelegationCommand(
  message: string,
): { task: string; role?: TeamRole } | null {
  const lowerMessage = message.toLowerCase();

  // Direct delegation patterns
  const patterns: { pattern: RegExp; task: string; role?: TeamRole }[] = [
    {
      pattern: /nurse.*(iv|line|access)/i,
      task: "get_iv_access",
      role: "nurse",
    },
    { pattern: /(draw|get).*(labs|blood)/i, task: "draw_labs", role: "nurse" },
    {
      pattern: /(get|do|run).*(ecg|ekg|12.?lead)/i,
      task: "get_ecg",
      role: "nurse",
    },
    { pattern: /call.*cardiology/i, task: "call_cardiology", role: "resident" },
    { pattern: /call.*icu/i, task: "call_icu", role: "resident" },
    {
      pattern: /(prepare|get).*(intubation|airway)/i,
      task: "prepare_intubation",
      role: "nurse",
    },
    {
      pattern: /(notify|call|update).*family/i,
      task: "notify_family",
      role: "nurse",
    },
    {
      pattern: /(prepare|draw up).*meds/i,
      task: "prepare_medications",
      role: "nurse",
    },
  ];

  for (const { pattern, task, role } of patterns) {
    if (pattern.test(lowerMessage)) {
      return { task, role };
    }
  }

  return null;
}

export class TeamSimulationManager {
  private team: Map<string, TeamMember> = new Map();
  private activeTasks: Map<string, TaskDelegation> = new Map();
  private handoffs: HandoffEvent[] = [];
  private taskCompletionCallbacks: ((task: TaskDelegation) => void)[] = [];

  initialize(): void {
    this.team.clear();
    this.activeTasks.clear();
    this.handoffs = [];

    for (const member of DEFAULT_TEAM) {
      this.team.set(member.id, { ...member });
    }
  }

  addSpecialist(specialtyKey: string): TeamMember | null {
    const specialist = SPECIALISTS[specialtyKey];
    if (specialist && !this.team.has(specialist.id)) {
      this.team.set(specialist.id, { ...specialist });
      return specialist;
    }
    return null;
  }

  getAvailableTeam(): TeamMember[] {
    return Array.from(this.team.values()).filter((m) => m.isAvailable);
  }

  getTeamByRole(role: TeamRole): TeamMember[] {
    return Array.from(this.team.values()).filter((m) => m.role === role);
  }

  delegateTask(taskId: string, assignedRole?: TeamRole): TaskDelegation | null {
    const taskDef = DELEGATABLE_TASKS[taskId];
    if (!taskDef) return null;

    // Find available team member
    const targetRole = assignedRole || taskDef.roles[0];
    const availableMembers = this.getTeamByRole(targetRole).filter(
      (m) => m.isAvailable,
    );

    if (availableMembers.length === 0) {
      // Try other eligible roles
      for (const role of taskDef.roles) {
        const others = this.getTeamByRole(role).filter((m) => m.isAvailable);
        if (others.length > 0) {
          return this.assignTask(taskId, others[0], taskDef);
        }
      }
      return null;
    }

    return this.assignTask(taskId, availableMembers[0], taskDef);
  }

  private assignTask(
    taskId: string,
    member: TeamMember,
    taskDef: { roles: TeamRole[]; duration: number; result?: string },
  ): TaskDelegation {
    const delegation: TaskDelegation = {
      id: uuidv4(),
      taskDescription: taskId.replace(/_/g, " "),
      assignedTo: member.role,
      assignedAt: Date.now(),
      status: "in_progress",
    };

    // Mark member as busy
    member.isAvailable = false;
    member.currentTask = taskId;
    member.taskStartTime = Date.now();

    this.activeTasks.set(delegation.id, delegation);

    // Schedule completion (if not continuous)
    if (taskDef.duration !== Infinity) {
      setTimeout(() => {
        this.completeTask(delegation.id, taskDef.result);
      }, taskDef.duration * 1000);
    }

    return delegation;
  }

  completeTask(delegationId: string, result?: string): void {
    const task = this.activeTasks.get(delegationId);
    if (!task) return;

    task.status = "completed";
    task.completedAt = Date.now();
    task.result = result;

    // Free up team member
    for (const member of this.team.values()) {
      if (member.currentTask === task.taskDescription.replace(/ /g, "_")) {
        member.isAvailable = true;
        member.currentTask = undefined;
        member.taskStartTime = undefined;
      }
    }

    // Notify callbacks
    for (const callback of this.taskCompletionCallbacks) {
      callback(task);
    }
  }

  onTaskComplete(callback: (task: TaskDelegation) => void): void {
    this.taskCompletionCallbacks.push(callback);
  }

  getActiveTasks(): TaskDelegation[] {
    return Array.from(this.activeTasks.values()).filter(
      (t) => t.status === "in_progress",
    );
  }

  getCompletedTasks(): TaskDelegation[] {
    return Array.from(this.activeTasks.values()).filter(
      (t) => t.status === "completed",
    );
  }

  recordHandoff(
    fromRole: TeamRole,
    toRole: TeamRole,
    summary: string,
    criticalInfo: string[],
  ): HandoffEvent {
    const handoff: HandoffEvent = {
      id: uuidv4(),
      fromRole,
      toRole,
      timestamp: Date.now(),
      summary,
      criticalInfo,
      qualityScore: this.calculateHandoffQuality(summary, criticalInfo),
    };

    this.handoffs.push(handoff);
    return handoff;
  }

  private calculateHandoffQuality(
    summary: string,
    criticalInfo: string[],
  ): number {
    let score = 50; // Base score

    // Length of summary
    if (summary.length > 50) score += 10;
    if (summary.length > 100) score += 10;

    // Number of critical items mentioned
    score += Math.min(30, criticalInfo.length * 10);

    return Math.min(100, score);
  }

  getHandoffHistory(): HandoffEvent[] {
    return this.handoffs;
  }

  // Generate team response/acknowledgment
  generateTeamResponse(taskId: string, member: TeamMember): string {
    const responses: Record<string, string[]> = {
      get_iv_access: [
        `${member.name}: "On it! Getting two large-bore IVs."`,
        `${member.name}: "Starting IV access now, I'll let you know when it's in."`,
      ],
      draw_labs: [
        `${member.name}: "Drawing labs now. Which tests do you want?"`,
        `${member.name}: "Got it, getting the rainbow."`,
      ],
      get_ecg: [
        `${member.name}: "Running the 12-lead now."`,
        `${member.name}: "ECG coming right up."`,
      ],
      call_cardiology: [
        `${member.name}: "Paging cardiology now. I'll give them the STEMI alert."`,
        `${member.name}: "Calling the cath lab. What's the door time?"`,
      ],
      prepare_intubation: [
        `${member.name}: "Setting up for intubation. What RSI meds do you want?"`,
        `${member.name}: "Airway cart at bedside. Ready when you are."`,
      ],
      notify_family: [
        `${member.name}: "I'll update the family. Any specific concerns I should address?"`,
      ],
    };

    const taskResponses = responses[taskId] || [`${member.name}: "On it!"`];
    return taskResponses[Math.floor(Math.random() * taskResponses.length)];
  }

  clear(): void {
    this.team.clear();
    this.activeTasks.clear();
    this.handoffs = [];
    this.taskCompletionCallbacks = [];
  }
}

// Singleton
let teamManager: TeamSimulationManager | null = null;

export function getTeamSimulationManager(): TeamSimulationManager {
  if (!teamManager) {
    teamManager = new TeamSimulationManager();
  }
  return teamManager;
}

export function resetTeamSimulationManager(): void {
  teamManager = new TeamSimulationManager();
}
