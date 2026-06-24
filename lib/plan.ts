import { Lang, translate } from "./i18n";

export type Settings = {
  wakeTime: string; // "06:00"
  mostUsedFor: string; // free text, e.g. "AI apps"
  stopWorkTime: string; // "16:00"
  customHabits: string[];
};

export type HabitKind = "firstUse" | "stopActivity" | "noNightPhone" | "analogAlarm" | "custom";
export type HabitType = "time" | "check";

export type Habit = {
  id: string;
  kind: HabitKind;
  type: HabitType;
  /** display target shown in the label (e.g. first-use time) */
  target?: string;
  /** label for custom habits (free text supplied by the user) */
  customLabel?: string;
};

/** Entries are keyed: weekStartISO -> habitId -> dayIndex(0..4) -> value. */
export type Entries = Record<string, Record<string, Record<number, string | boolean>>>;

export const STORAGE_KEYS = {
  settings: "mg.settings",
  entries: "mg.entries",
  lang: "mg.lang",
} as const;

export const DAYS = 5;

/** Add a whole number of hours to a "HH:MM" string, clamped to the same day. */
export function addHours(time: string, hours: number): string {
  const [h, m] = (time || "00:00").split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return time;
  let total = h * 60 + m + hours * 60;
  total = Math.max(0, Math.min(total, 23 * 60 + 59));
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function firstUseTime(settings: Settings): string {
  return addHours(settings.wakeTime, 1);
}

export function buildHabits(settings: Settings): Habit[] {
  const habits: Habit[] = [
    { id: "firstUse", kind: "firstUse", type: "time", target: firstUseTime(settings) },
    { id: "stopActivity", kind: "stopActivity", type: "check" },
    { id: "noNightPhone", kind: "noNightPhone", type: "check" },
    { id: "analogAlarm", kind: "analogAlarm", type: "check" },
  ];
  settings.customHabits.forEach((label, i) => {
    const trimmed = label.trim();
    if (trimmed) {
      habits.push({ id: `custom-${i}`, kind: "custom", type: "check", customLabel: trimmed });
    }
  });
  return habits;
}

export function habitLabel(habit: Habit, settings: Settings, lang: Lang): string {
  switch (habit.kind) {
    case "firstUse":
      return translate(lang, "plan.habit.firstUse", { time: habit.target ?? firstUseTime(settings) });
    case "stopActivity":
      return translate(lang, "plan.habit.stopActivity", {
        time: settings.stopWorkTime,
        activity: settings.mostUsedFor,
      });
    case "noNightPhone":
      return translate(lang, "plan.habit.noNightPhone");
    case "analogAlarm":
      return translate(lang, "plan.habit.analogAlarm");
    case "custom":
      return habit.customLabel ?? "";
  }
}

/* ---------- date helpers ---------- */

/** Monday of the week containing `date`. */
export function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun .. 6 = Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
  d.setDate(d.getDate() + diff);
  return d;
}

export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDayShort(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function weekRangeLabel(weekStartIso: string, lang: Lang): string {
  const start = parseIso(weekStartIso);
  const end = addDays(start, DAYS - 1);
  return `${formatDate(start, lang)} – ${formatDate(end, lang)}`;
}

/* ---------- storage ---------- */

export function loadSettings(): Settings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return null;
    return JSON.parse(raw) as Settings;
  } catch {
    return null;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function loadEntries(): Entries {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.entries);
    if (!raw) return {};
    return JSON.parse(raw) as Entries;
  } catch {
    return {};
  }
}

export function saveEntries(entries: Entries): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.settings);
  window.localStorage.removeItem(STORAGE_KEYS.entries);
}
