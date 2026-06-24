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
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <section className="text-center">
        <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {t("home.heroTitle")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{t("home.heroSubtitle")}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/questionnaire"
            className="rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
          >
            {t("home.start")}
          </Link>
          <Link
            href="/plan"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            {t("home.openPlan")}
          </Link>
        </div>
      </section>

      {/* Areas */}
      <section className="mt-16">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          {t("home.chooseArea")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Active: phone usage */}
          <Link
            href="/questionnaire"
            className="group relative flex flex-col rounded-xl border border-brand-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="text-3xl">📵</span>
            <h3 className="mt-3 font-semibold text-slate-900">{t("home.area.phone.title")}</h3>
            <p className="mt-1 text-sm text-slate-600">{t("home.area.phone.desc")}</p>
            <span className="mt-4 inline-flex items-center text-sm font-semibold text-brand-700 group-hover:underline">
              {t("home.start")} →
            </span>
          </Link>

          {/* Coming soon */}
          {comingSoon.map((area) => (
            <div
              key={area.key}
              className="flex flex-col rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 opacity-80"
            >
              <span className="text-3xl grayscale">{area.icon}</span>
              <h3 className="mt-3 font-semibold text-slate-700">
                {t(`home.area.${area.key}.title`)}
              </h3>
              <span className="mt-4 inline-flex w-fit rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {t("home.area.comingSoon")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
