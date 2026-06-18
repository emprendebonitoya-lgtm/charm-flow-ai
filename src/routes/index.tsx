import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Scan, LifeBuoy, MessagesSquare, CalendarHeart, Flame, Library,
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

function Home() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl neon-card neon-card-strong p-6 mb-6">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-60"
             style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 60%)" }} />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full blur-3xl opacity-50"
             style={{ background: "radial-gradient(circle, #1D4ED8 0%, transparent 60%)" }} />
        <div className="relative">
          <span className="pill inline-flex items-center gap-1"><Zap className="h-3 w-3" /> v1 · alpha</span>
          <h1 className="mt-4 font-display text-[28px] leading-[1.05] font-bold">
            Carisma operativo.<br />
            <span className="grad-cyber-text">Magnetismo en código.</span>
          </h1>
          <p className="text-[13px] text-[#BFDBFE]/80 mt-3 max-w-md leading-relaxed">
            Hecho para hombres tímidos que quieren conectar. Subí una foto desde Instagram, Tinder, Bumble o WhatsApp y MAGNETO te entrega las palabras exactas.
          </p>
          <Link to="/escaner" className="btn-cyber mt-5">
            Iniciar escaneo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Módulos principales */}
      <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
        Núcleo
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {primary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="relative neon-card p-4 rounded-2xl transition-all hover:-translate-y-0.5 hover:neon-glow group overflow-hidden"
          >
            <div className="h-10 w-10 rounded-xl flex items-center justify-center grad-cyber neon-glow mb-3">
              <Icon className="h-[19px] w-[19px] text-white" strokeWidth={2} />
            </div>
            <div className="font-display text-[15px] font-semibold">{label}</div>
            <div className="text-[11px] text-[#BFDBFE]/70 mt-1 leading-snug">{desc}</div>
          </Link>
        ))}
      </div>

      {/* Secundarios */}
      <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
        Extra
      </div>
      <div className="grid grid-cols-2 gap-3">
        {secondary.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="relative neon-card p-3.5 rounded-2xl transition-all hover:-translate-y-0.5 group flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-[rgba(59,130,246,0.18)] border border-[rgba(99,160,255,0.25)]">
              <Icon className="h-[17px] w-[17px] text-[#93C5FD]" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="font-display text-[13px] font-semibold leading-tight">{label}</div>
              <div className="text-[10.5px] text-[#BFDBFE]/60 mt-0.5 leading-snug line-clamp-2">{desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
