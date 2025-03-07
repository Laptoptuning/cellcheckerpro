
import { Battery } from '../types/battery';

// Helper function to generate a random number between min and max
const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to determine battery status based on SOH and SOC
const determineBatteryStatus = (soh: number, soc: number): 'good' | 'warning' | 'danger' => {
  if (soh < 70 || soc < 10) return 'danger';
  if (soh < 85 || soc < 20) return 'warning';
  return 'good';
};

// Generate mock battery data
export const generateMockBatteries = (count: number = 16): Battery[] => {
  return Array.from({ length: count }, (_, i) => {
    const soc = randomBetween(5, 100);
    const soh = randomBetween(60, 100);
    const voltage = 3 + (randomBetween(0, 12) / 10); // 3.0V to 4.2V
    const esr = randomBetween(15, 100); // 15mΩ to 100mΩ
    const temperature = randomBetween(20, 40); // 20°C to 40°C
    const cycleCount = randomBetween(0, 500);
    
    return {
      id: i + 1,
      name: `Cell ${i + 1}`,
      soc,
      soh,
      voltage,
      esr,
      temperature,
      cycleCount,
      status: determineBatteryStatus(soh, soc),
      lastUpdated: new Date(),
    };
  });
};

// Simulate data updates
export const updateBatteryData = (battery: Battery): Battery => {
  // Small random changes to simulate real-time updates
  const socChange = randomBetween(-2, 2);
  const newSoc = Math.max(0, Math.min(100, battery.soc + socChange));
  
  const voltageChange = randomBetween(-5, 5) / 100;
  const newVoltage = Math.max(3.0, Math.min(4.2, battery.voltage + voltageChange));
  
  const tempChange = randomBetween(-1, 1);
  const newTemp = Math.max(20, Math.min(45, battery.temperature + tempChange));
  
  const newSoh = (socChange > 0 && battery.soc > 90) 
    ? Math.max(60, battery.soh - 0.01) // Very slow degradation when charging at high SOC
    : battery.soh;
  
  return {
    ...battery,
    soc: newSoc,
    voltage: newVoltage,
    temperature: newTemp,
    soh: newSoh,
    status: determineBatteryStatus(newSoh, newSoc),
    lastUpdated: new Date(),
  };
};
