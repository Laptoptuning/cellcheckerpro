import { Battery, TestType } from '@/types/battery';

const API_BASE_URL = 'http://192.168.178.178:8000';

export const fetchBatteryData = async (): Promise<Battery[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
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
    console.error('Error fetching battery data:', error);
    throw error;
  }
};

export const startTest = async (cellIds: number[], testType: TestType): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/start-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cellIds,
        testType,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error starting ${testType} test:`, error);
    return false;
  }
};

export const stopTest = async (cellIds: number[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stop-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cellIds,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error stopping test:', error);
    return false;
  }
};

export const disposeCells = async (cellIds: number[]): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dispose-cells`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cellIds,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error disposing cells:', error);
    return false;
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
