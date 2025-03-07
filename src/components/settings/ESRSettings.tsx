
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TestTube } from "lucide-react";

interface ESRSettingsProps {
  settings: {
    pulseCurrent: number;
    pulseLength: number;
    measurements: number;
  };
  onSettingChange: (setting: string, value: string) => void;
}

const ESRSettings = ({ settings, onSettingChange }: ESRSettingsProps) => {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-6 w-6 text-neutral-100" />
          ESR Test Settings
        </CardTitle>
        <CardDescription>
          Configure parameters for internal resistance (ESR) measurements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="pulseCurrent" className="text-sm font-medium text-neutral-100">
              Pulse Current (A)
            </label>
            <Input
              id="pulseCurrent"
              type="number"
              step="0.1"
              value={settings.pulseCurrent}
              onChange={(e) => onSettingChange('pulseCurrent', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Current pulse for ESR measurement</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="pulseLength" className="text-sm font-medium text-neutral-100">
              Pulse Length (ms)
            </label>
            <Input
              id="pulseLength"
              type="number"
              value={settings.pulseLength}
              onChange={(e) => onSettingChange('pulseLength', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Duration of the current pulse</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="measurements" className="text-sm font-medium text-neutral-100">
              Number of Measurements
            </label>
            <Input
              id="measurements"
              type="number"
              value={settings.measurements}
              onChange={(e) => onSettingChange('measurements', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Number of measurements for averaging</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESRSettings;
