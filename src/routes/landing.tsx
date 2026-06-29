import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import heroVideo from "@/assets/hero-bg.mp4.asset.json";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Charm Flow AI — Carisma operativo para el hombre moderno (MAGNETO)" },
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
    // Fallback gradient background cuando el video no carga
    return (
      <div
        className={className}
        style={{
          ...style,
          background: "linear-gradient(135deg, #0a0f1e 0%, #1a1f3e 50%, #0a0f1e 100%)",
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
            <div className="liquid-glass h-12 px-4 rounded-full flex items-center justify-center gap-2">
              <span className="font-heading italic text-2xl bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">cf</span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">Charm Flow</span>
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

            {/* Fondo de luces de colores para resaltar el vidrio translúcido */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/25 blur-[120px] animate-pulse" style={{ animationDuration: "8s" }} />
              <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[150px] animate-pulse" style={{ animationDuration: "12s" }} />
              <div className="absolute bottom-[15%] left-[25%] w-[350px] h-[350px] rounded-full bg-cyan-500/15 blur-[100px] animate-pulse" style={{ animationDuration: "10s" }} />
              <div className="absolute top-[25%] right-[30%] w-[300px] h-[300px] rounded-full bg-pink-500/15 blur-[110px]" />
            </div>

            <div className="mt-6 max-w-3xl z-10">
              <BlurText
                text="Carisma operativo para el hombre moderno"
                className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px]"
              />
            </div>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              className="mt-5 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight z-10"
            >
              <strong className="font-semibold text-fuchsia-300">Charm Flow AI (MAGNETO)</strong> es el estudio definitivo de carisma con inteligencia artificial. Subí una captura, rescata chats enfriados, entrena roleplay interactivo y planifica citas con herramientas diseñadas exclusivamente para obtener resultados reales.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 z-10"
            >
              <Link
                to="/"
                className="liquid-glass-strong hover:bg-white/10 transition-colors rounded-full px-6 py-3 inline-flex items-center gap-2 text-sm font-semibold text-white tracking-wide shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              >
                Probar gratis <ArrowUpRight />
              </Link>
              <button className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors">
                <Play className="h-3.5 w-3.5 text-fuchsia-400" /> Ver demo
              </button>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-6 z-10"
            >
              <div className="liquid-glass p-6 w-[240px] rounded-[1.5rem] text-left hover:scale-[1.02] transition-transform duration-300">
                <div className="text-fuchsia-400"><Clock /></div>
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">5 min</div>
                <div className="mt-2 text-xs text-white/80 font-body font-light leading-relaxed">
                  De captura de pantalla a <strong className="font-medium text-white">5 aperturas de impacto</strong> listas para enviar.
                </div>
              </div>
              <div className="liquid-glass p-6 w-[240px] rounded-[1.5rem] text-left hover:scale-[1.02] transition-transform duration-300">
                <div className="text-violet-400"><Globe /></div>
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">4 Modelos</div>
                <div className="mt-2 text-xs text-white/80 font-body font-light leading-relaxed">
                  Diferentes arquetipos de IA y <strong className="font-medium text-white">personalidades</strong> para dominar el simulador.
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust bar */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
            className="flex flex-col items-center gap-4 pb-8 px-4 z-10"
          >
            <div className="liquid-glass rounded-full px-5 py-2 text-xs md:text-sm text-white/85">
              Impulsado por <strong className="text-fuchsia-300">Charm Flow AI</strong>: la suite secreta del carisma moderno
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
      <section className="magneto-cinematic-bg relative min-h-screen overflow-hidden bg-black py-16">
        <div className="magneto-cinematic-bg absolute inset-0 z-0" />
        <FadingVideo
          src={heroVideo.url}
          className="absolute inset-0 w-full h-full object-cover object-center z-[1]"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/35 via-black/20 to-black/65" />

        {/* Luces de fondo dinámicas para potenciar el efecto vidrio en Capacidades */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          <div className="absolute top-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-violet-600/20 blur-[130px] animate-pulse" style={{ animationDuration: "14s" }} />
          <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulse" style={{ animationDuration: "9s" }} />
        </div>

        <div className="relative z-10 px-6 md:px-16 lg:px-20 pt-16 pb-12 flex flex-col min-h-screen">
          <div className="mb-auto">
            <div className="text-sm font-body text-fuchsia-400 mb-4 tracking-[0.2em] uppercase">// El ecosistema de Charm Flow AI</div>
            <h2 className="font-heading italic text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-[-3px] whitespace-pre-line text-white">
              {"Estudio de carisma,\nde principio a fin"}
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Escáner & Aperturas",
                icon: <ImageIcon className="text-fuchsia-400" />,
                tags: ["Foto → IA", "Tinder", "Bumble", "Instagram"],
                body:
                  "Subí la captura de cualquier perfil de chat y obtené de inmediato 5 abridores con tono ingenioso, calibrado y atrevido. Olvidate de quedarte en blanco.",
                glow: "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]",
              },
              {
                title: "Simulador & Citas",
                icon: <Movie className="text-violet-400" />,
                tags: ["4 Personalidades", "Roleplay", "Date Planner"],
                body:
                  "Practicá en chats de entrenamiento interactivo con 4 arquetipos femeninos. Planificá citas memorables en 3 fases: apertura, conexión y cierre.",
                glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
              },
              {
                title: "Academia & Tu Día",
                icon: <Bulb className="text-cyan-400" />,
                tags: ["Lecciones", "Mindset", "Rituales", "Frases"],
                body:
                  "Lecciones ultra-cortas accionables, plantillas listas para copiar, biblioteca de psicología masculina y una misión diaria de 5 minutos para entrenar racha.",
                glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
              },
            ].map((c) => (
              <div
                key={c.title}
                className={`group liquid-glass rounded-[1.75rem] p-8 min-h-[380px] flex flex-col transition-all duration-300 hover:scale-[1.03] hover:bg-white/10 ${c.glow}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="liquid-glass h-12 w-12 rounded-[1rem] flex items-center justify-center bg-white/5">
                    {c.icon}
                  </div>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-medium whitespace-nowrap bg-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex-1" />
                <div className="mt-8">
                  <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none text-white group-hover:text-fuchsia-300 transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm text-slate-300 font-body font-light leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-24 flex flex-col items-center text-center gap-6 relative">
            {/* Brillo detrás del CTA */}
            <div className="absolute inset-0 pointer-events-none bg-fuchsia-500/10 blur-[80px] rounded-full scale-75 z-0" />
            <h3 className="font-heading italic text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-none max-w-2xl text-white z-10">
              Dejá de improvisar. Empezá a operar.
            </h3>
            <p className="text-slate-400 text-xs md:text-sm max-w-md font-body font-light z-10 leading-relaxed">
              Únete a miles de hombres que utilizan el motor de <strong className="text-white">Charm Flow AI</strong> para transformar sus habilidades de conversación y citas.
            </p>
            <Link
              to="/"
              className="liquid-glass-strong hover:bg-white/10 transition-all rounded-full px-8 py-4 inline-flex items-center gap-3 text-base font-semibold text-white tracking-wide shadow-[0_10px_40px_-10px_rgba(168,85,247,0.4)] z-10 scale-100 hover:scale-[1.02] duration-300"
            >
              Entrar a MAGNETO <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
