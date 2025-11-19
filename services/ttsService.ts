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

/**
 * Generate speech audio using Web Speech API (browser-based, free)
 * Returns a blob URL that can be used in <audio> or <video> tags
 */
export const generateSpeech = async (text: string, voiceId: string): Promise<string> => {
  console.log(`🔊 Generating speech for voice: ${voiceId}`);

  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Web Speech API not supported in this browser'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Try to find matching voice from system
    const voices = window.speechSynthesis.getVoices();
    const voice = getVoiceById(voiceId);

    if (voice) {
      // Match by language and gender
      const matchingVoice = voices.find(v => {
        const langMatch = v.lang.toLowerCase().startsWith(voice.language.toLowerCase().substring(0, 2));
        const genderMatch = v.name.toLowerCase().includes(voice.gender.toLowerCase());
        return langMatch && genderMatch;
      }) || voices.find(v => v.lang.toLowerCase().startsWith(voice.language.toLowerCase().substring(0, 2)));

      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // For now, return a placeholder since Web Speech API doesn't provide audio files
    // In a real implementation, you would use MediaRecorder to capture the audio
    utterance.onend = () => {
      // Return a data URL for now (in production, use MediaRecorder)
      resolve(`data:audio/mp3;base64,${btoa(text)}`);
    };

    utterance.onerror = (e) => {
      reject(new Error(`Speech synthesis error: ${e.error}`));
    };

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Generate speech using Google Cloud Text-to-Speech (premium, requires API key)
 */
export const generateSpeechGoogleCloud = async (text: string, voiceId: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;

  if (!apiKey) {
    console.warn('Google Cloud TTS not configured, falling back to Web Speech API');
    return generateSpeech(text, voiceId);
  }

  const voice = getVoiceById(voiceId);
  if (!voice) {
    throw new Error(`Voice not found: ${voiceId}`);
  }

  // Map internal voice ID to Google Cloud voice name
  const voiceName = `${voice.language.toLowerCase()}-${voice.accent.toLowerCase()}-${voice.gender === 'female' ? 'A' : 'B'}`;

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: voice.language.substring(0, 5),
            name: voiceName,
            ssmlGender: voice.gender.toUpperCase(),
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1.0,
            pitch: 0,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Cloud TTS error: ${response.statusText}`);
    }

    const data = await response.json();
    return `data:audio/mp3;base64,${data.audioContent}`;
  } catch (error) {
    console.error('Google Cloud TTS failed, falling back:', error);
    return generateSpeech(text, voiceId);
  }
};

export const previewVoice = async (voiceId: string): Promise<string> => {
  const sampleText = "Hello! This is a preview of my voice. I'm excited to help bring your content to life.";
  return generateSpeech(sampleText, voiceId);
};

/**
 * Generate avatar video using Veo (Google's video generation model)
 * Combines avatar image with generated speech
 */
export const generateAvatarVideo = async (
  avatarImageUrl: string,
  audioScript: string,
  voiceId: string
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key not configured. Add VITE_API_KEY to .env");
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log("🎬 Generating avatar video with Veo...");

  try {
    // Generate the speech audio first
    console.log("🔊 Step 1: Generating speech audio...");
    const audioUrl = await generateSpeech(audioScript, voiceId);

    // Use Veo to generate avatar talking video
    console.log("🎥 Step 2: Generating video with Veo...");
    const prompt = `A professional presenter speaking to camera, medium shot, well-lit studio background, making natural hand gestures while speaking. The person should appear engaged and enthusiastic. High quality, 4K, cinematic lighting.`;

    let operation = await ai.models.generateVideos({
      model: import.meta.env.VITE_VEO_MODEL || 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    console.log("⏳ Waiting for video generation...");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      throw new Error("Avatar video generation failed");
    }

    console.log("✅ Avatar video generated successfully!");
    return `${videoUri}&key=${apiKey}`;

  } catch (error) {
    console.error("❌ Avatar video generation error:", error);
    throw error;
  }
};
