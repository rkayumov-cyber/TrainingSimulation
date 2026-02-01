import type { ProcessingProgress } from "../../types/knowledge";

// Simple TF-IDF based embedding for client-side vector search
// This is lightweight and works without external APIs

interface VocabularyEntry {
  index: number;
  idf: number;
}

export class TFIDFEmbedder {
  private vocabulary: Map<string, VocabularyEntry> = new Map();
  private documentCount: number = 0;
  private isBuilt: boolean = false;

  // Tokenize and normalize text
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !this.isStopWord(word));
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "was",
      "are",
      "were",
      "been",
      "be",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "shall",
      "can",
      "this",
      "that",
      "these",
      "those",
      "it",
      "its",
      "they",
      "them",
      "their",
      "we",
      "our",
      "you",
      "your",
      "he",
      "she",
      "him",
      "her",
      "his",
      "which",
      "who",
      "whom",
      "what",
      "where",
      "when",
      "why",
      "how",
      "all",
      "each",
      "every",
      "both",
      "few",
      "more",
      "most",
      "other",
      "some",
      "such",
      "no",
      "nor",
      "not",
      "only",
      "own",
      "same",
      "so",
      "than",
      "too",
      "very",
      "just",
      "also",
      "now",
      "here",
      "there",
    ]);
    return stopWords.has(word);
  }

  // Build vocabulary from a corpus of documents
  buildVocabulary(documents: string[]): void {
    const documentFrequency: Map<string, number> = new Map();
    this.documentCount = documents.length;

    // Count document frequency for each term
    for (const doc of documents) {
      const tokens = new Set(this.tokenize(doc));
      for (const token of tokens) {
        documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
      }
    }

    // Build vocabulary with IDF scores
    let index = 0;
    for (const [term, df] of documentFrequency) {
      // Only include terms that appear in at least 1 doc but not more than 90%
      if (df >= 1 && df <= this.documentCount * 0.9) {
        const idf = Math.log((this.documentCount + 1) / (df + 1)) + 1;
        this.vocabulary.set(term, { index, idf });
        index++;
      }
    }

    this.isBuilt = true;
  }

  // Get embedding dimension
  getDimension(): number {
    return this.vocabulary.size;
  }

  // Generate TF-IDF embedding for a single document
  embed(text: string): number[] {
    if (!this.isBuilt || this.vocabulary.size === 0) {
      // Return simple bag-of-words hash if vocabulary not built
      return this.simpleEmbed(text);
    }

    const tokens = this.tokenize(text);
    const termFrequency: Map<string, number> = new Map();

    // Count term frequency
    for (const token of tokens) {
      termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
    }

    // Create TF-IDF vector
    const vector = new Array(this.vocabulary.size).fill(0);
    const maxTf = Math.max(...termFrequency.values(), 1);

    for (const [term, tf] of termFrequency) {
      const vocabEntry = this.vocabulary.get(term);
      if (vocabEntry) {
        // Normalized TF * IDF
        vector[vocabEntry.index] = (tf / maxTf) * vocabEntry.idf;
      }
    }

    // L2 normalize
    return this.normalize(vector);
  }

  // Simple embedding for when vocabulary isn't built (uses hashing)
  private simpleEmbed(text: string, dimension: number = 256): number[] {
    const tokens = this.tokenize(text);
    const vector = new Array(dimension).fill(0);

    for (const token of tokens) {
      // Simple hash function
      let hash = 0;
      for (let i = 0; i < token.length; i++) {
        hash = (hash * 31 + token.charCodeAt(i)) % dimension;
      }
      vector[hash] += 1;
    }

    return this.normalize(vector);
  }

  // L2 normalization
  private normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0),
    );
    if (magnitude === 0) return vector;
    return vector.map((val) => val / magnitude);
  }

  // Export vocabulary for persistence
  exportVocabulary(): {
    vocabulary: [string, VocabularyEntry][];
    documentCount: number;
  } {
    return {
      vocabulary: Array.from(this.vocabulary.entries()),
      documentCount: this.documentCount,
    };
  }

  // Import vocabulary from persistence
  importVocabulary(data: {
    vocabulary: [string, VocabularyEntry][];
    documentCount: number;
  }): void {
    this.vocabulary = new Map(data.vocabulary);
    this.documentCount = data.documentCount;
    this.isBuilt = true;
  }
}

// Cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    // Handle dimension mismatch by using min length
    const minLen = Math.min(a.length, b.length);
    a = a.slice(0, minLen);
    b = b.slice(0, minLen);
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Global embedder instance
let globalEmbedder: TFIDFEmbedder | null = null;

export function getEmbedder(): TFIDFEmbedder {
  if (!globalEmbedder) {
    globalEmbedder = new TFIDFEmbedder();
  }
  return globalEmbedder;
}

export function resetEmbedder(): void {
  globalEmbedder = new TFIDFEmbedder();
}

// Embed multiple chunks with progress
export async function embedChunks(
  chunks: { content: string }[],
  onProgress?: (progress: ProcessingProgress) => void,
): Promise<number[][]> {
  const embedder = getEmbedder();

  onProgress?.({
    stage: "embedding",
    progress: 0,
    message: "Building vocabulary...",
  });

  // Build vocabulary from all chunks
  embedder.buildVocabulary(chunks.map((c) => c.content));

  onProgress?.({
    stage: "embedding",
    progress: 10,
    message: "Generating embeddings...",
  });

  const embeddings: number[][] = [];

  for (let i = 0; i < chunks.length; i++) {
    embeddings.push(embedder.embed(chunks[i].content));

    if (i % 10 === 0) {
      onProgress?.({
        stage: "embedding",
        progress: 10 + (i / chunks.length) * 90,
        message: `Embedding chunk ${i + 1} of ${chunks.length}...`,
      });
      // Yield to main thread
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  onProgress?.({
    stage: "embedding",
    progress: 100,
    message: "Embeddings complete",
  });

  return embeddings;
}
