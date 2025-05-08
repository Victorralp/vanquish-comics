// Theme management utility

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'vanquish-comics-theme';

// Get the current theme from localStorage (defaults to dark)
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'; // Default to dark on server
  
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  
  // If no theme stored or invalid, default to dark
  if (!storedTheme || !['dark', 'light'].includes(storedTheme)) {
    return 'dark';
  }
  
  console.log('Retrieved theme from storage:', storedTheme);
  return storedTheme;
}

// Set the theme in localStorage and apply it
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  console.log('Setting theme to:', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
}

// Toggle between dark and light themes
export function toggleTheme(): Theme {
  const currentTheme = getStoredTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  console.log('Toggling theme from', currentTheme, 'to', newTheme);
  setTheme(newTheme);
  return newTheme;
}

// Apply the theme to the document
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  console.log('Applying theme:', theme, 'to document root');
  
  if (theme === 'dark') {
    root.classList.add('dark-theme');
    root.classList.remove('light-theme');
    // Set a data attribute for easier debugging
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.add('light-theme');
    root.classList.remove('dark-theme');
    // Set a data attribute for easier debugging
    root.setAttribute('data-theme', 'light');
  }
  
  // Force a repaint to ensure styles apply
  document.body.style.display = 'none';
  document.body.offsetHeight; // Trigger a reflow
  document.body.style.display = '';
  
  // Log the current classes on the root element to confirm
  console.log('Document root classes after theme change:', root.className);
}

// Initialize theme on app load
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  
  console.log('Initializing theme');
  const theme = getStoredTheme();
  console.log('Initial theme:', theme);
  applyTheme(theme);
} 