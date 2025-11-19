import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Scissors, Plus, Trash2, Type, Music, Image as ImageIcon, Video, Download, Play, Volume2, Layers } from 'lucide-react';

interface TimelineClip {
  id: string;
  type: 'video' | 'image' | 'text' | 'audio';
  startTime: number;
  duration: number;
  content: string;
  layer: number;
}

export const Editor: React.FC = () => {
  const [clips, setClips] = useState<TimelineClip[]>([
    { id: '1', type: 'video', startTime: 0, duration: 5, content: 'Main Video', layer: 0 },
    { id: '2', type: 'text', startTime: 1, duration: 3, content: 'Title Text', layer: 1 },
    { id: '3', type: 'audio', startTime: 0, duration: 5, content: 'Background Music', layer: 2 }
  ]);

  const [selectedClip, setSelectedClip] = useState<TimelineClip | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(50);

  const totalDuration = Math.max(...clips.map(c => c.startTime + c.duration), 10);
  const pixelsPerSecond = zoom;

  const addClip = (type: TimelineClip['type']) => {
    const newClip: TimelineClip = {
      id: Date.now().toString(),
      type,
      startTime: currentTime,
      duration: 2,
      content: `New ${type}`,
      layer: clips.filter(c => c.type === type).length
    };
    setClips([...clips, newClip]);
  };

  const deleteClip = (id: string) => {
    setClips(clips.filter(c => c.id !== id));
    if (selectedClip?.id === id) setSelectedClip(null);
  };

  const updateClip = (id: string, updates: Partial<TimelineClip>) => {
    setClips(clips.map(c => c.id === id ? { ...c, ...updates } : c));
    if (selectedClip?.id === id) {
      setSelectedClip({ ...selectedClip, ...updates });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-brand-dark overflow-hidden">
      {/* Top Bar */}
      <div className="h-16 bg-surface border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Scissors className="w-6 h-6 text-brand-purple" />
            Video Editor
          </h1>
          <div className="h-6 w-px bg-white/10" />
          <span className="text-sm text-slate-400">Untitled Project</span>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-surface border-r border-white/10 p-4 space-y-3 overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Add to Timeline</h3>

          <button
            onClick={() => addClip('video')}
            className="w-full flex items-center gap-3 p-3 bg-black/30 hover:bg-white/5 border border-white/10 rounded-lg text-white transition-all"
          >
            <Video className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Video Clip</span>
          </button>

          <button
            onClick={() => addClip('image')}
            className="w-full flex items-center gap-3 p-3 bg-black/30 hover:bg-white/5 border border-white/10 rounded-lg text-white transition-all"
          >
            <ImageIcon className="w-5 h-5 text-green-400" />
            <span className="font-medium">Image</span>
          </button>

          <button
            onClick={() => addClip('text')}
            className="w-full flex items-center gap-3 p-3 bg-black/30 hover:bg-white/5 border border-white/10 rounded-lg text-white transition-all"
          >
            <Type className="w-5 h-5 text-purple-400" />
            <span className="font-medium">Text Overlay</span>
          </button>

          <button
            onClick={() => addClip('audio')}
            className="w-full flex items-center gap-3 p-3 bg-black/30 hover:bg-white/5 border border-white/10 rounded-lg text-white transition-all"
          >
            <Music className="w-5 h-5 text-pink-400" />
            <span className="font-medium">Audio Track</span>
          </button>

          {/* Clip Properties */}
          {selectedClip && (
            <div className="pt-6 border-t border-white/10 mt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Properties</h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Content</label>
                  <input
                    type="text"
                    value={selectedClip.content}
                    onChange={(e) => updateClip(selectedClip.id, { content: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-purple outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Duration (s)</label>
                  <input
                    type="number"
                    value={selectedClip.duration}
                    onChange={(e) => updateClip(selectedClip.id, { duration: parseFloat(e.target.value) })}
                    className="w-full bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-purple outline-none"
                    step="0.1"
                    min="0.1"
                  />
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteClip(selectedClip.id)}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Clip
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-black/30 p-6">
            <div className="aspect-video w-full max-w-4xl bg-black rounded-lg shadow-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <p className="text-slate-500">Preview</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-surface border-t border-white/10 flex flex-col">
            {/* Timeline Controls */}
            <div className="h-12 border-b border-white/10 flex items-center justify-between px-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 bg-brand-purple rounded-full flex items-center justify-center hover:bg-brand-purple/80 transition-colors"
                >
                  {isPlaying ? <Music className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
                </button>

                <span className="text-sm text-white font-mono">
                  {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Zoom:</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value))}
                  className="w-32"
                />
              </div>
            </div>

            {/* Timeline Tracks */}
            <div className="flex-1 overflow-auto relative">
              {/* Time Ruler */}
              <div className="h-8 bg-black/30 border-b border-white/10 sticky top-0 z-10 flex items-center pl-32">
                {Array.from({ length: Math.ceil(totalDuration) }).map((_, i) => (
                  <div
                    key={i}
                    className="relative text-xs text-slate-500"
                    style={{ width: `${pixelsPerSecond}px` }}
                  >
                    <span className="absolute left-0">{i}s</span>
                  </div>
                ))}
              </div>

              {/* Tracks */}
              <div className="space-y-2 p-2 pl-0">
                {['video', 'text', 'audio'].map((trackType, trackIdx) => {
                  const trackClips = clips.filter(c => c.type === trackType);

                  return (
                    <div key={trackType} className="flex items-center gap-2 h-16">
                      {/* Track Label */}
                      <div className="w-32 h-full bg-black/30 rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                        <span className="text-xs font-bold text-slate-400 uppercase">{trackType}</span>
                      </div>

                      {/* Track Content */}
                      <div className="flex-1 h-full bg-black/20 rounded-lg border border-white/10 relative">
                        {trackClips.map(clip => (
                          <div
                            key={clip.id}
                            onClick={() => setSelectedClip(clip)}
                            className={`absolute top-1 h-[calc(100%-8px)] rounded border-2 cursor-pointer transition-all ${
                              selectedClip?.id === clip.id
                                ? 'border-brand-purple bg-brand-purple/30 z-10'
                                : 'border-white/30 bg-white/10 hover:border-white/50'
                            }`}
                            style={{
                              left: `${clip.startTime * pixelsPerSecond}px`,
                              width: `${clip.duration * pixelsPerSecond}px`
                            }}
                          >
                            <div className="px-2 py-1 text-xs font-medium text-white truncate">
                              {clip.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Playhead */}
              <div
                className="absolute top-8 bottom-0 w-0.5 bg-red-500 pointer-events-none z-20"
                style={{ left: `${currentTime * pixelsPerSecond + 128}px` }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
