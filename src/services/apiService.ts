
import axios from 'axios';
import { Battery } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import { generateMockBatteries, updateBatteryData } from '@/utils/mockData';
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
});

// Transform the API data to match our Battery type
const transformBatteryData = (apiData: any): Battery[] => {
  if (!apiData || !Array.isArray(apiData)) {
    return [];
  }

  return apiData.map((item, index) => ({
    id: item.id || index + 1,
    name: item.name || `Cell ${index + 1}`,
    soc: parseFloat(item.soc) || 0,
    soh: parseFloat(item.soh) || 0,
    voltage: parseFloat(item.voltage) || 0,
    esr: parseFloat(item.esr) || 0,
    temperature: parseFloat(item.temperature) || 0,
    cycleCount: parseInt(item.cycle_count) || 0,
    status: item.status || 'good',
    lastUpdated: new Date(),
    capacityAh: parseFloat(item.capacity) || 0,
    isUnderTest: item.is_under_test || false,
    currentTest: item.current_test,
    disposed: item.disposed || false,
  }));
};

// Fetch batteries from the API using the device-specific endpoint
export const fetchBatteries = async (deviceId = DEVICE_ID): Promise<Battery[]> => {
  try {
    if (!connectionAttempted) {
      connectionAttempted = true;
    }

    const response = await api.get(`/device-slots/?dev_id=${deviceId}`);
    
    if (response.status === 200) {
      isConnected = true;
      const transformedData = transformBatteryData(response.data);
      
      // Save fetched data to local storage as backup
      transformedData.forEach(battery => saveBattery(battery));
      
      return transformedData;
    } else {
      throw new Error(`API responded with status code ${response.status}`);
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
    
    const response = await api.post('/start-test/', {
      dev_id: deviceId,
      cell_ids: cellIds,
      test_type: testType
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
    
    const response = await api.post('/stop-test/', {
      dev_id: deviceId,
      cell_ids: cellIds
    });
    
    return response.status === 200;
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

