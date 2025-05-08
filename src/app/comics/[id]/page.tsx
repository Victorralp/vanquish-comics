'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiLoader, FiCalendar, FiUsers, FiUser, FiTag, FiAlertCircle, FiDownload, FiExternalLink, FiBookOpen } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getComicById } from '@/lib/api/comic-books-api';
import { Comic } from '@/lib/api/mock-comics'; // Import Comic type from mock-comics
import { addToHistory } from '@/components/ReadingHistory';
import ReadingHistory from '@/components/ReadingHistory';

// Helper function to format date
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Helper function to handle placeholder images
const getImageUrl = (url: string | undefined): string => {
  if (!url || url.includes('image_not_available') || url.includes('placehold.co/400x600/111827/ffffff')) {
    return 'https://placehold.co/400x600/111827/ffffff?text=No+Cover';
  }
  return url;
};

export default function ComicDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchComic = async () => {
      if (!id) {
        setError('Invalid comic ID.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching comic with ID: ${id}`);
        const fetchedComic = await getComicById(id);
        console.log('Comic data received:', fetchedComic);
        
        if (fetchedComic) {
          setComic(fetchedComic);
          
          // Add to reading history
          addToHistory({
            id: fetchedComic.id,
            title: fetchedComic.title || 'Unknown Title',
            image: getImageUrl(fetchedComic.coverImageUrl),
            type: 'comic',
            url: `/comics/${fetchedComic.id}`
          });
        } else {
          console.error('No comic data returned for ID:', id);
          setError('Comic not found or data could not be loaded.');
        }
      } catch (err: any) {
        console.error('Error fetching comic:', err);
        setError(err.message || 'Failed to load comic details.');
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [id]);

  // Handle invalid or missing comic data
  if (!loading && (!comic || error)) {
    return (
      <div className="min-h-screen bg-primary text-primary">
        <Navbar />
        <main className="container mx-auto px-4 py-12 pt-24">
          <Link href="/comics" className="inline-flex items-center text-secondary hover:text-primary mb-6">
            <FiArrowLeft className="mr-2" />
            Back to Comics
          </Link>

          <div className="bg-secondary rounded-lg p-8 text-center">
            <FiAlertCircle className="mx-auto text-accent mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-4">
              {error || "Comic not found"}
            </h1>
            <p className="text-secondary mb-6">
              The comic you're looking for could not be found or there was an error loading it.
            </p>
            <button
              onClick={() => router.push('/comics')}
              className="bg-accent text-black px-6 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Browse Comics
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <Link href="/comics" className="inline-flex items-center text-secondary hover:text-primary">
            <FiArrowLeft className="mr-2" />
            Back to Comics
          </Link>
          
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-accent hover:text-accent-hover text-sm underline"
          >
            {showHistory ? 'Hide Reading History' : 'View Reading History'}
          </button>
        </div>

        {showHistory && (
          <div className="mb-6">
            <ReadingHistory 
              limit={3} 
              onClose={() => setShowHistory(false)}
            />
          </div>
        )}

        {/* Network Error Alert */}
        {comic?._source === 'error' || comic?._source === 'error_fallback_mock' || comic?._source === 'offline_mock' ? (
          <div className="bg-yellow-800 text-yellow-200 p-4 rounded-lg mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-300">Network Connection Issue</h3>
                <div className="mt-2 text-sm text-yellow-200">
                  <p>We're having trouble connecting to our comic data sources. The application is currently using offline data. 
                  Some features like reading comics online may be unavailable.</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-accent" size={40} />
          </div>
        ) : comic && (
          <div className="bg-secondary rounded-lg shadow-xl overflow-hidden">
             <div className="flex flex-col md:flex-row">
                {/* Left: Cover Image */}
                <div className="md:w-1/3 flex-shrink-0 p-4 md:p-6">
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={getImageUrl(comic.coverImageUrl)}
                      alt={`Cover for ${comic.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority
                    />
                  </div>
                </div>
                
                {/* Right: Details */}
                <div className="md:w-2/3 p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-accent">{comic.title}</h1>
                  {comic.issueNumber && (
                    <p className="text-xl text-secondary mb-4">Issue #{comic.issueNumber}</p>
                  )}
                  
                  <div className="prose prose-invert max-w-none">
                    {comic.description ? (
                      <div 
                        className="text-secondary mb-6 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: comic.description }}
                      />
                    ) : (
                      <p className="text-muted italic mb-6">No description available.</p>
                    )}
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2 text-accent" />
                      <span>Release Date: {formatDate(comic.releaseDate)}</span>
                    </div>
                    
                    {comic.creators?.writer && comic.creators.writer.length > 0 && (
                      <div className="flex items-start">
                        <FiUser className="mr-2 mt-1 text-accent" />
                        <div>
                          <span className="font-semibold">Writer:</span> 
                          <span className="ml-1">{comic.creators.writer.join(', ')}</span>
                        </div>
                      </div>
                    )}
                    {comic.creators?.artist && comic.creators.artist.length > 0 && (
                      <div className="flex items-start">
                        <FiUser className="mr-2 mt-1 text-accent" />
                        <div>
                           <span className="font-semibold">Artist:</span> 
                           <span className="ml-1">{comic.creators.artist.join(', ')}</span>
                        </div>
                      </div>
                    )}
                     {comic.creators?.coverArtist && comic.creators.coverArtist.length > 0 && (
                      <div className="flex items-start">
                        <FiUser className="mr-2 mt-1 text-accent" />
                        <div>
                          <span className="font-semibold">Cover Artist:</span> 
                          <span className="ml-1">{comic.creators.coverArtist.join(', ')}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured Characters */}
                  {comic.featuredCharacters && comic.featuredCharacters.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-theme">
                      <h2 className="text-lg font-semibold mb-3 flex items-center">
                        <FiUsers className="mr-2 text-accent" /> Featured Characters
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {comic.featuredCharacters.map((char: { id: number; name: string }) => (
                          <Link 
                            key={char.id} 
                            href={`/characters/${char.id}`}
                            className="bg-tertiary hover:bg-accent hover:text-black text-sm px-3 py-1 rounded-full transition-colors"
                           >
                            {char.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {comic.genres && comic.genres.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-theme">
                      <h2 className="text-lg font-semibold mb-3 flex items-center">
                        <FiTag className="mr-2 text-accent" /> Genres
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {comic.genres.map((genre, index) => (
                          <span 
                            key={index} 
                            className="bg-tertiary text-sm px-3 py-1 rounded-full"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {comic.downloadLinks && Object.keys(comic.downloadLinks).length > 0 ? (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold text-yellow-400 mb-4">Download Options</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Add a Read Comic button if READONLINE exists */}
                        {comic.downloadLinks?.READONLINE && (
                          <Link 
                            href={`/comics/read/${comic.id}`}
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 p-3 rounded-lg transition-colors"
                          >
                            <FiBookOpen className="text-white" />
                            <span className="font-medium text-white">Read Comic</span>
                          </Link>
                        )}
                        
                        {Object.entries(comic.downloadLinks).map(([provider, link]) => (
                          <a 
                            key={provider}
                            href={link as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                          >
                            {provider === 'READONLINE' ? (
                              <FiExternalLink className="text-yellow-400" />
                            ) : (
                              <FiDownload className="text-yellow-400" />
                            )}
                            <span className="font-medium">{provider}</span>
                          </a>
                        ))}
                      </div>
                      
                      {/* Existing additional info section */}
                      <div className="mt-4 text-sm text-gray-400">
                        {comic.additionalInfo && (
                          <div className="flex flex-wrap gap-4">
                            {Object.entries(comic.additionalInfo).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-1">
                                <span className="font-medium">{key}:</span>
                                <span>{value as string}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-semibold text-yellow-400 mb-2">How to Read</h3>
                      <p className="text-gray-300 mb-4">
                        Direct download links aren't available for this comic. You can try these options:
                      </p>
                      <ul className="list-disc pl-5 text-gray-300 space-y-2">
                        <li>Search for this title on <a href="https://getcomics.info" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">GetComics.info</a></li>
                        <li>Check your local comic book store or digital providers like ComiXology</li>
                        <li>Browse other comics in our collection</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 