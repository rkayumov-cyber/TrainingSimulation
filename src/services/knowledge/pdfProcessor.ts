import * as pdfjsLib from "pdfjs-dist";
import type {
  ProcessingProgress,
  KnowledgeConfig,
} from "../../types/knowledge";

// Disable worker for simpler setup - runs in main thread
pdfjsLib.GlobalWorkerOptions.workerSrc = "";

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface TextChunk {
  content: string;
  pageNumber: number;
  chunkIndex: number;
}

export async function extractTextFromPDF(
  file: File,
  onProgress?: (progress: ProcessingProgress) => void,
): Promise<ExtractedPage[]> {
  onProgress?.({
    stage: "extracting",
    progress: 0,
    message: "Loading PDF...",
  });

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: ExtractedPage[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    pages.push({
      pageNumber: i,
      text,
    });

    onProgress?.({
      stage: "extracting",
      progress: (i / pdf.numPages) * 100,
      message: `Extracting page ${i} of ${pdf.numPages}...`,
    });
  }

  return pages;
}

export function chunkText(
  pages: ExtractedPage[],
  config: Pick<KnowledgeConfig, "chunkSize" | "chunkOverlap"> = {
    chunkSize: 500,
    chunkOverlap: 50,
  },
  onProgress?: (progress: ProcessingProgress) => void,
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let globalChunkIndex = 0;

  onProgress?.({
    stage: "chunking",
    progress: 0,
    message: "Chunking text...",
  });

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const page = pages[pageIdx];
    const words = page.text.split(/\s+/);

    let start = 0;
    while (start < words.length) {
      const end = Math.min(start + config.chunkSize, words.length);
      const chunkWords = words.slice(start, end);

      if (chunkWords.length > 0) {
        chunks.push({
          content: chunkWords.join(" "),
          pageNumber: page.pageNumber,
          chunkIndex: globalChunkIndex++,
        });
      }

      start += config.chunkSize - config.chunkOverlap;
      if (start >= words.length) break;
    }

    onProgress?.({
      stage: "chunking",
      progress: ((pageIdx + 1) / pages.length) * 100,
      message: `Chunked page ${pageIdx + 1} of ${pages.length}...`,
    });
  }

  return chunks;
}

export async function processPDF(
  file: File,
  config?: Partial<KnowledgeConfig>,
  onProgress?: (progress: ProcessingProgress) => void,
): Promise<{ pages: ExtractedPage[]; chunks: TextChunk[]; pageCount: number }> {
  const mergedConfig = {
    chunkSize: config?.chunkSize ?? 500,
    chunkOverlap: config?.chunkOverlap ?? 50,
  };

  const pages = await extractTextFromPDF(file, onProgress);
  const chunks = chunkText(pages, mergedConfig, onProgress);

  return {
    pages,
    chunks,
    pageCount: pages.length,
  };
}
