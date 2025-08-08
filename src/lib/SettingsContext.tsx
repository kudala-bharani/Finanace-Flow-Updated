import React, { createContext, useState, useEffect } from 'react';

const defaultSettings = {
  preferredCurrency: 'USD',
  conversionEnabled: true,
  conversionCurrency: 'INR',
  theme: 'dark', // changed from 'system' to 'dark'
};

export const SettingsContext = createContext({
  settings: defaultSettings,
  setSettings: (s: typeof defaultSettings) => {},
  resetSettings: () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettingsState] = useState(() => {
    const stored = localStorage.getItem('user_settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
  }, [settings]);

  const setSettings = (newSettings: typeof defaultSettings) => {
    setSettingsState(newSettings);
  };

  const resetSettings = () => {
    setSettingsState(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}; 