
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FlaskConical } from "lucide-react";

interface CapacitySettingsProps {
  settings: {
    chargeCurrent: number;
    dischargeCurrent: number;
    restPeriod: number;
    cycles: number;
  };
  onSettingChange: (setting: string, value: string) => void;
}

const CapacitySettings = ({ settings, onSettingChange }: CapacitySettingsProps) => {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-6 w-6 text-neutral-100" />
          Capacity Test Settings
        </CardTitle>
        <CardDescription>
          Configure parameters for capacity measurement tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="capacityChargeCurrent" className="text-sm font-medium text-neutral-100">
              Charge Current (A)
            </label>
            <Input
              id="capacityChargeCurrent"
              type="number"
              step="0.1"
              value={settings.chargeCurrent}
              onChange={(e) => onSettingChange('chargeCurrent', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Current used during capacity test charging</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="capacityDischargeCurrent" className="text-sm font-medium text-neutral-100">
              Discharge Current (A)
            </label>
            <Input
              id="capacityDischargeCurrent"
              type="number"
              step="0.1"
              value={settings.dischargeCurrent}
              onChange={(e) => onSettingChange('dischargeCurrent', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Current used during capacity test discharging</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="restPeriod" className="text-sm font-medium text-neutral-100">
              Rest Period (minutes)
            </label>
            <Input
              id="restPeriod"
              type="number"
              value={settings.restPeriod}
              onChange={(e) => onSettingChange('restPeriod', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Rest time between charge and discharge cycles</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="cycles" className="text-sm font-medium text-neutral-100">
              Number of Cycles
            </label>
            <Input
              id="cycles"
              type="number"
              value={settings.cycles}
              onChange={(e) => onSettingChange('cycles', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Number of measurements for averaging</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacitySettings;
