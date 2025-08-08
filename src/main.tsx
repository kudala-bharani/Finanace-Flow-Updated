import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set dark mode class before React renders
(function() {
  try {
    const stored = localStorage.getItem('user_settings');
    let theme = 'dark'; // default
    if (stored) {
      const settings = JSON.parse(stored);
      if (settings.theme === 'light' || settings.theme === 'system') {
        theme = settings.theme;
      }
    }
    console.log('[main.tsx] Pre-React theme:', theme);
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    console.log('[main.tsx] <html> classes after set:', document.documentElement.className);
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    console.log('[main.tsx] Error, forced dark mode. <html> classes:', document.documentElement.className);
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
