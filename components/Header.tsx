"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { LANGS } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useLang();
  const { configured, ready: authReady, user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-lavender-200 bg-canvas/85 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg transition-transform duration-200 ease-out hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-50 text-xl shadow-subtle">
            🌱
          </span>
          <span className="flex flex-col leading-tight">
            <span className="whitespace-nowrap font-display text-lg font-bold text-ink">{t("brand")}</span>
            <span className="hidden type-caption text-muted sm:block">{t("tagline")}</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors duration-200 ease-out hover:bg-lavender-50 hover:text-sage-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/plan"
            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors duration-200 ease-out hover:bg-lavender-50 hover:text-sage-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
          >
            {t("nav.plan")}
          </Link>

          {configured && authReady && (
            <div className="ml-1 flex items-center gap-1">
              {user ? (
                <>
                  <span
                    className="hidden max-w-[12rem] truncate type-caption text-muted md:inline"
                    title={user.email ?? undefined}
                  >
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-muted transition-colors duration-200 ease-out hover:bg-lavender-50 hover:text-sage-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
                  >
                    {t("auth.signOut")}
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn-primary btn-sm">
                  {t("auth.signIn")}
                </Link>
              )}
            </div>
          )}

          <div className="ml-2 flex gap-1 rounded-full bg-lavender-50 p-1 shadow-inner">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender ${
                  lang === l
                    ? "bg-sage text-white shadow-subtle"
                    : "text-muted hover:text-sage-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
