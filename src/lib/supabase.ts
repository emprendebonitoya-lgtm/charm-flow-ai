import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/plans";

let client: SupabaseClient | null = null;

function getSupabaseEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") {
  if (name === "VITE_SUPABASE_URL") {
    return import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
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
