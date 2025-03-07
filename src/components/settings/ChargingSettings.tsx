import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Battery } from "lucide-react";
interface ChargingSettingsProps {
  settings: {
    maxVoltage: number;
    minVoltage: number;
    chargeCurrent: number;
    terminationCurrent: number;
    maxTemperature: number;
  };
  onSettingChange: (setting: string, value: string) => void;
}
const ChargingSettings = ({
  settings,
  onSettingChange
}: ChargingSettingsProps) => {
  return <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-50">
          <Battery className="h-5 w-5 text-primary" />
          Charging Test Settings
        </CardTitle>
        <CardDescription>
          Configure parameters for battery charging tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="maxVoltage" className="text-sm font-medium bg-zinc-800">
              Maximum Voltage (V)
            </label>
            <Input id="maxVoltage" type="number" step="0.1" value={settings.maxVoltage} onChange={e => onSettingChange('maxVoltage', e.target.value)} className="bg-neutral-700 border-neutral-600" />
            <p className="text-xs text-neutral-400">Maximum voltage to charge cells to</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="minVoltage" className="text-sm font-medium">
              Minimum Voltage (V)
            </label>
            <Input id="minVoltage" type="number" step="0.1" value={settings.minVoltage} onChange={e => onSettingChange('minVoltage', e.target.value)} className="bg-neutral-700 border-neutral-600" />
            <p className="text-xs text-neutral-400">Minimum voltage before charging</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="chargeCurrent" className="text-sm font-medium">
              Charge Current (A)
            </label>
            <Input id="chargeCurrent" type="number" step="0.1" value={settings.chargeCurrent} onChange={e => onSettingChange('chargeCurrent', e.target.value)} className="bg-neutral-700 border-neutral-600" />
            <p className="text-xs text-neutral-400">Current used during charging</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="terminationCurrent" className="text-sm font-medium">
              Termination Current (A)
            </label>
            <Input id="terminationCurrent" type="number" step="0.01" value={settings.terminationCurrent} onChange={e => onSettingChange('terminationCurrent', e.target.value)} className="bg-neutral-700 border-neutral-600" />
            <p className="text-xs text-neutral-400">Current at which charging is considered complete</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="maxTemperature" className="text-sm font-medium">
              Maximum Temperature (°C)
            </label>
            <Input id="maxTemperature" type="number" value={settings.maxTemperature} onChange={e => onSettingChange('maxTemperature', e.target.value)} className="bg-neutral-700 border-neutral-600" />
            <p className="text-xs text-neutral-400">Maximum safe temperature during charging</p>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default ChargingSettings;