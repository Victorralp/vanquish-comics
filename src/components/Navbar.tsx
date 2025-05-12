'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiHeart, FiUser, FiLogIn, FiMenu, FiX } from 'react-icons/fi';
import { FaHome, FaBook, FaMask } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { Transition } from '@headlessui/react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useFavorites } from '@/lib/contexts/FavoritesContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { favorites } = useFavorites();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/comics', label: 'Comics' },
    { href: '/characters', label: 'Characters' },
    { href: '/search', label: 'Search' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Vanquish Comics</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
                  <FaHome className="mr-1" /> Home
                </Link>
                <Link href="/comics" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/comics') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
                  <FaBook className="mr-1" /> Comics
                </Link>
                <Link href="/characters" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/characters') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
                  <FaMask className="mr-1" /> Characters
                </Link>
                <Link href="/search" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/search' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
                  <FiSearch className="mr-1" /> Search
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/favorites" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/favorites' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
                  <FiHeart className="mr-1" /> 
                  Favorites
                  {favorites.length > 0 && (
                    <span className="ml-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Link>
                <Link href="/profile" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname.startsWith('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}>
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
                    <FiUser className="mr-1" />
                  )}
                  Profile
                </Link>
              </>
            ) : (
              <Link href="/login" className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                <FiLogIn className="mr-1" /> Login
              </Link>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-100 transform"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75 transform"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        {(ref) => (
          <div className="md:hidden" id="mobile-menu">
            <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.href)
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  {link.href === '/' && <FaHome className="mr-2" />}
                  {link.href === '/comics' && <FaBook className="mr-2" />}
                  {link.href === '/characters' && <FaMask className="mr-2" />}
                  {link.href === '/search' && <FiSearch className="mr-2" />}
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link href="/favorites" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname === '/favorites' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}>
                    <FiHeart className="mr-2" /> 
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/profile" className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    pathname.startsWith('/profile') ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}>
                    <FiUser className="mr-2" /> Profile
                  </Link>
                </>
              ) : (
                <Link href="/login" className="flex items-center px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700">
                  <FiLogIn className="mr-2" /> Login
                </Link>
              )}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-sm text-gray-600 dark:text-gray-300">Theme</div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </nav>
  );
} 