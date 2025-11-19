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

// --- Avatar System ---

export interface Avatar {
  id: string;
  name: string;
  thumbnail: string;
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'middle' | 'senior';
  ethnicity: string;
  style: 'realistic' | 'animated' | 'custom';
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  accent: string;
  preview?: string;
}

export interface AvatarVideoConfig {
  avatar: Avatar;
  voice: Voice;
  script: string;
  background?: string;
  emotion?: 'neutral' | 'happy' | 'excited' | 'serious';
}

// --- Template System ---

export interface AdTemplate {
  id: string;
  name: string;
  category: 'ecommerce' | 'app' | 'game' | 'service';
  thumbnail: string;
  layout: string;
  isPremium: boolean;
}

// --- Batch Mode ---

export interface BatchJob {
  id: string;
  name: string;
  variants: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: string[];
  createdAt: number;
}

// --- A/B Testing ---

export interface ABTest {
  id: string;
  name: string;
  variants: ABVariant[];
  status: 'draft' | 'running' | 'completed';
  winner?: string;
  createdAt: number;
}

export interface ABVariant {
  id: string;
  name: string;
  videoUrl: string;
  metrics: {
    views: number;
    clicks: number;
    ctr: number;
    conversions: number;
    cost: number;
  };
}

// --- Platform Export ---

export interface PlatformSpec {
  name: string;
  aspectRatio: string;
  minDuration: number;
  maxDuration: number;
  maxFileSize: number;
  format: string;
}

export interface ExportConfig {
  platform: 'tiktok' | 'facebook' | 'instagram' | 'youtube' | 'snapchat';
  quality: 'low' | 'medium' | 'high';
  customSpec?: Partial<PlatformSpec>;
}

// --- AdMax / Inspiration ---

export interface TrendingAd {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  platform: string;
  views: number;
  engagement: number;
  tags: string[];
}

// --- Extended Project Type ---

export interface ExtendedProject {
  id: string;
  name: string;
  type: 'video' | 'image' | 'avatar' | 'batch';
  config: AdConfig | VideoScript | AvatarVideoConfig | any;
  assets: string[];
  results: string[];
  status: 'draft' | 'processing' | 'completed';
  createdAt: number;
  updatedAt: number;
  tags?: string[];
}