import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run this on the client side and if auth is properly initialized
    if (typeof window === 'undefined' || !auth || !auth.onAuthStateChanged) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    const errorMessage = error.message || 'An unknown error occurred';
    setError(errorMessage);
    throw new Error(errorMessage);
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      const errorMessage = 'Authentication service is not available.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      handleError(error);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      const errorMessage = 'Authentication service is not available.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification after sign up
      await firebaseSendEmailVerification(userCredential.user);
    } catch (error: any) {
      handleError(error);
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      const errorMessage = 'Authentication service is not available.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      handleError(error);
    }
  };

  const logout = async () => {
    if (!auth) {
      const errorMessage = 'Authentication service is not available.';
      setError(errorMessage);
      return;
    }
    
    try {
      clearError();
      await firebaseSignOut(auth);
    } catch (error: any) {
      handleError(error);
    }
  };

  const updateProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth?.currentUser) {
      const errorMessage = 'No authenticated user found.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      await firebaseUpdateProfile(auth.currentUser, data);
      // Force a refresh of the user object
      setUser(auth.currentUser);
    } catch (error: any) {
      handleError(error);
    }
  };

  const sendEmailVerification = async () => {
    if (!auth?.currentUser) {
      const errorMessage = 'No authenticated user found.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      await firebaseSendEmailVerification(auth.currentUser);
    } catch (error: any) {
      handleError(error);
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!auth) {
      const errorMessage = 'Authentication service is not available.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      handleError(error);
    }
  };

  const updateEmail = async (newEmail: string, password: string) => {
    if (!auth?.currentUser) {
      const errorMessage = 'No authenticated user found.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      // Re-authenticate the user first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email as string,
        password
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await firebaseUpdateEmail(auth.currentUser, newEmail);
      // Send verification email to new email
      await firebaseSendEmailVerification(auth.currentUser);
      // Force a refresh of the user object
      setUser(auth.currentUser);
    } catch (error: any) {
      handleError(error);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    if (!auth?.currentUser) {
      const errorMessage = 'No authenticated user found.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
    
    try {
      clearError();
      // Re-authenticate the user first
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email as string,
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    } catch (error: any) {
      handleError(error);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    updateProfile,
    sendEmailVerification,
    sendPasswordReset,
    updateEmail,
    updatePassword,
    error,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 