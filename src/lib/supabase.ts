/**
 * Supabase Client Initialization & Environment Verification
 * 
 * Provides the single centralized Supabase client singleton for PostgreSQL queries,
 * authentication sessions, real-time channels, and database persistence.
 */

import { createClient } from '@supabase/supabase-js';

// Read Vite environment variables strictly via import.meta.env
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Sanitizes input string by trimming whitespace, newlines, and stripping surrounding quotes.
 */
const sanitizeEnv = (val: unknown): string => {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
};

/**
 * Normalizes and cleans the Supabase URL string
 */
const normalizeSupabaseUrl = (urlStr: string): string => {
  let clean = sanitizeEnv(urlStr);
  if (!clean) return '';

  if (!/^https?:\/\//i.test(clean)) {
    clean = `https://${clean}`;
  }

  try {
    const parsed = new URL(clean);
    return parsed.origin;
  } catch {
    return clean.replace(/\/+$/, '');
  }
};

/** Cleaned Supabase Project URL */
export const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);

/** Cleaned Supabase Public Anon Key */
export const supabaseAnonKey = sanitizeEnv(rawSupabaseAnonKey);

/**
 * Validation check for Supabase configuration
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-actual-anon-key')
);

if (!isSupabaseConfigured) {
  console.warn(
    'Chacha Cafe CMS: Supabase credentials not found or invalid in environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).'
  );
}

/**
 * Single Centralized Global Supabase Client instance
 */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);




