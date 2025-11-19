import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../store/projectStore';
import { ExtendedProject } from '../types';
import { Button } from '../components/Button';
import { Folder, Search, Trash2, Edit3, Eye, Clock, Tag, Grid3x3, List, Calendar, Filter } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects, loadAllProjects, deleteProject } = useProjectStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image' | 'avatar' | 'batch'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'processing' | 'completed'>('all');

  useEffect(() => {
    loadAllProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type: string) => {
    const colors = {
      video: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      image: 'bg-green-500/20 text-green-400 border-green-500/30',
      avatar: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      batch: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    return colors[type as keyof typeof colors] || colors.video;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { color: 'bg-slate-500/20 text-slate-400', icon: '📝' },
      processing: { color: 'bg-yellow-500/20 text-yellow-400', icon: '⚙️' },
      completed: { color: 'bg-green-500/20 text-green-400', icon: '✓' }
    };
    const badge = badges[status as keyof typeof badges] || badges.draft;
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${badge.color} flex items-center gap-1`}>
        <span>{badge.icon}</span> {status}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Folder className="w-8 h-8 text-brand-purple" />
            My Projects
          </h1>
          <p className="text-slate-400">{filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-brand-purple text-white' : 'bg-surface text-slate-400 hover:text-white'}`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-brand-purple text-white' : 'bg-surface text-slate-400 hover:text-white'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-brand-purple outline-none"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2">
          {(['all', 'video', 'image', 'avatar', 'batch'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === type
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'draft', 'processing', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-white/10 rounded-2xl">
          <Folder className="w-20 h-20 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
          <p className="text-slate-400 mb-6">
            {searchQuery || filterType !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first project to get started'}
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Create Project
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-surface border border-white/10 rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all group">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-brand-purple/20 to-pink-500/20 flex items-center justify-center relative overflow-hidden">
                {project.results.length > 0 ? (
                  <img src={project.results[0]} className="w-full h-full object-cover" alt={project.name} />
                ) : (
                  <Folder className="w-16 h-16 text-brand-purple/50" />
                )}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded border text-xs font-bold ${getTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-bold text-lg truncate flex-1">{project.name}</h3>
                  {getStatusBadge(project.status)}
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.createdAt)}
                  </span>
                  {project.tags && project.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {project.tags[0]}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map(project => (
            <div key={project.id} className="bg-surface border border-white/10 rounded-xl p-4 hover:border-brand-purple/50 transition-all flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-purple/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                {project.results.length > 0 ? (
                  <img src={project.results[0]} className="w-full h-full object-cover rounded-lg" alt={project.name} />
                ) : (
                  <Folder className="w-10 h-10 text-brand-purple/50" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-white font-bold text-lg truncate">{project.name}</h3>
                  <span className={`px-2 py-0.5 rounded border text-xs font-bold ${getTypeColor(project.type)}`}>
                    {project.type}
                  </span>
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated {formatDate(project.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
