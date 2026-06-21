import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Play, Clock, Users, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/lib/user";
import { FREE_LIMITS } from "@/lib/plans";

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

type Pill = { t: string; s: string; cat: Exclude<Cat, "Todo">; min: number; reads: string; g: [string, string]; details: string };

const PILLS: Pill[] = [
  {
    t: "Psicología del Lenguaje Corporal",
    s: "Domina el 93% no verbal",
    cat: "Cuerpo",
    min: 12,
    reads: "4.2K",
    g: ["#EC4899", "#8B5CF6"],
    details: "Entendé cómo la postura, las microexpresiones y el ritmo de tus gestos definen tu presencia. Mantené los hombros abiertos, usá el contacto visual con intención y evitá señales de inseguridad como tocarte la cara o cruzar brazos.",
  },
  {
    t: "Reglas de la Primera Cita",
    s: "Sin errores que te cuesten el segundo encuentro",
    cat: "Citas",
    min: 18,
    reads: "6.8K",
    g: ["#D946EF", "#7C3AED"],
    details: "Elegí un lugar con buena energía y poca fricción. Dirigí la conversación con confianza, abrí espacio para que ella participe y cerrá con una propuesta concreta para el siguiente paso.",
  },
  {
    t: "Frame Control Avanzado",
    s: "Quien controla el marco, controla la interacción",
    cat: "Mentalidad",
    min: 22,
    reads: "3.1K",
    g: ["#EC4899", "#8B5CF6"],
    details: "Tu estado interno marca tu rendimiento. Definí tus límites, mantené una actitud de abundancia y responda al rechazo con calma. El frame fuerte hace que ella entre en tu mundo sin que vos te desgastes.",
  },
  {
    t: "Cómo Escribir Textos que Enganchan",
    s: "El arte de la curiosidad en chat",
    cat: "Conversación",
    min: 14,
    reads: "5.4K",
    g: ["#A855F7", "#C084FC"],
    details: "Usá pocos mensajes para generar interés: un opener memorable, una reacción auténtica y una invitación ligera. Evitá textos largos, preguntas aburridas y el juego de '¿qué hacés?'.",
  },
  {
    t: "Tono de Voz que Atrae",
    s: "Grave, lento, pausado. Y por qué funciona",
    cat: "Cuerpo",
    min: 9,
    reads: "2.7K",
    g: ["#EC4899", "#D946EF"],
    details: "La voz es una herramienta de autoridad. Hablá con calma, evitá apurarte y usá pausas estratégicas. Un tono más bajo y controlado transmite seguridad sin sonar forzado.",
  },
  {
    t: "Abundancia Mental",
    s: "Cómo dejar de necesitar para empezar a elegir",
    cat: "Mentalidad",
    min: 16,
    reads: "8.1K",
    g: ["#C084FC", "#A855F7"],
    details: "No dependas de un solo resultado: tenés opciones. Esta mentalidad te permite actuar desde el valor propio y no desde la urgencia. El rechazo se transforma en información, no en catástrofe.",
  },
  {
    t: "Anatomía de un Perfil Killer",
    s: "Lo que tus 6 fotos deben transmitir",
    cat: "Online",
    min: 11,
    reads: "9.6K",
    g: ["#A855F7", "#EC4899"],
    details: "Incluí una foto de estilo, una de acción, una con amigos y una que muestre tu estética. Tu perfil debe ser claro, honesto y dar una sensación de misterio bien calibrada.",
  },
  {
    t: "El Silencio Estratégico",
    s: "Cuando callarte vale más que cualquier frase",
    cat: "Conversación",
    min: 7,
    reads: "1.9K",
    g: ["#9333EA", "#EC4899"],
    details: "No respondas instantáneamente a todo. Un poco de espacio crea curiosidad y demuestra que tu tiempo tiene valor. La pausa bien usada es un imán de interés.",
  },
  {
    t: "Tensión Sexual sin Vulgaridad",
    s: "Subir la temperatura con elegancia",
    cat: "Citas",
    min: 19,
    reads: "7.3K",
    g: ["#C084FC", "#EC4899"],
    details: "Usá insinuaciones sutiles y comentarios cargados de doble sentido sin caer en lo explícito. Hacé que ella complete la frase en su cabeza, y mantené siempre el respeto.",
  },
  {
    t: "Manejo del Rechazo",
    s: "Convertir un 'no' en información, no en herida",
    cat: "Mentalidad",
    min: 13,
    reads: "5.0K",
    g: ["#D946EF", "#EC4899"],
    details: "El rechazo no es personal, es un señalador. Aprendé de cada experiencia, agradecé y seguí adelante sin que te arrastre. Eso es lo que hace a un hombre imparable.",
  },
  {
    t: "Mirroring: el Espejo Invisible",
    s: "La técnica que genera rapport en segundos",
    cat: "Cuerpo",
    min: 8,
    reads: "3.4K",
    g: ["#A855F7", "#C084FC"],
    details: "Imitá sutilmente su ritmo, postura y vocabulario para crear conexión. No copies de forma exacta: adaptá tu energía para que se sienta natural y cómodo.",
  },
  {
    t: "De Match a Número en 4 Mensajes",
    s: "Plantilla con bifurcaciones",
    cat: "Online",
    min: 10,
    reads: "11K",
    g: ["#EC4899", "#C084FC"],
    details: "Arrancá con una apertura diferencial, seguí con una línea que genere interés y cerrá con una propuesta de cambio de canal. El número aparece cuando ya hay química y claridad.",
  },
];

const VIP_PILLS: Pill[] = [
  {
    t: "Cápsula VIP: Mensajes que enganchan",
    s: "Scripts listos para usar en apps y chat",
    cat: "Conversación",
    min: 10,
    reads: "3.6K",
    g: ["#7C3AED", "#EC4899"],
    details: "Plantillas premium para abrir conversación, responder con atracción y llevar el chat hacia una cita sin sonar repetido.",
  },
  {
    t: "Cápsula VIP: Primera cita brillante",
    s: "El plan que genera segunda vez",
    cat: "Citas",
    min: 14,
    reads: "2.8K",
    g: ["#D946EF", "#8B5CF6"],
    details: "Estrategia para diseñar una primera salida con timing, ritmo y el cierre correcto que deja ganas de más.",
  },
];

function Biblioteca() {
  const { state } = useUser();
  const [cat, setCat] = useState<Cat>("Todo");
  const [selected, setSelected] = useState<number>(-1);
  const list = cat === "Todo" ? PILLS : PILLS.filter((p) => p.cat === cat);
  const previewLimit = state.isPremium ? list.length : FREE_LIMITS.bibliotecaPills;

  useEffect(() => {
    setSelected(-1);
  }, [cat]);

  const today = new Date();
  const dayOfYear = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(today.getFullYear(), 0, 0)) / 86400000);
  const recommendations = useMemo(() => {
    if (!list.length) return [];
    const start = dayOfYear % list.length;
    return [0, 1, 2].map((offset) => list[(start + offset * 2) % list.length]);
  }, [dayOfYear, list]);

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

      {recommendations.length > 0 && (
        <div className="neon-card rounded-3xl p-5 mb-4 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Recomendaciones del día</div>
              <div className="font-display text-[18px] font-semibold text-white">Rotan cada 24 horas</div>
            </div>
            <div className="text-[11px] text-[#BFDBFE]/65">Semana {Math.floor(dayOfYear / 7) + 1}</div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {recommendations.map((p, i) => (
              <div key={i} className="rounded-2xl bg-[rgba(255,255,255,0.05)] border border-white/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#D8B4FE]/60 mb-2">Recomendación {i + 1}</div>
                <div className="font-semibold text-white leading-tight">{p.t}</div>
                <div className="text-[11px] text-[#E0E7FF]/75 mt-2 leading-snug">{p.s}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="neon-card rounded-3xl p-5 mb-4 border border-[rgba(168,85,247,0.16)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Biblioteca VIP</div>
            <div className="font-display text-[18px] font-semibold text-white">Contenido exclusivo para Premium</div>
          </div>
          {!state.isPremium ? (
            <Link to="/premium" className="btn-cyber">
              Desbloquear VIP
            </Link>
          ) : (
            <div className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#D8B4FE]/80">Disponible</div>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {VIP_PILLS.map((p, i) => (
            <div key={i} className="rounded-3xl border border-white/10 p-4 bg-[rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.24em] text-[#BFDBFE]/70">{p.cat}</div>
                  <div className="mt-2 font-semibold text-white">{p.t}</div>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#E0E7FF]/75">VIP</span>
              </div>
              <div className="text-[13px] leading-relaxed text-[#E0E7FF]/80">{p.s}</div>
              <div className="mt-4 text-[11px] text-[#93C5FD]/80">{p.min} min · {p.reads}</div>
              {!state.isPremium && (
                <div className="mt-4">
                  <Link to="/premium" className="btn-ghost w-full">Ver plan premium</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {!state.isPremium && (
        <div className="neon-card rounded-3xl p-5 mb-4 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Biblioteca gratis</div>
              <div className="font-display text-[18px] font-semibold text-white">{FREE_LIMITS.bibliotecaPills} píldoras gratis. El resto es premium.</div>
            </div>
            <Link to="/premium" className="btn-cyber">
              Desbloquear todo
            </Link>
          </div>
          <p className="mt-4 text-sm text-[#E0E7FF]/80">Probalas primero y luego elevá tu acceso para ver la biblioteca completa con explicaciones profundas y guías para cada categoría.</p>
        </div>
      )}

      <div className="space-y-3 mt-2">
        {list.map((p, i) => {
          const locked = i >= previewLimit;
          return (
          <button
            key={i}
            onClick={() => setSelected((current) => (current === i ? -1 : i))}
            className={`w-full text-left rounded-2xl overflow-hidden relative group transition-all hover:-translate-y-0.5 ${selected === i ? "ring-2 ring-fuchsia-400/60" : ""}`}
            style={{
              backgroundImage: `linear-gradient(120deg, ${p.g[0]}22 0%, ${p.g[1]}22 100%), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='40' fill='rgba(255,255,255,0.03)' /%3E%3Ccircle cx='20' cy='20' r='4' fill='rgba(255,255,255,0.06)' /%3E%3Ccircle cx='100' cy='100' r='4' fill='rgba(255,255,255,0.05)' /%3E%3Cline x1='15' y1='105' x2='105' y2='15' stroke='rgba(255,255,255,0.04)' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: "cover, 120px 120px",
              boxShadow: `0 18px 40px -18px ${p.g[1]}aa, 0 0 30px -10px ${p.g[0]}55`,
            }}
          >
            <div className="absolute inset-0 grid-bg opacity-18" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, rgba(4,6,15,0.42) 100%)" }} />
            <div className="relative flex flex-col gap-3 p-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full backdrop-blur-md bg-white/12 border border-white/15 flex items-center justify-center group-hover:scale-110 transition shrink-0">
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
              {selected === i && (
                <div className="rounded-2xl bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-4 text-[13px] leading-relaxed text-[#E0E7FF]/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  {locked ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#E0E7FF]/80">
                        <Lock className="h-4 w-4 text-fuchsia-300" />
                        <span>Contenido premium. Suscribite para ver la explicación completa.</span>
                      </div>
                      <Link to="/premium" className="btn-cyber w-full text-center">
                        Desbloquear ahora
                      </Link>
                    </div>
                  ) : (
                    p.details
                  )}
                </div>
              )}
            </div>
          </button>
        );})}
      </div>
    </AppShell>
  );
}
