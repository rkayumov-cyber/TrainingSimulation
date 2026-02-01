import { useState, useCallback, useEffect } from "react";
import { SimulationProvider } from "./context";
import { useSimulation } from "./context";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Header, SplitScreen } from "./components/layout";
import { PatientPanel } from "./components/PatientPanel";
import { MonitorPanel } from "./components/MonitorPanel";
import { DebriefingPanel } from "./components/debrief";
import { ProgressDashboard } from "./components/dashboard";
import { ScenarioBuilderPage } from "./components/builder";
import { LoginPage } from "./components/auth/LoginPage";
import { SetupPinPage } from "./components/auth/SetupPinPage";
import { ManagerDashboard } from "./components/manager/ManagerDashboard";
import { TemplatePickerPanel } from "./components/manager/TemplatePickerPanel";
import { ImageLibraryPage } from "./components/manager/ImageLibraryPage";
import { DoctorHomePage } from "./components/doctor/DoctorHomePage";
import { DemoSelector, DemoWalkthroughPage } from "./components/demo";
import { getAllCustomScenarios, importScenario } from "./services/persistence";
import { registerCustomScenarios } from "./scenarios";
import { v4 as uuidv4 } from "uuid";

type ActivePage =
  | "simulation"
  | "dashboard"
  | "builder"
  | "manager"
  | "doctor-home"
  | "templates"
  | "image-library"
  | "demo-selector"
  | "demo-walkthrough";

function SimulationApp({
  onNavigate,
  onEditScenario,
  isManager,
}: {
  onNavigate: (page: ActivePage) => void;
  onEditScenario: (scenarioId: string) => void;
  isManager: boolean;
}) {
  const { state, resetSimulation, endSimulation } = useSimulation();

  const showDebrief =
    !state.isRunning && state.score.totalActions > 0;

  const handleEndAndDebrief = useCallback(() => {
    endSimulation();
  }, [endSimulation]);

  const handleReset = useCallback(() => {
    resetSimulation();
  }, [resetSimulation]);

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <Header
        onViewDashboard={() => onNavigate("dashboard")}
        onEndSimulation={
          state.isRunning && !state.isPaused ? handleEndAndDebrief : undefined
        }
        onOpenBuilder={isManager ? () => onNavigate("builder") : undefined}
        onEditCustomScenario={isManager ? onEditScenario : undefined}
        onBack={() =>
          onNavigate(isManager ? "manager" : "doctor-home")
        }
      />
      <SplitScreen left={<PatientPanel />} right={<MonitorPanel />} />
      {showDebrief && (
        <DebriefingPanel
          onReset={handleReset}
          onViewDashboard={() => onNavigate("dashboard")}
        />
      )}
    </div>
  );
}

function AuthenticatedApp() {
  const { currentUser, isManager } = useAuth();
  const [activePage, setActivePage] = useState<ActivePage>(
    isManager ? "manager" : "doctor-home",
  );
  const [editScenarioId, setEditScenarioId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [initialScenarioId, setInitialScenarioId] = useState<string | null>(
    null,
  );
  const [demoScenarioId, setDemoScenarioId] = useState<string | null>(null);
  const [demoLevel, setDemoLevel] = useState<
    "excellent" | "mediocre" | "poor"
  >("excellent");

  // Load custom scenarios on mount
  useEffect(() => {
    getAllCustomScenarios().then((customs) => {
      registerCustomScenarios(customs);
    });
  }, []);

  // Reset page when user changes
  useEffect(() => {
    setActivePage(isManager ? "manager" : "doctor-home");
  }, [currentUser?.name, isManager]);

  const handleNavigate = useCallback(
    (page: ActivePage) => {
      setActivePage(page);
      if (page !== "builder") {
        setEditScenarioId(null);
        setTemplateId(null);
      }
    },
    [],
  );

  const handleEditScenario = useCallback((scenarioId: string) => {
    setEditScenarioId(scenarioId);
    setActivePage("builder");
  }, []);

  const handleNewFromTemplate = useCallback((tplId: string) => {
    setTemplateId(tplId);
    setEditScenarioId(null);
    setActivePage("builder");
  }, []);

  const handleImportScenario = useCallback(() => {
    // Trigger file import via a hidden input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const data = JSON.parse(text);
      const newId = `custom-${uuidv4().slice(0, 8)}`;
      data.scenario.id = newId;
      data.scenario.createdAt = Date.now();
      data.scenario.updatedAt = Date.now();
      for (const att of data.attachments || []) {
        att.scenarioId = newId;
        att.id = uuidv4();
      }
      if (data.benchmark) {
        data.benchmark.scenarioId = newId;
      }
      await importScenario(data);
      const customs = await getAllCustomScenarios();
      registerCustomScenarios(customs);
      setActivePage("manager");
    };
    input.click();
  }, []);

  if (activePage === "demo-selector") {
    return (
      <DemoSelector
        onSelectDemo={(scenarioId, level) => {
          setDemoScenarioId(scenarioId);
          setDemoLevel(level);
          handleNavigate("demo-walkthrough");
        }}
        onBack={() => handleNavigate(isManager ? "manager" : "doctor-home")}
      />
    );
  }

  if (activePage === "demo-walkthrough" && demoScenarioId) {
    return (
      <DemoWalkthroughPage
        scenarioId={demoScenarioId}
        level={demoLevel}
        onBack={() => handleNavigate("demo-selector")}
      />
    );
  }

  if (activePage === "dashboard") {
    return (
      <SimulationProvider>
        <ProgressDashboard
          onBack={() =>
            handleNavigate(isManager ? "manager" : "doctor-home")
          }
        />
      </SimulationProvider>
    );
  }

  if (activePage === "builder" && isManager) {
    return (
      <ScenarioBuilderPage
        editScenarioId={editScenarioId}
        templateId={templateId}
        onBack={() => handleNavigate("manager")}
        onSaved={() => {
          getAllCustomScenarios().then((customs) => {
            registerCustomScenarios(customs);
            handleNavigate("manager");
          });
        }}
      />
    );
  }

  if (activePage === "templates" && isManager) {
    return (
      <TemplatePickerPanel
        onBack={() => handleNavigate("manager")}
        onSelectTemplate={handleNewFromTemplate}
      />
    );
  }

  if (activePage === "image-library" && isManager) {
    return <ImageLibraryPage onBack={() => handleNavigate("manager")} />;
  }

  if (activePage === "manager" && isManager) {
    return (
      <ManagerDashboard
        onOpenBuilder={(editId) => {
          if (editId) {
            handleEditScenario(editId);
          } else {
            setEditScenarioId(null);
            setTemplateId(null);
            setActivePage("builder");
          }
        }}
        onOpenTemplates={() => handleNavigate("templates")}
        onOpenImageLibrary={() => handleNavigate("image-library")}
        onStartSimulation={(scenarioId) => {
          setInitialScenarioId(scenarioId || null);
          handleNavigate("simulation");
        }}
        onImportScenario={handleImportScenario}
        onViewDemos={() => handleNavigate("demo-selector")}
      />
    );
  }

  if (activePage === "doctor-home" && !isManager) {
    return (
      <DoctorHomePage
        onStartSimulation={(scenario) => {
          setInitialScenarioId(scenario.id);
          handleNavigate("simulation");
        }}
        onViewProgress={() => handleNavigate("dashboard")}
        onViewDemos={() => handleNavigate("demo-selector")}
      />
    );
  }

  // Simulation page (both roles)
  return (
    <SimulationProvider initialScenarioId={initialScenarioId}>
      <SimulationApp
        onNavigate={handleNavigate}
        onEditScenario={handleEditScenario}
        isManager={isManager}
      />
    </SimulationProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}

function AppGate() {
  const { currentUser, isSetupComplete, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!isSetupComplete) {
    return <SetupPinPage />;
  }

  if (!currentUser) {
    return <LoginPage />;
  }

  return <AuthenticatedApp />;
}

export default App;
