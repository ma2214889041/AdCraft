import { GoogleGenAI, Type } from "@google/genai";
import { VideoScript } from "../types";

// Use a local interface and casting to avoid global namespace conflicts with window.aistudio
interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

const getAIStudio = (): AIStudioClient | undefined => {
  return (window as any).aistudio;
}

const getClient = () => {
  // Always create a new client to pick up the latest key if it changed via window.aistudio
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: apiKey });
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
    model: 'gemini-2.5-flash',
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

export const generateVeoVideo = async (prompt: string): Promise<string | null> => {
  // Ensure user has selected a key before calling Veo
  const aiStudio = getAIStudio();
  if (aiStudio && aiStudio.hasSelectedApiKey) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
          await aiStudio.openSelectKey();
          // Double check after dialog close attempt (though race conditions exist, we assume user complied)
      }
  }

  const ai = getClient();

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt, 
      config: {
        numberOfVideos: 1,
        resolution: '720p', 
        aspectRatio: '16:9' 
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    
    if (!videoUri) {
      throw new Error("Video generation failed to return a URI.");
    }

    // Veo URIs require the API key appended to fetch/display
    return `${videoUri}&key=${process.env.API_KEY}`;

  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};

export const checkApiKey = async (): Promise<boolean> => {
    const aiStudio = getAIStudio();
    if (aiStudio) {
        return await aiStudio.hasSelectedApiKey();
    }
    return !!process.env.API_KEY;
}

export const promptApiKey = async (): Promise<void> => {
    const aiStudio = getAIStudio();
    if (aiStudio) {
        await aiStudio.openSelectKey();
    }
}