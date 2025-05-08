'use client';

import Link from 'next/link';
import { FiArrowLeft, FiCode, FiDatabase, FiGitBranch, FiUsers } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <Link href="/" className="inline-flex items-center text-secondary hover:text-primary mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary border-b border-theme pb-4">
            About Vanquish Comics
          </h1>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h2>
            <p className="text-lg mb-4">
              Vanquish Comics aims to be the ultimate digital platform for comic book enthusiasts, 
              providing a comprehensive database of characters and comics from major publishers
              like Marvel and DC.
            </p>
            <p className="text-lg mb-4">
              We believe in making comic knowledge accessible to everyone - whether you're a casual
              reader or a dedicated collector. Our platform helps you discover new characters, track 
              your favorite comics, and connect with a community that shares your passion.
            </p>
          </section>
          
          <section className="mb-10 bg-secondary rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <FiDatabase className="mr-2 text-accent" />
              Data Sources
            </h2>
            <p className="mb-4">
              Vanquish Comics integrates with the ComicVine API to provide you with accurate and 
              up-to-date information about characters and comics. This ensures that you have access
              to the most comprehensive comic book database available.
            </p>
            <div className="bg-tertiary rounded-lg p-6 mt-6">
              <h3 className="text-xl font-medium mb-2">What we offer:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comprehensive character database spanning multiple universes</li>
                <li>Detailed comic book information including covers, dates, and creators</li>
                <li>Personal collections management to track your favorites</li>
                <li>Advanced search functionality to discover new content</li>
              </ul>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <FiCode className="mr-2 text-accent" />
              Technology Stack
            </h2>
            <p className="mb-6">
              Our platform is built with modern technologies to ensure a fast, responsive, and 
              user-friendly experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Frontend</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Next.js for server-side rendering and routing</li>
                  <li>React for component-based UI architecture</li>
                  <li>Tailwind CSS for responsive and customizable styling</li>
                  <li>React Context API for state management</li>
                </ul>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="text-xl font-medium mb-3">Backend & APIs</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Next.js API routes for serverless functions</li>
                  <li>ComicVine API integration for comic data</li>
                  <li>Firebase Authentication for user management</li>
                  <li>Firestore for user data and favorites storage</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <FiUsers className="mr-2 text-accent" />
              Our Team
            </h2>
            <p className="mb-6">
              Vanquish Comics is created by a team of passionate developers and comic book enthusiasts
              who are dedicated to building the best comic book platform possible.
            </p>
            <div className="bg-secondary rounded-lg p-6">
              <p className="italic">
                "We're committed to creating a platform that celebrates the rich history and diversity
                of comic books while providing a modern, user-friendly experience for fans everywhere."
              </p>
              <p className="mt-3 text-right">— The Vanquish Comics Team</p>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center">
              <FiGitBranch className="mr-2 text-accent" />
              Open Source
            </h2>
            <p className="mb-4">
              Vanquish Comics is built with a love for both comics and coding. We believe in the power
              of open source software and community collaboration.
            </p>
            <p className="mb-4">
              Our application is continuously improved based on user feedback and the latest
              developments in web technology.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 