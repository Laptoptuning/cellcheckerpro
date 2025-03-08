import { Battery, TestType } from '@/types/battery';
import { toast } from '@/components/ui/use-toast';
import { generateMockBatteries } from '@/utils/mockData';

// Make API URL configurable - could be set through settings in the future
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.178.178:8000';

// Keep track of connection state
let isConnected = false;
let connectionAttempted = false;

// Generate mock batteries once to use as fallback
const mockBatteries = generateMockBatteries(16);

/**
 * Fetches battery data from the API
 * Falls back to mock data if the API is unavailable
 */
export const fetchBatteryData = async (): Promise<Battery[]> => {
  try {
    // If we've already tried and failed, don't keep hammering the API
    if (connectionAttempted && !isConnected) {
      console.log('Using mock data (API previously unreachable)');
      return mockBatteries;
    }
    
    connectionAttempted = true;
    
    // Add a timeout to the fetch to avoid long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Connection successful
    if (!isConnected) {
      isConnected = true;
      toast({
        title: "Connected to Battery Management System",
        description: "Successfully connected to the BMS API",
      });
    }
    
    // Transform the backend data to match our Battery type
    return data.map((item: any) => ({
      id: item.id || Math.floor(Math.random() * 1000),
      name: item.name || `Cell ${item.id}`,
      soc: item.soc || item.charge_percentage || 0,
      soh: item.soh || item.health_percentage || 100,
      voltage: item.voltage || 3.7,
      esr: item.internal_resistance || item.esr || 25,
      temperature: item.temperature || 25,
      cycleCount: item.cycle_count || 0,
      status: determineStatus(item),
      lastUpdated: new Date(),
      isUnderTest: item.is_under_test || false,
      currentTest: item.current_test,
      disposed: item.disposed || false,
      capacityAh: item.capacity || 3000, // assuming capacity is in mAh
    }));
  } catch (error) {
    // Handle connection errors
    if (!isConnected && connectionAttempted) {
      console.warn('Could not connect to battery management system API, using mock data');
      
      // Only show the toast once
      if (connectionAttempted === true) {
        toast({
          title: "Connection Error",
          description: "Could not connect to Battery Management System. Using simulated data.",
          variant: "destructive",
        });
      }
    } else {
      console.error('Error fetching battery data:', error);
    }
    
    isConnected = false;
    // Fix: change the string to boolean to resolve type error
    connectionAttempted = true; 
    
    // Return mock data as fallback
    return mockBatteries;
  }
};

export const startTest = async (cellIds: number[], testType: TestType): Promise<boolean> => {
  try {
    // If we know the API is not available, don't try to call it
    if (!isConnected) {
      toast({
        title: "Simulation Mode",
        description: `Starting ${testType} test simulation for selected cells.`,
      });
      return true;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/start-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cellIds,
        testType,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error starting ${testType} test:`, error);
    
    // If we hit an error, assume we're not connected
    isConnected = false;
    
    // In simulation mode, still return success
    toast({
      title: "Simulation Mode",
      description: `Starting ${testType} test simulation for selected cells. (API unavailable)`,
    });
    
    return true;
  }
};

export const stopTest = async (cellIds: number[]): Promise<boolean> => {
  try {
    // If we know the API is not available, don't try to call it
    if (!isConnected) {
      toast({
        title: "Simulation Mode",
        description: "Stopping test simulation for selected cells.",
      });
      return true;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/stop-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cellIds,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error stopping test:', error);
    
    // If we hit an error, assume we're not connected
    isConnected = false;
    
    // In simulation mode, still return success
    toast({
      title: "Simulation Mode",
      description: "Stopping test simulation for selected cells. (API unavailable)",
    });
    
    return true;
  }
};

export const disposeCells = async (cellIds: number[]): Promise<boolean> => {
  try {
    // If we know the API is not available, don't try to call it
    if (!isConnected) {
      toast({
        title: "Simulation Mode",
        description: "Marking selected cells as disposed in simulation.",
      });
      return true;
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_URL}/dispose-cells`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cellIds,
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error disposing cells:', error);
    
    // If we hit an error, assume we're not connected
    isConnected = false;
    
    // In simulation mode, still return success
    toast({
      title: "Simulation Mode",
      description: "Marking selected cells as disposed in simulation. (API unavailable)",
    });
    
    return true;
  }
};

// Helper function to determine battery status based on backend data
const determineStatus = (batteryData: any): 'good' | 'warning' | 'danger' => {
  // Check if the backend directly provides a status
  if (batteryData.status) {
    if (batteryData.status === 'good' || batteryData.status === 'warning' || batteryData.status === 'danger') {
      return batteryData.status;
    }
  }
  
  // Otherwise, determine status based on soh (health percentage)
  const soh = batteryData.soh || batteryData.health_percentage || 0;
  
  if (soh >= 80) return 'good';
  if (soh >= 50) return 'warning';
  return 'danger';
};
