import {
  ArrowLeft,
  Save,
  Download,
  Upload,
} from "lucide-react";

interface ScenarioBuilderHeaderProps {
  title: string;
  onBack: () => void;
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  isSaving: boolean;
  isEditing: boolean;
}

export function ScenarioBuilderHeader({
  title,
  onBack,
  onSave,
  onExport,
  onImport,
  isSaving,
  isEditing,
}: ScenarioBuilderHeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <span className="text-slate-600">|</span>
          <h1 className="text-xl font-bold text-white">
            {isEditing ? "Edit Scenario" : "Scenario Builder"}
          </h1>
          {title && (
            <span className="text-slate-400 text-sm truncate max-w-[300px]">
              — {title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-emerald-400 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Scenario"}
          </button>
        </div>
      </div>
    </header>
  );
}
