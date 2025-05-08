'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiHeart } from 'react-icons/fi';
import { useFavorites } from '@/lib/contexts/FavoritesContext';
import { motion } from 'framer-motion';
import { Character } from '@/lib/api/superhero';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isCharacterFavorite = isFavorite(character.id);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCharacterFavorite) {
      await removeFavorite(character.id);
    } else {
      await addFavorite({
        id: character.id,
        name: character.name,
        image: character.image.url
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative"
    >
      <Link href={`/characters/${character.id}`}>
        <div className="relative h-64">
          <Image
            src={character.image.url || '/images/placeholder.jpg'}
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
          
          <button 
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <FiHeart 
              className={`w-5 h-5 ${isCharacterFavorite ? 'text-red-500 fill-red-500' : 'text-white'}`} 
            />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-white mb-1">{character.name}</h3>
          
          <p className="text-gray-400 text-sm mb-3">
            {character.biography.publisher || 'Unknown Publisher'}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {character.biography.alignment === 'good' && (
              <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-xs">Hero</span>
            )}
            {character.biography.alignment === 'bad' && (
              <span className="px-2 py-1 bg-red-900/50 text-red-300 rounded text-xs">Villain</span>
            )}
            {character.biography.alignment === 'neutral' && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded text-xs">Neutral</span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1">
            <div className="text-center">
              <div className="text-sm text-gray-400">Power</div>
              <div className="font-semibold text-yellow-400">{character.powerstats.power}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Strength</div>
              <div className="font-semibold text-yellow-400">{character.powerstats.strength}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Speed</div>
              <div className="font-semibold text-yellow-400">{character.powerstats.speed}</div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 