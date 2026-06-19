import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  ChevronDown, Brain, Eye, MessageSquare, Heart, Flame, Compass,
  CheckCircle2, Circle,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/academia")({
  head: () => ({
    meta: [
      { title: "Academia · MAGNETO" },
      { name: "description", content: "6 módulos con 5 sublecciones cada uno: lenguaje corporal, conversación, mentalidad, citas, atracción y online." },
    ],
  }),
  component: Academia,
});

type Module = { t: string; sub: string; icon: any; g: [string, string]; lessons: string[] };

const MODULES: Module[] = [
  {
    t: "Lenguaje Corporal", sub: "Tu cuerpo habla antes que tú",
    icon: Eye, g: ["#22D3EE", "#3B82F6"],
    lessons: [
      "La postura que atrae",
      "Gestos que proyectan seguridad",
      "El mirroring: el espejo invisible",
      "Proxémica: el uso del espacio",
      "Leer el lenguaje corporal de los demás",
    ],
  },
  {
    t: "Conversación con Rizz", sub: "Hablar sin trabarse",
    icon: MessageSquare, g: ["#3B82F6", "#6366F1"],
    lessons: [
      "Openers que no son '¿hola?'",
      "El arte del push-pull",
      "Storytelling masculino",
      "Romper el silencio incómodo",
      "Cerrar para una cita en 6 mensajes",
    ],
  },
  {
    t: "Mentalidad Ganadora", sub: "Frame antes que técnica",
    icon: Brain, g: ["#6366F1", "#8B5CF6"],
    lessons: [
      "Abundancia vs escasez",
      "Cómo dejar de ser nice guy",
      "Manejar el rechazo sin colapsar",
      "Auto-validación radical",
      "Disciplina diaria del seductor",
    ],
  },
  {
    t: "Primera Cita", sub: "La logística que define todo",
    icon: Heart, g: ["#8B5CF6", "#22D3EE"],
    lessons: [
      "Elegir el lugar correcto",
      "Los primeros 60 segundos",
      "Contacto físico escalado",
      "El beso: timing y señales",
      "Cierre y next-step natural",
    ],
  },
  {
    t: "Atracción Avanzada", sub: "Lo que distingue a un hombre 10",
    icon: Flame, g: ["#22D3EE", "#8B5CF6"],
    lessons: [
      "Tensión sexual sin vulgaridad",
      "Misterio: cuánto contar",
      "Liderazgo en la interacción",
      "Voz, tono y silencios",
      "El cierre seductor",
    ],
  },
  {
    t: "Citas Online", sub: "Apps, fotos y mensajes",
    icon: Compass, g: ["#3B82F6", "#22D3EE"],
    lessons: [
      "Anatomía de un perfil que rompe",
      "Las 6 fotos que sí funcionan",
      "Bio: una línea que importa",
      "De match a número en 4 mensajes",
      "Pasar de chat a cita real",
    ],
  },
];

function Academia() {
  const [open, setOpen] = useState<number | null>(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const k = (m: number, l: number) => `${m}:${l}`;
  const count = (mi: number) => MODULES[mi].lessons.filter((_, li) => done[k(mi, li)]).length;

  return (
    <AppShell title="Academia" subtitle="6 módulos. 30 lecciones para subir de nivel.">
      <div className="space-y-3">
        {MODULES.map((m, mi) => {
          const Icon = m.icon;
          const isOpen = open === mi;
          const c = count(mi);
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
                  <div className="rounded-xl bg-[rgba(8,14,32,0.5)] border border-[rgba(99,160,255,0.15)] divide-y divide-[rgba(99,160,255,0.1)]">
                    {m.lessons.map((l, li) => {
                      const key = k(mi, li);
                      const isDone = !!done[key];
                      return (
                        <button
                          key={li}
                          onClick={() => setDone((s) => ({ ...s, [key]: !s[key] }))}
                          className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-white/5 transition"
                        >
                          {isDone
                            ? <CheckCircle2 className="h-4 w-4 text-[#22D3EE] shrink-0" />
                            : <Circle className="h-4 w-4 text-white/30 shrink-0" />}
                          <span className={`text-[13px] flex-1 ${isDone ? "text-white/50 line-through" : "text-white/90"}`}>
                            {l}
                          </span>
                          <span className="text-[10px] text-[#93C5FD]/60">Lección {li + 1}</span>
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
