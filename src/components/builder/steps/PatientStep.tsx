interface PatientStepProps {
  patientName: string;
  patientPersona: string;
  errors: Record<string, string>;
  onUpdate: (field: "patientName" | "patientPersona", value: string) => void;
}

export function PatientStep({
  patientName,
  patientPersona,
  errors,
  onUpdate,
}: PatientStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Patient Profile
        </h2>
        <p className="text-sm text-slate-400">
          Define the simulated patient's identity and behavior.
        </p>
      </div>

      {/* Patient Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Patient Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={patientName}
          onChange={(e) => onUpdate("patientName", e.target.value)}
          placeholder="e.g., Mr. Thompson"
          className={`w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            errors.patientName ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.patientName && (
          <p className="text-red-400 text-xs mt-1">{errors.patientName}</p>
        )}
      </div>

      {/* Patient Persona */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Patient Persona <span className="text-red-400">*</span>
        </label>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 mb-2 text-xs text-slate-400">
          <p className="font-medium text-slate-300 mb-1">Guidance:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>
              Write in second person ("You are a 55-year-old male...")
            </li>
            <li>
              Describe symptoms, emotional state, and communication style
            </li>
            <li>
              Include how the patient responds to questions and examinations
            </li>
            <li>
              Mention pain levels, confusion, or anxiety as appropriate
            </li>
          </ul>
        </div>
        <textarea
          value={patientPersona}
          onChange={(e) => onUpdate("patientPersona", e.target.value)}
          placeholder="You are a 55-year-old male who presents with sudden-onset shortness of breath and chest pain. You are anxious and speak in short sentences due to breathlessness..."
          rows={8}
          className={`w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y ${
            errors.patientPersona ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.patientPersona && (
          <p className="text-red-400 text-xs mt-1">{errors.patientPersona}</p>
        )}
        <p className="text-xs text-slate-500 mt-1">
          {patientPersona.length} characters
        </p>
      </div>
    </div>
  );
}
