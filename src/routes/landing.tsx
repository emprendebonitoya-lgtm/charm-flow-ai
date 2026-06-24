import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import heroVideo from "@/assets/hero-bg.mp4.asset.json";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "MAGNETO — Carisma operativo para el hombre moderno" },
      {
        name: "description",
        content:
          "Software masculino de carisma con IA. Aperturas, rescates de chat, simulador, planes de cita y academia diaria. Diseñado para resultados.",
      },
      { property: "og:title", content: "MAGNETO — Carisma operativo para el hombre moderno" },
      {
        property: "og:description",
        content:
          "Aperturas, rescates de chat y planes de cita con IA. Una experiencia de estudio para hombres que exigen resultados.",
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

  if (failed) return null;

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
  const ref = useRef<HTMLDivElement>(null);
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
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em" }}
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

/* ---------- Icons ---------- */
const ArrowUpRight = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);
const Play = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4" /></svg>
);
const Clock = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const Globe = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3c3 3.5 3 14 0 18" /><path d="M12 3c-3 3.5-3 14 0 18" /></svg>
);
const ImageIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5L19 18H5l3.5-4.5z" /></svg>
);
const Movie = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V4h-4z" /></svg>
);
const Bulb = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M9 21h6v-2H9v2zm3-19a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z" /></svg>
);

const fadeUp = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
};

function Landing() {
  const navLinks = ["Escáner", "Simulador", "Citas", "Academia", "Comunidad"];

  return (
    <div className="bg-black text-white font-body min-h-screen">
      {/* ============== HERO ============== */}
      <section className="magneto-cinematic-bg relative h-screen overflow-hidden bg-black">
        <div className="magneto-cinematic-bg absolute inset-0 z-0" />
        <FadingVideo
          src={heroVideo.url}
          className="absolute inset-0 w-full h-full object-cover object-center z-[1]"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/10 via-transparent to-black/45" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Navbar */}
          <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16">
            <div className="liquid-glass h-12 w-12 rounded-full flex items-center justify-center">
              <span className="font-heading italic text-2xl">m</span>
            </div>
            <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
              {navLinks.map((l) => (
                <span key={l} className="px-3 py-2 text-sm font-medium text-white/90 font-body cursor-default">
                  {l}
                </span>
              ))}
              <Link
                to="/"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-sm font-medium"
              >
                Entrar a la app <ArrowUpRight />
              </Link>
            </div>
            <Link to="/" className="md:hidden liquid-glass-strong rounded-full px-4 py-2 text-xs inline-flex items-center gap-1.5">
              Entrar <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </nav>

          {/* Main */}
          <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="liquid-glass rounded-full pl-1.5 pr-4 py-1.5 inline-flex items-center gap-2"
            >
              <span className="bg-white text-black rounded-full text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                Nuevo
              </span>
              <span className="text-xs md:text-sm text-white/90 font-body">
                Beta privada Q3 2026 — cupos limitados
              </span>
            </motion.div>

            <div className="mt-6 max-w-3xl">
              <BlurText
                text="Carisma operativo para el hombre moderno"
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px]"
              />
            </div>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              className="mt-5 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight"
            >
              MAGNETO es el estudio de IA para tu vida amorosa. Subí una foto de su perfil y la IA te
              entrega aperturas, rescata chats fríos, entrena conversaciones y planea citas con
              tipografía precisa y código que se nota.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                to="/"
                className="liquid-glass-strong rounded-full px-5 py-2.5 inline-flex items-center gap-2 text-sm font-medium"
              >
                Probar gratis <ArrowUpRight />
              </Link>
              <button className="inline-flex items-center gap-2 text-sm text-white/90">
                <Play className="h-3.5 w-3.5" /> Ver demo
              </button>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
                <Clock />
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">5 min</div>
                <div className="mt-2 text-xs text-white/80 font-body font-light">
                  De foto a 5 aperturas listas para enviar
                </div>
              </div>
              <div className="liquid-glass p-5 w-[220px] rounded-[1.25rem] text-left">
                <Globe />
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">4 IA</div>
                <div className="mt-2 text-xs text-white/80 font-body font-light">
                  Personalidades distintas para entrenar en el simulador
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust bar */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
            className="flex flex-col items-center gap-4 pb-8 px-4"
          >
            <div className="liquid-glass rounded-full px-5 py-2 text-xs md:text-sm text-white/85">
              Usado por hombres que prefieren mostrar resultados antes que excusas
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              {["Aeon", "Vela", "Apex", "Orbit", "Zeno"].map((n) => (
                <span key={n} className="font-heading italic text-2xl md:text-3xl tracking-tight text-white/85">
                  {n}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== CAPABILITIES ============== */}
      <section className="magneto-cinematic-bg relative min-h-screen overflow-hidden bg-black">
        <div className="magneto-cinematic-bg absolute inset-0 z-0" />
        <FadingVideo
          src={heroVideo.url}
          className="absolute inset-0 w-full h-full object-cover object-center z-[1]"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/25 via-black/10 to-black/55" />

        <div className="relative z-10 px-6 md:px-16 lg:px-20 pt-24 pb-12 flex flex-col min-h-screen">
          <div className="mb-auto">
            <div className="text-sm font-body text-white/80 mb-6">// Capacidades</div>
            <h2 className="font-heading italic text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] whitespace-pre-line">
              {"Estudio de carisma,\nde principio a fin"}
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Escáner & Aperturas",
                icon: <ImageIcon />,
                tags: ["Foto → IA", "Tinder", "Bumble", "Instagram"],
                body:
                  "Subí su perfil y obtené 5 aperturas con tono ingenioso, casual y atrevido. Rescatá chats fríos con líneas que recuperan la conversación sin sonar desesperado.",
              },
              {
                title: "Simulador & Citas",
                icon: <Movie />,
                tags: ["4 Personalidades", "Roleplay", "Date Planner"],
                body:
                  "Entrená en chats simulados con 4 perfiles femeninos distintos. Planificá citas en 3 fases — apertura, conexión, cierre — con escenarios reales.",
              },
              {
                title: "Academia & Tu Día",
                icon: <Bulb />,
                tags: ["Lecciones", "Mindset", "Rituales", "Frases"],
                body:
                  "Lecciones cortas accionables, frases listas para copiar, biblioteca de mindset y una misión diaria de 5 minutos para construir el hombre que querés ser.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="liquid-glass h-11 w-11 rounded-[0.75rem] flex items-center justify-center">
                    {c.icon}
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1" />
                <div>
                  <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-16 flex flex-col items-center text-center gap-5">
            <h3 className="font-heading italic text-4xl md:text-5xl tracking-[-2px] leading-none max-w-2xl">
              Dejá de improvisar. Empezá a operar.
            </h3>
            <Link
              to="/"
              className="liquid-glass-strong rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-medium"
            >
              Entrar a MAGNETO <ArrowUpRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
