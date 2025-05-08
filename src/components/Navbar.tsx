'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiHeart, FiLogIn, FiSearch } from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useFavorites } from '@/lib/contexts/FavoritesContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
    setShowSearch(false);
  }, [pathname]);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const links = [
    { href: '/', label: 'Home' },
    { href: '/characters', label: 'Characters' },
    { href: '/comics', label: 'Comics' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-40 mr-2">
              <Image 
                src="/images/logo.png"
                alt="Vanquish Comics Logo" 
                fill 
                className="object-contain" 
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4 mr-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.href)
                      ? 'bg-yellow-500 text-gray-900'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Button */}
            <div className="relative mr-4">
              {showSearch ? (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-44 bg-gray-800 border border-gray-700 rounded-lg py-1.5 px-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1.5 text-gray-400"
                  >
                    <FiSearch size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="Search"
                >
                  <FiSearch size={20} />
                </button>
              )}
            </div>

            {/* User Navigation */}
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Link
                    href="/favorites"
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Favorites"
                  >
                    <FiHeart size={20} />
                    {favorites.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                  >
                    {user.photoURL ? (
                      <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          fill 
                          className="object-cover" 
                          onError={(e) => {
                            // Set fallback image if loading fails
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-avatar.png';
                            target.onerror = null; // Prevent infinite error loop
                          }}
                        />
                      </div>
                    ) : (
                      <FiUser className="mr-2" />
                    )}
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors"
                >
                  <FiLogIn className="mr-2" />
                  Login
                </Link>
              )}
            </div>

            {/* Add the ThemeToggle here */}
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {/* Mobile search button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-md text-gray-400 hover:text-white"
            >
              <FiSearch size={20} />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search */}
        {showSearch && (
          <div className="pb-2 px-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search characters and comics..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400"
              >
                <FiSearch size={20} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Add ThemeToggle here */}
            <div className="px-4 py-2">
              <ThemeToggle variant="button" className="w-full justify-center" />
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              {user ? (
                <>
                  <Link
                    href="/favorites"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <FiHeart className="mr-2" />
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-2 bg-yellow-500 text-xs text-black font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    {user.photoURL ? (
                      <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          fill 
                          className="object-cover" 
                          onError={(e) => {
                            // Set fallback image if loading fails
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-avatar.png';
                            target.onerror = null; // Prevent infinite error loop
                          }}
                        />
                      </div>
                    ) : (
                      <FiUser className="mr-2" />
                    )}
                    Profile
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-yellow-500 text-gray-900 hover:bg-yellow-400"
                >
                  <FiLogIn className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 