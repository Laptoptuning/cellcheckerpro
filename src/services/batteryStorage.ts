
import { Battery } from '@/types/battery';

// Type for a battery with project assignment
export interface StoredBattery extends Battery {
  projectId?: string;
}

// Type for a battery project
export interface BatteryProject {
  id: string;
  name: string;
  configuration: string;
  batteryIds: number[];
  createdAt: Date;
}

const STORAGE_KEYS = {
  BATTERIES: 'battery-cells',
  PROJECTS: 'battery-projects',
};

// Load batteries from localStorage
export const loadBatteries = (): StoredBattery[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BATTERIES);
    if (data) {
      const parsedData = JSON.parse(data);
      // Convert string dates back to Date objects
      return parsedData.map((battery: any) => ({
        ...battery,
        lastUpdated: new Date(battery.lastUpdated),
      }));
    }
  } catch (error) {
    console.error('Failed to load batteries from storage:', error);
  }
  return [];
};

// Save batteries to localStorage
export const saveBatteries = (batteries: StoredBattery[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BATTERIES, JSON.stringify(batteries));
  } catch (error) {
    console.error('Failed to save batteries to storage:', error);
  }
};

// Load projects from localStorage
export const loadProjects = (): BatteryProject[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (data) {
      const parsedData = JSON.parse(data);
      // Convert string dates back to Date objects
      return parsedData.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
      }));
    }
  } catch (error) {
    console.error('Failed to load projects from storage:', error);
  }
  return [];
};

// Save projects to localStorage
export const saveProjects = (projects: BatteryProject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects to storage:', error);
  }
};

// Add a battery to storage
export const saveBattery = (battery: Battery): StoredBattery => {
  const batteries = loadBatteries();
  
  // Check if battery already exists
  const existingIndex = batteries.findIndex(b => b.id === battery.id);
  
  if (existingIndex >= 0) {
    // Update existing battery
    const updated = { ...batteries[existingIndex], ...battery, lastUpdated: new Date() };
    batteries[existingIndex] = updated;
    saveBatteries(batteries);
    return updated;
  } else {
    // Add new battery
    const newBattery = { ...battery, lastUpdated: new Date() };
    batteries.push(newBattery);
    saveBatteries(batteries);
    return newBattery;
  }
};

// Get a battery by ID
export const getBatteryById = (id: number): StoredBattery | undefined => {
  const batteries = loadBatteries();
  return batteries.find(battery => battery.id === id);
};

// Create a new battery project
export const createBatteryProject = (
  name: string, 
  configuration: string, 
  batteryIds: number[]
): BatteryProject => {
  const projects = loadProjects();
  
  const newProject: BatteryProject = {
    id: Date.now().toString(),
    name,
    configuration,
    batteryIds,
    createdAt: new Date(),
  };
  
  projects.push(newProject);
  saveProjects(projects);
  
  // Assign batteries to this project
  const batteries = loadBatteries();
  const updatedBatteries = batteries.map(battery => 
    batteryIds.includes(battery.id) 
      ? { ...battery, projectId: newProject.id } 
      : battery
  );
  saveBatteries(updatedBatteries);
  
  return newProject;
};

// Get all available batteries (not assigned to a project)
export const getAvailableBatteries = (): StoredBattery[] => {
  const batteries = loadBatteries();
  return batteries.filter(battery => !battery.projectId);
};

// Get batteries for a specific project
export const getProjectBatteries = (projectId: string): StoredBattery[] => {
  const batteries = loadBatteries();
  return batteries.filter(battery => battery.projectId === projectId);
};

// Save mock data (for development)
export const seedMockData = (initialBatteries: Battery[]): void => {
  // Only seed if no data exists
  if (loadBatteries().length === 0) {
    saveBatteries(initialBatteries.map(battery => ({
      ...battery,
      lastUpdated: new Date(),
    })));
  }
};
