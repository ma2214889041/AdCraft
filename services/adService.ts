import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScrapedProduct, ProductAsset } from "../types";
import { optimizeImage, fileToBase64Optimized } from "./imageOptimizationService";
import { VideoProgressTracker, ProgressCallback } from "./videoProgressService";
import {
  generateFileHash,
  getCachedImageAnalysis,
  cacheImageAnalysis,
  getCachedVideo,
  cacheVideo,
  getCachedGenerationResult,
  cacheGenerationResult,
} from "./cacheService";
import {
  trackImageOptimization,
  trackAPICall,
  trackVideoGeneration,
} from "./performanceMonitor";

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is required. Please configure VITE_API_KEY in .env");
  }
  return apiKey;
};

const getClient = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

/**
 * Convert File/Blob/URL to base64
 */
async function toBase64(input: File | Blob | string): Promise<string> {
  if (typeof input === 'string') {
    // It's a URL
    const response = await fetch(input);
    const blob = await response.blob();
    input = blob;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix
      resolve(base64String.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(input);
  });
}

/**
 * Analyze product image using Gemini Vision (with optimization and caching)
 * This is the MOST IMPORTANT function for extracting product information from images
 */
export const analyzeProductImage = async (
  imageFile: File | string,
  options: { forceRefresh?: boolean } = {}
): Promise<ScrapedProduct> => {
  const ai = getClient();

  console.log("📸 Analyzing product image...");

  const startTime = Date.now();

  // Generate hash for caching (only for File objects)
  let imageHash: string | null = null;
  if (imageFile instanceof File) {
    imageHash = await generateFileHash(imageFile);

    // Check cache first
    if (!options.forceRefresh) {
      const cached = await getCachedImageAnalysis(imageHash);
      if (cached) {
        console.log("✅ Using cached analysis result");
        // Track cache hit
        await trackAPICall({
          endpoint: 'analyzeProductImage',
          duration: Date.now() - startTime,
          status: 'success',
          cacheHit: true,
          cost: 0,
        });
        return cached;
      }
    }
  }

  // Optimize image if it's a File
  let base64Image: string;
  if (imageFile instanceof File) {
    console.log("🔧 Optimizing image...");
    const optimizationStart = Date.now();
    const originalSize = imageFile.size;

    base64Image = await fileToBase64Optimized(imageFile, {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.85,
      maxSizeKB: 1024, // 1MB max for API
    });

    // Estimate optimized size from base64 (rough estimate)
    const optimizedSize = Math.round((base64Image.length * 3) / 4);
    const processingTime = Date.now() - optimizationStart;

    // Track optimization
    await trackImageOptimization({
      originalSize,
      optimizedSize,
      compressionRatio: originalSize > 0 ? optimizedSize / originalSize : 1,
      width: 2048,
      height: 2048,
      format: 'jpeg',
      processingTime,
    });

    console.log("✅ Image optimized");
  } else {
    base64Image = await toBase64(imageFile);
  }

  const prompt = `
    You are an expert product analyst. Analyze this product image in detail.

    Extract the following information:
    1. **Product Name**: What is the product called? Be specific.
    2. **Brand**: What brand is it (if visible)?
    3. **Category**: Classify into: tech, beauty, fashion, home, food, or other
    4. **Description**: Detailed description of the product (50-100 words)
    5. **Key Features**: List 5 notable features or characteristics
    6. **Selling Points**: 3 compelling marketing points (max 6 words each)
    7. **Target Audience**: Who would buy this product?
    8. **Price Range**: Estimate realistic price range in USD
    9. **Colors**: What colors are visible?
    10. **Material**: What materials is it made of (if visible)?

    Be very detailed and accurate. This information will be used for advertising.

    Return as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            product_name: { type: Type.STRING },
            brand: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            key_features: { type: Type.ARRAY, items: { type: Type.STRING } },
            selling_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            target_audience: { type: Type.STRING },
            price_min: { type: Type.NUMBER },
            price_max: { type: Type.NUMBER },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
            material: { type: Type.STRING }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");

    console.log("✅ Product analysis complete:", data);

    // Convert the uploaded image to a data URL for display
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    const productAssets: ProductAsset[] = [
      {
        id: 'original',
        url: imageDataUrl,
        selected: true
      }
    ];

    const priceRange = data.price_min && data.price_max
      ? `$${data.price_min} - $${data.price_max}`
      : "$0.00";

    const result: ScrapedProduct = {
      url: 'uploaded-image',
      title: data.product_name || data.brand || "Product",
      description: data.description || "No description available",
      images: productAssets,
      sellingPoints: data.selling_points || ["Quality", "Value", "Style"],
      price: priceRange,
      currency: "$"
    };

    // Cache the result
    if (imageHash) {
      await cacheImageAnalysis(imageHash, result);
    }

    // Track API call (cache miss)
    await trackAPICall({
      endpoint: 'analyzeProductImage',
      duration: Date.now() - startTime,
      status: 'success',
      cacheHit: false,
      cost: 0.003, // Estimated cost per API call
    });

    return result;

  } catch (error) {
    console.error("❌ Image analysis error:", error);

    // Track failed API call
    await trackAPICall({
      endpoint: 'analyzeProductImage',
      duration: Date.now() - startTime,
      status: 'error',
      cacheHit: false,
      cost: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    throw new Error("Failed to analyze product image. Please try again.");
  }
};

/**
 * Analyze product URL (fallback method)
 */
export const analyzeProductUrl = async (url: string): Promise<ScrapedProduct> => {
  const ai = getClient();

  console.log("🔗 Analyzing product URL...");

  const prompt = `
    Analyze this product URL and extract information:
    URL: "${url}"

    Extract:
    1. Product name from URL
    2. Likely category
    3. Generate a marketing description
    4. Suggest selling points

    Return as JSON.
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
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            selling_points: { type: Type.ARRAY, items: { type: Type.STRING } },
            category: { type: Type.STRING },
            estimated_price: { type: Type.NUMBER }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");

    console.log("✅ URL analysis complete");

    // Use placeholder images based on category
    const placeholderImages: ProductAsset[] = [
      {
        id: 'placeholder-1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
        selected: true
      }
    ];

    return {
      url,
      title: data.title || "Product from URL",
      description: data.description || "Product description",
      images: placeholderImages,
      sellingPoints: data.selling_points || ["Feature 1", "Feature 2", "Feature 3"],
      price: data.estimated_price ? `$${data.estimated_price}` : "$0.00",
      currency: "$"
    };

  } catch (error) {
    console.error("❌ URL analysis error:", error);
    throw new Error("Failed to analyze URL. Please try direct image upload instead.");
  }
};

/**
 * Generate selling points from product info
 */
export const generateSellingPoints = async (productName: string, description: string): Promise<string[]> => {
  const ai = getClient();

  const prompt = `
    Create 3 compelling, short marketing selling points for this product.
    Each point should be maximum 6 words.

    Product: ${productName}
    Description: ${description}

    Make them punchy and benefit-focused.
    Return as JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const points = JSON.parse(response.text || '["High Quality", "Best Value", "Fast Shipping"]');
    console.log("✅ Selling points generated");
    return points;

  } catch (error) {
    console.error("❌ Selling points generation error:", error);
    return ["Premium Quality", "Best Seller", "Limited Offer"];
  }
};

/**
 * Generate video ad from product image using Veo (with progress tracking and caching)
 */
export const generateVideoAd = async (
  imageUrl: string,
  productDescription: string,
  onProgress?: ProgressCallback,
  options: { forceRefresh?: boolean } = {}
): Promise<string> => {
  const ai = getClient();
  const apiKey = getApiKey();
  const startTime = Date.now();

  // Create cache key from inputs
  const cacheKey = `${imageUrl}_${productDescription}`;

  // Check cache first
  if (!options.forceRefresh) {
    const cached = await getCachedVideo(cacheKey);
    if (cached) {
      console.log("✅ Using cached video");
      // Track cache hit
      await trackAPICall({
        endpoint: 'generateVideoAd',
        duration: Date.now() - startTime,
        status: 'success',
        cacheHit: true,
        cost: 0,
      });
      return cached;
    }
  }

  console.log("🎬 Generating product video ad...");

  // Initialize progress tracker
  const tracker = onProgress ? new VideoProgressTracker(onProgress) : null;
  tracker?.setStage('analyzing', 0);

  // Convert image to base64
  const base64Image = await toBase64(imageUrl);

  const shortDesc = productDescription.slice(0, 150);

  try {
    tracker?.setStage('preparing', 100);

    let operation = await ai.models.generateVideos({
      model: import.meta.env.VITE_VEO_MODEL || 'veo-3.1-fast-generate-preview',
      prompt: `Professional product commercial. ${shortDesc}. Cinematic lighting, slow rotation, 4K quality, studio background, elegant presentation.`,
      image: {
        imageBytes: base64Image,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Vertical for social media
      }
    });

    console.log("⏳ Video rendering in progress...");

    // Start simulated progress polling
    tracker?.startPolling(2000);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    // Stop polling and move to processing
    tracker?.stopPolling();
    tracker?.setStage('processing', 50);

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!videoUri) {
      tracker?.fail("Video generation failed");
      throw new Error("Video generation failed");
    }

    const videoUrl = `${videoUri}&key=${apiKey}`;

    // Cache the result
    await cacheVideo(cacheKey, videoUrl);

    tracker?.complete();
    console.log("✅ Video generated successfully!");

    // Track successful video generation
    const duration = Date.now() - startTime;
    await trackVideoGeneration(duration, true);
    await trackAPICall({
      endpoint: 'generateVideoAd',
      duration,
      status: 'success',
      cacheHit: false,
      cost: 0.05, // Estimated cost for video generation
    });

    return videoUrl;

  } catch (error) {
    tracker?.fail();
    console.error("❌ Video generation error:", error);

    // Track failed video generation
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await trackVideoGeneration(duration, false, errorMessage);
    await trackAPICall({
      endpoint: 'generateVideoAd',
      duration,
      status: 'error',
      cacheHit: false,
      cost: 0,
      errorMessage,
    });

    throw error;
  } finally {
    tracker?.destroy();
  }
};

/**
 * Generate AI scene with product (image editing with caching)
 */
export const generateAIProductScene = async (
  imageUrl: string,
  sceneDescription: string,
  options: { forceRefresh?: boolean } = {}
): Promise<string> => {
  const ai = getClient();
  const startTime = Date.now();

  // Create cache key
  const cacheKey = `scene_${imageUrl}_${sceneDescription}`;

  // Check cache first
  if (!options.forceRefresh) {
    const cached = await getCachedGenerationResult<string>(cacheKey);
    if (cached) {
      console.log("✅ Using cached AI scene");
      // Track cache hit
      await trackAPICall({
        endpoint: 'generateAIProductScene',
        duration: Date.now() - startTime,
        status: 'success',
        cacheHit: true,
        cost: 0,
      });
      return cached;
    }
  }

  console.log("🎨 Generating AI product scene...");

  const base64Image = await toBase64(imageUrl);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Create a professional product photo placing this item in: ${sceneDescription}. Keep the product as the main focus. Photorealistic, high quality, professional advertising style.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
      const result = `data:image/png;base64,${part.inlineData.data}`;

      // Cache the result
      await cacheGenerationResult(cacheKey, result);

      console.log("✅ AI scene generated!");

      // Track successful AI scene generation
      await trackAPICall({
        endpoint: 'generateAIProductScene',
        duration: Date.now() - startTime,
        status: 'success',
        cacheHit: false,
        cost: 0.01, // Estimated cost for image generation
      });

      return result;
    }

    throw new Error("No image generated");

  } catch (error) {
    console.error("❌ AI scene generation error:", error);

    // Track failed AI scene generation
    await trackAPICall({
      endpoint: 'generateAIProductScene',
      duration: Date.now() - startTime,
      status: 'error',
      cacheHit: false,
      cost: 0,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
};
