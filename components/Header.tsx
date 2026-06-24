"use client";

import Link from "next/link";
import { useLang } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { LANGS } from "@/lib/i18n";

export function Header() {
  const { lang, setLang, t } = useLang();
  const { configured, ready: authReady, user, signOut } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-lg">
            🌱
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-semibold text-slate-900">{t("brand")}</span>
            <span className="hidden text-xs text-slate-500 sm:block">{t("tagline")}</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/plan"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            {t("nav.plan")}
          </Link>

          {configured && authReady && (
            <div className="ml-1 flex items-center gap-1">
              {user ? (
                <>
                  <span
                    className="hidden max-w-[12rem] truncate text-xs text-slate-500 md:inline"
                    title={user.email ?? undefined}
                  >
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    {t("auth.signOut")}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  {t("auth.signIn")}
                </Link>
              )}
            </div>
          )}

          <div className="ml-2 flex overflow-hidden rounded-md border border-slate-200">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-2.5 py-1.5 text-xs font-semibold uppercase transition-colors ${
                  lang === l
                    ? "bg-brand-600 text-white"
                    : "bg-white text-slate-500 hover:bg-slate-100"
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
