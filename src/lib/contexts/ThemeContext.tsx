'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, getStoredTheme, setTheme as setStoredTheme, initializeTheme } from '@/utils/theme';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default to dark
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    // Initialize theme system
    initializeTheme();
    
    // Get the stored theme
    const currentTheme = getStoredTheme();
    console.log('ThemeProvider: Initial theme from storage:', currentTheme);
    
    // Update state
    setThemeState(currentTheme);
    
    // Set the theme class on HTML element directly
    const htmlElement = document.documentElement;
    if (currentTheme === 'dark') {
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
      htmlElement.setAttribute('data-theme', 'light');
    }
    
    setMounted(true);
    
    // Log the current classes on HTML for debugging
    console.log('ThemeProvider: Current HTML classes:', htmlElement.className);
  }, []);

  // Set theme function that updates state and storage
  const setTheme = (newTheme: Theme) => {
    console.log('ThemeProvider: Setting theme to:', newTheme);
    setThemeState(newTheme);
    setStoredTheme(newTheme);
    
    // Set the theme class on HTML element directly (for redundancy)
    const htmlElement = document.documentElement;
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark-theme');
      htmlElement.classList.remove('light-theme');
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.classList.add('light-theme');
      htmlElement.classList.remove('dark-theme');
      htmlElement.setAttribute('data-theme', 'light');
    }
    
    // Log the updated classes on HTML for debugging
    console.log('ThemeProvider: Updated HTML classes:', htmlElement.className);
  };

  // Toggle between dark and light themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('ThemeProvider: Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  // Avoid rendering with incorrect theme
  if (!mounted) {
    // Return a minimal div with the same structure to prevent layout shift
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 