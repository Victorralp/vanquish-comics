'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiSettings, FiLogOut, FiSliders, FiArrowLeft, FiSave, FiX, FiAlertTriangle, FiCheck, FiShield, FiClock, FiEye, FiEyeOff } from 'react-icons/fi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTheme } from '@/lib/contexts/ThemeContext';
import LoadingState from '@/components/LoadingState';

export default function ProfilePage() {
  const { user, logout, updateProfile, sendEmailVerification, updateEmail, updatePassword, error, clearError } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Email change state
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);
  
  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  // Verification state
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  // If no user is logged in, redirect to login
  if (!user) {
    router.push('/login');
    return <LoadingState message="Redirecting to login..." />;
  }

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setLocalError(null);
    clearError();
    setSuccessMessage(null);
    setSaving(true);
    
    try {
      await updateProfile({ displayName });
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!user) return;
    
    setLocalError(null);
    clearError();
    setSuccessMessage(null);
    setSavingEmail(true);
    
    try {
      if (!newEmail) {
        throw new Error('Please enter a new email address');
      }
      
      if (!currentPasswordForEmail) {
        throw new Error('Please enter your current password');
      }
      
      await updateEmail(newEmail, currentPasswordForEmail);
      setSuccessMessage('Email updated successfully. Please verify your new email.');
      setIsChangingEmail(false);
      setNewEmail('');
      setCurrentPasswordForEmail('');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to update email');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user) return;
    
    setLocalError(null);
    clearError();
    setSuccessMessage(null);
    setSavingPassword(true);
    
    try {
      if (!currentPassword) {
        throw new Error('Please enter your current password');
      }
      
      if (!newPassword) {
        throw new Error('Please enter a new password');
      }
      
      if (newPassword !== confirmNewPassword) {
        throw new Error('New passwords do not match');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      await updatePassword(currentPassword, newPassword);
      setSuccessMessage('Password updated successfully');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSendVerification = async () => {
    if (!user) return;
    
    setLocalError(null);
    clearError();
    setSendingVerification(true);
    
    try {
      await sendEmailVerification();
      setVerificationSent(true);
      setSuccessMessage('Verification email sent!');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
    } catch (err: any) {
      setLocalError(err.message || 'Failed to sign out');
    }
  };

  const getDisplayedError = () => {
    return localError || error;
  };

  const resetForms = () => {
    setIsEditing(false);
    setIsChangingEmail(false);
    setIsChangingPassword(false);
    setNewEmail('');
    setCurrentPasswordForEmail('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  return (
    <div className="min-h-screen bg-primary text-primary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 pt-24">
        <Link href="/" className="inline-flex items-center text-secondary hover:text-primary mb-6">
          <FiArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="max-w-4xl mx-auto bg-secondary rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-primary border-b border-theme pb-4">Profile Settings</h1>
            
            {getDisplayedError() && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
                {getDisplayedError()}
                <button 
                  onClick={() => {
                    setLocalError(null);
                    clearError();
                  }}
                  className="float-right text-red-200 hover:text-white"
                >
                  <FiX />
                </button>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded mb-6">
                {successMessage}
                <button 
                  onClick={() => setSuccessMessage(null)}
                  className="float-right text-green-200 hover:text-white"
                >
                  <FiX />
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left sidebar with user info */}
              <div className="bg-tertiary p-6 rounded-lg">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 bg-accent flex items-center justify-center rounded-full text-black text-3xl font-bold mb-4">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                  <h2 className="text-xl font-semibold">{user.displayName || 'User'}</h2>
                  <p className="text-muted">{user.email}</p>
                  
                  {/* Email verification badge */}
                  <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium flex items-center ${user.emailVerified ? 'bg-green-500/20 text-green-200' : 'bg-yellow-500/20 text-yellow-200'}`}>
                    {user.emailVerified ? (
                      <>
                        <FiCheck className="mr-1" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <FiAlertTriangle className="mr-1" />
                        <span>Not Verified</span>
                      </>
                    )}
                  </div>
                  
                  {!user.emailVerified && (
                    <button
                      onClick={handleSendVerification}
                      disabled={sendingVerification || verificationSent}
                      className="mt-3 text-sm text-accent hover:text-accent-hover focus:outline-none disabled:opacity-50"
                    >
                      {sendingVerification 
                        ? 'Sending...' 
                        : verificationSent 
                          ? 'Email Sent' 
                          : 'Verify Email'}
                    </button>
                  )}
                </div>
                
                <div className="border-t border-theme pt-4 mt-4">
                  <button 
                    onClick={handleSignOut}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded text-primary bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <FiLogOut />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
              
              {/* Main content - settings */}
              <div className="md:col-span-2">
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <FiUser className="text-accent" />
                      <span>Account Information</span>
                    </h2>
                    
                    {!isEditing && !isChangingEmail && !isChangingPassword ? (
                      <button 
                        onClick={() => {
                          setIsEditing(true);
                          setIsChangingEmail(false);
                          setIsChangingPassword(false);
                        }}
                        className="text-accent hover:text-accent-hover"
                      >
                        Edit
                      </button>
                    ) : isEditing ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setIsEditing(false);
                            setDisplayName(user?.displayName || '');
                          }}
                          className="text-muted hover:text-primary flex items-center gap-1"
                        >
                          <FiX size={14} />
                          <span>Cancel</span>
                        </button>
                        <button 
                          onClick={handleUpdateProfile}
                          disabled={saving}
                          className="text-accent hover:text-accent-hover flex items-center gap-1"
                        >
                          <FiSave size={14} />
                          <span>{saving ? 'Saving...' : 'Save'}</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-muted mb-1">Display Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full bg-tertiary border border-theme rounded px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      ) : (
                        <div className="text-primary py-2">
                          {user.displayName || 'Not set'}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <label className="block text-muted mb-1">Email Address</label>
                        {!isEditing && !isChangingEmail && !isChangingPassword && (
                          <button 
                            onClick={() => {
                              setIsChangingEmail(true);
                              setIsEditing(false);
                              setIsChangingPassword(false);
                            }}
                            className="text-xs text-accent hover:text-accent-hover"
                          >
                            Change
                          </button>
                        )}
                      </div>
                      
                      {!isChangingEmail ? (
                        <div className="text-primary py-2 flex items-center">
                          <FiMail className="mr-2 text-muted" />
                          {user.email}
                        </div>
                      ) : (
                        <div className="space-y-3 bg-tertiary p-4 rounded border border-theme">
                          <h3 className="font-medium mb-2">Change Email Address</h3>
                          <div>
                            <label className="block text-muted text-sm mb-1">New Email Address</label>
                            <input
                              type="email"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                              className="w-full bg-secondary border border-theme rounded px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                              placeholder="Enter new email address"
                            />
                          </div>
                          <div>
                            <label className="block text-muted text-sm mb-1">Current Password</label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPasswordForEmail}
                                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                                className="w-full bg-secondary border border-theme rounded px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Verify with current password"
                              />
                              <button 
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                              >
                                {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button 
                              onClick={() => setIsChangingEmail(false)}
                              className="text-muted hover:text-primary flex items-center gap-1"
                            >
                              <FiX size={14} />
                              <span>Cancel</span>
                            </button>
                            <button 
                              onClick={handleUpdateEmail}
                              disabled={savingEmail}
                              className="text-accent hover:text-accent-hover flex items-center gap-1"
                            >
                              <FiSave size={14} />
                              <span>{savingEmail ? 'Saving...' : 'Save'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between mt-6">
                        <label className="block text-muted mb-1">Password</label>
                        {!isEditing && !isChangingEmail && !isChangingPassword && (
                          <button 
                            onClick={() => {
                              setIsChangingPassword(true);
                              setIsEditing(false);
                              setIsChangingEmail(false);
                            }}
                            className="text-xs text-accent hover:text-accent-hover"
                          >
                            Change
                          </button>
                        )}
                      </div>
                      
                      {!isChangingPassword ? (
                        <div className="text-primary py-2 flex items-center">
                          <FiShield className="mr-2 text-muted" />
                          ••••••••
                        </div>
                      ) : (
                        <div className="space-y-3 bg-tertiary p-4 rounded border border-theme">
                          <h3 className="font-medium mb-2">Change Password</h3>
                          <div>
                            <label className="block text-muted text-sm mb-1">Current Password</label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-secondary border border-theme rounded px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Enter current password"
                              />
                              <button 
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                              >
                                {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-muted text-sm mb-1">New Password</label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-secondary border border-theme rounded px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Enter new password"
                              />
                              <button 
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-primary"
                              >
                                {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-muted text-sm mb-1">Confirm New Password</label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full bg-secondary border border-theme rounded px-3 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button 
                              onClick={() => setIsChangingPassword(false)}
                              className="text-muted hover:text-primary flex items-center gap-1"
                            >
                              <FiX size={14} />
                              <span>Cancel</span>
                            </button>
                            <button 
                              onClick={handleUpdatePassword}
                              disabled={savingPassword}
                              className="text-accent hover:text-accent-hover flex items-center gap-1"
                            >
                              <FiSave size={14} />
                              <span>{savingPassword ? 'Saving...' : 'Save'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-theme pt-6 mt-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                    <FiSettings className="text-accent" />
                    <span>Preferences</span>
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            <FiSliders className="text-accent" />
                            <span>Theme</span>
                          </h3>
                          <p className="text-sm text-muted mt-1">
                            Choose between dark and light theme
                          </p>
                        </div>
                        <ThemeToggle variant="button" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 