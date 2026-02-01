import { useState } from "react";
import { MessageSquare, ClipboardList } from "lucide-react";
import { ChatWindow, ChatInput, PatientStatus, HistoryTakingPanel } from "./patient";
import { MDTChat } from "./mdt";

type PatientTab = "chat" | "history";

export function PatientPanel() {
  const [activeTab, setActiveTab] = useState<PatientTab>("chat");

  return (
    <div className="flex flex-col h-full">
      <PatientStatus />
      {/* Tab switcher */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === "chat"
              ? "text-white border-b-2 border-emerald-400 bg-slate-900/50"
              : "text-slate-400 hover:text-white hover:bg-slate-900/30"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === "history"
              ? "text-white border-b-2 border-blue-400 bg-slate-900/50"
              : "text-slate-400 hover:text-white hover:bg-slate-900/30"
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5" />
          History Taking
        </button>
      </div>
      {activeTab === "chat" ? (
        <>
          <ChatWindow />
          <ChatInput />
          <MDTChat />
        </>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <HistoryTakingPanel />
        </div>
      )}
    </div>
  );
}
