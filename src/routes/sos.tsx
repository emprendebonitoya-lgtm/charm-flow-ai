import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { Upload, LifeBuoy, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "Salvavidas · MAGNETO" },
      { name: "description", content: "Rescatá un chat enfriado. Subí el screenshot y obtené 2 respuestas de alto impacto." },
    ],
  }),
  component: Salvavidas,
});

function fileToDataUrl(f: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}

function parseTwo(raw: string): string[] {
  try {
    const m = raw.match(/\[[\s\S]*\]/);
    if (m) {
      const arr = JSON.parse(m[0]);
      if (Array.isArray(arr)) return arr.map(String).slice(0, 2);
    }
  } catch {}
  return raw.split("\n").map((l) => l.replace(/^[\s\-\d\.\)]+/, "").trim()).filter(Boolean).slice(0, 2);
}

function Salvavidas() {
  const chat = useServerFn(chatCompletion);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [ctx, setCtx] = useState("");
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 6 * 1024 * 1024) return toast.error("Imagen muy grande (máx 6MB)");
    setImgUrl(await fileToDataUrl(f));
  };

  const run = async () => {
    if (!imgUrl && !ctx.trim()) return toast.error("Subí el chat o describilo");
    setLoading(true);
    setOut([]);
    try {
      const system = `Sos un coach de carisma masculino. El usuario tiene un chat enfriado o una objeción. Devolvé EXACTAMENTE un array JSON con 2 respuestas de rescate, breves (≤140 chars), con frame fuerte, curiosidad o humor. NO expliques nada fuera del JSON.`;
      const userContent: any[] = [];
      if (imgUrl) userContent.push({ type: "image_url", image_url: { url: imgUrl } });
      userContent.push({ type: "text", text: ctx ? `Contexto: ${ctx}` : "Sugerí 2 rescates." });
      const res = await chat({
        data: { messages: [{ role: "system", content: system }, { role: "user", content: userContent }], temperature: 1 },
      });
      setOut(parseTwo(res.content));
    } catch (e: any) {
      toast.error(e?.message ?? "Algo falló");
    } finally { setLoading(false); }
  };

  return (
    <AppShell title="Salvavidas" subtitle="Chat enfriado u objeción → 2 rescates al instante.">
      <div className="space-y-4">
        <div className="neon-card rounded-2xl p-4">
          <label
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer block scan-frame border border-dashed border-[rgba(0,240,255,0.25)] hover:border-[rgba(0,240,255,0.6)] transition"
          >
            {imgUrl ? (
              <img src={imgUrl} alt="chat" className="w-full max-h-60 object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 py-10 bg-[rgba(0,240,255,0.03)]">
                <div className="h-11 w-11 rounded-2xl grad-cyber flex items-center justify-center neon-glow">
                  <Upload className="h-5 w-5 text-[#04060a]" />
                </div>
                <div className="text-sm font-medium">Subir screenshot del chat</div>
                <div className="text-[11px] text-muted-foreground">Cristal esmerilado · seguro y local</div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
          </label>

          <textarea
            value={ctx}
            onChange={(e) => setCtx(e.target.value)}
            placeholder="Opcional: contame qué pasó (te dejó en visto, te dijo 'tengo novio', etc.)"
            className="mt-3 w-full bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.15)] rounded-2xl p-3 text-sm outline-none focus:border-[rgba(0,240,255,0.5)] min-h-[80px]"
          />
          <button onClick={run} disabled={loading} className="btn-cyber mt-3 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LifeBuoy className="h-4 w-4" />}
            {loading ? "Rescatando…" : "Generar rescate"}
          </button>
        </div>

        {out.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            {out.map((t, i) => <ChatBubble key={i} idx={i} text={t} />)}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ChatBubble({ idx, text }: { idx: number; text: string }) {
  const [glow, setGlow] = useState(false);
  return (
    <div className="neon-card rounded-2xl p-4 relative">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="pill">Rescate {idx + 1}</span>
          <p className="mt-2 text-[15px] leading-relaxed">{text}</p>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            setGlow(true); setTimeout(() => setGlow(false), 600);
            toast.success("Copiado");
          }}
          className={`shrink-0 p-2 rounded-xl transition-all ${glow ? "neon-glow bg-[rgba(0,240,255,0.18)]" : "hover:bg-[rgba(0,240,255,0.08)]"}`}
        >
          <Copy className="h-4 w-4 text-[#00F0FF]" />
        </button>
      </div>
    </div>
  );
}
