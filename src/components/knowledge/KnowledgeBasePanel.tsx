import { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen,
  Upload,
  Search,
  FileText,
  Trash2,
  Loader,
  AlertCircle,
  X,
  Database,
} from "lucide-react";

interface KnowledgeDocument {
  id: string;
  filename: string;
  title: string;
  uploadedAt: number;
  content: string;
  pageCount: number;
}

interface SearchResult {
  document: KnowledgeDocument;
  snippet: string;
  score: number;
}

// Simple in-memory storage (persisted to localStorage)
const STORAGE_KEY = "clinical-knowledge-base";

function loadDocuments(): KnowledgeDocument[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveDocuments(docs: KnowledgeDocument[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch {
    console.warn("Failed to save to localStorage");
  }
}

function simpleSearch(
  query: string,
  documents: KnowledgeDocument[],
): SearchResult[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  const results: SearchResult[] = [];

  for (const doc of documents) {
    const contentLower = doc.content.toLowerCase();
    let score = 0;

    // Count word matches
    for (const word of queryWords) {
      const regex = new RegExp(word, "gi");
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    }

    if (score > 0) {
      // Find a relevant snippet
      const idx = contentLower.indexOf(queryWords[0] || query);
      const start = Math.max(0, idx - 50);
      const end = Math.min(doc.content.length, idx + 200);
      const snippet = doc.content.slice(start, end);

      results.push({ document: doc, snippet, score });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

export function KnowledgeBasePanel() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"documents" | "search">(
    "documents",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocuments(loadDocuments());
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress("Reading file...");

    try {
      // Dynamic import of pdf.js only when needed
      const pdfjsLib = await import("pdfjs-dist");

      // Set worker from CDN
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs";

      setUploadProgress("Parsing PDF...");

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        setUploadProgress(`Extracting page ${i} of ${pdf.numPages}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => ("str" in item ? (item as { str: string }).str : ""))
          .join(" ");
        fullText += pageText + "\n\n";
      }

      const newDoc: KnowledgeDocument = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        title: file.name.replace(/\.pdf$/i, ""),
        uploadedAt: Date.now(),
        content: fullText,
        pageCount: pdf.numPages,
      };

      const updatedDocs = [...documents, newDoc];
      setDocuments(updatedDocs);
      saveDocuments(updatedDocs);

      setUploadProgress(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process PDF");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = (id: string) => {
    const updatedDocs = documents.filter((d) => d.id !== id);
    setDocuments(updatedDocs);
    saveDocuments(updatedDocs);
  };

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    // Use setTimeout to not block UI
    setTimeout(() => {
      const results = simpleSearch(searchQuery, documents);
      setSearchResults(results);
      setIsSearching(false);
    }, 100);
  }, [searchQuery, documents]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-2 border-b border-slate-700">
        <BookOpen className="w-5 h-5 text-blue-400" />
        <span className="text-white font-semibold">Knowledge Base</span>
        <span className="text-slate-400 text-sm">
          ({documents.length} docs)
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab("documents")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "documents"
              ? "text-blue-400 border-b-2 border-blue-400 bg-slate-700/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Documents
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "search"
              ? "text-blue-400 border-b-2 border-blue-400 bg-slate-700/50"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="m-4 p-3 bg-red-950/30 border border-red-800/50 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300 text-sm">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4 text-red-400 hover:text-red-300" />
          </button>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="p-4 space-y-4">
          {/* Upload Section */}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-3 px-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-white hover:border-blue-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{uploadProgress || "Processing..."}</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Document List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {documents.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-8">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No documents in knowledge base</p>
                <p className="text-xs mt-1">Upload PDFs to get started</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {doc.title}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{doc.pageCount} pages</span>
                        <span>{formatFileSize(doc.content.length)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Uploaded {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === "search" && (
        <div className="p-4 space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search medical research..."
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg text-white transition-colors"
            >
              {isSearching ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Search Results */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-8">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Search the knowledge base</p>
                <p className="text-xs mt-1">
                  Find relevant medical information
                </p>
              </div>
            ) : (
              searchResults.map((result, index) => (
                <div
                  key={`${result.document.id}-${index}`}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-400 text-xs font-medium">
                      {result.document.title}
                    </span>
                    <span className="text-emerald-400 text-xs">
                      {result.score} matches
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-3">
                    ...{result.snippet}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
