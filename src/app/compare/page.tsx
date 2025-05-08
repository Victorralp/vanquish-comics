'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiLoader, FiSearch, FiRefreshCw, FiX, FiAward } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Character } from '@/lib/api/superhero';
import { searchCharacters } from '@/lib/api/superhero';
import { compareAttributes, getTotalWins, calculatePowerLevel } from '@/utils/characterUtils';
import { logPageView } from '@/utils/analytics';

export default function ComparePage() {
  const searchParams = useSearchParams();
  const char1Id = searchParams.get('char1');
  const char2Id = searchParams.get('char2');
  
  const [character1, setCharacter1] = useState<Character | null>(null);
  const [character2, setCharacter2] = useState<Character | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search functionality
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');
  const [searchResults1, setSearchResults1] = useState<Character[]>([]);
  const [searchResults2, setSearchResults2] = useState<Character[]>([]);
  const [searchLoading1, setSearchLoading1] = useState(false);
  const [searchLoading2, setSearchLoading2] = useState(false);
  
  // Fetch characters when IDs are in URL
  useEffect(() => {
    const fetchCharacters = async () => {
      // Log page view
      logPageView('Character Comparison');
      
      if (char1Id) {
        setLoading1(true);
        try {
          const response = await fetch(`/api/characters/${char1Id}`);
          if (!response.ok) throw new Error(`Failed to fetch character 1`);
          const data = await response.json();
          setCharacter1(data);
        } catch (err) {
          console.error('Error fetching character 1:', err);
          setError(`Failed to load character 1`);
        } finally {
          setLoading1(false);
        }
      }
      
      if (char2Id) {
        setLoading2(true);
        try {
          const response = await fetch(`/api/characters/${char2Id}`);
          if (!response.ok) throw new Error(`Failed to fetch character 2`);
          const data = await response.json();
          setCharacter2(data);
        } catch (err) {
          console.error('Error fetching character 2:', err);
          setError(`Failed to load character 2`);
        } finally {
          setLoading2(false);
        }
      }
    };
    
    fetchCharacters();
  }, [char1Id, char2Id]);
  
  // Search handler for character 1
  const handleSearch1 = async () => {
    if (!searchTerm1.trim()) return;
    
    setSearchLoading1(true);
    try {
      const results = await searchCharacters(searchTerm1);
      setSearchResults1(results);
    } catch (err) {
      console.error('Error searching characters:', err);
    } finally {
      setSearchLoading1(false);
    }
  };
  
  // Search handler for character 2
  const handleSearch2 = async () => {
    if (!searchTerm2.trim()) return;
    
    setSearchLoading2(true);
    try {
      const results = await searchCharacters(searchTerm2);
      setSearchResults2(results);
    } catch (err) {
      console.error('Error searching characters:', err);
    } finally {
      setSearchLoading2(false);
    }
  };
  
  // Handle character selection from search results
  const selectCharacter1 = (character: Character) => {
    setCharacter1(character);
    setSearchResults1([]);
    setSearchTerm1('');
  };
  
  const selectCharacter2 = (character: Character) => {
    setCharacter2(character);
    setSearchResults2([]);
    setSearchTerm2('');
  };
  
  // Clear selected character
  const clearCharacter1 = () => {
    setCharacter1(null);
  };
  
  const clearCharacter2 = () => {
    setCharacter2(null);
  };
  
  // Calculate comparison data
  const comparisonData = useMemo(() => {
    if (!character1 || !character2) return null;
    return compareAttributes(character1, character2);
  }, [character1, character2]);
  
  // Calculate win totals
  const [char1Wins, char2Wins, ties] = useMemo(() => {
    if (!character1 || !character2) return [0, 0, 0];
    return getTotalWins(character1, character2);
  }, [character1, character2]);
  
  // Handle form submission
  const handleKeyDown1 = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch1();
    }
  };
  
  const handleKeyDown2 = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch2();
    }
  };
  
  // Generate share URL
  const shareUrl = useMemo(() => {
    if (!character1 || !character2) return '';
    
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/compare` 
      : '/compare';
      
    return `${baseUrl}?char1=${character1.id}&char2=${character2.id}`;
  }, [character1, character2]);
  
  // Copy share URL to clipboard
  const copyShareUrl = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Comparison URL copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy URL:', err);
      });
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-12 pt-24">
        <Link href="/characters" className="inline-flex items-center text-secondary hover:text-primary mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Characters
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Character Comparison</h1>
          <p className="text-secondary">Compare stats and abilities between two super heroes or villains.</p>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}
        
        {/* Character Selection Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Character 1 Selection */}
          <div className="bg-secondary rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Character 1</h2>
            
            {character1 ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative flex-shrink-0 rounded overflow-hidden">
                  <ImageWithFallback
                    src={character1.image.url}
                    alt={character1.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{character1.name}</p>
                  <p className="text-sm text-secondary">
                    {character1.biography.publisher || 'Unknown publisher'}
                  </p>
                </div>
                <button 
                  onClick={clearCharacter1}
                  className="p-2 hover:bg-tertiary rounded-full text-secondary hover:text-primary"
                  aria-label="Clear selection"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={searchTerm1}
                    onChange={(e) => setSearchTerm1(e.target.value)}
                    onKeyDown={handleKeyDown1}
                    placeholder="Search for a character..."
                    className="flex-1 p-2 bg-tertiary border border-theme rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={handleSearch1}
                    disabled={searchLoading1}
                    className="bg-accent hover:bg-accent-hover text-black px-4 py-2 rounded-r-lg flex items-center"
                  >
                    {searchLoading1 ? <FiLoader className="animate-spin" /> : <FiSearch />}
                  </button>
                </div>
                
                {searchResults1.length > 0 && (
                  <div className="mt-2 border border-theme rounded-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults1.map((character) => (
                        <button
                          key={character.id}
                          onClick={() => selectCharacter1(character)}
                          className="w-full p-2 hover:bg-tertiary flex items-center text-left border-b border-theme last:border-none"
                        >
                          <div className="w-8 h-8 relative flex-shrink-0 mr-2 rounded overflow-hidden">
                            <ImageWithFallback
                              src={character.image.url}
                              alt={character.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{character.name}</div>
                            <div className="text-xs text-secondary">
                              {character.biography.publisher || 'Unknown publisher'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Character 2 Selection */}
          <div className="bg-secondary rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Character 2</h2>
            
            {character2 ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 relative flex-shrink-0 rounded overflow-hidden">
                  <ImageWithFallback
                    src={character2.image.url}
                    alt={character2.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{character2.name}</p>
                  <p className="text-sm text-secondary">
                    {character2.biography.publisher || 'Unknown publisher'}
                  </p>
                </div>
                <button 
                  onClick={clearCharacter2}
                  className="p-2 hover:bg-tertiary rounded-full text-secondary hover:text-primary"
                  aria-label="Clear selection"
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={searchTerm2}
                    onChange={(e) => setSearchTerm2(e.target.value)}
                    onKeyDown={handleKeyDown2}
                    placeholder="Search for a character..."
                    className="flex-1 p-2 bg-tertiary border border-theme rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={handleSearch2}
                    disabled={searchLoading2}
                    className="bg-accent hover:bg-accent-hover text-black px-4 py-2 rounded-r-lg flex items-center"
                  >
                    {searchLoading2 ? <FiLoader className="animate-spin" /> : <FiSearch />}
                  </button>
                </div>
                
                {searchResults2.length > 0 && (
                  <div className="mt-2 border border-theme rounded-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      {searchResults2.map((character) => (
                        <button
                          key={character.id}
                          onClick={() => selectCharacter2(character)}
                          className="w-full p-2 hover:bg-tertiary flex items-center text-left border-b border-theme last:border-none"
                        >
                          <div className="w-8 h-8 relative flex-shrink-0 mr-2 rounded overflow-hidden">
                            <ImageWithFallback
                              src={character.image.url}
                              alt={character.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{character.name}</div>
                            <div className="text-xs text-secondary">
                              {character.biography.publisher || 'Unknown publisher'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Comparison Section */}
        {character1 && character2 && comparisonData && (
          <div className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-8">
            <div className="p-4 bg-tertiary border-b border-theme">
              <div className="flex flex-wrap items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {character1.name} vs {character2.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={copyShareUrl}
                    className="px-4 py-2 bg-accent hover:bg-accent-hover text-black rounded-lg text-sm font-medium"
                  >
                    Share Comparison
                  </button>
                </div>
              </div>
            </div>
            
            {/* Overall Winner Banner */}
            <div className="p-4 border-b border-theme bg-opacity-30 flex flex-wrap items-center justify-center gap-4 text-center">
              <div className="flex items-center">
                <FiAward className="text-accent mr-2" size={24} />
                <div>
                  <div className="text-lg font-semibold">Overall Stats:</div>
                  <div>
                    <span className={char1Wins > char2Wins ? 'text-accent font-bold' : ''}>
                      {character1.name}: {char1Wins} wins
                    </span>
                    {' • '}
                    <span className={char2Wins > char1Wins ? 'text-accent font-bold' : ''}>
                      {character2.name}: {char2Wins} wins
                    </span>
                    {' • '}
                    <span className="text-secondary">{ties} ties</span>
                  </div>
                </div>
              </div>
              
              {char1Wins !== char2Wins && (
                <div className="bg-accent/20 px-4 py-2 rounded-full">
                  <span className="font-bold">
                    {char1Wins > char2Wins ? character1.name : character2.name} wins!
                  </span>
                </div>
              )}
            </div>
            
            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-3 p-4">
              <div className="col-span-1 text-center">
                <div className="w-32 h-40 relative mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                  <ImageWithFallback
                    src={character1.image.url}
                    alt={character1.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{character1.name}</h3>
                <p className="text-secondary text-sm">
                  {character1.biography.publisher || 'Unknown publisher'}
                </p>
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <div className="text-center px-4 py-2 bg-tertiary rounded-full text-xl font-bold">
                  VS
                </div>
              </div>
              
              <div className="col-span-1 text-center">
                <div className="w-32 h-40 relative mx-auto mb-4 rounded-lg overflow-hidden shadow-md">
                  <ImageWithFallback
                    src={character2.image.url}
                    alt={character2.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{character2.name}</h3>
                <p className="text-secondary text-sm">
                  {character2.biography.publisher || 'Unknown publisher'}
                </p>
              </div>
            </div>
            
            {/* Detailed Comparison */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-tertiary">
                    <th className="p-3 text-left">Attribute</th>
                    <th className="p-3 text-center">{character1.name}</th>
                    <th className="p-3 text-center">{character2.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr key={index} className="border-t border-theme hover:bg-tertiary/50">
                      <td className="p-3 font-medium">{item.attribute}</td>
                      <td 
                        className={`p-3 text-center ${item.winner === 1 ? 'font-bold text-accent' : ''}`}
                      >
                        {item.char1Value}
                      </td>
                      <td 
                        className={`p-3 text-center ${item.winner === 2 ? 'font-bold text-accent' : ''}`}
                      >
                        {item.char2Value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-theme text-center text-sm text-secondary">
              Data provided by superhero API. Power levels are calculated based on available stats.
            </div>
          </div>
        )}
        
        {/* Prompt to select characters if none selected */}
        {(!character1 || !character2) && (
          <div className="bg-secondary rounded-lg p-8 text-center">
            <FiRefreshCw className="mx-auto text-accent mb-4" size={40} />
            <h2 className="text-xl font-semibold mb-2">
              {!character1 && !character2 
                ? 'Select two characters to compare' 
                : !character1 
                  ? 'Select the first character' 
                  : 'Select the second character'}
            </h2>
            <p className="text-secondary mb-4">
              Use the search boxes above to find and select two characters you'd like to compare.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 