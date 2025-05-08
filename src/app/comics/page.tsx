'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiLoader, FiBookOpen, FiChevronLeft, FiChevronRight, FiSearch, FiClock, FiX, FiMaximize2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllComics, searchComics, Comic } from '@/lib/api/comics';
import VirtualizedList from '@/components/VirtualizedList';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import ComicGrid from '@/components/ComicGrid';
import Pagination from '@/components/Pagination';
import { logSearch } from '@/utils/analytics';
import PublisherSelector from '@/components/PublisherSelector';
import { getComicsByPublisher } from '@/lib/api/comic-books-api';

// Define a hook for debouncing values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// Function to store search history in localStorage
const saveSearchHistory = (term: string) => {
  try {
    if (!term.trim()) return;
    
    const MAX_HISTORY = 10;
    const key = 'vanquish-comics-search-history';
    const existingHistory = JSON.parse(localStorage.getItem(key) || '[]');
    
    // Remove the term if it exists already (to avoid duplicates)
    const filteredHistory = existingHistory.filter((item: string) => item !== term);
    
    // Add the new term at the beginning
    const newHistory = [term, ...filteredHistory].slice(0, MAX_HISTORY);
    
    localStorage.setItem(key, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
};

// Function to get search history from localStorage
const getSearchHistory = (): string[] => {
  try {
    const key = 'vanquish-comics-search-history';
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

export default function ComicsListPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComics, setTotalComics] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(48); // Default items per page
  const [showAllResults, setShowAllResults] = useState(false); // New state for toggling unlimited results
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('title-asc');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState('all');
  
  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Reference to search input for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Load search history from localStorage on component mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);
  
  // Apply sorting to comics
  const sortComics = useCallback((comicsToSort: Comic[]) => {
    return [...comicsToSort].sort((a, b) => {
      switch (sortOption) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'date-asc':
          return new Date(a.releaseDate || '1900-01-01').getTime() - new Date(b.releaseDate || '1900-01-01').getTime();
        case 'date-desc':
          return new Date(b.releaseDate || '1900-01-01').getTime() - new Date(a.releaseDate || '1900-01-01').getTime();
        default:
          return 0;
      }
    });
  }, [sortOption]);
  
  // Apply sorting when sortOption changes
  useEffect(() => {
    const sorted = sortComics(comics);
    setFilteredComics(sorted);
  }, [comics, sortComics]);

  // Load comics on initial render or when page changes
  useEffect(() => {
    // Skip fetching on initial load if search is active
    if (isSearchActive) return;
    
    const fetchComics = async () => {
      setLoading(true);
      setError(null);
      try {
        if (selectedPublisher === 'all') {
          // Fetch all comics
          if (showAllResults) {
            // Fetch all comics at once with no limit
            const allComics = await getAllComics();
            setTotalComics(allComics.length);
            setComics(allComics);
            setTotalPages(1); // Only one page when showing all
          } else {
            // Calculate offset based on current page for paginated results
            const offset = (currentPage - 1) * itemsPerPage;
            
            // Fetch all comics first to get total count
            const allComics = await getAllComics();
            setTotalComics(allComics.length);
            const calculatedTotalPages = Math.max(1, Math.ceil(allComics.length / itemsPerPage));
            setTotalPages(calculatedTotalPages);
            
            // Fetch paginated comics with the itemsPerPage value
            const fetchedComics = await getAllComics(itemsPerPage, offset);
            setComics(fetchedComics);
          }
        } else {
          // Fetch comics by publisher
          const publisherComics = await getComicsByPublisher(selectedPublisher, currentPage);
          setComics(publisherComics);
          setTotalComics(publisherComics.length);
          
          if (showAllResults) {
            setTotalPages(1);
          } else {
            setTotalPages(Math.max(1, Math.ceil(publisherComics.length / itemsPerPage)));
          }
        }
      } catch (err: any) {
        console.error('Error fetching comics:', err);
        setError(err.message || 'Failed to load comics.');
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, [currentPage, itemsPerPage, showAllResults, selectedPublisher, isSearchActive]);
  
  // Auto-search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.trim().length >= 2) {
      handleSearch();
    }
  }, [debouncedSearchTerm]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0); // Scroll to top when changing page
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0); // Scroll to top when changing page
    }
  };

  // Function to handle direct page jumps
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than max, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Otherwise show a window around current page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're near the end
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Add first page
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis');
        }
      }
      
      // Add pages in the middle
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add last page
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Toggle between showing all results and paginated results
  const toggleShowAllResults = () => {
    setShowAllResults(prev => !prev);
    setCurrentPage(1); // Reset to first page
  };

  // Handle search form submission
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search is cleared, reset to normal browsing
      setIsSearchActive(false);
      setCurrentPage(1);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Save to search history
      saveSearchHistory(searchTerm);
      setSearchHistory(getSearchHistory());
      
      // Log the search event
      logSearch(searchTerm, 'comics');
      
      // Search without a limit to get all matching results
      const results = await searchComics(searchTerm);
      
      // Sort the results
      const sortedResults = sortComics(results);
      
      // Update comics and pagination
      setComics(results);
      setFilteredComics(sortedResults);
      setTotalComics(results.length);
      
      if (showAllResults) {
        setTotalPages(1); // Only one page when showing all
      } else {
        setTotalPages(Math.max(1, Math.ceil(results.length / itemsPerPage)));
      }
      
      setCurrentPage(1);
      setIsSearchActive(true);
      setShowHistory(false);
      
      // Log analytics with result count
      logSearch(searchTerm, 'comics', results.length);
      
    } catch (err: any) {
      console.error('Error searching comics:', err);
      setError(err.message || 'Failed to search comics.');
    } finally {
      setLoading(false);
    }
  };

  // Handle key press in search input (search on Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Focus search history on down arrow
    if (e.key === 'ArrowDown' && searchHistory.length > 0) {
      e.preventDefault();
      setShowHistory(true);
      const historyItems = document.querySelectorAll('.search-history-item');
      if (historyItems.length > 0) {
        (historyItems[0] as HTMLElement).focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowHistory(false);
    }
  };

  // Clear search and return to browsing all comics
  const handleClearSearch = () => {
    setSearchTerm('');
    setIsSearchActive(false);
    setCurrentPage(1);
    // Set focus back to input
    searchInputRef.current?.focus();
  };
  
  // Select a search from history
  const selectHistoryItem = (term: string) => {
    setSearchTerm(term);
    setShowHistory(false);
    // Trigger search immediately
    setTimeout(() => handleSearch(), 0);
    // Set focus back to input
    searchInputRef.current?.focus();
  };
  
  // Clear search history
  const clearSearchHistory = () => {
    localStorage.removeItem('vanquish-comics-search-history');
    setSearchHistory([]);
    setShowHistory(false);
  };

  // Get comics for the current view
  const displayedComics = (() => {
    if (showAllResults) {
      return filteredComics; // Show all comics without pagination
    } else {
      // Show paginated results
      return filteredComics.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
      );
    }
  })();
  
  // Shortcut for search focus (Ctrl+/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 flex items-center">
            <FiBookOpen className="mr-3" /> Comic Books
          </h1>
          
          {!loading && !error && (
            <div className="text-sm text-gray-400">
              {showAllResults ? (
                <span>Showing all {totalComics} comics</span>
              ) : (
                <span>
                  Showing {filteredComics.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                  {Math.min(currentPage * itemsPerPage, totalComics)} of {totalComics} comics
                </span>
              )}
              {isSearchActive && <span className="ml-1">for "{searchTerm}"</span>}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <Input
                  ref={searchInputRef}
                  placeholder="Search comics... (Ctrl+/)"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length > 0) {
                      setShowHistory(true);
                    } else {
                      setShowHistory(false);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchTerm && setShowHistory(true)}
                  onBlur={(e) => {
                    // Don't hide history if clicking a history item
                    if (!e.relatedTarget?.classList.contains('search-history-item')) {
                      setTimeout(() => setShowHistory(false), 200);
                    }
                  }}
                  className="w-full pl-10 pr-10"
                />
                {searchTerm && (
                  <button 
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <span className="sr-only">Clear search</span>
                    <FiX />
                  </button>
                )}
              </div>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search History Dropdown */}
            {showHistory && searchHistory.length > 0 && (
              <div className="absolute z-10 mt-1 w-full md:w-[calc(100%-208px)] bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
                <div className="p-2 border-b border-gray-700 flex justify-between items-center">
                  <span className="text-sm text-gray-400 flex items-center">
                    <FiClock className="mr-1" /> Recent Searches
                  </span>
                  <button 
                    onClick={clearSearchHistory}
                    className="text-xs text-gray-400 hover:text-red-400"
                  >
                    Clear History
                  </button>
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {searchHistory.map((term, index) => (
                    <li key={`${term}-${index}`}>
                      <button
                        className="search-history-item w-full text-left px-4 py-2 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none"
                        onClick={() => selectHistoryItem(term)}
                        tabIndex={0}
                      >
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-gray-400" />
                          <span>{term}</span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <PublisherSelector 
              selectedPublisher={selectedPublisher}
              onSelectPublisher={(publisher) => {
                setSelectedPublisher(publisher);
                setCurrentPage(1); // Reset to first page when changing publisher
              }}
            />
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <FiSearch />
              <span>Search</span>
            </Button>
            {isSearchActive && (
              <Button 
                variant="outline" 
                onClick={handleClearSearch}
                className="ml-2"
              >
                Clear Search
              </Button>
            )}
            <Button
              variant={showAllResults ? "default" : "outline"}
              onClick={toggleShowAllResults}
              className="ml-2 flex items-center gap-2"
            >
              <FiMaximize2 />
              <span>{showAllResults ? "Show Paginated" : "Show All Results"}</span>
            </Button>
            <div className="ml-auto text-xs text-gray-400 italic hidden md:block">
              Press Ctrl+/ to focus search
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : filteredComics.length === 0 ? (
          <div className="text-center py-12">
            {isSearchActive 
              ? `No comics found matching "${searchTerm}"`
              : "No comics found"
            }
          </div>
        ) : filteredComics.length > 100 && !showAllResults ? (
          <div className="h-[800px] w-full">
            <VirtualizedList
              data={displayedComics}
              itemHeight={300}
              height={800}
              className="mb-8"
              renderItem={(comic) => (
                <div className="p-2">
                  <Link href={`/comics/${comic.id}`} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 transition-transform duration-300 group-hover:scale-105">
                      <Image
                        src={comic.coverImageUrl || '/images/comic-placeholder.jpg'} 
                        alt={comic.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="text-sm font-medium truncate group-hover:text-yellow-400 transition-colors">{comic.title}</h3>
                    {comic.issueNumber && (
                      <p className="text-xs text-gray-400">Issue #{comic.issueNumber}</p>
                    )}
                  </Link>
                </div>
              )}
            />
            {!showAllResults && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <ComicGrid comics={displayedComics} />
            {!showAllResults && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
} 