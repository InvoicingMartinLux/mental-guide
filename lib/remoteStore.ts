import type { SupabaseClient } from "@supabase/supabase-js";
import { Entries, Settings } from "./plan";

export type RemotePlan = { settings: Settings | null; entries: Entries };

/**
 * Result of a cloud read. "empty" means the user simply has no saved plan yet;
 * "error" means we could not reach the backend and therefore know *nothing*
 * about what is stored. Callers must treat those two very differently — an
 * unreachable backend is not an empty plan.
 */
export type FetchPlanResult =
  | { status: "ok"; plan: RemotePlan }
  | { status: "empty" }
  | { status: "error"; message: string };

export type WriteResult = { ok: true } | { ok: false; message: string };

/**
 * How long a cloud call may take before we give up and fall back to local
 * state. Without this an unreachable backend leaves the UI waiting on a
 * request that never settles.
 */
const CLOUD_TIMEOUT_MS = 6000;

function deadline(): { signal: AbortSignal; done: () => void } {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CLOUD_TIMEOUT_MS);
  return { signal: ctrl.signal, done: () => clearTimeout(timer) };
}

export function isValidSettings(s: unknown): s is Settings {
  return (
    !!s &&
    typeof s === "object" &&
    typeof (s as Settings).wakeTime === "string" &&
    (s as Settings).wakeTime.length > 0
  );
}

export async function fetchUserPlan(
  supa: SupabaseClient,
  userId: string
): Promise<FetchPlanResult> {
  const { signal, done } = deadline();
  try {
    const { data, error } = await supa
      .from("user_plans")
      .select("settings, entries")
      .eq("user_id", userId)
      .abortSignal(signal)
      .maybeSingle();

    if (error) {
      console.error("fetchUserPlan", error);
      return { status: "error", message: error.message };
    }
    if (!data) return { status: "empty" };

    return {
      status: "ok",
      plan: {
        settings: isValidSettings(data.settings) ? (data.settings as Settings) : null,
        entries: (data.entries ?? {}) as Entries,
      },
    };
  } catch (err) {
    console.error("fetchUserPlan", err);
    return { status: "error", message: err instanceof Error ? err.message : "unreachable" };
  } finally {
    done();
  }
}

export async function upsertUserPlan(
  supa: SupabaseClient,
  userId: string,
  settings: Settings,
  entries: Entries
): Promise<WriteResult> {
  const { signal, done } = deadline();
  try {
    const { error } = await supa
      .from("user_plans")
      .upsert({ user_id: userId, settings, entries }, { onConflict: "user_id" })
      .abortSignal(signal);
    if (error) {
      console.error("upsertUserPlan", error);
      return { ok: false, message: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("upsertUserPlan", err);
    return { ok: false, message: err instanceof Error ? err.message : "unreachable" };
  } finally {
    done();
  }
}

export async function deleteUserPlan(
  supa: SupabaseClient,
  userId: string
): Promise<WriteResult> {
  const { error } = await supa.from("user_plans").delete().eq("user_id", userId);
  if (error) {
    console.error("deleteUserPlan", error);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}
