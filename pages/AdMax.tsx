import React, { useState } from 'react';
import { TrendingAd } from '../types';
import { Button } from '../components/Button';
import { Sparkles, TrendingUp, Search, Filter, Play, Eye, Heart, Star, Copy, Bookmark } from 'lucide-react';

const MOCK_TRENDING_ADS: TrendingAd[] = [
  {
    id: '1',
    title: 'Ultimate Skincare Routine',
    thumbnail: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=600&fit=crop',
    category: 'Beauty',
    platform: 'TikTok',
    views: 2500000,
    engagement: 12.5,
    tags: ['skincare', 'beauty', 'ugc']
  },
  {
    id: '2',
    title: 'iPhone 15 Pro Unboxing',
    thumbnail: 'https://images.unsplash.com/photo-1592286927505-6242e55546a5?w=400&h=600&fit=crop',
    category: 'Tech',
    platform: 'YouTube',
    views: 1800000,
    engagement: 8.3,
    tags: ['tech', 'unboxing', 'apple']
  },
  {
    id: '3',
    title: 'Fitness Transformation',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=600&fit=crop',
    category: 'Fitness',
    platform: 'Instagram',
    views: 950000,
    engagement: 15.2,
    tags: ['fitness', 'transformation', 'motivation']
  },
  {
    id: '4',
    title: 'Quick Recipe Hack',
    thumbnail: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=600&fit=crop',
    category: 'Food',
    platform: 'TikTok',
    views: 3200000,
    engagement: 18.7,
    tags: ['food', 'recipe', 'cooking']
  },
  {
    id: '5',
    title: 'Gaming Setup Tour',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=600&fit=crop',
    category: 'Gaming',
    platform: 'YouTube',
    views: 1200000,
    engagement: 9.8,
    tags: ['gaming', 'setup', 'tech']
  },
  {
    id: '6',
    title: 'Fashion Haul 2024',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=600&fit=crop',
    category: 'Fashion',
    platform: 'Instagram',
    views: 780000,
    engagement: 11.4,
    tags: ['fashion', 'haul', 'style']
  }
];

export const AdMax: React.FC = () => {
  const [ads] = useState<TrendingAd[]>(MOCK_TRENDING_ADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [savedAds, setSavedAds] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(ads.map(ad => ad.category)));
  const platforms = Array.from(new Set(ads.map(ad => ad.platform)));

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || ad.category === categoryFilter;
    const matchesPlatform = platformFilter === 'all' || ad.platform === platformFilter;
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedAds);
    if (newSaved.has(id)) {
      newSaved.delete(id);
    } else {
      newSaved.add(id);
    }
    setSavedAds(newSaved);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-brand-purple" />
          AdMax - Trending Ads Library
        </h1>
        <p className="text-slate-400">Discover what's working in your industry and get inspired</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keyword, tag, or brand..."
            className="w-full pl-12 pr-4 py-3 bg-surface border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-brand-purple outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                categoryFilter === 'all'
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-purple text-white'
                    : 'bg-surface text-slate-400 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10" />

          {/* Platform Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                platformFilter === 'all'
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              All Platforms
            </button>
            {platforms.map(platform => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  platformFilter === platform
                    ? 'bg-brand-purple text-white'
                    : 'bg-surface text-slate-400 hover:bg-white/5'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Ads Grid */}
      {filteredAds.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-2xl">
          <Sparkles className="w-20 h-20 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No ads found</h3>
          <p className="text-slate-400">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map(ad => (
            <div key={ad.id} className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all group">
              {/* Thumbnail */}
              <div className="relative aspect-[9/16] overflow-hidden">
                <img
                  src={ad.thumbnail}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button size="sm">
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>

                {/* Platform Badge */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white px-2 py-1 rounded text-xs font-bold">
                  {ad.platform}
                </div>

                {/* Save Button */}
                <button
                  onClick={() => toggleSave(ad.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all ${
                    savedAds.has(ad.id)
                      ? 'bg-brand-purple text-white'
                      : 'bg-black/80 text-white hover:bg-brand-purple'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${savedAds.has(ad.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold flex-1 line-clamp-2">{ad.title}</h3>
                  <span className="px-2 py-1 bg-brand-purple/20 text-brand-purple rounded text-xs font-bold ml-2">
                    {ad.category}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {(ad.views / 1000000).toFixed(1)}M
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {ad.engagement.toFixed(1)}%
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {ad.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-white/5 text-slate-400 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Use as Template
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
