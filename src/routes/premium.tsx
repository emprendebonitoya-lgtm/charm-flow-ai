import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useUser } from "@/lib/user";
import { ArrowRight, Check, Shield, Sparkles } from "lucide-react";

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
  const { state, subscribe } = useUser();
  const activeLabel = state.plan === "annual" ? "Anual" : "Mensual";

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
                  <div className="text-3xl font-semibold">$19</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Acceso completo a Academia, Biblioteca y onboarding VIP. Ideal si querés escalar rápido y desbloquear el plan completo.</p>
              <button onClick={() => subscribe("monthly")} className="btn-cyber mt-6 w-full">Suscribirme mensual</button>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Sparkles className="h-5 w-5 text-fuchsia-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.3em] text-[#D8B4FE]/60">Plan anual</div>
                  <div className="text-3xl font-semibold">$149</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/75 leading-relaxed">Todo el contenido desbloqueado con un ahorro real. Incluye onboarding guiado y acceso a las mejoras futuras de MAGNETO.</p>
              <button onClick={() => subscribe("annual")} className="btn-cyber mt-6 w-full">Suscribirme anual</button>
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
