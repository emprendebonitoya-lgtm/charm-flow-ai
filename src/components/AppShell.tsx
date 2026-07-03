import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useUser } from "@/lib/user";
import { loadPremiumProgressHistory } from "@/lib/storage";
import { Logo } from "@/components/Logo";
import {
  Home, Scan, LifeBuoy, MessagesSquare, MessageSquare, CalendarHeart, Library,
  GraduationCap, Quote, Sun, Bookmark, History,
} from "lucide-react";
import { toast } from "sonner";

const nav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/escaner", label: "Escáner", icon: Scan },
  { to: "/sos", label: "SOS", icon: LifeBuoy },
  { to: "/sim", label: "Sim", icon: MessagesSquare },
  { to: "/date", label: "Citas", icon: CalendarHeart },
  { to: "/ayuda", label: "Asistente", icon: MessageSquare },
] as const;

function computePremiumStreak(history: { date: string }[]) {
  if (!history.length) return 0;
  const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let streak = 1;
  let previous = new Date(`${sorted[0].date}T00:00:00`);

  for (let i = 1; i < sorted.length; i += 1) {
    const current = new Date(`${sorted[i].date}T00:00:00`);
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

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { state } = useUser();
  const { authUser, signOut } = useUser();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [premiumStats, setPremiumStats] = useState({ streak: 0, days: 0 });
  const planLabel = state.isPremium ? "Premium activo" : "Acceso Gratis";
  const planSubLabel = state.isPremium ? (state.plan === "annual" ? "Anual" : "Mensual") : null;

  useEffect(() => {
    if (!state.isPremium) {
      setPremiumStats({ streak: 0, days: 0 });
      return;
    }
    const history = loadPremiumProgressHistory();
    setPremiumStats({ streak: computePremiumStreak(history), days: history.length });
  }, [state.isPremium]);

  return (
    <div className="relative min-h-dvh pb-28 bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_30%)]" />
      <header className="sticky top-0 z-30 px-4 pt-4 pb-4 backdrop-blur-3xl bg-[rgba(6,10,24,0.74)] border-b border-white/10 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.7)]">
        <div className="mx-auto max-w-2xl flex flex-wrap items-center justify-between gap-3">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-16 w-16 rounded-[1.5rem] overflow-hidden flex items-center justify-center neon-glow shadow-lg shadow-[rgba(168,85,247,0.16)]">
              <Logo className="h-full w-full" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base tracking-[0.26em] grad-cyber-text font-bold">
                MAGNETO
              </div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#cbd5e1]/80">
                Carisma premium · IA moderna
              </div>
            </div>
          </Link>
          <div className="w-full sm:w-auto rounded-3xl border border-white/10 bg-white/5 px-3 py-2 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.7)]">
            <div className="flex flex-col gap-2 sm:gap-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex flex-col gap-1 rounded-full bg-purple-500/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-fuchsia-100 shrink-0">
                  <span>{planLabel}</span>
                  {state.isPremium && (
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#E0E7FF]/70">
                      Racha {premiumStats.streak} · {premiumStats.days} días
                    </span>
                  )}
                </div>
                {planSubLabel && (
                  <div className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#E0E7FF]/85 shrink-0">
                    {planSubLabel}
                  </div>
                )}
                {!state.isPremium && (
                  <Link to="/premium" className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/15 shrink-0">
                    Suscribite
                  </Link>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/landing"
                  className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/15 shrink-0"
                >
                  Salir
                </Link>
                {authUser ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await signOut();
                      toast.info("Sesión cerrada.");
                      navigate({ to: "/login" });
                    }}
                    className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/15 shrink-0"
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white transition hover:bg-white/15 shrink-0"
                  >
                    Entrar
                  </Link>
                )}
                <Link to="/guardados" aria-label="Guardados" className="p-2 rounded-full hover:bg-white/10 text-[#f8fafc] shrink-0">
                  <Bookmark className="h-4 w-4" />
                </Link>
                <Link to="/historial" aria-label="Historial" className="p-2 rounded-full hover:bg-white/10 text-[#f8fafc] shrink-0">
                  <History className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {title && (
          <div className="mx-auto max-w-2xl mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground tracking-tight">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">{subtitle}</p>
              )}
            </div>
            {path !== "/dashboard" && (
              <Link to="/dashboard" className="btn-ghost !py-2 !px-4 shrink-0">
                <Home className="h-4 w-4" /> Inicio
              </Link>
            )}
          </div>
        )}
      </header>

      <Link
        to="/ayuda"
        className="pointer-events-auto fixed bottom-[calc(max(env(safe-area-inset-bottom),10px)+92px)] left-4 z-50 inline-flex items-center gap-3 rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_80px_-38px_rgba(124,58,237,0.7)] transition duration-300 hover:bg-violet-400 active:scale-[0.99]"
      >
        <MessageSquare className="h-4 w-4" />
        <div className="leading-tight text-left">
          <div>Asistente</div>
          <div className="text-[11px] text-violet-100/80">Chat rápido</div>
        </div>
      </Link>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6">{children}</main>

      {/* Bottom navbar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 pointer-events-none"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 10px)" }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(2, 6, 17, 0.95) 0%, rgba(2, 6, 17, 0.55) 55%, rgba(2, 6, 17, 0) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-lg px-4 pt-3">
          <div
            className="pointer-events-auto flex items-center justify-between rounded-full px-2 py-2"
            style={{
              background: "rgba(10, 16, 36, 0.92)",
              backdropFilter: "blur(20px) saturate(140%)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            }}
          >
            {nav.map(({ to, label, icon: Icon }) => {
              const active =
                to === "/dashboard" ? path === "/dashboard" : (path === to || path.startsWith(to + "/"));
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-full transition-colors"
                >
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center transition ${
                      active ? "bg-gradient-to-br from-fuchsia-500/20 via-purple-500/15 to-violet-500/15 shadow-[0_0_0_1px_rgba(168,85,247,0.18)]" : "bg-white/5"
                    }`}
                  >
                    <Icon
                      className="h-[18px] w-[18px] transition-colors"
                      style={{ color: active ? "#D946EF" : "rgba(191,219,254,0.55)" }}
                      strokeWidth={1.8}
                    />
                  </div>
                  <span
                    className="text-[9px] tracking-[0.14em] uppercase transition-colors"
                    style={{ color: active ? "#BFDBFE" : "rgba(191,219,254,0.5)" }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}

// Re-export icons for convenience in other modules
export const SectionIcons = {
  Library, GraduationCap, Quote, Sun, CalendarHeart, Bookmark,
};
