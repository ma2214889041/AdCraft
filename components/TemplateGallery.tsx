import React, { useState } from 'react';
import { AdTemplate } from '../types';
import { Button } from './Button';
import { LayoutTemplate, Star, CheckCircle2, Crown } from 'lucide-react';

const TEMPLATES: AdTemplate[] = [
  {
    id: 'modern-ecom',
    name: 'Modern E-commerce',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=600&fit=crop',
    layout: 'Product showcase with pricing overlay',
    isPremium: false
  },
  {
    id: 'app-promo',
    name: 'App Promo',
    category: 'app',
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=600&fit=crop',
    layout: 'Phone mockup with feature highlights',
    isPremium: true
  },
  {
    id: 'gaming-hero',
    name: 'Gaming Hero',
    category: 'game',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=600&fit=crop',
    layout: 'Action-packed gameplay showcase',
    isPremium: false
  },
  {
    id: 'minimal-luxury',
    name: 'Minimal Luxury',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=600&fit=crop',
    layout: 'Clean product focus with elegant typography',
    isPremium: true
  },
  {
    id: 'service-hero',
    name: 'Service Hero',
    category: 'service',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=600&fit=crop',
    layout: 'Professional service presentation',
    isPremium: false
  },
  {
    id: 'flash-sale',
    name: 'Flash Sale',
    category: 'ecommerce',
    thumbnail: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=600&fit=crop',
    layout: 'Urgency-driven promotional design',
    isPremium: false
  },
  {
    id: 'app-features',
    name: 'App Features Grid',
    category: 'app',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=600&fit=crop',
    layout: 'Multi-feature showcase grid',
    isPremium: true
  },
  {
    id: 'game-character',
    name: 'Character Showcase',
    category: 'game',
    thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=600&fit=crop',
    layout: 'Epic character reveal design',
    isPremium: true
  }
];

interface TemplateGalleryProps {
  onSelect?: (template: AdTemplate) => void;
  selectedId?: string;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelect, selectedId }) => {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ecommerce' | 'app' | 'game' | 'service'>('all');

  const filteredTemplates = categoryFilter === 'all'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm">
          <LayoutTemplate className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Category:</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['all', 'ecommerce', 'app', 'game', 'service'] as const).map(category => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                categoryFilter === category
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {category === 'all' ? 'All Templates' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => onSelect?.(template)}
            className={`group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
              selectedId === template.id
                ? 'border-brand-purple shadow-lg shadow-brand-purple/20'
                : 'border-transparent hover:border-white/30'
            }`}
          >
            {/* Thumbnail */}
            <img
              src={template.thumbnail}
              alt={template.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Premium Badge */}
            {template.isPremium && (
              <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                <Crown className="w-3 h-3" />
                PRO
              </div>
            )}

            {/* Selected Badge */}
            {selectedId === template.id && (
              <div className="absolute top-2 left-2 bg-brand-purple text-white rounded-full p-1.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h4 className="font-bold mb-1">{template.name}</h4>
              <p className="text-xs text-slate-300 line-clamp-2">{template.layout}</p>
            </div>

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-brand-purple/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <Button size="sm">
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-20">
          <LayoutTemplate className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No templates found</p>
        </div>
      )}
    </div>
  );
};
