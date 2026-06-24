"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { dayNames } from "@/lib/i18n";
import {
  addDays,
  buildHabits,
  clearAll,
  Entries,
  formatDayShort,
  Habit,
  habitLabel,
  isoDate,
  loadEntries,
  loadSettings,
  mondayOf,
  parseIso,
  saveEntries,
  saveSettings,
  Settings,
  weekRangeLabel,
  DAYS,
} from "@/lib/plan";
import { generatePlanPdf, PdfRow } from "@/lib/pdf";

export default function PlanPage() {
  const { t, lang } = useLang();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [entries, setEntries] = useState<Entries>({});
  const [weekStart, setWeekStart] = useState<string>(() => isoDate(mondayOf(new Date())));
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setEntries(loadEntries());
    setReady(true);
  }, []);

  const habits = useMemo(() => (settings ? buildHabits(settings) : []), [settings]);

  const flashSaved = useCallback(() => {
    setJustSaved(true);
    const id = window.setTimeout(() => setJustSaved(false), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const getValue = useCallback(
    (habitId: string, day: number): string | boolean | undefined =>
      entries[weekStart]?.[habitId]?.[day],
    [entries, weekStart]
  );

  const setValue = useCallback(
    (habitId: string, day: number, value: string | boolean) => {
      setEntries((prev) => {
        const next: Entries = { ...prev };
        const week = { ...(next[weekStart] ?? {}) };
        const habit = { ...(week[habitId] ?? {}) };
        habit[day] = value;
        week[habitId] = habit;
        next[weekStart] = week;
        saveEntries(next);
        return next;
      });
      flashSaved();
    },
    [weekStart, flashSaved]
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
    const updated: Settings = {
      ...settings,
      customHabits: [...settings.customHabits, label.trim()].filter(Boolean),
    };
    saveSettings(updated);
    setSettings(updated);
  }

  function resetPlan() {
    if (!window.confirm(t("plan.reset.confirm"))) return;
    clearAll();
    setSettings(null);
    setEntries({});
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
      values: Array.from({ length: DAYS }, (_, d) => getValue(h.id, d) ?? (h.type === "time" ? "" : false)),
    }));

    generatePlanPdf(
      {
        title: t("plan.title"),
        weekLabel: t("plan.week"),
        weekValue: weekRangeLabel(weekStart, lang),
        summary: [
          { label: t("plan.summary.wake"), value: settings.wakeTime },
          { label: t("plan.summary.firstUse"), value: buildHabits(settings)[0].target ?? "" },
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
    return <div className="mx-auto max-w-5xl px-4 py-16 text-slate-400">…</div>;
  }

  if (!settings) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-lg text-slate-600">{t("plan.noPlan")}</p>
        <Link
          href="/questionnaire"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700"
        >
          {t("plan.createFirst")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button onClick={() => shiftWeek(-1)} className="btn-ghost" aria-label={t("plan.prevWeek")}>
            ←
          </button>
          <button onClick={goThisWeek} className="btn-ghost text-sm">
            {t("plan.thisWeek")}
          </button>
          <button onClick={() => shiftWeek(1)} className="btn-ghost" aria-label={t("plan.nextWeek")}>
            →
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {justSaved && <span className="text-xs text-brand-600">✓ {t("plan.saved")}</span>}
          <button onClick={downloadPdf} className="btn-primary">
            ⬇ {t("plan.download")}
          </button>
          <button onClick={() => window.print()} className="btn-secondary">
            🖨 {t("plan.print")}
          </button>
          <Link href="/questionnaire" className="btn-secondary">
            {t("plan.edit")}
          </Link>
          <button onClick={resetPlan} className="btn-ghost text-sm text-red-600">
            {t("plan.reset")}
          </button>
        </div>
      </div>

      {/* Printable plan */}
      <div className="print-area rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-xl font-bold text-slate-900">{t("plan.title")}</h1>
          <div className="text-sm font-medium text-slate-600">
            {t("plan.week")}: {weekRangeLabel(weekStart, lang)}
          </div>
        </div>

        {/* Summary */}
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-brand-50 p-3 text-sm sm:grid-cols-4">
          <SummaryItem label={t("plan.summary.wake")} value={settings.wakeTime} />
          <SummaryItem label={t("plan.summary.firstUse")} value={habits[0].target ?? ""} />
          <SummaryItem label={t("plan.summary.activity")} value={settings.mostUsedFor} />
          <SummaryItem label={t("plan.summary.stopWork")} value={settings.stopWorkTime} />
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-slate-200 bg-slate-50 p-2 text-left font-semibold text-slate-700">
                  {t("plan.col.habit")}
                </th>
                {dayNames[lang].map((name, i) => (
                  <th
                    key={name}
                    className="border border-slate-200 bg-slate-50 p-2 text-center font-semibold text-slate-700"
                  >
                    <div>{name}</div>
                    <div className="text-xs font-normal text-slate-400">
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

        <p className="mt-4 text-xs text-slate-500">{t("plan.legend")}</p>
      </div>

      <div className="mt-3 print:hidden">
        <button onClick={addCustomHabit} className="btn-ghost text-sm text-brand-700">
          + {t("plan.addCustom")}
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-brand-700/70">{label}</div>
      <div className="font-semibold text-slate-900">{value || "–"}</div>
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
    <tr>
      <td className="border border-slate-200 p-2 font-medium text-slate-800">{label}</td>
      {Array.from({ length: DAYS }, (_, day) => {
        const value = getValue(habit.id, day);
        return (
          <td key={day} className="border border-slate-200 p-1 text-center">
            {habit.type === "time" ? (
              <input
                type="time"
                value={typeof value === "string" ? value : ""}
                onChange={(e) => setValue(habit.id, day, e.target.value)}
                className="w-full min-w-[5.5rem] rounded border border-slate-200 px-1 py-1 text-center text-xs focus:border-brand-500 focus:outline-none"
              />
            ) : (
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) => setValue(habit.id, day, e.target.checked)}
                className="h-5 w-5 cursor-pointer accent-brand-600"
              />
            )}
          </td>
        );
      })}
    </tr>
  );
}
