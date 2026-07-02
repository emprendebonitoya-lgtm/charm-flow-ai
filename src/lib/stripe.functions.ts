import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";
import { getUserPremiumState, setUserPremiumState } from "@/lib/supabase.admin";

type Plan = "monthly" | "annual";

const PlanSchema = z.object({
  plan: z.enum(["monthly", "annual"]),
  userId: z.string().min(1),
  email: z.string().email(),
});
const SessionSchema = z.object({ sessionId: z.string().min(1) });
const SubscriptionStatusSchema = z.object({
  userId: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

const ResyncSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().optional(),
});

const BillingPortalSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().optional(),
  returnUrl: z.string().url().optional(),
});

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getAppUrl() {
  return process.env.APP_URL || process.env.VITE_APP_URL || "http://localhost:8080";
}

function getPlanReference(plan: "monthly" | "annual") {
  return plan === "monthly" ? process.env.STRIPE_PRICE_MONTHLY : process.env.STRIPE_PRICE_ANNUAL;
}

async function resolveRecurringPriceId(stripe: Stripe, reference?: string) {
  if (!reference) return null;

  if (reference.startsWith("price_")) {
    const price = await stripe.prices.retrieve(reference);
    return price.recurring ? price.id : null;
  }

  if (reference.startsWith("prod_")) {
    const prices = await stripe.prices.list({ product: reference, active: true, limit: 100 });
    const recurringPrices = prices.data.filter((price) => !!price.recurring);

    // Safety first: when a product has multiple recurring prices, do not guess.
    if (recurringPrices.length !== 1) {
      return null;
    }

    return recurringPrices[0]?.id ?? null;
  }

  return null;
}

async function resolveStripeSubscriptionStatus(
  stripe: Stripe,
  data: z.infer<typeof SubscriptionStatusSchema>,
) {
  let customerId: string | null = null;

  if (data.userId) {
    const byMetadata = await stripe.customers.search({
      query: `metadata['userId']:'${data.userId}'`,
      limit: 1,
    });
    customerId = byMetadata.data[0]?.id ?? null;
  }

  if (!customerId && data.email) {
    const customers = await stripe.customers.list({ email: data.email, limit: 1 });
    customerId = customers.data[0]?.id ?? null;
  }

  if (!customerId) {
    return {
      active: false as const,
      plan: null,
      customerId: null,
      subscriptionId: null,
      periodEnd: null,
      status: null,
    };
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "all",
    limit: 10,
  });

  const activeSubscription = subscriptions.data.find(
    (sub) => sub.status === "active" || sub.status === "trialing" || sub.status === "past_due",
  );

  if (!activeSubscription) {
    return {
      active: false as const,
      plan: null,
      customerId,
      subscriptionId: null,
      periodEnd: null,
      status: null,
    };
  }

  const annualPriceId = await resolveRecurringPriceId(stripe, getPlanReference("annual"));
  const monthlyPriceId = await resolveRecurringPriceId(stripe, getPlanReference("monthly"));
  const hasAnnual = activeSubscription.items.data.some((item) => item.price.id === annualPriceId);
  const hasMonthly = activeSubscription.items.data.some((item) => item.price.id === monthlyPriceId);
  const plan: Plan = hasAnnual ? "annual" : hasMonthly ? "monthly" : "monthly";

  return {
    active: true as const,
    plan,
    customerId,
    subscriptionId: activeSubscription.id,
    periodEnd: (activeSubscription as any).current_period_end ?? null,
    status: activeSubscription.status,
  };
}

export const isStripeConfigured = createServerFn({ method: "GET" }).handler(async () => {
  const stripe = getStripe();
  if (!stripe) return { configured: false };

  const monthly = await resolveRecurringPriceId(stripe, getPlanReference("monthly"));
  const annual = await resolveRecurringPriceId(stripe, getPlanReference("annual"));
  return {
    configured: !!(monthly && annual),
  };
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => PlanSchema.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof PlanSchema> }) => {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe no está configurado. Usá el modo demo o contactá al administrador.");
    }

    const priceId = await resolveRecurringPriceId(stripe, getPlanReference(data.plan));
    if (!priceId) {
      throw new Error("Stripe no está configurado. Usá el modo demo o contactá al administrador.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getAppUrl()}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getAppUrl()}/premium?canceled=1`,
      customer_email: data.email,
      metadata: {
        plan: data.plan,
        userId: data.userId,
        email: data.email,
      },
      subscription_data: {
        metadata: {
          userId: data.userId,
          email: data.email,
          plan: data.plan,
        },
      },
    });

    if (!session.url) {
      throw new Error("No se pudo crear la sesión de pago.");
    }

    return { url: session.url };
  });

export const verifyCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => SessionSchema.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof SessionSchema> }) => {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe no está configurado.");
    }

    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (!paid) {
      return { valid: false as const };
    }

    const plan = session.metadata?.plan === "annual" ? "annual" : "monthly";
    return { valid: true as const, plan };
  });

export const getStripeSubscriptionStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => SubscriptionStatusSchema.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof SubscriptionStatusSchema> }) => {
    if (data.userId) {
      const dbState = await getUserPremiumState({ userId: data.userId });
      if (dbState.ok && dbState.found && dbState.state) {
        return {
          active: dbState.state.active,
          plan: dbState.state.active ? dbState.state.plan : null,
          customerId: dbState.state.stripeCustomerId,
          subscriptionId: dbState.state.stripeSubscriptionId,
          status: dbState.state.status,
          source: "database" as const,
        };
      }
    }

    const stripe = getStripe();
    if (!stripe) {
      return { active: false as const, plan: null, source: "none" as const };
    }

    const resolved = await resolveStripeSubscriptionStatus(stripe, data);

    if (data.userId) {
      // Backfill DB when Stripe has state but local table is still empty.
      await setUserPremiumState({
        userId: data.userId,
        active: resolved.active,
        plan: resolved.active ? resolved.plan : null,
        stripeCustomerId: resolved.customerId,
        stripeSubscriptionId: resolved.subscriptionId,
        periodEnd: resolved.periodEnd,
      });
    }

    return {
      active: resolved.active,
      plan: resolved.plan,
      customerId: resolved.customerId,
      subscriptionId: resolved.subscriptionId,
      status: resolved.status,
      source: "stripe" as const,
    };
  });

export const resyncStripeSubscriptionStatus = createServerFn({ method: "POST" })
  .validator((data: unknown) => ResyncSchema.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof ResyncSchema> }) => {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe no está configurado.");
    }

    const resolved = await resolveStripeSubscriptionStatus(stripe, data);

    const persisted = await setUserPremiumState({
      userId: data.userId,
      active: resolved.active,
      plan: resolved.active ? resolved.plan : null,
      stripeCustomerId: resolved.customerId,
      stripeSubscriptionId: resolved.subscriptionId,
      periodEnd: resolved.periodEnd,
    });

    if (!persisted.ok) {
      throw new Error(`No se pudo persistir el estado premium: ${persisted.reason}`);
    }

    return {
      active: resolved.active,
      plan: resolved.active ? resolved.plan : null,
      customerId: resolved.customerId,
      subscriptionId: resolved.subscriptionId,
      status: resolved.status,
      resyncedAt: new Date().toISOString(),
    };
  });

export const createBillingPortalSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => BillingPortalSchema.parse(data))
  .handler(async ({ data }: { data: z.infer<typeof BillingPortalSchema> }) => {
    const stripe = getStripe();
    if (!stripe) {
      throw new Error("Stripe no está configurado.");
    }

    let customerId: string | null = null;

    const dbState = await getUserPremiumState({ userId: data.userId });
    if (dbState.ok && dbState.found && dbState.state?.stripeCustomerId) {
      customerId = dbState.state.stripeCustomerId;
    }

    if (!customerId && data.email) {
      const customers = await stripe.customers.list({ email: data.email, limit: 1 });
      customerId = customers.data[0]?.id ?? null;
    }

    if (!customerId) {
      throw new Error("No se encontró cliente de Stripe para esta cuenta.");
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: data.returnUrl ?? `${getAppUrl()}/premium`,
    });

    if (!session.url) {
      throw new Error("No se pudo crear la sesión del portal de facturación.");
    }

    return { url: session.url };
  });
