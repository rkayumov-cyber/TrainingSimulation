import {
  FileText,
  LayoutTemplate,
  Image,
  Activity,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export type ManagerTab =
  | "scenarios"
  | "templates"
  | "images"
  | "activity"
  | "settings";

interface ManagerSidebarProps {
  activeTab: ManagerTab;
  onTabChange: (tab: ManagerTab) => void;
}

const TABS: { key: ManagerTab; label: string; icon: React.ReactNode }[] = [
  {
    key: "scenarios",
    label: "Scenarios",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    key: "templates",
    label: "Templates",
    icon: <LayoutTemplate className="w-4 h-4" />,
  },
  { key: "images", label: "Images", icon: <Image className="w-4 h-4" /> },
  {
    key: "activity",
    label: "Activity",
    icon: <Activity className="w-4 h-4" />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <Settings className="w-4 h-4" />,
  },
];

export function ManagerSidebar({
  activeTab,
  onTabChange,
}: ManagerSidebarProps) {
  const { currentUser, logout } = useAuth();

  return (
    <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="px-4 py-5 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white">Manager Dashboard</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage scenarios & settings
        </p>
      </div>

      <nav className="flex-1 py-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-slate-800 text-white border-r-2 border-emerald-400"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {currentUser?.name}
            </p>
            <p className="text-slate-500 text-xs">Manager</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
