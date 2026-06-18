import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import {
  Send, Loader2, RotateCcw, Sparkles, Flame, BookOpen, Crown, Heart,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sim")({
  head: () => ({
    meta: [
      { title: "Simulador · MAGNETO" },
      { name: "description", content: "Entrená chats con 4 personalidades. La IA reacciona con interés, vibras y testeo real." },
    ],
  }),
  component: Sim,
});

const PERSONAS = [
  {
    id: "timida", label: "Valentina", age: 24, vibe: "Tímida",
    icon: Sparkles, color: "#60A5FA",
    prompt: "Sos Valentina, 24 años, tímida e introvertida pero curiosa y con humor seco cuando agarrás confianza. Te encanta el café de especialidad, los libros de no-ficción y los planes tranquilos. Respondés corto al principio (1-2 frases, emojis raros) y empezás a soltarte cuando el chico te pregunta cosas reales y no clichés. Si te tira un opener flojo, respondés con un 'jaja' seco. Si te interesa, dejás caer indirectas sutiles."
  },
  {
    id: "fiestera", label: "Mía", age: 23, vibe: "Fiestera",
    icon: Flame, color: "#F472B6",
    prompt: "Sos Mía, 23, súper extrovertida y fiestera. Vivís de noche, vas a fiestas electrónicas, te encantan los road trips. Hablás con MUCHA energía, emojis, exageraciones, retás bromas, sos juguetona. Te enganchás con tipos con frame, humor rápido y que te sigan el ritmo. Si el chico es aburrido o nice guy, le tirás onda y te vas. Si te gusta, sos directa: '¿qué hacés esta noche?'."
  },
  {
    id: "intelectual", label: "Lucía", age: 27, vibe: "Intelectual",
    icon: BookOpen, color: "#A78BFA",
    prompt: "Sos Lucía, 27, arquitecta. Lectora compulsiva, te interesa filosofía, cine de autor, viajes a lugares raros. Respondés con preguntas profundas y un toque irónico. Te aburren los clichés y los 'hola, ¿cómo estás?'. Si el chico engancha con una idea o referencia interesante, te encendés y profundizás. Sos selectiva pero cálida con quien te estimula la cabeza."
  },
  {
    id: "dificil", label: "Camila", age: 26, vibe: "Difícil",
    icon: Crown, color: "#FBBF24",
    prompt: "Sos Camila, 26, modelo freelance. Tenés MUCHAS opciones y lo sabés. Testeás constantemente: respondés frío, tardás, tirás shit tests ('¿y vos qué tenés de especial?'). Te ablandás SOLO si el chico mantiene el frame, no se cae, responde con humor o ignora el test. Si demuestra valor, sos súper cálida y picante. Si tiembla, lo descartás."
  },
] as const;
type PersonaId = (typeof PERSONAS)[number]["id"];

type Msg = { role: "user" | "assistant"; content: string };

function Sim() {
  const chat = useServerFn(chatCompletion);
  const [persona, setPersona] = useState<PersonaId | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ score: number; tips: string[]; interest: number } | null>(null);

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
            { role: "system", content: `${p.prompt} Estás chateando por DM con un chico que te escribió. Respondé en 1-2 frases (a veces 3 si te enganchás), español neutro, manteniéndote 100% en personaje, con vibras coherentes a tu personalidad. Mostrás interés gradual: empezás neutra, te encendés si te sorprende, te enfriás si es flojo. Podés usar emojis ocasionales propios de tu vibra.` },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.95,
        },
      });
      const reply = res.content.trim();
      const after: Msg[] = [...next, { role: "assistant", content: reply }];
      setMsgs(after);

      if (after.filter((m) => m.role === "user").length >= 5) {
        const fb = await chat({
          data: {
            messages: [
              { role: "system", content: "Sos un coach de carisma. Analizá el chat del usuario (rol 'user') vs la chica (rol 'assistant'). Devolvé EXACTAMENTE un JSON: {\"score\": número 1-10 (calidad del chico), \"interest\": número 1-10 (cuánto interés mostró ella), \"tips\": [3 consejos cortos en español para mejorar]}. Nada fuera del JSON." },
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
      <AppShell title="Simulador" subtitle="Elegí una personalidad y entrená 5 mensajes reales.">
        <div className="grid grid-cols-2 gap-3">
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            return (
              <button key={p.id} onClick={() => start(p.id)}
                className="neon-card neon-card-strong rounded-2xl p-5 text-left transition-all hover:-translate-y-0.5 hover:neon-glow group">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, #1D4ED8)`,
                    boxShadow: `0 0 24px ${p.color}55`,
                  }}
                >
                  <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                </div>
                <div className="font-display text-lg">{p.label}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#BFDBFE]/60 mt-0.5">
                  {p.age} · {p.vibe}
                </div>
                <div className="text-[11px] text-[#BFDBFE]/70 mt-2 leading-snug line-clamp-3">
                  {p.prompt.split(".").slice(1, 3).join(".")}
                </div>
              </button>
            );
          })}
        </div>
      </AppShell>
    );
  }

  const current = PERSONAS.find((x) => x.id === persona)!;
  const Icon = current.icon;

  return (
    <AppShell
      title={`Sim · ${current.label}`}
      subtitle={`${current.vibe} · ${userTurns}/5 mensajes`}
    >
      <div className="space-y-3">
        {/* Header de la persona */}
        <div className="neon-card neon-card-strong rounded-2xl p-3 flex items-center gap-3">
          <div
            className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background: `linear-gradient(135deg, ${current.color}, #1D4ED8)`,
              boxShadow: `0 0 18px ${current.color}55`,
            }}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{current.label}, {current.age}</div>
            <div className="text-[11px] text-[#BFDBFE]/70">{current.vibe} · online ahora</div>
          </div>
          <button onClick={() => setPersona(null)} className="btn-ghost !py-2 !px-3">
            Cambiar
          </button>
        </div>

        {/* Chat */}
        <div className="neon-card rounded-2xl p-4 min-h-[340px] space-y-2.5">
          {msgs.length === 0 && (
            <div className="text-center text-[#BFDBFE]/60 text-sm py-12">
              Iniciá vos. Mandale el primer mensaje a {current.label}.
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
                  m.role === "user"
                    ? "bg-[rgba(59,130,246,0.25)] border border-[rgba(99,160,255,0.35)] text-white"
                    : "text-white"
                }`}
                style={m.role === "assistant"
                  ? { background: `linear-gradient(135deg, ${current.color}33, rgba(29,78,216,0.4))`, border: `1px solid ${current.color}55` }
                  : undefined}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-2xl bg-[rgba(59,130,246,0.15)]">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#93C5FD]" />
              </div>
            </div>
          )}
        </div>

        {!locked && (
          <div className="flex gap-2">
            <input
              value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Escribile a ${current.label}…`}
              className="flex-1 bg-[rgba(15,25,55,0.6)] border border-[rgba(99,160,255,0.2)] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[rgba(99,160,255,0.5)]"
            />
            <button onClick={send} disabled={loading || !text.trim()} className="btn-cyber !px-4">
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}

        {feedback && <FeedbackCard fb={feedback} onReset={() => start(persona)} />}
        {locked && !feedback && (
          <div className="text-center text-xs text-[#BFDBFE]/70 flex items-center justify-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" /> Calculando feedback…
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FeedbackCard({
  fb, onReset,
}: { fb: { score: number; tips: string[]; interest: number }; onReset: () => void }) {
  const pct = Math.max(0, Math.min(100, fb.score * 10));
  const ipct = Math.max(0, Math.min(100, (fb.interest ?? 5) * 10));
  const R = 38; const C = 2 * Math.PI * R;
  return (
    <div className="neon-card neon-card-strong rounded-3xl p-5 animate-fade-in">
      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
            <circle cx="50" cy="50" r={R} stroke="url(#g)" strokeWidth="6" fill="none"
              strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C}
              style={{ filter: "drop-shadow(0 0 8px #3B82F6)" }} />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-display font-bold grad-cyber-text">{fb.score}</div>
            <div className="text-[9px] uppercase tracking-widest text-[#BFDBFE]/70">/10</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#BFDBFE]/70">Feedback</div>
          <div className="font-display text-lg mb-2">Análisis de tu chat</div>
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-pink-300" />
            <span className="text-xs text-[#BFDBFE]/80">Interés de ella</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${ipct}%`, background: "linear-gradient(90deg, #F472B6, #EC4899)" }}
            />
          </div>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {fb.tips.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="text-[#60A5FA] font-bold">·</span>
            <span className="text-white/90">{t}</span>
          </li>
        ))}
      </ul>
      <button onClick={onReset} className="mt-4 inline-flex items-center gap-2 text-sm text-[#93C5FD] hover:underline">
        <RotateCcw className="h-4 w-4" /> Reintentar
      </button>
    </div>
  );
}
