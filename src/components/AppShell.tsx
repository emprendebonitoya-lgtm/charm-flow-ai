import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Home, Scan, LifeBuoy, MessagesSquare, CalendarHeart, Flame, Library,
  GraduationCap, Quote, Sun, Bookmark, History,
} from "lucide-react";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/escaner", label: "Escáner", icon: Scan },
  { to: "/sos", label: "SOS", icon: LifeBuoy },
  { to: "/sim", label: "Sim", icon: MessagesSquare },
  { to: "/feed", label: "Feed", icon: Flame },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh pb-28 bg-background">
      <header className="sticky top-0 z-30 px-4 pt-4 pb-3 backdrop-blur-xl bg-[rgba(8,14,32,0.7)] border-b border-[rgba(99,160,255,0.15)]">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl grad-cyber flex items-center justify-center neon-glow">
              <span className="font-display font-bold text-white">M</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] tracking-[0.22em] grad-cyber-text font-bold">
                MAGNETO
              </div>
              <div className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
                Carisma · IA
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-1.5">
            <Link to="/guardados" aria-label="Guardados" className="p-2 rounded-xl hover:bg-[rgba(99,160,255,0.12)] text-[#BFDBFE]">
              <Bookmark className="h-4 w-4" />
            </Link>
            <Link to="/historial" aria-label="Historial" className="p-2 rounded-xl hover:bg-[rgba(99,160,255,0.12)] text-[#BFDBFE]">
              <History className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {title && (
          <div className="mx-auto max-w-2xl mt-4 flex items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {path !== "/" && (
              <Link to="/" className="btn-ghost !py-2 !px-3 shrink-0">
                <Home className="h-4 w-4" /> Inicio
              </Link>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">{children}</main>

      {/* Bottom navbar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 pointer-events-none"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(5,9,19,0.92) 0%, rgba(5,9,19,0.55) 55%, rgba(5,9,19,0) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-md px-4 pt-3">
          <div
            className="pointer-events-auto flex items-center justify-between rounded-full px-2 py-1.5"
            style={{
              background: "rgba(15,25,55,0.75)",
              backdropFilter: "blur(18px) saturate(140%)",
              border: "1px solid rgba(99,160,255,0.22)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            {nav.map(({ to, label, icon: Icon }) => {
              const active =
                to === "/" ? path === "/" : (path === to || path.startsWith(to + "/"));
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-full transition-colors"
                >
                  <Icon
                    className="h-[18px] w-[18px] transition-colors"
                    style={{ color: active ? "#60A5FA" : "rgba(191,219,254,0.45)" }}
                    strokeWidth={1.8}
                  />
                  <span
                    className="text-[9px] tracking-[0.14em] uppercase transition-colors"
                    style={{ color: active ? "#BFDBFE" : "rgba(191,219,254,0.4)" }}
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
