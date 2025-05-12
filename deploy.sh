#!/bin/bash

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Force install React 18.2.0
npm install react@18.2.0 react-dom@18.2.0 --legacy-peer-deps

# Install tailwindcss and related dependencies explicitly
npm install tailwindcss@3.3.0 postcss@8.4.31 autoprefixer@10.4.16 --legacy-peer-deps

# Create any missing components directory
mkdir -p src/components

# Make sure the path alias for @/components works correctly
# This ensures Next.js properly resolves the imports with the @ alias
npm install --save-dev tsconfig-paths --legacy-peer-deps

# Create a simple Footer component if it doesn't exist
if [ ! -f src/components/Footer.tsx ]; then
  echo "Creating Footer component..."
  cat > src/components/Footer.tsx << 'EOL'
'use client';

import React from 'react';
import Link from 'next/link';
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">Vanquish Comics</p>
            <p className="text-sm text-gray-400">Your digital comic book companion</p>
          </div>
          
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-400 hover:text-white">
              <FiGithub size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <FiTwitter size={20} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white">
              <FiMail size={20} />
            </Link>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
              <Link href="/comics" className="text-gray-400 hover:text-white">Comics</Link>
              <Link href="/characters" className="text-gray-400 hover:text-white">Characters</Link>
              <Link href="/about" className="text-gray-400 hover:text-white">About</Link>
            </div>
            
            <p className="text-gray-400">© {new Date().getFullYear()} Vanquish Comics. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
EOL
fi

# Build the project
npm run build 