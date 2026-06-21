import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { loadPremiumOnboardingProgress, togglePremiumOnboardingTask } from "@/lib/storage";
import { useUser } from "@/lib/user";
import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding · MAGNETO" },
      { name: "description", content: "Onboarding guiado para personalizar tu experiencia premium en MAGNETO." },
    ],
  }),
  component: Onboarding,
});

const goals = [
  "Dominar la conversación",
  "Cerrar más citas",
  "Subir mi presencia online",
];

const styles = [
  "Seductor directo",
  "Charla elegante",
  "Confianza magnética",
];

const PREMIUM_CHALLENGES = [
  {
    id: "photo",
    title: "Elegí tu mejor foto de perfil",
    description: "Seleccioná una imagen que muestre seguridad, estilo y autenticidad para atraer match instantáneo.",
  },
  {
    id: "opener",
    title: "Creá un opener premium",
    description: "Escribí un mensaje inicial poderoso que funcione para tu app favorita y genere curiosidad.",
  },
  {
    id: "invite",
    title: "Planeá una cita de impacto",
    description: "Diseñá una propuesta clara y atractiva para que el interés se transforme en un encuentro real.",
  },
];

function Onboarding() {
  const { state, completeOnboarding, skipOnboarding } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(state.goal || goals[0]);
  const [style, setStyle] = useState(state.style || styles[0]);
  const todayKey = new Date().toISOString().slice(0, 10);
  const [challengeProgress, setChallengeProgress] = useState(() => loadPremiumOnboardingProgress());

  useEffect(() => {
    if (challengeProgress.date !== todayKey) {
      setChallengeProgress({ date: todayKey, completed: {} });
    }
  }, [challengeProgress.date, todayKey]);

  const toggleChallengeTask = (id: string) => {
    setChallengeProgress(togglePremiumOnboardingTask(id));
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    completeOnboarding(goal, style);
    navigate("/");
  };

  const handleSkip = () => {
    skipOnboarding();
    navigate({ to: "/" });
  };

  return (
    <AppShell title="Onboarding" subtitle="Personalizá tu camino con MAGNETO.">
      <div className="space-y-6">
        <div className="neon-card rounded-3xl p-6 border border-[rgba(168,85,247,0.16)]">
          <div className="flex items-center gap-3 text-white mb-4">
            <Sparkles className="h-5 w-5 text-fuchsia-300" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Tu perfil</div>
              <div className="text-xl font-semibold">Construí tu ruta personalizada.</div>
            </div>
          </div>
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-[#E0E7FF]/80">Elegí tu objetivo principal para que MAGNETO te sugiera los mejores contenidos.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {goals.map((option) => (
                  <button
                    key={option}
                    onClick={() => setGoal(option)}
                    className={`rounded-3xl border px-4 py-4 text-left transition ${goal === option ? "border-fuchsia-400 bg-white/10" : "border-white/10 bg-white/5"}`}
                  >
                    <div className="text-sm font-semibold text-white">{option}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-[#E0E7FF]/80">Seleccioná el estilo que mejor represente tu energía en la interacción.</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {styles.map((option) => (
                  <button
                    key={option}
                    onClick={() => setStyle(option)}
                    className={`rounded-3xl border px-4 py-4 text-left transition ${style === option ? "border-fuchsia-400 bg-white/10" : "border-white/10 bg-white/5"}`}
                  >
                    <div className="text-sm font-semibold text-white">{option}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-[#E0E7FF]/80">Resumen</p>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-[#E0E7FF]/80">
                <div className="mb-3">
                  <div className="text-[11px] uppercase tracking-[0.3em] text-[#D8B4FE]/70">Meta</div>
                  <div className="mt-2 text-white font-semibold">{goal}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.3em] text-[#D8B4FE]/70">Estilo</div>
                  <div className="mt-2 text-white font-semibold">{style}</div>
                </div>
              </div>
              <p className="text-sm text-[#E0E7FF]/80">Terminá el onboarding y MAGNETO personaliza tu experiencia. Podés explorar gratis sin suscripción.</p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <button onClick={handleNext} className="btn-cyber inline-flex items-center justify-center gap-2">
              {step === 2 ? "Completar onboarding" : "Continuar"}
              <ArrowRight className="h-4 w-4" />
            </button>
            {step > 0 && (
              <button onClick={() => setStep((current) => current - 1)} className="btn-ghost">
                Volver
              </button>
            )}
            <button onClick={handleSkip} className="btn-ghost text-muted-foreground">
              Explorar sin registro
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
          <div className="flex items-start gap-3 text-white">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-1" />
            <div>
              <div className="text-sm font-semibold">Tu onboarding importa.</div>
              <p className="mt-2 text-sm text-[#E0E7FF]/80 leading-relaxed">Con estos datos, MAGNETO te recomienda las guías y búsquedas que más impacto tienen para tu objetivo y estilo. El proceso es corto y va directo a mejorar tus resultados.</p>
            </div>
          </div>
        </div>

        {state.isPremium && (
          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Reto Premium del día</div>
                <div className="text-xl font-semibold text-white">Completa tus acciones premium</div>
              </div>
              <div className="rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#D8B4FE]/80">
                {Object.values(challengeProgress.completed).filter(Boolean).length}/{PREMIUM_CHALLENGES.length} completados
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {PREMIUM_CHALLENGES.map((task) => {
                const done = !!challengeProgress.completed[task.id];
                return (
                  <button
                    key={task.id}
                    onClick={() => toggleChallengeTask(task.id)}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${done ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5 hover:border-fuchsia-400"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">{task.title}</div>
                        <p className="mt-2 text-[13px] text-[#E0E7FF]/75">{task.description}</p>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${done ? "bg-emerald-500/15 text-emerald-200" : "bg-white/10 text-[#BFDBFE]/80"}`}>
                        {done ? "Completado" : "Marcar"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-[#BFDBFE]/70">Se reinicia cada día para que mantengas el hábito.</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link to="/premium" className="btn-ghost">
            Ver planes premium
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
