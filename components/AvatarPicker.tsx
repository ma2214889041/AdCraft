import React, { useState, useEffect } from 'react';
import { Avatar } from '../types';
import { getAvatars } from '../services/avatarService';
import { User, Filter, Upload, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface AvatarPickerProps {
  selected?: Avatar;
  onSelect: (avatar: Avatar) => void;
  onUploadCustom?: (file: File) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ selected, onSelect, onUploadCustom }) => {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [ageFilter, setAgeFilter] = useState<'all' | 'young' | 'middle' | 'senior'>('all');

  useEffect(() => {
    loadAvatars();
  }, [genderFilter, ageFilter]);

  const loadAvatars = async () => {
    setLoading(true);
    const filters: any = {};
    if (genderFilter !== 'all') filters.gender = genderFilter;
    if (ageFilter !== 'all') filters.age = ageFilter;

    const data = await getAvatars(filters);
    setAvatars(data);
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadCustom) {
      onUploadCustom(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 font-medium">Filters:</span>
        </div>

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

        <div className="h-4 w-px bg-white/10"></div>

        <div className="flex gap-2">
          {(['all', 'young', 'middle', 'senior'] as const).map(age => (
            <button
              key={age}
              onClick={() => setAgeFilter(age)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                ageFilter === age
                  ? 'bg-brand-purple text-white'
                  : 'bg-surface text-slate-400 hover:bg-white/5'
              }`}
            >
              {age === 'all' ? 'All Ages' : age.charAt(0).toUpperCase() + age.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Avatar Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4">
          {/* Upload Custom Avatar */}
          {onUploadCustom && (
            <label className="aspect-square bg-surface border-2 border-dashed border-white/20 rounded-xl hover:border-brand-purple hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center group">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-brand-purple mb-2" />
              <span className="text-xs text-slate-500 group-hover:text-brand-purple font-medium">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}

          {/* Avatar Cards */}
          {avatars.map(avatar => (
            <div
              key={avatar.id}
              onClick={() => onSelect(avatar)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                selected?.id === avatar.id
                  ? 'border-brand-purple shadow-lg shadow-brand-purple/20'
                  : 'border-transparent hover:border-white/30'
              }`}
            >
              <img
                src={avatar.thumbnail}
                alt={avatar.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Name */}
              <div className="absolute bottom-2 left-2 right-2 text-center">
                <p className="text-white text-xs font-bold truncate">{avatar.name}</p>
                <p className="text-slate-400 text-[10px]">{avatar.age}</p>
              </div>

              {/* Selected Indicator */}
              {selected?.id === avatar.id && (
                <div className="absolute top-2 right-2 bg-brand-purple text-white rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-brand-purple/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}

      {/* Selected Info */}
      {selected && (
        <div className="mt-6 p-4 bg-surface border border-white/10 rounded-xl flex items-center gap-4">
          <img src={selected.thumbnail} className="w-16 h-16 rounded-lg object-cover" alt={selected.name} />
          <div className="flex-1">
            <h4 className="text-white font-bold">{selected.name}</h4>
            <p className="text-sm text-slate-400">
              {selected.gender} • {selected.age} • {selected.ethnicity}
            </p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        </div>
      )}
    </div>
  );
};
