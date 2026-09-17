"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import { getSupabase } from "@/lib/supabase";
import {
  clearAll,
  Entries,
  loadEntries,
  loadSettings,
  saveEntries,
  saveSettings,
  Settings,
} from "@/lib/plan";
import { deleteUserPlan, fetchUserPlan, isValidSettings, upsertUserPlan } from "@/lib/remoteStore";

type PlanContextValue = {
  ready: boolean;
  settings: Settings | null;
  entries: Entries;
  saving: boolean;
  saved: boolean;
  /**
   * True when the user is signed in but the cloud is unreachable. The plan is
   * still usable and still saved locally — it just is not syncing.
   */
  cloudOffline: boolean;
  /** Replace the questionnaire settings (also used to add custom habits). */
  updateSettings: (settings: Settings) => void;
  /** Set a single cell value for a given week/habit/day. */
  setEntry: (weekStart: string, habitId: string, day: number, value: string | boolean) => void;
  reset: () => void;
};

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { ready: authReady, user } = useAuth();

  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [entries, setEntries] = useState<Entries>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [cloudOffline, setCloudOffline] = useState(false);

  const skipNextPersist = useRef(true);
  /**
   * Cleared when a cloud read fails. While false we never write to the cloud:
   * we could not read the stored row, so pushing this device's state could
   * overwrite a good plan with a stale or empty one.
   */
  const cloudWritable = useRef(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load plan whenever auth resolves or the signed-in user changes.
  useEffect(() => {
    if (!authReady) return;
    let cancelled = false;

    (async () => {
      setReady(false);
      skipNextPersist.current = true;

      const localSettings = loadSettings();
      const localEntries = loadEntries();
      const supa = getSupabase();

      if (user && supa) {
        const res = await fetchUserPlan(supa, user.id);
        if (cancelled) return;

        if (res.status === "error") {
          // Backend unreachable. We do not know what is stored, so fall back to
          // this device's copy and keep it: blanking the plan here (or pushing
          // an empty state up once the backend returns) would destroy it.
          cloudWritable.current = false;
          setCloudOffline(true);
          setSettings(isValidSettings(localSettings) ? localSettings : null);
          setEntries(localEntries);
        } else {
          cloudWritable.current = true;
          setCloudOffline(false);

          const remote = res.status === "ok" ? res.plan : null;

          if (remote && isValidSettings(remote.settings)) {
            setSettings(remote.settings);
            setEntries(remote.entries ?? {});
            saveSettings(remote.settings);
            saveEntries(remote.entries ?? {});
          } else if (isValidSettings(localSettings)) {
            // Guest had a plan locally — migrate it to the cloud on first sign-in.
            setSettings(localSettings);
            setEntries(localEntries);
            await upsertUserPlan(supa, user.id, localSettings, localEntries);
          } else {
            setSettings(null);
            setEntries({});
          }
        }
      } else {
        cloudWritable.current = true;
        setCloudOffline(false);
        setSettings(isValidSettings(localSettings) ? localSettings : null);
        setEntries(localEntries);
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [authReady, user]);

  const flashSaved = useCallback(() => {
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1400);
  }, []);

  // Persist on change (local immediately + cloud debounced). Skips the load.
  useEffect(() => {
    if (!ready) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }

    if (settings) saveSettings(settings);
    saveEntries(entries);

    const supa = getSupabase();
    if (user && supa && settings && cloudWritable.current) {
      setSaving(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const res = await upsertUserPlan(supa, user.id, settings, entries);
        setSaving(false);
        if (res.ok) {
          setCloudOffline(false);
          flashSaved();
        } else {
          // Don't claim "saved" — the change only made it to this device.
          cloudWritable.current = false;
          setCloudOffline(true);
        }
      }, 600);
    } else if (cloudWritable.current) {
      // Guest (or no backend configured): local-only really is saved.
      flashSaved();
    }
  }, [settings, entries, ready, user, flashSaved]);

  const updateSettings = useCallback((next: Settings) => {
    setSettings(next);
  }, []);

  const setEntry = useCallback(
    (weekStart: string, habitId: string, day: number, value: string | boolean) => {
      setEntries((prev) => {
        const next: Entries = { ...prev };
        const week = { ...(next[weekStart] ?? {}) };
        const habit = { ...(week[habitId] ?? {}) };
        habit[day] = value;
        week[habitId] = habit;
        next[weekStart] = week;
        return next;
      });
    },
    []
  );

  const reset = useCallback(() => {
    clearAll();
    const supa = getSupabase();
    if (user && supa) void deleteUserPlan(supa, user.id);
    skipNextPersist.current = true;
    setSettings(null);
    setEntries({});
  }, [user]);

  return (
    <PlanContext.Provider
      value={{
        ready,
        settings,
        entries,
        saving,
        saved,
        cloudOffline,
        updateSettings,
        setEntry,
        reset,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used within PlanProvider");
  return ctx;
}
