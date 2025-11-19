import { Avatar } from '../types';

// Mock avatar library - in production, these would come from API or database
export const AVATAR_LIBRARY: Avatar[] = [
  {
    id: 'avatar-1',
    name: 'Emma',
    thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    gender: 'female',
    age: 'young',
    ethnicity: 'Caucasian',
    style: 'realistic'
  },
  {
    id: 'avatar-2',
    name: 'James',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    gender: 'male',
    age: 'middle',
    ethnicity: 'Caucasian',
    style: 'realistic'
  },
  {
    id: 'avatar-3',
    name: 'Sophia',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    gender: 'female',
    age: 'young',
    ethnicity: 'Hispanic',
    style: 'realistic'
  },
  {
    id: 'avatar-4',
    name: 'Michael',
    thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    gender: 'male',
    age: 'young',
    ethnicity: 'Caucasian',
    style: 'realistic'
  },
  {
    id: 'avatar-5',
    name: 'Aisha',
    thumbnail: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
    gender: 'female',
    age: 'young',
    ethnicity: 'African',
    style: 'realistic'
  },
  {
    id: 'avatar-6',
    name: 'David',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    gender: 'male',
    age: 'middle',
    ethnicity: 'Caucasian',
    style: 'realistic'
  },
  {
    id: 'avatar-7',
    name: 'Yuki',
    thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop',
    gender: 'female',
    age: 'young',
    ethnicity: 'Asian',
    style: 'realistic'
  },
  {
    id: 'avatar-8',
    name: 'Carlos',
    thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop',
    gender: 'male',
    age: 'young',
    ethnicity: 'Hispanic',
    style: 'realistic'
  },
  {
    id: 'avatar-9',
    name: 'Priya',
    thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
    gender: 'female',
    age: 'middle',
    ethnicity: 'Indian',
    style: 'realistic'
  },
  {
    id: 'avatar-10',
    name: 'Oliver',
    thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    gender: 'male',
    age: 'senior',
    ethnicity: 'Caucasian',
    style: 'realistic'
  }
];

export const getAvatars = async (filters?: {
  gender?: 'male' | 'female' | 'neutral';
  age?: 'young' | 'middle' | 'senior';
  style?: 'realistic' | 'animated' | 'custom';
}): Promise<Avatar[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!filters) return AVATAR_LIBRARY;

  return AVATAR_LIBRARY.filter(avatar => {
    if (filters.gender && avatar.gender !== filters.gender) return false;
    if (filters.age && avatar.age !== filters.age) return false;
    if (filters.style && avatar.style !== filters.style) return false;
    return true;
  });
};

export const getAvatarById = (id: string): Avatar | undefined => {
  return AVATAR_LIBRARY.find(avatar => avatar.id === id);
};

export const createCustomAvatar = async (imageFile: File): Promise<Avatar> => {
  // In production, this would upload the image and create an avatar
  // For now, return a mock avatar
  const imageUrl = URL.createObjectURL(imageFile);

  return {
    id: `custom-${Date.now()}`,
    name: 'Custom Avatar',
    thumbnail: imageUrl,
    gender: 'neutral',
    age: 'middle',
    ethnicity: 'Custom',
    style: 'custom'
  };
};
