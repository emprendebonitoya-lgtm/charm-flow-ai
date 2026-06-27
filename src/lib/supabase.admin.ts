import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Plan = "monthly" | "annual";

let adminClient: SupabaseClient | null = null;

function getSupabaseAdminUrl() {
  return process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
}

function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;
  const url = getSupabaseAdminUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  if (!url || !serviceRoleKey) return null;

  adminClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export async function setUserPremiumState(params: {
  userId: string;
  active: boolean;
  plan: Plan | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  periodEnd?: number | null;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false as const, reason: "supabase-admin-not-configured" };

  const { userId, active, plan, stripeCustomerId, stripeSubscriptionId, periodEnd } = params;

  const metadata = {
    is_premium: active,
    plan,
    stripe_customer_id: stripeCustomerId ?? null,
    stripe_subscription_id: stripeSubscriptionId ?? null,
    premium_period_end: periodEnd ?? null,
    premium_updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });

  if (error) {
    return { ok: false as const, reason: error.message };
  }

  // Optional persistence table. If it does not exist, continue gracefully.
  try {
    await supabase.from("billing_subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id: stripeCustomerId ?? null,
        stripe_subscription_id: stripeSubscriptionId ?? null,
        status: active ? "active" : "inactive",
        plan,
        current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  } catch {
    // Ignore missing table/permission errors so webhook still works with auth metadata persistence.
  }

  return { ok: true as const };
}

export async function getUserPremiumState(params: { userId: string }) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, reason: "supabase-admin-not-configured" };
  }

  const { data, error } = await supabase
    .from("billing_subscriptions")
    .select(
      "status, plan, stripe_customer_id, stripe_subscription_id, current_period_end, updated_at",
    )
    .eq("user_id", params.userId)
    .maybeSingle();

  if (error) {
    return { ok: false as const, reason: error.message };
  }

  if (!data) {
    return { ok: true as const, found: false as const, state: null };
  }

  const active =
    data.status === "active" || data.status === "trialing" || data.status === "past_due";
  const plan = data.plan === "annual" ? "annual" : data.plan === "monthly" ? "monthly" : null;

  return {
    ok: true as const,
    found: true as const,
    state: {
      active,
      plan,
      status: data.status,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      currentPeriodEnd: data.current_period_end,
      updatedAt: data.updated_at,
    },
  };
}
