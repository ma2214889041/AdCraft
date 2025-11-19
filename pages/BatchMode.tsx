import React, { useState } from 'react';
import { Button } from '../components/Button';
import { BatchJob, GenerationStatus } from '../types';
import { Layers, Plus, Trash2, Download, Play, CheckCircle, Loader2, Copy, Grid3x3 } from 'lucide-react';

interface BatchVariant {
  id: string;
  name: string;
  scriptVariation: string;
  imageUrl?: string;
  avatarId?: string;
  voiceId?: string;
}

export const BatchMode: React.FC = () => {
  const [batchName, setBatchName] = useState('My Batch Campaign');
  const [baseScript, setBaseScript] = useState('');
  const [variants, setVariants] = useState<BatchVariant[]>([
    { id: '1', name: 'Variant A', scriptVariation: '' },
    { id: '2', name: 'Variant B', scriptVariation: '' },
    { id: '3', name: 'Variant C', scriptVariation: '' }
  ]);
  const [variantCount, setVariantCount] = useState(3);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [progress, setProgress] = useState(0);
  const [generatedResults, setGeneratedResults] = useState<string[]>([]);

  const addVariant = () => {
    const newId = (variants.length + 1).toString();
    setVariants([...variants, {
      id: newId,
      name: `Variant ${String.fromCharCode(65 + variants.length)}`,
      scriptVariation: ''
    }]);
    setVariantCount(variants.length + 1);
  };

  const removeVariant = (id: string) => {
    if (variants.length <= 1) return;
    setVariants(variants.filter(v => v.id !== id));
    setVariantCount(variants.length - 1);
  };

  const updateVariant = (id: string, field: keyof BatchVariant, value: string) => {
    setVariants(variants.map(v =>
      v.id === id ? { ...v, [field]: value } : v
    ));
  };

  const autoGenerateVariations = () => {
    // Auto-generate script variations based on the base script
    const variations = [
      baseScript,
      baseScript + ' Limited time offer!',
      baseScript + ' Shop now and save big!',
      baseScript + ' Don\'t miss out!',
      baseScript + ' Perfect for you!'
    ];

    setVariants(variants.map((v, idx) => ({
      ...v,
      scriptVariation: variations[idx] || baseScript
    })));
  };

  const handleGenerate = async () => {
    setStatus(GenerationStatus.GENERATING_VIDEO);
    setProgress(0);
    setGeneratedResults([]);

    // Simulate batch generation
    for (let i = 0; i < variants.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProgress(((i + 1) / variants.length) * 100);

      // Mock generated video URLs
      setGeneratedResults(prev => [
        ...prev,
        `https://storage.googleapis.com/mock-video-${i}.mp4`
      ]);
    }

    setStatus(GenerationStatus.COMPLETED);
  };

  const handleDownloadAll = () => {
    console.log('Downloading all results...');
    // In production, zip and download all generated videos
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Layers className="w-8 h-8 text-brand-purple" />
          Batch Mode
        </h1>
        <p className="text-slate-400">Generate up to 50 ad variations instantly for A/B testing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Batch Settings */}
          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Batch Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-brand-purple outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Base Script</label>
                <textarea
                  value={baseScript}
                  onChange={(e) => setBaseScript(e.target.value)}
                  placeholder="Enter your base script that will be varied..."
                  className="w-full h-32 bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-slate-500 focus:border-brand-purple outline-none resize-none"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={autoGenerateVariations}
                  className="mt-2"
                  disabled={!baseScript.trim()}
                >
                  Auto-Generate Variations
                </Button>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Number of Variants ({variantCount})
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={variantCount}
                  onChange={(e) => {
                    const count = parseInt(e.target.value);
                    setVariantCount(count);
                    // Adjust variants array
                    const diff = count - variants.length;
                    if (diff > 0) {
                      const newVariants = Array.from({ length: diff }, (_, i) => ({
                        id: (variants.length + i + 1).toString(),
                        name: `Variant ${String.fromCharCode(65 + variants.length + i)}`,
                        scriptVariation: ''
                      }));
                      setVariants([...variants, ...newVariants]);
                    } else if (diff < 0) {
                      setVariants(variants.slice(0, count));
                    }
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Variants Configuration */}
          <div className="bg-surface border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Variants</h2>
              <Button size="sm" onClick={addVariant} disabled={variants.length >= 50}>
                <Plus className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {variants.map((variant, idx) => (
                <div key={variant.id} className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </div>

                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-brand-purple outline-none"
                        placeholder="Variant name..."
                      />

                      <textarea
                        value={variant.scriptVariation}
                        onChange={(e) => updateVariant(variant.id, 'scriptVariation', e.target.value)}
                        className="w-full h-20 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm placeholder-slate-500 focus:border-brand-purple outline-none resize-none"
                        placeholder="Script variation..."
                      />
                    </div>

                    {variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={status === GenerationStatus.GENERATING_VIDEO || variants.some(v => !v.scriptVariation.trim())}
            isLoading={status === GenerationStatus.GENERATING_VIDEO}
            className="w-full h-14 text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Generate {variants.length} Variants
          </Button>

          {/* Progress */}
          {status === GenerationStatus.GENERATING_VIDEO && (
            <div className="bg-surface border border-white/10 rounded-xl p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-bold">Generating...</span>
                <span className="text-brand-purple font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-purple to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 mt-2">
                Generating {generatedResults.length + 1} of {variants.length}
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Results</h3>
              {generatedResults.length > 0 && (
                <Button size="sm" onClick={handleDownloadAll}>
                  <Download className="w-4 h-4 mr-2" />
                  All
                </Button>
              )}
            </div>

            {generatedResults.length === 0 ? (
              <div className="text-center py-20">
                <Grid3x3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500">Results will appear here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {generatedResults.map((url, idx) => (
                  <div key={idx} className="bg-surface border border-white/10 rounded-xl p-3 flex items-center gap-3 group hover:border-brand-purple/50 transition-all">
                    <div className="w-12 h-12 bg-black/30 rounded-lg flex items-center justify-center text-brand-purple font-bold">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{variants[idx]?.name}</p>
                      <p className="text-xs text-slate-400">Ready</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {generatedResults.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Variants:</span>
                  <span className="text-white font-bold">{generatedResults.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Cost:</span>
                  <span className="text-green-400 font-bold">${(generatedResults.length * 0.5).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
