import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  ScenarioBuilderFormState,
  BuilderStep,
  CustomScenarioDefinition,
  BenchmarkDefinition,
  ScenarioAttachment,
  DeteriorationRuleForm,
} from "../types/scenarioBuilder";
import { BUILDER_STEPS } from "../types/scenarioBuilder";
import {
  saveCustomScenario,
  getCustomScenario,
  getAllCustomScenarios,
  getAttachmentsByScenario,
  saveAttachment,
  deleteAttachment as deleteAttachmentFromDB,
  saveBenchmark,
  getBenchmarkByScenario,
  exportScenario,
  importScenario,
} from "../services/persistence";
import type { ExportedScenario } from "../services/persistence";
import { registerCustomScenarios } from "../scenarios";
import { getTemplateById } from "../data/scenarioTemplates";

function createEmptyFormState(): ScenarioBuilderFormState {
  return {
    name: "",
    description: "",
    tags: [],
    patientName: "",
    patientPersona: "",
    baselineVitals: {
      hr: 80,
      bpSystolic: 120,
      bpDiastolic: 80,
      spo2: 98,
      temp: 37.0,
      respRate: 16,
    },
    deteriorationRules: [],
    correctActions: [],
    labResults: {},
    attachments: [],
    benchmark: {
      scenarioId: "",
      expectedActions: [],
      expectedSequences: [],
      timingThresholds: [],
      passingScore: 70,
    },
  };
}

function createEmptyBenchmark(scenarioId: string): BenchmarkDefinition {
  return {
    scenarioId,
    expectedActions: [],
    expectedSequences: [],
    timingThresholds: [],
    passingScore: 70,
  };
}

export function useScenarioBuilder(
  editScenarioId: string | null,
  onSaved: () => void,
  _onBack: () => void,
  templateId?: string | null,
) {
  const [form, setForm] = useState<ScenarioBuilderFormState>(createEmptyFormState());
  const [currentStep, setCurrentStep] = useState<BuilderStep>("metadata");
  const [completedSteps, setCompletedSteps] = useState<Set<BuilderStep>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scenarioId] = useState(() => editScenarioId || `custom-${uuidv4().slice(0, 8)}`);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing scenario for editing
  const loadScenario = useCallback(async () => {
    if (!editScenarioId || isLoaded) return;
    const scenario = await getCustomScenario(editScenarioId);
    if (!scenario) return;

    const attachments = await getAttachmentsByScenario(editScenarioId);
    const benchmark = await getBenchmarkByScenario(editScenarioId);

    setForm({
      name: scenario.name,
      description: scenario.description,
      tags: scenario.tags,
      patientName: scenario.patientName,
      patientPersona: scenario.patientPersona,
      baselineVitals: { ...scenario.baselineVitals },
      deteriorationRules: scenario.deteriorationRules.map((r) => ({
        id: r.id,
        condition: r.condition,
        timerMinutes: r.timerMinutes,
        effect: { ...r.effect },
        preventedBy: [...r.preventedBy],
      })),
      correctActions: [...scenario.correctActions],
      labResults: { ...scenario.labResults },
      attachments,
      benchmark: benchmark || createEmptyBenchmark(editScenarioId),
    });

    // Mark all steps as completed when editing
    setCompletedSteps(new Set(BUILDER_STEPS.map((s) => s.key)));
    setIsLoaded(true);
  }, [editScenarioId, isLoaded]);

  // Apply template
  const applyTemplate = useCallback(
    (tplId: string) => {
      const template = getTemplateById(tplId);
      if (!template) return;

      setForm({
        name: template.name,
        description: template.description,
        tags: [...template.tags],
        patientName: "",
        patientPersona: template.patientPersonaTemplate,
        baselineVitals: { ...template.baselineVitals },
        deteriorationRules: template.deteriorationRules.map((r) => ({
          id: r.id,
          condition: r.condition,
          timerMinutes: r.timerMinutes,
          effect: { ...r.effect },
          preventedBy: [...r.preventedBy],
        })),
        correctActions: [...template.correctActions],
        labResults: { ...template.labResults },
        attachments: [],
        benchmark: {
          scenarioId,
          expectedActions: template.suggestedBenchmark.expectedActions,
          expectedSequences: template.suggestedBenchmark.expectedSequences,
          timingThresholds: template.suggestedBenchmark.timingThresholds,
          passingScore: template.suggestedBenchmark.passingScore,
        },
      });

      // Mark steps as partially complete
      setCompletedSteps(
        new Set<BuilderStep>([
          "metadata",
          "vitals",
          "deterioration",
          "actions",
          "benchmark",
        ]),
      );
    },
    [scenarioId],
  );

  // Step navigation
  const stepIndex = BUILDER_STEPS.findIndex((s) => s.key === currentStep);

  const goToStep = useCallback((step: BuilderStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    const nextIdx = stepIndex + 1;
    if (nextIdx < BUILDER_STEPS.length) {
      setCurrentStep(BUILDER_STEPS[nextIdx].key);
    }
  }, [currentStep, stepIndex]);

  const prevStep = useCallback(() => {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) {
      setCurrentStep(BUILDER_STEPS[prevIdx].key);
    }
  }, [stepIndex]);

  // Field updaters
  const updateMetadata = useCallback(
    (field: "name" | "description", value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const updateTags = useCallback((tags: string[]) => {
    setForm((prev) => ({ ...prev, tags }));
  }, []);

  const updatePatient = useCallback(
    (field: "patientName" | "patientPersona", value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const updateVital = useCallback(
    (key: keyof ScenarioBuilderFormState["baselineVitals"], value: number) => {
      setForm((prev) => ({
        ...prev,
        baselineVitals: { ...prev.baselineVitals, [key]: value },
      }));
    },
    [],
  );

  const addDeteriorationRule = useCallback(() => {
    const rule: DeteriorationRuleForm = {
      id: `rule-${uuidv4().slice(0, 6)}`,
      condition: "",
      timerMinutes: 5,
      effect: {},
      preventedBy: [],
    };
    setForm((prev) => ({
      ...prev,
      deteriorationRules: [...prev.deteriorationRules, rule],
    }));
  }, []);

  const updateDeteriorationRule = useCallback(
    (id: string, updates: Partial<DeteriorationRuleForm>) => {
      setForm((prev) => ({
        ...prev,
        deteriorationRules: prev.deteriorationRules.map((r) =>
          r.id === id ? { ...r, ...updates } : r,
        ),
      }));
    },
    [],
  );

  const removeDeteriorationRule = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      deteriorationRules: prev.deteriorationRules.filter((r) => r.id !== id),
    }));
  }, []);

  const updateCorrectActions = useCallback((actions: string[]) => {
    setForm((prev) => ({ ...prev, correctActions: actions }));
  }, []);

  const updateLabResult = useCallback((key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      labResults: { ...prev.labResults, [key]: value },
    }));
  }, []);

  const removeLabResult = useCallback((key: string) => {
    setForm((prev) => {
      const next = { ...prev.labResults };
      delete next[key];
      return { ...prev, labResults: next };
    });
  }, []);

  // Attachment operations
  const addAttachment = useCallback(
    async (file: File, description: string, extractedText?: string) => {
      const buffer = await file.arrayBuffer();
      const attachment: ScenarioAttachment = {
        id: uuidv4(),
        scenarioId,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        data: buffer,
        description,
        extractedText,
      };

      await saveAttachment(attachment);
      setForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, attachment],
      }));
    },
    [scenarioId],
  );

  const removeAttachment = useCallback(async (id: string) => {
    await deleteAttachmentFromDB(id);
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  }, []);

  // Benchmark updaters
  const updateBenchmark = useCallback(
    (updates: Partial<BenchmarkDefinition>) => {
      setForm((prev) => ({
        ...prev,
        benchmark: { ...prev.benchmark, ...updates },
      }));
    },
    [],
  );

  // Validation
  const validateStep = useCallback(
    (step: BuilderStep): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case "metadata":
          if (!form.name.trim()) newErrors.name = "Scenario name is required";
          if (!form.description.trim())
            newErrors.description = "Description is required";
          break;
        case "patient":
          if (!form.patientName.trim())
            newErrors.patientName = "Patient name is required";
          if (!form.patientPersona.trim())
            newErrors.patientPersona = "Patient persona is required";
          break;
        case "vitals":
          // Vitals always have defaults, so they're valid
          break;
        case "deterioration":
          // Optional - deterioration rules are not required
          break;
        case "actions":
          // Optional but recommended
          break;
        case "attachments":
          // Optional
          break;
        case "benchmark":
          // Optional
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [form],
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Scenario name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.patientName.trim()) newErrors.patientName = "Patient name is required";
    if (!form.patientPersona.trim())
      newErrors.patientPersona = "Patient persona is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Save
  const save = useCallback(async () => {
    if (!validateAll()) {
      // Navigate to first step with errors
      if (errors.name || errors.description) setCurrentStep("metadata");
      else if (errors.patientName || errors.patientPersona) setCurrentStep("patient");
      return;
    }

    setIsSaving(true);

    const now = Date.now();
    const scenario: CustomScenarioDefinition = {
      id: scenarioId,
      isCustom: true,
      createdAt: editScenarioId ? (await getCustomScenario(editScenarioId))?.createdAt || now : now,
      updatedAt: now,
      name: form.name.trim(),
      description: form.description.trim(),
      tags: form.tags,
      patientName: form.patientName.trim(),
      patientPersona: form.patientPersona.trim(),
      baselineVitals: { ...form.baselineVitals },
      deteriorationRules: form.deteriorationRules.map((r) => ({
        id: r.id,
        condition: r.condition,
        timerMinutes: r.timerMinutes,
        effect: { ...r.effect },
        preventedBy: [...r.preventedBy],
      })),
      correctActions: [...form.correctActions],
      labResults: { ...form.labResults },
      attachmentIds: form.attachments.map((a) => a.id),
      benchmark: form.benchmark.expectedActions.length > 0 ? form.benchmark : undefined,
    };

    await saveCustomScenario(scenario);

    // Save benchmark if it has content
    if (form.benchmark.expectedActions.length > 0) {
      await saveBenchmark({ ...form.benchmark, scenarioId });
    }

    // Re-register custom scenarios

    const customs = await getAllCustomScenarios();
    registerCustomScenarios(customs);

    setIsSaving(false);
    onSaved();
  }, [form, scenarioId, editScenarioId, validateAll, errors, onSaved]);

  // Export
  const exportJSON = useCallback(async () => {
    // Save first to make sure everything is persisted
    if (editScenarioId) {
      const data = await exportScenario(editScenarioId);
      if (!data) return;

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scenario-${form.name.replace(/\s+/g, "-").toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [editScenarioId, form.name]);

  // Import
  const importJSON = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      const data = JSON.parse(text) as ExportedScenario;

      // Generate a new ID to avoid conflicts
      const newId = `custom-${uuidv4().slice(0, 8)}`;
      data.scenario.id = newId;
      data.scenario.createdAt = Date.now();
      data.scenario.updatedAt = Date.now();

      for (const att of data.attachments) {
        att.scenarioId = newId;
        att.id = uuidv4();
      }
      if (data.benchmark) {
        data.benchmark.scenarioId = newId;
      }

      await importScenario(data);

      // Re-register custom scenarios
  
      const customs = await getAllCustomScenarios();
      registerCustomScenarios(customs);

      onSaved();
    };
    input.click();
  }, [onSaved]);

  return {
    form,
    currentStep,
    completedSteps,
    isSaving,
    errors,
    scenarioId,
    isEditing: !!editScenarioId,

    // Navigation
    goToStep,
    nextStep,
    prevStep,
    stepIndex,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === BUILDER_STEPS.length - 1,

    // Updaters
    updateMetadata,
    updateTags,
    updatePatient,
    updateVital,
    addDeteriorationRule,
    updateDeteriorationRule,
    removeDeteriorationRule,
    updateCorrectActions,
    updateLabResult,
    removeLabResult,
    addAttachment,
    removeAttachment,
    updateBenchmark,

    // Validation
    validateStep,
    validateAll,

    // Actions
    save,
    exportJSON,
    importJSON,
    loadScenario,
    applyTemplate,
    templateApplied: !!templateId,
  };
}
