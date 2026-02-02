import { useState, useEffect } from "react";
import { Activity, User, Calendar, Filter } from "lucide-react";
import type { ActivityLogEntry } from "../../types/auth";
import { getActivityLog } from "../../services/persistence/authStore";

export function ActivityLogPanel() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("");

  useEffect(() => {
    getActivityLog(200).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const uniqueUsers = [...new Set(entries.map((e) => e.userName))];
  const filtered = filterUser
    ? entries.filter((e) => e.userName === filterUser)
    : entries;

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const actionColor = (action: string) => {
    if (action.includes("started")) return "text-emerald-400";
    if (action.includes("ended")) return "text-blue-400";
    if (action.includes("scored")) return "text-amber-400";
    if (action.includes("login")) return "text-purple-400";
    return "text-slate-400";
  };

  if (loading) {
    return (
      <div className="text-slate-400 text-sm py-12 text-center">
        Loading activity log...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          Activity Log
        </h2>
        {uniqueUsers.length > 1 && (
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
            >
              <option value="">All Users</option>
              {uniqueUsers.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No activity recorded yet</p>
          <p className="text-slate-600 text-xs mt-1">
            Activity will appear here as trainees use simulations
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 bg-slate-800/50 border border-slate-800 rounded-lg px-3 py-2.5"
            >
              <div className="w-7 h-7 bg-slate-700 rounded flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {entry.userName}
                  </span>
                  <span className={`text-xs ${actionColor(entry.action)}`}>
                    {entry.action}
                  </span>
                </div>
                {entry.scenarioName && (
                  <p className="text-slate-500 text-xs truncate">
                    {entry.scenarioName}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-slate-500 text-xs shrink-0">
                <Calendar className="w-3 h-3" />
                {formatDate(entry.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
