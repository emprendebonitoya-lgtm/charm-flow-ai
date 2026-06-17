import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  Scan,
  Siren,
  Gamepad2,
  Heart,
  GraduationCap,
  Home,
} from "lucide-react";

const nav = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/escaner", label: "Escáner", icon: Scan },
  { to: "/sos", label: "SOS", icon: Siren },
  { to: "/sim", label: "Sim", icon: Gamepad2 },
  { to: "/date", label: "Date", icon: Heart },
  { to: "/academia", label: "Academia", icon: GraduationCap },
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
    <div className="min-h-dvh pb-28">
      <header className="sticky top-0 z-30 px-4 pt-4 pb-3 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl neon-card neon-glow flex items-center justify-center">
              <span className="text-primary font-display font-bold">R</span>
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm tracking-widest neon-text">RIZZ.OS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Coach IA
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

      <nav className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-background via-background/95 to-background/0">
        <div className="mx-auto max-w-2xl neon-card rounded-2xl px-1 py-1.5 flex items-center justify-between">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? path === "/" : path.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition ${
                  active ? "bg-primary/10 neon-glow" : "hover:bg-primary/5"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={1.5}
                />
                <span
                  className={`text-[10px] tracking-wide ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
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
