import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { getProfile, pushHistory, toggleSaved } from "@/lib/storage";
import { Upload, Sparkles, Bookmark, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/escaner")({
  head: () => ({
    meta: [
      { title: "Escáner · MAGNETO" },
      { name: "description", content: "Subí una foto del perfil o un chat y la IA te entrega 3 aperturas de alto impacto." },
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
  try {
    const m = raw.match(/\[[\s\S]*\]/);
    if (m) {
      const arr = JSON.parse(m[0]);
      if (Array.isArray(arr)) return arr.map(String).slice(0, 3);
    }
  } catch {}
  return raw
    .split("\n")
    .map((l) => l.replace(/^[\s\-\d\.\)]+/, "").trim())
    .filter((l) => l.length > 2)
    .slice(0, 3);
}

const SCAN_STEPS = [
  { at: 500,  text: "🔍 Extrayendo metadatos del perfil..." },
  { at: 1500, text: "🧠 Analizando lenguaje corporal y entorno..." },
  { at: 2500, text: "🔥 Calculando los 3 abridores de alto impacto..." },
];

function Escaner() {
  const chat = useServerFn(chatCompletion);
  const [tone, setTone] = useState<Tone>((getProfile().tone as Tone) ?? "confiado");
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [stepText, setStepText] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Dynamic scanning text loop
  useEffect(() => {
    if (!scanning) return;
    setStepText(SCAN_STEPS[0].text);
    const timers = SCAN_STEPS.map((s) =>
      setTimeout(() => setStepText(s.text), s.at),
    );
    return () => timers.forEach(clearTimeout);
  }, [scanning]);

  const handleFile = async (f: File | null) => {
    if (!f) return;
    if (f.size > 6 * 1024 * 1024) return toast.error("Imagen muy grande (máx 6MB)");
    setImgUrl(await fileToDataUrl(f));
  };

  const run = async () => {
    if (!imgUrl && !text.trim()) return toast.error("Subí una imagen o escribí el mensaje");
    setLoading(true);
    setScanning(true);
    setResults([]);

    // Run scan animation for exactly 3.5s alongside the AI call
    const scanPromise = new Promise<void>((r) => setTimeout(r, 3500));

    try {
      const system = `Sos un coach de carisma y seducción para hombres tímidos. Hablás español neutro masculino, directo, con frame fuerte pero sin ser cringe. Devolvés EXACTAMENTE un array JSON con 3 aperturas listas para enviar al match. Tono solicitado: ${tone}. Cada apertura: ≤140 caracteres, natural, con gancho conversacional. NO expliques nada fuera del JSON.`;
      const userContent: any[] = [];
      if (imgUrl) userContent.push({ type: "image_url", image_url: { url: imgUrl } });
      userContent.push({
        type: "text",
        text:
          (text.trim() ? `Contexto / último mensaje: ${text.trim()}\n` : "") +
          `Devolvé el JSON con 3 opciones en tono ${tone}.`,
      });

      const [out] = await Promise.all([
        chat({
          data: {
            messages: [
              { role: "system", content: system },
              { role: "user", content: userContent },
            ],
            temperature: 1,
          },
        }),
        scanPromise,
      ]);

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
      setScanning(false);
      setLoading(false);
    }
  };

  return (
    <AppShell title="Escáner" subtitle="Subí foto del perfil o último mensaje. 3 aperturas de alto impacto.">
      <div className="space-y-4">
        {/* Tono */}
        <div className="neon-card rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-3">Tono</div>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3.5 py-1.5 rounded-2xl text-sm transition-all border ${
                  tone === t
                    ? "grad-cyber text-[#04060a] border-transparent neon-glow scale-105"
                    : "border-[rgba(0,240,255,0.18)] text-muted-foreground hover:text-foreground hover:border-[rgba(0,240,255,0.4)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Subida + scanner frame */}
        <div className="neon-card rounded-2xl p-4">
          <div className="scan-frame border border-[rgba(0,240,255,0.18)]">
            <label
              onClick={() => !scanning && fileRef.current?.click()}
              className={`relative block cursor-pointer ${scanning ? "pointer-events-none" : ""}`}
            >
              {imgUrl ? (
                <img src={imgUrl} alt="perfil" className="w-full max-h-72 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-14 bg-[rgba(0,240,255,0.03)]">
                  <div className="h-12 w-12 rounded-2xl grad-cyber flex items-center justify-center neon-glow">
                    <Upload className="h-5 w-5 text-[#04060a]" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Subí la foto o screenshot</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Instagram · Tinder · Bumble · PNG/JPG · 6MB</div>
                  </div>
                </div>
              )}
              {scanning && <div className={`scan-beam ${!loading ? "scan-fade" : ""}`} />}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Opcional: pegá su bio o el último mensaje…"
            disabled={scanning}
            className="mt-3 w-full bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.15)] rounded-2xl p-3 text-sm outline-none focus:border-[rgba(0,240,255,0.5)] focus:ring-2 focus:ring-[rgba(0,240,255,0.25)] min-h-[88px]"
          />
          <button onClick={run} disabled={loading} className="btn-cyber mt-3 w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Escaneando…" : "Escanear perfil"}
          </button>

          {scanning && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#00F0FF]" />
              <div className="text-xs text-[#00F0FF] blink-soft text-center min-h-[1.2em]">
                {stepText}
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-3 animate-fade-in">
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
  const [glow, setGlow] = useState(false);
  return (
    <div className="neon-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="pill">Opción {idx + 1}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              setGlow(true);
              setTimeout(() => setGlow(false), 600);
              toast.success("Copiado");
            }}
            className={`p-2 rounded-xl transition-all ${glow ? "neon-glow bg-[rgba(0,240,255,0.18)]" : "hover:bg-[rgba(0,240,255,0.08)]"}`}
            aria-label="Copiar"
          >
            <Copy className="h-4 w-4 text-[#00F0FF]" />
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
            className="p-2 rounded-xl hover:bg-[rgba(0,240,255,0.08)]"
            aria-label="Guardar"
          >
            <Bookmark className="h-4 w-4 text-[#00F0FF]" />
          </button>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed">{text}</p>
    </div>
  );
}
