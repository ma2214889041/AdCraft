import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScrapedProduct, ProductAsset } from "../types";

// Helper for AI Studio Key Check (duplicated from geminiService to keep file self-contained as requested)
interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}
const getAIStudio = (): AIStudioClient | undefined => {
  return (window as any).aistudio;
}

const getClient = () => {
  const apiKey = process.env.API_KEY;
  return new GoogleGenAI({ apiKey: apiKey });
};

// Curated image collections to make the "Scraping" feel more real/relevant
// since we cannot actually bypass CORS to scrape real images client-side.
const IMAGE_CATEGORIES: Record<string, string[]> = {
  'tech': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', // Phone
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80', // Electronics
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', // Smart watch
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', // Headphones
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80', // Gadget
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', // Laptop
  ],
  'beauty': [
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80', // Serum
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', // Bottle
    'https://images.unsplash.com/photo-1571781348782-72c42e1e795b?auto=format&fit=crop&w=800&q=80', // Cream
    'https://images.unsplash.com/photo-1556228720-19de77d08619?auto=format&fit=crop&w=800&q=80', // Tube
    'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80', // Cosmetic
    'https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?auto=format&fit=crop&w=800&q=80', // Spray
  ],
  'fashion': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Shoe
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', // Watch
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80', // Tshirt
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80', // Shirt
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', // Fashion
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80', // Sneakers
  ],
  'home': [
    'https://images.unsplash.com/photo-1583847661867-7c54d0c3029d?auto=format&fit=crop&w=800&q=80', // Decor
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Chair
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', // Interior
    'https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80', // Furniture
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', // Home
    'https://images.unsplash.com/photo-1594068935971-7d7762f747c5?auto=format&fit=crop&w=800&q=80', // Candle/Bottle
  ],
  'other': [
     'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
     'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
     'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
     'https://images.unsplash.com/photo-1571781348782-72c42e1e795b?auto=format&fit=crop&w=800&q=80',
     'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
     'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80',
  ]
};

export const analyzeProductUrl = async (url: string): Promise<ScrapedProduct> => {
  const ai = getClient();
  
  // Updated prompt to specifically ask for Price and Category to improve accuracy
  const prompt = `
    You are an intelligent e-commerce product parser. 
    Analyze the provided URL string to infer the Product Name, Description, Selling Points, Price, and Product Category.
    
    URL: "${url}"
    
    Instructions:
    1. Product Name: Extract from URL slug/title.
    2. Price: Look for price indicators in the URL text (e.g. /p/29.99) OR estimate a realistic price based on the brand/product type (e.g. if it's a high-end sony headphone, estimate ~$300, if it's a cheap shirt, estimate ~$25). Return as a number.
    3. Category: Classify into one of: 'tech', 'beauty', 'fashion', 'home', 'other'.
    4. Selling Points: 3 punchy marketing points.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    selling_points: { type: Type.ARRAY, items: { type: Type.STRING } },
                    price: { type: Type.NUMBER, description: "Estimated or extracted price" },
                    currency: { type: Type.STRING, description: "Currency symbol, default $" },
                    category: { type: Type.STRING, enum: ['tech', 'beauty', 'fashion', 'home', 'other'] }
                }
            }
        }
    });

    const data = JSON.parse(response.text || "{}");
    const category = (data.category || 'other').toLowerCase();
    
    // Select images based on the detected category for better relevance
    const categoryImages = IMAGE_CATEGORIES[category] || IMAGE_CATEGORIES['other'];
    // Shuffle slightly so it's not always identical order
    const shuffledImages = [...categoryImages].sort(() => Math.random() - 0.5);

    // Map to ProductAsset type
    const productAssets: ProductAsset[] = shuffledImages.map((url, idx) => ({
        id: `img-${idx}`,
        url: url,
        selected: idx === 0 // Select first one by default
    }));

    const formattedPrice = data.price ? `$${data.price}` : undefined;

    return {
      url,
      title: data.title || "New Product",
      description: data.description || "Amazing product description.",
      images: productAssets,
      sellingPoints: data.selling_points || ["Quality", "Value", "Style"],
      price: formattedPrice,
      currency: data.currency || "$"
    };

  } catch (e) {
    console.error("Gemini Analysis Error", e);
    // Fallback
    return {
      url,
      title: "Product Analysis Failed",
      description: "We couldn't extract details. Please enter them manually.",
      images: [],
      sellingPoints: ["Feature 1", "Feature 2", "Feature 3"],
      price: "$0.00"
    };
  }
};

export const generateSellingPoints = async (productName: string, description: string): Promise<string[]> => {
  const ai = getClient();
  
  const prompt = `
    Extract 3 short, punchy marketing selling points (max 5 words each) for this product.
    Product: ${productName}
    Description: ${description}
    
    Return as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    const text = response.text;
    if (!text) return ["High Quality", "Best Seller", "Free Shipping"];
    return JSON.parse(text);
  } catch (e) {
    console.error("Gemini Selling Points Error", e);
    return ["Radiant Skin", "Anti-Aging", "Fast Acting"];
  }
};

// --- VIDEO GENERATION (VEO) ---

// Helper to fetch image and convert to base64
async function urlToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/*;base64, prefix
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to convert URL to base64", e);
    throw new Error("Could not process image for video generation.");
  }
}

export const generateVideoAd = async (imageUrl: string, productDescription: string): Promise<string> => {
  // Ensure user has selected a key before calling Veo
  const aiStudio = getAIStudio();
  if (aiStudio && aiStudio.hasSelectedApiKey) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
          await aiStudio.openSelectKey();
      }
  }

  const ai = getClient();
  const base64Image = await urlToBase64(imageUrl);
  
  // Shorten description for prompt
  const shortDesc = productDescription.slice(0, 100);

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic commercial shot of this product. ${shortDesc}. Professional lighting, 4k, slow motion, high quality.`,
      image: {
        imageBytes: base64Image,
        mimeType: 'image/jpeg', // Assuming default fetch blob is standard, Veo is lenient or we should detect
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16' // Mobile vertical format for Ads
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("Video generation failed to return a URI.");
    }

    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};

// --- AI SCENE GENERATION (IMAGE EDITING) ---

export const generateAIProductScene = async (imageUrl: string, sceneDescription: string): Promise<string> => {
  const ai = getClient();
  const base64Image = await urlToBase64(imageUrl);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Create a professional advertising image placing this product in the following scene: ${sceneDescription}. Ensure the product remains the focal point. High quality, photorealistic.`,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("AI Scene Generation Error", error);
    throw error;
  }
};