import React, { useState } from 'react';
import { Avatar, Voice, GenerationStatus } from '../types';
import { AvatarPicker } from '../components/AvatarPicker';
import { VoiceSelector } from '../components/VoiceSelector';
import { Button } from '../components/Button';
import { createCustomAvatar } from '../services/avatarService';
import { generateAvatarVideo } from '../services/ttsService';
import { User, Volume2, FileText, Wand2, Film, CheckCircle, Loader2, Download } from 'lucide-react';

export const AvatarVideo: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [script, setScript] = useState('');
  const [background, setBackground] = useState<'studio' | 'office' | 'outdoor' | 'custom'>('studio');
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'excited' | 'serious'>('neutral');

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleCustomAvatar = async (file: File) => {
    const customAvatar = await createCustomAvatar(file);
    setSelectedAvatar(customAvatar);
  };

  const handleGenerate = async () => {
    if (!selectedAvatar || !selectedVoice || !script.trim()) return;

    setStatus(GenerationStatus.GENERATING_VIDEO);

    try {
      const videoUrl = await generateAvatarVideo(
        selectedAvatar.thumbnail,
        script,
        selectedVoice.id
      );

      setGeneratedVideoUrl(videoUrl);
      setStatus(GenerationStatus.COMPLETED);
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus(GenerationStatus.ERROR);
    }
  };

  const canProceed = (stepNum: number) => {
    if (stepNum === 2) return selectedAvatar !== null;
    if (stepNum === 3) return selectedAvatar !== null && selectedVoice !== null;
    return true;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <User className="w-8 h-8 text-brand-purple" />
          AI Avatar Video Creator
        </h1>
        <p className="text-slate-400">Create professional avatar videos with AI-powered voices</p>
      </div>

      {/* Stepper */}
      <div className="mb-10 flex items-center justify-center gap-4">
        {[
          { num: 1, label: 'Choose Avatar', icon: User },
          { num: 2, label: 'Select Voice', icon: Volume2 },
          { num: 3, label: 'Write Script', icon: FileText }
        ].map(({ num, label, icon: Icon }, idx) => (
          <React.Fragment key={num}>
            <div
              onClick={() => canProceed(num) && setStep(num as 1 | 2 | 3)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all cursor-pointer ${
                step === num
                  ? 'bg-brand-purple text-white shadow-lg'
                  : step > num
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-surface text-slate-400 border border-white/10'
              } ${canProceed(num) ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === num ? 'bg-white/20' : step > num ? 'bg-green-500/30' : 'bg-white/5'
              }`}>
                {step > num ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className="font-bold">{label}</span>
            </div>
            {idx < 2 && <div className="h-0.5 w-12 bg-white/10"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-brand-purple" />
                Choose Your Avatar
              </h2>
              <AvatarPicker
                selected={selectedAvatar || undefined}
                onSelect={setSelectedAvatar}
                onUploadCustom={handleCustomAvatar}
              />
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedAvatar}
                  className="px-8"
                >
                  Next: Select Voice
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-brand-purple" />
                Select Voice
              </h2>
              <VoiceSelector
                selected={selectedVoice || undefined}
                onSelect={setSelectedVoice}
              />
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!selectedVoice}
                  className="px-8"
                >
                  Next: Write Script
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-surface border border-white/10 rounded-2xl p-6 animate-fade-in space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-purple" />
                Write Your Script
              </h2>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  Script Text
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder="Enter what you want your avatar to say..."
                  className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-slate-500 focus:border-brand-purple outline-none resize-none"
                  maxLength={1000}
                />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>Pro tip: Keep it natural and conversational</span>
                  <span>{script.length}/1000</span>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Background</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['studio', 'office', 'outdoor', 'custom'] as const).map(bg => (
                      <button
                        key={bg}
                        onClick={() => setBackground(bg)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          background === bg
                            ? 'border-brand-purple bg-brand-purple/10 text-white'
                            : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {bg.charAt(0).toUpperCase() + bg.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2">Emotion</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['neutral', 'happy', 'excited', 'serious'] as const).map(emo => (
                      <button
                        key={emo}
                        onClick={() => setEmotion(emo)}
                        className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                          emotion === emo
                            ? 'border-brand-purple bg-brand-purple/10 text-white'
                            : 'border-white/10 bg-black/20 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {emo.charAt(0).toUpperCase() + emo.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={!script.trim() || status === GenerationStatus.GENERATING_VIDEO}
                  isLoading={status === GenerationStatus.GENERATING_VIDEO}
                  className="px-8"
                >
                  <Film className="w-4 h-4 mr-2" />
                  Generate Avatar Video
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4">Preview</h3>

            {status === GenerationStatus.GENERATING_VIDEO ? (
              <div className="aspect-[9/16] bg-surface rounded-xl flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-brand-purple mb-4" />
                <p className="text-white font-medium">Generating video...</p>
                <p className="text-xs text-slate-400 mt-2">This may take 1-2 minutes</p>
              </div>
            ) : generatedVideoUrl ? (
              <div className="space-y-4 animate-fade-in">
                <div className="aspect-[9/16] bg-black rounded-xl overflow-hidden">
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => window.open(generatedVideoUrl, '_blank')}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setGeneratedVideoUrl(null);
                      setStatus(GenerationStatus.IDLE);
                    }}
                  >
                    New Video
                  </Button>
                </div>
              </div>
            ) : (
              <div className="aspect-[9/16] bg-surface rounded-xl flex flex-col items-center justify-center text-center p-6">
                {selectedAvatar ? (
                  <>
                    <img
                      src={selectedAvatar.thumbnail}
                      className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-white/10"
                      alt={selectedAvatar.name}
                    />
                    <p className="text-white font-bold">{selectedAvatar.name}</p>
                    {selectedVoice && (
                      <p className="text-sm text-slate-400 mt-2">
                        Voice: {selectedVoice.name}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <User className="w-16 h-16 text-slate-600 mb-4" />
                    <p className="text-slate-500">Select an avatar to preview</p>
                  </>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Avatar:</span>
                <span className="text-white font-medium">{selectedAvatar?.name || 'Not selected'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Voice:</span>
                <span className="text-white font-medium">{selectedVoice?.name || 'Not selected'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Script Length:</span>
                <span className="text-white font-medium">{script.length} chars</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
