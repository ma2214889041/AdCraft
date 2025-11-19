import { GoogleGenAI, Type } from "@google/genai";
import { generateVideoAd } from './adService';

const getClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is required. Please configure VITE_API_KEY in .env");
  }
  return new GoogleGenAI({ apiKey });
};

export interface BatchVariant {
  id: string;
  name: string;
  scriptVariation: string;
  imageUrl?: string;
  avatarId?: string;
  voiceId?: string;
}

export interface BatchResult {
  variantId: string;
  variantName: string;
  scriptUsed: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  status: 'success' | 'failed';
  error?: string;
}

/**
 * Generate script variations using Gemini
 */
export const generateScriptVariations = async (
  baseScript: string,
  count: number,
  productName?: string
): Promise<string[]> => {
  const ai = getClient();

  console.log(`✨ Generating ${count} script variations...`);

  const prompt = `
You are a creative copywriter. Generate ${count} compelling variations of this ad script.

Base Script:
"${baseScript}"

${productName ? `Product: ${productName}` : ''}

Requirements:
- Each variation should maintain the core message but use different wording
- Make them catchy and suitable for video ads
- Keep each variation under 100 words
- Use persuasive language and call-to-actions
- Make them unique and diverse in tone (urgent, friendly, professional, etc.)

Return an array of exactly ${count} script variations.
`;

  try {
    const response = await ai.models.generateContent({
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{"variations":[]}');
    const variations = data.variations || [];

    console.log(`✅ Generated ${variations.length} script variations`);
    return variations;

  } catch (error) {
    console.error('❌ Script variation generation failed:', error);
    throw new Error('Failed to generate script variations');
  }
};

/**
 * Generate a single batch variant
 */
const generateSingleVariant = async (
  variant: BatchVariant,
  productImageUrl: string
): Promise<BatchResult> => {
  console.log(`🎬 Generating variant: ${variant.name}`);

  try {
    const videoUrl = await generateVideoAd(productImageUrl, variant.scriptVariation);

    return {
      variantId: variant.id,
      variantName: variant.name,
      scriptUsed: variant.scriptVariation,
      videoUrl,
      status: 'success'
    };
  } catch (error: any) {
    console.error(`❌ Failed to generate variant ${variant.name}:`, error);
    return {
      variantId: variant.id,
      variantName: variant.name,
      scriptUsed: variant.scriptVariation,
      videoUrl: '',
      status: 'failed',
      error: error.message || 'Unknown error'
    };
  }
};

/**
 * Generate multiple batch variants
 * This runs sequentially to avoid overwhelming the API
 */
export const generateBatchVariants = async (
  variants: BatchVariant[],
  productImageUrl: string,
  onProgress?: (current: number, total: number, currentVariant: string) => void
): Promise<BatchResult[]> => {
  console.log(`🚀 Starting batch generation of ${variants.length} variants`);

  const results: BatchResult[] = [];

  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];

    if (onProgress) {
      onProgress(i, variants.length, variant.name);
    }

    const result = await generateSingleVariant(variant, productImageUrl);
    results.push(result);

    // Small delay between generations to avoid rate limiting
    if (i < variants.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (onProgress) {
    onProgress(variants.length, variants.length, 'Completed');
  }

  console.log(`✅ Batch generation complete. Success: ${results.filter(r => r.status === 'success').length}/${results.length}`);

  return results;
};

/**
 * Generate variations in parallel (faster but may hit rate limits)
 * Use with caution
 */
export const generateBatchVariantsParallel = async (
  variants: BatchVariant[],
  productImageUrl: string,
  maxConcurrent: number = 3
): Promise<BatchResult[]> => {
  console.log(`🚀 Starting parallel batch generation with ${maxConcurrent} concurrent requests`);

  const results: BatchResult[] = [];

  // Split into chunks
  for (let i = 0; i < variants.length; i += maxConcurrent) {
    const chunk = variants.slice(i, i + maxConcurrent);

    console.log(`Processing chunk ${Math.floor(i / maxConcurrent) + 1}/${Math.ceil(variants.length / maxConcurrent)}`);

    const chunkResults = await Promise.all(
      chunk.map(variant => generateSingleVariant(variant, productImageUrl))
    );

    results.push(...chunkResults);

    // Delay between chunks
    if (i + maxConcurrent < variants.length) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log(`✅ Parallel batch generation complete`);
  return results;
};

/**
 * Estimate batch generation cost
 */
export const estimateBatchCost = (variantCount: number): {
  estimatedTime: string;
  estimatedCost: string;
} => {
  // Assuming each video takes ~30 seconds to generate
  const timeInSeconds = variantCount * 30;
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);

  const estimatedTime = hours > 0
    ? `${hours}h ${minutes}m`
    : `${minutes}m`;

  // Rough cost estimate ($0.50 per video)
  const estimatedCost = `$${(variantCount * 0.5).toFixed(2)}`;

  return { estimatedTime, estimatedCost };
};

export default {
  generateScriptVariations,
  generateBatchVariants,
  generateBatchVariantsParallel,
  estimateBatchCost,
};
