import React from 'react';
import { Button } from '../components/Button';
import { Sparkles, Video, Image as ImageIcon, Box, User, Film, Layers, Scissors, Wand2, Plus } from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  
  const tools = [
    { 
      id: 'asset-gen', 
      title: 'Asset Generator', 
      desc: 'Create any video or image with any AI model', 
      icon: Box, 
      color: 'text-blue-400', 
      bgColor: 'bg-blue-400/10',
      badge: 'Sora 2' 
    },
    { 
      id: 'avatar-video', 
      title: 'Avatar Video', 
      desc: 'Turn a script into a talking avatar video', 
      icon: User, 
      color: 'text-green-400', 
      bgColor: 'bg-green-400/10' 
    },
    { 
      id: 'create', // Maps to Video Creator
      title: 'Product Video', 
      desc: 'Turn a product image into stunning product videos', 
      icon: Video, 
      color: 'text-orange-400', 
      bgColor: 'bg-orange-400/10' 
    },
    { 
      id: 'image-ads', // Maps to Image Ads
      title: 'Image Ads', 
      desc: 'Turn any product image into ready-to-use static ads instantly', 
      icon: ImageIcon, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-500/10' 
    },
    { 
      id: 'shorts', 
      title: 'AI Shorts', 
      desc: 'Turn a script into artistic, animated video ads', 
      icon: Film, 
      color: 'text-purple-400', 
      bgColor: 'bg-purple-400/10' 
    },
    { 
      id: 'batch', 
      title: 'Batch Mode', 
      desc: 'Create up to 50 video variations instantly for quick A/B testing', 
      icon: Layers, 
      color: 'text-indigo-400', 
      bgColor: 'bg-indigo-400/10' 
    },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-10 pb-20">
      
      {/* Top Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1: Aurora Avatar */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4f46e5] to-[#9333ea] p-8 flex flex-col justify-center min-h-[280px] shadow-2xl group cursor-pointer hover:brightness-110 transition-all">
            <div className="relative z-10 max-w-md">
                <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-3xl font-bold text-white">Aurora Avatar</h2>
                    <span className="text-xl">🔥</span>
                </div>
                <p className="text-indigo-100 mb-8 text-lg">Create ultra-realistic avatar videos with a single image</p>
                <button className="bg-black/30 hover:bg-black/50 backdrop-blur text-white font-bold py-3 px-6 rounded-lg border border-white/10 flex items-center gap-2 transition-all">
                    <Sparkles className="w-4 h-4" /> CREATE NOW
                </button>
            </div>
            {/* Decorative Image */}
            <div className="absolute right-0 bottom-0 h-[110%] w-1/2 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover mask-linear-fade" style={{maskImage: 'linear-gradient(to right, transparent, black)'}} />
            </div>
        </div>

        {/* Banner 2: AI Video Ads */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#f97316] via-[#ec4899] to-[#8b5cf6] p-8 flex flex-col justify-center min-h-[280px] shadow-2xl group cursor-pointer hover:brightness-110 transition-all" onClick={() => onNavigate('create')}>
            <div className="relative z-10 max-w-md">
                <h2 className="text-3xl font-bold text-white mb-2">AI Video Ads</h2>
                <p className="text-orange-50 mb-8 text-lg">Turn a product URL, assets, or scripts into video ads</p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur text-white font-bold py-3 px-6 rounded-lg border border-white/20 flex items-center gap-2 transition-all">
                    <Video className="w-4 h-4" /> CREATE NOW
                </button>
            </div>
            {/* Decorative Image */}
             <div className="absolute right-0 bottom-0 h-[110%] w-1/2 pointer-events-none">
                <img src="https://images.unsplash.com/photo-1600603405959-6a6150e3abc8?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" style={{maskImage: 'linear-gradient(to right, transparent, black)'}} />
            </div>
        </div>
      </div>

      {/* Popular Tools */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Popular tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool) => (
                <div 
                    key={tool.id}
                    onClick={() => tool.id !== 'asset-gen' && tool.id !== 'shorts' && tool.id !== 'batch' ? onNavigate(tool.id) : null}
                    className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer group flex gap-5 items-start"
                >
                    <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                            {tool.badge && (
                                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-yellow-500/20">
                                    {tool.badge}
                                </span>
                            )}
                            {tool.id === 'asset-gen' && <span className="text-lg">🔥</span>}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Video Editor</h3>
                    <p className="text-slate-400 text-sm">All-in-one video editing tool</p>
                </div>
          </div>
          <div className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Create Your Own Avatar</h3>
                    <p className="text-slate-400 text-sm">Build a branded AI avatar in seconds</p>
                </div>
          </div>
      </div>

    </div>
  );
};