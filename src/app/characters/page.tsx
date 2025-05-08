'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CharacterCard from '@/components/CharacterCard';
import { Character, getAllCharacters, searchCharacters } from '@/lib/api/superhero';

const DEBOUNCE_DELAY = 300; // milliseconds

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12; // Number of characters per page
  
  // Filters
  const [selectedPublisher, setSelectedPublisher] = useState<string>('');
  const [selectedAlignment, setSelectedAlignment] = useState<string>('');

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch characters (either all or search results)
  const fetchCharacters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      
      let fetchedCharacters;
      if (debouncedSearchTerm) {
        // If searching, get all search results without limit
        fetchedCharacters = await searchCharacters(debouncedSearchTerm);
        setTotalCharacters(fetchedCharacters.length);
        setTotalPages(Math.max(1, Math.ceil(fetchedCharacters.length / itemsPerPage)));
        
        // Then slice for the current page (client-side pagination for search results)
        fetchedCharacters = fetchedCharacters.slice(offset, offset + itemsPerPage);
      } else {
        // For initial load, get all characters to know the total count
        // In a production app, we would have a dedicated endpoint for this
        const allCharactersCount = await getAllCharacters();
        setTotalCharacters(allCharactersCount.length);
        setTotalPages(Math.max(1, Math.ceil(allCharactersCount.length / itemsPerPage)));
        
        // Then fetch just the characters for the current page with pagination
        fetchedCharacters = await getAllCharacters(itemsPerPage, offset);
      }
      
      // Apply client-side filters
      let filteredResults = [...fetchedCharacters];
      
      // Filter by publisher if selected
      if (selectedPublisher) {
        filteredResults = filteredResults.filter(char => 
          char.biography.publisher?.toLowerCase() === selectedPublisher.toLowerCase()
        );
      }
      
      // Filter by alignment if selected
      if (selectedAlignment) {
        filteredResults = filteredResults.filter(char => 
          char.biography.alignment?.toLowerCase() === selectedAlignment.toLowerCase()
        );
      }
      
      setCharacters(filteredResults);
    } catch (err: any) {
      console.error('Error fetching characters:', err);
      setError(err.message || 'Failed to load characters.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, selectedPublisher, selectedAlignment, itemsPerPage]);

  // Initialize error state
  const [error, setError] = useState<string | null>(null);

  // Fetch characters when page, search term, or filters change
  useEffect(() => {
    fetchCharacters();
  }, [fetchCharacters]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedPublisher('');
    setSelectedAlignment('');
  };

  // Handle pagination
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

  // Extract unique publishers for the filter from the currently loaded characters
  const publishers = [...new Set(characters
    .map(char => char.biography.publisher)
    .filter(Boolean))]
    .sort();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Character Database
        </motion.h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 sticky top-16 bg-gray-900 py-4 z-40">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="w-full md:w-auto flex-1 flex">
               <div className="relative w-full">
                 <input
                   id="search-input"
                   type="text"
                   placeholder="Search characters..."
                   className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 pl-10"
                   value={searchTerm} // Controlled input
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            
            {/* Filter Toggle Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-4 py-2 transition-colors"
            >
              <FiFilter className="mr-2" />
              <span>Filters</span>
              {(selectedPublisher || selectedAlignment) && (
                <span className="ml-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {(selectedPublisher ? 1 : 0) + (selectedAlignment ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <motion.div 
              className="mt-4 bg-gray-800 rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filter Characters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-yellow-400 hover:text-yellow-300"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Publisher Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Publisher
                  </label>
                  <select
                    value={selectedPublisher}
                    onChange={(e) => setSelectedPublisher(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">All Publishers</option>
                    {publishers.map((publisher) => (
                      <option key={publisher} value={publisher}>
                        {publisher}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Alignment Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Alignment
                  </label>
                  <select
                    value={selectedAlignment}
                    onChange={(e) => setSelectedAlignment(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">All Alignments</option>
                    <option value="good">Good</option>
                    <option value="bad">Evil</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Results count display */}
          {!loading && !error && (
            <div className="text-sm text-gray-400 mt-4">
              Showing {characters.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, totalCharacters)} of {totalCharacters} characters
            </div>
          )}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-yellow-500" size={40} />
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Characters Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
        
        {!loading && !error && characters.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            <p>No characters found.</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center space-x-2">
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentPage === 1 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              aria-label="Previous page"
            >
              <FiChevronLeft className="mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-2 mx-2">
              {getPaginationNumbers().map((page, index) => 
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => goToPage(page as number)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      currentPage === page 
                        ? 'bg-yellow-500 text-black font-medium' 
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentPage === totalPages 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <FiChevronRight className="ml-1" />
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 