import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Play } from "lucide-react";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Mindset · MAGNETO" },
      { name: "description", content: "Píldoras de audio y video sobre carisma, lenguaje corporal y citas." },
    ],
  }),
  component: Biblioteca,
});

const LESSONS = [
  { t: "Psicología del lenguaje corporal", d: "8 min", g: ["#00F0FF", "#0047FF"] },
  { t: "Reglas de la primera cita",        d: "12 min", g: ["#0047FF", "#4D00FF"] },
  { t: "Frame masculino sin esfuerzo",     d: "6 min",  g: ["#00F0FF", "#4D00FF"] },
  { t: "Cómo dejar de ser nice guy",       d: "10 min", g: ["#4D00FF", "#00F0FF"] },
  { t: "Tono de voz que atrae",            d: "5 min",  g: ["#0047FF", "#00F0FF"] },
  { t: "Manejo de objeciones reales",      d: "9 min",  g: ["#00F0FF", "#4D8DFF"] },
];

function Biblioteca() {
  return (
    <AppShell title="Mindset" subtitle="Tus reps mentales antes de salir.">
      <div className="grid grid-cols-2 gap-3">
        {LESSONS.map((l, i) => (
          <button key={i} className="text-left neon-card rounded-2xl overflow-hidden group transition-all hover:-translate-y-0.5">
            <div className="relative aspect-square"
                 style={{ background: `linear-gradient(135deg, ${l.g[0]} 0%, ${l.g[1]} 100%)` }}>
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute bottom-2 right-2 h-10 w-10 rounded-full backdrop-blur-md bg-black/40 border border-white/20 flex items-center justify-center group-hover:scale-110 transition">
                <Play className="h-4 w-4 text-white" fill="white" />
              </div>
              <div className="absolute top-2 left-2 text-[9px] uppercase tracking-widest text-white/80 font-display">
                Lección {String(i + 1).padStart(2, "0")}
              </div>
            </div>
            <div className="p-3">
              <div className="font-display text-[13px] leading-tight line-clamp-2">{l.t}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{l.d}</div>
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
