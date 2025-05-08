'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiLoader, FiAlertCircle } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getComicById } from '@/lib/api/comic-books-api';
import { Comic } from '@/lib/api/mock-comics';
import { addToHistory } from '@/components/ReadingHistory';
import { Button } from '@/components/ui/button';
import ComicReader from '@/components/ComicReader';

export default function ComicReaderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? parseInt(params.id as string, 10) : null;
  const [comic, setComic] = useState<Comic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readUrl, setReadUrl] = useState<string | null>(null);

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
          
          // Find a valid reading URL
          const readOnlineUrl = fetchedComic.downloadLinks?.READONLINE;
          if (readOnlineUrl) {
            setReadUrl(readOnlineUrl);
          } else {
            setError('No readable version available for this comic.');
          }
          
          // Add to reading history
          addToHistory({
            id: fetchedComic.id,
            title: fetchedComic.title || 'Unknown Title',
            image: fetchedComic.coverImageUrl,
            type: 'comic',
            url: `/comics/read/${fetchedComic.id}`
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

  // Handle network errors and redirect
  const handleGoBack = () => {
    router.push(`/comics/${id}`);
  };

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6 pt-24">
        <div className="mb-6 flex justify-between items-center">
          <Link href={`/comics/${id}`} className="inline-flex items-center text-secondary hover:text-primary">
            <FiArrowLeft className="mr-2" />
            Back to Comic Details
          </Link>
          
          {comic && (
            <div className="text-xl font-semibold text-accent truncate max-w-[70%]">
              {comic.title}
              {comic.issueNumber && <span className="ml-2">#{comic.issueNumber}</span>}
            </div>
          )}
        </div>

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
                  <p>We're having trouble connecting to our comic data sources. Some features may be unavailable.</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <FiLoader className="animate-spin text-accent" size={40} />
          </div>
        ) : error ? (
          <div className="bg-secondary rounded-lg p-8 text-center">
            <FiAlertCircle className="mx-auto text-accent mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-4">{error}</h1>
            <p className="text-secondary mb-6">
              {error === 'No readable version available for this comic.' 
                ? 'This comic doesn\'t have a readable version on our platform. Try downloading it from the comic details page.'
                : 'There was an error loading the comic reader. Please try again later.'}
            </p>
            <Button
              onClick={handleGoBack}
              className="bg-accent text-black px-6 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Return to Comic Details
            </Button>
          </div>
        ) : readUrl ? (
          <div className="bg-secondary p-4 rounded-lg shadow-xl overflow-hidden min-h-[600px]">
            <ComicReader comicUrl={readUrl} />
          </div>
        ) : (
          <div className="bg-secondary rounded-lg p-8 text-center">
            <FiAlertCircle className="mx-auto text-accent mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-4">Comic Not Available</h1>
            <p className="text-secondary mb-6">
              This comic is not available for reading directly in our app.
              Please check the download options on the comic details page.
            </p>
            <Button
              onClick={handleGoBack}
              className="bg-accent text-black px-6 py-2 rounded-lg font-medium hover:bg-accent-hover transition-colors"
            >
              Return to Comic Details
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 