import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useUser } from "@/lib/user";
import { resyncStripeSubscriptionStatus, verifyCheckoutSession } from "@/lib/stripe.functions";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Check, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/premium-success")({
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({
    meta: [
      { title: "Suscripción confirmada · MAGNETO" },
      { name: "description", content: "Tu suscripción MAGNETO Premium fue procesada." },
    ],
  }),
  component: PremiumSuccess,
});

function PremiumSuccess() {
  const { session_id } = Route.useSearch();
  const verify = useServerFn(verifyCheckoutSession);
  const resync = useServerFn(resyncStripeSubscriptionStatus);
  const { authUser } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "pending" | "error">("loading");

  useEffect(() => {
    if (!session_id) {
      setStatus("error");
      return;
    }

    if (!authUser?.id) {
      // Wait for auth hydration before trying to confirm and resync.
      setStatus("loading");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const result = await verify({ data: { sessionId: session_id } });
        if (cancelled) return;
        const synced = await resync({
          data: {
            userId: authUser.id,
            email: authUser.email ?? undefined,
          },
        });

        if (cancelled) return;
        if (result.valid || synced.active) {
          setStatus("success");
          toast.success("¡Bienvenido a MAGNETO Premium!");
        } else {
          setStatus("pending");
        }
      } catch {
        if (!cancelled) setStatus("pending");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [session_id, verify, resync, authUser?.id, authUser?.email]);

  return (
    <AppShell title="Suscripción" subtitle="Procesando tu pago…">
      <div className="neon-card rounded-3xl p-8 text-center max-w-lg mx-auto">
        {status === "loading" && (
          <>
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-fuchsia-400" />
            <p className="mt-4 text-sm text-muted-foreground">Verificando tu pago con Stripe…</p>
          </>
        )}
        {status === "success" && (
          <>
            <Check className="h-10 w-10 mx-auto text-emerald-400" />
            <h2 className="mt-4 text-xl font-semibold text-white">¡Premium activado!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ya tenés acceso completo a MAGNETO.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/onboarding" className="btn-cyber">
                Completar onboarding
              </Link>
              <button onClick={() => navigate({ to: "/" })} className="btn-ghost">
                Ir al inicio
              </button>
            </div>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="h-10 w-10 mx-auto text-destructive" />
            <h2 className="mt-4 text-xl font-semibold text-white">No se pudo confirmar el pago</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              El pago no se verificó. Si ya pagaste, contactá soporte.
            </p>
            <Link to="/premium" className="btn-cyber mt-6 inline-flex">
              Volver a Premium
            </Link>
          </>
        )}
        {status === "pending" && (
          <>
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-fuchsia-400" />
            <h2 className="mt-4 text-xl font-semibold text-white">Pago en proceso de confirmación</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tu cobro puede tardar unos minutos en reflejarse. Volvé a Premium y tocá refrescar.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/premium" className="btn-cyber inline-flex">
                Ir a Premium
              </Link>
              <button onClick={() => navigate({ to: "/premium-success", search: { session_id } })} className="btn-ghost">
                Reintentar
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
