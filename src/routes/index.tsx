import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Scan, Siren, Gamepad2, Heart, GraduationCap, Quote,
  Newspaper, Library, Sun, Bookmark, History, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RIZZ.OS — Coach de citas con IA" },
      { name: "description", content: "Sube screenshots y la IA te devuelve respuestas con rizz. SOS, simulador, planificador de citas y academia, todo en una sola app." },
    ],
  }),
  component: Home,
});

const primary = [
  { to: "/escaner", label: "Escáner", desc: "Sube el chat, IA responde", icon: Scan },
  { to: "/sos", label: "SOS", desc: "Rescate en 1 segundo", icon: Siren },
  { to: "/sim", label: "Sim", desc: "Practica con un crush IA", icon: Gamepad2 },
  { to: "/date", label: "Date", desc: "Planifica tu próxima cita", icon: Heart },
  { to: "/academia", label: "Academia", desc: "Mini lecciones de rizz", icon: GraduationCap },
];

const extras = [
  { to: "/frases", label: "Frases", icon: Quote },
  { to: "/feed", label: "Feed", icon: Newspaper },
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/tudia", label: "Tu Día", icon: Sun },
  { to: "/guardados", label: "Guardados", icon: Bookmark },
  { to: "/historial", label: "Historial", icon: History },
];

function Home() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl neon-card p-5 mb-5">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative">
          <span className="pill">v1 · español</span>
          <h1 className="mt-3 font-display text-3xl leading-tight">
            Coach de citas con <span className="neon-text">rizz</span> infinito.
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-md">
            Pega o sube tu chat. Recibí 3 respuestas listas para enviar, con el tono que vos elijas.
          </p>
          <Link
            to="/escaner"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium neon-glow"
          >
            Empezar escaneo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Primary grid */}
      <div className="grid grid-cols-2 gap-3">
        {primary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="neon-card p-4 rounded-2xl transition hover:-translate-y-0.5 hover:neon-glow group"
          >
            <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            <div className="mt-3 font-display text-lg">{label}</div>
            <div className="text-xs text-muted-foreground mt-1">{desc}</div>
          </Link>
        ))}
      </div>

      {/* More sections — matches reference screenshot */}
      <section className="mt-6">
        <div className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-3">
          Más secciones
        </div>
        <div className="grid grid-cols-3 gap-3">
          {extras.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="neon-card rounded-2xl p-4 flex flex-col items-center gap-2 text-center hover:neon-glow transition"
            >
              <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
