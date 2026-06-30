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

const HERO_VIDEO_SRC = "/hero-bg.mp4";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "MAGNETO — Carisma y seducción con IA" },
      {
        name: "description",
        content:
          "Software de carisma para hombres tímidos. Subí una foto y la IA te entrega aperturas, rescates, planes de cita y lecciones.",
      },
    ],
  }),
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
  const sorted = [...history].sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
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
  const premiumHistory = useMemo(() => (state.isPremium ? loadPremiumProgressHistory() : []), [state.isPremium]);
  const premiumStreak = useMemo(() => computePremiumStreak(premiumHistory), [premiumHistory]);

  return (
    <AppShell>
      <section
        className="relative mb-8 min-h-[20rem] overflow-hidden rounded-[2rem] glass-panel p-5 shadow-[0_30px_90px_-50px_rgba(34,211,238,0.26)] aspect-[4/3] sm:aspect-[16/9] sm:min-h-[28rem] sm:p-8 lg:aspect-[21/9]"
        style={{ backgroundImage: heroMedia.poster }}
      >
        {!videoFailed ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 z-0 h-full w-full object-cover object-center"
            onError={() => setVideoFailed(true)}
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 z-0 h-full w-full"
            style={{
              background: "linear-gradient(135deg, #0c1224 0%, #1a0a2e 50%, #0f172a 100%)",
            }}
          />
        )}
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(4,6,15,0.6)] via-[rgba(8,12,30,0.45)] to-[rgba(15,23,42,0.7)]" />
        <div className="absolute inset-0 z-[5] opacity-30">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 animate-pulse rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 animate-pulse rounded-full bg-violet-500/20 blur-3xl [animation-delay:1s]" />
        </div>
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_22%)]" />
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-fuchsia-500/12 via-violet-500/12 to-transparent opacity-10" />
        <div className="absolute -right-16 -top-16 z-20 h-56 w-56 rounded-full bg-fuchsia-500/18 opacity-55 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 z-20 h-56 w-56 rounded-full bg-violet-500/18 opacity-55 blur-3xl" />
        <div className="relative z-30 max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
            <span className="pill inline-flex items-center gap-2 border-white/10 bg-white/10 text-white/80">
              <Zap className="h-3.5 w-3.5" />
              MAGNETO v1
            </span>
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">Premium AI para carisma</span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Carisma operativo para el hombre moderno.
            <span className="mt-2 block bg-gradient-to-r from-fuchsia-300 via-purple-300 to-violet-300 bg-clip-text text-transparent sm:mt-3">
              Magnetismo en código.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            Diseñado para hombres que exigen resultados: subí su perfil, rescata un chat o planifica una cita con una experiencia de IA elegante y efectiva.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/escaner" className="btn-cyber inline-flex items-center gap-2 px-5 py-3 text-sm sm:px-6 sm:text-base">
                Iniciar escaneo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/ayuda"
                className="btn-ghost inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-sm text-white/90 hover:bg-white/5 sm:px-6 sm:text-base"
              >
                <MessageSquare className="h-4 w-4" /> Asistente
              </Link>
            </div>
            <span className="max-w-md text-xs text-[#cbd5e1]/80 sm:text-sm">
              Explora los módulos de carisma en tiempo real y convoca respuestas rápidas con estilo.
            </span>
          </div>
          <div className="mt-4 grid gap-2 sm:mt-6 sm:grid-cols-3 sm:gap-3">
            <span className="chip chip-active text-xs sm:text-[11px]">Aperturas instantáneas</span>
            <span className="chip text-xs sm:text-[11px]">Rescates en segundos</span>
            <span className="chip text-xs sm:text-[11px]">Plan diario claro</span>
          </div>
        </div>
      </section>

      {!state.onboarded && (
        <section className="mb-6 rounded-[2rem] border border-fuchsia-400/20 glass-panel p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">
              MAGNETO funciona sin cuenta. Opcionalmente podés personalizar tu experiencia con el onboarding.
            </p>
            <div className="shrink-0 flex flex-wrap gap-2">
              <Link to="/onboarding" className="btn-cyber !px-4 !py-2 text-sm">
                Personalizar
              </Link>
              <button onClick={skipOnboarding} className="btn-ghost !px-4 !py-2 text-sm">
                Explorar gratis
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="mb-6 rounded-[2rem] border border-white/10 glass-panel p-6 shadow-[0_24px_90px_-50px_rgba(168,85,247,0.22)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">Plan Gratis</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Probá MAGNETO sin pagar.</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Escáner ({FREE_LIMITS.scannerDaily}/día), SOS, Sim, Asistente, Date Planner, Frases y Feed incluidos.
              Academia ({FREE_LIMITS.academiaModules} módulos) y Biblioteca ({FREE_LIMITS.bibliotecaPills} píldoras) con preview.
              Anuncios discretos en plan gratis.
            </p>
          </div>
          <Link to="/login" className="btn-ghost shrink-0">
            Crear cuenta
          </Link>
        </div>
      </section>

      <section className="mb-6 rounded-[2rem] border border-white/10 glass-panel p-6 shadow-[0_24px_90px_-50px_rgba(168,85,247,0.22)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">MAGNETO Premium</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Sin anuncios · todo desbloqueado.</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Academia completa, Biblioteca VIP, escaneos ilimitados y progreso premium.</p>
          </div>
          <Link to="/premium" className="btn-cyber shrink-0">
            Ver comparación
          </Link>
        </div>
      </section>

      {state.isPremium && (
        <section className="mb-6 rounded-[2rem] border border-white/10 glass-panel p-6 shadow-[0_24px_90px_-50px_rgba(168,85,247,0.22)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">Progreso Premium</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Tu racha y avances diarios</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">Un resumen rápido de tu constancia premium y el historial de días completos.</p>
            </div>
            <Link to="/premium-progreso" className="btn-ghost shrink-0">
              Ver detalles
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Racha actual</div>
              <div className="mt-3 text-3xl font-semibold text-white">{premiumStreak} días</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Días registrados</div>
              <div className="mt-3 text-3xl font-semibold text-white">{premiumHistory.length}</div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Siguiente logro</div>
              <div className="mt-3 text-3xl font-semibold text-white">{premiumStreak >= 7 ? "Constancia" : "Sigue así"}</div>
            </div>
          </div>
        </section>
      )}

      <div className="mb-3">
        <div className="section-heading">Núcleo</div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {primary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="feature-card group block w-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30 hover:shadow-[0_28px_60px_-28px_rgba(168,85,247,0.35)] sm:p-5"
          >
            <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="h-12 w-12 flex-shrink-0 rounded-3xl grad-cyber flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20 transition-all duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold text-white group-hover:text-fuchsia-100 sm:text-sm">{label}</div>
                  <div className="break-words text-sm text-slate-300 sm:text-xs">{desc}</div>
                </div>
              </div>
            </div>
            <div className="break-words text-sm text-[#cbd5e1]/80 sm:text-xs">Accedé a las funciones clave para generar mensajes listos para enviar.</div>
          </Link>
        ))}
      </div>

      <div className="mb-3">
        <div className="section-heading">Extra</div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {secondary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="feature-card group flex min-w-0 w-full items-start gap-4 overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/25 hover:shadow-[0_24px_54px_-30px_rgba(168,85,247,0.28)] sm:p-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-3xl border border-white/10 bg-white/10 flex items-center justify-center text-fuchsia-200 transition-all duration-300 group-hover:bg-white/15 group-hover:text-fuchsia-100">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white group-hover:text-fuchsia-100 sm:text-sm">{label}</div>
              <div className="mt-1 break-words text-sm leading-snug text-slate-300 sm:text-xs">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
