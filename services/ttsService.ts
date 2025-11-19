import { Voice } from '../types';
import { GoogleGenAI } from "@google/genai";

// Voice library
export const VOICE_LIBRARY: Voice[] = [
  // English voices
  { id: 'en-us-female-1', name: 'Emma (US)', language: 'English', gender: 'female', accent: 'US' },
  { id: 'en-us-male-1', name: 'James (US)', language: 'English', gender: 'male', accent: 'US' },
  { id: 'en-uk-female-1', name: 'Olivia (UK)', language: 'English', gender: 'female', accent: 'UK' },
  { id: 'en-uk-male-1', name: 'Oliver (UK)', language: 'English', gender: 'male', accent: 'UK' },
  { id: 'en-au-female-1', name: 'Sophie (AU)', language: 'English', gender: 'female', accent: 'Australian' },
  { id: 'en-au-male-1', name: 'Jack (AU)', language: 'English', gender: 'male', accent: 'Australian' },

  // Chinese voices
  { id: 'zh-cn-female-1', name: '小美 (Xiaomei)', language: 'Chinese', gender: 'female', accent: 'Mandarin' },
  { id: 'zh-cn-male-1', name: '小明 (Xiaoming)', language: 'Chinese', gender: 'male', accent: 'Mandarin' },
  { id: 'zh-tw-female-1', name: '雅婷 (Yating)', language: 'Chinese', gender: 'female', accent: 'Taiwanese' },

  // Spanish voices
  { id: 'es-es-female-1', name: 'Maria (ES)', language: 'Spanish', gender: 'female', accent: 'Spain' },
  { id: 'es-mx-male-1', name: 'Carlos (MX)', language: 'Spanish', gender: 'male', accent: 'Mexican' },

  // French voices
  { id: 'fr-fr-female-1', name: 'Amélie (FR)', language: 'French', gender: 'female', accent: 'French' },
  { id: 'fr-fr-male-1', name: 'Pierre (FR)', language: 'French', gender: 'male', accent: 'French' },

  // German voices
  { id: 'de-de-female-1', name: 'Anna (DE)', language: 'German', gender: 'female', accent: 'German' },
  { id: 'de-de-male-1', name: 'Hans (DE)', language: 'German', gender: 'male', accent: 'German' },

  // Japanese voices
  { id: 'ja-jp-female-1', name: 'さくら (Sakura)', language: 'Japanese', gender: 'female', accent: 'Japanese' },
  { id: 'ja-jp-male-1', name: 'たかし (Takashi)', language: 'Japanese', gender: 'male', accent: 'Japanese' },

  // Korean voices
  { id: 'ko-kr-female-1', name: '지현 (Jihyun)', language: 'Korean', gender: 'female', accent: 'Korean' },
  { id: 'ko-kr-male-1', name: '민준 (Minjun)', language: 'Korean', gender: 'male', accent: 'Korean' }
];

export const getVoices = async (filters?: {
  language?: string;
  gender?: 'male' | 'female';
  accent?: string;
}): Promise<Voice[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  if (!filters) return VOICE_LIBRARY;

  return VOICE_LIBRARY.filter(voice => {
    if (filters.language && voice.language !== filters.language) return false;
    if (filters.gender && voice.gender !== filters.gender) return false;
    if (filters.accent && voice.accent !== filters.accent) return false;
    return true;
  });
};

export const getVoiceById = (id: string): Voice | undefined => {
  return VOICE_LIBRARY.find(voice => voice.id === id);
};

export const generateSpeech = async (text: string, voiceId: string): Promise<string> => {
  // In production, this would use Google Cloud Text-to-Speech API
  // For now, we'll return a mock audio URL

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock: Return a data URL or blob URL
  // In reality, you'd call the TTS API here
  return `data:audio/mp3;base64,mock-audio-${voiceId}`;
};

export const previewVoice = async (voiceId: string): Promise<string> => {
  const sampleText = "Hello! This is a preview of my voice. I'm excited to help bring your content to life.";
  return generateSpeech(sampleText, voiceId);
};

// Generate avatar video using Veo
export const generateAvatarVideo = async (
  avatarImageUrl: string,
  audioScript: string,
  voiceId: string
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    // Generate the speech audio first
    const audioUrl = await generateSpeech(audioScript, voiceId);

    // Use Veo to generate avatar talking video
    const prompt = `A professional presenter speaking to camera, medium shot, well-lit studio background, making natural hand gestures while speaking. The person should appear engaged and enthusiastic. High quality, 4K, cinematic lighting.`;

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Avatar video generation failed");
    }

    return `${videoUri}&key=${apiKey}`;

  } catch (error) {
    console.error("Avatar video generation error:", error);
    throw error;
  }
};
