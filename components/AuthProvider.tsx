"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isBackendReachable, isSupabaseConfigured } from "@/lib/supabase";

type AuthContextValue = {
  ready: boolean;
  configured: boolean;
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Maps an auth failure to either the sentinel "unreachable" (the backend could
 * not be reached at all — a paused project, DNS failure, offline device) or the
 * provider's own message. Callers translate known sentinels for display.
 */
function authErrorCode(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err ?? "");
  if (/fetch|network|Load failed|timeout|ECONNREFUSED|ENOTFOUND/i.test(message)) {
    return "unreachable";
  }
  return message || "unreachable";
}

function redirectTo(path: string): string {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const supa = getSupabase();
    if (!supa) {
      setReady(true);
      return;
    }

    supa.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      })
      .catch((err) => {
        // Backend unreachable: stay signed out rather than leaving every
        // consumer stuck on `ready === false` forever.
        console.error("getSession", err);
      })
      .finally(() => setReady(true));

    const { data: sub } = supa.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signInWithGoogle(): Promise<{ error?: string }> {
    const supa = getSupabase();
    if (!supa) return { error: "not-configured" };
    // signInWithOAuth navigates away immediately, so check reachability first.
    if (!(await isBackendReachable())) return { error: "unreachable" };
    try {
      const { error } = await supa.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo("/plan") },
      });
      return error ? { error: authErrorCode(error) } : {};
    } catch (err) {
      return { error: authErrorCode(err) };
    }
  }

  async function signInWithEmail(email: string): Promise<{ error?: string }> {
    const supa = getSupabase();
    if (!supa) return { error: "not-configured" };
    try {
      const { error } = await supa.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo("/plan") },
      });
      return error ? { error: authErrorCode(error) } : {};
    } catch (err) {
      return { error: authErrorCode(err) };
    }
  }

  async function signOut() {
    const supa = getSupabase();
    if (!supa) return;
    await supa.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        ready,
        configured: isSupabaseConfigured,
        user,
        session,
        signInWithGoogle,
        signInWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
