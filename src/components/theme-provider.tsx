import {createContext, useContext, useEffect, useState} from 'react';

export enum THEME {
  DARK = 'dark',
  LIGHT = 'light',
  SYSTEM = 'system',
}

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: THEME;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: THEME;
  setTheme: (theme: THEME) => void;
};

const initialState: ThemeProviderState = {
  theme: THEME.SYSTEM,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = THEME.SYSTEM,
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<THEME>(
    () => (localStorage.getItem(storageKey) as THEME) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: THEME) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
