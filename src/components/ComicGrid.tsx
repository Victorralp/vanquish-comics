'use client';

import { Comic } from '@/lib/api/comics';
import Image from 'next/image';
import Link from 'next/link';

interface ComicGridProps {
  comics: Comic[];
}

export default function ComicGrid({ comics }: ComicGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-6">
      {comics.map((comic) => (
        <Link href={`/comics/${comic.id}`} key={comic.id} className="group">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={comic.coverImageUrl || '/images/comic-placeholder.jpg'}
              alt={comic.title || 'Comic cover'}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover"
              priority={false}
              onError={(e) => {
                // Set fallback image if loading fails
                const target = e.target as HTMLImageElement;
                target.src = '/images/comic-placeholder.jpg';
                target.onerror = null; // Prevent infinite error loop
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-sm font-bold line-clamp-2">{comic.title}</h3>
              {comic.issueNumber && (
                <p className="text-xs opacity-75">Issue #{comic.issueNumber}</p>
              )}
            </div>
          </div>
          <h3 className="text-sm font-semibold line-clamp-1">{comic.title}</h3>
          {comic.issueNumber && (
            <p className="text-xs text-gray-400">Issue #{comic.issueNumber}</p>
          )}
        </Link>
      ))}
    </div>
  );
} 