'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiLoader, FiStar, FiUser, FiBriefcase, FiUsers, FiBookOpen, FiEye, FiHeart, FiBarChart2 } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageWithFallback from '@/components/ImageWithFallback';
import { Character } from '@/lib/api/superhero';
import { useFavorites } from '@/lib/contexts/FavoritesContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { addToHistory } from '@/components/ReadingHistory';
import ReadingHistory from '@/components/ReadingHistory';

// Helper function to render detail items consistently
const DetailItem = ({ label, value }: { label: string; value: string | string[] | undefined | null }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    value = 'N/A';
  }
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  return (
    <div>
      <span className="font-semibold text-secondary">{label}:</span>
      <span className="ml-2 text-primary">{displayValue}</span>
    </div>
  );
};

// Helper to format the powerstats as percentages
const formatStat = (stat: string | undefined | null): number => {
  if (!stat || stat === 'null') return 0;
  const numStat = parseInt(stat);
  return isNaN(numStat) ? 0 : Math.max(0, Math.min(100, numStat)); // Ensure value is between 0 and 100
};

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string; // Keep id as string for API route
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [isCharacterFavorite, setIsCharacterFavorite] = useState(false);

  useEffect(() => {
    if (character) {
      setIsCharacterFavorite(isFavorite(parseInt(character.id, 10)));
    }
  }, [character, isFavorite]);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) {
        return; // Wait for id to be available
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/characters/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const fetchedCharacter: Character = await response.json();
        setCharacter(fetchedCharacter);
        
        // Add to reading history
        if (fetchedCharacter) {
          addToHistory({
            id: parseInt(fetchedCharacter.id, 10),
            title: fetchedCharacter.name,
            image: fetchedCharacter.image?.url || '',
            type: 'character',
            url: `/characters/${fetchedCharacter.id}`
          });
        }
      } catch (err: any) {
        console.error('Error fetching character via API route:', err);
        setError(err.message || 'Failed to load character details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Only fetch when id is available
        fetchCharacter();
    }
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!character || !id) return;
    
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return; // Ensure ID is a number for context

    const minimalCharacter = {
      id: numericId, // Use numeric ID for context
      name: character.name,
      image: character.image?.url || '' 
    };

    setLoading(true); // Consider a different loading state for favorites?
    try {
      if (isCharacterFavorite) {
        await removeFavorite(numericId);
        setIsCharacterFavorite(false);
      } else {
        await addFavorite(minimalCharacter);
        setIsCharacterFavorite(true);
      }
    } catch (favError) {
      console.error("Error updating favorites:", favError);
    } finally {
       setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <Link href="/characters" className="inline-flex items-center text-secondary hover:text-primary">
            <FiArrowLeft className="mr-2" />
            Back to Characters
          </Link>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push(`/compare?char1=${id}`)}
              className="inline-flex items-center px-4 py-2 bg-tertiary hover:bg-accent hover:text-black rounded-lg transition-colors text-sm"
            >
              <FiBarChart2 className="mr-2" />
              Compare
            </button>
            
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-accent hover:text-accent-hover text-sm underline"
            >
              {showHistory ? 'Hide Reading History' : 'View Reading History'}
            </button>
          </div>
        </div>
        
        {showHistory && (
          <div className="mb-6">
            <ReadingHistory 
              limit={3} 
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-accent" size={40} />
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && character && (
          <div className="bg-secondary rounded-lg shadow-xl p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 flex-shrink-0">
                 <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md mb-4">
                   <ImageWithFallback
                    src={character.image.url}
                    alt={character.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                   {user && (
                      <button 
                        onClick={handleFavoriteToggle}
                        disabled={loading}
                        className={`absolute top-3 right-3 p-2.5 bg-black/60 rounded-full hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10 ${loading ? 'animate-pulse' : ''}`}
                        aria-label={isCharacterFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <FiHeart 
                          className={`w-5 h-5 transition-all ${isCharacterFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
                        />
                      </button>
                   )}
                 </div>
              </div>
              <div className="lg:w-2/3">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-accent">{character.name}</h1>
                <p className="text-xl text-secondary mb-6">{character.biography['full-name'] || 'Real name unknown'}</p>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FiStar className="mr-2 text-accent" /> Powerstats
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {Object.entries(character.powerstats).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize text-secondary">{key}</span>
                          <span className="text-muted">{value || 'N/A'}</span>
                        </div>
                        <div className="w-full bg-tertiary rounded-full h-2.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-accent to-accent-hover h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${formatStat(value)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                     <FiBookOpen className="mr-2 text-accent" /> Biography
                  </h2>
                  <div className="space-y-2 text-sm">
                    <DetailItem label="Alter Egos" value={character.biography['alter-egos']} />
                    <DetailItem label="Aliases" value={character.biography.aliases} />
                    <DetailItem label="Place of Birth" value={character.biography['place-of-birth']} />
                    <DetailItem label="First Appearance" value={character.biography['first-appearance']} />
                    <DetailItem label="Publisher" value={character.biography.publisher} />
                    <DetailItem label="Alignment" value={character.biography.alignment} />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FiEye className="mr-2 text-accent" /> Appearance
                  </h2>
                  <div className="space-y-2 text-sm">
                    <DetailItem label="Gender" value={character.appearance.gender} />
                    <DetailItem label="Race" value={character.appearance.race} />
                    <DetailItem label="Height" value={character.appearance.height?.[1]} />
                    <DetailItem label="Weight" value={character.appearance.weight?.[1]} />
                    <DetailItem label="Eye Color" value={character.appearance['eye-color']} />
                    <DetailItem label="Hair Color" value={character.appearance['hair-color']} />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FiBriefcase className="mr-2 text-accent" /> Work
                  </h2>
                  <div className="space-y-2 text-sm">
                    <DetailItem label="Occupation" value={character.work.occupation} />
                    <DetailItem label="Base" value={character.work.base} />
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <FiUsers className="mr-2 text-accent" /> Connections
                  </h2>
                  <div className="space-y-2 text-sm">
                    <DetailItem label="Group Affiliation" value={character.connections['group-affiliation']} />
                    <DetailItem label="Relatives" value={character.connections.relatives} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 