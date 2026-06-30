import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Film,
  Image,
  Lightbulb,
  Play,
  Zap,
  ShieldCheck,
  Sparkles,
  Scan,
  LifeBuoy,
  MessagesSquare,
  CalendarHeart,
  GraduationCap,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const LOCAL_VIDEO = "/hero-bg.mp4";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Charm Flow AI ÔÇö Carisma operativo para el hombre moderno (MAGNETO)" },
      {
        name: "description",
        content:
          "Charm Flow AI (MAGNETO): Software de carisma con IA para hombres. Aperturas, salvavidas de chat, simulador de citas, planes de cita y academia diaria. Dise├▒ado para resultados.",
      },
      { property: "og:title", content: "Charm Flow AI (MAGNETO) ÔÇö Carisma con IA" },
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
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17L17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

const fadeUp = {
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
};

function Landing() {
  const navLinks = ["Esc├íner", "Simulador", "Citas", "Academia", "Comunidad"];
  const featureTabs = [
    {
      title: "Esc├íner instant├íneo",
      label: "Gener├í aperturas reales",
      description:
        "Sub├¡ una foto o un chat y obten├® mensajes de apertura calibrados para cada tipo de conversaci├│n.",
      icon: <Image className="h-5 w-5 text-fuchsia-400" />,
    },
    {
      title: "Simulaci├│n real",
      label: "Entren├í sin miedo",
      description:
        "Practica con 4 personalidades de IA y aprende a responder con seguridad frente a bloqueos y desconexiones.",
      icon: <Film className="h-5 w-5 text-violet-400" />,
    },
    {
      title: "Planificador de citas",
      label: "Citas que funcionan",
      description:
        "Prepara cada encuentro con una gu├¡a clara de apertura, conexi├│n y cierre dise├▒ada para avanzar a la siguiente etapa.",
      icon: <Lightbulb className="h-5 w-5 text-cyan-400" />,
    },
  ];
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div className="bg-black text-white font-body min-h-screen overflow-x-hidden">
      {/* ============== HERO ============== */}
      <section className="magneto-cinematic-bg relative min-h-screen bg-black overflow-x-hidden">
        <div className="magneto-cinematic-bg absolute inset-0 z-0" />
        {/* Video fijo al viewport */}
        <div className="absolute inset-x-0 top-0 h-screen overflow-hidden z-[1]">
          <FadingVideo
            src={LOCAL_VIDEO}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Navbar */}
          <nav className="fixed top-2 sm:top-4 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 lg:px-16">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 shadow-[0_0_30px_rgba(168,85,247,0.12)] backdrop-blur-lg"
            >
              <div
                className="h-12 w-12 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  background: "white",
                  boxShadow: "0 0 28px rgba(168,85,247,0.55), 0 0 8px rgba(0,200,255,0.35)",
                }}
              >
                <Logo className="h-[150%] w-[150%] scale-[1.7] object-cover" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-heading text-sm uppercase tracking-[0.2em] text-white">
                  MAGNETO
                </span>
                <span className="text-[10px] uppercase tracking-[0.35em] text-white/50">
                  Carisma IA
                </span>
              </div>
            </Link>
            <div className="hidden md:flex liquid-glass rounded-full px-1.5 py-1.5 items-center gap-1">
              {navLinks.map((l) => (
                <span
                  key={l}
                  className="px-3 py-2 text-sm font-medium text-white/90 font-body cursor-default"
                >
                  {l}
                </span>
              ))}
              <Link
                to="/login"
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white px-4 py-2 text-sm font-medium hover:bg-white/15"
              >
                Crear cuenta
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-sm font-medium"
              >
                Entrar a la app <ArrowUpRight />
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/login"
                className="liquid-glass rounded-full px-3.5 py-2 text-xs text-white"
              >
                Crear cuenta
              </Link>
              <Link
                to="/"
                className="liquid-glass-strong rounded-full px-3.5 py-2 text-xs inline-flex items-center gap-1"
              >
                Entrar <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>

          {/* Main */}
          <div className="flex-1 flex flex-col items-center justify-center pt-20 sm:pt-24 px-4 text-center">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="hidden sm:inline-flex liquid-glass rounded-full pl-1.5 pr-4 py-1.5 items-center gap-2"
            >
              <span className="bg-white text-black rounded-full text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
                Nuevo
              </span>
              <span className="text-xs md:text-sm text-white/90 font-body">
                Beta privada Q3 2026 ÔÇö cupos limitados
              </span>
            </motion.div>

            {/* Fondo de luces de colores para resaltar el vidrio transl├║cido */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
              <div
                className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/25 blur-[120px] animate-pulse"
                style={{ animationDuration: "8s" }}
              />
              <div
                className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[150px] animate-pulse"
                style={{ animationDuration: "12s" }}
              />
              <div
                className="absolute bottom-[15%] left-[25%] w-[350px] h-[350px] rounded-full bg-cyan-500/15 blur-[100px] animate-pulse"
                style={{ animationDuration: "10s" }}
              />
              <div className="absolute top-[25%] right-[30%] w-[300px] h-[300px] rounded-full bg-pink-500/15 blur-[110px]" />
            </div>

            <div className="mt-6 max-w-3xl z-10">
              <BlurText
                text="Conversa sin improvisar. Rescata chats fr├¡os. Llega a la cita con confianza."
                className="text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.95] sm:leading-[0.9] tracking-[-1px] sm:tracking-[-2px]"
              />
            </div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
              className="mt-5 flex sm:hidden flex-col items-center justify-center gap-3 z-10 w-full max-w-xs"
            >
              <Link
                to="/"
                className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white tracking-wide shadow-[0_15px_50px_-20px_rgba(168,85,247,0.7)]"
              >
                Probar gratis <ArrowUpRight />
              </Link>
              <button className="inline-flex items-center gap-2 text-sm text-white/90">
                <Play className="h-3.5 w-3.5 text-fuchsia-400" /> Ver demo
              </button>
            </motion.div>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              className="mt-5 text-sm md:text-base text-white/90 max-w-2xl font-body font-light leading-relaxed z-10"
            >
              <strong className="font-semibold text-fuchsia-300">MAGNETO</strong> es la app de IA
              dise├▒ada para que cualquier hombre pueda iniciar conversaciones, rescatar chats
              enfriados y llegar preparado a cada cita ÔÇö sin improvisar y sin bloquearse.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.05 }}
              className="hidden sm:flex mt-6 flex-col sm:flex-row flex-wrap items-center justify-center gap-3 z-10"
            >
              {[
                "Rescates de chat instant├íneos",
                "Simulaciones con IA real",
                "Planes de citas listos para usar",
              ].map((item) => (
                <div
                  key={item}
                  className="liquid-glass rounded-full px-4 py-2 text-xs md:text-sm text-white/80 bg-white/5 border border-white/10 hover:scale-[1.02] transition-transform"
                >
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.25 }}
              className="hidden sm:flex mt-8 flex-wrap items-center justify-center gap-4 z-10"
            >
              <Link
                to="/"
                className="rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-7 py-3 inline-flex items-center gap-2 text-sm font-semibold text-white tracking-wide shadow-[0_15px_50px_-20px_rgba(168,85,247,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Probar gratis <ArrowUpRight />
              </Link>
              <button className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors">
                <Play className="h-3.5 w-3.5 text-fuchsia-400" /> Ver demo
              </button>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
              className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 z-10"
            >
              <div className="liquid-glass p-6 rounded-[1.5rem] text-left hover:scale-[1.02] transition-transform duration-300">
                <Zap className="h-6 w-6 text-fuchsia-400" />
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">
                  5 min
                </div>
                <div className="mt-2 text-xs text-white/80 font-body font-light leading-relaxed">
                  De captura a{" "}
                  <strong className="font-medium text-white">5 aperturas de impacto</strong> listas
                  para enviar en menos de cinco minutos.
                </div>
              </div>
              <div className="liquid-glass p-6 rounded-[1.5rem] text-left hover:scale-[1.02] transition-transform duration-300">
                <Sparkles className="h-6 w-6 text-violet-400" />
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">
                  4 modos
                </div>
                <div className="mt-2 text-xs text-white/80 font-body font-light leading-relaxed">
                  4 arquetipos de IA para entrenar tu estilo, adaptarte a distintos chats y salir de
                  bloqueos.
                </div>
              </div>
              <div className="liquid-glass p-6 rounded-[1.5rem] text-left hover:scale-[1.02] transition-transform duration-300">
                <ShieldCheck className="h-6 w-6 text-cyan-400" />
                <div className="text-4xl font-heading italic tracking-[-1px] leading-none mt-4">
                  +1k
                </div>
                <div className="mt-2 text-xs text-white/80 font-body font-light leading-relaxed">
                  M├ís de 1.000 respuestas y frases optimizadas para mantener la conversaci├│n y
                  conseguir el pr├│ximo paso.
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.6 }}
              className="mt-12 w-full max-w-5xl mx-auto z-10"
            >
              <div className="liquid-glass rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-fuchsia-300">
                      Interactivo
                    </p>
                    <h3 className="mt-3 text-3xl md:text-4xl font-heading italic text-white">
                      Toc├í cada modo y sent├¡ la ventaja
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featureTabs.map((feature, index) => (
                      <button
                        key={feature.title}
                        onClick={() => setActiveFeature(index)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          activeFeature === index
                            ? "border-fuchsia-300 bg-fuchsia-500/15 text-white shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                            : "border-white/10 bg-white/5 text-white/80 hover:border-fuchsia-300 hover:text-white"
                        }`}
                      >
                        <span className="mr-2 inline-flex items-center justify-center">
                          {feature.icon}
                        </span>
                        {feature.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    <div className="rounded-[1.5rem] bg-black/30 border border-white/10 p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                        Modo activo
                      </p>
                      <h4 className="mt-3 text-xl font-semibold text-white">
                        {featureTabs[activeFeature].title}
                      </h4>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        {featureTabs[activeFeature].description}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Respuestas listas en segundos",
                        "Entrenamiento sin riesgo",
                        "Planes que avanzan paso a paso",
                        "Mensajes calibrados para cada situaci├│n",
                      ].map((item) => (
                        <div
                          key={item}
                          className="liquid-glass rounded-[1.5rem] p-4 text-sm text-white/80"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative overflow-hidden rounded-[1.75rem] bg-black/40 border border-white/10 p-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-cyan-500/5 opacity-80" />
                    <div className="relative z-10">
                      <div className="text-xl font-semibold text-white">Ejemplo r├ípido</div>
                      <div className="mt-4 rounded-[1.5rem] bg-[#02070f]/95 p-5 text-sm text-slate-300 border border-white/10">
                        <p className="font-medium text-white">
                          "┬┐Te gustar├¡a que te pase algo divertido para romper el hielo?"
                        </p>
                        <p className="mt-3 leading-relaxed">
                          Este mensaje es el tipo de apertura que el modo activo genera: directo,
                          seguro y adaptado para reactivar la conversaci├│n.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* M├│dulos strip */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.4 }}
            className="flex flex-col items-center gap-5 pb-12 px-4 z-10"
          >
            <p className="text-xs text-white/50 uppercase tracking-[0.35em]">
              Lo que inclu├¡e MAGNETO
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full max-w-3xl">
              {[
                {
                  icon: <Scan className="h-5 w-5" />,
                  label: "Esc├íner IA",
                  desc: "Foto ÔåÆ 5 aperturas",
                },
                {
                  icon: <LifeBuoy className="h-5 w-5" />,
                  label: "Salvavidas",
                  desc: "Rescate instant├íneo",
                },
                {
                  icon: <MessagesSquare className="h-5 w-5" />,
                  label: "Simulador",
                  desc: "4 personalidades",
                },
                {
                  icon: <CalendarHeart className="h-5 w-5" />,
                  label: "Date Planner",
                  desc: "3 fases de cita",
                },
                {
                  icon: <GraduationCap className="h-5 w-5" />,
                  label: "Academia",
                  desc: "Lecciones diarias",
                },
              ].map((mod) => (
                <div
                  key={mod.label}
                  className="liquid-glass rounded-[1.25rem] p-4 flex flex-col items-start gap-2 hover:scale-[1.03] transition-transform border border-white/10"
                >
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-fuchsia-300">
                    {mod.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white leading-tight">
                      {mod.label}
                    </div>
                    <div className="text-[11px] text-white/50 leading-tight mt-0.5">{mod.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============== CAPABILITIES ============== */}
      <section className="magneto-cinematic-bg relative min-h-screen overflow-hidden bg-black py-16">
        <div className="magneto-cinematic-bg absolute inset-0 z-0" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/35 via-black/20 to-black/65" />

        {/* Luces de fondo din├ímicas para potenciar el efecto vidrio en Capacidades */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
          <div
            className="absolute top-[20%] right-[15%] w-[450px] h-[450px] rounded-full bg-violet-600/20 blur-[130px] animate-pulse"
            style={{ animationDuration: "14s" }}
          />
          <div
            className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full bg-fuchsia-600/20 blur-[120px] animate-pulse"
            style={{ animationDuration: "9s" }}
          />
        </div>

        <div className="relative z-10 px-6 md:px-16 lg:px-20 pt-16 pb-12 flex flex-col min-h-screen">
          <div className="mb-auto">
            <div className="text-sm font-body text-fuchsia-400 mb-4 tracking-[0.2em] uppercase">
              // Todo lo que necesit├ís en un solo lugar
            </div>
            <h2 className="font-heading italic text-5xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-[-3px] whitespace-pre-line text-white">
              {"Herramientas reales\npara conversaciones reales"}
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Recupera chats",
                value: "+78%",
                detail:
                  "m├ís conversaciones reactivadas con mensajes de rescate dise├▒ados para reactivar inter├®s.",
              },
              {
                label: "Citas mejor planificadas",
                value: "3 pasos",
                detail: "apertura, conexi├│n y cierre con gu├¡as listas para ejecutar.",
              },
              {
                label: "Aperturas listas",
                value: "5 en 1",
                detail: "cinco mensajes de impacto instant├íneos subidos desde tu perfil.",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="liquid-glass rounded-[1.75rem] p-6 text-left border border-white/10"
              >
                <div className="text-sm uppercase tracking-[0.3em] text-white/60">
                  {metric.label}
                </div>
                <div className="mt-4 text-5xl font-heading italic tracking-[-1px] text-white">
                  {metric.value}
                </div>
                <p className="mt-3 text-sm text-slate-300 font-body leading-relaxed">
                  {metric.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Esc├íner & Aperturas",
                icon: <Image className="text-fuchsia-400" />,
                tags: ["Foto ÔåÆ IA", "Tinder", "Bumble", "Instagram"],
                body: "Sub├¡ la captura de cualquier perfil de chat y obten├® de inmediato 5 abridores con tono ingenioso, calibrado y atrevido. Olvidate de quedarte en blanco.",
                glow: "group-hover:shadow-[0_0_30px_rgba(217,70,239,0.15)]",
              },
              {
                title: "Simulador & Citas",
                icon: <Film className="text-violet-400" />,
                tags: ["4 Personalidades", "Roleplay", "Date Planner"],
                body: "Practic├í en chats de entrenamiento interactivo con 4 arquetipos femeninos. Planific├í citas memorables en 3 fases: apertura, conexi├│n y cierre.",
                glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
              },
              {
                title: "Academia & Tu D├¡a",
                icon: <Lightbulb className="text-cyan-400" />,
                tags: ["Lecciones", "Mindset", "Rituales", "Frases"],
                body: "Lecciones ultra-cortas accionables, plantillas listas para copiar, biblioteca de psicolog├¡a masculina y una misi├│n diaria de 5 minutos para entrenar racha.",
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
            {/* Brillo detr├ís del CTA */}
            <div className="absolute inset-0 pointer-events-none bg-fuchsia-500/10 blur-[80px] rounded-full scale-75 z-0" />
            <h3 className="font-heading italic text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-none max-w-2xl text-white z-10">
              Dej├í de bloquearte. MAGNETO hace el trabajo pesado por vos.
            </h3>
            <p className="text-slate-400 text-xs md:text-sm max-w-md font-body font-light z-10 leading-relaxed">
              Aperturas, rescates, simulaciones y planes de cita ÔÇö todo generado por IA, listo para
              usar, sin necesidad de experiencia previa.
            </p>
            <Link
              to="/"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-8 py-4 inline-flex items-center gap-3 text-base font-semibold text-white tracking-wide shadow-[0_15px_50px_-20px_rgba(168,85,247,0.7)] z-10 scale-100 hover:-translate-y-0.5 transition-transform duration-300"
            >
              Abrir MAGNETO ahora <ArrowUpRight className="h-5 w-5" />
            </Link>
            <div className="z-10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/65">
              <Link
                to="/terminos"
                className="underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                T├®rminos
              </Link>
              <Link
                to="/privacidad"
                className="underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Privacidad
              </Link>
              <Link
                to="/premium"
                search={{ canceled: false }}
                className="underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Planes y facturaci├│n
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
