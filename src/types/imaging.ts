export interface ImagingStudy {
  id: string;
  name: string;
  type: "xray" | "ct" | "ultrasound" | "ecg" | "abg" | "other";
  status: "available" | "pending" | "completed";
  orderedAt?: number;
  completedAt?: number;
  findings?: ImagingFindings;
  delayMs: number;
}

export interface ImagingFindings {
  summary: string;
  details: string[];
  urgentFindings?: string[];
  normalFindings?: string[];
}

export interface ECGInterpretation {
  rhythm: string;
  rate: number;
  axis: string;
  prInterval: string;
  qrsDuration: string;
  qtcInterval: string;
  stSegment: string;
  tWaves: string;
  urgentFindings: string[];
  overallImpression: string;
}

export interface ABGValues {
  pH: number;
  pCO2: number;
  pO2: number;
  hco3: number;
  baseExcess: number;
  lactate: number;
  fio2?: number;
}

export interface ABGInterpretationStep {
  step: number;
  label: string;
  finding: string;
  isAbnormal: boolean;
}

export interface ABGInterpretation {
  values: ABGValues;
  steps: ABGInterpretationStep[];
  primaryDisorder: string;
  compensation: string;
  oxygenation: string;
  clinicalCorrelation: string;
}
