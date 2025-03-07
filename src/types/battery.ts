
export type TestType = 'charge' | 'discharge' | 'esr' | 'capacity' | 'macro' | 'store';

export interface Battery {
  id: number;
  name: string;
  soc: number; // State of Charge (percentage)
  soh: number; // State of Health (percentage)
  voltage: number; // Voltage (V)
  esr: number; // Internal Resistance (mΩ)
  temperature: number; // Temperature (°C)
  cycleCount: number; // Number of charge/discharge cycles
  status: 'good' | 'warning' | 'danger'; // Overall status
  lastUpdated: Date; // Last updated timestamp
  isUnderTest?: boolean; // Whether the battery is currently being tested
  currentTest?: TestType; // Current test being performed
  disposed?: boolean; // Whether the battery is marked for disposal
}
