import { GoogleGenAI, Type } from "@google/genai";
import { VideoScript } from "../types";

// Get API key from environment variables
const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    console.error("❌ API Key not found! Please add VITE_API_KEY to your .env file");
    throw new Error("API Key is required. Please configure VITE_API_KEY in .env");
  }
  return apiKey;
};

const getClient = () => {
  return new GoogleGenAI({ apiKey: getApiKey() });
};

export const generateScript = async (productDescription: string): Promise<VideoScript> => {
  const ai = getClient();

  const prompt = `
    You are a professional marketing video scriptwriter.
    Create a viral, high-converting short video script (approx 30-60 seconds) for the following product.

    Product Description: "${productDescription}"

    Return the response in JSON format adhering to the schema.
    Focus on a hook, benefits, social proof, and a call to action.
  `;

  const response = await ai.models.generateContent({
    model: import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-exp',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "A catchy title for the video project" },
          targetAudience: { type: Type.STRING, description: "Who this video is targeting" },
          tone: { type: Type.STRING, description: "The overall tone (e.g., Energetic, Professional, Humorous)" },
          segments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                scene: { type: Type.INTEGER },
                visual: { type: Type.STRING, description: "Detailed visual description for the video generation model. Be descriptive." },
                audio: { type: Type.STRING, description: "The spoken voiceover or dialogue." },
                duration: { type: Type.NUMBER, description: "Estimated duration in seconds" }
              },
              required: ["scene", "visual", "audio", "duration"]
            }
          }
        },
        required: ["title", "segments", "targetAudience", "tone"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No script generated");
  return JSON.parse(text) as VideoScript;
};

export const generateVeoVideo = async (prompt: string): Promise<string> => {
  const ai = getClient();
  const apiKey = getApiKey();

  try {
    console.log("🎬 Starting Veo video generation...");

    let operation = await ai.models.generateVideos({
      model: import.meta.env.VITE_VEO_MODEL || 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    console.log("⏳ Video generation in progress...");

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await ai.operations.getVideosOperation({operation: operation});
      console.log("🔄 Checking status...");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!videoUri) {
      throw new Error("Video generation failed to return a URI.");
    }

    console.log("✅ Video generated successfully!");

    // Veo URIs require the API key appended to fetch/display
    return `${videoUri}&key=${apiKey}`;

  } catch (error) {
    console.error("❌ Veo Generation Error:", error);
    throw error;
  }
};

export const checkApiKey = (): boolean => {
  try {
    getApiKey();
    return true;
  } catch {
    return false;
  }
};
