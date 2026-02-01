export {
  getImagingManager,
  resetImagingManager,
  interpretABG,
} from "./imagingService";

export {
  generateECG,
  generateChestXray,
  generatePupilChart,
  generateVitalTrend,
  generateABGChart,
  generateGCSScale,
  generateBurnChart,
} from "./svgGenerators";

export type {
  ECGPattern,
  ChestXrayFinding,
  PupilState,
  VitalDataPoint,
} from "./svgGenerators";

export {
  saveGeneratedImage,
  getAllImages,
  getImagesByCategory,
  getImagesByScenario,
  deleteImage,
  clearAllImages,
  svgToDataUrl,
  svgToBlob,
  downloadSvg,
  downloadAsPng,
} from "./imageLibrary";

export type { GeneratedImage } from "./imageLibrary";

export {
  MEDICAL_IMAGE_CATALOG,
  SCENARIO_IMAGE_SETS,
  getCatalogImage,
  getCatalogByCategory,
  getCatalogForScenario,
  getScenarioImageSet,
  searchCatalog,
} from "./medicalImageCatalog";
export type {
  CatalogImage,
  ImageCategory,
  ImageGenerator,
  ScenarioImageSet,
} from "./medicalImageCatalog";
