import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { Send, Loader2, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/sim")({
  head: () => ({
    meta: [
      { title: "Sim · RIZZ.OS" },
      { name: "description", content: "Practicá conversaciones con un crush IA configurable. Ganá confianza sin riesgo." },
    ],
  }),
  component: Sim,
});

const PERSONAS = [
  { id: "valentina", name: "Valentina", desc: "23, artista, sarcástica" },
  { id: "lucas", name: "Lucas", desc: "27, gym, directo" },
  { id: "mia", name: "Mía", desc: "21, viajera, curiosa" },
];

type Msg = { role: "user" | "assistant"; content: string };

function Sim() {
  const chat = useServerFn(chatCompletion);
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Hola, soy ${PERSONAS[0].name}. ¿Qué onda?` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = (p = persona) => {
    setPersona(p);
    setMessages([{ role: "assistant", content: `Hola, soy ${p.name}. ¿Qué onda?` }]);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const r = await chat({
        data: {
          messages: [
            {
              role: "system",
              content: `Estás roleando como ${persona.name} (${persona.desc}). Sos un match de app de citas. Respondé corto (≤140 chars), natural, con personalidad. Si la otra persona la rompe, mostrá interés. Si es plana, mostrá poco interés. Español rioplatense neutro. No salgas del personaje.`,
            },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 1,
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: r.content.trim() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Sim" subtitle="Practicá sin miedo a quemar matches reales.">
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {PERSONAS.map((p) => (
          <button
            key={p.id}
            onClick={() => reset(p)}
            className={`shrink-0 neon-card rounded-xl px-3 py-2 text-left ${
              persona.id === p.id ? "neon-glow border-primary" : ""
            }`}
          >
            <div className="text-sm font-medium">{p.name}</div>
            <div className="text-[11px] text-muted-foreground">{p.desc}</div>
          </button>
        ))}
        <button
          onClick={() => reset()}
          className="shrink-0 neon-card rounded-xl px-3 py-2 flex items-center gap-2 text-sm"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>

      <div className="neon-card rounded-2xl p-3 min-h-[50vh] flex flex-col">
        <div className="flex-1 space-y-2 overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="bg-secondary text-muted-foreground text-sm px-3 py-2 rounded-2xl w-fit">
              escribiendo…
            </div>
          )}
        </div>
        <div className="flex gap-2 pt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={`Mensaje a ${persona.name}…`}
            className="flex-1 bg-input/40 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/60"
          />
          <button
            onClick={send}
            disabled={loading}
            className="px-4 rounded-xl bg-primary text-primary-foreground neon-glow"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </AppShell>
  );
}
