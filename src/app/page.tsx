'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiChevronRight, FiSearch, FiStar, FiLoader } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ImageWithFallback from '@/components/ImageWithFallback';
import { useEffect, useState } from 'react';
import { Character } from '@/lib/api/superhero';
import { getAllComics, Comic } from '@/lib/api/comics';

export default function Home() {
  const [featuredCharacters, setFeaturedCharacters] = useState<Character[]>([]);
  const [latestComics, setLatestComics] = useState<Comic[]>([]);
  const [loadingCharacters, setLoadingCharacters] = useState(true);
  const [loadingComics, setLoadingComics] = useState(true);
  const [characterError, setCharacterError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoadingCharacters(true);
      setCharacterError(null);
      try {
        const response = await fetch('/api/characters?limit=8');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        }
        const characters: Character[] = await response.json();
        setFeaturedCharacters(characters);
      } catch (error: any) {
        console.error('Error fetching characters via API route:', error);
        setCharacterError(error.message || 'Failed to load featured characters.');
      } finally {
        setLoadingCharacters(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    const fetchComics = async () => {
      setLoadingComics(true);
      try {
        const comics = await getAllComics(4);
        setLatestComics(comics);
      } catch (error) {
        console.error('Error fetching comics:', error);
      } finally {
        setLoadingComics(false);
      }
    };

    fetchComics();
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen max-h-[800px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
        <Image
            src="https://placehold.co/1920x800/111827/eab308?text=Hero+Background"
            alt="Comic heroes background"
            fill
            priority
            className="object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Explore the Universe of <span className="text-yellow-400">Superheroes!</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover thousands of comic book characters, their stories, powers, and more in our extensive database.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link 
                href="/characters" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
              >
                <span>Discover Heroes</span>
                <FiChevronRight className="ml-2" />
              </Link>
              
              <Link 
                href="/search" 
                className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
              >
                <FiSearch className="mr-2" />
                <span>Search Characters</span>
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Animated Comic Panels */}
        <div className="absolute right-0 bottom-0 transform translate-x-1/4 translate-y-1/4 opacity-30 -rotate-12 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="w-96 h-96 border-8 border-yellow-500 bg-yellow-500/10"></div>
          </motion.div>
        </div>
      </section>
      
      {/* Featured Characters Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Characters</h2>
            <Link href="/characters" className="text-yellow-400 hover:text-yellow-300 flex items-center">
              <span>View All</span>
              <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          {loadingCharacters ? (
            <div className="flex justify-center items-center h-64">
              <FiLoader className="animate-spin text-yellow-500" size={32} />
            </div>
          ) : characterError ? (
             <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg">
                Error loading characters: {characterError}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredCharacters.map((character) => (
                <motion.div 
                  key={character.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-lg group"
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
                      <h3 className="text-xl font-semibold text-white group-hover:text-yellow-400 transition-colors">{character.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {character.biography.publisher || 'Unknown Publisher'}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Universe Sections */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Explore Comic Universes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Marvel Universe - Using Local Image */}
            <motion.div 
              className="relative h-80 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/marvel.png"
                alt="Marvel Universe"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/90 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-3xl font-bold mb-2">Marvel Universe</h3>
                <p className="text-gray-200 mb-4">Explore characters from the Marvel Comics universe.</p>
                <Link 
                  href="/universe/marvel" 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded inline-block transition-colors"
                >
                  Explore Marvel
                </Link>
              </div>
            </motion.div>
            
            {/* DC Universe - Using Local Image */}
            <motion.div 
              className="relative h-80 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/images/DC.jpg"
                alt="DC Universe"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-3xl font-bold mb-2">DC Universe</h3>
                <p className="text-gray-200 mb-4">Discover characters from the DC Comics universe.</p>
                <Link 
                  href="/universe/dc" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded inline-block transition-colors"
                >
                  Explore DC
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Latest Comics Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest Comics</h2>
            <Link href="/comics" className="text-yellow-400 hover:text-yellow-300 flex items-center">
              <span>View All</span>
              <FiChevronRight className="ml-1" />
            </Link>
          </div>
          
          {loadingComics ? (
            <div className="flex justify-center items-center h-64">
              <FiLoader className="animate-spin text-yellow-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestComics.map((comic) => (
                <motion.div 
                  key={comic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
                >
                  <Link href={`/comics/${comic.id}`}>
                    <div className="relative aspect-[2/3]">
                      <Image
                        src={comic.coverImageUrl}
                        alt={comic.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-medium">{comic.title}</h3>
                      {comic.issueNumber && (
                        <p className="text-sm text-gray-400">Issue #{comic.issueNumber}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-yellow-500 text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Hero Journey Today!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create an account to track your favorite heroes, get personalized recommendations, and more.
          </p>
          <Link 
            href="/signup" 
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold inline-block transition-colors"
          >
            Sign Up Now
          </Link>
    </div>
      </section>
      
      <Footer />
    </main>
  );
}
