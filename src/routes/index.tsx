import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Scan, LifeBuoy, MessagesSquare, CalendarHeart, Flame, Library, ArrowRight, Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MAGNETO — Carisma y seducción con IA" },
      { name: "description", content: "Software de carisma para hombres. Subí una foto o chat y la IA te entrega aperturas, rescates y planes de cita con alto impacto." },
    ],
  }),
  component: Home,
});

const modules = [
  { to: "/escaner",    label: "Escáner",    desc: "Analiza foto o perfil. 3 aperturas de alto impacto.",   icon: Scan },
  { to: "/sos",        label: "Salvavidas", desc: "Rescata un chat enfriado en segundos.",                 icon: LifeBuoy },
  { to: "/sim",        label: "Simulador",  desc: "Entrená con 4 tipos de personalidad.",                  icon: MessagesSquare },
  { to: "/date",       label: "Date Planner", desc: "Citas en 3 fases: Apertura, Conexión, Cierre.",       icon: CalendarHeart },
  { to: "/feed",       label: "Feed",       desc: "Casos reales de la comunidad.",                         icon: Flame },
  { to: "/biblioteca", label: "Mindset",    desc: "Píldoras de psicología y lenguaje corporal.",           icon: Library },
] as const;

function Home() {
  return (
    <AppShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl neon-card p-6 mb-6">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl opacity-50"
             style={{ background: "radial-gradient(circle, #00F0FF 0%, transparent 60%)" }} />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full blur-3xl opacity-40"
             style={{ background: "radial-gradient(circle, #4D00FF 0%, transparent 60%)" }} />
        <div className="relative">
          <span className="pill inline-flex items-center gap-1"><Zap className="h-3 w-3" /> v1 · alpha</span>
          <h1 className="mt-4 font-display text-[28px] leading-[1.05] font-bold">
            Carisma operativo.<br />
            <span className="grad-cyber-text">Magnetismo en código.</span>
          </h1>
          <p className="text-[13px] text-muted-foreground mt-3 max-w-md leading-relaxed">
            Hecho para hombres tímidos que quieren conectar. Subí una foto de la chica desde cualquier red y MAGNETO te entrega las palabras exactas.
          </p>
          <Link to="/escaner" className="btn-cyber mt-5">
            Iniciar escaneo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Modules grid */}
      <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase mb-3">
        Módulos
      </div>
      <div className="grid grid-cols-2 gap-3">
        {modules.map(({ to, label, desc, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="relative neon-card p-4 rounded-2xl transition-all hover:-translate-y-0.5 group overflow-hidden"
          >
            <div className="h-9 w-9 rounded-xl flex items-center justify-center grad-cyber neon-glow mb-3">
              <Icon className="h-[18px] w-[18px] text-[#04060a]" strokeWidth={2} />
            </div>
            <div className="font-display text-[15px] font-semibold">{label}</div>
            <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{desc}</div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
