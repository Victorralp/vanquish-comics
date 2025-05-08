'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiMail, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function ResetPasswordPage() {
  const { sendPasswordReset, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous errors
    clearError();
    setLocalError(null);
    
    // Validate email
    if (!email) {
      setLocalError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await sendPasswordReset(email);
      setResetSent(true);
      setEmail('');
    } catch (err: any) {
      // Error is handled by the AuthContext and displayed via the error state
    } finally {
      setLoading(false);
    }
  };

  const getDisplayedError = () => localError || error;

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-secondary p-8 rounded-lg shadow-lg">
          <div>
            <Link href="/login" className="inline-flex items-center text-accent hover:text-accent-hover">
              <FiArrowLeft className="mr-2" />
              Back to Login
            </Link>
            
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-muted">
              Enter the email associated with your account
              and we'll send you a link to reset your password.
            </p>
          </div>
          
          {resetSent ? (
            <div className="bg-green-500/20 border border-green-500 text-green-200 rounded-md p-4 flex items-start">
              <FiCheck className="h-5 w-5 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium">Password reset email sent</h3>
                <p className="mt-2 text-sm">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setResetSent(false)}
                    className="text-sm font-medium text-accent hover:text-accent-hover"
                  >
                    Send another email
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {getDisplayedError() && (
                <div className="bg-red-500/20 border border-red-500 text-red-200 rounded-md p-4 flex">
                  <FiAlertCircle className="h-5 w-5 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm">{getDisplayedError()}</p>
                  </div>
                </div>
              )}
              
              <div className="rounded-md -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-muted" />
                    </div>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 
                               border border-theme placeholder-muted text-primary 
                               bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Email address"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                           text-sm font-medium rounded-md text-black bg-accent hover:bg-accent-hover 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <footer className="bg-secondary py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted text-sm">
            &copy; {new Date().getFullYear()} Vanquish Comics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 