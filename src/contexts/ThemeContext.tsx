import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';
interface ThemeValue {
  theme: Theme;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeValue | undefined>(undefined);

function loadTheme(): Theme {
  try {
    return window.localStorage.getItem('workout-theme') === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(loadTheme);
  const toggleTheme = useCallback(() => setTheme((current) => current === 'light' ? 'dark' : 'light'), []);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('workout-theme', theme);
    } catch {
      // Việc đổi màu không phụ thuộc vào quyền truy cập localStorage.
    }
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const context = useContext(ThemeContext);
  if (context === undefined) throw new Error('useTheme phải được dùng bên trong ThemeProvider');
  return context;
}
