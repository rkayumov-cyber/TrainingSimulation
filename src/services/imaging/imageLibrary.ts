import { openDB, type DBSchema, type IDBPDatabase } from "idb";

export interface GeneratedImage {
  id: string;
  name: string;
  category: string;
  svgContent: string;
  params: Record<string, unknown>;
  scenarioId?: string;
  createdAt: number;
}

interface ImageDBSchema extends DBSchema {
  images: {
    key: string;
    value: GeneratedImage;
    indexes: {
      "by-category": string;
      "by-scenario": string;
      "by-date": number;
    };
  };
}

const DB_NAME = "clinical-sim-images";
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<ImageDBSchema> | null = null;

async function getDB(): Promise<IDBPDatabase<ImageDBSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<ImageDBSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore("images", { keyPath: "id" });
      store.createIndex("by-category", "category");
      store.createIndex("by-scenario", "scenarioId");
      store.createIndex("by-date", "createdAt");
    },
  });

  return dbInstance;
}

export async function saveGeneratedImage(
  image: GeneratedImage,
): Promise<void> {
  const db = await getDB();
  await db.put("images", image);
}

export async function getAllImages(): Promise<GeneratedImage[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("images", "by-date");
  return all.reverse();
}

export async function getImagesByCategory(
  category: string,
): Promise<GeneratedImage[]> {
  const db = await getDB();
  return db.getAllFromIndex("images", "by-category", category);
}

export async function getImagesByScenario(
  scenarioId: string,
): Promise<GeneratedImage[]> {
  const db = await getDB();
  return db.getAllFromIndex("images", "by-scenario", scenarioId);
}

export async function deleteImage(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("images", id);
}

export async function clearAllImages(): Promise<void> {
  const db = await getDB();
  await db.clear("images");
}

// ── Utility Functions ──

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function svgToBlob(svg: string): Blob {
  return new Blob([svg], { type: "image/svg+xml" });
}

export function downloadSvg(svg: string, filename: string): void {
  const blob = svgToBlob(svg);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".svg") ? filename : `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadAsPng(
  svg: string,
  filename: string,
  scale: number = 2,
): Promise<void> {
  // Parse SVG to get dimensions
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, "image/svg+xml");
  const svgEl = doc.documentElement;
  const width = parseInt(svgEl.getAttribute("width") || "800") * scale;
  const height = parseInt(svgEl.getAttribute("height") || "600") * scale;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const img = new window.Image();
  const svgBlob = svgToBlob(svg);
  const url = URL.createObjectURL(svgBlob);

  return new Promise<void>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) return resolve();
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
        resolve();
      }, "image/png");
    };
    img.src = url;
  });
}
