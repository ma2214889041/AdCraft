import localforage from 'localforage';
import { ExtendedProject } from '../types';

const PROJECTS_KEY = 'adcraft_projects';

// Initialize localforage
const projectDB = localforage.createInstance({
  name: 'AdCraft',
  storeName: 'projects'
});

export const loadProjects = async (): Promise<ExtendedProject[]> => {
  try {
    const projects = await projectDB.getItem<ExtendedProject[]>(PROJECTS_KEY);
    return projects || [];
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
};

export const saveProject = async (project: ExtendedProject): Promise<void> => {
  try {
    const projects = await loadProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);

    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.unshift(project);
    }

    await projectDB.setItem(PROJECTS_KEY, projects);
  } catch (error) {
    console.error('Failed to save project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const projects = await loadProjects();
    const filtered = projects.filter(p => p.id !== id);
    await projectDB.setItem(PROJECTS_KEY, filtered);
  } catch (error) {
    console.error('Failed to delete project:', error);
    throw error;
  }
};

export const getProjectById = async (id: string): Promise<ExtendedProject | null> => {
  try {
    const projects = await loadProjects();
    return projects.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Failed to get project:', error);
    return null;
  }
};
