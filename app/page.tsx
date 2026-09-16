"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

export default function HomePage() {
  const { t } = useLang();

  const comingSoon = [
    { key: "nutrition", icon: "🥗" },
    { key: "movement", icon: "🏃" },
    { key: "sleep", icon: "😴" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl bg-surface px-6 py-12 text-center shadow-medium sm:px-12 sm:py-16">
        {/* Soft breathing halo — a quiet invitation to slow down. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 animate-breathe rounded-full bg-peach/40 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 animate-breathe rounded-full bg-lavender/30 blur-3xl [animation-delay:2s]"
        />

        <div className="relative">
          <span className="status-chip status-chip-info">🌿 {t("tagline")}</span>
          <h1 className="mx-auto mt-6 max-w-2xl type-headline text-ink sm:text-[40px] sm:font-extrabold sm:leading-[1.2] sm:tracking-[0.02em]">
            {t("home.heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl type-body-lg text-muted">
            {t("home.heroSubtitle")}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/questionnaire" className="btn-primary btn-lg">
              {t("home.start")}
            </Link>
            <Link href="/plan" className="btn-secondary btn-lg">
              {t("home.openPlan")}
            </Link>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="mt-12 sm:mt-section">
        <h2 className="mb-6 type-overline text-muted">{t("home.chooseArea")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active: phone usage */}
          <Link
            href="/questionnaire"
            className="card card-interactive group flex flex-col transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-2xl">
              📵
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">
              {t("home.area.phone.title")}
            </h3>
            <p className="mt-2 type-body-sm text-muted">{t("home.area.phone.desc")}</p>
            <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-semibold text-sage-ink">
              {t("home.start")}
              <span aria-hidden="true" className="transition-transform duration-200 ease-out group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>

          {/* Coming soon */}
          {comingSoon.map((area) => (
            <div
              key={area.key}
              className="flex flex-col rounded-lg border border-dashed border-lavender-300 bg-lavender-50/60 p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-2xl opacity-70">
                {area.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-muted">
                {t(`home.area.${area.key}.title`)}
              </h3>
              <span className="mt-auto pt-5">
                <span className="status-chip status-chip-info">
                  <span aria-hidden="true">🌱</span>
                  {t("home.area.comingSoon")}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
