export interface ScriptSegment {
  scene: number;
  visual: string;
  audio: string;
  duration: number;
}

export interface VideoScript {
  title: string;
  segments: ScriptSegment[];
  targetAudience: string;
  tone: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING_SCRIPT = 'GENERATING_SCRIPT',
  SCRIPT_READY = 'SCRIPT_READY',
  GENERATING_VIDEO = 'GENERATING_VIDEO',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  ANALYZING = 'ANALYZING'
}

export interface GeneratedVideo {
  uri: string;
  expirationTime?: string;
}

export interface Project {
  id: string;
  name: string;
  productDescription: string;
  script: VideoScript | null;
  videoUri: string | null;
  status: GenerationStatus;
  createdAt: number;
}

// --- New Types for Image Ads ---

export interface ProductAsset {
  id: string;
  url: string;
  selected: boolean;
}

export interface AdConfig {
  productName: string;
  productDescription: string;
  sellingPoints: string[];
  brandLogo?: string;
  brandColor: string;
  promo: {
    enabled: boolean;
    originalPrice: string;
    promoPrice: string;
    discountText: string; // e.g. "20% OFF"
  };
  templateId: string;
}

export interface ScrapedProduct {
  url: string;
  title: string;
  description: string;
  images: ProductAsset[];
  sellingPoints?: string[];
  price?: string;
  currency?: string;
}