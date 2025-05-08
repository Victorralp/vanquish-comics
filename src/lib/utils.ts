import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names with Tailwind's merge functionality
 * This prevents duplicate utility classes and properly handles conflicting ones
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 