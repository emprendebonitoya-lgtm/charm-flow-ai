import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Scan, LifeBuoy, MessagesSquare, CalendarHeart, Flame, Library } from "lucide-react";

const nav = [
  { to: "/escaner", label: "Escáner", icon: Scan },
  { to: "/sos", label: "Salvavidas", icon: LifeBuoy },
  { to: "/sim", label: "Sim", icon: MessagesSquare },
  { to: "/date", label: "Date", icon: CalendarHeart },
  { to: "/feed", label: "Feed", icon: Flame },
  { to: "/biblioteca", label: "Mindset", icon: Library },
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
      <header className="sticky top-0 z-30 px-4 pt-4 pb-3 backdrop-blur-xl bg-black/60 border-b border-[rgba(0,240,255,0.10)]">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl grad-cyber flex items-center justify-center neon-glow">
              <span className="font-display font-bold text-[#04060a]">M</span>
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
          <Link to="/historial" className="pill">Historial</Link>
        </div>
        {title && (
          <div className="mx-auto max-w-2xl mt-4">
            <h1 className="font-display text-2xl text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 py-5">{children}</main>

      {/* Minimal bottom navbar — discreto, casi invisible hasta el hover */}
      <nav
        className="fixed bottom-0 inset-x-0 z-40 pointer-events-none"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 6px)" }}
      >
        {/* Soft fade under the bar to merge with content */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-md px-4">
          <div
            className="pointer-events-auto flex items-center justify-between rounded-full px-2 py-1.5"
            style={{
              background: "rgba(10,12,18,0.55)",
              backdropFilter: "blur(18px) saturate(140%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {nav.map(({ to, label, icon: Icon }) => {
              const active = path === to || path.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  aria-label={label}
                  className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-full transition-colors"
                >
                  <Icon
                    className="h-[17px] w-[17px] transition-colors"
                    style={{
                      color: active ? "#00F0FF" : "rgba(255,255,255,0.38)",
                    }}
                    strokeWidth={1.5}
                  />
                  <span
                    className="text-[8.5px] tracking-[0.14em] uppercase transition-colors"
                    style={{
                      color: active ? "rgba(0,240,255,0.95)" : "rgba(255,255,255,0.32)",
                    }}
                  >
                    {label}
                  </span>
                  {active && (
                    <span
                      className="block h-[2px] w-[14px] rounded-full -mt-0.5"
                      style={{
                        background: "#00F0FF",
                        boxShadow: "0 0 6px rgba(0,240,255,0.7)",
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
