import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMemo, useState } from "react";
import { useUser } from "@/lib/user";
import { FREE_LIMITS } from "@/lib/plans";
import { loadPremiumProgressHistory } from "@/lib/storage";

import {
  Scan,
  LifeBuoy,
  MessagesSquare,
  MessageSquare,
  CalendarHeart,
  Flame,
  Library,
  ArrowRight,
  Zap,
  GraduationCap,
  Quote,
  Sun,
  Bookmark,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Home,
});

const primary = [
  {
    to: "/escaner",
    label: "Escáner",
    desc: "Foto de su perfil → 5 aperturas de impacto.",
    icon: Scan,
  },
  {
    to: "/sos",
    label: "Salvavidas",
    desc: "Rescatá un chat enfriado en segundos.",
    icon: LifeBuoy,
  },
  {
    to: "/sim",
    label: "Simulador",
    desc: "Entrená con 4 personalidades distintas.",
    icon: MessagesSquare,
  },
  {
    to: "/date",
    label: "Date Planner",
    desc: "Citas en 3 fases: Apertura · Conexión · Cierre",
    icon: CalendarHeart,
  },
] as const;

const secondary = [
  {
    to: "/academia",
    label: "Academia",
    desc: "Lecciones cortas accionables.",
    icon: GraduationCap,
  },
  { to: "/frases", label: "Frases", desc: "Banco listo para copiar y pegar.", icon: Quote },
  { to: "/biblioteca", label: "Mindset", desc: "Píldoras de psicología y voz.", icon: Library },
  { to: "/tudia", label: "Tu Día", desc: "Una misión diaria de 5 minutos.", icon: Sun },
  { to: "/feed", label: "Feed", desc: "Casos reales de la comunidad.", icon: Flame },
  { to: "/guardados", label: "Guardados", desc: "Tus mejores líneas rescatables.", icon: Bookmark },
] as const;

function parseDate(value: string) {
  return new Date(value + "T00:00:00");
}

function computePremiumStreak(history: { date: string }[]) {
  if (!history.length) return 0;
  const sorted = [...history].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime(),
  );
  let streak = 1;
  let previous = parseDate(sorted[0].date);

  for (let i = 1; i < sorted.length; i += 1) {
    const current = parseDate(sorted[i].date);
    const diff = Math.round((previous.getTime() - current.getTime()) / 86400000);
    if (diff === 1) {
      streak += 1;
      previous = current;
    } else {
      break;
    }
  }

  return streak;
}

const heroMedia = {
  poster:
    "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.25), transparent 35%), linear-gradient(135deg, #0c1224 0%, #1a0a2e 50%, #0f172a 100%)",
};

function Home() {
  const { state, skipOnboarding } = useUser();
  const [videoFailed, setVideoFailed] = useState(false);
  const premiumHistory = useMemo(
    () => (state.isPremium ? loadPremiumProgressHistory() : []),
    [state.isPremium],
  );
  const premiumStreak = useMemo(() => computePremiumStreak(premiumHistory), [premiumHistory]);

  return (
    <AppShell>
      <section className="py-8 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl grad-cyber flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Control</h1>
                <p className="text-sm text-slate-400 font-body">Bienvenido, Magneto.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-full">
               <div className="px-3 py-1 text-xs font-medium text-white/70">Plan Free</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="feature-card p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
                <Flame className="h-3 w-3" /> Racha Actual
              </div>
              <div className="text-3xl font-bold text-white">{premiumStreak} días</div>
            </div>
            <div className="feature-card p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Zap className="h-3 w-3" /> Energía
              </div>
              <div className="text-3xl font-bold text-white">Suficiente</div>
            </div>
            <div className="feature-card p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" /> Estado
              </div>
              <div className="text-3xl font-bold text-white">Activo</div>
            </div>
          </div>
        </div>

        {state.isPremium && (
          <section className="mb-12 p-6 rounded-[2rem] bg-gradient-to-br from-fuchsia-500/20 via-transparent to-violet-500/20 border border-fuchsia-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Zap className="h-24 w-24 text-fuchsia-400" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-2">
                  <Sparkles className="h-3 w-3" /> Premium Activo
                </div>
                <h2 className="text-3xl font-bold text-white mb-4 italic">Estás en el modo Élite</h2>
                <p className="text-slate-300 font-body leading-relaxed mb-6">
                  Tienes acceso total a todas las herramientas de carisma operativo. Tu progreso se guarda automáticamente.
                </p>
              </div>
              <div className="w-full md:w-auto p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col items-center gap-3">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">
                  Siguiente logro
                </div>
                <div className="mt-3 text-3xl font-semibold text-white">
                  {premiumStreak >= 7 ? "Constancia" : "Sigue así"}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mb-3">
          <div className="section-heading">Núcleo</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {primary.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="feature-card group overflow-hidden block w-full p-6 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30 hover:shadow-[0_28px_60px_-28px_rgba(168,85,247,0.35)] active:scale-[0.99] active:shadow-[0_20px_48px_-24px_rgba(168,85,247,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/45"
            >
              <div className="flex items-center justify-between gap-3 mb-4 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-12 w-12 rounded-3xl grad-cyber flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-sm font-semibold text-white truncate group-hover:text-fuchsia-100">
                      {label}
                    </div>
                    <div className="text-sm sm:text-xs text-slate-300 break-words">{desc}</div>
                  </div>
                </div>
              </div>
              <div className="text-sm sm:text-xs text-[#cbd5e1]/80 break-words">
                Accedé a las funciones clave para generar mensajes listos para enviar.
              </div>
            </Link>
          ))}
        </div>

        <div className="mb-3">
          <div className="section-heading">Extra</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondary.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="feature-card group overflow-hidden flex items-start gap-4 min-w-0 w-full p-5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/25 hover:shadow-[0_24px_54px_-30px_rgba(168,85,247,0.28)] active:scale-[0.99] active:shadow-[0_18px_44px_-24px_rgba(168,85,247,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/45"
            >
              <div className="h-12 w-12 rounded-3xl flex items-center justify-center bg-white/10 border border-white/10 text-fuchsia-200 shrink-0 transition-all duration-300 group-hover:bg-white/15 group-hover:text-fuchsia-100">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-sm font-semibold text-white truncate group-hover:text-fuchsia-100">
                  {label}
                </div>
                <div className="text-sm sm:text-xs text-slate-300 mt-1 leading-snug break-words">
                  {desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
