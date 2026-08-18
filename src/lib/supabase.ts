/**
 * Supabase Client Initialization & Environment Verification
 * 
 * Provides the single centralized Supabase client singleton for PostgreSQL queries,
 * authentication sessions, real-time channels, and database persistence.
 */

import { createClient } from '@supabase/supabase-js';

// Default Production Project Credentials for seamless runtime availability
const DEFAULT_SUPABASE_URL = 'https://nuuggarfsmbuzgvpfqiv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_I77D8dvSW-oaOWf-y0P9Lg_wj0gLDPa';

// Read Vite environment variables strictly via import.meta.env with safe fallback
const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_URL : undefined;
const envAnonKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

const rawSupabaseUrl = envUrl || DEFAULT_SUPABASE_URL;
const rawSupabaseAnonKey = envAnonKey || DEFAULT_SUPABASE_ANON_KEY;

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
  if (!clean) return DEFAULT_SUPABASE_URL;

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
export const supabaseAnonKey = sanitizeEnv(rawSupabaseAnonKey) || DEFAULT_SUPABASE_ANON_KEY;

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
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);




