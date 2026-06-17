import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Flame, Eye, MessageCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed · MAGNETO" },
      { name: "description", content: "Casos de éxito reales de la comunidad MAGNETO." },
    ],
  }),
  component: Feed,
});

const POSTS = [
  { user: "Mateo · 24", text: "Subí la foto de su perfil. La apertura cyan me consiguió el número en 3 mensajes 🔥", fires: 248, views: 1820, chat: "Apertura: 'Tu sonrisa rompe mi algoritmo'\nElla: 'jajaja qué loco, pasame tu insta'" },
  { user: "Diego · 27", text: "Llevaba 4 días en visto. Salvavidas me devolvió la conversa con un solo mensaje.", fires: 412, views: 3105, chat: "Apertura: 'No te pregunté cómo te fue con la mudanza, ¿sobrevivió la planta?'" },
  { user: "Tomás · 22", text: "El Sim con personalidad 'Difícil' me destruyó el ego. Volví, mejoré, cerré la cita.", fires: 187, views: 990, chat: "Score Sim final: 9/10" },
  { user: "Joaco · 29", text: "Date Planner me armó una cita low-budget que terminó en segunda. La fase Cierre es oro.", fires: 305, views: 2210, chat: "Fase 3 · Cierre: caminar al parque, banco, silencio cómodo." },
];

function Feed() {
  return (
    <AppShell title="Feed" subtitle="La comunidad cierra. Vos también podés.">
      <div className="space-y-3">
        {POSTS.map((p, i) => <Card key={i} {...p} />)}
      </div>
    </AppShell>
  );
}

function Card({ user, text, fires, views, chat }: { user: string; text: string; fires: number; views: number; chat: string }) {
  const [n, setN] = useState(fires);
  const [hit, setHit] = useState(false);
  return (
    <article className="neon-card rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full grad-cyber flex items-center justify-center font-display font-bold text-[#04060a]">
          {user[0]}
        </div>
        <div>
          <div className="text-sm font-medium">{user}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">caso real</div>
        </div>
      </div>
      <p className="text-[14px] leading-relaxed">{text}</p>
      <div className="mt-3 rounded-xl border border-[rgba(0,240,255,0.15)] bg-[rgba(0,240,255,0.04)] p-3 select-none">
        <div className="text-[11px] text-foreground/80 whitespace-pre-line blur-[3px] hover:blur-0 transition">{chat}</div>
        <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-2">hover para ver chat</div>
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <button
          onClick={() => { setN(n + 1); setHit(true); setTimeout(() => setHit(false), 500); }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${hit ? "neon-glow text-[#00F0FF]" : "hover:text-[#00F0FF]"}`}
        >
          <Flame className="h-3.5 w-3.5" /> {n}
        </button>
        <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {views}</span>
        <span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> {Math.floor(views / 30)}</span>
      </div>
    </article>
  );
}
