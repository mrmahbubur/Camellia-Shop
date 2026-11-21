import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'mrs_theme';

const getSystemPrefersDark = (): boolean => {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

function applyThemeToDocument(resolvedTheme: ResolvedTheme): void {
  if (typeof document === 'undefined') return;
  const isDark = resolvedTheme === 'dark';
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.setAttribute('data-theme', resolvedTheme);
  root.style.colorScheme = resolvedTheme;

  const themeMetas = document.querySelectorAll('meta[name="theme-color"]');
  themeMetas.forEach((meta) => {
    meta.setAttribute('content', isDark ? '#020617' : '#f8fafc');
  });
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // storage unavailable
    }
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(getSystemPrefersDark);

  const syncSystemPreference = useCallback(() => {
    setSystemPrefersDark(getSystemPrefersDark());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);

    setSystemPrefersDark(media.matches);

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onChange);
    } else if (typeof media.addListener === 'function') {
      media.addListener(onChange);
    }

    const onVisibilityOrFocus = () => {
      syncSystemPreference();
    };
    const onStorageSync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark' || e.newValue === 'system')) {
        setThemeModeState(e.newValue);
      }
    };

    window.addEventListener('focus', onVisibilityOrFocus);
    document.addEventListener('visibilitychange', onVisibilityOrFocus);
    window.addEventListener('storage', onStorageSync);

    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', onChange);
      } else if (typeof media.removeListener === 'function') {
        media.removeListener(onChange);
      }
      window.removeEventListener('focus', onVisibilityOrFocus);
      document.removeEventListener('visibilitychange', onVisibilityOrFocus);
      window.removeEventListener('storage', onStorageSync);
    };
  }, [syncSystemPreference]);

  const systemTheme: ResolvedTheme = systemPrefersDark ? 'dark' : 'light';
  const resolvedTheme: ResolvedTheme = themeMode === 'system' ? systemTheme : themeMode;

  useEffect(() => {
    applyThemeToDocument(resolvedTheme);

    try {
      localStorage.setItem(STORAGE_KEY, themeMode);
    } catch {
      // storage unavailable
    }
  }, [themeMode, resolvedTheme]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    const nextResolved: ResolvedTheme = mode === 'system' ? (getSystemPrefersDark() ? 'dark' : 'light') : mode;
    applyThemeToDocument(nextResolved);
  }, []);

  const cycleThemeMode = useCallback(() => {
    setThemeModeState((prev) =>
      prev === 'system' ? 'light' : prev === 'light' ? 'dark' : 'system'
    );
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        systemTheme,
        setThemeMode,
        cycleThemeMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
