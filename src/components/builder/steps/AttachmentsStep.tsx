import { useState, useRef } from "react";
import { Upload, File, Image, Trash2, FileText } from "lucide-react";
import type { ScenarioAttachment } from "../../../types/scenarioBuilder";

interface AttachmentsStepProps {
  attachments: ScenarioAttachment[];
  onAdd: (file: File, description: string, extractedText?: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.gif,.webp";
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentsStep({
  attachments,
  onAdd,
  onRemove,
}: AttachmentsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (file.size > MAX_SIZE) {
      setError("File exceeds 50MB size limit");
      return;
    }

    setIsUploading(true);

    let extractedText: string | undefined;

    // Try to extract text from PDFs
    if (file.type === "application/pdf") {
      try {
        const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
        GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.mjs",
          import.meta.url,
        ).toString();

        const buffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: buffer }).promise;
        const pages: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          pages.push(
            content.items
              .map((item: unknown) => {
                const obj = item as Record<string, unknown>;
                return typeof obj.str === "string" ? obj.str : "";
              })
              .join(" "),
          );
        }

        extractedText = pages.join("\n\n");
      } catch {
        // PDF text extraction failed - continue without it
      }
    }

    await onAdd(file, description || file.name, extractedText);
    setDescription("");
    setIsUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getPreviewUrl = (attachment: ScenarioAttachment): string | null => {
    if (attachment.mimeType.startsWith("image/")) {
      const blob = new Blob([attachment.data], { type: attachment.mimeType });
      return URL.createObjectURL(blob);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Clinical Attachments
        </h2>
        <p className="text-sm text-slate-400">
          Upload clinical reference files (PDFs, images) that are relevant to
          this scenario. PDF text will be extracted automatically.
        </p>
      </div>

      {/* Upload area */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., ECG showing ST-elevation"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center justify-center gap-3 w-full py-8 bg-slate-800/50 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm">
            {isUploading ? "Uploading..." : "Click to upload a file"}
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileSelect}
          className="hidden"
        />

        <p className="text-xs text-slate-500">
          Accepted: PDF, JPG, PNG, GIF, WebP. Max 50MB per file.
        </p>

        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>

      {/* Attachments list */}
      {attachments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300">
            Uploaded Files ({attachments.length})
          </h3>
          {attachments.map((att) => {
            const isImage = att.mimeType.startsWith("image/");
            const isPDF = att.mimeType === "application/pdf";
            const previewUrl = isImage ? getPreviewUrl(att) : null;

            return (
              <div
                key={att.id}
                className="flex items-start gap-3 bg-slate-800 border border-slate-700 rounded-lg p-3"
              >
                {/* Thumbnail or icon */}
                <div className="w-12 h-12 rounded bg-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={att.filename}
                      className="w-full h-full object-cover"
                    />
                  ) : isPDF ? (
                    <FileText className="w-6 h-6 text-red-400" />
                  ) : isImage ? (
                    <Image className="w-6 h-6 text-blue-400" />
                  ) : (
                    <File className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {att.filename}
                  </p>
                  <p className="text-slate-400 text-xs">
                    {formatFileSize(att.size)}
                    {att.extractedText &&
                      ` \u00b7 ${att.extractedText.length} chars extracted`}
                  </p>
                  {att.description && att.description !== att.filename && (
                    <p className="text-slate-500 text-xs mt-0.5 truncate">
                      {att.description}
                    </p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => onRemove(att.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
