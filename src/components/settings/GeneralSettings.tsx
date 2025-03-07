
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sliders } from "lucide-react";

interface GeneralSettingsProps {
  settings: {
    storageVoltage: number;
    maxCellsPerTest: number;
    logInterval: number;
  };
  onSettingChange: (setting: string, value: string) => void;
}

const GeneralSettings = ({ settings, onSettingChange }: GeneralSettingsProps) => {
  return (
    <Card className="bg-neutral-800 border-neutral-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sliders className="h-6 w-6 text-neutral-100" />
          General Test Settings
        </CardTitle>
        <CardDescription>
          Configure general parameters for all battery tests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="storageVoltage" className="text-sm font-medium text-neutral-100">
              Storage Voltage (V)
            </label>
            <Input
              id="storageVoltage"
              type="number"
              step="0.1"
              value={settings.storageVoltage}
              onChange={(e) => onSettingChange('storageVoltage', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Target voltage for long-term storage</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="maxCellsPerTest" className="text-sm font-medium text-neutral-100">
              Maximum Cells Per Test
            </label>
            <Input
              id="maxCellsPerTest"
              type="number"
              value={settings.maxCellsPerTest}
              onChange={(e) => onSettingChange('maxCellsPerTest', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Maximum number of cells to test simultaneously</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="logInterval" className="text-sm font-medium text-neutral-100">
              Log Interval (seconds)
            </label>
            <Input
              id="logInterval"
              type="number"
              value={settings.logInterval}
              onChange={(e) => onSettingChange('logInterval', e.target.value)}
              className="bg-neutral-700 border-neutral-600"
            />
            <p className="text-xs text-neutral-400">Interval between data logging</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettings;
