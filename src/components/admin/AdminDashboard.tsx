import { useState, useEffect } from "react";
import {
  FileText,
  Image,
  Activity,
  Users,
  LayoutTemplate,
  Download,
  BookOpen,
  Database,
  Trash2,
} from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import type { AdminTab } from "./AdminSidebar";
import { ScenarioListPanel } from "./ScenarioListPanel";
import { ActivityLogPanel } from "./ActivityLogPanel";
import { SettingsPanel } from "./SettingsPanel";
import { getAllScenarios } from "../../scenarios";
import { getSessionCount } from "../../services/persistence";
import { getActivityLog } from "../../services/persistence/authStore";
import {
  seedDemoSessions,
  removeDemoSessions,
  isDemoSeeded,
} from "../../services/demo";

interface AdminDashboardProps {
  onOpenBuilder: (editId?: string) => void;
  onOpenTemplates: () => void;
  onOpenImageLibrary: () => void;
  onStartSimulation: (scenarioId?: string) => void;
  onImportScenario: () => void;
  onViewDemos?: () => void;
}

export function AdminDashboard({
  onOpenBuilder,
  onOpenTemplates,
  onOpenImageLibrary,
  onStartSimulation,
  onImportScenario,
  onViewDemos,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("scenarios");
  const [stats, setStats] = useState({
    totalScenarios: 0,
    totalSessions: 0,
    recentActivity: 0,
  });
  const [demoLoaded, setDemoLoaded] = useState(isDemoSeeded());
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      Promise.resolve(getAllScenarios().length),
      getSessionCount(),
      getActivityLog(50),
    ]).then(([scenarioCount, sessionCount, activity]) => {
      setStats({
        totalScenarios: scenarioCount,
        totalSessions: sessionCount,
        recentActivity: activity.length,
      });
    });
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "scenarios":
        return (
          <ScenarioListPanel
            onNewScenario={() => onOpenBuilder()}
            onNewFromTemplate={onOpenTemplates}
            onEditScenario={(id) => onOpenBuilder(id)}
            onPreviewScenario={(id) => onStartSimulation(id)}
          />
        );
      case "templates":
        // Redirect to template picker
        onOpenTemplates();
        return null;
      case "images":
        // Redirect to image library
        onOpenImageLibrary();
        return null;
      case "activity":
        return <ActivityLogPanel />;
      case "settings":
        return <SettingsPanel />;
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Quick Stats Bar */}
        {activeTab === "scenarios" && (
          <div className="border-b border-slate-800 px-6 py-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-400">
                  {stats.totalScenarios} scenarios
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-slate-400">
                  {stats.totalSessions} sessions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-400">
                  {stats.recentActivity} log entries
                </span>
              </div>

              <div className="flex-1" />

              <div className="flex items-center gap-2">
                {onViewDemos && (
                  <button
                    onClick={onViewDemos}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    View Demos
                  </button>
                )}
                <button
                  onClick={async () => {
                    setDemoLoading(true);
                    if (demoLoaded) {
                      await removeDemoSessions();
                      setDemoLoaded(false);
                    } else {
                      await seedDemoSessions();
                      setDemoLoaded(true);
                    }
                    setDemoLoading(false);
                  }}
                  disabled={demoLoading}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    demoLoaded
                      ? "bg-red-700 hover:bg-red-600 text-white"
                      : "bg-emerald-700 hover:bg-emerald-600 text-white"
                  } disabled:opacity-50`}
                >
                  {demoLoaded ? (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      {demoLoading ? "Clearing..." : "Clear Sample Data"}
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      {demoLoading ? "Loading..." : "Load Sample Data"}
                    </>
                  )}
                </button>
                <div className="w-px h-5 bg-slate-700" />
                <button
                  onClick={onOpenTemplates}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <LayoutTemplate className="w-3.5 h-3.5" />
                  New from Template
                </button>
                <button
                  onClick={onImportScenario}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Import
                </button>
                <button
                  onClick={onOpenImageLibrary}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Image className="w-3.5 h-3.5" />
                  Images
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderContent()}</div>
      </div>
    </div>
  );
}
