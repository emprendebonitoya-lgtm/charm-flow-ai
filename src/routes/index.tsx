import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Film, Image, Lightbulb, Play, Zap, ShieldCheck, Sparkles, Scan, LifeBuoy, MessagesSquare, CalendarHeart, GraduationCap, ArrowUpRight, Quote
} from "lucide-react";
import { Logo } from "@/components/Logo";

const LOCAL_VIDEO = "/hero-bg.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Charm Flow AI — Carisma operativo para el hombre moderno (MAGNETO)" },
      {
        name: "description",
        content: "Charm Flow AI (MAGNETO): Software de carisma con IA para hombres. Aperturas, salvavidas de chat, simulador de citas, planes de cita y academia diaria. Diseñado para resultados.",
      },
      { property: "og:title", content: "Charm Flow AI (MAGNETO) — Carisma con IA" },
      {
        property: "og:description",
        content: "Charm Flow AI: Aperturas, rescates de chat y planes de cita con IA. Una experiencia de estudio para hombres que exigen resultados.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function FadingVideo({ src, className, style }: { src: string; className?: string; style?: CSSProperties }) {
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
    const onTime = () => { if (v.duration && v.duration - v.currentTime <= 0.55) fadeTo(0, 550); };
    const onEnded = () => { v.currentTime = 0; v.play().catch(() => {}); fadeTo(1, 500); };
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

  if (failed) return <div className={className} style={{ ...style, background: "linear-gradient(135deg, #0a0f1e 0%, #1a1f3e 50%, #0a0f1e 100%)" }} />;
  return <video ref={ref} autoPlay muted loop playsInline className={className} style={style} />;
}

function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c1224] text-white selection:bg-fuchsia-500/30">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4 ${isScrolled ? "bg-[#0c1224]/80 backdrop-blur-xl border-b border-white/10 py-3" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#metodo" className="hover:text-fuchsia-300 transition-colors">Método</a>
            <a href="#herramientas" className="hover:text-fuchsia-300 transition-colors">Herramientas</a>
            <a href="#academia" className="hover:text-fuchsia-300 transition-colors">Academia</a>
            <Link to="/dashboard" className="px-5 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-white">Entrar</Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <FadingVideo src={LOCAL_VIDEO} className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c1224]/60 to-[#0c1224] z-10" />
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold uppercase tracking-widest mb-8">
            <Sparkles className="h-3 w-3" /> El estándar de carisma operativo
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl md:text-7xl lg:text-8xl font-heading italic font-bold tracking-tighter leading-[0.9] mb-8">
            Domina el juego <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400">del carisma.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-body font-light leading-relaxed mb-12">
            No es magia, es ingeniería social aplicada. Accedé a la IA que diseña tus aperturas, rescata tus chats y entrena tu mentalidad para resultados reales.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_50px_-20px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300">
              Empezar ahora gratis
            </Link>
            <a href="#metodo" className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium">Ver Método</a>
          </motion.div>
        </div>
      </section>

      <section id="metodo" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading italic font-bold mb-6">El Sistema Operativo</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-body font-light text-lg">
              Hemos descompuesto la seducción y el carisma en patrones ejecutables. Sin frases hechas, solo psicología aplicada.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Análisis de Contexto", desc: " la IA analiza el perfil y el entorno para encontrar el ángulo de entrada perfecto.", icon: Scan, color: "from-fuchsia-500/20 to-transparent" },
              { title: "Generación de Impacto", desc: "Crea aperturas que rompen el patrón y generan curiosidad inmediata.", icon: Zap, color: "from-violet-500/20 to-transparent" },
              { title: "Cierre y Conversión", desc: "Lleva la conversación hacia la cita sin parecer desesperado ni forzado.", icon: CalendarHeart, color: "from-cyan-500/20 to-transparent" },
            ].map((item, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-fuchsia-500/30 transition-all duration-500 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-fuchsia-300 mb-6 group-hover:scale-110 transition-transform"><item.icon className="h-7 w-7" /></div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-slate-400 font-body font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="herramientas" className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading italic font-bold mb-6">Arsenal Operativo</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-body font-light text-lg">
              Herramientas diseñadas para eliminar la fricción y maximizar la conversión en cada interacción.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Escáner de Perfiles", body: "Sube una captura y la IA analiza el arquetipo, intereses y puntos débiles para generar aperturas precisas.", icon: Scan, tags: ["Análisis", "Aperturas"], glow: "shadow-fuchsia-500/20" },
              { title: "Salvavidas de Chat", body: "Cuando la conversación muere o se vuelve monótona, la IA rescata el hilo con un giro inesperado.", icon: LifeBuoy, tags: ["Rescate", "Dinámica"], glow: "shadow-violet-500/20" },
              { title: "Simulador de Citas", body: "Entrena contra 4 personalidades distintas para pulir tu entrega y manejo de objeciones.", icon: MessagesSquare, tags: ["Entrenamiento", "Psicología"], glow: "shadow-cyan-500/20" },
              { title: "Date Planner", body: "Citas diseñadas en 3 fases para maximizar la tensión sexual y la conexión emocional.", icon: CalendarHeart, tags: ["Logística", "Conversión"], glow: "shadow-fuchsia-500/20" },
              { title: "Academia de Carisma", body: "Lecciones cortas y accionables sobre lenguaje corporal, voz y psicología oscura.", icon: GraduationCap, tags: ["Estudio", "Crecimiento"], glow: "shadow-violet-500/20" },
              { title: "Banco de Frases", body: "Acceso rápido a líneas validadas para situaciones comunes, listas para copiar y pegar.", icon: Quote, tags: ["Recursos", "Acceso Rápido"], glow: "shadow-cyan-500/20" },
            ].map((c, idx) => (
              <div key={idx} className={`group liquid-glass rounded-[1.75rem] p-8 min-h-[380px] flex flex-col transition-all duration-300 hover:scale-[1.03] hover:bg-white/10 ${c.glow}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="liquid-glass h-12 w-12 rounded-[1rem] flex items-center justify-center bg-white/5"><c.icon className="h-6 w-6" /></div>
                  <div className="flex flex-wrap gap-1.5 justify-end max-w-[70%]">
                    {c.tags.map((t) => (<span key={t} className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-medium whitespace-nowrap bg-white/5">{t}</span>))}
                  </div>
                </div>
                <div className="flex-1" />
                <div className="mt-8">
                  <h3 className="font-heading italic text-3xl md:text-4xl tracking-[-1px] leading-none text-white group-hover:text-fuchsia-300 transition-colors">{c.title}</h3>
                  <p className="mt-4 text-sm text-slate-300 font-body font-light leading-relaxed">{c.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="academia" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-fuchsia-500/5 blur-[100px] rounded-full scale-50" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-heading italic font-bold mb-8 leading-tight">Formación <br />Continua.</h2>
              <p className="text-slate-400 text-lg font-body font-light leading-relaxed mb-10">
                El carisma es un músculo. Nuestra academia te proporciona la rutina diaria para fortalecerlo, con misiones accionables y teoría basada en la realidad, no en fantasías de internet.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Psicología del Valor", desc: "Entiende cómo se percibe el valor social y cómo elevar el tuyo." },
                  { title: "Dinámicas de Poder", desc: "Aprende a liderar la interacción sin ser agresivo." },
                  { title: "Comunicación No Verbal", desc: "Domina tu cuerpo para proyectar confianza antes de hablar." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 shrink-0 mt-1">
                      <Zap className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="text-sm text-slate-400 font-body font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border border-white/10 backdrop-blur-sm p-8 flex items-center justify-center">
                <div className="text-center">
                  <GraduationCap className="h-24 w-24 text-fuchsia-400 mx-auto mb-6 animate-bounce" />
                  <h3 className="text-2xl font-bold text-white italic">Misión Diaria</h3>
                  <p className="text-slate-400 text-sm mt-2">5 minutos de acción real.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-24 flex flex-col items-center text-center gap-6 relative pb-24">
        <div className="absolute inset-0 pointer-events-none bg-fuchsia-500/10 blur-[80px] rounded-full scale-75 z-0" />
        <h3 className="font-heading italic text-4xl md:text-5xl lg:text-6xl tracking-[-2px] leading-none max-w-2xl text-white z-10">
          Dejá de bloquearte. MAGNETO hace el trabajo pesado por vos.
        </h3>
        <p className="text-slate-400 text-xs md:text-sm max-w-md font-body font-light z-10 leading-relaxed">
          Aperturas, rescates, simulaciones y planes de cita — todo generado por IA, listo para usar, sin necesidad de experiencia previa.
        </p>
        <Link to="/dashboard" className="rounded-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-8 py-4 inline-flex items-center gap-3 text-base font-semibold text-white tracking-wide shadow-[0_15px_50px_-20px_rgba(168,85,247,0.7)] z-10 scale-100 hover:-translate-y-0.5 transition-transform duration-300">
          Abrir MAGNETO ahora <ArrowUpRight className="h-5 w-5" />
        </Link>
        <div className="z-10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/65">
          <Link to="/terminos" className="underline decoration-white/30 underline-offset-4 hover:text-white">Términos</Link>
          <Link to="/privacidad" className="underline decoration-white/30 underline-offset-4 hover:text-white">Privacidad</Link>
          <Link to="/premium" search={{ canceled: false }} className="underline decoration-white/30 underline-offset-4 hover:text-white">Planes y facturación</Link>
        </div>
      </div>
    </div>
  );
}
