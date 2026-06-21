import { isAdSenseConfigured } from "@/lib/plans";
import { Megaphone } from "lucide-react";
import { useEffect, useRef } from "react";

type AdBannerProps = {
  slot?: "header" | "inline";
  className?: string;
};

export function AdBanner({ slot = "inline", className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const adClient = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  const adSlot = import.meta.env.VITE_ADSENSE_SLOT as string | undefined;

  useEffect(() => {
    if (!isAdSenseConfigured() || !containerRef.current) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  if (isAdSenseConfigured() && adSlot) {
    return (
      <div ref={containerRef} className={`rounded-2xl overflow-hidden border border-white/10 bg-black/20 ${className}`}>
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-dashed border-white/15 bg-[rgba(255,255,255,0.03)] px-4 py-3 ${className}`}
      role="note"
      aria-label="Espacio publicitario"
    >
      <div className="flex items-center gap-3 text-[#BFDBFE]/70">
        <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
          <Megaphone className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/60">
            MAGNETO Gratis · {slot === "header" ? "Patrocinado" : "Publicidad"}
          </div>
          <p className="text-xs text-[#E0E7FF]/60 mt-0.5 leading-relaxed">
            Plan gratis con anuncios discretos. Premium elimina publicidad y desbloquea todo el contenido.
          </p>
        </div>
      </div>
    </div>
  );
}

type WatchAdButtonProps = {
  onComplete: () => void | Promise<void>;
  loading?: boolean;
  label?: string;
};

export function WatchAdButton({ onComplete, loading, label = "Ver anuncio (+1 escaneo)" }: WatchAdButtonProps) {
  return (
    <button
      type="button"
      onClick={onComplete}
      disabled={loading}
      className="btn-ghost w-full inline-flex items-center justify-center gap-2 border border-white/10"
    >
      <Megaphone className="h-4 w-4" />
      {loading ? "Reproduciendo anuncio…" : label}
    </button>
  );
}
