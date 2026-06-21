import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useUser } from "@/lib/user";
import { createCheckoutSession, isStripeConfigured } from "@/lib/stripe.functions";
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
      { name: "description", content: "Desbloqueá contenido exclusivo y funciones avanzadas con la suscripción MAGNETO Premium." },
    ],
  }),
  component: Premium,
});

function Premium() {
  const { state, subscribe, resetPremium } = useUser();
  const checkStripe = useServerFn(isStripeConfigured);
  const checkout = useServerFn(createCheckoutSession);
  const { canceled } = Route.useSearch();
  const [stripeReady, setStripeReady] = useState<boolean | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | null>(null);
  const activeLabel = state.plan === "annual" ? "Anual" : "Mensual";

  useEffect(() => {
    checkStripe().then((r) => setStripeReady(r.configured)).catch(() => setStripeReady(false));
  }, [checkStripe]);

  useEffect(() => {
    if (canceled) toast.info("Pago cancelado. Podés intentarlo cuando quieras.");
  }, [canceled]);

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoadingPlan(plan);
    try {
      if (stripeReady) {
        const { url } = await checkout({ data: { plan } });
        window.location.href = url;
        return;
      }
      subscribe(plan);
      toast.success("Premium activado en modo demo.");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "No se pudo procesar la suscripción";
      toast.error(message);
    } finally {
      setLoadingPlan(null);
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
          {stripeReady === false && !state.isPremium && (
            <p className="mt-4 text-xs text-[#BFDBFE]/60 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              Modo demo: Stripe no está configurado. Los botones activan premium localmente para probar la app.
            </p>
          )}
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
            <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Seguí tu onboarding o explorá todo el contenido desbloqueado.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/onboarding" className="btn-cyber inline-flex items-center justify-center gap-2">
                Completar onboarding
              </Link>
              <Link to="/academia" className="btn-ghost inline-flex items-center justify-center gap-2">
                Ir a Academia
              </Link>
              <Link to="/premium-progreso" className="btn-ghost inline-flex items-center justify-center gap-2">
                Ver progreso premium
              </Link>
              <button onClick={() => { resetPremium(); toast.info("Premium restablecido."); }} className="btn-ghost text-muted-foreground">
                Restablecer suscripción
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Shield className="h-5 w-5 text-violet-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">Plan mensual</div>
                  <div className="text-3xl font-semibold">$19</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Acceso completo a Academia, Biblioteca y onboarding VIP. Ideal si querés escalar rápido.</p>
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
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">Plan anual</div>
                  <div className="text-3xl font-semibold">$149</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Todo el contenido desbloqueado con un ahorro real. Incluye onboarding guiado y mejoras futuras.</p>
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
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">¿No sabés por dónde arrancar?</div>
          <div className="mt-3 text-white text-lg font-semibold">Completá el onboarding para que MAGNETO te recomiende tu ruta de mejora.</div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/onboarding" className="btn-ghost">Ir al onboarding</Link>
            <Link to="/biblioteca" className="btn-ghost">Ver Biblioteca</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
