'use client';

import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiBookOpen, FiExternalLink } from 'react-icons/fi';

// We'll skip the direct import of the Villain styles to avoid potential issues
// import 'villain-react/dist/style.css';

interface ComicReaderProps {
  comicUrl: string;
}

const ComicReader: React.FC<ComicReaderProps> = ({ comicUrl }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Just set loading to false since we're going to redirect to external page anyway
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [comicUrl]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-secondary">Preparing comic reader...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-secondary rounded-lg text-center">
      <FiAlertCircle className="mx-auto text-accent mb-4" size={48} />
      <h1 className="text-xl font-bold mb-2">External Comic Viewer</h1>
      <p className="text-secondary mb-4">
        Due to technical limitations, we cannot display comics directly in our app.
        Please use the link below to view the comic on the external site.
      </p>
      <div className="mt-4">
        <a 
          href={comicUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-lg font-medium hover:bg-accent-hover transition-colors"
        >
          <FiExternalLink />
          View Comic on External Site
        </a>
      </div>
      <p className="mt-4 text-sm text-gray-400">
        The external site may have additional reader features and options for downloading the comic.
      </p>
    </div>
  );
};

export default ComicReader; 