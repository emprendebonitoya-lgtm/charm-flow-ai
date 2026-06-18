import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Flame, Eye, MessageCircle, Instagram, Heart, Copy, Eye as EyeOpen, EyeOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed · MAGNETO" },
      { name: "description", content: "Casos de éxito reales de la comunidad. Copiá las técnicas y aplicalas." },
    ],
  }),
  component: Feed,
});

type Platform = "Instagram" | "Tinder" | "Bumble" | "WhatsApp" | "TikTok";

const POSTS: {
  user: string; age: number; vibe: string; platform: Platform;
  text: string; fires: number; views: number;
  chat: string; technique: { name: string; how: string };
}[] = [
  {
    user: "Mateo", age: 24, vibe: "Directo · humor seco", platform: "Instagram",
    text: "Subí la foto de su perfil al Escáner. La apertura me consiguió el número en 3 mensajes 🔥",
    fires: 248, views: 1820,
    chat: "Yo: 'Tu sonrisa rompe mi algoritmo'\nElla: 'jajaja qué loco, pasame tu insta'",
    technique: { name: "Observación + cumplido indirecto", how: "Fijate en UN detalle de la foto (sonrisa, fondo, ropa) y conectalo con algo tuyo o un juego de palabras. No es halago plano, es un guiño." },
  },
  {
    user: "Diego", age: 27, vibe: "Tranquilo · empático", platform: "WhatsApp",
    text: "Llevaba 4 días en visto. Salvavidas me devolvió la conversa con un solo mensaje.",
    fires: 412, views: 3105,
    chat: "Yo: 'No te pregunté cómo te fue con la mudanza, ¿sobrevivió la planta?'\nElla: 'jaja sí, la salvé. ¿Cómo te acordaste?'",
    technique: { name: "Callback específico", how: "Rescatá un detalle puntual de la conversación previa (que ella mencionó al pasar). Demuestra atención sin parecer obsesivo. Funciona mejor con humor leve." },
  },
  {
    user: "Tomás", age: 22, vibe: "Frame fuerte · juguetón", platform: "Tinder",
    text: "El Sim con 'Camila Difícil' me destruyó el ego. Volví 5 veces, mejoré, y cerré la cita real.",
    fires: 187, views: 990,
    chat: "Score Sim final: 9/10\nReal: cita el sábado en bar de vinos.",
    technique: { name: "Mantener frame ante shit tests", how: "Cuando ella te testea con 'y vos qué tenés de especial', NO te justifiques. Respondé con humor que reframea: 'Mi modestia. Después te muestro otras virtudes.'" },
  },
  {
    user: "Joaco", age: 29, vibe: "Romántico · old school", platform: "Bumble",
    text: "Date Planner me armó una cita low-budget que terminó en segunda. La fase Cierre es oro.",
    fires: 305, views: 2210,
    chat: "Fase 3 · Cierre: caminar al parque, banco, silencio cómodo, beso.",
    technique: { name: "Silencio estratégico en el cierre", how: "Después de la actividad principal, llevala a un lugar tranquilo y NO llenes el silencio. El espacio crea tensión y permite que el momento se construya solo." },
  },
];

const PLATFORM_ICONS: Record<Platform, typeof Instagram> = {
  Instagram, Tinder: Heart, Bumble: Heart, WhatsApp: MessageCircle, TikTok: Heart,
};
const PLATFORM_COLOR: Record<Platform, string> = {
  Instagram: "#E1306C", Tinder: "#FE3C72", Bumble: "#FFC629",
  WhatsApp: "#25D366", TikTok: "#69C9D0",
};

function Feed() {
  return (
    <AppShell title="Feed" subtitle="La comunidad cierra. Copiá la técnica.">
      <div className="space-y-3">
        {POSTS.map((p, i) => <Card key={i} {...p} />)}
      </div>
    </AppShell>
  );
}

function Card({
  user, age, vibe, platform, text, fires, views, chat, technique,
}: typeof POSTS[number]) {
  const [n, setN] = useState(fires);
  const [hit, setHit] = useState(false);
  const [revealChat, setRevealChat] = useState(false);
  const [showTech, setShowTech] = useState(false);
  const PIcon = PLATFORM_ICONS[platform];
  const pcolor = PLATFORM_COLOR[platform];

  return (
    <article className="neon-card rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full grad-cyber flex items-center justify-center font-display font-bold text-white">
          {user[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium">{user}, {age}</div>
          <div className="text-[10.5px] text-[#BFDBFE]/70 truncate">{vibe}</div>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border"
          style={{
            color: pcolor,
            borderColor: `${pcolor}55`,
            background: `${pcolor}15`,
          }}
        >
          <PIcon className="h-3 w-3" /> {platform}
        </div>
      </div>

      <p className="text-[14px] leading-relaxed text-white/90">{text}</p>

      {/* Chat preview */}
      <div className="mt-3 rounded-xl border border-[rgba(99,160,255,0.2)] bg-[rgba(15,25,55,0.55)] p-3 relative">
        <div
          className={`text-[12px] text-white/90 whitespace-pre-line transition ${revealChat ? "" : "blur-[4px] select-none"}`}
        >
          {chat}
        </div>
        <button
          onClick={() => setRevealChat((v) => !v)}
          className="mt-2 text-[10px] uppercase tracking-widest text-[#93C5FD] inline-flex items-center gap-1 hover:underline"
        >
          {revealChat ? <><EyeOff className="h-3 w-3" /> Ocultar chat</> : <><EyeOpen className="h-3 w-3" /> Ver chat</>}
        </button>
      </div>

      {/* Técnica */}
      <div className="mt-3">
        <button
          onClick={() => setShowTech((v) => !v)}
          className="btn-ghost w-full !py-2.5"
        >
          {showTech ? "Ocultar técnica" : "Ver técnica"}
        </button>
        {showTech && (
          <div className="mt-2 rounded-xl border border-[rgba(99,160,255,0.28)] bg-[rgba(40,72,140,0.35)] p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#93C5FD]">Técnica</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${technique.name}\n\n${technique.how}`);
                  toast.success("Técnica copiada");
                }}
                className="p-1.5 rounded-lg hover:bg-[rgba(99,160,255,0.15)]"
                aria-label="Copiar técnica"
              >
                <Copy className="h-3.5 w-3.5 text-[#93C5FD]" />
              </button>
            </div>
            <div className="font-display text-sm font-semibold text-white">{technique.name}</div>
            <p className="text-[12.5px] text-white/85 mt-1.5 leading-relaxed">{technique.how}</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mt-3 text-xs text-[#BFDBFE]/70">
        <button
          onClick={() => { setN(n + 1); setHit(true); setTimeout(() => setHit(false), 500); }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${hit ? "neon-glow text-[#60A5FA]" : "hover:text-[#60A5FA]"}`}
        >
          <Flame className="h-3.5 w-3.5" /> {n}
        </button>
        <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {views}</span>
        <span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> {Math.floor(views / 30)}</span>
      </div>
    </article>
  );
}
