'use client';

import { useState } from 'react';
import { FiBook } from 'react-icons/fi';

interface PublisherSelectorProps {
  onSelectPublisher: (publisher: string) => void;
  selectedPublisher: string;
}

export default function PublisherSelector({ 
  onSelectPublisher, 
  selectedPublisher 
}: PublisherSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const publishers = [
    { id: 'all', name: 'All Publishers' },
    { id: 'marvel', name: 'Marvel Comics' },
    { id: 'dc', name: 'DC Comics' },
    { id: 'image', name: 'Image Comics' },
    { id: 'dark horse', name: 'Dark Horse' },
    { id: 'idw', name: 'IDW Publishing' },
    { id: 'boom studios', name: 'Boom Studios' },
    { id: 'dynamite', name: 'Dynamite' },
    { id: 'valiant', name: 'Valiant' },
    { id: 'archie', name: 'Archie Comics' }
  ];

  const getPublisherName = (id: string) => {
    const publisher = publishers.find(p => p.id === id);
    return publisher ? publisher.name : 'All Publishers';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <FiBook />
        <span className="font-medium">{getPublisherName(selectedPublisher)}</span>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-64 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
          <ul className="py-1">
            {publishers.map((publisher) => (
              <li key={publisher.id}>
                <button
                  onClick={() => {
                    onSelectPublisher(publisher.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                    selectedPublisher === publisher.id
                      ? 'bg-gray-700 text-yellow-400'
                      : 'text-white'
                  }`}
                >
                  {publisher.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 