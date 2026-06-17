import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { pushHistory } from "@/lib/storage";
import { Siren, Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "SOS · RIZZ.OS" },
      { name: "description", content: "Rescate de conversación: pegá el último mensaje y recibí una respuesta perfecta al instante." },
    ],
  }),
  component: SOS,
});

function SOS() {
  const chat = useServerFn(chatCompletion);
  const [msg, setMsg] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!msg.trim()) return toast.error("Pegá el mensaje primero");
    setLoading(true);
    setOut("");
    try {
      const r = await chat({
        data: {
          messages: [
            {
              role: "system",
              content:
                "Sos un coach de citas experto. Devolvé UNA sola respuesta breve (≤160 chars), natural, con personalidad, lista para copiar y enviar. Español neutro. Nada de explicaciones.",
            },
            { role: "user", content: `Mensaje recibido: "${msg.trim()}". Respondé como si fueras yo.` },
          ],
          temperature: 0.95,
        },
      });
      setOut(r.content.trim().replace(/^["']|["']$/g, ""));
      pushHistory({ kind: "sos", title: "SOS", body: r.content });
    } catch (e: any) {
      toast.error(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="SOS" subtitle="Modo rescate. Una respuesta, ahora.">
      <div className="neon-card rounded-2xl p-4">
        <Siren className="h-6 w-6 text-accent mb-2" />
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Pegá el último mensaje que te enviaron…"
          className="w-full bg-input/40 border border-border rounded-xl p-3 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-primary/60"
        />
        <button
          onClick={run}
          disabled={loading}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-accent-foreground font-medium"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Siren className="h-4 w-4" />}
          Rescatame
        </button>
      </div>

      {out && (
        <div className="mt-4 neon-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="pill">Respuesta</span>
            <button
              onClick={() => { navigator.clipboard.writeText(out); toast.success("Copiado"); }}
              className="p-2 rounded-lg hover:bg-primary/10"
            >
              <Copy className="h-4 w-4 text-primary" />
            </button>
          </div>
          <p className="text-[15px] leading-relaxed">{out}</p>
        </div>
      )}
    </AppShell>
  );
}
