
export interface ChargingSettings {
  maxVoltage: number;
  minVoltage: number;
  chargeCurrent: number;
  terminationCurrent: number;
  maxTemperature: number;
}

export interface DischargingSettings {
  cutoffVoltage: number;
  dischargeCurrent: number;
  maxTemperature: number;
}

export interface ESRSettings {
  pulseCurrent: number;
  pulseLength: number;
  measurements: number;
}

export interface CapacitySettings {
  chargeCurrent: number;
  dischargeCurrent: number;
  restPeriod: number;
  cycles: number;
}

export interface GeneralSettings {
  storageVoltage: number;
  maxCellsPerTest: number;
  logInterval: number;
}

export interface CellTestSettings {
  charging: ChargingSettings;
  discharging: DischargingSettings;
  esr: ESRSettings;
  capacity: CapacitySettings;
  general: GeneralSettings;
}

// Default settings values
export const defaultSettings: CellTestSettings = {
  charging: {
    maxVoltage: 4.2,
    minVoltage: 2.8,
    chargeCurrent: 0.5,
    terminationCurrent: 0.05,
    maxTemperature: 45,
  },
  discharging: {
    cutoffVoltage: 2.8,
    dischargeCurrent: 0.5,
    maxTemperature: 45,
  },
  esr: {
    pulseCurrent: 1.0,
    pulseLength: 10,
    measurements: 3,
  },
  capacity: {
    chargeCurrent: 0.5,
    dischargeCurrent: 0.5,
    restPeriod: 30,
    cycles: 1,
  },
  general: {
    storageVoltage: 3.4,
    maxCellsPerTest: 16,
    logInterval: 10,
  },
};
