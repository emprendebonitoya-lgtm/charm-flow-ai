import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { getProfile, pushHistory, toggleSaved } from "@/lib/storage";
import {
  Upload, Sparkles, Bookmark, Copy, Loader2, RotateCcw, Crop, X,
  Instagram, MessageCircle, Heart, Camera,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/escaner")({
  head: () => ({
    meta: [
      { title: "Escáner · MAGNETO" },
      { name: "description", content: "Subí una foto del perfil y obtené 5 aperturas de alto impacto." },
    ],
  }),
  component: Escaner,
});

const TONES = ["ingenioso", "casual", "atrevido", "coqueto", "confiado", "tierno"] as const;
type Tone = (typeof TONES)[number];

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tinder",    label: "Tinder",    icon: Heart },
  { id: "bumble",    label: "Bumble",    icon: Heart },
  { id: "whatsapp",  label: "WhatsApp",  icon: MessageCircle },
  { id: "tiktok",    label: "TikTok",    icon: Camera },
  { id: "otra",      label: "Otra",      icon: Camera },
] as const;
type PlatformId = (typeof PLATFORMS)[number]["id"];

function fileToDataUrl(f: File) {
  return new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(f);
  });
}

function parseSuggestions(raw: string, max = 5): string[] {
  try {
    const m = raw.match(/\[[\s\S]*\]/);
    if (m) {
      const arr = JSON.parse(m[0]);
      if (Array.isArray(arr)) return arr.map(String).slice(0, max);
    }
  } catch {}
  return raw
    .split("\n")
    .map((l) => l.replace(/^[\s\-\d\.\)]+/, "").trim())
    .filter((l) => l.length > 2)
    .slice(0, max);
}

const SCAN_STEPS = [
  { at: 400,  text: "🔍 Extrayendo metadatos del perfil..." },
  { at: 1400, text: "🧠 Analizando lenguaje corporal y entorno..." },
  { at: 2400, text: "💬 Detectando intereses y vibra..." },
  { at: 3200, text: "🔥 Calculando 5 abridores de alto impacto..." },
];

function Escaner() {
  const chat = useServerFn(chatCompletion);
  const [tone, setTone] = useState<Tone>((getProfile().tone as Tone) ?? "ingenioso");
  const [platform, setPlatform] = useState<PlatformId>("instagram");
  const [text, setText] = useState("");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [stepText, setStepText] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [objectFit, setObjectFit] = useState<"cover" | "contain">("cover");
  const fileRef = useRef<HTMLInputElement>(null);

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
    setObjectFit("cover");
  };

  const reset = () => {
    setImgUrl(null); setText(""); setResults([]); setObjectFit("cover");
    if (fileRef.current) fileRef.current.value = "";
  };

  const run = async () => {
    if (!imgUrl && !text.trim()) return toast.error("Subí una imagen o escribí el mensaje");
    setLoading(true); setScanning(true); setResults([]);

    const scanPromise = new Promise<void>((r) => setTimeout(r, 3500));

    try {
      const system = `Sos un coach de carisma y seducción para hombres tímidos. Hablás español neutro masculino, directo, con frame fuerte pero sin ser cringe. Devolvés EXACTAMENTE un array JSON con 5 aperturas listas para enviar al match. Tono solicitado: ${tone}. Plataforma de origen: ${platform} (adaptá el código a esa red). Cada apertura: ≤140 caracteres, natural, con gancho conversacional. NO expliques nada fuera del JSON.`;
      const userContent: any[] = [];
      if (imgUrl) userContent.push({ type: "image_url", image_url: { url: imgUrl } });
      userContent.push({
        type: "text",
        text:
          (text.trim() ? `Contexto / último mensaje: ${text.trim()}\n` : "") +
          `Plataforma: ${platform}. Tono: ${tone}. Devolvé un JSON array con 5 opciones distintas entre sí.`,
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

      const sugs = parseSuggestions(out.content, 5);
      setResults(sugs);
      if (sugs.length) {
        pushHistory({
          kind: "escaner",
          title: `Escáner · ${tone} · ${platform}`,
          body: sugs.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        });
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Algo falló");
    } finally {
      setScanning(false); setLoading(false);
    }
  };

  return (
    <AppShell title="Escáner" subtitle="5 aperturas de alto impacto a partir de su foto.">
      <div className="space-y-4">
        {/* Plataforma */}
        <div className="neon-card rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#BFDBFE]/70 mb-3">Plataforma de origen</div>
          <div className="grid grid-cols-3 gap-2">
            {PLATFORMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPlatform(id)}
                className={`flex items-center gap-1.5 justify-center px-2 py-2 rounded-xl text-xs transition-all border ${
                  platform === id
                    ? "grad-cyber text-white border-transparent neon-glow"
                    : "border-[rgba(99,160,255,0.18)] text-[#BFDBFE]/70 hover:border-[rgba(99,160,255,0.4)] bg-[rgba(59,130,246,0.06)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tono */}
        <div className="neon-card rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#BFDBFE]/70 mb-3">Tono</div>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3.5 py-1.5 rounded-2xl text-sm transition-all border capitalize ${
                  tone === t
                    ? "grad-cyber text-white border-transparent neon-glow"
                    : "border-[rgba(99,160,255,0.18)] text-[#BFDBFE]/70 hover:text-white hover:border-[rgba(99,160,255,0.4)] bg-[rgba(59,130,246,0.06)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Subida + scanner */}
        <div className="neon-card rounded-2xl p-4">
          <div className="scan-frame border border-[rgba(99,160,255,0.22)] bg-[rgba(15,25,55,0.6)]">
            <label
              onClick={() => !scanning && fileRef.current?.click()}
              className={`relative block cursor-pointer ${scanning ? "pointer-events-none" : ""}`}
            >
              {imgUrl ? (
                <img
                  src={imgUrl}
                  alt="perfil"
                  className="w-full max-h-80 transition-all"
                  style={{ objectFit, background: "#0a1428" }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 py-14 bg-[rgba(59,130,246,0.04)]">
                  <div className="h-12 w-12 rounded-2xl grad-cyber flex items-center justify-center neon-glow">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium">Subí la foto o screenshot</div>
                    <div className="text-[11px] text-[#BFDBFE]/60 mt-0.5">PNG · JPG · 6MB máx</div>
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

          {imgUrl && !scanning && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={() => setObjectFit((f) => (f === "cover" ? "contain" : "cover"))}
                className="btn-ghost !py-2 !px-3"
                title="Arreglar recorte (ver foto completa)"
              >
                <Crop className="h-4 w-4" />
                {objectFit === "cover" ? "Ver completa" : "Recortar"}
              </button>
              <button onClick={() => fileRef.current?.click()} className="btn-ghost !py-2 !px-3">
                <RotateCcw className="h-4 w-4" /> Cambiar foto
              </button>
              <button onClick={reset} className="btn-ghost !py-2 !px-3 !text-red-300 !border-red-400/30 hover:!bg-red-500/10">
                <X className="h-4 w-4" /> Borrar
              </button>
            </div>
          )}

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Opcional: pegá su bio o el último mensaje…"
            disabled={scanning}
            className="mt-3 w-full bg-[rgba(15,25,55,0.6)] border border-[rgba(99,160,255,0.2)] rounded-2xl p-3 text-sm outline-none focus:border-[rgba(99,160,255,0.5)] focus:ring-2 focus:ring-[rgba(59,130,246,0.25)] min-h-[88px]"
          />

          <div className="flex gap-2 mt-3">
            <button onClick={run} disabled={loading} className="btn-cyber flex-1">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Escaneando…" : "Escanear perfil"}
            </button>
            {(results.length > 0 || imgUrl || text) && !loading && (
              <button onClick={reset} className="btn-ghost" title="Empezar de nuevo">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            )}
          </div>

          {scanning && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#60A5FA]" />
              <div className="text-xs text-[#93C5FD] blink-soft text-center min-h-[1.2em]">
                {stepText}
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#BFDBFE]/70">
                {results.length} aperturas
              </div>
              <button onClick={reset} className="text-xs text-[#93C5FD] hover:underline inline-flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Empezar de nuevo
              </button>
            </div>
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
    <div className="neon-card neon-card-strong rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="pill">Opción {idx + 1}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              setGlow(true); setTimeout(() => setGlow(false), 600);
              toast.success("Copiado");
            }}
            className={`p-2 rounded-xl transition-all ${glow ? "neon-glow bg-[rgba(59,130,246,0.25)]" : "hover:bg-[rgba(59,130,246,0.15)]"}`}
            aria-label="Copiar"
          >
            <Copy className="h-4 w-4 text-[#93C5FD]" />
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
            className="p-2 rounded-xl hover:bg-[rgba(59,130,246,0.15)]"
            aria-label="Guardar"
          >
            <Bookmark className="h-4 w-4 text-[#93C5FD]" />
          </button>
        </div>
      </div>
      <p className="text-[15px] leading-relaxed text-white">{text}</p>
    </div>
  );
}
