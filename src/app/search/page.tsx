'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowLeft, FiLoader, FiBook, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Character } from '@/lib/api/superhero';
import { Comic } from '@/lib/api/comics';
import { searchCharacters } from '@/lib/api/superhero';
import { searchComics } from '@/lib/api/comics';

type SearchTab = 'all' | 'characters' | 'comics';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // All fetched data
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [allComics, setAllComics] = useState<Comic[]>([]);
  
  // Pagination states
  const [currentCharacterPage, setCurrentCharacterPage] = useState(1);
  const [currentComicPage, setCurrentComicPage] = useState(1);
  const [totalCharactersCount, setTotalCharactersCount] = useState(0);
  const [totalComicsCount, setTotalComicsCount] = useState(0);
  
  const itemsPerPage = 12;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  // Calculate total pages
  const totalCharacterPages = Math.max(1, Math.ceil(allCharacters.length / itemsPerPage));
  const totalComicsPages = Math.max(1, Math.ceil(allComics.length / itemsPerPage));

  // When changing tabs, reset pagination
  useEffect(() => {
    setCurrentCharacterPage(1);
    setCurrentComicPage(1);
  }, [activeTab]);

  useEffect(() => {
    async function fetchResults() {
      if (!query) {
        setAllCharacters([]);
        setAllComics([]);
        setLoading(false);
        setError(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch both characters and comics in parallel without limits
        const [charactersResponse, comicsResponse] = await Promise.allSettled([
          searchCharacters(query), // No limit - get all matching characters
          searchComics(query)      // No limit - get all matching comics
        ]);
        
        // Handle character results
        if (charactersResponse.status === 'fulfilled') {
          console.log(`Found ${charactersResponse.value.length} characters matching "${query}"`);
          setAllCharacters(charactersResponse.value);
          setTotalCharactersCount(charactersResponse.value.length);
        } else {
          console.error('Error searching characters:', charactersResponse.reason);
          setAllCharacters([]);
          setTotalCharactersCount(0);
        }
        
        // Handle comic results
        if (comicsResponse.status === 'fulfilled') {
          console.log(`Found ${comicsResponse.value.length} comics matching "${query}"`);
          setAllComics(comicsResponse.value);
          setTotalComicsCount(comicsResponse.value.length);
        } else {
          console.error('Error searching comics:', comicsResponse.reason);
          setAllComics([]);
          setTotalComicsCount(0);
        }
        
        // Set error if both searches failed
        if (charactersResponse.status === 'rejected' && comicsResponse.status === 'rejected') {
          setError('Failed to perform search. Please try again.');
        }
      } catch (err: any) {
        console.error('Error performing search:', err);
        setError(err.message || 'Failed to perform search.');
        setAllCharacters([]);
        setAllComics([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  // Get paginated data for display
  const paginatedCharacters = allCharacters.slice(
    (currentCharacterPage - 1) * itemsPerPage,
    currentCharacterPage * itemsPerPage
  );

  const paginatedComics = allComics.slice(
    (currentComicPage - 1) * itemsPerPage,
    currentComicPage * itemsPerPage
  );

  // Get the appropriate results based on the active tab
  const getVisibleResults = () => {
    if (activeTab === 'characters') return { 
      characters: paginatedCharacters, 
      comics: [],
      totalCharacters: allCharacters.length,
      totalComics: 0,
      currentCharPage: currentCharacterPage,
      totalCharPages: totalCharacterPages,
      currentComicsPage: 1,
      totalComicsPages: 1
    };
    
    if (activeTab === 'comics') return { 
      characters: [], 
      comics: paginatedComics,
      totalCharacters: 0,
      totalComics: allComics.length,
      currentCharPage: 1,
      totalCharPages: 1,
      currentComicsPage: currentComicPage,
      totalComicsPages: totalComicsPages
    };
    
    return { 
      characters: paginatedCharacters, 
      comics: paginatedComics,
      totalCharacters: allCharacters.length,
      totalComics: allComics.length,
      currentCharPage: currentCharacterPage,
      totalCharPages: totalCharacterPages,
      currentComicsPage: currentComicPage,
      totalComicsPages: totalComicsPages
    }; // 'all' tab
  };

  const { 
    characters: visibleCharacters, 
    comics: visibleComics,
    totalCharacters,
    totalComics,
    currentCharPage,
    totalCharPages,
    currentComicsPage,
    totalComicsPages: totalComicsPagesValue
  } = getVisibleResults();
  
  const totalResults = totalCharacters + totalComics;

  // Pagination functions
  const handlePreviousCharacterPage = () => {
    if (currentCharacterPage > 1) {
      setCurrentCharacterPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextCharacterPage = () => {
    if (currentCharacterPage < totalCharacterPages) {
      setCurrentCharacterPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousComicPage = () => {
    if (currentComicPage > 1) {
      setCurrentComicPage(prev => prev - 1);
      if (activeTab === 'comics') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleNextComicPage = () => {
    if (currentComicPage < totalComicsPagesValue) {
      setCurrentComicPage(prev => prev + 1);
      if (activeTab === 'comics') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Generate pagination numbers
  const getPaginationNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('ellipsis');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 pt-24">
        <div className="flex items-center mb-8">
          <Link href="/" className="mr-4 text-gray-400 hover:text-white">
            <FiArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">Search Results</h1>
        </div>
        
        <div className="mb-10 max-w-2xl">
          <SearchBar placeholder="Search again..." className="mb-4" />
          {query && !loading && !error && (
            <p className="text-gray-400">
              Results for: <span className="text-white font-medium">"{query}"</span>
              {totalResults > 0 && <span className="ml-2">({totalResults} results)</span>}
            </p>
          )}
          {error && <p className="text-red-400 mt-2">Error: {error}</p>}
        </div>
        
        {/* Category Tabs */}
        {query && !loading && (
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'all'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setActiveTab('characters')}
              className={`px-6 py-3 font-medium text-sm flex items-center ${
                activeTab === 'characters'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiUser className="mr-2" />
              Characters
              {totalCharacters > 0 && <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full">{totalCharacters}</span>}
            </button>
            <button
              onClick={() => setActiveTab('comics')}
              className={`px-6 py-3 font-medium text-sm flex items-center ${
                activeTab === 'comics'
                  ? 'text-yellow-500 border-b-2 border-yellow-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiBook className="mr-2" />
              Comics
              {totalComics > 0 && <span className="ml-2 text-xs bg-gray-700 px-2 py-1 rounded-full">{totalComics}</span>}
            </button>
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-yellow-500" size={40} />
          </div>
        )}

        {/* Character Results */}
        {!loading && visibleCharacters.length > 0 && (
          <div className="mb-12">
            {activeTab === 'all' && <h2 className="text-2xl font-bold mb-6">Characters</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {visibleCharacters.map((character) => (
                <motion.div 
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/characters/${character.id}`}>
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={character.image.url}
                        alt={character.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {character.biography.publisher || 'Unknown Publisher'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Character Pagination */}
            {(activeTab === 'characters' || activeTab === 'all') && totalCharPages > 1 && (
              <div className="mt-6 flex justify-center items-center">
                <button
                  onClick={handlePreviousCharacterPage}
                  disabled={currentCharPage === 1}
                  className={`flex items-center px-3 py-1 rounded-md mr-2 ${
                    currentCharPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <FiChevronLeft size={18} />
                  <span className="ml-1">Prev</span>
                </button>
                
                <div className="flex space-x-1 mx-2">
                  {getPaginationNumbers(currentCharPage, totalCharPages).map((page, index) => 
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentCharacterPage(page as number)}
                        className={`px-3 py-1 rounded-md ${
                          currentCharPage === page
                            ? 'bg-yellow-500 text-black font-medium'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                
                <button
                  onClick={handleNextCharacterPage}
                  disabled={currentCharPage === totalCharPages}
                  className={`flex items-center px-3 py-1 rounded-md ml-2 ${
                    currentCharPage === totalCharPages
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-1">Next</span>
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Comic Results */}
        {!loading && visibleComics.length > 0 && (
          <div>
            {activeTab === 'all' && <h2 className="text-2xl font-bold mb-6">Comics</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {visibleComics.map((comic) => (
                <motion.div 
                  key={comic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/comics/${comic.id}`}>
                    <div className="relative h-64">
                      <ImageWithFallback
                        src={comic.coverImageUrl}
                        alt={comic.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white">{comic.title}</h3>
                      {comic.issueNumber && (
                        <p className="text-yellow-400 text-sm mt-1">
                          Issue #{comic.issueNumber}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Comic Pagination */}
            {(activeTab === 'comics' || activeTab === 'all') && totalComicsPagesValue > 1 && (
              <div className="mt-6 flex justify-center items-center">
                <button
                  onClick={handlePreviousComicPage}
                  disabled={currentComicsPage === 1}
                  className={`flex items-center px-3 py-1 rounded-md mr-2 ${
                    currentComicsPage === 1
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <FiChevronLeft size={18} />
                  <span className="ml-1">Prev</span>
                </button>
                
                <div className="flex space-x-1 mx-2">
                  {getPaginationNumbers(currentComicsPage, totalComicsPagesValue).map((page, index) => 
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => setCurrentComicPage(page as number)}
                        className={`px-3 py-1 rounded-md ${
                          currentComicsPage === page
                            ? 'bg-yellow-500 text-black font-medium'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                
                <button
                  onClick={handleNextComicPage}
                  disabled={currentComicsPage === totalComicsPagesValue}
                  className={`flex items-center px-3 py-1 rounded-md ml-2 ${
                    currentComicsPage === totalComicsPagesValue
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  <span className="mr-1">Next</span>
                  <FiChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && totalResults === 0 && (
          <div className="text-center py-20">
            {query ? (
              <>
                <FiSearch className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">No results found</h2>
                <p className="text-gray-400 mb-8">
                  Try searching for another character, comic, or check your spelling.
                </p>
              </>
            ) : (
              <>
                <FiSearch className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Search for characters and comics</h2>
                <p className="text-gray-400 mb-8">
                  Enter a search term to find your favorite characters and comics.
                </p>
              </>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
} 