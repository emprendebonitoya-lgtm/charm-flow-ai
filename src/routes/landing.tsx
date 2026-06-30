import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import heroVideo from "@/assets/hero-bg.mp4.asset.json";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/landing")({
  head: () => ({
    title: "Charm Flow AI — Carisma operativo para el hombre moderno (MAGNETO)",
    meta: [
      {
        name: "description",
        content:
          "Charm Flow AI (MAGNETO): Software de carisma con IA para hombres. Aperturas, salvavidas de chat, simulador de citas, planes de cita y academia diaria. Diseñado para resultados.",
      },
      { property: "og:title", content: "Charm Flow AI (MAGNETO) — Carisma con IA" },
      {
        property: "og:description",
        content:
          "Charm Flow AI: Aperturas, rescates de chat y planes de cita con IA. Una experiencia de estudio para hombres que exigen resultados.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

/* ---------- FadingVideo ---------- */
function FadingVideo({
  src,
  className,
  style,
}: {
  src: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    let raf = 0;
    let isMounted = true;

    const fadeTo = (target: number, duration: number) => {
      cancelAnimationFrame(raf);
      const start = performance.now();
      const from = Number(v.dataset.opacity ?? "0");

      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / duration);
        const next = from + (target - from) * p;
        v.dataset.opacity = String(next);
        if (isMounted) setOpacity(next);
        if (p < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const onLoaded = () => fadeTo(1, 500);
    const onTime = () => {
      if (v.duration && v.duration - v.currentTime <= 0.55) fadeTo(0, 550);
    };
    const onEnded = () => {
      v.currentTime = 0;
      v.play().catch(() => {});
      fadeTo(1, 500);
    };
    const onError = () => setFailed(true);

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnded);
    v.addEventListener("error", onError);

    return () => {
      isMounted = false;
      cancelAnimationFrame(raf);
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("error", onError);
    };
  }, []);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          ...style,
          background:
            "linear-gradient(135deg, #0a0f1e
 0%, #1a1f3e
 50%, #0a0f1e
 100%)",
        }}
      />
    );
  }

  return (
    <video
      ref={ref}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ ...style, opacity, transition: "opacity 200ms linear" }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}

/* ---------- BlurText ---------- */
function BlurText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShow(true)),
      { threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        rowGap: "0.1em",
      }}
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={show ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {w}
        </motion.span>
      ))}
    </h1>
  );
}

function Landing() {
  const heroVideoSrc =
    typeof heroVideo === "string"
      ? heroVideo
      : (heroVideo as { src?: string }).src ?? "";

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#050816
",
        color: "#fff",
      }}
    >
      <FadingVideo
        src={heroVideoSrc}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at top, rgba(15,23,42,0.35), rgba(5,8,22,0.92) 70%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <Logo />

        <div style={{ maxWidth: 960, marginTop: 24 }}>
          <BlurText
            text="Charm Flow AI"
            className="text-5xl font-bold tracking-tight md:text-7xl"
          />
          <p
            style={{
              marginTop: 20,
              maxWidth: 720,
              marginLeft: "auto",
              marginRight: "auto",
              fontSize: "1.05rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.82)",
            }}
          >
            Carisma operativo para el hombre moderno: aperturas, salvavidas de chat,
            simulador de citas y planes accionables en una sola experiencia.
          </p>
        </div>
      </div>
    </div>
  );
}
