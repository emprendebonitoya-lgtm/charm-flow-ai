import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AdBanner } from "@/components/AdBanner";
import { consumeAd } from "@/lib/ad-policy";
import { useUser } from "@/lib/user";
import { Copy, Instagram, MessageCircle, Heart } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/frases")({
  head: () => ({
    meta: [
      { title: "Frases · MAGNETO" },
      { name: "description", content: "Banco de frases con plataforma, escenario, rollo y contexto." },
    ],
  }),
  component: Frases,
});

type Platform = "Instagram" | "Tinder" | "Bumble" | "WhatsApp" | "TikTok" | "Todas";
type Escenario = "Opener" | "Romper hielo" | "Subir tensión" | "Rescate" | "Cierre" | "Todos";
type Rollo = "Ingenioso" | "Coqueto" | "Atrevido" | "Tierno" | "Casual" | "Todos";
type Contexto = "Todas" | "Cuando ella tiene un feed muy estético" | "Para arrancar sin presión y forzar respuesta" | "Genera curiosidad inmediata" | "Cuando la conversa fluye y querés marcar interés" | "Después de una respuesta característica" | "Reactivar un chat usando un detalle previo" | "Cerrar cita con opciones cerradas" | "Cuando ya hubo química en el chat" | "Solo después de buena química" | "Para foto que muestra personalidad" | "Frame alto desde el primer mensaje" | "Crea bucle abierto y excusa para volver";

type Frase = {
  text: string;
  platform: Exclude<Platform, "Todas">;
  escenario: Exclude<Escenario, "Todos">;
  rollo: Exclude<Rollo, "Todos">;
  contexto: string;
};

const FRASES: Frase[] = [
  { text: "Tu perfil está peligrosamente bien curado. ¿Estrategia o talento natural?", platform: "Instagram", escenario: "Opener", rollo: "Ingenioso", contexto: "Cuando ella tiene un feed muy estético" },
  { text: "Necesito tu opinión: ¿pizza con piña, crimen o malentendido cultural?", platform: "Tinder", escenario: "Opener", rollo: "Casual", contexto: "Para arrancar sin presión y forzar respuesta" },
  { text: "Vas a pensar que es un opener random, pero tengo una teoría sobre vos.", platform: "Bumble", escenario: "Opener", rollo: "Atrevido", contexto: "Genera curiosidad inmediata" },
  { text: "Cuidado, estás peligrosamente cerca de caerme bien.", platform: "WhatsApp", escenario: "Subir tensión", rollo: "Coqueto", contexto: "Cuando la conversa fluye y querés marcar interés" },
  { text: "Eso fue tan tu estilo que ya lo sentí venir tres mensajes antes.", platform: "Instagram", escenario: "Romper hielo", rollo: "Ingenioso", contexto: "Después de una respuesta característica" },
  { text: "No te pregunté cómo te fue con la mudanza, ¿sobrevivió la planta?", platform: "WhatsApp", escenario: "Rescate", rollo: "Tierno", contexto: "Reactivar un chat usando un detalle previo" },
  { text: "Esto ya pide café. ¿Jueves o viernes?", platform: "Tinder", escenario: "Cierre", rollo: "Casual", contexto: "Cerrar cita con opciones cerradas" },
  { text: "Te debo una historia mejor en persona. ¿Cuándo?", platform: "Bumble", escenario: "Cierre", rollo: "Coqueto", contexto: "Cuando ya hubo química en el chat" },
  { text: "Si te beso ahora arruino la conversación, así que mejor seguimos hablando.", platform: "WhatsApp", escenario: "Subir tensión", rollo: "Atrevido", contexto: "Solo después de buena química" },
  { text: "Te dejaste ver demasiado en esa última foto. Me caés bien.", platform: "Instagram", escenario: "Romper hielo", rollo: "Coqueto", contexto: "Para foto que muestra personalidad" },
  { text: "Spoiler: este mensaje probablemente cambie tu semana.", platform: "Tinder", escenario: "Opener", rollo: "Atrevido", contexto: "Frame alto desde el primer mensaje" },
  { text: "Recordame mañana mandarte algo que tengo que mostrarte.", platform: "WhatsApp", escenario: "Rescate", rollo: "Ingenioso", contexto: "Crea bucle abierto y excusa para volver" },
];

const PLATFORMS: Platform[] = ["Todas", "Instagram", "Tinder", "Bumble", "WhatsApp", "TikTok"];
const ESCENARIOS: Escenario[] = ["Todos", "Opener", "Romper hielo", "Subir tensión", "Rescate", "Cierre"];
const ROLLOS: Rollo[] = ["Todos", "Ingenioso", "Coqueto", "Atrevido", "Tierno", "Casual"];
const CONTEXTOS: Contexto[] = [
  "Todas",
  "Cuando ella tiene un feed muy estético",
  "Para arrancar sin presión y forzar respuesta",
  "Genera curiosidad inmediata",
  "Cuando la conversa fluye y querés marcar interés",
  "Después de una respuesta característica",
  "Reactivar un chat usando un detalle previo",
  "Cerrar cita con opciones cerradas",
  "Cuando ya hubo química en el chat",
  "Solo después de buena química",
  "Para foto que muestra personalidad",
  "Frame alto desde el primer mensaje",
  "Crea bucle abierto y excusa para volver",
];

const PICON: Record<Frase["platform"], any> = { Instagram, Tinder: Heart, Bumble: Heart, WhatsApp: MessageCircle, TikTok: Heart };
const PCOLOR: Record<Frase["platform"], string> = { Instagram: "#E1306C", Tinder: "#FE3C72", Bumble: "#FFC629", WhatsApp: "#25D366", TikTok: "#69C9D0" };

function Frases() {
  const { state } = useUser();
  const [p, setP] = useState<Platform>("Todas");
  const [e, setE] = useState<Escenario>("Todos");
  const [r, setR] = useState<Rollo>("Todos");
  const [c, setC] = useState<Contexto>("Todas");
  const [generated, setGenerated] = useState<Frase | null>(null);

  const list = useMemo(
    () => FRASES.filter(
      (f) => (p === "Todas" || f.platform === p)
          && (e === "Todos" || f.escenario === e)
          && (r === "Todos" || f.rollo === r)
          && (c === "Todas" || f.contexto === c),
    ), [p, e, r, c],
  );

  const generate = () => {
    if (list.length === 0) {
      return toast.error("No hay frases con esa combinación");
    }

    if (!state.isPremium && consumeAd("interstitial")) {
      toast.info("Contenido patrocinado: gracias por apoyar el plan gratis.");
    }

    const chosen = list[Math.floor(Math.random() * list.length)];
    setGenerated(chosen);
  };

  return (
    <AppShell title="Frases" subtitle="Filtrá por plataforma, escenario y rollo.">
      <div className="space-y-3 mb-4">
        <Row label="Plataforma" items={PLATFORMS} value={p} onChange={setP} />
        <Row label="Escenario"  items={ESCENARIOS} value={e} onChange={setE} />
        <Row label="Rollo"      items={ROLLOS}     value={r} onChange={setR} />
        <Row label="Contexto"   items={CONTEXTOS}  value={c} onChange={setC} />
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={generate}
          className="btn-cyber px-5 py-3"
        >
          Generar frase
        </button>
        <span className="text-[11px] text-muted-foreground">Usá los filtros y creá una frase que encaje con la situación.</span>
      </div>
      <AdBanner slot="inline" className="mb-4" />
      {generated && (
        <div className="neon-card rounded-2xl p-4 border border-[rgba(168,85,247,0.18)] mb-4">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#D8B4FE]/80 mb-2">Frase generada</div>
          <p className="text-[15px] font-semibold text-white leading-relaxed">"{generated.text}"</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="chip">{generated.platform}</span>
            <span className="chip">{generated.escenario}</span>
            <span className="chip">{generated.rollo}</span>
          </div>
          <div className="mt-2 text-[11px] text-[#BFDBFE]/70">Contexto: {generated.contexto}</div>
        </div>
      )}

      {list.length === 0 ? (
        <div className="neon-card rounded-2xl p-6 text-center text-sm text-muted-foreground">
          No hay frases para esa combinación. Bajá un filtro.
        </div>
      ) : (
        <div className="space-y-2.5">
          {list.map((f, i) => {
            const PIcon = PICON[f.platform];
            const col = PCOLOR[f.platform];
            return (
              <div key={i} className="neon-card rounded-2xl p-3.5">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="chip" style={{ color: col, borderColor: `${col}55`, background: `${col}15` }}>
                    <PIcon className="h-3 w-3" /> {f.platform}
                  </span>
                  <span className="chip">{f.escenario}</span>
                  <span className="chip">{f.rollo}</span>
                </div>
                <p className="text-[14px] text-white/95 leading-relaxed">"{f.text}"</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-[#BFDBFE]/65 italic flex-1">Contexto: {f.contexto}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(f.text); toast.success("Copiado"); }}
                    className="p-2 rounded-lg hover:bg-primary/15 shrink-0"
                    aria-label="Copiar"
                  >
                    <Copy className="h-4 w-4 text-[#93C5FD]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function Row<T extends string>({ label, items, value, onChange }: {
  label: string; items: readonly T[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="text-[9.5px] tracking-[0.28em] uppercase text-muted-foreground mb-1.5">{label}</div>
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {items.map((it) => (
          <button key={it} onClick={() => onChange(it)}
            className={`chip whitespace-nowrap ${value === it ? "chip-active" : ""}`}>{it}</button>
        ))}
      </div>
    </div>
  );
}
