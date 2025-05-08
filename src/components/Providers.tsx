'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { FavoritesProvider } from '@/lib/contexts/FavoritesContext';
import { ThemeProvider } from '@/lib/contexts/ThemeContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 