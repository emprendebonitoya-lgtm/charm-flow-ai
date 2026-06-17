import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { getProfile, pushHistory, toggleSaved } from "@/lib/storage";
import { Upload, Sparkles, Bookmark, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/escaner")({
  head: () => ({
    meta: [
      { title: "Escáner · RIZZ.OS" },
      { name: "description", content: "Subí un screenshot de tu chat y obtené 3 respuestas con rizz personalizadas." },
    ],
  }),
  component: Escaner,
});

const TONES = ["coqueto", "gracioso", "confiado", "tierno"] as const;
type Tone = (typeof TONES)[number];

function fileToDataUrl(f: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}

function parseSuggestions(raw: string): string[] {
  // try JSON first
  try {
    const m = raw.match(/\[[\s\S]*\]/);
    if (m) {
      const arr = JSON.parse(m[0]);
      if (Array.isArray(arr)) return arr.map(String).slice(0, 3);
    }
  } catch {}
  // fallback: split by lines starting with number or dash
  return raw
    .split("\n")
    .map((l) => l.replace(/^[\s\-\d\.\)]+/, "").trim())
    .filter((l) => l.length > 2)
    .slice(0, 3);
}

function Escaner() {
  const chat = useServerFn(chatCompletion);
  const [tone, setTone] = useState<Tone>((getProfile().tone as Tone) ?? "coqueto");
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 6 * 1024 * 1024) return toast.error("Imagen muy grande (máx 6MB)");
    setImgUrl(await fileToDataUrl(f));
  };

  const run = async () => {
    if (!imgUrl && !text.trim()) return toast.error("Subí una imagen o escribí el mensaje");
    setLoading(true);
    setResults([]);
    try {
      const system = `Sos un coach de citas con humor y carisma, estilo Rizz/Plug AI. Hablás español rioplatense neutro. Devolvés EXACTAMENTE un array JSON con 3 respuestas listas para enviar al match. Sin emojis excesivos. Tono solicitado: ${tone}. Las respuestas deben ser cortas (≤140 caracteres), naturales, con gancho conversacional. NO expliques nada fuera del JSON.`;
      const userContent: any[] = [];
      if (imgUrl)
        userContent.push({ type: "image_url", image_url: { url: imgUrl } });
      userContent.push({
        type: "text",
        text:
          (text.trim() ? `Contexto / último mensaje: ${text.trim()}\n` : "") +
          `Devolvé el JSON con 3 opciones en tono ${tone}.`,
      });

      const out = await chat({
        data: {
          messages: [
            { role: "system", content: system },
            { role: "user", content: userContent },
          ],
          temperature: 1,
        },
      });
      const sugs = parseSuggestions(out.content);
      setResults(sugs);
      if (sugs.length) {
        pushHistory({
          kind: "escaner",
          title: `Escáner · ${tone}`,
          body: sugs.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        });
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Algo falló");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Escáner" subtitle="Subí el chat o pegá el último mensaje. Devolvemos 3 respuestas.">
      <div className="space-y-4">
        <div className="neon-card rounded-2xl p-4">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Tono</div>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-full text-sm transition border ${
                  tone === t
                    ? "bg-primary text-primary-foreground border-primary neon-glow"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="neon-card rounded-2xl p-4">
          <label
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer flex items-center gap-3 p-4 rounded-xl border border-dashed border-border hover:border-primary/60 transition"
          >
            {imgUrl ? (
              <img src={imgUrl} alt="screenshot" className="h-20 w-20 object-cover rounded-lg" />
            ) : (
              <Upload className="h-6 w-6 text-primary" />
            )}
            <div className="text-sm">
              <div className="font-medium">{imgUrl ? "Cambiar screenshot" : "Subir screenshot del chat"}</div>
              <div className="text-xs text-muted-foreground">PNG / JPG · máx 6MB</div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="O pegá acá el último mensaje que te enviaron…"
            className="mt-3 w-full bg-input/40 border border-border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/60 min-h-[88px]"
          />
          <button
            onClick={run}
            disabled={loading}
            className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium neon-glow disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generando…" : "Generar respuestas"}
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((r, i) => (
              <ResultCard key={i} idx={i} text={r} tone={tone} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ResultCard({ idx, text, tone }: { idx: number; text: string; tone: string }) {
  return (
    <div className="neon-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="pill">Opción {idx + 1}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              toast.success("Copiado");
            }}
            className="p-2 rounded-lg hover:bg-primary/10"
            aria-label="Copiar"
          >
            <Copy className="h-4 w-4 text-primary" />
          </button>
          <button
            onClick={() => {
              toggleSaved({
                id: crypto.randomUUID(),
                kind: "escaner",
                title: `Escáner · ${tone}`,
                body: text,
                createdAt: Date.now(),
              });
              toast.success("Guardado");
            }}
            className="p-2 rounded-lg hover:bg-primary/10"
            aria-label="Guardar"
          >
            <Bookmark className="h-4 w-4 text-primary" />
          </button>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed">{text}</p>
    </div>
  );
}
