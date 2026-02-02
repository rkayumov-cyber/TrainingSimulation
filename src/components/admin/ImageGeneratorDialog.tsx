import { useState } from "react";
import { X, Download, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  generateECG,
  generateChestXray,
  generatePupilChart,
  generateABGChart,
  generateGCSScale,
  generateBurnChart,
  saveGeneratedImage,
  downloadSvg,
} from "../../services/imaging";
import type { ECGPattern, ChestXrayFinding } from "../../services/imaging";

type ImageType = "ecg" | "xray" | "pupil" | "abg" | "gcs" | "burn";

interface ImageGeneratorDialogProps {
  onClose: () => void;
  onSaved: () => void;
}

export function ImageGeneratorDialog({
  onClose,
  onSaved,
}: ImageGeneratorDialogProps) {
  const [imageType, setImageType] = useState<ImageType>("ecg");
  const [name, setName] = useState("");
  const [svgPreview, setSvgPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ECG params
  const [ecgPattern, setEcgPattern] = useState<ECGPattern>("normal");
  const [ecgHr, setEcgHr] = useState(75);

  // X-ray params
  const [xrayFinding, setXrayFinding] =
    useState<ChestXrayFinding>("normal");

  // Pupil params
  const [pupilLeftSize, setPupilLeftSize] = useState(3);
  const [pupilLeftReactive, setPupilLeftReactive] = useState(true);
  const [pupilRightSize, setPupilRightSize] = useState(3);
  const [pupilRightReactive, setPupilRightReactive] = useState(true);

  // ABG params
  const [abgPh, setAbgPh] = useState(7.4);
  const [abgPco2, setAbgPco2] = useState(40);
  const [abgHco3, setAbgHco3] = useState(24);

  // GCS params
  const [gcsEye, setGcsEye] = useState(4);
  const [gcsVerbal, setGcsVerbal] = useState(5);
  const [gcsMotor, setGcsMotor] = useState(6);

  // Burn params
  const [burnAreas, setBurnAreas] = useState<
    { region: string; percent: number }[]
  >([]);

  const handleGenerate = () => {
    let svg: string;
    let autoName: string;

    switch (imageType) {
      case "ecg":
        svg = generateECG(ecgPattern, { hr: ecgHr });
        autoName = `ECG - ${ecgPattern.toUpperCase()} ${ecgHr}bpm`;
        break;
      case "xray":
        svg = generateChestXray(xrayFinding);
        autoName = `CXR - ${xrayFinding.replace(/_/g, " ")}`;
        break;
      case "pupil":
        svg = generatePupilChart(
          { size: pupilLeftSize, reactive: pupilLeftReactive },
          { size: pupilRightSize, reactive: pupilRightReactive },
        );
        autoName = `Pupils L:${pupilLeftSize}mm R:${pupilRightSize}mm`;
        break;
      case "abg":
        svg = generateABGChart(abgPh, abgPco2, abgHco3);
        autoName = `ABG pH:${abgPh} pCO2:${abgPco2} HCO3:${abgHco3}`;
        break;
      case "gcs":
        svg = generateGCSScale(gcsEye, gcsVerbal, gcsMotor);
        autoName = `GCS E${gcsEye}V${gcsVerbal}M${gcsMotor} = ${gcsEye + gcsVerbal + gcsMotor}`;
        break;
      case "burn":
        svg = generateBurnChart(
          burnAreas.length > 0
            ? burnAreas
            : [{ region: "chest", percent: 18 }],
        );
        autoName = `Burns ${burnAreas.reduce((s, a) => s + a.percent, 0)}% TBSA`;
        break;
    }

    setSvgPreview(svg);
    if (!name) setName(autoName);
  };

  const handleSave = async () => {
    if (!svgPreview) return;
    setSaving(true);

    await saveGeneratedImage({
      id: uuidv4(),
      name: name || "Unnamed Image",
      category: imageType,
      svgContent: svgPreview,
      params: { imageType, ecgPattern, ecgHr, xrayFinding },
      createdAt: Date.now(),
    });

    setSaving(false);
    onSaved();
  };

  const handleDownload = () => {
    if (!svgPreview) return;
    downloadSvg(svgPreview, name || "clinical-image");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
          <h2 className="text-white font-semibold">Generate Clinical Image</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Step 1: Select Type */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              Image Type
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["ecg", "ECG"],
                  ["xray", "Chest X-ray"],
                  ["pupil", "Pupil Chart"],
                  ["abg", "ABG Analysis"],
                  ["gcs", "GCS Scale"],
                  ["burn", "Burn Chart"],
                ] as [ImageType, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setImageType(key);
                    setSvgPreview(null);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                    imageType === key
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Configure */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3">
            {imageType === "ecg" && (
              <>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Pattern
                  </label>
                  <select
                    value={ecgPattern}
                    onChange={(e) =>
                      setEcgPattern(e.target.value as ECGPattern)
                    }
                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white"
                  >
                    <option value="normal">Normal Sinus Rhythm</option>
                    <option value="stemi">STEMI</option>
                    <option value="afib">Atrial Fibrillation</option>
                    <option value="vfib">Ventricular Fibrillation</option>
                    <option value="vtach">Ventricular Tachycardia</option>
                    <option value="asystole">Asystole</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Heart Rate: {ecgHr} BPM
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="200"
                    value={ecgHr}
                    onChange={(e) => setEcgHr(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {imageType === "xray" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Finding
                </label>
                <select
                  value={xrayFinding}
                  onChange={(e) =>
                    setXrayFinding(e.target.value as ChestXrayFinding)
                  }
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-sm text-white"
                >
                  <option value="normal">Normal</option>
                  <option value="pneumothorax">Pneumothorax</option>
                  <option value="pleural_effusion">Pleural Effusion</option>
                  <option value="cardiomegaly">Cardiomegaly</option>
                </select>
              </div>
            )}

            {imageType === "pupil" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Left Pupil: {pupilLeftSize}mm
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="9"
                    value={pupilLeftSize}
                    onChange={(e) => setPupilLeftSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <label className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={pupilLeftReactive}
                      onChange={(e) =>
                        setPupilLeftReactive(e.target.checked)
                      }
                    />
                    Reactive
                  </label>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Right Pupil: {pupilRightSize}mm
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="9"
                    value={pupilRightSize}
                    onChange={(e) => setPupilRightSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <label className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={pupilRightReactive}
                      onChange={(e) =>
                        setPupilRightReactive(e.target.checked)
                      }
                    />
                    Reactive
                  </label>
                </div>
              </div>
            )}

            {imageType === "abg" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    pH: {abgPh}
                  </label>
                  <input
                    type="range"
                    min="6.8"
                    max="7.8"
                    step="0.01"
                    value={abgPh}
                    onChange={(e) => setAbgPh(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    pCO2: {abgPco2}
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    value={abgPco2}
                    onChange={(e) => setAbgPco2(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    HCO3: {abgHco3}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={abgHco3}
                    onChange={(e) => setAbgHco3(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {imageType === "gcs" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Eye (E): {gcsEye}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    value={gcsEye}
                    onChange={(e) => setGcsEye(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Verbal (V): {gcsVerbal}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={gcsVerbal}
                    onChange={(e) => setGcsVerbal(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Motor (M): {gcsMotor}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={gcsMotor}
                    onChange={(e) => setGcsMotor(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {imageType === "burn" && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400">
                  Add affected body regions:
                </p>
                {[
                  "head",
                  "chest",
                  "abdomen",
                  "left_arm",
                  "right_arm",
                  "left_leg",
                  "right_leg",
                  "perineum",
                ].map((region) => {
                  const existing = burnAreas.find(
                    (a) => a.region === region,
                  );
                  return (
                    <div key={region} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!existing}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBurnAreas((prev) => [
                              ...prev,
                              { region, percent: 9 },
                            ]);
                          } else {
                            setBurnAreas((prev) =>
                              prev.filter((a) => a.region !== region),
                            );
                          }
                        }}
                      />
                      <span className="text-xs text-slate-300 w-24">
                        {region.replace(/_/g, " ")}
                      </span>
                      {existing && (
                        <input
                          type="range"
                          min="1"
                          max="18"
                          value={existing.percent}
                          onChange={(e) =>
                            setBurnAreas((prev) =>
                              prev.map((a) =>
                                a.region === region
                                  ? { ...a, percent: Number(e.target.value) }
                                  : a,
                              ),
                            )
                          }
                          className="flex-1"
                        />
                      )}
                      {existing && (
                        <span className="text-xs text-slate-400 w-8">
                          {existing.percent}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Generate Preview
            </button>
          </div>

          {/* Step 3: Preview */}
          {svgPreview && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300">Preview</h3>
              <div
                className="bg-black rounded-lg overflow-hidden flex items-center justify-center p-2"
                dangerouslySetInnerHTML={{ __html: svgPreview }}
              />

              {/* Name */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Image Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save to Library"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  SVG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
