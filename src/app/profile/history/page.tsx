'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/contexts/AuthContext';
import { FiClock, FiArrowLeft, FiFilter, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getHistory, clearHistory, HistoryItem } from '@/components/ReadingHistory';

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'comic' | 'character'>('all');
  
  // Load all history
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Filter and search history items
  const filteredHistory = history.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  // Clear all history
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire reading history?')) {
      clearHistory();
      setHistory([]);
    }
  };
  
  // Remove single history item
  const removeItem = (id: number, type: string) => {
    const updatedHistory = history.filter(item => !(item.id === id && item.type === type));
    localStorage.setItem('vanquish-comics-history', JSON.stringify(updatedHistory));
    setHistory(updatedHistory);
  };
  
  // Group history by date
  const groupedHistory: Record<string, HistoryItem[]> = {};
  
  filteredHistory.forEach(item => {
    const date = new Date(item.timestamp);
    const dateKey = date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
    
    if (!groupedHistory[dateKey]) {
      groupedHistory[dateKey] = [];
    }
    
    groupedHistory[dateKey].push(item);
  });
  
  // Format time from timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <Link href="/profile" className="inline-flex items-center text-secondary hover:text-primary mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Profile
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold flex items-center">
              <FiClock className="mr-3 text-accent" />
              Reading History
            </h1>
            
            {history.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-sm text-red-400 hover:text-red-300 flex items-center px-3 py-1 rounded border border-red-400 hover:border-red-300"
              >
                <FiTrash2 className="mr-2" />
                Clear All History
              </button>
            )}
          </div>
          
          {history.length > 0 ? (
            <>
              <div className="bg-secondary p-4 rounded-lg shadow-md mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="text-muted" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-tertiary border border-theme rounded-lg py-2 px-4 pl-10 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FiFilter className="text-accent" />
                    <div className="flex border border-theme rounded-lg overflow-hidden">
                      <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-2 text-sm ${filterType === 'all' ? 'bg-accent text-black font-medium' : 'text-muted hover:text-primary'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterType('comic')}
                        className={`px-3 py-2 text-sm ${filterType === 'comic' ? 'bg-accent text-black font-medium' : 'text-muted hover:text-primary'}`}
                      >
                        Comics
                      </button>
                      <button
                        onClick={() => setFilterType('character')}
                        className={`px-3 py-2 text-sm ${filterType === 'character' ? 'bg-accent text-black font-medium' : 'text-muted hover:text-primary'}`}
                      >
                        Characters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="bg-secondary p-8 rounded-lg shadow-md text-center">
                  <p className="text-muted">No matching items found</p>
                </div>
              ) : (
                Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date} className="mb-8">
                    <h2 className="text-lg font-medium text-secondary mb-4 border-b border-theme pb-2">{date}</h2>
                    <div className="bg-secondary rounded-lg shadow-md overflow-hidden">
                      <ul className="divide-y divide-theme">
                        {items.map(item => (
                          <li key={`${item.type}-${item.id}`} className="flex hover:bg-tertiary">
                            <Link 
                              href={item.url}
                              className="flex-1 flex items-center p-4 group"
                            >
                              <div className="w-16 h-20 relative flex-shrink-0 bg-tertiary rounded overflow-hidden">
                                {item.image ? (
                                  <Image 
                                    src={item.image} 
                                    alt={item.title}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-tertiary text-muted">
                                    <span className="text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="ml-4 flex-1">
                                <p className="text-primary font-medium group-hover:text-accent transition-colors">
                                  {item.title}
                                </p>
                                <div className="flex items-center text-xs text-muted mt-1">
                                  <span className="capitalize px-2 py-0.5 bg-tertiary rounded-full mr-2">
                                    {item.type}
                                  </span>
                                  <span>{formatTime(item.timestamp)}</span>
                                </div>
                              </div>
                            </Link>
                            
                            <button
                              onClick={() => removeItem(item.id, item.type)}
                              className="px-4 text-muted hover:text-red-400 flex items-center"
                              aria-label="Remove from history"
                            >
                              <FiTrash2 />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div className="bg-secondary p-8 rounded-lg shadow-md text-center">
              <p className="text-muted mb-4">Your reading history is empty</p>
              <Link 
                href="/comics"
                className="inline-block px-4 py-2 bg-accent hover:bg-accent-hover text-black rounded-lg font-medium transition-colors"
              >
                Browse Comics
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 