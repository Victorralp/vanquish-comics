'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white">
              Vanquish Comics
            </Link>
            <p className="mt-4 text-gray-400">
              Explore the vast universe of comic book characters, their stories, powers, and more.
              Your one-stop destination for all things superhero and comic book related.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FiGithub className="w-5 h-5" />
              </a>
              <a href="mailto:contact@vanquishcomics.com" className="text-gray-400 hover:text-white transition-colors">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/characters" className="hover:text-yellow-400 transition-colors">Characters</Link>
              </li>
              <li>
                <Link href="/comics" className="hover:text-yellow-400 transition-colors">Comic Stories</Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-yellow-400 transition-colors">My Favorites</Link>
              </li>
            </ul>
          </div>

          {/* Additional Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-yellow-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-400 transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-gray-500 text-center">
          <p>© {new Date().getFullYear()} Vanquish Comics. All rights reserved.</p>
          <p className="mt-2">
            This site is not affiliated with any comic book publisher. All character information is sourced from public APIs.
          </p>
        </div>
      </div>
    </footer>
  );
} 