'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: 'light' | 'dark';
}>({
  theme: 'system',
  setTheme: () => {},
  resolved: 'light',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' && localStorage.getItem('pf-theme')) as Theme | null;
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && m.matches);
      root.classList.toggle('dark', isDark);
      setResolved(isDark ? 'dark' : 'light');
    };
    apply();
    m.addEventListener('change', apply);
    return () => m.removeEventListener('change', apply);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('pf-theme', t);
    } catch {
      /* ignore */
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
