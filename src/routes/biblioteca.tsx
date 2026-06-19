import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Play, Clock, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca Mental · MAGNETO" },
      { name: "description", content: "Píldoras de conocimiento que cambian el juego." },
    ],
  }),
  component: Biblioteca,
});

type Cat = "Todo" | "Mentalidad" | "Cuerpo" | "Citas" | "Conversación" | "Online";
const CATS: Cat[] = ["Todo", "Mentalidad", "Cuerpo", "Citas", "Conversación", "Online"];

type Pill = { t: string; s: string; cat: Exclude<Cat, "Todo">; min: number; reads: string; g: [string, string] };

const PILLS: Pill[] = [
  { t: "Psicología del Lenguaje Corporal", s: "Domina el 93% no verbal", cat: "Cuerpo", min: 12, reads: "4.2K", g: ["#22D3EE", "#3B82F6"] },
  { t: "Reglas de la Primera Cita", s: "Sin errores que te cuesten el segundo encuentro", cat: "Citas", min: 18, reads: "6.8K", g: ["#6366F1", "#8B5CF6"] },
  { t: "Frame Control Avanzado", s: "Quien controla el marco, controla la interacción", cat: "Mentalidad", min: 22, reads: "3.1K", g: ["#22D3EE", "#1D4ED8"] },
  { t: "Cómo Escribir Textos que Enganchan", s: "El arte de la curiosidad en chat", cat: "Conversación", min: 14, reads: "5.4K", g: ["#3B82F6", "#8B5CF6"] },
  { t: "Tono de Voz que Atrae", s: "Grave, lento, pausado. Y por qué funciona", cat: "Cuerpo", min: 9, reads: "2.7K", g: ["#22D3EE", "#6366F1"] },
  { t: "Abundancia Mental", s: "Cómo dejar de necesitar para empezar a elegir", cat: "Mentalidad", min: 16, reads: "8.1K", g: ["#8B5CF6", "#3B82F6"] },
  { t: "Anatomía de un Perfil Killer", s: "Lo que tus 6 fotos deben transmitir", cat: "Online", min: 11, reads: "9.6K", g: ["#3B82F6", "#22D3EE"] },
  { t: "El Silencio Estratégico", s: "Cuando callarte vale más que cualquier frase", cat: "Conversación", min: 7, reads: "1.9K", g: ["#1D4ED8", "#22D3EE"] },
  { t: "Tensión Sexual sin Vulgaridad", s: "Subir la temperatura con elegancia", cat: "Citas", min: 19, reads: "7.3K", g: ["#8B5CF6", "#22D3EE"] },
  { t: "Manejo del Rechazo", s: "Convertir un 'no' en información, no en herida", cat: "Mentalidad", min: 13, reads: "5.0K", g: ["#6366F1", "#22D3EE"] },
  { t: "Mirroring: el Espejo Invisible", s: "La técnica que genera rapport en segundos", cat: "Cuerpo", min: 8, reads: "3.4K", g: ["#3B82F6", "#6366F1"] },
  { t: "De Match a Número en 4 Mensajes", s: "Plantilla con bifurcaciones", cat: "Online", min: 10, reads: "11K", g: ["#22D3EE", "#8B5CF6"] },
];

function Biblioteca() {
  const [cat, setCat] = useState<Cat>("Todo");
  const list = cat === "Todo" ? PILLS : PILLS.filter((p) => p.cat === cat);

  return (
    <AppShell>
      <div className="text-center mb-5">
        <div className="text-[10px] tracking-[0.35em] text-muted-foreground uppercase">Módulo 06</div>
        <h1 className="font-display text-[34px] font-bold mt-1 grad-cyber-text">Biblioteca Mental</h1>
        <p className="text-[13px] text-[#BFDBFE]/70 mt-1">Píldoras de conocimiento que cambian el juego.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={`chip whitespace-nowrap ${cat === c ? "chip-active" : ""}`}>{c}</button>
        ))}
      </div>

      <div className="space-y-3 mt-2">
        {list.map((p, i) => (
          <button key={i}
            className="w-full text-left rounded-2xl overflow-hidden relative group transition-all hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(120deg, ${p.g[0]} 0%, ${p.g[1]} 100%)`,
              boxShadow: `0 18px 40px -18px ${p.g[1]}aa, 0 0 30px -10px ${p.g[0]}55`,
            }}>
            <div className="absolute inset-0 grid-bg opacity-25" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(4,6,15,0.35) 100%)" }} />
            <div className="relative flex items-center gap-4 p-4">
              <div className="h-14 w-14 rounded-full backdrop-blur-md bg-white/15 border border-white/30 flex items-center justify-center group-hover:scale-110 transition shrink-0">
                <Play className="h-5 w-5 text-white" fill="white" />
              </div>
              <div className="flex-1 min-w-0 pr-14">
                <div className="font-display text-[15px] font-bold text-white leading-tight">{p.t}</div>
                <div className="text-[11.5px] text-white/85 mt-1">{p.s}</div>
                <div className="flex items-center gap-3 mt-2 text-[10.5px] text-white/70">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.min} min lectura</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.reads} lecturas</span>
                </div>
              </div>
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/40 backdrop-blur border border-white/15 text-white">
                {p.cat}
              </span>
            </div>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
