import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/plans";

let client: SupabaseClient | null = null;

function getSupabaseEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
  const viteValue = import.meta.env?.[name] as string | undefined;
  if (viteValue) return viteValue;
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return undefined;
}

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    const url = getSupabaseEnv("VITE_SUPABASE_URL");
    const anonKey = getSupabaseEnv("VITE_SUPABASE_ANON_KEY");
    if (!url || !anonKey) return null;
    client = createClient(
      url,
      anonKey,
    );
  }
  return client;
}
