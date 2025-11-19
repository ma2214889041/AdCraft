import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Sparkles, Video, Image as ImageIcon, User, Film, Layers, Scissors, Plus, Folder, TrendingUp, Split, Activity, Zap, DollarSign, CheckCircle } from 'lucide-react';
import { getPerformanceStats, type PerformanceStats } from '../services/performanceMonitor';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPerformanceStats(24); // Last 24 hours
        setStats(data);
      } catch (error) {
        console.error('Failed to load performance stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const tools = [
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
      id: 'batch',
      title: 'Batch Mode',
      desc: 'Create up to 50 video variations instantly for quick A/B testing',
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-400/10'
    },
    {
      id: 'editor',
      title: 'Video Editor',
      desc: 'Edit and polish your videos with our timeline editor',
      icon: Scissors,
      color: 'text-pink-400',
      bgColor: 'bg-pink-400/10'
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing',
      desc: 'Test and optimize your ad creatives for better performance',
      icon: Split,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
  ];

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-10 pb-20">

      {/* Top Banners */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Banner 1: Aurora Avatar */}
        <div onClick={() => onNavigate('avatar-video')} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4f46e5] to-[#9333ea] p-8 flex flex-col justify-center min-h-[280px] shadow-2xl group cursor-pointer hover:brightness-110 transition-all">
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
                <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover mask-linear-fade" style={{maskImage: 'linear-gradient(to right, transparent, black)'}} alt="" />
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
                <img src="https://images.unsplash.com/photo-1600603405959-6a6150e3abc8?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" style={{maskImage: 'linear-gradient(to right, transparent, black)'}} alt="" />
            </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {!loading && stats && stats.totalMetrics > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            性能统计 (过去24小时)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Image Optimizations */}
            <div className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">图片优化</p>
                  <p className="text-2xl font-bold text-white">{stats.imageOptimizations.count}</p>
                </div>
              </div>
              {stats.imageOptimizations.count > 0 && (
                <div className="space-y-1 text-xs text-slate-400">
                  <p>压缩率: {(stats.imageOptimizations.averageCompressionRatio * 100).toFixed(1)}%</p>
                  <p>节省: {(stats.imageOptimizations.totalSavings / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
            </div>

            {/* Cache Efficiency */}
            <div className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">缓存命中率</p>
                  <p className="text-2xl font-bold text-white">{stats.cache.hitRate.toFixed(1)}%</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-400">
                <p>命中: {stats.cache.hits} | 未命中: {stats.cache.misses}</p>
              </div>
            </div>

            {/* Cost Savings */}
            <div className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">成本节省</p>
                  <p className="text-2xl font-bold text-white">${stats.cache.costSaved.toFixed(3)}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-slate-400">
                <p>总消耗: ${stats.apiCalls.totalCost.toFixed(3)}</p>
              </div>
            </div>

            {/* Video Generation */}
            <div className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">视频生成</p>
                  <p className="text-2xl font-bold text-white">{stats.videoGeneration.count}</p>
                </div>
              </div>
              {stats.videoGeneration.count > 0 && (
                <div className="space-y-1 text-xs text-slate-400">
                  <p>成功率: {stats.videoGeneration.successRate.toFixed(1)}%</p>
                  <p>平均时长: {stats.videoGeneration.averageDuration.toFixed(1)}s</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popular Tools */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Popular tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tools.map((tool) => (
                <div
                    key={tool.id}
                    onClick={() => onNavigate(tool.id)}
                    className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer group flex gap-5 items-start"
                >
                    <div className={`w-12 h-12 rounded-xl ${tool.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{tool.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Additional Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => onNavigate('projects')} className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Folder className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">My Projects</h3>
                    <p className="text-slate-400 text-sm">View and manage all your projects</p>
                </div>
          </div>
          <div onClick={() => onNavigate('admax')} className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">AdMax Library</h3>
                    <p className="text-slate-400 text-sm">Get inspired by trending ads</p>
                </div>
          </div>
          <div onClick={() => onNavigate('ab-testing')} className="bg-[#1a1f2e] border border-white/5 rounded-2xl p-6 hover:bg-[#252b3b] transition-all cursor-pointer flex gap-5 items-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Split className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">A/B Testing</h3>
                    <p className="text-slate-400 text-sm">Optimize your ad performance</p>
                </div>
          </div>
      </div>

    </div>
  );
};
