'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';
import { FiClock, FiEye, FiTrash2, FiChevronRight, FiX } from 'react-icons/fi';

// Interface for history item
export interface HistoryItem {
  id: number;
  title: string;
  image: string;
  timestamp: number;
  type: 'comic' | 'character';
  url: string;
}

// Maximum number of items to store in history
const MAX_HISTORY_ITEMS = 50;

// Local storage key for history data
const HISTORY_KEY = 'vanquish-comics-history';

// Function to add item to history
export function addToHistory(item: Omit<HistoryItem, 'timestamp'>): void {
  if (typeof window === 'undefined') return;

  try {
    // Get existing history
    const history = getHistory();
    
    // Check if item already exists
    const existingIndex = history.findIndex(h => h.id === item.id && h.type === item.type);
    
    if (existingIndex > -1) {
      // Remove existing entry to move it to the top
      history.splice(existingIndex, 1);
    }
    
    // Add new item with current timestamp
    const newItem: HistoryItem = {
      ...item,
      timestamp: Date.now()
    };
    
    // Add to beginning of array
    history.unshift(newItem);
    
    // Limit history size
    if (history.length > MAX_HISTORY_ITEMS) {
      history.length = MAX_HISTORY_ITEMS;
    }
    
    // Save to localStorage
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
  } catch (error) {
    console.error('Error adding item to history:', error);
  }
}

// Function to get history items
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error retrieving history:', error);
    return [];
  }
}

// Function to clear history
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

interface ReadingHistoryProps {
  limit?: number;
  showTitle?: boolean;
  onClose?: () => void;
}

export default function ReadingHistory({ 
  limit = 5, 
  showTitle = true,
  onClose
}: ReadingHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useAuth();
  
  // Load history on component mount
  useEffect(() => {
    setHistory(getHistory().slice(0, limit));
    
    // Listen for storage events (in case history is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) {
        setHistory(getHistory().slice(0, limit));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [limit]);
  
  // Function to remove an item from history
  const removeItem = (id: number, type: string) => {
    const updatedHistory = history.filter(item => !(item.id === id && item.type === type));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };
  
  // Function to clear all history
  const handleClearAll = () => {
    clearHistory();
    setHistory([]);
  };
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  if (history.length === 0) {
    return (
      <div className="p-4 bg-secondary rounded-lg shadow-md">
        {showTitle && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FiClock className="mr-2 text-accent" />
              Reading History
            </h3>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-muted hover:text-primary"
              >
                <FiX />
              </button>
            )}
          </div>
        )}
        <p className="text-muted text-center py-4">No reading history yet</p>
      </div>
    );
  }
  
  return (
    <div className="bg-secondary rounded-lg shadow-md overflow-hidden">
      {showTitle && (
        <div className="flex justify-between items-center p-4 border-b border-theme">
          <h3 className="text-lg font-semibold flex items-center">
            <FiClock className="mr-2 text-accent" />
            Reading History
          </h3>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-sm text-red-400 hover:text-red-300 flex items-center"
              >
                <FiTrash2 className="mr-1" />
                Clear All
              </button>
            )}
            {onClose && (
              <button 
                onClick={onClose}
                className="text-muted hover:text-primary"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>
      )}
      
      <ul className="divide-y divide-theme">
        {history.map(item => (
          <li key={`${item.type}-${item.id}`} className="flex hover:bg-tertiary">
            <Link 
              href={item.url}
              className="flex-1 flex items-center p-3 group"
            >
              <div className="w-12 h-16 relative flex-shrink-0 bg-tertiary rounded overflow-hidden">
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-tertiary text-muted">
                    <FiEye size={20} />
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-primary font-medium truncate group-hover:text-accent transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center text-xs text-muted mt-1">
                  <span className="capitalize">{item.type}</span>
                  <span className="mx-1">•</span>
                  <span>{formatDate(item.timestamp)}</span>
                </div>
              </div>
              
              <FiChevronRight className="text-muted group-hover:text-accent mr-2" />
            </Link>
            
            <button
              onClick={() => removeItem(item.id, item.type)}
              className="px-3 text-muted hover:text-red-400 flex items-center"
              aria-label="Remove from history"
            >
              <FiTrash2 />
            </button>
          </li>
        ))}
      </ul>
      
      {history.length > 0 && history.length === limit && (
        <div className="p-3 text-center border-t border-theme">
          <Link 
            href="/profile/history" 
            className="text-accent hover:text-accent-hover text-sm font-medium"
          >
            View All History
          </Link>
        </div>
      )}
    </div>
  );
} 