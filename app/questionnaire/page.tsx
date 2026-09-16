"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { usePlan } from "@/components/PlanProvider";
import { addHours, Settings } from "@/lib/plan";

const TOTAL_STEPS = 4;

export default function QuestionnairePage() {
  const { t } = useLang();
  const router = useRouter();
  const { ready, settings: savedSettings, updateSettings } = usePlan();

  const [step, setStep] = useState(0);
  const [wakeTime, setWakeTime] = useState("06:00");
  const [mostUsedFor, setMostUsedFor] = useState("");
  const [stopWorkTime, setStopWorkTime] = useState("17:00");
  const [customHabits, setCustomHabits] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Prefill from existing settings (edit flow).
  useEffect(() => {
    if (!ready || !savedSettings) return;
    setWakeTime(savedSettings.wakeTime || "06:00");
    setMostUsedFor(savedSettings.mostUsedFor || "");
    setStopWorkTime(savedSettings.stopWorkTime || "17:00");
    setCustomHabits(savedSettings.customHabits || []);
  }, [ready, savedSettings]);

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
    updateSettings(settings);
    router.push("/plan");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <span className="status-chip status-chip-info">
        {t("q.step", { n: step + 1, total: TOTAL_STEPS })}
      </span>
      <h1 className="mt-4 type-subhead text-ink sm:text-[32px] sm:font-bold sm:leading-[1.25] sm:tracking-[0.01em]">{t("q.title")}</h1>
      <p className="mt-2 type-body text-muted">{t("q.subtitle")}</p>

      {/* progress bar */}
      <div
        className="mt-6 h-2 w-full overflow-hidden rounded-full bg-lavender-50 shadow-inner"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-label={t("q.step", { n: step + 1, total: TOTAL_STEPS })}
      >
        <div
          className="h-full rounded-full bg-sage transition-all duration-300 ease-out"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      <div key={step} className="card-elevated mt-8 animate-fade-up">
        {step === 0 && (
          <Field label={t("q.wake.label")} help={t("q.wake.help")}>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="input"
            />
            <p className="mt-4 rounded-md bg-success-bg px-4 py-3 type-body-sm text-success-ink">
              <span aria-hidden="true">🌅 </span>
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
              className={`input ${error ? "input-error" : ""}`}
              aria-invalid={error ? true : undefined}
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
            <div className="flex gap-3">
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
              <button type="button" onClick={addCustom} className="btn-primary btn-md shrink-0">
                {t("q.custom.add")}
              </button>
            </div>

            <ul className="mt-6 flex flex-wrap gap-2">
              {customHabits.length === 0 && (
                <li className="rounded-md border border-dashed border-lavender-300 bg-lavender-50/60 px-4 py-3 type-body-sm text-muted">
                  <span aria-hidden="true">🌿 </span>
                  {t("q.custom.none")}
                </li>
              )}
              {customHabits.map((habit, i) => (
                <li key={`${habit}-${i}`} className="chip">
                  <span>{habit}</span>
                  <button
                    type="button"
                    onClick={() => removeCustom(i)}
                    className="rounded-full px-1 text-warmgray transition-colors duration-200 ease-out hover:text-danger-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender"
                    aria-label={`${t("q.custom.remove")}: ${habit}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </Field>
        )}

        {error && (
          <p role="alert" className="status-chip status-chip-error mt-4">
            <span aria-hidden="true">!</span>
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="btn-ghost btn-sm"
          >
            <span aria-hidden="true">←</span> {t("q.back")}
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button type="button" onClick={next} className="btn-primary btn-md">
              {t("q.next")} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button type="button" onClick={generate} className="btn-primary btn-md">
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
      <label className="block type-subhead text-ink">{label}</label>
      <p className="mt-2 mb-5 type-body-sm text-muted">{help}</p>
      {children}
    </div>
  );
}
