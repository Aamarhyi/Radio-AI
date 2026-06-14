import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Standard Supabase client for client-side or general-purpose calls.
 */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin client using the Service Role Key (bypasses RLS).
 * Use only in secure server environments.
 */
export function getSupabaseAdmin() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Creates a server-side client (works in API routes).
 */
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Gets the current authenticated user from the session token.
 * Call this in API routes where the user sends an Authorization header.
 */
export async function getSessionUser() {
  try {
    const client = createClient();
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    return null;
  }
}
