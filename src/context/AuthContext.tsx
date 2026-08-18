/**
 * Authentication Context & Session Provider
 * 
 * Manages Supabase Auth sessions, admin authorization state,
 * login/logout flows, and credentials synchronization.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';


export interface AdminCredentials {
  email: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  adminCredentials: AdminCredentials;
  signIn: (email: string, pass: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateCredentials: (newEmail: string, newPassword: string) => Promise<{ error: string | null }>;
}

const DEFAULT_CREDENTIALS: AdminCredentials = {
  email: 'aayanmalik3114@gmail.com',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  adminCredentials: DEFAULT_CREDENTIALS,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateCredentials: async () => ({ error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Get existing session from Supabase
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.error('Supabase getSession error:', error.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error('Supabase getSession exception:', err);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (inputEmail: string, pass: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.',
      };
    }

    const email = inputEmail.trim().toLowerCase();
    const password = pass.trim();

    if (!email || !password) {
      return { error: 'Please provide both email address and password.' };
    }

    try {
      // Standard Supabase email and password sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (data?.session && data?.user) {
        setUser(data.user);
        setSession(data.session);
        return { error: null };
      }

      return { error: 'Unable to establish session. Please verify your credentials.' };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { error: err?.message || 'Database connection error during authentication.' };
    }
  };

  const updateCredentials = async (newEmail: string, newPassword: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured.' };
    }

    if (!newEmail.trim() || !newPassword.trim()) {
      return { error: 'Email and password cannot be empty.' };
    }

    try {
      const updateData: { email?: string; password?: string } = {};
      if (newEmail.trim()) updateData.email = newEmail.trim().toLowerCase();
      if (newPassword.trim()) updateData.password = newPassword.trim();

      const { error } = await supabase.auth.updateUser(updateData);
      if (error) return { error: error.message };

      return { error: null };
    } catch (err: any) {
      return { error: err?.message || 'Failed to update credentials in Supabase.' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin: Boolean(user),
        adminCredentials: {
          email: user?.email || DEFAULT_CREDENTIALS.email,
        },
        signIn,
        signOut,
        updateCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
