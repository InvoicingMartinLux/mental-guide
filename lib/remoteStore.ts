import type { SupabaseClient } from "@supabase/supabase-js";
import { Entries, Settings } from "./plan";

export type RemotePlan = { settings: Settings | null; entries: Entries };

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
): Promise<RemotePlan | null> {
  const { data, error } = await supa
    .from("user_plans")
    .select("settings, entries")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("fetchUserPlan", error);
    return null;
  }
  if (!data) return null;

  return {
    settings: isValidSettings(data.settings) ? (data.settings as Settings) : null,
    entries: (data.entries ?? {}) as Entries,
  };
}

export async function upsertUserPlan(
  supa: SupabaseClient,
  userId: string,
  settings: Settings,
  entries: Entries
): Promise<void> {
  const { error } = await supa
    .from("user_plans")
    .upsert({ user_id: userId, settings, entries }, { onConflict: "user_id" });
  if (error) console.error("upsertUserPlan", error);
}

export async function deleteUserPlan(supa: SupabaseClient, userId: string): Promise<void> {
  const { error } = await supa.from("user_plans").delete().eq("user_id", userId);
  if (error) console.error("deleteUserPlan", error);
}
