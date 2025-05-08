'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLock, FiMail, FiArrowLeft, FiChrome } from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle, error, clearError } = useAuth();
  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err: any) {
      // Error is handled by the AuthContext
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      // Error is handled by the AuthContext
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <Link href="/" className="inline-flex items-center text-secondary hover:text-primary mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="max-w-md mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
            
            {error && (
              <motion.div 
                className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}
            
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-secondary mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-muted" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-tertiary border border-theme rounded-lg py-2 px-4 pl-10 text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-secondary mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-muted" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-tertiary border border-theme rounded-lg py-2 px-4 pl-10 text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 bg-tertiary border-theme rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-secondary">
                    Remember me
                  </label>
                </div>
                <Link href="/reset-password" className="text-sm text-accent hover:text-accent-hover">
                  Forgot password?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-accent hover:bg-accent-hover text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="my-6 flex items-center justify-center">
              <span className="border-t border-theme flex-grow"></span>
              <span className="mx-4 text-muted text-sm">OR</span>
              <span className="border-t border-theme flex-grow"></span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChrome className="mr-2" />
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
            
            <div className="mt-8 text-center">
              <p className="text-muted">
                Don't have an account?{' '}
                <Link href="/signup" className="text-accent hover:text-accent-hover">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 