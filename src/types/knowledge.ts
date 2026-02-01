export interface KnowledgeDocument {
  id: string;
  filename: string;
  title: string;
  uploadedAt: number;
  fileSize: number;
  pageCount: number;
  chunkCount: number;
  metadata?: Record<string, string>;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  pageNumber: number;
  chunkIndex: number;
  embedding: number[];
}

export interface SearchResult {
  chunk: DocumentChunk;
  document: KnowledgeDocument;
  score: number;
}

export interface KnowledgeBaseStats {
  documentCount: number;
  totalChunks: number;
  totalSize: number;
}

export interface ProcessingProgress {
  stage: "extracting" | "chunking" | "embedding" | "storing" | "complete";
  progress: number;
  message: string;
}

export type EmbeddingModel = "tfidf" | "simple";

export interface KnowledgeConfig {
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: EmbeddingModel;
  maxResults: number;
}

export const DEFAULT_KNOWLEDGE_CONFIG: KnowledgeConfig = {
  chunkSize: 500,
  chunkOverlap: 50,
  embeddingModel: "tfidf",
  maxResults: 5,
};
