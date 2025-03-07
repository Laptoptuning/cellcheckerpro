import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sliders, Battery, TestTube, Thermometer, FlaskConical, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Default settings values
const defaultSettings = {
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

// Load settings from localStorage or use defaults
const loadSettings = () => {
  const storedSettings = localStorage.getItem('cellTestSettings');
  return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
};

const Settings = () => {
  const [settings, setSettings] = useState(loadSettings());
  const [activeTab, setActiveTab] = useState("charging");
  const { toast } = useToast();

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cellTestSettings', JSON.stringify(settings));
  }, [settings]);

  // Handle input changes for each setting category
  const handleSettingChange = (category: string, setting: string, value: string) => {
    // Convert input to number and validate
    const numValue = Number(value);
    
    if (isNaN(numValue)) return;
    
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: numValue,
      },
    });
  };

  // Handle form submission
  const handleSave = () => {
    localStorage.setItem('cellTestSettings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your cell testing settings have been saved.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      <Navbar />
      <div className="container mx-auto pt-24 pb-12 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-1">Cell Test Settings</h1>
        <p className="text-neutral-400 mb-6">Configure parameters for battery cell testing</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-neutral-800 border-neutral-700 mb-8">
            <TabsTrigger value="charging" className="data-[state=active]:bg-neutral-700">
              <Battery className="mr-2 h-4 w-4" />
              Charging
            </TabsTrigger>
            <TabsTrigger value="discharging" className="data-[state=active]:bg-neutral-700">
              <Battery className="mr-2 h-4 w-4" />
              Discharging
            </TabsTrigger>
            <TabsTrigger value="esr" className="data-[state=active]:bg-neutral-700">
              <TestTube className="mr-2 h-4 w-4" />
              ESR
            </TabsTrigger>
            <TabsTrigger value="capacity" className="data-[state=active]:bg-neutral-700">
              <FlaskConical className="mr-2 h-4 w-4" />
              Capacity
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-neutral-700">
              <Sliders className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Charging Settings */}
          <TabsContent value="charging">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
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
                    <label htmlFor="maxVoltage" className="text-sm font-medium">
                      Maximum Voltage (V)
                    </label>
                    <Input
                      id="maxVoltage"
                      type="number"
                      step="0.1"
                      value={settings.charging.maxVoltage}
                      onChange={(e) => handleSettingChange('charging', 'maxVoltage', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Maximum voltage to charge cells to</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="minVoltage" className="text-sm font-medium">
                      Minimum Voltage (V)
                    </label>
                    <Input
                      id="minVoltage"
                      type="number"
                      step="0.1"
                      value={settings.charging.minVoltage}
                      onChange={(e) => handleSettingChange('charging', 'minVoltage', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Minimum voltage before charging</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="chargeCurrent" className="text-sm font-medium">
                      Charge Current (A)
                    </label>
                    <Input
                      id="chargeCurrent"
                      type="number"
                      step="0.1"
                      value={settings.charging.chargeCurrent}
                      onChange={(e) => handleSettingChange('charging', 'chargeCurrent', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Current used during charging</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="terminationCurrent" className="text-sm font-medium">
                      Termination Current (A)
                    </label>
                    <Input
                      id="terminationCurrent"
                      type="number"
                      step="0.01"
                      value={settings.charging.terminationCurrent}
                      onChange={(e) => handleSettingChange('charging', 'terminationCurrent', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Current at which charging is considered complete</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="maxTemperature" className="text-sm font-medium">
                      Maximum Temperature (°C)
                    </label>
                    <Input
                      id="maxTemperature"
                      type="number"
                      value={settings.charging.maxTemperature}
                      onChange={(e) => handleSettingChange('charging', 'maxTemperature', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Maximum safe temperature during charging</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Discharging Settings */}
          <TabsContent value="discharging">
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
                      value={settings.discharging.cutoffVoltage}
                      onChange={(e) => handleSettingChange('discharging', 'cutoffVoltage', e.target.value)}
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
                      value={settings.discharging.dischargeCurrent}
                      onChange={(e) => handleSettingChange('discharging', 'dischargeCurrent', e.target.value)}
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
                      value={settings.discharging.maxTemperature}
                      onChange={(e) => handleSettingChange('discharging', 'maxTemperature', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Maximum safe temperature during discharging</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ESR Settings */}
          <TabsContent value="esr">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-primary" />
                  ESR Test Settings
                </CardTitle>
                <CardDescription>
                  Configure parameters for internal resistance (ESR) measurements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="pulseCurrent" className="text-sm font-medium">
                      Pulse Current (A)
                    </label>
                    <Input
                      id="pulseCurrent"
                      type="number"
                      step="0.1"
                      value={settings.esr.pulseCurrent}
                      onChange={(e) => handleSettingChange('esr', 'pulseCurrent', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Current pulse for ESR measurement</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="pulseLength" className="text-sm font-medium">
                      Pulse Length (ms)
                    </label>
                    <Input
                      id="pulseLength"
                      type="number"
                      value={settings.esr.pulseLength}
                      onChange={(e) => handleSettingChange('esr', 'pulseLength', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Duration of the current pulse</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="measurements" className="text-sm font-medium">
                      Number of Measurements
                    </label>
                    <Input
                      id="measurements"
                      type="number"
                      value={settings.esr.measurements}
                      onChange={(e) => handleSettingChange('esr', 'measurements', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Number of measurements for averaging</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Capacity Settings */}
          <TabsContent value="capacity">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-warning-500" />
                  Capacity Test Settings
                </CardTitle>
                <CardDescription>
                  Configure parameters for capacity measurement tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="capacityChargeCurrent" className="text-sm font-medium">
                      Charge Current (A)
                    </label>
                    <Input
                      id="capacityChargeCurrent"
                      type="number"
                      step="0.1"
                      value={settings.capacity.chargeCurrent}
                      onChange={(e) => handleSettingChange('capacity', 'chargeCurrent', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Current used during capacity test charging</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="capacityDischargeCurrent" className="text-sm font-medium">
                      Discharge Current (A)
                    </label>
                    <Input
                      id="capacityDischargeCurrent"
                      type="number"
                      step="0.1"
                      value={settings.capacity.dischargeCurrent}
                      onChange={(e) => handleSettingChange('capacity', 'dischargeCurrent', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Current used during capacity test discharging</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="restPeriod" className="text-sm font-medium">
                      Rest Period (minutes)
                    </label>
                    <Input
                      id="restPeriod"
                      type="number"
                      value={settings.capacity.restPeriod}
                      onChange={(e) => handleSettingChange('capacity', 'restPeriod', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Rest time between charge and discharge cycles</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cycles" className="text-sm font-medium">
                      Number of Cycles
                    </label>
                    <Input
                      id="cycles"
                      type="number"
                      value={settings.capacity.cycles}
                      onChange={(e) => handleSettingChange('capacity', 'cycles', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Number of charge/discharge cycles for testing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-neutral-100" />
                  General Test Settings
                </CardTitle>
                <CardDescription>
                  Configure general parameters for all battery tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="storageVoltage" className="text-sm font-medium">
                      Storage Voltage (V)
                    </label>
                    <Input
                      id="storageVoltage"
                      type="number"
                      step="0.1"
                      value={settings.general.storageVoltage}
                      onChange={(e) => handleSettingChange('general', 'storageVoltage', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Target voltage for long-term storage</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="maxCellsPerTest" className="text-sm font-medium">
                      Maximum Cells Per Test
                    </label>
                    <Input
                      id="maxCellsPerTest"
                      type="number"
                      value={settings.general.maxCellsPerTest}
                      onChange={(e) => handleSettingChange('general', 'maxCellsPerTest', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Maximum number of cells to test simultaneously</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="logInterval" className="text-sm font-medium">
                      Log Interval (seconds)
                    </label>
                    <Input
                      id="logInterval"
                      type="number"
                      value={settings.general.logInterval}
                      onChange={(e) => handleSettingChange('general', 'logInterval', e.target.value)}
                      className="bg-neutral-700 border-neutral-600"
                    />
                    <p className="text-xs text-neutral-400">Interval between data logging</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Settings;
