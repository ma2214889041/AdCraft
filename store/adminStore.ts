import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: number;
  lastLogin?: number;
  status: 'active' | 'suspended' | 'deleted';
  projectsCount: number;
  storageUsed: number;
}

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalProjects: number;
  totalVideos: number;
  storageUsed: number;
  apiCalls: number;
  revenue: number;
}

interface AdminStore {
  isAuthenticated: boolean;
  adminUser: { email: string; name: string } | null;
  users: User[];
  stats: AdminStats;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUsers: () => Promise<void>;
  loadStats: () => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  suspendUser: (id: string) => Promise<void>;
  activateUser: (id: string) => Promise<void>;
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    createdAt: Date.now() - 86400000 * 30,
    lastLogin: Date.now() - 86400000 * 2,
    status: 'active',
    projectsCount: 12,
    storageUsed: 1500
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    createdAt: Date.now() - 86400000 * 15,
    lastLogin: Date.now() - 3600000,
    status: 'active',
    projectsCount: 25,
    storageUsed: 3200
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'user',
    createdAt: Date.now() - 86400000 * 60,
    lastLogin: Date.now() - 86400000 * 10,
    status: 'suspended',
    projectsCount: 5,
    storageUsed: 800
  }
];

const MOCK_STATS: AdminStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalProjects: 8934,
  totalVideos: 15672,
  storageUsed: 245.5, // GB
  apiCalls: 234567,
  revenue: 45678.90
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminUser: null,
      users: [],
      stats: MOCK_STATS,

      login: async (email: string, password: string) => {
        // Mock authentication - in production, call real API
        if (email === 'admin@adcraft.ai' && password === 'admin123') {
          set({
            isAuthenticated: true,
            adminUser: { email, name: 'Admin User' }
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          adminUser: null
        });
      },

      loadUsers: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ users: MOCK_USERS });
      },

      loadStats: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ stats: MOCK_STATS });
      },

      updateUser: async (id: string, updates: Partial<User>) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        set(state => ({
          users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
        }));
      },

      deleteUser: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        set(state => ({
          users: state.users.map(u =>
            u.id === id ? { ...u, status: 'deleted' as const } : u
          )
        }));
      },

      suspendUser: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        set(state => ({
          users: state.users.map(u =>
            u.id === id ? { ...u, status: 'suspended' as const } : u
          )
        }));
      },

      activateUser: async (id: string) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        set(state => ({
          users: state.users.map(u =>
            u.id === id ? { ...u, status: 'active' as const } : u
          )
        }));
      }
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        adminUser: state.adminUser
      })
    }
  )
);
