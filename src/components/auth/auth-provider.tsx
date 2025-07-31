'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, addScope } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

if (typeof window !== 'undefined') {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "9038D925-1D42-4053-823E-DAE8C4715CC8";
}

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  connectGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Signed In',
        description: 'Welcome to Zen Jar!',
      });
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      toast({
        title: 'Sign In Error',
        description: 'Could not sign in with Google. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const connectGoogle = async () => {
    if (!auth.currentUser) {
      toast({ title: 'Not Signed In', description: 'Please sign in first to connect your Google account.', variant: 'destructive' });
      return;
    }
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/tasks');
    provider.addScope('https://www.googleapis.com/auth/calendar.events');

    try {
      await signInWithPopup(auth.currentUser, provider);
      toast({
        title: 'Google Account Connected',
        description: 'You can now use Google integrations.',
      });
    } catch (error) {
      console.error("Error connecting Google account: ", error);
      toast({
        title: 'Connection Error',
        description: 'Could not connect your Google account. Please try again.',
        variant: 'destructive',
      });
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        title: 'Sign Out Error',
        description: 'Could not sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut: handleSignOut,
    connectGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
