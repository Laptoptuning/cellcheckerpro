
import { useState, useEffect } from 'react';
import { CellTestSettings, defaultSettings } from '@/types/settings';

// Load settings from localStorage or use defaults
const loadSettings = (): CellTestSettings => {
  const storedSettings = localStorage.getItem('cellTestSettings');
  return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<CellTestSettings>(loadSettings());
  const [activeTab, setActiveTab] = useState("charging");

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
        ...settings[category as keyof CellTestSettings],
        [setting]: numValue,
      },
    });
  };

  // Handle form submission
  const saveSettings = () => {
    localStorage.setItem('cellTestSettings', JSON.stringify(settings));
    return true;
  };

  return {
    settings,
    activeTab,
    setActiveTab,
    handleSettingChange,
    saveSettings,
  };
};
