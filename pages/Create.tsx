import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/Button';
import { generateScript, generateVeoVideo, checkApiKey } from '../services/geminiService';
import { VideoScript, GenerationStatus } from '../types';
import { RefreshCw, Film, CheckCircle, AlertCircle, Wand2, ArrowLeft } from 'lucide-react';

interface CreateProps {
    initialInput?: string;
}

export const Create: React.FC<CreateProps> = ({ initialInput = '' }) => {
  const [productInput, setProductInput] = useState(initialInput);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [generatedVideoUri, setGeneratedVideoUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-trigger generation if initial input is substantial (optional UX, here we just fill it)
  useEffect(() => {
      if (initialInput) setProductInput(initialInput);
  }, [initialInput]);

  const handleGenerateScript = async () => {
    if (!productInput.trim()) return;
    
    setStatus(GenerationStatus.GENERATING_SCRIPT);
    setError(null);
    
    try {
      const result = await generateScript(productInput);
      setScript(result);
      setStatus(GenerationStatus.SCRIPT_READY);
    } catch (err) {
      console.error(err);
      setError("Failed to generate script. Please check your API Key or try again.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  const handleGenerateVideo = async () => {
    if (!script) return;

    try {
        if (!checkApiKey()) {
            throw new Error('API key not configured. Please check your .env file.');
        }

        setStatus(GenerationStatus.GENERATING_VIDEO);
        setError(null);
        
        // For this demo, we will take the first visual description from the script to generate a scene
        const prompt = `Cinematic shot, ${script.segments[0].visual}. High resolution, photorealistic, 4k.`;
        
        const videoUri = await generateVeoVideo(prompt);
        setGeneratedVideoUri(videoUri);
        setStatus(GenerationStatus.COMPLETED);

    } catch (err) {
        console.error(err);
        setError("Failed to generate video with Veo. Ensure you have selected a valid project/key with access.");
        setStatus(GenerationStatus.ERROR); 
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pb-20">
      
      {/* Stepper / Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Wand2 className="text-primary w-6 h-6" />
            Video Creator Studio
        </h1>
        <p className="text-slate-400 text-sm">Step 1: Scripting &rarr; Step 2: Visuals &rarr; Step 3: Render</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`bg-surface border border-white/10 rounded-xl p-5 transition-all ${status !== GenerationStatus.IDLE && status !== GenerationStatus.SCRIPT_READY && status !== GenerationStatus.ERROR ? 'opacity-50 pointer-events-none' : ''}`}>
                <label className="block text-sm font-bold text-white mb-3">
                Product URL / Description
                </label>
                <textarea 
                value={productInput}
                onChange={(e) => setProductInput(e.target.value)}
                placeholder="Paste an Amazon URL or describe your product..."
                className="w-full bg-darker border border-white/10 rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:ring-1 focus:ring-primary focus:border-primary h-40 resize-none mb-4"
                />
                <Button 
                    onClick={handleGenerateScript} 
                    disabled={!productInput.trim()}
                    isLoading={status === GenerationStatus.GENERATING_SCRIPT}
                    className="w-full"
                >
                    Generate Script
                </Button>
            </div>

            {status === GenerationStatus.GENERATING_VIDEO && (
                <div className="p-5 bg-surface border border-white/10 rounded-xl text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h3 className="text-white font-bold mb-1">Rendering Video</h3>
                    <p className="text-xs text-slate-400">Generating pixels with Google Veo...<br/>This may take a minute.</p>
                </div>
            )}
          </div>

          {/* Right Column: Preview & Results */}
          <div className="lg:col-span-2">
             {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6 flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {/* Empty State */}
            {!script && !error && status === GenerationStatus.IDLE && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-slate-500">
                    <Film className="w-12 h-12 mb-4 opacity-20" />
                    <p>Content will appear here</p>
                </div>
            )}

            {script && (
                <div className="animate-fade-in space-y-6">
                    {/* Script Editor Card */}
                    <div className="bg-surface border border-white/10 rounded-xl overflow-hidden">
                        <div className="p-4 border-b border-white/10 bg-darker flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm">Generated Script</h3>
                            <div className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded">
                                {script.tone} • {script.targetAudience}
                            </div>
                        </div>
                        <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {script.segments.map((segment, idx) => (
                                <div key={idx} className="p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex gap-4">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Visual</p>
                                                <p className="text-sm text-slate-300">{segment.visual}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-bold uppercase">Audio</p>
                                                <p className="text-sm text-white italic border-l-2 border-primary/50 pl-3">"{segment.audio}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-darker border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs text-slate-500">Ready to render?</span>
                            <Button 
                                size="sm"
                                onClick={handleGenerateVideo}
                                disabled={status === GenerationStatus.GENERATING_VIDEO}
                                className="bg-gradient-to-r from-pink-500 to-rose-500"
                            >
                                <Film className="w-4 h-4 mr-2" />
                                Render Video Scene (Veo)
                            </Button>
                        </div>
                    </div>

                    {/* Video Result */}
                    {generatedVideoUri && (
                        <div className="bg-black rounded-xl border border-primary/30 shadow-2xl overflow-hidden animate-fade-in">
                             <video 
                                ref={videoRef}
                                src={generatedVideoUri} 
                                controls 
                                className="w-full aspect-video object-contain"
                                autoPlay
                                loop
                            />
                            <div className="p-3 bg-surface flex justify-between items-center">
                                <span className="text-sm text-green-400 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Generation Complete
                                </span>
                                <Button variant="ghost" size="sm" onClick={() => window.open(generatedVideoUri, '_blank')}>
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
          </div>
      </div>
    </div>
  );
};