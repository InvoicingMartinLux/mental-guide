"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { usePlan } from "@/components/PlanProvider";
import { dayNames } from "@/lib/i18n";
import {
  addDays,
  buildHabits,
  formatDayShort,
  Habit,
  habitLabel,
  isoDate,
  mondayOf,
  parseIso,
  weekRangeLabel,
  DAYS,
} from "@/lib/plan";
import { generatePlanPdf, PdfRow } from "@/lib/pdf";

export default function PlanPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const { ready, settings, entries, saving, saved, updateSettings, setEntry, reset } = usePlan();

  const [weekStart, setWeekStart] = useState<string>(() => isoDate(mondayOf(new Date())));

  const habits = useMemo(() => (settings ? buildHabits(settings) : []), [settings]);

  const getValue = useCallback(
    (habitId: string, day: number): string | boolean | undefined =>
      entries[weekStart]?.[habitId]?.[day],
    [entries, weekStart]
  );

  const setValue = useCallback(
    (habitId: string, day: number, value: string | boolean) =>
      setEntry(weekStart, habitId, day, value),
    [weekStart, setEntry]
  );

  function shiftWeek(deltaWeeks: number) {
    setWeekStart((iso) => isoDate(addDays(parseIso(iso), deltaWeeks * 7)));
  }

  function goThisWeek() {
    setWeekStart(isoDate(mondayOf(new Date())));
  }

  function addCustomHabit() {
    const label = window.prompt(t("q.custom.placeholder"));
    if (!label || !settings) return;
    updateSettings({
      ...settings,
      customHabits: [...settings.customHabits, label.trim()].filter(Boolean),
    });
  }

  function resetPlan() {
    if (!window.confirm(t("plan.reset.confirm"))) return;
    reset();
    router.push("/questionnaire");
  }

  function downloadPdf() {
    if (!settings) return;
    const dayHeaders = dayNames[lang].map(
      (name, i) => `${name}\n${formatDayShort(addDays(parseIso(weekStart), i), lang)}`
    );
    const rows: PdfRow[] = habits.map((h) => ({
      label: habitLabel(h, settings, lang),
      type: h.type,
      values: Array.from(
        { length: DAYS },
        (_, d) => getValue(h.id, d) ?? (h.type === "time" ? "" : false)
      ),
    }));

    generatePlanPdf(
      {
        title: t("plan.title"),
        weekLabel: t("plan.week"),
        weekValue: weekRangeLabel(weekStart, lang),
        summary: [
          { label: t("plan.summary.wake"), value: settings.wakeTime },
          { label: t("plan.summary.firstUse"), value: habits[0]?.target ?? "" },
          { label: t("plan.summary.activity"), value: settings.mostUsedFor },
          { label: t("plan.summary.stopWork"), value: settings.stopWorkTime },
        ],
        instructions: t("pdf.markInstructions"),
        dayHeaders,
        habitColLabel: t("plan.col.habit"),
        rows,
      },
      `mental-guide-${weekStart}.pdf`
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-16 type-body text-muted">
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-breathe rounded-full bg-sage"
        />
        …
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <div className="card-elevated text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 animate-breathe items-center justify-center rounded-full bg-sage-50 text-3xl"
          >
            🌱
          </span>
          <p className="mt-6 type-body-lg text-ink">{t("plan.noPlan")}</p>
          <Link href="/questionnaire" className="btn-primary btn-lg mt-6">
            {t("plan.createFirst")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-1 rounded-full bg-lavender-50 p-1 shadow-inner">
          <button
            onClick={() => shiftWeek(-1)}
            className="btn-ghost btn-sm rounded-full px-3"
            aria-label={t("plan.prevWeek")}
          >
            ←
          </button>
          <button onClick={goThisWeek} className="btn-ghost btn-sm rounded-full">
            {t("plan.thisWeek")}
          </button>
          <button
            onClick={() => shiftWeek(1)}
            className="btn-ghost btn-sm rounded-full px-3"
            aria-label={t("plan.nextWeek")}
          >
            →
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span aria-live="polite" className="min-w-[5rem] text-right">
            {saving ? (
              <span className="type-caption text-muted">…</span>
            ) : saved ? (
              <span className="status-chip status-chip-success">
                <span aria-hidden="true">✓</span>
                {t("plan.saved")}
              </span>
            ) : null}
          </span>
          <button onClick={downloadPdf} className="btn-primary btn-sm">
            <span aria-hidden="true">⬇</span> {t("plan.download")}
          </button>
          <button onClick={() => window.print()} className="btn-secondary btn-sm">
            <span aria-hidden="true">🖨</span> {t("plan.print")}
          </button>
          <Link href="/questionnaire" className="btn-secondary btn-sm">
            {t("plan.edit")}
          </Link>
          <button onClick={resetPlan} className="btn-ghost btn-sm text-danger-ink hover:bg-danger-bg">
            {t("plan.reset")}
          </button>
        </div>
      </div>

      {/* Printable plan */}
      <div className="print-area rounded-xl bg-surface p-6 shadow-medium sm:p-8">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="type-subhead text-ink">{t("plan.title")}</h1>
          <div className="type-body-sm font-medium text-muted">
            {t("plan.week")}: {weekRangeLabel(weekStart, lang)}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg bg-sage-50 p-4 sm:grid-cols-4">
          <SummaryItem label={t("plan.summary.wake")} value={settings.wakeTime} />
          <SummaryItem label={t("plan.summary.firstUse")} value={habits[0]?.target ?? ""} />
          <SummaryItem label={t("plan.summary.activity")} value={settings.mostUsedFor} />
          <SummaryItem label={t("plan.summary.stopWork")} value={settings.stopWorkTime} />
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="rounded-tl-md border-b border-lavender-200 bg-lavender-50 p-3 text-left type-caption uppercase tracking-[0.08em] text-muted">
                  {t("plan.col.habit")}
                </th>
                {dayNames[lang].map((name, i) => (
                  <th
                    key={name}
                    className="border-b border-l border-lavender-200 bg-lavender-50 p-3 text-center font-display text-sm font-bold text-ink last:rounded-tr-md"
                  >
                    <div>{name}</div>
                    <div className="type-caption font-normal text-muted">
                      {formatDayShort(addDays(parseIso(weekStart), i), lang)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  label={habitLabel(habit, settings, lang)}
                  getValue={getValue}
                  setValue={setValue}
                />
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 type-body-sm text-muted">
          <span aria-hidden="true">💡 </span>
          {t("plan.legend")}
        </p>
      </div>

      <div className="mt-4 print:hidden">
        <button onClick={addCustomHabit} className="btn-ghost btn-sm">
          <span aria-hidden="true">+</span> {t("plan.addCustom")}
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="type-overline text-sage-ink">{label}</div>
      <div className="mt-1 font-display text-base font-bold text-ink">{value || "–"}</div>
    </div>
  );
}

function HabitRow({
  habit,
  label,
  getValue,
  setValue,
}: {
  habit: Habit;
  label: string;
  getValue: (id: string, day: number) => string | boolean | undefined;
  setValue: (id: string, day: number, value: string | boolean) => void;
}) {
  return (
    <tr className="border-b border-lavender-200 transition-colors duration-200 ease-out hover:bg-lavender-50/60">
      <td className="p-3 type-body-sm font-medium text-ink">{label}</td>
      {Array.from({ length: DAYS }, (_, day) => {
        const value = getValue(habit.id, day);
        const done = value === true;
        return (
          <td
            key={day}
            className={`border-l border-lavender-200 p-2 text-center transition-colors duration-200 ease-out ${
              done ? "bg-success-bg" : ""
            }`}
          >
            {habit.type === "time" ? (
              <input
                type="time"
                value={typeof value === "string" ? value : ""}
                onChange={(e) => setValue(habit.id, day, e.target.value)}
                aria-label={label}
                className="h-9 w-full min-w-[5.5rem] rounded-md border border-lavender-300 bg-surface px-2 text-center text-xs text-ink shadow-inner outline-none transition-colors duration-200 ease-out hover:border-lavender focus:border-2 focus:border-sage"
              />
            ) : (
              <input
                type="checkbox"
                checked={done}
                onChange={(e) => setValue(habit.id, day, e.target.checked)}
                aria-label={label}
                className="checkbox mx-auto"
              />
            )}
          </td>
        );
      })}
    </tr>
  );
}
