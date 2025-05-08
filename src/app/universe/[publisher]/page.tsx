'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiLoader, FiUsers } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CharacterCard from '@/components/CharacterCard';
import { Character } from '@/lib/api/superhero';

// Mapping from URL slug to Publisher name used in API data
const publisherMap: { [key: string]: string } = {
  marvel: 'Marvel Comics',
  dc: 'DC Comics',
  // Add other publishers here if needed
};

export default function UniversePage() {
  const params = useParams();
  const publisherSlug = params?.publisher as string;
  const publisherName = publisherMap[publisherSlug] || 'Unknown Universe';

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!publisherSlug || !publisherMap[publisherSlug]) {
        setError(`Invalid universe specified: ${publisherSlug}`);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Use the new API route instead of filtering client-side
        const response = await fetch(`/api/universe/${publisherSlug}`);
        
        if (!response.ok) {
          throw new Error(`Error loading ${publisherName} characters. Status: ${response.status}`);
        }
        
        const data = await response.json();
        setCharacters(data);
      } catch (err) {
        console.error(`Error fetching ${publisherName} characters:`, err);
        setError(`Failed to load characters for ${publisherName}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [publisherSlug, publisherName]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-12 pt-24">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-yellow-400 flex items-center">
           <FiUsers className="mr-3" /> {publisherName} Characters
        </h1>

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

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {characters.map((character) => (
              <CharacterCard key={character.id} character={character} />
            ))}
          </div>
        )}
        
        {!loading && !error && characters.length === 0 && (
           <div className="text-center text-gray-500 mt-12">
             <p>No characters found for {publisherName}.</p>
           </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 