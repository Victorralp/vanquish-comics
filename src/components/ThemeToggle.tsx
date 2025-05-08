'use client';

import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/contexts/ThemeContext';

type ThemeToggleProps = {
  className?: string;
  variant?: 'icon' | 'button';
};

export default function ThemeToggle({ 
  className = '', 
  variant = 'icon' 
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isDark 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
            : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? <FiSun className="mr-1" /> : <FiMoon className="mr-1" />}
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative h-8 w-8 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
        isDark ? 'text-yellow-400' : 'text-blue-700'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </motion.div>
    </button>
  );
} 