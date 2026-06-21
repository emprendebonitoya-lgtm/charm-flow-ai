import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Stripe from "stripe";

const PlanSchema = z.object({ plan: z.enum(["monthly", "annual"]) });
const SessionSchema = z.object({ sessionId: z.string().min(1) });

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getAppUrl() {
  return process.env.APP_URL || process.env.VITE_APP_URL || "http://localhost:8080";
}

function getPriceId(plan: "monthly" | "annual") {
  return plan === "monthly"
    ? process.env.STRIPE_PRICE_MONTHLY
    : process.env.STRIPE_PRICE_ANNUAL;
}

export const isStripeConfigured = createServerFn({ method: "GET" }).handler(async () => {
  const stripe = getStripe();
  const monthly = getPriceId("monthly");
  const annual = getPriceId("annual");
  return {
    configured: !!(stripe && monthly && annual),
  };
});

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => PlanSchema.parse(data))
  .handler(async ({ data }) => {
    const stripe = getStripe();
    const priceId = getPriceId(data.plan);
    if (!stripe || !priceId) {
      throw new Error("Stripe no está configurado. Usá el modo demo o contactá al administrador.");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${getAppUrl()}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getAppUrl()}/premium?canceled=1`,
      metadata: { plan: data.plan },
    });

    if (!session.url) {
      throw new Error("No se pudo crear la sesión de pago.");
    }

    return { url: session.url };
  });

export const verifyCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: unknown) => SessionSchema.parse(data))
  .handler(async ({ data }) => {
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
