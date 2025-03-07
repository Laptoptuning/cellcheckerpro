
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Battery } from "lucide-react";

interface DischargingSettingsProps {
  settings: {
    cutoffVoltage: number;
    dischargeCurrent: number;
    maxTemperature: number;
  };
  onSettingChange: (setting: string, value: string) => void;
}

const DischargingSettings = ({ settings, onSettingChange }: DischargingSettingsProps) => {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5 text-warning-400" />
          Discharging Test Settings
        </CardTitle>
        <CardDescription>
          Configure parameters for battery discharging tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="cutoffVoltage" className="text-sm font-medium">
              Cutoff Voltage (V)
            </label>
            <Input
              id="cutoffVoltage"
              type="number"
              step="0.1"
              value={settings.cutoffVoltage}
              onChange={(e) => onSettingChange('cutoffVoltage', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Voltage at which discharge stops</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="dischargeCurrent" className="text-sm font-medium">
              Discharge Current (A)
            </label>
            <Input
              id="dischargeCurrent"
              type="number"
              step="0.1"
              value={settings.dischargeCurrent}
              onChange={(e) => onSettingChange('dischargeCurrent', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Current used during discharging</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="maxDischargeTemp" className="text-sm font-medium">
              Maximum Temperature (°C)
            </label>
            <Input
              id="maxDischargeTemp"
              type="number"
              value={settings.maxTemperature}
              onChange={(e) => onSettingChange('maxTemperature', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Maximum safe temperature during discharging</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DischargingSettings;
