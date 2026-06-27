import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { Loader2, Sparkles, MapPin, MessagesSquare, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/date")({
  head: () => ({
    meta: [
      { title: "Date Planner · MAGNETO" },
      {
        name: "description",
        content: "Planificá una cita en 3 fases: Apertura, Conexión y Cierre.",
      },
    ],
  }),
  component: DatePlanner,
});

const INTERESTS = [
  "Arte",
  "Fitness",
  "Música",
  "Viajes",
  "Cine",
  "Naturaleza",
  "Gastronomía",
  "Lectura",
  "Café",
  "Vino",
  "Baile",
  "Fotografía",
  "Tatuajes",
  "Animales",
  "Yoga",
  "Gaming",
  "Series",
  "Moda",
];
const BUDGET = ["Bajo", "Medio", "Alto", "Sin límite"] as const;
const VIBES = [
  "Aventura",
  "Romántica",
  "Relax",
  "Intelectual",
  "Sensual",
  "Divertida",
  "Cultural",
  "Nocturna",
] as const;

type Plan = { fase: string; titulo: string; detalle: string }[];

function DatePlanner() {
  const chat = useServerFn(chatCompletion);
  const [interest, setInterest] = useState<string[]>([]);
  const [budget, setBudget] = useState<(typeof BUDGET)[number]>("Medio");
  const [vibe, setVibe] = useState<(typeof VIBES)[number]>("Aventura");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  const toggle = (i: string) =>
    setInterest((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const run = async () => {
    if (!interest.length) return toast.error("Elegí al menos 1 interés");
    setLoading(true);
    setPlan(null);
    try {
      const res = await chat({
        data: {
          messages: [
            {
              role: "system",
              content:
                "Sos un planificador de citas. Devolvé EXACTAMENTE un JSON: array con 3 objetos {fase, titulo, detalle}. Las fases son: 'Apertura', 'Conexión', 'Cierre'. Detalle ≤180 chars en español neutro masculino, concreto.",
            },
            {
              role: "user",
              content: `Intereses: ${interest.join(", ")}. Presupuesto: ${budget}. Vibra: ${vibe}.`,
            },
          ],
          temperature: 0.8,
        },
      });
      const m = res.content.match(/\[[\s\S]*\]/);
      if (m) setPlan(JSON.parse(m[0]));
      else toast.error("No pude parsear el plan");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Algo falló");
    } finally {
      setLoading(false);
    }
  };

  const icons = [MapPin, MessagesSquare, Heart];

  return (
    <AppShell title="Date Planner" subtitle="3 fases. 0 improvisación.">
      <div className="space-y-4">
        <div className="neon-card rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
            Intereses de ella
          </div>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`px-3 py-1.5 rounded-2xl text-xs transition-all border ${
                  interest.includes(i)
                    ? "grad-cyber text-[#04060a] border-transparent scale-105 neon-glow"
                    : "border-[rgba(0,240,255,0.18)] text-muted-foreground hover:border-[rgba(0,240,255,0.4)]"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="neon-card rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
              Presupuesto
            </div>
            <div className="flex gap-2">
              {BUDGET.map((b) => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`flex-1 px-2 py-1.5 rounded-xl text-xs border ${budget === b ? "grad-cyber text-[#04060a] border-transparent" : "border-[rgba(0,240,255,0.18)] text-muted-foreground"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <div className="neon-card rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
              Vibra
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {VIBES.map((v) => (
                <button
                  key={v}
                  onClick={() => setVibe(v)}
                  className={`px-2 py-1.5 rounded-xl text-xs border ${vibe === v ? "grad-cyber text-[#04060a] border-transparent" : "border-[rgba(0,240,255,0.18)] text-muted-foreground"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={run} disabled={loading} className="btn-cyber w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Diseñando…" : "Generar plan de cita"}
        </button>

        {plan && (
          <div className="relative pl-8 mt-4 animate-fade-in">
            <div
              className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#00F0FF] via-[#0047FF] to-[#4D00FF]"
              style={{ boxShadow: "0 0 12px rgba(0,240,255,0.5)" }}
            />
            {plan.map((p, i) => {
              const Icon = icons[i] ?? MapPin;
              return (
                <div key={i} className="relative mb-4">
                  <div className="absolute -left-[26px] top-1 h-7 w-7 rounded-full grad-cyber flex items-center justify-center neon-glow">
                    <Icon className="h-3.5 w-3.5 text-[#04060a]" strokeWidth={2.5} />
                  </div>
                  <div className="neon-card rounded-2xl p-4">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[#00F0FF]">
                      {p.fase}
                    </div>
                    <div className="font-display text-base mt-1">{p.titulo}</div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {p.detalle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
