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

      {/* Floating bottom navbar */}
      <nav className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none">
        <div className="mx-auto max-w-md neon-card rounded-3xl px-1.5 py-1.5 flex items-center justify-between pointer-events-auto">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = path === to || (to !== "/" && path.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-all ${
                  active ? "scale-105" : ""
                }`}
                style={
                  active
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(0,240,255,0.18), rgba(77,0,255,0.18))",
                        boxShadow: "0 0 18px rgba(0,240,255,0.45)",
                      }
                    : undefined
                }
              >
                <Icon
                  className="h-[18px] w-[18px]"
                  style={{ color: active ? "#00F0FF" : "rgba(255,255,255,0.55)" }}
                  strokeWidth={1.6}
                />
                <span
                  className="text-[9px] tracking-wider uppercase"
                  style={{ color: active ? "#00F0FF" : "rgba(255,255,255,0.55)" }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
