import localforage from 'localforage';

// Configure localforage instances for different data types
const projectsDB = localforage.createInstance({
  name: 'adcraft',
  storeName: 'projects',
});

const historyDB = localforage.createInstance({
  name: 'adcraft',
  storeName: 'history',
});

const statsDB = localforage.createInstance({
  name: 'adcraft',
  storeName: 'stats',
});

const settingsDB = localforage.createInstance({
  name: 'adcraft',
  storeName: 'settings',
});

// Types
export interface ProjectData {
  id: string;
  userId: string;
  name: string;
  type: 'image' | 'video' | 'avatar' | 'batch';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  data: any;
  createdAt: number;
  updatedAt: number;
}

export interface GenerationHistory {
  id: string;
  userId: string;
  projectId?: string;
  type: 'image_analysis' | 'video_generation' | 'tts' | 'batch' | 'scene_generation';
  input: any;
  output: any;
  status: 'success' | 'failed';
  duration: number; // milliseconds
  createdAt: number;
}

export interface UsageStats {
  userId: string;
  totalProjects: number;
  totalGenerations: number;
  imageAnalysisCount: number;
  videoGenerationCount: number;
  ttsCount: number;
  batchCount: number;
  lastUpdated: number;
}

export interface UserSettings {
  userId: string;
  theme: 'dark' | 'light';
  language: 'en' | 'zh';
  notifications: boolean;
  preferences: any;
}

// Projects CRUD
export const createProject = async (project: Omit<ProjectData, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectData> => {
  const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();

  const newProject: ProjectData = {
    ...project,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await projectsDB.setItem(id, newProject);
  return newProject;
};

export const getProject = async (id: string): Promise<ProjectData | null> => {
  return await projectsDB.getItem<ProjectData>(id);
};

export const getProjectsByUser = async (userId: string): Promise<ProjectData[]> => {
  const projects: ProjectData[] = [];
  await projectsDB.iterate<ProjectData, void>((project) => {
    if (project.userId === userId) {
      projects.push(project);
    }
  });
  return projects.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const updateProject = async (id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> => {
  const project = await getProject(id);
  if (!project) return null;

  const updated: ProjectData = {
    ...project,
    ...updates,
    id: project.id,
    createdAt: project.createdAt,
    updatedAt: Date.now(),
  };

  await projectsDB.setItem(id, updated);
  return updated;
};

export const deleteProject = async (id: string): Promise<void> => {
  await projectsDB.removeItem(id);
};

// Generation History
export const addGenerationHistory = async (
  history: Omit<GenerationHistory, 'id' | 'createdAt'>
): Promise<GenerationHistory> => {
  const id = `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newHistory: GenerationHistory = {
    ...history,
    id,
    createdAt: Date.now(),
  };

  await historyDB.setItem(id, newHistory);

  // Update user stats
  await incrementUserStats(history.userId, history.type);

  return newHistory;
};

export const getGenerationHistory = async (userId: string, limit: number = 50): Promise<GenerationHistory[]> => {
  const history: GenerationHistory[] = [];
  await historyDB.iterate<GenerationHistory, void>((item) => {
    if (item.userId === userId) {
      history.push(item);
    }
  });
  return history
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
};

export const getGenerationHistoryByType = async (
  userId: string,
  type: GenerationHistory['type']
): Promise<GenerationHistory[]> => {
  const history: GenerationHistory[] = [];
  await historyDB.iterate<GenerationHistory, void>((item) => {
    if (item.userId === userId && item.type === type) {
      history.push(item);
    }
  });
  return history.sort((a, b) => b.createdAt - a.createdAt);
};

// Usage Stats
export const getUserStats = async (userId: string): Promise<UsageStats> => {
  const stats = await statsDB.getItem<UsageStats>(userId);
  if (stats) return stats;

  // Return default stats if not found
  return {
    userId,
    totalProjects: 0,
    totalGenerations: 0,
    imageAnalysisCount: 0,
    videoGenerationCount: 0,
    ttsCount: 0,
    batchCount: 0,
    lastUpdated: Date.now(),
  };
};

const incrementUserStats = async (userId: string, type: GenerationHistory['type']): Promise<void> => {
  const stats = await getUserStats(userId);

  stats.totalGenerations++;

  switch (type) {
    case 'image_analysis':
      stats.imageAnalysisCount++;
      break;
    case 'video_generation':
      stats.videoGenerationCount++;
      break;
    case 'tts':
      stats.ttsCount++;
      break;
    case 'batch':
      stats.batchCount++;
      break;
  }

  stats.lastUpdated = Date.now();
  await statsDB.setItem(userId, stats);
};

export const updateProjectCount = async (userId: string, delta: number = 1): Promise<void> => {
  const stats = await getUserStats(userId);
  stats.totalProjects += delta;
  stats.lastUpdated = Date.now();
  await statsDB.setItem(userId, stats);
};

// User Settings
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  const settings = await settingsDB.getItem<UserSettings>(userId);
  if (settings) return settings;

  // Return default settings
  return {
    userId,
    theme: 'dark',
    language: 'zh',
    notifications: true,
    preferences: {},
  };
};

export const updateUserSettings = async (userId: string, updates: Partial<UserSettings>): Promise<UserSettings> => {
  const settings = await getUserSettings(userId);
  const updated = { ...settings, ...updates, userId };
  await settingsDB.setItem(userId, updated);
  return updated;
};

// Analytics helpers
export const getRecentActivity = async (userId: string, days: number = 7): Promise<{
  date: string;
  count: number;
}[]> => {
  const history = await getGenerationHistory(userId, 1000);
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const activityMap = new Map<string, number>();

  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * dayMs).toISOString().split('T')[0];
    activityMap.set(date, 0);
  }

  history.forEach(item => {
    const date = new Date(item.createdAt).toISOString().split('T')[0];
    if (activityMap.has(date)) {
      activityMap.set(date, (activityMap.get(date) || 0) + 1);
    }
  });

  return Array.from(activityMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Clear all data (for testing/logout)
export const clearUserData = async (userId: string): Promise<void> => {
  // Clear projects
  const projects = await getProjectsByUser(userId);
  await Promise.all(projects.map(p => deleteProject(p.id)));

  // Clear stats and settings
  await statsDB.removeItem(userId);
  await settingsDB.removeItem(userId);

  // Clear history
  const historyItems: string[] = [];
  await historyDB.iterate<GenerationHistory, void>((item, key) => {
    if (item.userId === userId) {
      historyItems.push(key);
    }
  });
  await Promise.all(historyItems.map(key => historyDB.removeItem(key)));
};

export default {
  // Projects
  createProject,
  getProject,
  getProjectsByUser,
  updateProject,
  deleteProject,

  // History
  addGenerationHistory,
  getGenerationHistory,
  getGenerationHistoryByType,

  // Stats
  getUserStats,
  updateProjectCount,

  // Settings
  getUserSettings,
  updateUserSettings,

  // Analytics
  getRecentActivity,

  // Utility
  clearUserData,
};
