"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const { t } = useLang();
  const { configured, ready, user, signInWithGoogle, signInWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("auth.email.invalid"));
      return;
    }
    setBusy(true);
    const res = await signInWithEmail(email);
    setBusy(false);
    if (res.error) setError(res.error);
    else setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14">
      <h1 className="text-2xl font-bold text-slate-900">{t("auth.login.title")}</h1>
      <p className="mt-1 text-slate-600">{t("auth.login.subtitle")}</p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {!configured ? (
          <p className="text-sm text-amber-700">{t("auth.notConfigured")}</p>
        ) : ready && user ? (
          <div className="text-center">
            <p className="text-sm text-slate-600">
              {t("auth.signedInAs")} <span className="font-semibold">{user.email}</span>
            </p>
            <Link
              href="/plan"
              className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700"
            >
              {t("auth.backToPlan")}
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <GoogleIcon />
              {t("auth.google")}
            </button>

            <div className="my-5 flex items-center gap-3 text-xs uppercase text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              {t("auth.or")}
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {sent ? (
              <p className="rounded-md bg-brand-50 px-3 py-3 text-sm text-brand-800">
                {t("auth.email.sent")}
              </p>
            ) : (
              <form onSubmit={handleEmail}>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  {t("auth.email.label")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email.placeholder")}
                  className="input"
                  autoComplete="email"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-3 w-full rounded-lg bg-brand-600 px-4 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {t("auth.email.send")}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">{t("auth.guestNote")}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.01-2.34Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
