import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AppShell } from "@/components/AppShell";
import { useUser } from "@/lib/user";
import { trackEvent } from "@/lib/analytics";
import { createCheckoutSession, getStripePlanPrices, isStripeConfigured } from "@/lib/stripe.functions";
import { Check, Loader2, Shield, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium · MAGNETO" },
      { name: "description", content: "Desbloqueá contenido exclusivo y funciones avanzadas con la suscripción MAGNETO Premium." },
    ],
  }),
  component: Premium,
});

function Premium() {
  const { state, authUser } = useUser();
  const navigate = useNavigate();
  const checkStripeConfigured = useServerFn(isStripeConfigured);
  const fetchPlanPrices = useServerFn(getStripePlanPrices);
  const checkout = useServerFn(createCheckoutSession);
  const activeLabel = state.plan === "annual" ? "Anual" : "Mensual";
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL ?? "soporte@magneto.app";
  const [stripeReady, setStripeReady] = useState(false);
  const [loadingStripe, setLoadingStripe] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<"monthly" | "annual" | null>(null);
  const [monthlyAmount, setMonthlyAmount] = useState<number | null>(null);
  const [annualAmount, setAnnualAmount] = useState<number | null>(null);

  const waitlistHref = `mailto:${supportEmail}?subject=Lista%20de%20espera%20MAGNETO%20Premium&body=Hola%2C%20quiero%20entrar%20a%20la%20lista%20de%20espera%20de%20MAGNETO%20Premium.`;

  const handleWaitlistClick = (plan: "monthly" | "annual") => {
    trackEvent("premium_waitlist_click", {
      plan,
      source: "premium_page",
    });
  };

  const handleSupportClick = () => {
    trackEvent("premium_support_click", {
      source: "premium_page",
    });
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [configResult, priceResult] = await Promise.all([
          checkStripeConfigured(),
          fetchPlanPrices(),
        ]);
        if (!cancelled) {
          setStripeReady(configResult.configured);
          if (typeof priceResult.monthly?.amount === "number") {
            setMonthlyAmount(priceResult.monthly.amount);
          }
          if (typeof priceResult.annual?.amount === "number") {
            setAnnualAmount(priceResult.annual.amount);
          }
        }
      } catch {
        if (!cancelled) setStripeReady(false);
      } finally {
        if (!cancelled) setLoadingStripe(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCheckout = async (plan: "monthly" | "annual") => {
    if (!authUser?.id || !authUser.email) {
      toast.info("Entrá a tu cuenta para continuar con el pago.");
      navigate({ to: "/login" });
      return;
    }

    setCheckoutLoading(plan);
    try {
      trackEvent("premium_checkout_click", {
        plan,
        source: "premium_page",
      });

      const result = await checkout({
        data: {
          plan,
          userId: authUser.id,
          email: authUser.email,
        },
      });

      if (!result.url) {
        throw new Error("No se recibió URL de checkout.");
      }

      window.location.href = result.url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar el checkout.");
      setCheckoutLoading(null);
    }
  };

  return (
    <AppShell title="MAGNETO Premium" subtitle="Desbloqueá lo mejor: Academia, Biblioteca y el onboarding guiado.">
      <div className="grid gap-6">
        <div className="neon-card rounded-3xl p-6 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Beneficios premium</div>
              <h2 className="mt-2 text-3xl font-semibold text-white">Accedé al próximo nivel.</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#E0E7FF]/85">
              {state.isPremium ? `${activeLabel} activo` : "Sin suscripción"}
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Academia completa con módulos avanzados y contenido extra",
              "Biblioteca VIP con píldoras exclusivas y recomendaciones diarias",
              "Escáner Premium: 10 aperturas + análisis estratégico",
              "Onboarding guiado para tu perfil y objetivo",
            ].map((item) => (
              <div key={item} className="rounded-3xl bg-[rgba(255,255,255,0.06)] border border-white/10 p-4 text-sm text-[#E0E7FF]/80">
                <div className="flex items-center gap-2 mb-2 text-white">
                  <Sparkles className="h-4 w-4 text-fuchsia-300" />
                  <span className="font-medium">{item}</span>
                </div>
                <p className="text-[13px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>

          {loadingStripe ? (
            <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-[#E0E7FF]/80 inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verificando configuración de pagos...
            </div>
          ) : stripeReady ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100/90">
              Stripe activo. Ya podés pagar y activar Premium automáticamente.
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100/90">
              Pagos con Stripe en habilitación. Por ahora estamos tomando ingresos por lista de espera y
              acceso manual.
            </div>
          )}
        </div>

        {state.isPremium ? (
          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="flex items-center gap-3 text-white mb-4">
              <Check className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">Suscripción activa</div>
                <div className="text-lg font-semibold">Disfrutás MAGNETO Premium</div>
              </div>
            </div>
            <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Seguí tu onboarding o volvé a cualquier contenido con todo desbloqueado. Este estado se guarda en tu navegador para que puedas probar la experiencia premium.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to="/onboarding" className="btn-cyber inline-flex items-center justify-center gap-2">
                Completar onboarding
              </Link>
              <Link to="/academia" className="btn-ghost inline-flex items-center justify-center gap-2">
                Ir a Academia
              </Link>
              <Link to="/premium-progreso" className="btn-ghost inline-flex items-center justify-center gap-2">
                Ver progreso premium
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Shield className="h-5 w-5 text-violet-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">Plan mensual</div>
                  <div className="text-3xl font-semibold">{monthlyAmount != null ? `$${monthlyAmount.toFixed(2)}` : "Ver en checkout"}</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Acceso completo a Academia, Biblioteca y onboarding VIP. Ideal si querés escalar rápido y desbloquear el plan completo.</p>
              {stripeReady ? (
                <button
                  onClick={() => handleCheckout("monthly")}
                  disabled={checkoutLoading !== null}
                  className="btn-cyber mt-6 w-full inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading === "monthly" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Redirigiendo...
                    </span>
                  ) : (
                    "Pagar mensual"
                  )}
                </button>
              ) : (
                <a
                  href={waitlistHref}
                  onClick={() => handleWaitlistClick("monthly")}
                  className="btn-cyber mt-6 w-full inline-flex items-center justify-center"
                >
                  Lista de espera mensual
                </a>
              )}
            </div>
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">Plan anual</div>
                  <div className="text-3xl font-semibold">{annualAmount != null ? `$${annualAmount.toFixed(2)}` : "Ver en checkout"}</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Todo el contenido desbloqueado con un ahorro real. Incluye onboarding guiado y acceso a las mejoras futuras de MAGNETO.</p>
              {stripeReady ? (
                <button
                  onClick={() => handleCheckout("annual")}
                  disabled={checkoutLoading !== null}
                  className="btn-cyber mt-6 w-full inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading === "annual" ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Redirigiendo...
                    </span>
                  ) : (
                    "Pagar anual"
                  )}
                </button>
              ) : (
                <a
                  href={waitlistHref}
                  onClick={() => handleWaitlistClick("annual")}
                  className="btn-cyber mt-6 w-full inline-flex items-center justify-center"
                >
                  Lista de espera anual
                </a>
              )}
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] p-6">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">¿No sabés por dónde arrancar?</div>
          <div className="mt-3 text-white text-lg font-semibold">Completá el onboarding para que MAGNETO te recomiende tu ruta de mejora.</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/onboarding" className="btn-ghost">Ir al onboarding</Link>
            <Link to="/biblioteca" className="btn-ghost">Ver Biblioteca</Link>
            <a
              href={`mailto:${supportEmail}?subject=Consulta%20Premium%20MAGNETO`}
              onClick={handleSupportClick}
              className="btn-ghost"
            >
              Hablar con soporte
            </a>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
