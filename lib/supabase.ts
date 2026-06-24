import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null | undefined;

/**
 * Returns the browser Supabase client, or null when env vars are not set.
 * Keeping it nullable lets the app run in local-only (guest) mode before
 * Supabase is configured, instead of crashing the build/runtime.
 */
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  if (!url || !key) {
    client = null;
    return client;
  }
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}

export const isSupabaseConfigured = Boolean(url && key);
