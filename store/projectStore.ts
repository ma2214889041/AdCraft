import { create } from 'zustand';
import { ExtendedProject } from '../types';
import { loadProjects, saveProject, deleteProject as deleteProjectFromDB } from '../services/projectService';

interface ProjectStore {
  projects: ExtendedProject[];
  currentProject: ExtendedProject | null;

  // Actions
  loadAllProjects: () => Promise<void>;
  addProject: (project: ExtendedProject) => Promise<void>;
  updateProject: (id: string, updates: Partial<ExtendedProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setCurrentProject: (project: ExtendedProject | null) => void;
  getProjectById: (id: string) => ExtendedProject | undefined;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,

  loadAllProjects: async () => {
    const projects = await loadProjects();
    set({ projects });
  },

  addProject: async (project: ExtendedProject) => {
    await saveProject(project);
    set(state => ({ projects: [project, ...state.projects] }));
  },

  updateProject: async (id: string, updates: Partial<ExtendedProject>) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) return;

    const updatedProject = { ...project, ...updates, updatedAt: Date.now() };
    await saveProject(updatedProject);

    set(state => ({
      projects: state.projects.map(p => p.id === id ? updatedProject : p),
      currentProject: state.currentProject?.id === id ? updatedProject : state.currentProject
    }));
  },

  deleteProject: async (id: string) => {
    await deleteProjectFromDB(id);
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject
    }));
  },

  setCurrentProject: (project: ExtendedProject | null) => {
    set({ currentProject: project });
  },

  getProjectById: (id: string) => {
    return get().projects.find(p => p.id === id);
  }
}));
