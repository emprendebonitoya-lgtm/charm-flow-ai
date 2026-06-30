import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  ChevronDown, Brain, Eye, MessageSquare, Heart, Flame, Compass,
  CheckCircle2, Circle, Lock,
} from "lucide-react";
import { useState } from "react";
import { useUser } from "@/lib/user";

export const Route = createFileRoute("/academia")({
  head: () => ({
    meta: [
      { title: "Academia · MAGNETO" },
      { name: "description", content: "6 módulos con 5 sublecciones cada uno: lenguaje corporal, conversación, mentalidad, citas, atracción y online." },
    ],
  }),
  component: Academia,
});

type Module = { t: string; sub: string; icon: any; g: [string, string]; lessons: { title: string; content: string }[] };

const MODULES: Module[] = [
  {
    t: "Lenguaje Corporal", sub: "Tu cuerpo habla antes que tú",
    icon: Eye, g: ["#EC4899", "#8B5CF6"],
    lessons: [
      {
        title: "La postura que atrae",
        content: "Aprendé a abrir el pecho, bajar los hombros y mantener equilibrio sin exagerar. La postura transmite seguridad sin palabras.",
      },
      {
        title: "Gestos que proyectan seguridad",
        content: "Usá movimientos suaves y controlados: manos visibles, gestos laterales y evitar tocarte la cara. Son pequeños detalles que suman presencia.",
      },
      {
        title: "El mirroring: el espejo invisible",
        content: "Reflejá sutilmente su ritmo y lenguaje. El mirroring genera conexión emocional sin sonar falso.",
      },
      {
        title: "Proxémica: el uso del espacio",
        content: "Acercate cuando la energía lo permita y respetá su zona de confort. La distancia correcta aumenta atracción.",
      },
      {
        title: "Leer el lenguaje corporal de los demás",
        content: "Detectá señales de interés o incomodidad en sus hombros, manos y mirada para ajustar tu juego al instante.",
      },
    ],
  },
  {
    t: "Conversación con Rizz", sub: "Hablar sin trabarse",
    icon: MessageSquare, g: ["#A855F7", "#7C3AED"],
    lessons: [
      {
        title: "Openers que no son '¿hola?'",
        content: "Arrancá con algo distintivo, observando su foto o perfil. La curiosidad bien plantada abre el diálogo.",
      },
      {
        title: "El arte del push-pull",
        content: "Mezclá interés y desafío con humor. El push-pull construye tensión sin caer en exceso.",
      },
      {
        title: "Storytelling masculino",
        content: "Contá historias cortas con un héroe, conflicto y resultado. Las historias conectan más rápido que listas de logros.",
      },
      {
        title: "Romper el silencio incómodo",
        content: "Tenés recursos estratégicos: comentario curioso, observación divertida o un cambio de tema directo.",
      },
      {
        title: "Cerrar para una cita en 6 mensajes",
        content: "Simplificá el cierre en dos frases: propuesta clara + dos opciones. Menos indecisión, más resultado.",
      },
    ],
  },
  {
    t: "Mentalidad Ganadora", sub: "Frame antes que técnica",
    icon: Brain, g: ["#8B5CF6", "#C084FC"],
    lessons: [
      {
        title: "Abundancia vs escasez",
        content: "Entrená la mentalidad de que hay más oportunidades que una sola persona. Esto cambia tu confianza al hablar.",
      },
      {
        title: "Cómo dejar de ser nice guy",
        content: "Ser amable no significa poner a los demás primero siempre. Defendé tu deseo con respeto y sin disculpas.",
      },
      {
        title: "Manejar el rechazo sin colapsar",
        content: "El rechazo es data, no un fallo personal. Aprendé a resetear rápido y usarlo como aprendizaje.",
      },
      {
        title: "Auto-validación radical",
        content: "Reforzá tus valores internos. Tu estado no debe depender del 'me gusta' de otra persona.",
      },
      {
        title: "Disciplina diaria del seductor",
        content: "Pequeños hábitos diarios elevan tu energía y presencia. La consistencia es lo que falla en la mayoría.",
      },
    ],
  },
  {
    t: "Primera Cita", sub: "La logística que define todo",
    icon: Heart, g: ["#D946EF", "#8B5CF6"],
    lessons: [
      {
        title: "Elegir el lugar correcto",
        content: "Buscá lugares con buena vibra, poco ruido y que permitan moverse. El ambiente influye en la química.",
      },
      {
        title: "Los primeros 60 segundos",
        content: "El inicio establece el tono. Entrá con energía tranquila, sonrisa y una rápida observación sincera.",
      },
      {
        title: "Contacto físico escalado",
        content: "Tocá apenas un segundo, evaluá la reacción y aumentá la cercanía de forma natural.",
      },
      {
        title: "El beso: timing y señales",
        content: "Buscá señales verbales y no verbales antes de acercarte. Que el beso se sienta como una consecuencia, no una misión.",
      },
      {
        title: "Cierre y next-step natural",
        content: "Propone algo concreto basado en lo que descubrieron. La claridad es más atractiva que el misterio eterno.",
      },
    ],
  },
  {
    t: "Atracción Avanzada", sub: "Lo que distingue a un hombre 10",
    icon: Flame, g: ["#EC4899", "#8B5CF6"],
    lessons: [
      {
        title: "Tensión sexual sin vulgaridad",
        content: "Usá insinuaciones elegantes y dobles sentidos. No digas todo, deja que lo imagine.",
      },
      {
        title: "Misterio: cuánto contar",
        content: "Mantén partes de tu historia en reserva. El misterio mantiene la atracción viva.",
      },
      {
        title: "Liderazgo en la interacción",
        content: "Tomá decisiones simples y ofrecé opciones. Liderar es hacer que la experiencia fluya.",
      },
      {
        title: "Voz, tono y silencios",
        content: "Más allá de lo que decís, cómo lo decís es clave. Usá pausas para aumentar presencia.",
      },
      {
        title: "El cierre seductor",
        content: "Termina con una frase que deje ganas de más, no con una conclusión aburrida.",
      },
    ],
  },
  {
    t: "Citas Online", sub: "Apps, fotos y mensajes",
    icon: Compass, g: ["#7C3AED", "#EC4899"],
    lessons: [
      {
        title: "Anatomía de un perfil que rompe",
        content: "Tu perfil habla por vos. Fotos auténticas, una bio con actitud y lineas claras marcan la diferencia.",
      },
      {
        title: "Las 6 fotos que sí funcionan",
        content: "Incluí variedad: estilo, aventura, cercanía y personalidad. Evitá el exceso de selfies sin contexto.",
      },
      {
        title: "Bio: una línea que importa",
        content: "Una bio corta con un gancho y una pista de personalidad funciona mejor que un listado aburrido.",
      },
      {
        title: "De match a número en 4 mensajes",
        content: "Usá mensajes con ritmo, curiosidad y una invitación clara a seguir en otra plataforma.",
      },
      {
        title: "Pasar de chat a cita real",
        content: "Evita la charla eterna. Proponé una idea concreta antes de que el interés se enfríe.",
      },
    ],
  },
];

function Academia() {
  const { state } = useUser();
  const [open, setOpen] = useState<number | null>(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const k = (m: number, l: number) => `${m}:${l}`;
  const count = (mi: number) => MODULES[mi].lessons.filter((_, li) => done[k(mi, li)]).length;
  const previewCount = state.isPremium ? MODULES.length : 2;

  return (
    <AppShell title="Academia" subtitle="6 módulos. 30 lecciones para subir de nivel.">
      <div className="neon-card rounded-3xl p-5 mb-4 border border-[rgba(168,85,247,0.16)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Academia</div>
            <div className="mt-2 text-white text-lg font-semibold">{state.isPremium ? "Todo desbloqueado" : "2 módulos gratis, lo demás premium"}</div>
          </div>
          {!state.isPremium && (
            <Link to="/premium" className="btn-cyber shrink-0">
              Ver planes premium
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {MODULES.map((m, mi) => {
          const Icon = m.icon;
          const isOpen = open === mi;
          const c = count(mi);
          const locked = mi >= previewCount;

          if (locked) {
            return (
              <div key={mi} className="neon-card rounded-2xl overflow-hidden border border-white/10 bg-[rgba(255,255,255,0.04)]">
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${m.g[0]}, ${m.g[1]})`, boxShadow: `0 0 18px ${m.g[0]}55` }}
                  >
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-[15px] leading-tight text-white">{m.t}</div>
                    <div className="text-[11.5px] text-[#BFDBFE]/70 mt-0.5">{m.sub}</div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-[#BFDBFE]/65">
                      <Lock className="h-4 w-4 text-fuchsia-300" />
                      Contenido Premium
                    </div>
                  </div>
                </div>
                <div className="border-t border-white/10 p-4 bg-[rgba(255,255,255,0.05)]">
                  <div className="text-sm text-[#E0E7FF]/80">Este módulo forma parte de la Academia Premium. Suscribite para ver las lecciones completas y desbloquear tu progreso.</div>
                  <div className="mt-4 rounded-2xl bg-[rgba(255,255,255,0.06)] p-4 border border-[rgba(255,255,255,0.1)]">
                    <div className="text-[11px] uppercase tracking-[0.26em] text-[#BFDBFE]/70">Vista previa</div>
                    <div className="mt-2 text-sm font-semibold text-white">{m.lessons[0].title}</div>
                    <p className="mt-2 text-[12px] leading-relaxed text-[#E0E7FF]/75">{m.lessons[0].content}</p>
                  </div>
                  <div className="mt-4">
                    <Link to="/premium" className="btn-cyber">
                      Desbloquear ahora
                    </Link>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={mi} className="neon-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : mi)}
                className="w-full text-left p-4 flex items-center gap-3"
              >
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${m.g[0]}, ${m.g[1]})`, boxShadow: `0 0 18px ${m.g[0]}55` }}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-[15px] leading-tight">{m.t}</div>
                  <div className="text-[11.5px] text-[#BFDBFE]/70 mt-0.5">{m.sub}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full grad-cyber transition-all"
                        style={{ width: `${(c / m.lessons.length) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-[#BFDBFE]/60">{c}/{m.lessons.length}</span>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-[#93C5FD] transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>

              {isOpen && (
                <div className="px-2 pb-3 animate-fade-in">
                  <div className="rounded-xl bg-[rgba(8,14,32,0.5)] border border-[rgba(168,85,247,0.15)] divide-y divide-[rgba(168,85,247,0.1)]">
                    {m.lessons.map((l, li) => {
                      const key = k(mi, li);
                      const isDone = !!done[key];
                      return (
                        <button
                          key={li}
                          onClick={() => setDone((s) => ({ ...s, [key]: !s[key] }))}
                          className="w-full text-left hover:bg-white/5 transition"
                        >
                          <div className="flex items-center gap-3 px-3 py-3">
                            {isDone
                              ? <CheckCircle2 className="h-4 w-4 text-[#D946EF] shrink-0" />
                              : <Circle className="h-4 w-4 text-white/30 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <div className={`text-[13px] font-semibold ${isDone ? "text-white/50 line-through" : "text-white/90"}`}>
                                {l.title}
                              </div>
                              <div className="text-[11.2px] text-[#BFDBFE]/65 mt-1 leading-snug">
                                {l.content}
                              </div>
                            </div>
                            <span className="text-[10px] text-[#93C5FD]/60">Lección {li + 1}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
