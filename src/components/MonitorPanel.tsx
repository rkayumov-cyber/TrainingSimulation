import { useState } from "react";
import {
  Activity,
  FlaskConical,
  ClipboardList,
  BookOpen,
  Award,
  Pill,
  Users,
  Lightbulb,
  ListChecks,
  ScanLine,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  BarChart3,
} from "lucide-react";
import {
  VitalsPanel,
  LabsPanel,
  EventsTimeline,
  DeteriorationTimers,
  NEWS2Panel,
  ABCDEPanel,
  PhysicalExamPanel,
} from "./monitor";
import { FeedbackPanel } from "./feedback";
import { KnowledgeBasePanel } from "./knowledge";
import { ChecklistPanel } from "./checklist";
import {
  ClinicalScorePanel,
  DrugEffectsPanel,
  EnhancedLabsPanel,
  TeamStatusPanel,
  ContextualHintsPanel,
  ClinicalReferencePanel,
  PerformanceMetricsPanel,
} from "./enhanced";
import { ImagingPanel } from "./imaging";
import { useSimulation } from "../context";

type Tab =
  | "vitals"
  | "labs"
  | "events"
  | "score"
  | "drugs"
  | "team"
  | "hints"
  | "knowledge"
  | "osce"
  | "imaging"
  | "news2"
  | "abcde"
  | "exam"
  | "reference"
  | "metrics";

export function MonitorPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("vitals");
  const { checklist, checklistResult, difficultyModifiers } = useSimulation();

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "vitals", label: "Vitals", icon: <Activity className="w-4 h-4" /> },
    { id: "labs", label: "Labs", icon: <FlaskConical className="w-4 h-4" /> },
    {
      id: "events",
      label: "Events",
      icon: <ClipboardList className="w-4 h-4" />,
    },
    { id: "score", label: "Score", icon: <Award className="w-4 h-4" /> },
    { id: "drugs", label: "Drugs", icon: <Pill className="w-4 h-4" /> },
    { id: "team", label: "Team", icon: <Users className="w-4 h-4" /> },
    ...(difficultyModifiers.hintsVisible
      ? [
          {
            id: "hints" as Tab,
            label: "Hints",
            icon: <Lightbulb className="w-4 h-4" />,
          },
        ]
      : []),
    {
      id: "news2" as Tab,
      label: "NEWS2",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: "abcde" as Tab,
      label: "ABCDE",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: "exam" as Tab,
      label: "Exam",
      icon: <Stethoscope className="w-4 h-4" />,
    },
    {
      id: "imaging" as Tab,
      label: "Imaging",
      icon: <ScanLine className="w-4 h-4" />,
    },
    {
      id: "reference" as Tab,
      label: "Ref",
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: "metrics" as Tab,
      label: "Metrics",
      icon: <BarChart3 className="w-4 h-4 text-amber-400" />,
    },
    { id: "knowledge", label: "KB", icon: <BookOpen className="w-4 h-4" /> },
    ...(difficultyModifiers.checklistVisible
      ? [
          {
            id: "osce" as Tab,
            label: "OSCE",
            icon: <ListChecks className="w-4 h-4" />,
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation - scrollable for many tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "text-white border-b-2 border-emerald-400 bg-slate-900/50"
                : "text-slate-400 hover:text-white hover:bg-slate-900/30"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "vitals" && <VitalsPanel />}
        {activeTab === "labs" && (
          <div>
            <LabsPanel />
            <div className="border-t border-slate-800 mt-2">
              <EnhancedLabsPanel />
            </div>
          </div>
        )}
        {activeTab === "events" && <EventsTimeline />}
        {activeTab === "score" && <ClinicalScorePanel />}
        {activeTab === "drugs" && <DrugEffectsPanel />}
        {activeTab === "team" && <TeamStatusPanel />}
        {activeTab === "hints" && <ContextualHintsPanel />}
        {activeTab === "news2" && <NEWS2Panel />}
        {activeTab === "abcde" && <ABCDEPanel />}
        {activeTab === "exam" && <PhysicalExamPanel />}
        {activeTab === "imaging" && <ImagingPanel />}
        {activeTab === "reference" && <ClinicalReferencePanel />}
        {activeTab === "metrics" && <PerformanceMetricsPanel />}
        {activeTab === "knowledge" && (
          <div className="p-4">
            <KnowledgeBasePanel />
          </div>
        )}
        {activeTab === "osce" && (
          <ChecklistPanel
            checklist={checklist}
            checklistResult={checklistResult}
          />
        )}
      </div>

      {/* Deterioration timers */}
      <DeteriorationTimers />

      {/* Feedback always visible at bottom */}
      <FeedbackPanel />
    </div>
  );
}
