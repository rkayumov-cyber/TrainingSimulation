import { useContext } from "react";
import { Users, CheckCircle, Clock, User } from "lucide-react";
import { SimulationContext } from "../../context/SimulationContextDef";
import { getTeamSimulationManager } from "../../services/team";

export function TeamStatusPanel() {
  const context = useContext(SimulationContext);
  if (!context) return null;

  const { teamTasks, state } = context;
  const teamManager = getTeamSimulationManager();
  const allTeam = state.isRunning
    ? [
        ...teamManager.getTeamByRole("nurse"),
        ...teamManager.getTeamByRole("resident"),
        ...teamManager.getTeamByRole("pharmacist"),
      ]
    : [];

  if (!state.isRunning) {
    return (
      <div className="p-4 text-center text-slate-400">
        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Start a simulation to see your team</p>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "nurse":
        return "bg-blue-500";
      case "resident":
        return "bg-purple-500";
      case "pharmacist":
        return "bg-emerald-500";
      case "specialist":
        return "bg-orange-500";
      default:
        return "bg-slate-500";
    }
  };

  const activeTasks = teamTasks.filter((t) => t.status === "in_progress");
  const completedTasks = teamTasks.filter((t) => t.status === "completed");

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Your Team
      </h3>

      {/* Team Members */}
      <div className="grid grid-cols-2 gap-2">
        {allTeam.map((member) => (
          <div
            key={member.id}
            className={`p-2 rounded-lg ${member.isAvailable ? "bg-slate-800" : "bg-slate-800/50"}`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${member.isAvailable ? "bg-emerald-500" : "bg-yellow-500"}`}
              />
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-white truncate">{member.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-1.5 py-0.5 rounded ${getRoleColor(member.role)} text-white`}
              >
                {member.role}
              </span>
              {!member.isAvailable && member.currentTask && (
                <span className="text-xs text-yellow-400 truncate">
                  {member.currentTask.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Progress ({activeTasks.length})
          </h4>
          {activeTasks.map((task) => (
            <div
              key={task.id}
              className="bg-yellow-900/20 rounded-lg p-2 border border-yellow-900/50"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">
                  {task.taskDescription}
                </span>
                <span className="text-xs text-yellow-400 animate-pulse">
                  Working...
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Assigned to: {task.assignedTo}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed ({completedTasks.length})
          </h4>
          {completedTasks.slice(-3).map((task) => (
            <div
              key={task.id}
              className="bg-emerald-900/20 rounded-lg p-2 border border-emerald-900/50"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">
                  {task.taskDescription}
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              {task.result && (
                <div className="text-xs text-emerald-300 mt-1">
                  {task.result}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delegation Tips */}
      <div className="text-xs text-slate-500 p-2 bg-slate-800/50 rounded">
        <p className="font-medium text-slate-400 mb-1">Delegation Examples:</p>
        <ul className="space-y-0.5">
          <li>"Nurse, get IV access"</li>
          <li>"Draw labs please"</li>
          <li>"Call cardiology"</li>
          <li>"Get a 12-lead ECG"</li>
        </ul>
      </div>
    </div>
  );
}
