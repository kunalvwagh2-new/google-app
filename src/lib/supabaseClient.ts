import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) || {};
  const procEnv = (typeof process !== 'undefined' ? process.env : undefined) || {};

  const url = metaEnv.VITE_SUPABASE_URL || procEnv.SUPABASE_URL || '';
  const anonKey = metaEnv.VITE_SUPABASE_ANON_KEY || procEnv.SUPABASE_ANON_KEY || '';

  if (!url || !anonKey || url.includes('YOUR_SUPABASE_REF')) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.warn('[Supabase] Initializing client failed, falling back to local storage engine:', err);
    return null;
  }
}

export const supabase = getSupabaseClient() || ({
  auth: {
    signUp: async () => ({ data: { user: { id: 'mock-user-1' } }, error: null }),
    signInWithPassword: async () => ({ data: { user: { id: 'mock-user-1' } }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null }),
      }),
      order: () => ({ data: [], error: null }),
      upsert: async () => ({ data: null, error: null }),
      insert: async () => ({ data: null, error: null }),
    }),
    upsert: async () => ({ data: null, error: null }),
    insert: async () => ({ data: null, error: null }),
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({}),
    }),
    unsubscribe: () => {},
  }),
  removeChannel: () => {},
} as any);
