import { useState } from "react";
import { X, Plus } from "lucide-react";

interface MetadataStepProps {
  name: string;
  description: string;
  tags: string[];
  errors: Record<string, string>;
  onUpdateMetadata: (field: "name" | "description", value: string) => void;
  onUpdateTags: (tags: string[]) => void;
}

export function MetadataStep({
  name,
  description,
  tags,
  errors,
  onUpdateMetadata,
  onUpdateTags,
}: MetadataStepProps) {
  const [tagInput, setTagInput] = useState("");

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onUpdateTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    onUpdateTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Scenario Metadata
        </h2>
        <p className="text-sm text-slate-400">
          Define the basic information for your custom scenario.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Scenario Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onUpdateMetadata("name", e.target.value)}
          placeholder="e.g., Acute Pulmonary Embolism in 55-Year-Old Male"
          className={`w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            errors.name ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => onUpdateMetadata("description", e.target.value)}
          placeholder="Describe the clinical scenario, presenting complaint, and key features..."
          rows={4}
          className={`w-full bg-slate-800 border rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y ${
            errors.description ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-1">{errors.description}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-sm border border-slate-700"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-slate-500 hover:text-red-400 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button
            onClick={addTag}
            className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
