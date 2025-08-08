import { useEffect } from 'react';

export function useApplyTheme(theme: 'light' | 'dark' | 'system') {
  useEffect(() => {
    console.log('[useApplyTheme] Applying theme:', theme);
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
      document.documentElement.classList.toggle('light', !prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.classList.toggle('light', theme === 'light');
    }
    console.log('[useApplyTheme] <html> classes after set:', document.documentElement.className);
  }, [theme]);
} 