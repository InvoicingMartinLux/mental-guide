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

/**
 * Probes the auth backend. `signInWithOAuth` redirects the browser without
 * making a request first, so a paused or unreachable project would otherwise
 * dump the user on a browser network-error page with no explanation. Checking
 * first lets us fail inside the app with a readable message.
 */
export async function isBackendReachable(timeoutMs = 5000): Promise<boolean> {
  if (!url || !key) return false;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
      signal: ctrl.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
