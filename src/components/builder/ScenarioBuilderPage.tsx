import { useEffect, useState } from "react";
import { ScenarioBuilderHeader } from "./ScenarioBuilderHeader";
import { ScenarioBuilderStepper } from "./ScenarioBuilderStepper";
import { MetadataStep } from "./steps/MetadataStep";
import { PatientStep } from "./steps/PatientStep";
import { VitalsStep } from "./steps/VitalsStep";
import { DeteriorationStep } from "./steps/DeteriorationStep";
import { ActionsLabsStep } from "./steps/ActionsLabsStep";
import { AttachmentsStep } from "./steps/AttachmentsStep";
import { BenchmarkStep } from "./steps/BenchmarkStep";
import { ScenarioPreviewPanel } from "./preview/ScenarioPreviewPanel";
import { useScenarioBuilder } from "../../hooks/useScenarioBuilder";
import { ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react";

interface ScenarioBuilderPageProps {
  editScenarioId?: string | null;
  templateId?: string | null;
  onBack: () => void;
  onSaved: () => void;
}

export function ScenarioBuilderPage({
  editScenarioId,
  templateId,
  onBack,
  onSaved,
}: ScenarioBuilderPageProps) {
  const builder = useScenarioBuilder(editScenarioId || null, onSaved, onBack, templateId);
  const [showPreview, setShowPreview] = useState(false);

  // Load scenario if editing
  useEffect(() => {
    if (editScenarioId) {
      builder.loadScenario();
    }
  }, [editScenarioId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Apply template if provided
  useEffect(() => {
    if (templateId && !editScenarioId) {
      builder.applyTemplate(templateId);
    }
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderStep = () => {
    switch (builder.currentStep) {
      case "metadata":
        return (
          <MetadataStep
            name={builder.form.name}
            description={builder.form.description}
            tags={builder.form.tags}
            errors={builder.errors}
            onUpdateMetadata={builder.updateMetadata}
            onUpdateTags={builder.updateTags}
          />
        );
      case "patient":
        return (
          <PatientStep
            patientName={builder.form.patientName}
            patientPersona={builder.form.patientPersona}
            errors={builder.errors}
            onUpdate={builder.updatePatient}
          />
        );
      case "vitals":
        return (
          <VitalsStep
            vitals={builder.form.baselineVitals}
            onUpdateVital={builder.updateVital}
          />
        );
      case "deterioration":
        return (
          <DeteriorationStep
            rules={builder.form.deteriorationRules}
            onAdd={builder.addDeteriorationRule}
            onUpdate={builder.updateDeteriorationRule}
            onRemove={builder.removeDeteriorationRule}
          />
        );
      case "actions":
        return (
          <ActionsLabsStep
            correctActions={builder.form.correctActions}
            labResults={builder.form.labResults}
            onUpdateActions={builder.updateCorrectActions}
            onUpdateLab={builder.updateLabResult}
            onRemoveLab={builder.removeLabResult}
          />
        );
      case "attachments":
        return (
          <AttachmentsStep
            attachments={builder.form.attachments}
            onAdd={builder.addAttachment}
            onRemove={builder.removeAttachment}
          />
        );
      case "benchmark":
        return (
          <BenchmarkStep
            benchmark={builder.form.benchmark}
            correctActions={builder.form.correctActions}
            onUpdate={builder.updateBenchmark}
          />
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-white">
      <ScenarioBuilderHeader
        title={builder.form.name}
        onBack={onBack}
        onSave={builder.save}
        onExport={builder.exportJSON}
        onImport={builder.importJSON}
        isSaving={builder.isSaving}
        isEditing={builder.isEditing}
      />

      <ScenarioBuilderStepper
        currentStep={builder.currentStep}
        completedSteps={builder.completedSteps}
        onStepClick={builder.goToStep}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Form content */}
        <div
          className={`flex-1 overflow-y-auto p-6 ${showPreview ? "w-1/2" : "w-full"}`}
        >
          <div className="max-w-2xl mx-auto">
            {renderStep()}

            {/* Step Navigation */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-800">
              <button
                onClick={builder.prevStep}
                disabled={builder.isFirstStep}
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </button>

              {builder.isLastStep ? (
                <button
                  onClick={builder.save}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  Save Scenario
                </button>
              ) : (
                <button
                  onClick={builder.nextStep}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="w-1/2 border-l border-slate-700 overflow-hidden">
            <ScenarioPreviewPanel form={builder.form} />
          </div>
        )}
      </div>
    </div>
  );
}
