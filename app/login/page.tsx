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
      <h1 className="type-subhead text-ink">{t("auth.login.title")}</h1>
      <p className="mt-2 type-body text-muted">{t("auth.login.subtitle")}</p>

      <div className="card-elevated mt-8">
        {!configured ? (
          <p className="status-chip status-chip-warning">
            <span aria-hidden="true">ℹ</span>
            {t("auth.notConfigured")}
          </p>
        ) : ready && user ? (
          <div className="text-center">
            <p className="type-body-sm text-muted">
              {t("auth.signedInAs")}{" "}
              <span className="font-semibold text-ink">{user.email}</span>
            </p>
            <Link href="/plan" className="btn-primary btn-md mt-5">
              {t("auth.backToPlan")}
            </Link>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="btn-secondary btn-md w-full"
            >
              <GoogleIcon />
              {t("auth.google")}
            </button>

            <div className="my-6 flex items-center gap-3 type-overline text-warmgray">
              <span className="h-px flex-1 bg-lavender-200" />
              {t("auth.or")}
              <span className="h-px flex-1 bg-lavender-200" />
            </div>

            {sent ? (
              <p className="rounded-md bg-success-bg px-4 py-3 type-body-sm text-success-ink">
                <span aria-hidden="true">✉ </span>
                {t("auth.email.sent")}
              </p>
            ) : (
              <form onSubmit={handleEmail}>
                <label htmlFor="login-email" className="field-label">
                  {t("auth.email.label")}
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email.placeholder")}
                  className={`input ${error ? "input-error" : ""}`}
                  aria-invalid={error ? true : undefined}
                  autoComplete="email"
                />
                {error && (
                  <p role="alert" className="status-chip status-chip-error mt-3">
                    <span aria-hidden="true">!</span>
                    {error}
                  </p>
                )}
                <button type="submit" disabled={busy} className="btn-primary btn-md mt-4 w-full">
                  {t("auth.email.send")}
                </button>
              </form>
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-center type-caption text-muted">{t("auth.guestNote")}</p>
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
