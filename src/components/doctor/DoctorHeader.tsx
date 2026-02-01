import { LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface DoctorHeaderProps {
  onViewProgress?: () => void;
}

export function DoctorHeader({ onViewProgress }: DoctorHeaderProps) {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Clinical Simulation</h1>

        <div className="flex items-center gap-4">
          {onViewProgress && (
            <button
              onClick={onViewProgress}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              My Progress
            </button>
          )}
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white">{currentUser?.name}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <LogOut className="w-3 h-3" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
