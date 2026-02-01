import { useState, useMemo, useCallback } from "react";
import {
  FileText,
  ClipboardList,
  Stethoscope,
  Brain,
  ListChecks,
  Download,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useSimulation } from "../../context";

interface SOAPSection {
  key: "subjective" | "objective" | "assessment" | "plan";
  letter: string;
  title: string;
  icon: React.ReactNode;
  badgeBg: string;
  badgeText: string;
  placeholder: string;
  hasAutoFill: boolean;
}

const SECTIONS: SOAPSection[] = [
  {
    key: "subjective",
    letter: "S",
    title: "Subjective",
    icon: <ClipboardList className="w-4 h-4" />,
    badgeBg: "bg-blue-500/20",
    badgeText: "text-blue-400",
    placeholder:
      "e.g., Patient reports chest pain radiating to left arm, onset 2 hours ago, associated with diaphoresis and nausea...",
    hasAutoFill: true,
  },
  {
    key: "objective",
    letter: "O",
    title: "Objective",
    icon: <Stethoscope className="w-4 h-4" />,
    badgeBg: "bg-green-500/20",
    badgeText: "text-green-400",
    placeholder:
      "e.g., Vitals: HR 110, BP 90/60, SpO2 94%. Labs: Troponin elevated. ECG: ST elevation in leads II, III, aVF...",
    hasAutoFill: true,
  },
  {
    key: "assessment",
    letter: "A",
    title: "Assessment",
    icon: <Brain className="w-4 h-4" />,
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-400",
    placeholder:
      "e.g., Suspected acute ST-elevation MI with hemodynamic instability",
    hasAutoFill: false,
  },
  {
    key: "plan",
    letter: "P",
    title: "Plan",
    icon: <ListChecks className="w-4 h-4" />,
    badgeBg: "bg-purple-500/20",
    badgeText: "text-purple-400",
    placeholder:
      "e.g., 1. Continue O2 therapy 2. Administer aspirin 325mg 3. Activate cath lab...",
    hasAutoFill: true,
  },
];

export function SOAPNotePanel() {
  const { state, scenario } = useSimulation();

  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [copied, setCopied] = useState(false);

  const textState: Record<string, string> = {
    subjective,
    objective,
    assessment,
    plan,
  };

  const setters: Record<string, (val: string) => void> = useMemo(
    () => ({
      subjective: setSubjective,
      objective: setObjective,
      assessment: setAssessment,
      plan: setPlan,
    }),
    [],
  );

  // --- Auto-fill suggestions ---

  const suggestedSubjective = useMemo(() => {
    const patientMessages = state.chatMessages
      .filter((msg) => msg.sender === "patient")
      .slice(0, 4)
      .map((msg) => msg.content);
    if (patientMessages.length === 0) return "";
    return patientMessages.join("\n");
  }, [state.chatMessages]);

  const suggestedObjective = useMemo(() => {
    const { hr, bpSystolic, bpDiastolic, spo2, temp, respRate } = state.vitals;
    const vitalsLine = `Vitals: HR ${hr} bpm, BP ${bpSystolic}/${bpDiastolic} mmHg, SpO2 ${spo2}%, Temp ${temp}\u00B0C, RR ${respRate}/min`;

    const labNames = state.labsCompleted.map((lab) => lab.name);
    const labsLine =
      labNames.length > 0
        ? `Labs: ${labNames.join(", ")}`
        : "Labs: None completed";

    const actions = state.actionsTaken.map((a) => a.replace(/_/g, " "));
    const actionsLine =
      actions.length > 0
        ? `Actions performed: ${actions.join(", ")}`
        : "Actions performed: None";

    return [vitalsLine, labsLine, actionsLine].join("\n");
  }, [state.vitals, state.labsCompleted, state.actionsTaken]);

  const suggestedPlan = useMemo(() => {
    if (state.actionsTaken.length === 0) return "";
    return state.actionsTaken
      .map((action, idx) => `${idx + 1}. ${action.replace(/_/g, " ")}`)
      .join("\n");
  }, [state.actionsTaken]);

  const getSuggestion = useCallback(
    (key: string): string => {
      switch (key) {
        case "subjective":
          return suggestedSubjective;
        case "objective":
          return suggestedObjective;
        case "plan":
          return suggestedPlan;
        default:
          return "";
      }
    },
    [suggestedSubjective, suggestedObjective, suggestedPlan],
  );

  const handleAutoFill = useCallback(
    (key: string) => {
      const suggestion = getSuggestion(key);
      if (suggestion) {
        setters[key](suggestion);
      }
    },
    [getSuggestion, setters],
  );

  // --- Completeness score ---

  const completeness = useMemo(() => {
    let filled = 0;
    if (subjective.trim()) filled++;
    if (objective.trim()) filled++;
    if (assessment.trim()) filled++;
    if (plan.trim()) filled++;
    return filled;
  }, [subjective, objective, assessment, plan]);

  // --- Format SOAP note ---

  const formatSOAPNote = useCallback((): string => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return [
      `SOAP NOTE - ${scenario.name}`,
      `Date: ${dateStr}`,
      "",
      "S \u2014 Subjective:",
      subjective || "(not documented)",
      "",
      "O \u2014 Objective:",
      objective || "(not documented)",
      "",
      "A \u2014 Assessment:",
      assessment || "(not documented)",
      "",
      "P \u2014 Plan:",
      plan || "(not documented)",
    ].join("\n");
  }, [scenario.name, subjective, objective, assessment, plan]);

  // --- Copy to clipboard ---

  const handleCopy = useCallback(async () => {
    const text = formatSOAPNote();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [formatSOAPNote]);

  // --- Download as text ---

  const handleDownload = useCallback(() => {
    const text = formatSOAPNote();
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const safeName = scenario.name.replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `SOAP_Note_${safeName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [formatSOAPNote, scenario.name]);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-slate-300" />
          <h2 className="text-white font-semibold text-lg">SOAP Note</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-4 h-4" />
            Download as Text
          </button>
        </div>
      </div>

      {/* SOAP Sections */}
      <div className="p-5 space-y-5">
        {SECTIONS.map((section) => {
          const suggestion = getSuggestion(section.key);
          const hasSuggestion = section.hasAutoFill && suggestion.length > 0;

          return (
            <div key={section.key} className="space-y-2">
              {/* Section Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-bold ${section.badgeBg} ${section.badgeText}`}
                  >
                    {section.letter}
                  </span>
                  <span className="text-white font-medium text-sm flex items-center gap-1.5">
                    {section.icon}
                    {section.title}
                  </span>
                </div>
                {hasSuggestion && (
                  <button
                    onClick={() => handleAutoFill(section.key)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors border ${section.badgeText} ${section.badgeBg} border-transparent hover:border-current`}
                  >
                    Auto-fill
                  </button>
                )}
              </div>

              {/* Suggested chip */}
              {hasSuggestion && !textState[section.key] && (
                <button
                  onClick={() => handleAutoFill(section.key)}
                  className="text-xs text-slate-400 bg-slate-800/60 border border-slate-700 rounded-md px-2.5 py-1 hover:bg-slate-800 hover:text-slate-300 transition-colors"
                >
                  Suggested content available — click to auto-fill
                </button>
              )}

              {/* Textarea */}
              <textarea
                value={textState[section.key]}
                onChange={(e) => setters[section.key](e.target.value)}
                placeholder={section.placeholder}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2.5 resize-y min-h-[80px] placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              />
            </div>
          );
        })}

        {/* Completeness Score */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-medium">
              Documentation Completeness
            </span>
            <span className="text-white font-bold text-sm">
              {completeness}/4 sections
            </span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                completeness === 4
                  ? "bg-emerald-400"
                  : completeness >= 2
                    ? "bg-amber-400"
                    : "bg-red-400"
              }`}
              style={{ width: `${(completeness / 4) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
            {SECTIONS.map((section) => (
              <span
                key={section.key}
                className={`flex items-center gap-1 ${
                  textState[section.key].trim()
                    ? "text-emerald-400"
                    : "text-slate-500"
                }`}
              >
                {textState[section.key].trim() ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <span className="w-3 h-3 rounded-full border border-current inline-block" />
                )}
                {section.letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
