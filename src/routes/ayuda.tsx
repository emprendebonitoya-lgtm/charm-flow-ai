import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/ayuda")({
  head: () => ({
    meta: [
      { title: "Asistente · MAGNETO" },
      { name: "description", content: "Consultá al asistente de carisma para preguntas, mensajes y estrategias de perfil." },
    ],
  }),
  component: Asistente,
});

type ChatMessage = { role: "user" | "assistant"; content: string };

function Asistente() {
  const chat = useServerFn(chatCompletion);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Soy tu asistente de carisma. Contame qué necesitás: apertura, rescate, perfil o cómo responderle, y te doy una respuesta práctica.",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setText("");
    setLoading(true);

    try {
      const res = await chat({
        data: {
          messages: [
            {
              role: "system",
              content:
                "Sos un asistente experto en carisma masculino, mensajes y citas. Respondé en español claro, con recomendaciones concretas, frases accionables y enfoque de alta confianza. Evitá consejos vagos.",
            },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.9,
        },
      });
      setMessages((current) => [...current, { role: "assistant", content: res.content.trim() }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Algo falló");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Asistente" subtitle="Consultá al coach para mensajes, apertura y estrategia rápida.">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-[rgba(15,23,42,0.88)] p-4 shadow-[0_30px_90px_-50px_rgba(99,102,241,0.22)]">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-3xl bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.28em] text-[#cbd5e1]/70">Asistente IA</div>
              <div className="text-base font-semibold text-white">Tu coach instantáneo de carisma</div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 text-sm leading-7 text-slate-200">
            Hacé una pregunta concreta y te doy una respuesta que puedas usar ahora: frase de apertura, rescate de chat, cómo responder un mensaje difícil o sugerencias de perfil.
          </div>
        </div>

        <div className="neon-card rounded-3xl p-4 min-h-[320px] space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-fuchsia-500/30 to-violet-500/20 text-white border border-fuchsia-500/20"
                    : "bg-[rgba(255,255,255,0.06)] border border-white/10 text-slate-100"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-3xl bg-[rgba(255,255,255,0.08)] px-4 py-3 text-sm text-slate-200">
                <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Escribí tu pregunta al asistente..."
            className="flex-1 rounded-3xl border border-white/10 bg-[rgba(15,23,42,0.8)] px-4 py-3 text-sm text-white outline-none transition focus:border-fuchsia-400/60"
          />
          <button
            onClick={send}
            disabled={loading || !text.trim()}
            className="btn-cyber shrink-0 px-5 py-3"
          >
            <Send className="h-4 w-4" />
            Enviar
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4 text-sm text-slate-300">
          Consejo rápido: preguntá con contexto breve. Ej: "Necesito una apertura para Tinder basada en mi perfil de foto con café" o "Cómo respondo si me dice 'estoy ocupada'?".
        </div>
      </div>
    </AppShell>
  );
}
