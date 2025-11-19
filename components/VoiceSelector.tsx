import React, { useState, useEffect } from 'react';
import { Voice } from '../types';
import { getVoices, previewVoice } from '../services/ttsService';
import { Volume2, Play, Pause, CheckCircle2, Loader2 } from 'lucide-react';

interface VoiceSelectorProps {
  selected?: Voice;
  onSelect: (voice: Voice) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selected, onSelect }) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    loadVoices();
  }, [languageFilter, genderFilter]);

  const loadVoices = async () => {
    setLoading(true);
    const filters: any = {};
    if (languageFilter !== 'all') filters.language = languageFilter;
    if (genderFilter !== 'all') filters.gender = genderFilter;

    const data = await getVoices(filters);
    setVoices(data);
    setLoading(false);
  };

  const handlePreview = async (voiceId: string) => {
    if (playingId === voiceId) {
      setPlayingId(null);
      return;
    }

    setPlayingId(voiceId);
    try {
      await previewVoice(voiceId);
      // In production, play the audio
      setTimeout(() => setPlayingId(null), 3000);
    } catch (error) {
      console.error('Preview failed:', error);
      setPlayingId(null);
    }
  };

  const languages = Array.from(new Set(voices.map(v => v.language)));

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm">
          <Volume2 className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Language:</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setLanguageFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              languageFilter === 'all'
                ? 'bg-brand-purple text-white'
                : 'bg-surface text-slate-400 hover:bg-white/5'
            }`}
          >
            All Languages
          </button>
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setLanguageFilter(lang)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                languageFilter === lang
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-white/10"></div>

        <div className="flex gap-2">
          {(['all', 'male', 'female'] as const).map(gender => (
            <button
              key={gender}
              onClick={() => setGenderFilter(gender)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                genderFilter === gender
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {gender === 'all' ? 'All' : gender.charAt(0).toUpperCase() + gender.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Voice List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {voices.map(voice => (
            <div
              key={voice.id}
              onClick={() => onSelect(voice)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                selected?.id === voice.id
                  ? 'border-brand-purple bg-brand-purple/10'
                  : 'border-white/10 hover:border-white/20 bg-surface'
              }`}
            >
              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(voice.id);
                }}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-purple flex items-center justify-center transition-colors"
              >
                {playingId === voice.id ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>

              {/* Voice Info */}
              <div className="flex-1">
                <h4 className="text-white font-bold">{voice.name}</h4>
                <p className="text-sm text-slate-400">
                  {voice.language} • {voice.accent}
                </p>
              </div>

              {/* Gender Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                voice.gender === 'male'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-pink-500/20 text-pink-400'
              }`}>
                {voice.gender === 'male' ? '♂' : '♀'} {voice.gender}
              </div>

              {/* Selected Indicator */}
              {selected?.id === voice.id && (
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Selected Info */}
      {selected && (
        <div className="mt-6 p-4 bg-gradient-to-r from-brand-purple/20 to-transparent border border-brand-purple/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 mb-1">Selected Voice</p>
              <h4 className="text-white font-bold">{selected.name}</h4>
              <p className="text-sm text-slate-300">{selected.language} ({selected.accent})</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
        </div>
      )}
    </div>
  );
};
