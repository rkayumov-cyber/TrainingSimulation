import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import type {
  KnowledgeDocument,
  DocumentChunk,
  SearchResult,
  KnowledgeBaseStats,
} from "../../types/knowledge";
import { cosineSimilarity, getEmbedder } from "./embeddings";

interface KnowledgeDBSchema extends DBSchema {
  documents: {
    key: string;
    value: KnowledgeDocument;
    indexes: { "by-upload": number };
  };
  chunks: {
    key: string;
    value: DocumentChunk;
    indexes: { "by-document": string };
  };
  vocabulary: {
    key: string;
    value: {
      id: string;
      vocabulary: [string, { index: number; idf: number }][];
      documentCount: number;
    };
  };
}

const DB_NAME = "clinical-knowledge-base";
const DB_VERSION = 1;

let db: IDBPDatabase<KnowledgeDBSchema> | null = null;

async function getDB(): Promise<IDBPDatabase<KnowledgeDBSchema>> {
  if (db) return db;

  db = await openDB<KnowledgeDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Documents store
      const docStore = database.createObjectStore("documents", {
        keyPath: "id",
      });
      docStore.createIndex("by-upload", "uploadedAt");

      // Chunks store
      const chunkStore = database.createObjectStore("chunks", {
        keyPath: "id",
      });
      chunkStore.createIndex("by-document", "documentId");

      // Vocabulary store (for embedder state)
      database.createObjectStore("vocabulary", { keyPath: "id" });
    },
  });

  return db;
}

// Document operations
export async function addDocument(document: KnowledgeDocument): Promise<void> {
  const database = await getDB();
  await database.put("documents", document);
}

export async function getDocument(
  id: string,
): Promise<KnowledgeDocument | undefined> {
  const database = await getDB();
  return database.get("documents", id);
}

export async function getAllDocuments(): Promise<KnowledgeDocument[]> {
  const database = await getDB();
  return database.getAllFromIndex("documents", "by-upload");
}

export async function deleteDocument(id: string): Promise<void> {
  const database = await getDB();
  const tx = database.transaction(["documents", "chunks"], "readwrite");

  // Delete the document
  await tx.objectStore("documents").delete(id);

  // Delete all chunks for this document
  const chunkStore = tx.objectStore("chunks");
  const index = chunkStore.index("by-document");
  const chunks = await index.getAllKeys(id);
  for (const chunkId of chunks) {
    await chunkStore.delete(chunkId);
  }

  await tx.done;
}

// Chunk operations
export async function addChunks(chunks: DocumentChunk[]): Promise<void> {
  const database = await getDB();
  const tx = database.transaction("chunks", "readwrite");
  for (const chunk of chunks) {
    await tx.store.put(chunk);
  }
  await tx.done;
}

export async function getChunksByDocument(
  documentId: string,
): Promise<DocumentChunk[]> {
  const database = await getDB();
  return database.getAllFromIndex("chunks", "by-document", documentId);
}

export async function getAllChunks(): Promise<DocumentChunk[]> {
  const database = await getDB();
  return database.getAll("chunks");
}

// Vocabulary persistence
export async function saveVocabulary(): Promise<void> {
  const database = await getDB();
  const embedder = getEmbedder();
  const vocabData = embedder.exportVocabulary();
  await database.put("vocabulary", { id: "main", ...vocabData });
}

export async function loadVocabulary(): Promise<boolean> {
  const database = await getDB();
  const data = await database.get("vocabulary", "main");
  if (data) {
    const embedder = getEmbedder();
    embedder.importVocabulary({
      vocabulary: data.vocabulary,
      documentCount: data.documentCount,
    });
    return true;
  }
  return false;
}

// Search functionality
export async function search(
  query: string,
  maxResults: number = 5,
  minScore: number = 0.1,
): Promise<SearchResult[]> {
  const database = await getDB();
  const embedder = getEmbedder();

  // Get query embedding
  const queryEmbedding = embedder.embed(query);

  // Get all chunks
  const chunks = await database.getAll("chunks");
  const documents = await database.getAll("documents");
  const docMap = new Map(documents.map((d) => [d.id, d]));

  // Calculate similarities
  const results: SearchResult[] = [];

  for (const chunk of chunks) {
    const score = cosineSimilarity(queryEmbedding, chunk.embedding);
    if (score >= minScore) {
      const document = docMap.get(chunk.documentId);
      if (document) {
        results.push({ chunk, document, score });
      }
    }
  }

  // Sort by score and return top results
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

// Get knowledge base stats
export async function getStats(): Promise<KnowledgeBaseStats> {
  const database = await getDB();
  const documents = await database.getAll("documents");
  const chunks = await database.getAll("chunks");

  return {
    documentCount: documents.length,
    totalChunks: chunks.length,
    totalSize: documents.reduce((sum, doc) => sum + doc.fileSize, 0),
  };
}

// Clear entire knowledge base
export async function clearKnowledgeBase(): Promise<void> {
  const database = await getDB();
  const tx = database.transaction(
    ["documents", "chunks", "vocabulary"],
    "readwrite",
  );
  await tx.objectStore("documents").clear();
  await tx.objectStore("chunks").clear();
  await tx.objectStore("vocabulary").clear();
  await tx.done;
}

// Rebuild vocabulary from all stored chunks
export async function rebuildVocabulary(): Promise<void> {
  const chunks = await getAllChunks();
  if (chunks.length === 0) return;

  const embedder = getEmbedder();
  embedder.buildVocabulary(chunks.map((c) => c.content));

  // Re-embed all chunks with new vocabulary
  const database = await getDB();
  const tx = database.transaction("chunks", "readwrite");

  for (const chunk of chunks) {
    chunk.embedding = embedder.embed(chunk.content);
    await tx.store.put(chunk);
  }

  await tx.done;
  await saveVocabulary();
}
