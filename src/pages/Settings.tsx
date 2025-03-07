
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Battery, TestTube, FlaskConical, Sliders, Save } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChargingSettings from "@/components/settings/ChargingSettings";
import DischargingSettings from "@/components/settings/DischargingSettings";
import ESRSettings from "@/components/settings/ESRSettings";
import CapacitySettings from "@/components/settings/CapacitySettings";
import GeneralSettings from "@/components/settings/GeneralSettings";
import { useSettings } from "@/hooks/useSettings";

const Settings = () => {
  const { settings, activeTab, setActiveTab, handleSettingChange, saveSettings } = useSettings();
  const { toast } = useToast();

  // Handle form submission
  const handleSave = () => {
    saveSettings();
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
            <ChargingSettings 
              settings={settings.charging} 
              onSettingChange={(setting, value) => handleSettingChange('charging', setting, value)} 
            />
          </TabsContent>

          {/* Discharging Settings */}
          <TabsContent value="discharging">
            <DischargingSettings 
              settings={settings.discharging} 
              onSettingChange={(setting, value) => handleSettingChange('discharging', setting, value)} 
            />
          </TabsContent>

          {/* ESR Settings */}
          <TabsContent value="esr">
            <ESRSettings 
              settings={settings.esr} 
              onSettingChange={(setting, value) => handleSettingChange('esr', setting, value)} 
            />
          </TabsContent>

          {/* Capacity Settings */}
          <TabsContent value="capacity">
            <CapacitySettings 
              settings={settings.capacity} 
              onSettingChange={(setting, value) => handleSettingChange('capacity', setting, value)} 
            />
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <GeneralSettings 
              settings={settings.general} 
              onSettingChange={(setting, value) => handleSettingChange('general', setting, value)} 
            />
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
