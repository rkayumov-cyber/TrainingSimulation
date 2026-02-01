import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Download,
  Image as ImageIcon,
  Filter,
} from "lucide-react";
import {
  getAllImages,
  deleteImage,
  svgToDataUrl,
  downloadSvg,
} from "../../services/imaging";
import type { GeneratedImage } from "../../services/imaging";
import { ImageGeneratorDialog } from "./ImageGeneratorDialog";

interface ImageLibraryPageProps {
  onBack: () => void;
}

export function ImageLibraryPage({ onBack }: ImageLibraryPageProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");

  const loadImages = () => {
    setLoading(true);
    getAllImages().then((imgs) => {
      setImages(imgs);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadImages();
  }, []);

  const categories = [...new Set(images.map((i) => i.category))];
  const filtered = filterCategory
    ? images.filter((i) => i.category === filterCategory)
    : images;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    await deleteImage(id);
    loadImages();
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-6 bg-slate-700" />
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            Image Library
          </h1>
          <span className="text-slate-500 text-sm">
            {images.length} images
          </span>
        </div>

        <div className="flex items-center gap-3">
          {categories.length > 1 && (
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={() => setShowGenerator(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Generate New
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="text-slate-400 text-sm text-center py-12">
            Loading images...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-slate-400 mb-2">
              No Images Yet
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              Generate clinical diagrams like ECGs, chest X-rays, pupil charts
              and more.
            </p>
            <button
              onClick={() => setShowGenerator(true)}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Generate First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((image) => (
              <div
                key={image.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              >
                {/* Preview */}
                <div className="bg-black p-2 flex items-center justify-center h-48 overflow-hidden">
                  <img
                    src={svgToDataUrl(image.svgContent)}
                    alt={image.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="text-white text-sm font-medium truncate">
                    {image.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-slate-500">
                      {image.category.toUpperCase()} &middot;{" "}
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          downloadSvg(image.svgContent, image.name)
                        }
                        className="p-1 text-slate-500 hover:text-emerald-400 transition-colors"
                        title="Download SVG"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGenerator && (
        <ImageGeneratorDialog
          onClose={() => setShowGenerator(false)}
          onSaved={() => {
            setShowGenerator(false);
            loadImages();
          }}
        />
      )}
    </div>
  );
}
