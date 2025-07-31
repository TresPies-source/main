
'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, linkWithPopup, reauthenticateWithPopup } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isPro: boolean; // This will now just reflect login status
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  connectGoogle: () => Promise<string | null>;
  googleAccessToken: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // isPro is now true if the user is logged in.
      if (user) {
        setIsPro(true);
      } else {
        setIsPro(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getGoogleProvider = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/tasks');
    provider.addScope('https://www.googleapis.com/auth/calendar.events');
    provider.addScope('https://www.googleapis.com/auth/drive.file');
    provider.addScope('https://www.googleapis.com/auth/documents.readonly');
    return provider;
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = getGoogleProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if(credential?.accessToken) {
        setGoogleAccessToken(credential.accessToken);
      }
      toast({
        title: 'Signed In',
        description: 'Welcome to Zen Jar!',
      });
    } catch (error: any) {
      console.error("Error signing in with Google: ", error);
      let description = 'Could not sign in with Google. Please try again.';
      if (error.code === 'auth/account-exists-with-different-credential') {
        description = "An account already exists with the same email address but different sign-in credentials. Please sign in using the original method."
      }
      toast({
        title: 'Sign In Error',
        description,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const connectGoogle = async (): Promise<string | null> => {
    if (!auth.currentUser) {
      toast({ title: 'Not Signed In', description: 'Please sign in first to connect your Google account.', variant: 'destructive' });
      return null;
    }
    const provider = getGoogleProvider();

    try {
      // linkWithPopup is for linking a new provider to an existing anonymous account
      // reauthenticateWithPopup is for an existing user to re-provide credentials
      const result = user?.isAnonymous 
        ? await linkWithPopup(auth.currentUser, provider)
        : await reauthenticateWithPopup(auth.currentUser, provider);
        
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        setGoogleAccessToken(token);
        toast({
          title: 'Google Account Connected',
          description: 'You can now use Google integrations.',
        });
        return token;
      }
      throw new Error("Could not retrieve access token.");
    } catch (error: any) {
      console.error("Error connecting Google account: ", error);
      setGoogleAccessToken(null);
      let description = 'Could not connect your Google account. Please try again.';
      if (error.code === 'auth/credential-already-in-use') {
        description = 'This Google account is already associated with another user.'
      }
      toast({
        title: 'Connection Error',
        description,
        variant: 'destructive',
      });
      return null;
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setGoogleAccessToken(null);
      setIsPro(false); // Reset pro status on sign out
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
    isPro,
    signOut: handleSignOut,
    connectGoogle,
    googleAccessToken,
    signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
