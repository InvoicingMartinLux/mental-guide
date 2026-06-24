"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { addHours, loadSettings, saveSettings, Settings } from "@/lib/plan";

const TOTAL_STEPS = 4;

export default function QuestionnairePage() {
  const { t } = useLang();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [wakeTime, setWakeTime] = useState("06:00");
  const [mostUsedFor, setMostUsedFor] = useState("");
  const [stopWorkTime, setStopWorkTime] = useState("17:00");
  const [customHabits, setCustomHabits] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Prefill from existing settings (edit flow).
  useEffect(() => {
    const existing = loadSettings();
    if (existing) {
      setWakeTime(existing.wakeTime || "06:00");
      setMostUsedFor(existing.mostUsedFor || "");
      setStopWorkTime(existing.stopWorkTime || "17:00");
      setCustomHabits(existing.customHabits || []);
    }
  }, []);

  function next() {
    setError(null);
    if (step === 1 && !mostUsedFor.trim()) {
      setError(t("q.validation.required"));
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function addCustom() {
    const v = customInput.trim();
    if (!v) return;
    setCustomHabits((h) => [...h, v]);
    setCustomInput("");
  }

  function removeCustom(i: number) {
    setCustomHabits((h) => h.filter((_, idx) => idx !== i));
  }

  function generate() {
    if (!mostUsedFor.trim()) {
      setStep(1);
      setError(t("q.validation.required"));
      return;
    }
    const settings: Settings = {
      wakeTime,
      mostUsedFor: mostUsedFor.trim(),
      stopWorkTime,
      customHabits: customHabits.map((c) => c.trim()).filter(Boolean),
    };
    saveSettings(settings);
    router.push("/plan");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-2 text-sm font-medium text-brand-700">
        {t("q.step", { n: step + 1, total: TOTAL_STEPS })}
      </div>
      <h1 className="text-2xl font-bold text-slate-900">{t("q.title")}</h1>
      <p className="mt-1 text-slate-600">{t("q.subtitle")}</p>

      {/* progress bar */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {step === 0 && (
          <Field label={t("q.wake.label")} help={t("q.wake.help")}>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="input"
            />
            <p className="mt-3 rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-800">
              {t("q.firstUseInfo", { time: addHours(wakeTime, 1) })}
            </p>
          </Field>
        )}

        {step === 1 && (
          <Field label={t("q.most.label")} help={t("q.most.help")}>
            <input
              type="text"
              value={mostUsedFor}
              onChange={(e) => setMostUsedFor(e.target.value)}
              placeholder={t("q.most.placeholder")}
              className="input"
              autoFocus
            />
          </Field>
        )}

        {step === 2 && (
          <Field label={t("q.stop.label")} help={t("q.stop.help")}>
            <input
              type="time"
              value={stopWorkTime}
              onChange={(e) => setStopWorkTime(e.target.value)}
              className="input"
            />
          </Field>
        )}

        {step === 3 && (
          <Field label={t("q.custom.label")} help={t("q.custom.help")}>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustom();
                  }
                }}
                placeholder={t("q.custom.placeholder")}
                className="input flex-1"
              />
              <button
                type="button"
                onClick={addCustom}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                {t("q.custom.add")}
              </button>
            </div>

            <ul className="mt-4 space-y-2">
              {customHabits.length === 0 && (
                <li className="text-sm text-slate-400">{t("q.custom.none")}</li>
              )}
              {customHabits.map((habit, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span>{habit}</span>
                  <button
                    type="button"
                    onClick={() => removeCustom(i)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label={t("q.custom.remove")}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </Field>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-md px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
          >
            ← {t("q.back")}
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {t("q.next")} →
            </button>
          ) : (
            <button
              type="button"
              onClick={generate}
              className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              {t("q.generate")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-lg font-semibold text-slate-900">{label}</label>
      <p className="mt-1 mb-4 text-sm text-slate-500">{help}</p>
      {children}
    </div>
  );
}
