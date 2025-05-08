'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useFavorites } from '@/lib/contexts/FavoritesContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // Check if user is not logged in and has no favorites
  useEffect(() => {
    if (!user && favorites.length === 0) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
    }
  }, [user, favorites]);

  // Animation variants for cards
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Favorite Characters
        </motion.h1>
        
        {/* Login Prompt */}
        {showLoginPrompt && (
          <motion.div 
            className="bg-gray-800 rounded-lg p-8 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FiHeart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">Save Your Favorites</h2>
            <p className="text-gray-300 mb-6">
              Create an account to save your favorite characters across devices and sessions.
              Logged in users can access their favorites from anywhere!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Log In
              </Link>
              <Link 
                href="/signup" 
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
        
        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {favorites.map((character) => (
              <motion.div 
                key={character.id}
                variants={item}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative group"
              >
                <Link href={`/characters/${character.id}`}>
                  <div className="relative h-64">
                    <Image
                      src={character.image || '/images/placeholder.jpg'}
                      alt={character.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-white">{character.name}</h3>
                  </div>
                </Link>
                
                {/* Remove button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(character.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-red-600 transition-colors group-hover:opacity-100 opacity-0 focus:opacity-100"
                  aria-label={`Remove ${character.name} from favorites`}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : !showLoginPrompt && (
          <div className="text-center py-12 bg-gray-800 rounded-lg max-w-2xl mx-auto">
            <FiHeart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">No Favorites Yet</h2>
            <p className="text-gray-300 mb-6">
              You haven't added any characters to your favorites yet.
              Browse the character database and click the heart icon to add them here!
            </p>
            <Link 
              href="/characters" 
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              Explore Characters
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
} 