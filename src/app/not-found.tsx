'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-24 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6 text-yellow-400">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
          
          <p className="text-xl text-gray-300 mb-8">
            Oops! The comic page you're looking for seems to have vanished into another universe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
            >
              <FiHome className="mr-2" />
              <span>Back to Home</span>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 px-6 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span>Go Back</span>
            </button>
          </div>
        </motion.div>
        
        <div className="mt-16">
          <div className="text-4xl font-bold text-gray-700 mb-4">
            MISSING COMIC
          </div>
          <div className="text-gray-600 max-w-md mx-auto">
            <p>Even superheroes sometimes get lost between dimensions.</p>
            <p>Why not explore our character database or comic collection instead?</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 