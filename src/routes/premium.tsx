import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PlanComparison } from "@/components/PlanComparison";
import { useUser } from "@/lib/user";
import { PRICING } from "@/lib/plans";
import {
  createBillingPortalSession,
  createCheckoutSession,
  isStripeConfigured,
} from "@/lib/stripe.functions";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Loader2, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/premium")({
  validateSearch: (search: Record<string, unknown>) => ({
    canceled: search.canceled === "1" || search.canceled === 1,
  }),
  head: () => ({
    meta: [
      { title: "Premium · MAGNETO" },
      {
        name: "description",
        content:
          "Desbloqueá contenido exclusivo y funciones avanzadas con la suscripción MAGNETO Premium.",
      },
    ],
  }),
  component: Premium,
});

function Premium() {
  const { state, authUser, subscribe, resetPremium } = useUser();
  const checkStripe = useServerFn(isStripeConfigured);
  const checkout = useServerFn(createCheckoutSession);
  const openBillingPortal = useServerFn(createBillingPortalSession);
  const { canceled } = Route.useSearch();
  const [stripeReady, setStripeReady] = useState<boolean | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const activeLabel = state.plan === "annual" ? "Anual" : "Mensual";

  useEffect(() => {
    checkStripe()
      .then((r) => setStripeReady(r.configured))
      .catch(() => setStripeReady(false));
  }, [checkStripe]);

  useEffect(() => {
    if (canceled) toast.info("Pago cancelado. Podés intentarlo cuando quieras.");
  }, [canceled]);

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoadingPlan(plan);
    try {
      if (!authUser) {
        toast.error("Iniciá sesión para suscribirte y vincular tu pago a tu cuenta.");
        return;
      }

      if (stripeReady) {
        const { url } = await checkout({
          data: {
            plan,
            userId: authUser.id,
            email: authUser.email ?? "",
          },
        });
        window.location.href = url;
        return;
      }

      if (import.meta.env.DEV) {
        subscribe(plan);
        toast.success("Premium activado en modo demo (solo desarrollo).");
        return;
      }

      throw new Error("Stripe no está configurado en producción.");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "No se pudo procesar la suscripción";
      toast.error(message);
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleOpenBillingPortal = async () => {
    if (!authUser?.id) {
      toast.error("Iniciá sesión para gestionar tu suscripción.");
      return;
    }

    setPortalLoading(true);
    try {
      const result = await openBillingPortal({
        data: {
          userId: authUser.id,
          email: authUser.email ?? undefined,
          returnUrl: `${window.location.origin}/premium`,
        },
      });
      window.location.href = result.url;
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "No se pudo abrir el portal de facturación.";
      toast.error(message);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <AppShell
      title="MAGNETO Premium"
      subtitle="Gratis para probar · Premium para desbloquear todo y quitar anuncios."
    >
      <div className="grid gap-6">
        <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/5 p-4 sm:p-5">
          <div className="text-[10px] uppercase tracking-[0.28em] text-emerald-200/80">
            Compra segura
          </div>
          <p className="mt-2 text-sm text-[#E0E7FF]/85 leading-relaxed">
            Facturación procesada por Stripe. Podés cancelar o actualizar tu suscripción cuando
            quieras desde el portal de facturación.
          </p>
        </div>

        <div className="neon-card rounded-3xl p-6 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">
                Gratis vs Premium
              </div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Elegí cómo usar MAGNETO</h2>
              <p className="mt-2 text-sm text-[#E0E7FF]/75 max-w-2xl">
                El plan gratis incluye herramientas IA core con límites y anuncios. Premium
                desbloquea Academia, Biblioteca y escaneos ilimitados sin publicidad.
              </p>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#E0E7FF]/85">
              {state.isPremium ? `${activeLabel} activo` : "Plan Gratis"}
            </div>
          </div>
          <PlanComparison />
        </div>

        <div className="neon-card rounded-3xl p-6 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">
                Beneficios premium
              </div>
              <h2 className="mt-2 text-3xl font-semibold text-white">Accedé al próximo nivel.</h2>
            </div>
          </div>
          {stripeReady === false && !state.isPremium && import.meta.env.DEV && (
            <p className="mt-4 text-xs text-[#BFDBFE]/60 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Modo demo local: Stripe no está configurado. Solo en desarrollo se permite activar
              premium para pruebas.
            </p>
          )}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Academia completa con módulos avanzados y contenido extra",
              "Biblioteca VIP con píldoras exclusivas y recomendaciones diarias",
              "Escáner Premium: 10 aperturas + análisis estratégico",
              "Onboarding guiado para tu perfil y objetivo",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl bg-[rgba(255,255,255,0.06)] border border-white/10 p-4 text-sm text-[#E0E7FF]/80"
              >
                <div className="flex items-center gap-2 mb-2 text-white">
                  <Sparkles className="h-4 w-4 text-fuchsia-300" />
                  <span className="font-medium">{item}</span>
                </div>
                <p className="text-[13px] leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {state.isPremium ? (
          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="flex items-center gap-3 text-white mb-4">
              <Check className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">
                  Suscripción activa
                </div>
                <div className="text-lg font-semibold">Disfrutás MAGNETO Premium</div>
              </div>
            </div>
            <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">
              Seguí tu onboarding o explorá todo el contenido desbloqueado.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/onboarding"
                className="btn-cyber inline-flex items-center justify-center gap-2"
              >
                Completar onboarding
              </Link>
              <Link
                to="/academia"
                className="btn-ghost inline-flex items-center justify-center gap-2"
              >
                Ir a Academia
              </Link>
              <Link
                to="/premium-progreso"
                className="btn-ghost inline-flex items-center justify-center gap-2"
              >
                Ver progreso premium
              </Link>
              <button
                onClick={handleOpenBillingPortal}
                disabled={portalLoading}
                className="btn-ghost inline-flex items-center justify-center gap-2"
              >
                {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Gestionar suscripción
              </button>
              {import.meta.env.DEV && (
                <button
                  onClick={() => {
                    resetPremium();
                    toast.info("Premium restablecido.");
                  }}
                  className="btn-ghost text-muted-foreground"
                >
                  Restablecer suscripción
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Shield className="h-5 w-5 text-violet-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">
                    Plan mensual
                  </div>
                  <div className="text-3xl font-semibold">${PRICING.monthly.amount}</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">
                Acceso completo a Academia, Biblioteca y onboarding VIP. Ideal si querés escalar
                rápido.
              </p>
              <button
                onClick={() => handleSubscribe("monthly")}
                disabled={loadingPlan !== null}
                className="btn-cyber mt-6 w-full inline-flex items-center justify-center gap-2"
              >
                {loadingPlan === "monthly" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Suscribirme mensual
              </button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">
                    Plan anual
                  </div>
                  <div className="text-3xl font-semibold">${PRICING.annual.amount}</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">
                Todo el contenido desbloqueado con un ahorro real. Incluye onboarding guiado y
                mejoras futuras.
              </p>
              <button
                onClick={() => handleSubscribe("annual")}
                disabled={loadingPlan !== null}
                className="btn-cyber mt-6 w-full inline-flex items-center justify-center gap-2"
              >
                {loadingPlan === "annual" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Suscribirme anual
              </button>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-[rgba(168,85,247,0.18)] bg-[rgba(255,255,255,0.04)] p-6">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">
            ¿No sabés por dónde arrancar?
          </div>
          <div className="mt-3 text-white text-lg font-semibold">
            Completá el onboarding para que MAGNETO te recomiende tu ruta de mejora.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/onboarding" className="btn-ghost">
              Ir al onboarding
            </Link>
            <Link to="/biblioteca" className="btn-ghost">
              Ver Biblioteca
            </Link>
            {import.meta.env.DEV && (
              <Link to="/premium-debug" className="btn-ghost">
                Diagnóstico premium
              </Link>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#E0E7FF]/70">
            <Link
              to="/terminos"
              className="underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Términos
            </Link>
            <Link
              to="/privacidad"
              className="underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Privacidad
            </Link>
            {state.isPremium && (
              <button
                onClick={handleOpenBillingPortal}
                disabled={portalLoading}
                className="underline decoration-white/30 underline-offset-4 hover:text-white disabled:opacity-60"
              >
                Gestionar facturación
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
