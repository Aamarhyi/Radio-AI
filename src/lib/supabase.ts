import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Ensure environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Standard Supabase client for client-side or general-purpose non-auth calls.
 */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

/**
 * Supabase Admin client using the Service Role Key.
 * DANGER: This bypasses Row Level Security (RLS). Use only in secure server environments
 * (e.g., background workers, admin tasks, generation-logic needing write access).
 */
export function getSupabaseAdmin() {
  if (!supabaseServiceKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing. Admin client might fail.');
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Creates a server-side Supabase client that reads and writes session cookies.
 * Perfect for Next.js App Router API Routes, Route Handlers, or Server Actions.
 */
export function createClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // This setAll might be called in a Server Component context where cookies cannot be written.
            // Next.js middleware typically handles token refreshing, so this is safe to ignore.
          }
        },
      },
    }
  );
}

/**
 * Helper to get the currently authenticated user from a server client.
 * Returns null if the user is not authenticated.
 */
export async function getSessionUser() {
  try {
    const client = createClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Error fetching session user:', err);
    return null;
  }
}
