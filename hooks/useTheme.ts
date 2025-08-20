import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '../types';
import { lightTheme, darkTheme } from '../utils/theme';
import { saveThemePreference, loadThemePreference } from '../utils/storage';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(systemColorScheme === 'dark');

  useEffect(() => {
    const loadSavedTheme = async () => {
      const savedTheme = await loadThemePreference();
      if (savedTheme !== null) {
        setIsDark(savedTheme);
      }
    };
    loadSavedTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await saveThemePreference(newTheme);
  };

  const setTheme = async (darkMode: boolean) => {
    setIsDark(darkMode);
    await saveThemePreference(darkMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return React.createElement(
    ThemeContext.Provider,
    {
      value: {
        theme,
        isDark,
        toggleTheme,
        setTheme,
      },
    },
    children
  );
};
