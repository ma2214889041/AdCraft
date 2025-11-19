import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Plus, Edit, Trash2, Image, User, Volume2, LayoutTemplate } from 'lucide-react';
import { AVATAR_LIBRARY } from '../services/avatarService';
import { VOICE_LIBRARY } from '../services/ttsService';

type ContentTab = 'templates' | 'avatars' | 'voices';

export const ContentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentTab>('templates');

  const templates = [
    { id: '1', name: 'Modern E-commerce', category: 'ecommerce', usageCount: 1234, thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200' },
    { id: '2', name: 'App Promo', category: 'app', usageCount: 892, thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200' },
    { id: '3', name: 'Gaming Hero', category: 'game', usageCount: 567, thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200' }
  ];

  const tabs = [
    { id: 'templates', label: 'Templates', icon: LayoutTemplate, count: templates.length },
    { id: 'avatars', label: 'Avatars', icon: User, count: AVATAR_LIBRARY.length },
    { id: 'voices', label: 'Voices', icon: Volume2, count: VOICE_LIBRARY.length }
  ];

  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-slate-400">Manage templates, avatars, and voices</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New {activeTab.slice(0, -1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ContentTab)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
            <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-xs">{tab.count}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(template => (
            <div key={template.id} className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all group">
              <div className="aspect-[4/5] overflow-hidden bg-gradient-to-br from-brand-purple/20 to-pink-500/20">
                <img src={template.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={template.name} />
              </div>
              <div className="p-4">
                <h3 className="text-white font-bold mb-1">{template.name}</h3>
                <p className="text-sm text-slate-400 mb-3">{template.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{template.usageCount} uses</span>
                  <div className="flex gap-2">
                    <button className="p-1.5 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-red-500/10 rounded text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'avatars' && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {AVATAR_LIBRARY.map(avatar => (
            <div key={avatar.id} className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all group">
              <div className="aspect-square">
                <img src={avatar.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={avatar.name} />
              </div>
              <div className="p-3">
                <h4 className="text-white font-bold text-sm mb-1">{avatar.name}</h4>
                <p className="text-xs text-slate-400">{avatar.gender} • {avatar.age}</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 p-1.5 hover:bg-white/10 rounded text-xs text-slate-400 hover:text-white transition-colors">
                    <Edit className="w-3 h-3 mx-auto" />
                  </button>
                  <button className="flex-1 p-1.5 hover:bg-red-500/10 rounded text-xs text-red-400 transition-colors">
                    <Trash2 className="w-3 h-3 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'voices' && (
        <div className="space-y-3">
          {VOICE_LIBRARY.map(voice => (
            <div key={voice.id} className="bg-surface border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-brand-purple/50 transition-all">
              <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-brand-purple" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold">{voice.name}</h4>
                <p className="text-sm text-slate-400">{voice.language} • {voice.accent}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  voice.gender === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                }`}>
                  {voice.gender}
                </span>
                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-red-500/10 rounded text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
