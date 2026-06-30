import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  Flame, Eye, MessageCircle, Instagram, Heart, Copy, EyeOff, Shuffle,
} from "lucide-react";
import { useMemo, useState } from "react";
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

type Post = {
  user: string; age: number; vibe: string; platform: Platform;
  text: string; fires: number; views: number;
  chat: string; technique: { name: string; how: string };
};

const POSTS: Post[] = [
  { user: "Mateo", age: 24, vibe: "Directo · humor seco", platform: "Instagram",
    text: "Subí la foto de su perfil al Escáner. La apertura me consiguió el número en 3 mensajes 🔥",
    fires: 248, views: 1820,
    chat: "Yo: 'Tu sonrisa rompe mi algoritmo'\nElla: 'jajaja qué loco, pasame tu insta'",
    technique: { name: "Observación + cumplido indirecto", how: "Fijate en UN detalle de la foto y conectalo con algo tuyo o un juego de palabras. No es halago plano, es un guiño." } },
  { user: "Diego", age: 27, vibe: "Tranquilo · empático", platform: "WhatsApp",
    text: "Llevaba 4 días en visto. Salvavidas me devolvió la conversa con un solo mensaje.",
    fires: 412, views: 3105,
    chat: "Yo: 'No te pregunté cómo te fue con la mudanza, ¿sobrevivió la planta?'\nElla: 'jaja sí. ¿Cómo te acordaste?'",
    technique: { name: "Callback específico", how: "Rescatá un detalle puntual que ella mencionó al pasar. Demuestra atención sin parecer obsesivo." } },
  { user: "Tomás", age: 22, vibe: "Frame fuerte · juguetón", platform: "Tinder",
    text: "El Sim con 'Camila Difícil' me destruyó el ego. Volví 5 veces, mejoré, y cerré la cita real.",
    fires: 187, views: 990,
    chat: "Score Sim final: 9/10\nReal: cita el sábado en bar de vinos.",
    technique: { name: "Mantener frame ante shit tests", how: "Cuando te testea, NO te justifiques. Respondé con humor que reframea: 'Mi modestia. Después te muestro otras virtudes.'" } },
  { user: "Joaco", age: 29, vibe: "Romántico · old school", platform: "Bumble",
    text: "Date Planner me armó una cita low-budget que terminó en segunda. La fase Cierre es oro.",
    fires: 305, views: 2210,
    chat: "Fase 3 · Cierre: caminar al parque, banco, silencio cómodo, beso.",
    technique: { name: "Silencio estratégico en el cierre", how: "Después de la actividad principal, llevala a un lugar tranquilo y NO llenes el silencio. El espacio crea tensión." } },
  { user: "Bruno", age: 31, vibe: "Maduro · misterioso", platform: "Instagram",
    text: "Un mensaje cada 3 días y ella me terminó escribiendo a mí. Less is more, hermanos.",
    fires: 521, views: 4022,
    chat: "Yo: (silencio 3 días)\nElla: '¿desapareciste? jaja'",
    technique: { name: "Ratio inverso", how: "Bajá la frecuencia. La gente desea lo que no puede tener todos los días." } },
  { user: "Lucas", age: 26, vibe: "Atrevido · juguetón", platform: "TikTok",
    text: "Comenté un video suyo con una observación rara y terminó en mi DM en 20 min.",
    fires: 174, views: 1402,
    chat: "Comentario: 'Te delata el fondo, sos de zona norte 100%'\nElla DM: 'cómo sabés? jaja'",
    technique: { name: "Cold-read específico", how: "Tirá una observación arriesgada pero plausible. Si pegás, sos un mago. Si no, sos un loco gracioso." } },
  { user: "Nacho", age: 23, vibe: "Tímido en remisión", platform: "WhatsApp",
    text: "Antes me trababa. Apliqué el ritual de la mañana 21 días y me animé a invitarla en persona.",
    fires: 389, views: 2680,
    chat: "Yo (en bar): 'Esta semana me prometí invitar a la chica más interesante que vea. Sos vos.'",
    technique: { name: "Honestidad de alto frame", how: "Decir la verdad con calma proyecta más confianza que cualquier técnica. Pero practicala antes." } },
  { user: "Pablo", age: 28, vibe: "Sarcástico · culto", platform: "Bumble",
    text: "Frases de la app + mi propio toque. Match → cita en 48hs.",
    fires: 256, views: 1995,
    chat: "Yo: 'Spoiler: este mensaje probablemente cambie tu semana'\nElla: 'okay, escucho'",
    technique: { name: "Frame alto desde el opener", how: "El primer mensaje setea la dinámica. Empezá ya como premio." } },
];

const PLATFORM_ICONS: Record<Platform, typeof Instagram> = {
  Instagram, Tinder: Heart, Bumble: Heart, WhatsApp: MessageCircle, TikTok: Heart,
};
const PLATFORM_COLOR: Record<Platform, string> = {
  Instagram: "#E1306C", Tinder: "#FE3C72", Bumble: "#FFC629",
  WhatsApp: "#25D366", TikTok: "#69C9D0",
};

const ALL_PLATFORMS: ("Todas" | Platform)[] = ["Todas", "Instagram", "Tinder", "Bumble", "WhatsApp", "TikTok"];

function Feed() {
  const [filter, setFilter] = useState<"Todas" | Platform>("Todas");
  const [seed, setSeed] = useState(0);

  const list = useMemo(() => {
    const base = filter === "Todas" ? POSTS : POSTS.filter((p) => p.platform === filter);
    // Shuffle deterministic por seed
    const arr = [...base];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(((Math.sin(seed * 9301 + i * 49297) + 1) / 2) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filter, seed]);

  return (
    <AppShell title="Feed" subtitle="La comunidad cierra. Copiá la técnica.">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {ALL_PLATFORMS.map((p) => (
            <button key={p} onClick={() => setFilter(p)}
              className={`chip whitespace-nowrap ${filter === p ? "chip-active" : ""}`}>{p}</button>
          ))}
        </div>
        <button onClick={() => setSeed((s) => s + 1)} className="btn-ghost !py-2 !px-3 shrink-0" aria-label="Mezclar">
          <Shuffle className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {list.map((p, i) => <Card key={`${seed}-${i}`} {...p} />)}
      </div>
    </AppShell>
  );
}


function Card({
  user, age, vibe, platform, text, fires, views, chat, technique,
}: Post) {
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
      <div className="mt-3 rounded-xl border border-[rgba(168,85,247,0.2)] bg-[rgba(15,25,55,0.55)] p-3 relative">
        <div
          className={`text-[12px] text-white/90 whitespace-pre-line transition ${revealChat ? "" : "blur-[4px] select-none"}`}
        >
          {chat}
        </div>
        <button
          onClick={() => setRevealChat((v) => !v)}
          className="mt-2 text-[10px] uppercase tracking-widest text-[#93C5FD] inline-flex items-center gap-1 hover:underline"
        >
          {revealChat ? <><EyeOff className="h-3 w-3" /> Ocultar chat</> : <><Eye className="h-3 w-3" /> Ver chat</>}
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
          <div className="mt-2 rounded-xl border border-[rgba(168,85,247,0.28)] bg-[rgba(55,24,70,0.35)] p-3 animate-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#93C5FD]">Técnica</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${technique.name}\n\n${technique.how}`);
                  toast.success("Técnica copiada");
                }}
                className="p-1.5 rounded-lg hover:bg-[rgba(168,85,247,0.15)]"
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
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${hit ? "neon-glow text-[#D946EF]" : "hover:text-[#D946EF]"}`}
        >
          <Flame className="h-3.5 w-3.5" /> {n}
        </button>
        <span className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5" /> {views}</span>
        <span className="flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> {Math.floor(views / 30)}</span>
      </div>
    </article>
  );
}
