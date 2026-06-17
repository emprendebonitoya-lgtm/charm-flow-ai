import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { Heart, Loader2 } from "lucide-react";
import { pushHistory } from "@/lib/storage";

export const Route = createFileRoute("/date")({
  head: () => ({
    meta: [
      { title: "Date · RIZZ.OS" },
      { name: "description", content: "Planificá tu próxima cita: ideas, lugares y plan completo según tu ciudad y presupuesto." },
    ],
  }),
  component: DatePlanner,
});

function DatePlanner() {
  const chat = useServerFn(chatCompletion);
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("medio");
  const [vibe, setVibe] = useState("relajada");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!city) return;
    setLoading(true);
    setOut("");
    const r = await chat({
      data: {
        messages: [
          {
            role: "system",
            content:
              "Sos un planificador de citas creativo. Devolvé un plan de cita en 3 actos (warm-up, principal, cierre) con ideas concretas de lugares/actividades. Markdown limpio, español neutro, sin clichés.",
          },
          {
            role: "user",
            content: `Ciudad: ${city}. Presupuesto: ${budget}. Vibe: ${vibe}. Diseñame un plan único.`,
          },
        ],
        temperature: 0.9,
      },
    });
    setOut(r.content);
    pushHistory({ kind: "date", title: `Cita en ${city}`, body: r.content });
    setLoading(false);
  };

  return (
    <AppShell title="Date" subtitle="Plan de cita en 3 actos, hecho a tu medida.">
      <div className="neon-card rounded-2xl p-4 space-y-3">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ciudad (ej. Buenos Aires)"
          className="w-full bg-input/40 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-input/40 border border-border rounded-xl px-3 py-2 text-sm"
          >
            <option value="bajo">Presupuesto bajo</option>
            <option value="medio">Medio</option>
            <option value="alto">Alto</option>
          </select>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="bg-input/40 border border-border rounded-xl px-3 py-2 text-sm"
          >
            <option value="relajada">Relajada</option>
            <option value="aventura">Aventura</option>
            <option value="romántica">Romántica</option>
            <option value="divertida">Divertida</option>
          </select>
        </div>
        <button
          onClick={run}
          disabled={loading || !city}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium neon-glow"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
          Diseñá mi cita
        </button>
      </div>

      {out && (
        <article className="mt-4 neon-card rounded-2xl p-4 whitespace-pre-wrap text-sm leading-relaxed">
          {out}
        </article>
      )}
    </AppShell>
  );
}
