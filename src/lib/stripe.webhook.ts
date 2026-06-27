import Stripe from "stripe";
import { setUserPremiumState } from "@/lib/supabase.admin";

type Plan = "monthly" | "annual";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function getWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET;
}

function inferPlanFromSubscription(subscription: Stripe.Subscription): Plan | null {
  const annualPriceId = process.env.STRIPE_PRICE_ANNUAL;
  const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY;

  if (subscription.items.data.some((i) => i.price.id === annualPriceId)) return "annual";
  if (subscription.items.data.some((i) => i.price.id === monthlyPriceId)) return "monthly";
  return null;
}

function isSubscriptionActive(status: Stripe.Subscription.Status) {
  return status === "active" || status === "trialing" || status === "past_due";
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription, userId?: string | null) {
  if (!userId) return;

  const active = isSubscriptionActive(subscription.status);
  const plan = active ? (inferPlanFromSubscription(subscription) ?? "monthly") : null;
  await setUserPremiumState({
    userId,
    active,
    plan,
    stripeCustomerId:
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id,
    stripeSubscriptionId: subscription.id,
    periodEnd: subscription.current_period_end,
  });
}

export async function handleStripeWebhookRequest(request: Request): Promise<Response> {
  const stripe = getStripe();
  const webhookSecret = getWebhookSecret();
  if (!stripe || !webhookSecret) {
    return new Response("Stripe webhook not configured", { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid signature";
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription") break;
        const subscriptionId =
          typeof session.subscription === "string" ? session.subscription : null;
        const userId = session.metadata?.userId ?? null;
        if (!subscriptionId || !userId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await handleSubscriptionUpdate(subscription, userId);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId ?? null;
        await handleSubscriptionUpdate(subscription, userId);
        break;
      }

      default:
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("[stripe-webhook] handler error", error);
    return new Response("Webhook handler failure", { status: 500 });
  }
}
