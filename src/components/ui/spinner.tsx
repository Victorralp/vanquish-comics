'use client';

import { cn } from '@/lib/utils';
import { FiLoader } from 'react-icons/fi';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Spinner({ size = 'medium', className }: SpinnerProps) {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 40,
  };
  
  return (
    <FiLoader 
      size={sizeMap[size]} 
      className={cn('animate-spin text-yellow-500', className)} 
    />
  );
} 