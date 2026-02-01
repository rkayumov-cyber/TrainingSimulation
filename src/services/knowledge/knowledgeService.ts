import { v4 as uuidv4 } from "uuid";
import type {
  KnowledgeDocument,
  DocumentChunk,
  SearchResult,
  KnowledgeBaseStats,
  ProcessingProgress,
  KnowledgeConfig,
} from "../../types/knowledge";
import { processPDF } from "./pdfProcessor";
import { embedChunks, getEmbedder, resetEmbedder } from "./embeddings";
import {
  addDocument,
  addChunks,
  getAllDocuments,
  getDocument,
  deleteDocument as deleteDocFromStore,
  search as vectorSearch,
  getStats,
  clearKnowledgeBase,
  loadVocabulary,
  saveVocabulary,
  rebuildVocabulary,
  getAllChunks,
} from "./vectorStore";

export class KnowledgeService {
  private config: KnowledgeConfig;
  private initialized: boolean = false;

  constructor(config?: Partial<KnowledgeConfig>) {
    this.config = {
      chunkSize: config?.chunkSize ?? 500,
      chunkOverlap: config?.chunkOverlap ?? 50,
      embeddingModel: config?.embeddingModel ?? "tfidf",
      maxResults: config?.maxResults ?? 5,
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Try to load existing vocabulary
    const loaded = await loadVocabulary();
    if (!loaded) {
      // If no vocabulary, rebuild from existing chunks
      const chunks = await getAllChunks();
      if (chunks.length > 0) {
        const embedder = getEmbedder();
        embedder.buildVocabulary(chunks.map((c) => c.content));
        await saveVocabulary();
      }
    }

    this.initialized = true;
  }

  async uploadPDF(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void,
  ): Promise<KnowledgeDocument> {
    await this.initialize();

    const documentId = uuidv4();

    // Process PDF
    const { chunks: textChunks, pageCount } = await processPDF(
      file,
      this.config,
      onProgress,
    );

    // Generate embeddings
    const embeddings = await embedChunks(textChunks, onProgress);

    // Create document chunks with embeddings
    const documentChunks: DocumentChunk[] = textChunks.map((chunk, index) => ({
      id: `${documentId}-${chunk.chunkIndex}`,
      documentId,
      content: chunk.content,
      pageNumber: chunk.pageNumber,
      chunkIndex: chunk.chunkIndex,
      embedding: embeddings[index],
    }));

    // Create document record
    const document: KnowledgeDocument = {
      id: documentId,
      filename: file.name,
      title: file.name.replace(/\.pdf$/i, ""),
      uploadedAt: Date.now(),
      fileSize: file.size,
      pageCount,
      chunkCount: documentChunks.length,
    };

    // Store in IndexedDB
    onProgress?.({
      stage: "storing",
      progress: 0,
      message: "Saving to knowledge base...",
    });

    await addDocument(document);
    await addChunks(documentChunks);

    // Rebuild vocabulary with new documents
    await rebuildVocabulary();

    onProgress?.({
      stage: "complete",
      progress: 100,
      message: "Document added successfully!",
    });

    return document;
  }

  async search(query: string, maxResults?: number): Promise<SearchResult[]> {
    await this.initialize();
    return vectorSearch(query, maxResults ?? this.config.maxResults);
  }

  async getDocuments(): Promise<KnowledgeDocument[]> {
    return getAllDocuments();
  }

  async getDocument(id: string): Promise<KnowledgeDocument | undefined> {
    return getDocument(id);
  }

  async deleteDocument(id: string): Promise<void> {
    await deleteDocFromStore(id);
    // Rebuild vocabulary after deletion
    await rebuildVocabulary();
  }

  async getStats(): Promise<KnowledgeBaseStats> {
    return getStats();
  }

  async clearAll(): Promise<void> {
    await clearKnowledgeBase();
    resetEmbedder();
  }

  // Search with context for clinical decision support
  async searchWithContext(
    query: string,
    context?: { scenario?: string; action?: string },
  ): Promise<{ results: SearchResult[]; summary: string }> {
    const enhancedQuery = context
      ? `${query} ${context.scenario || ""} ${context.action || ""}`.trim()
      : query;

    const results = await this.search(enhancedQuery);

    // Generate a simple summary from top results
    const summary =
      results.length > 0
        ? results
            .slice(0, 3)
            .map((r) => r.chunk.content.slice(0, 200))
            .join(" ... ")
        : "No relevant information found in the knowledge base.";

    return { results, summary };
  }
}

// Singleton instance
let knowledgeService: KnowledgeService | null = null;

export function getKnowledgeService(): KnowledgeService {
  if (!knowledgeService) {
    knowledgeService = new KnowledgeService();
  }
  return knowledgeService;
}

export function resetKnowledgeService(): void {
  knowledgeService = new KnowledgeService();
}
