
import axios from 'axios';
import { Battery } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import { generateMockBatteries } from '@/utils/mockData';
import { loadBatteries, saveBattery } from '@/services/batteryStorage';

// Configuration
const API_URL = 'http://192.168.178.178:8000';
const API_TIMEOUT = 5000; // 5 seconds timeout
const DEVICE_ID = 5; // Default device ID

let connectionAttempted = false;
let isConnected = false;

// Configure axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Transform the API data to match our Battery type
const transformBatteryData = (apiData: any): Battery[] => {
  if (!apiData || !apiData.cells || !Array.isArray(apiData.cells)) {
    return [];
  }

  return apiData.cells.map((item: any, index: number) => ({
    id: item.CiD || index + 1,
    name: `Cell ${item.CiD || index + 1}`,
    soc: parseFloat(item.SOC || 0),
    soh: parseFloat(item.SOH || 0),
    voltage: parseFloat(item.V || 0),
    esr: parseFloat(item.ESR || 0),
    temperature: parseFloat(item.T || 0),
    cycleCount: parseInt(item.CYC || 0),
    status: getStatusFromCell(item),
    lastUpdated: new Date(),
    capacityAh: parseFloat(item.CAP || 0),
    isUnderTest: isUnderTestFromState(item.ST),
    currentTest: getCurrentTestFromState(item.ST),
    disposed: item.ST === 'DSP',
  }));
};

// Helper function to determine cell status from API data
const getStatusFromCell = (cell: any): 'good' | 'warning' | 'danger' => {
  // Check for any danger conditions
  if (cell.ST === 'DSP' || cell.ERR) {
    return 'danger';
  }
  
  // Check for any warning conditions
  if (cell.SOH < 80 || cell.SOC < 10 || cell.V < 3.0) {
    return 'warning';
  }
  
  return 'good';
};

// Helper function to determine if cell is under test
const isUnderTestFromState = (state: string): boolean => {
  const testStates = ['CH', 'DCH', 'ESR', 'CAP', 'STO'];
  return testStates.some(testState => state?.includes(testState));
};

// Helper function to determine current test type
const getCurrentTestFromState = (state: string): 'charge' | 'discharge' | 'esr' | 'capacity' | 'store' | undefined => {
  if (!state) return undefined;
  
  if (state.includes('CH')) return 'charge';
  if (state.includes('DCH')) return 'discharge';
  if (state.includes('ESR')) return 'esr';
  if (state.includes('CAP')) return 'capacity';
  if (state.includes('STO')) return 'store';
  
  return undefined;
};

// Fetch batteries by making two API calls (for cells 1-8 and 9-16) and combining the results
export const fetchBatteries = async (deviceId = DEVICE_ID): Promise<Battery[]> => {
  try {
    if (!connectionAttempted) {
      connectionAttempted = true;
    }

    // First request for cells 1 to 8
    const response1 = await api.post('/api/get_cells_info', {
      start: 1, 
      end: 8
    });
    
    // Second request for cells 9 to 16
    const response2 = await api.post('/api/get_cells_info', {
      start: 9, 
      end: 16
    });
    
    if (response1.status === 200 && response2.status === 200) {
      isConnected = true;
      
      // Combine the results
      const combinedData = {
        cells: [...response1.data.cells, ...response2.data.cells]
      };
      
      const transformedData = transformBatteryData(combinedData);
      
      // Save fetched data to local storage as backup
      transformedData.forEach(battery => saveBattery(battery));
      
      return transformedData;
    } else {
      throw new Error(`API responded with status code ${response1.status} or ${response2.status}`);
    }
  } catch (error) {
    console.warn('Could not connect to battery management system API, using mock data', error);
    isConnected = false;
    
    // Try to load from storage first
    const storedBatteries = loadBatteries();
    
    if (storedBatteries.length > 0) {
      console.info('Using stored data');
      return storedBatteries;
    }
    
    // Fallback to generated mock data
    console.info('Using mock data (API previously unreachable)');
    const mockData = generateMockBatteries(16);
    return mockData;
  }
};

// Start a test on selected cells
export const startTest = async (
  cellIds: number[], 
  testType: string,
  deviceId = DEVICE_ID
): Promise<boolean> => {
  try {
    if (!isConnected) {
      // Show toast if we know we're not connected
      toast({
        title: "Using Simulation Mode",
        description: "The battery management system is unreachable. Test will be simulated.",
      });
      return true; // Pretend test started successfully
    }
    
    // Map our test types to the API command formats
    const testCommandMap: Record<string, string> = {
      'charge': 'ach',
      'discharge': 'adc',
      'esr': 'esr',
      'capacity': 'cap',
      'store': 'asc'
    };
    
    const command = testCommandMap[testType] || testType;
    
    // Create the cells array for the API request
    const cells = cellIds.map(id => ({
      CiD: id,
      CmD: command
    }));
    
    const response = await api.post('/api/set_cell', {
      cells: cells
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error starting test:', error);
    // Show toast for error
    toast({
      title: "Test Start Failed",
      description: "Could not start the test. Using simulation mode.",
      variant: "destructive"
    });
    return false;
  }
};

// Stop a test on selected cells
export const stopTest = async (
  cellIds: number[],
  deviceId = DEVICE_ID
): Promise<boolean> => {
  try {
    if (!isConnected) {
      // Show toast if we know we're not connected
      toast({
        title: "Using Simulation Mode",
        description: "The battery management system is unreachable. Test will be stopped in simulation.",
      });
      return true; // Pretend test stopped successfully
    }
    
    // Determine what command to send based on current test
    // For simplicity, we'll send both stop charging and stop discharging commands
    
    // Create the cells array for the API request
    const cells = cellIds.map(id => ({
      CiD: id,
      CmD: 'sc' // Stop charging command
    }));
    
    // Send the stop charging command
    const response1 = await api.post('/api/set_cell', {
      cells: cells
    });
    
    // Also send stop discharging command to ensure all tests are stopped
    const cells2 = cellIds.map(id => ({
      CiD: id,
      CmD: 'odc' // Stop discharging command
    }));
    
    const response2 = await api.post('/api/set_cell', {
      cells: cells2
    });
    
    return response1.status === 200 && response2.status === 200;
  } catch (error) {
    console.error('Error stopping test:', error);
    // Show toast for error
    toast({
      title: "Test Stop Failed",
      description: "Could not stop the test. Using simulation mode.",
      variant: "destructive"
    });
    return false;
  }
};

// Dispose selected cells
export const disposeCells = async (
  cellIds: number[],
  deviceId = DEVICE_ID
): Promise<boolean> => {
  try {
    if (!isConnected) {
      // Show toast if we know we're not connected
      toast({
        title: "Using Simulation Mode",
        description: "The battery management system is unreachable. Disposal will be simulated.",
      });
      return true; // Pretend disposal was successful
    }
    
    // Create the cells array for the API request
    const cells = cellIds.map(id => ({
      CiD: id,
      CmD: 'dsp' // Dispose command
    }));
    
    const response = await api.post('/api/set_cell', {
      cells: cells
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error disposing cells:', error);
    // Show toast for error
    toast({
      title: "Disposal Failed",
      description: "Could not dispose the cells. Using simulation mode.",
      variant: "destructive"
    });
    return false;
  }
};

// Start a macro test on selected cells
export const startMacroTest = async (
  cellIds: number[],
  macroType: string = 'standart',
  deviceId = DEVICE_ID
): Promise<boolean> => {
  try {
    if (!isConnected) {
      // Show toast if we know we're not connected
      toast({
        title: "Using Simulation Mode",
        description: "The battery management system is unreachable. Macro test will be simulated.",
      });
      return true; // Pretend test started successfully
    }
    
    // Create the cells array for the API request
    const cells = cellIds.map(id => ({
      CiD: id,
      CmD: macroType
    }));
    
    const response = await api.post('/api/set_cell_macro', {
      cells: cells
    });
    
    return response.status === 200;
  } catch (error) {
    console.error('Error starting macro test:', error);
    // Show toast for error
    toast({
      title: "Macro Test Start Failed",
      description: "Could not start the macro test. Using simulation mode.",
      variant: "destructive"
    });
    return false;
  }
};

// Get connection status
export const isApiConnected = (): boolean => {
  return isConnected;
};

// Has a connection been attempted
export const hasConnectionBeenAttempted = (): boolean => {
  return connectionAttempted;
};

// Export the API URL for reference
export const getApiUrl = (): string => {
  return API_URL;
};
