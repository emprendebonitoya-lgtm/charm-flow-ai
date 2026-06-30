import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useUser } from "@/lib/user";
import {
  getStripeSubscriptionStatus,
  resyncStripeSubscriptionStatus,
} from "@/lib/stripe.functions";

type StripeStatus = {
  active: boolean;
  plan: "monthly" | "annual" | null;
};

export const Route = createFileRoute("/premium-debug")({
  head: () => ({
    meta: [
      { title: "Diagnóstico Premium · MAGNETO" },
      { name: "description", content: "Estado técnico de sincronización de premium." },
    ],
  }),
  component: PremiumDebugPage,
});

function PremiumDebugPage() {
  const { authUser, state } = useUser();
  const checkStripe = useServerFn(getStripeSubscriptionStatus);
  const resyncStripe = useServerFn(resyncStripeSubscriptionStatus);
  const [loading, setLoading] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResyncAt, setLastResyncAt] = useState<string | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!authUser?.id) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await checkStripe({
          data: {
            userId: authUser.id,
            email: authUser.email ?? undefined,
          },
        });
        if (!cancelled) {
          setStripeStatus({
            active: result.active,
            plan: result.plan === "annual" ? "annual" : result.plan === "monthly" ? "monthly" : null,
          });
        }
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "No se pudo consultar Stripe");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authUser?.id, authUser?.email, checkStripe]);

  async function handleResyncNow() {
    if (!import.meta.env.DEV) return;
    if (!authUser?.id) {
      setError("Necesitás iniciar sesión para re-sincronizar.");
      return;
    }

    setResyncing(true);
    setError(null);
    try {
      const result = await resyncStripe({
        data: {
          userId: authUser.id,
          email: authUser.email ?? undefined,
        },
      });
      setStripeStatus({ active: result.active, plan: result.plan });
      setLastResyncAt(result.resyncedAt);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo re-sincronizar.");
    } finally {
      setResyncing(false);
    }
  }

  const localPlan = state.plan ?? "none";
  const stripePlan = stripeStatus?.plan ?? "none";
  const match = stripeStatus
    ? state.isPremium === stripeStatus.active && localPlan === stripePlan
    : false;

  if (!import.meta.env.DEV) {
    return (
      <AppShell title="Diagnóstico Premium" subtitle="Disponible solo en entorno de desarrollo.">
        <div className="neon-card rounded-3xl p-5 text-sm text-[#E0E7FF]/80">
          Esta herramienta está deshabilitada en producción.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Diagnóstico Premium" subtitle="Verificación rápida de estado local vs Stripe.">
      <div className="space-y-5">
        <div className="neon-card rounded-3xl p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-[#D8B4FE]/70">Usuario</div>
          <div className="mt-2 text-sm text-white">ID: {authUser?.id ?? "No autenticado"}</div>
          <div className="text-sm text-[#E0E7FF]/80">
            Email: {authUser?.email ?? "No disponible"}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="neon-card rounded-3xl p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-[#D8B4FE]/70">
              Estado local
            </div>
            <div className="mt-2 text-sm text-white">isPremium: {String(state.isPremium)}</div>
            <div className="text-sm text-[#E0E7FF]/80">plan: {localPlan}</div>
          </div>

          <div className="neon-card rounded-3xl p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-[#D8B4FE]/70">
              Estado Stripe
            </div>
            {loading ? (
              <div className="mt-2 text-sm text-[#E0E7FF]/80">Consultando…</div>
            ) : error ? (
              <div className="mt-2 text-sm text-rose-300">{error}</div>
            ) : (
              <>
                <div className="mt-2 text-sm text-white">
                  active: {String(stripeStatus?.active ?? false)}
                </div>
                <div className="text-sm text-[#E0E7FF]/80">plan: {stripePlan}</div>
              </>
            )}
          </div>
        </div>

        <div className="neon-card rounded-3xl p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-[#D8B4FE]/70">Resultado</div>
          <div
            className={`mt-2 text-sm font-medium ${match ? "text-emerald-300" : "text-amber-300"}`}
          >
            {match ? "Sincronizado" : "Desalineado o pendiente de webhook"}
          </div>
          <p className="mt-2 text-xs text-[#E0E7FF]/70">
            Si está desalineado, verificá que el webhook de Stripe esté activo y que
            STRIPE_WEBHOOK_SECRET sea correcto.
          </p>
          {lastResyncAt ? (
            <p className="mt-2 text-xs text-[#E0E7FF]/70">
              Último re-sync: {new Date(lastResyncAt).toLocaleString()}
            </p>
          ) : null}
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleResyncNow}
              disabled={resyncing || !authUser?.id}
              className="btn-cyber disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resyncing ? "Re-sincronizando..." : "Re-sync now"}
            </button>
            <Link to="/premium" className="btn-cyber">
              Ir a Premium
            </Link>
            <Link to="/" className="btn-ghost">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
