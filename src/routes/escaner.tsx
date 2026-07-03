import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatCompletion } from "@/lib/ai.functions";
import { getProfile, pushHistory, toggleSaved } from "@/lib/storage";
import { consumeAd, getAdPolicySnapshot } from "@/lib/ad-policy";
import { loadScanUsage, recordScan, claimAdBonus, getAvailableScans, getFreeScansText } from "@/lib/scan-usage";
import { useUser } from "@/lib/user";
import {
  Upload, Sparkles, Bookmark, Copy, Loader2, RotateCcw, Crop, X,
  Instagram, MessageCircle, Heart, Camera, Lock,
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

function buildOfflineScanResults(count: number, tone: Tone, platform: PlatformId, hasImage: boolean): string[] {
  const base = [
    "Hola, me gustó tu estilo. ¿Cuál fue el mejor plan que hiciste este mes?",
    "Tu perfil transmite buena onda. Abrí con: ‘¿Sos más de noche tranquila o plan con energía?’",
    "Veo que tenés estilo propio. Podés arrancar con: ‘Me llamó la atención tu vibra. ¿Qué buscás hoy?’",
    "Si querés algo directo: ‘Tu perfil me quedó en la cabeza. ¿Qué te impulsa a responder rápido?’",
    "Tu bio sugiere confianza. Podés decir: ‘Me gustó cómo te presentás. ¿Cuál es tu idea de una conversación con onda?’",
  ];
  const imageBoost = hasImage
    ? [
        "Tu foto habla claro. ¿Cuál fue el detalle que más te representa?",
        "La imagen tiene mucha presencia. Podés seguir con: ‘Se nota que te cuidas. ¿Cómo te divertís en serio?’",
      ]
    : [];
  const platformTag = platform === "instagram" ? " (Instagram)" : platform === "tinder" ? " (Tinder)" : platform === "whatsapp" ? " (WhatsApp)" : platform === "tiktok" ? " (TikTok)" : platform === "bumble" ? " (Bumble)" : "";

  return Array.from({ length: count }, (_, i) => {
    const option = base[i % base.length];
    const imageHint = hasImage ? " Tu foto da un plus para que suene más real." : "";
    return `${option}${imageHint}${platformTag}`.trim();
  });
}

const SCAN_STEPS = [
  { at: 400,  text: "🔍 Extrayendo metadatos del perfil..." },
  { at: 1400, text: "🧠 Analizando lenguaje corporal y entorno..." },
  { at: 2400, text: "💬 Detectando intereses y vibra..." },
  { at: 3200, text: "🔥 Calculando 5 abridores de alto impacto..." },
];

function Escaner() {
  const { state } = useUser();
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
  const [usage, setUsage] = useState(loadScanUsage());
  const [adLoading, setAdLoading] = useState(false);
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

  const remainingScans = getAvailableScans(usage, state.isPremium);
  const resultCount = state.isPremium ? 10 : 5;

  const watchAdForExtraScan = async () => {
    if (state.isPremium) return;
    if (adLoading) return;
    if (!consumeAd("rewarded")) {
      const snapshot = getAdPolicySnapshot();
      toast.info(
        snapshot.impactsRemaining <= 0
          ? "Ya llegaste al límite de anuncios por sesión. Probá en unos minutos o pasate a Premium."
          : "Anuncio no disponible por ahora. Intentá de nuevo en unos minutos.",
      );
      return;
    }
    setAdLoading(true);
    toast.success("Viendo anuncio... esto te dará un escaneo extra.");
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setUsage((current) => claimAdBonus(current));
    setAdLoading(false);
    toast.success("Escaneo extra desbloqueado.");
  };

  const run = async () => {
    if (!imgUrl && !text.trim()) return toast.error("Subí una imagen o escribí el mensaje");
    const remaining = getAvailableScans(usage, state.isPremium);
    if (remaining <= 0) {
      toast.error("Agotaste tus escaneos gratis. Suscribite o mirá un anuncio para obtener uno extra.");
      return;
    }

    setLoading(true); setScanning(true); setResults([]);

    const scanPromise = new Promise<void>((r) => setTimeout(r, 3500));

    try {
      const system = `Sos un coach de carisma y seducción para hombres tímidos. Hablás español neutro masculino, directo, con frame fuerte pero sin ser cringe. Devolvés EXACTAMENTE un array JSON con ${resultCount} aperturas listas para enviar al match. Tono solicitado: ${tone}. Plataforma de origen: ${platform} (adaptá el código a esa red). Cada apertura: ≤140 caracteres, natural, con gancho conversacional. NO expliques nada fuera del JSON.`;
      const userContent: any[] = [];
      if (imgUrl) {
        userContent.push({ type: "image_url", image_url: { url: imgUrl } });
        userContent.push({
          type: "text",
          text: "Hay una imagen de perfil adjunta. Analizá su estilo, vibra y posibles intereses para generar aperturas de alto impacto.",
        });
      }
      if (text.trim()) {
        userContent.push({ type: "text", text: `Contexto / último mensaje: ${text.trim()}` });
      }
      userContent.push({
        type: "text",
        text:
          `Plataforma: ${platform}. Tono: ${tone}. Devolvé un JSON array con ${resultCount} opciones distintas entre sí.` +
          (state.isPremium ? " Incluí un breve análisis extra del perfil y la mejor apertura estratégica." : ""),
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

      const sugs = parseSuggestions(out.content, resultCount);
      setResults(sugs);
      if (sugs.length) {
        pushHistory({
          kind: "escaner",
          title: `Escáner · ${tone} · ${platform}`,
          body: sugs.map((s, i) => `${i + 1}. ${s}`).join("\n"),
        });
      }
      if (!state.isPremium) {
        setUsage((current) => recordScan(current));
      }
    } catch (e: any) {
      const errorMessage = String(e?.message ?? "");
      if (errorMessage.includes("LOVABLE_API_KEY") || errorMessage.includes("AI Gateway")) {
        const fallbackResults = buildOfflineScanResults(resultCount, tone, platform, Boolean(imgUrl));
        setResults(fallbackResults);
        toast.success("Escaneo offline generado sin conexión a Lovable.");
      } else {
        toast.error(errorMessage || "Algo falló");
      }
    } finally {
      setScanning(false); setLoading(false);
    }
  };

  return (
    <AppShell title="Escáner" subtitle={state.isPremium ? "10 aperturas premium de alto impacto a partir de su foto." : "5 aperturas de alto impacto a partir de su foto."}>
      <div className="space-y-4">
        <div className="neon-card rounded-3xl p-4 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#BFDBFE]/70">Escaneos gratis</div>
              <div className="text-white font-semibold">{getFreeScansText(usage, state.isPremium)}</div>
              {state.isPremium && (
                <div className="mt-1 text-[11px] text-[#A5B4FC]/80">Escáner Premium: {resultCount} aperturas por uso</div>
              )}
            </div>
            {!state.isPremium ? (
              <div className="flex flex-wrap items-center gap-2">
                <Link to="/premium" className="btn-cyber">
                  Hacerme premium
                </Link>
                <button
                  onClick={watchAdForExtraScan}
                  disabled={adLoading}
                  className="btn-ghost"
                >
                  {adLoading ? "Anuncio..." : "Ver anuncio +1 escaneo"}
                </button>
              </div>
            ) : (
              <div className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#D8B4FE]/80">Usos ilimitados</div>
            )}
          </div>
        </div>

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
                    : "border-[rgba(168,85,247,0.18)] text-[#D8B4FE]/70 hover:border-[rgba(168,85,247,0.4)] bg-[rgba(168,85,247,0.08)]"
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
                    : "border-[rgba(168,85,247,0.18)] text-[#D8B4FE]/70 hover:text-white hover:border-[rgba(168,85,247,0.4)] bg-[rgba(168,85,247,0.08)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Subida + scanner */}
        <div className="neon-card rounded-2xl p-4">
          <div className="scan-frame border border-[rgba(168,85,247,0.22)] bg-[rgba(15,25,55,0.6)]">
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
                <div className="flex flex-col items-center justify-center gap-3 py-14 bg-[rgba(168,85,247,0.05)]">
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
            className="mt-3 w-full bg-[rgba(15,25,55,0.6)] border border-[rgba(168,85,247,0.2)] rounded-2xl p-3 text-sm outline-none focus:border-[rgba(236,72,153,0.5)] focus:ring-2 focus:ring-[rgba(168,85,247,0.2)] min-h-[88px]"
          />
          <div className="text-[11px] text-[#BFDBFE]/60 mt-2">
            Si el escáner no devuelve resultados con la imagen, probá también con la bio o el último mensaje.
          </div>

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
              <Loader2 className="h-6 w-6 animate-spin text-[#D946EF]" />
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
            className={`p-2 rounded-xl transition-all ${glow ? "neon-glow bg-[rgba(168,85,247,0.25)]" : "hover:bg-[rgba(168,85,247,0.15)]"}`}
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
            className="p-2 rounded-xl hover:bg-[rgba(168,85,247,0.15)]"
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
