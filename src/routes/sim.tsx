import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { Send, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sim")({
  head: () => ({
    meta: [
      { title: "Simulador · MAGNETO" },
      { name: "description", content: "Entrená chats con 4 personalidades. 5 mensajes y recibís feedback con nota y consejos." },
    ],
  }),
  component: Sim,
});

const PERSONAS = [
  { id: "timida",      label: "Tímida",      icon: "🤫", prompt: "Sos Valentina, 24, tímida e introvertida. Respondés corto, te cuesta abrirte. Si el otro es interesante y respetuoso, te soltás de a poco." },
  { id: "fiestera",    label: "Fiestera",    icon: "🔥", prompt: "Sos Mía, 23, fiestera y outgoing. Hablás con energía, emojis, retás bromas. Te gustan los hombres con frame y humor." },
  { id: "intelectual", label: "Intelectual", icon: "🧠", prompt: "Sos Lucía, 27, intelectual. Respondés con preguntas profundas, citas y reflexión. Te aburren los clichés." },
  { id: "dificil",     label: "Difícil",     icon: "👑", prompt: "Sos Camila, 26, difícil. Testeás constantemente. Sos directa, fría al principio, te ablandás solo si demuestra valor." },
] as const;
type PersonaId = (typeof PERSONAS)[number]["id"];

type Msg = { role: "user" | "assistant"; content: string };

function Sim() {
  const chat = useServerFn(chatCompletion);
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; tips: string[] } | null>(null);

  const userTurns = msgs.filter((m) => m.role === "user").length;
  const locked = userTurns >= 5;

  const start = (id: PersonaId) => { setPersona(id); setMsgs([]); setFeedback(null); };

  const send = async () => {
    if (!text.trim() || !persona || locked) return;
    const p = PERSONAS.find((x) => x.id === persona)!;
    const next: Msg[] = [...msgs, { role: "user", content: text.trim() }];
    setMsgs(next); setText(""); setLoading(true);
    try {
      const res = await chat({
        data: {
          messages: [
            { role: "system", content: `${p.prompt} Estás chateando por DM con un chico que te escribió. Respondé en 1-2 frases, español neutro, manteniéndote en personaje.` },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.9,
        },
      });
      const reply = res.content.trim();
      const after: Msg[] = [...next, { role: "assistant", content: reply }];
      setMsgs(after);

      if (after.filter((m) => m.role === "user").length >= 5) {
        // Trigger feedback
        const fb = await chat({
          data: {
            messages: [
              { role: "system", content: "Sos un coach de carisma. Analizá el chat del usuario (rol 'user') y devolvé EXACTAMENTE un JSON: {\"score\": número 1-10, \"tips\": [3 consejos cortos en español]}. Nada fuera del JSON." },
              { role: "user", content: JSON.stringify(after) },
            ],
            temperature: 0.4,
          },
        });
        try {
          const m = fb.content.match(/\{[\s\S]*\}/);
          if (m) setFeedback(JSON.parse(m[0]));
        } catch { /* ignore */ }
      }
    } catch (e: any) { toast.error(e?.message ?? "Algo falló"); }
    finally { setLoading(false); }
  };

  if (!persona) {
    return (
      <AppShell title="Simulador" subtitle="Elegí una personalidad y entrená 5 mensajes.">
        <div className="grid grid-cols-2 gap-3">
          {PERSONAS.map((p) => (
            <button key={p.id} onClick={() => start(p.id)}
              className="neon-card rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 hover:neon-glow">
              <div className="text-3xl">{p.icon}</div>
              <div className="font-display text-lg mt-2">{p.label}</div>
              <div className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-3">{p.prompt.split(".")[1]}</div>
            </button>
          ))}
        </div>
      </AppShell>
    );
  }

  const current = PERSONAS.find((x) => x.id === persona)!;

  return (
    <AppShell title={`Sim · ${current.label} ${current.icon}`} subtitle={`${userTurns}/5 mensajes`}>
      <div className="space-y-3">
        <div className="neon-card rounded-2xl p-4 min-h-[320px] space-y-2.5">
          {msgs.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-12">Iniciá vos. Mandale el primer mensaje.</div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)]"
                    : "text-[#04060a]"
                }`}
                style={m.role === "assistant" ? { background: "linear-gradient(135deg, #00F0FF 0%, #4D8DFF 100%)" } : undefined}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-start"><div className="px-3 py-2 rounded-2xl bg-white/5"><Loader2 className="h-3.5 w-3.5 animate-spin text-[#00F0FF]" /></div></div>}
        </div>

        {!locked && (
          <div className="flex gap-2">
            <input
              value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribí tu mensaje…"
              className="flex-1 bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.15)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[rgba(0,240,255,0.5)]"
            />
            <button onClick={send} disabled={loading || !text.trim()} className="btn-cyber !px-4">
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}

        {feedback && <FeedbackCard score={feedback.score} tips={feedback.tips} onReset={() => start(persona)} />}
        {locked && !feedback && <div className="text-center text-xs text-muted-foreground">Calculando feedback…</div>}
      </div>
    </AppShell>
  );
}

function FeedbackCard({ score, tips, onReset }: { score: number; tips: string[]; onReset: () => void }) {
  const pct = Math.max(0, Math.min(100, score * 10));
  const R = 38; const C = 2 * Math.PI * R;
  return (
    <div className="neon-card rounded-3xl p-5 animate-fade-in">
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r={R} stroke="url(#g)" strokeWidth="6" fill="none"
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C}
              style={{ filter: "drop-shadow(0 0 8px #00F0FF)" }} />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="100%" stopColor="#4D00FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-display font-bold grad-cyber-text">{score}</div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">/10</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Feedback</div>
          <div className="font-display text-lg">Análisis de tu chat</div>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {tips.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="text-[#00F0FF] font-bold">·</span>
            <span className="text-foreground/90">{t}</span>
          </li>
        ))}
      </ul>
      <button onClick={onReset} className="mt-4 inline-flex items-center gap-2 text-sm text-[#00F0FF] hover:underline">
        <RotateCcw className="h-4 w-4" /> Reintentar
      </button>
    </div>
  );
}
