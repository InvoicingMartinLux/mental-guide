"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

type AuthContextValue = {
  ready: boolean;
  configured: boolean;
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

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

    supa.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setReady(true);
    });

    const { data: sub } = supa.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  async function signInWithGoogle() {
    const supa = getSupabase();
    if (!supa) return;
    await supa.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo("/plan") },
    });
  }

  async function signInWithEmail(email: string): Promise<{ error?: string }> {
    const supa = getSupabase();
    if (!supa) return { error: "not-configured" };
    const { error } = await supa.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo("/plan") },
    });
    return error ? { error: error.message } : {};
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
