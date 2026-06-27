import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sun, Sparkles, Dumbbell, Brain, MessageCircleQuestion, Loader2, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/tudia")({
  head: () => ({
    meta: [
      { title: "Tu Día · MAGNETO" },
      {
        name: "description",
        content:
          "Empieza con la mentalidad correcta. Conquista el día. Afirmaciones, ritual y consejo personal.",
      },
    ],
  }),
  component: TuDia,
});

const AFIRMACIONES = [
  "Soy la mejor versión de mí mismo y subo el nivel cada día.",
  "No necesito su validación. Yo soy mi propio premio.",
  "Lo que pienso, lo proyecto. Hoy proyecto confianza.",
  "El rechazo es información, no una herida.",
  "Mi presencia vale más que mis palabras.",
  "Atraigo lo que soy, no lo que quiero.",
  "Hablo lento, miro firme, sonrío real.",
  "Hoy elijo, no espero ser elegido.",
  "Mi calma es mi superpoder.",
  "Cada interacción es una rep que me hace más fuerte.",
];

const MINDSET = [
  { t: "Sos el premio", d: "Dejá de cualificarte. Hacela cualificarse a ella." },
  { t: "Abundancia", d: "Hay más oportunidades de las que podés perseguir." },
  { t: "Frame primero", d: "No defiendas tu marco. Vivilo. Que ella entre al tuyo." },
  { t: "Acción imperfecta", d: "Hacer mal es mejor que pensar perfecto." },
  { t: "Calma > prisa", d: "El que respira, gana. El apurado pierde." },
];

const RITUAL = [
  {
    h: "06:30",
    t: "Despertar sin tocar el celular",
    d: "10 min de silencio antes que el mundo te grite.",
  },
  { h: "06:40", t: "Agua fría · 30 segundos", d: "Resetea el sistema nervioso y mata excusas." },
  { h: "06:50", t: "20 push-ups + 1 min plancha", d: "Cuerpo activado = mente activada." },
  {
    h: "07:00",
    t: "Lee 5 minutos algo útil",
    d: "Subí el nivel mental antes de las notificaciones.",
  },
  { h: "07:10", t: "Visualizá tu día en 60 segundos", d: "Ensayar la versión ganadora de hoy." },
];

function TuDia() {
  const [affirmIndex, setAffirmIndex] = useState(() => new Date().getDate() % AFIRMACIONES.length);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDay = new Date().getDate();
      setAffirmIndex(currentDay % AFIRMACIONES.length);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const afirm = AFIRMACIONES[affirmIndex];
  const changeAfirm = () => setAffirmIndex((prev) => (prev + 1) % AFIRMACIONES.length);

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl neon-card neon-card-strong p-6 mb-5">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div
          className="absolute -top-20 -right-16 h-48 w-48 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(circle, #EC4899 0%, transparent 60%)" }}
        />
        <div
          className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full blur-3xl opacity-50"
          style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 60%)" }}
        />
        <div className="relative">
          <span className="pill inline-flex items-center gap-1">
            <Sun className="h-3 w-3" /> Tu día
          </span>
          <h1 className="mt-3 font-display text-[26px] leading-tight font-bold">
            Empieza con la mentalidad correcta.
            <br />
            <span className="grad-cyber-text">Conquista el día.</span>
          </h1>
        </div>
      </section>

      <Section
        icon={Sparkles}
        title="Afirmación de hoy"
        sub={`Día ${new Date().getDate()} · cambia cada 24 hs`}
      >
        <div className="neon-card rounded-2xl p-5 text-center">
          <p className="font-display text-[18px] leading-snug">"{afirm}"</p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={changeAfirm} className="btn-ghost px-4 py-2">
              Cambiar afirmación
            </button>
            <p className="text-[10.5px] uppercase tracking-[0.25em] text-[#93C5FD]">
              Se renueva según el día o cuando querés un empujón extra.
            </p>
          </div>
        </div>
      </Section>

      <Section icon={Brain} title="Mentalidad ganadora" sub="Los 5 mantras del seductor moderno">
        <div className="grid grid-cols-2 gap-2.5">
          {MINDSET.map((m, i) => (
            <div key={i} className="neon-card rounded-2xl p-3.5">
              <div className="font-display text-[13px] font-semibold">{m.t}</div>
              <div className="text-[11px] text-[#BFDBFE]/70 mt-1 leading-snug">{m.d}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        icon={Dumbbell}
        title="Ritual de la mañana"
        sub="40 minutos que te ponen por delante del 95%"
      >
        <div className="neon-card rounded-2xl overflow-hidden">
          <div className="divide-y divide-[rgba(168,85,247,0.12)]">
            {RITUAL.map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5">
                <div className="h-10 w-12 rounded-lg grad-cyber flex items-center justify-center text-[11px] font-display font-bold text-white shrink-0">
                  {r.h}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[13.5px] font-semibold">{r.t}</div>
                  <div className="text-[11.5px] text-[#BFDBFE]/70 mt-0.5 leading-snug">{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        icon={MessageCircleQuestion}
        title="Consejo personal"
        sub="Contale tu situación, la IA te responde"
      >
        <AskAdvice />
      </Section>
    </AppShell>
  );
}

function Section({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-lg grad-cyber flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <div>
          <div className="font-display text-[14px] font-semibold leading-tight">{title}</div>
          <div className="text-[10.5px] text-[#BFDBFE]/55">{sub}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function AskAdvice() {
  const chat = useServerFn(chatCompletion);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const run = async () => {
    if (!q.trim()) return toast.error("Escribí tu situación");
    setLoading(true);
    setAnswer(null);
    try {
      const res = await chat({
        data: {
          messages: [
            {
              role: "system",
              content:
                "Sos un coach de carisma y seducción para hombres tímidos. Respondé en español neutro, máximo 5 frases, directo, sin clichés, con un consejo concreto y accionable hoy mismo.",
            },
            { role: "user", content: q },
          ],
          temperature: 0.85,
        },
      });
      setAnswer(res.content);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Algo falló");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neon-card rounded-2xl p-4">
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Ej: Llevo 3 días sin saber qué responderle a una chica que me gusta…"
        rows={3}
        className="w-full bg-[rgba(8,14,32,0.55)] border border-[rgba(168,85,247,0.22)] rounded-xl p-3 text-[13px] placeholder:text-white/35 outline-none focus:border-[rgba(236,72,153,0.5)] resize-none"
      />
      <button onClick={run} disabled={loading} className="btn-cyber w-full mt-3">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? "Pensando…" : "Pedir consejo"}
      </button>
      {answer && (
        <div className="mt-3 rounded-xl border border-[rgba(34,211,238,0.3)] bg-[rgba(20,38,92,0.45)] p-3.5 animate-fade-in">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#EC4899] mb-1.5">
            Coach MAGNETO
          </div>
          <p className="text-[13px] leading-relaxed whitespace-pre-line">{answer}</p>
        </div>
      )}
    </div>
  );
}
