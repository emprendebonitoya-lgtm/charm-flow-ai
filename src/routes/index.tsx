import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useMemo } from "react";
import { useUser } from "@/lib/user";
import { FREE_LIMITS } from "@/lib/plans";
import { loadPremiumProgressHistory } from "@/lib/storage";
import heroVideo from "@/assets/hero-bg.mp4.asset.json";

import {
  Scan, LifeBuoy, MessagesSquare, MessageSquare, CalendarHeart, Flame, Library,
  ArrowRight, Zap, GraduationCap, Quote, Sun, Bookmark,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAGNETO — Carisma y seducción con IA" },
      { name: "description", content: "Software de carisma para hombres tímidos. Subí una foto y la IA te entrega aperturas, rescates, planes de cita y lecciones." },
    ],
  }),
  component: Home,
});

const primary = [
  { to: "/escaner",    label: "Escáner",      desc: "Foto de su perfil → 5 aperturas de impacto.",  icon: Scan },
  { to: "/sos",        label: "Salvavidas",   desc: "Rescatá un chat enfriado en segundos.",        icon: LifeBuoy },
  { to: "/sim",        label: "Simulador",    desc: "Entrená con 4 personalidades distintas.",      icon: MessagesSquare },
  { to: "/date",       label: "Date Planner", desc: "Citas en 3 fases: Apertura · Conexión · Cierre", icon: CalendarHeart },
] as const;

const secondary = [
  { to: "/academia",   label: "Academia",  desc: "Lecciones cortas accionables.",   icon: GraduationCap },
  { to: "/frases",     label: "Frases",    desc: "Banco listo para copiar y pegar.", icon: Quote },
  { to: "/biblioteca", label: "Mindset",   desc: "Píldoras de psicología y voz.",    icon: Library },
  { to: "/tudia",      label: "Tu Día",    desc: "Una misión diaria de 5 minutos.",  icon: Sun },
  { to: "/feed",       label: "Feed",      desc: "Casos reales de la comunidad.",    icon: Flame },
  { to: "/guardados",  label: "Guardados", desc: "Tus mejores líneas rescatables.",  icon: Bookmark },
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
  poster: "radial-gradient(circle at 20% 30%, rgba(168,85,247,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.25), transparent 35%), linear-gradient(135deg, #0c1224 0%, #1a0a2e 50%, #0f172a 100%)",
};

function Home() {
  const { state, skipOnboarding } = useUser();
  const premiumHistory = useMemo(() => (state.isPremium ? loadPremiumProgressHistory() : []), [state.isPremium]);
  const premiumStreak = useMemo(() => computePremiumStreak(premiumHistory), [premiumHistory]);

  return (
    <AppShell>
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-[2rem] glass-panel p-5 sm:p-8 mb-8 shadow-[0_30px_90px_-50px_rgba(34,211,238,0.26)] min-h-[22rem] sm:min-h-[32rem]"
        style={{ backgroundImage: heroMedia.poster }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        >
          <source src={heroVideo.url} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-[1] bg-gradient-to-br from-[rgba(4,6,15,0.6)] via-[rgba(8,12,30,0.45)] to-[rgba(15,23,42,0.7)]" />
        <div className="absolute inset-0 z-[5] opacity-30">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl animate-pulse [animation-delay:1s]" />
        </div>
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_22%)]" />
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-fuchsia-500/12 via-violet-500/12 to-transparent pointer-events-none z-20" />
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-55 bg-fuchsia-500/18 z-20" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full blur-3xl opacity-55 bg-violet-500/18 z-20" />
        <div className="relative z-30 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            <span className="pill inline-flex items-center gap-2 bg-white/10 border-white/10 text-white/80"> 
              <Zap className="h-3.5 w-3.5" />
              MAGNETO v1
            </span>
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">Premium AI para carisma</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            Carisma operativo para el hombre moderno.
            <span className="block mt-2 sm:mt-3 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-300 to-violet-300">
              Magnetismo en código.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-slate-300">
            Diseñado para hombres que exigen resultados: subí su perfil, rescata un chat o planifica una cita con una experiencia de IA elegante y efectiva.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/escaner" className="btn-cyber inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-sm sm:text-base">
                Iniciar escaneo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/ayuda" className="btn-ghost inline-flex items-center gap-2 px-5 sm:px-6 py-3 text-white/90 border border-white/10 hover:bg-white/5 text-sm sm:text-base">
                <MessageSquare className="h-4 w-4" /> Asistente
              </Link>
            </div>
            <span className="text-xs sm:text-sm text-[#cbd5e1]/80 max-w-md">
              Explora los módulos de carisma en tiempo real y convoca respuestas rápidas con estilo.
            </span>
          </div>
          <div className="mt-4 sm:mt-6 grid gap-2 sm:gap-3 sm:grid-cols-3">
            <span className="chip chip-active text-xs sm:text-[11px]">Aperturas instantáneas</span>
            <span className="chip text-xs sm:text-[11px]">Rescates en segundos</span>
            <span className="chip text-xs sm:text-[11px]">Plan diario claro</span>
          </div>
        </div>
      </section>

      {!state.onboarded && (
        <section className="mb-6 rounded-[2rem] glass-panel border border-fuchsia-400/20 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-300">
              MAGNETO funciona sin cuenta. Opcionalmente podés personalizar tu experiencia con el onboarding.
            </p>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link to="/onboarding" className="btn-cyber !py-2 !px-4 text-sm">Personalizar</Link>
              <button onClick={skipOnboarding} className="btn-ghost !py-2 !px-4 text-sm">Explorar gratis</button>
            </div>
          </div>
        </section>
      )}

      <section className="mb-6 rounded-[2rem] glass-panel border border-white/10 p-6 shadow-[0_24px_90px_-50px_rgba(168,85,247,0.22)]">
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
          <Link to="/login" className="btn-ghost shrink-0">Crear cuenta</Link>
        </div>
      </section>

      <section className="mb-6 rounded-[2rem] glass-panel border border-white/10 p-6 shadow-[0_24px_90px_-50px_rgba(168,85,247,0.22)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">MAGNETO Premium</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">Sin anuncios · todo desbloqueado.</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">Academia completa, Biblioteca VIP, escaneos ilimitados y progreso premium.</p>
          </div>
          <Link to="/premium" className="btn-cyber shrink-0">Ver comparación</Link>
        </div>
      </section>

      {state.isPremium && (
        <section className="mb-6 rounded-[2rem] glass-panel border border-white/10 p-6 shadow-[0_24px_90px_-50px_rgba(168,85,247,0.22)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.32em] text-[#cbd5e1]/70">Progreso Premium</div>
              <h2 className="mt-2 text-2xl font-semibold text-white">Tu racha y avances diarios</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">Un resumen rápido de tu constancia premium y el historial de días completos.</p>
            </div>
            <Link to="/premium-progreso" className="btn-ghost shrink-0">Ver detalles</Link>
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

      {/* Módulos principales */}
      <div className="mb-3">
        <div className="section-heading">Núcleo</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {primary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="feature-card group overflow-hidden block w-full p-6 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/30 hover:shadow-[0_28px_60px_-28px_rgba(168,85,247,0.35)]"
          >
            <div className="flex items-center justify-between gap-3 mb-4 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 rounded-3xl grad-cyber flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20 flex-shrink-0 transition-all duration-300 group-hover:scale-105">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-sm font-semibold text-white truncate group-hover:text-fuchsia-100">{label}</div>
                  <div className="text-sm sm:text-xs text-slate-300 break-words">{desc}</div>
                </div>
              </div>
            </div>
            <div className="text-sm sm:text-xs text-[#cbd5e1]/80 break-words">Accedé a las funciones clave para generar mensajes listos para enviar.</div>
          </Link>
        ))}
      </div>

      {/* Secundarios */}
      <div className="mb-3">
        <div className="section-heading">Extra</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secondary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="feature-card group overflow-hidden flex items-start gap-4 min-w-0 w-full p-5 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-300/25 hover:shadow-[0_24px_54px_-30px_rgba(168,85,247,0.28)]"
          >
            <div className="h-12 w-12 rounded-3xl flex items-center justify-center bg-white/10 border border-white/10 text-fuchsia-200 shrink-0 transition-all duration-300 group-hover:bg-white/15 group-hover:text-fuchsia-100">
              <Icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-sm font-semibold text-white truncate group-hover:text-fuchsia-100">{label}</div>
              <div className="text-sm sm:text-xs text-slate-300 mt-1 leading-snug break-words">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
