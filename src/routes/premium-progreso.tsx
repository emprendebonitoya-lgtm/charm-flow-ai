import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/lib/user";
import { loadPremiumOnboardingProgress, loadPremiumProgressHistory, recordPremiumProgressDay, togglePremiumOnboardingTask } from "@/lib/storage";
import { CheckCircle2, Trophy, Shield } from "lucide-react";

export const Route = createFileRoute("/premium-progreso")({
  head: () => ({
    meta: [
      { title: "Progreso Premium · MAGNETO" },
      { name: "description", content: "Tu historial de retos premium, rachas y certificados diarios." },
    ],
  }),
  component: PremiumProgreso,
});

type Challenge = {
  id: string;
  title: string;
  description: string;
};

const PREMIUM_CHALLENGES: Challenge[] = [
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

type ProgressEntry = {
  date: string;
  completed: number;
  total: number;
  tasks: string[];
};

function buildCertificate(streak: number) {
  if (streak >= 30) return "Certificado de Maestría Premium";
  if (streak >= 14) return "Certificado de Constancia";
  if (streak >= 7) return "Certificado de Racha Premium";
  return null;
}

function computeStreak(history: ProgressEntry[]) {
  if (!history.length) return 0;
  let streak = 1;
  const today = new Date();
  const parseDate = (value: string) => new Date(value + "T00:00:00");
  let previous = parseDate(history[0].date);

  for (let i = 1; i < history.length; i += 1) {
    const current = parseDate(history[i].date);
    const diff = Math.round((previous.getTime() - current.getTime()) / 86400000);
    if (diff === 1) {
      streak += 1;
      previous = current;
    } else {
      break;
    }
  }

  return streak;
}

function PremiumProgreso() {
  const { state } = useUser();
  const [progress, setProgress] = useState(loadPremiumOnboardingProgress());
  const [history, setHistory] = useState(loadPremiumProgressHistory());

  useEffect(() => {
    setProgress(loadPremiumOnboardingProgress());
  }, []);

  const completedCount = useMemo(
    () => PREMIUM_CHALLENGES.filter((task) => progress.completed[task.id]).length,
    [progress],
  );

  const allDone = completedCount === PREMIUM_CHALLENGES.length;
  const streak = useMemo(() => computeStreak(history), [history]);
  const certificate = buildCertificate(streak);

  const handleToggleTask = (id: string) => {
    setProgress(togglePremiumOnboardingTask(id));
  };

  const handleRecordDay = () => {
    if (!allDone) return;
    setHistory(recordPremiumProgressDay(completedCount, PREMIUM_CHALLENGES.length, Object.keys(progress.completed).filter((id) => progress.completed[id])));
  };

  return (
    <AppShell title="Progreso Premium" subtitle="Historial, rachas y certificados por tu constancia." >
      <div className="space-y-6">
        <div className="neon-card rounded-3xl p-6 border border-[rgba(168,85,247,0.16)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Estado premium</div>
              <div className="mt-2 text-3xl font-semibold text-white">{state.isPremium ? "Premium activo" : "Necesitás premium"}</div>
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-[#E0E7FF]/85">
              {state.isPremium ? "Acceso completo" : "Suscribite para ver todo"}
            </div>
          </div>
          {!state.isPremium && (
            <div className="mt-6">
              <Link to="/premium" className="btn-cyber">
                Ir a Premium
              </Link>
            </div>
          )}
        </div>

        {state.isPremium ? (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Racha actual</div>
                <div className="mt-3 text-3xl font-semibold text-white">{streak} días</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Días registrados</div>
                <div className="mt-3 text-3xl font-semibold text-white">{history.length}</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Certificado</div>
                <div className="mt-3 text-3xl font-semibold text-white">{certificate ?? "En camino"}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center gap-3 text-white mb-4">
                <Shield className="h-5 w-5 text-fuchsia-300" />
                <div>
                  <div className="text-sm uppercase tracking-[0.28em] text-[#D8B4FE]/70">Retos diarios</div>
                  <div className="text-lg font-semibold">Marca tus avances para el día de hoy</div>
                </div>
              </div>
              <div className="space-y-3">
                {PREMIUM_CHALLENGES.map((task) => {
                  const done = !!progress.completed[task.id];
                  return (
                    <button
                      key={task.id}
                      onClick={() => handleToggleTask(task.id)}
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
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleRecordDay}
                  disabled={!allDone}
                  className="btn-cyber w-full sm:w-auto"
                >
                  Guardar día completo
                </button>
                <div className="text-sm text-[#BFDBFE]/70">Completa todas las tareas para registrar el día premium.</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#D8B4FE]/70">Historial de progreso</div>
                  <div className="text-lg font-semibold text-white">Tus días registrados</div>
                </div>
                <Trophy className="h-6 w-6 text-yellow-300" />
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-[#E0E7FF]/80">Aún no registraste un día completo. Marca tus retos y guarda tu progreso para ver el historial.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <div key={entry.date} className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.05)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm uppercase tracking-[0.24em] text-[#BFDBFE]/70">{entry.date}</div>
                          <div className="mt-2 font-semibold text-white">{entry.completed}/{entry.total} retos completos</div>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#E0E7FF]/80">{entry.completed === entry.total ? "Perfecto" : "Parcial"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.04)] p-6">
            <div className="text-sm text-[#E0E7FF]/80">Para ver tu progreso, rachas y certificados necesitas activar Premium. Aquí podés suscribirte y volver a esta página cuando tu cuenta esté activa.</div>
            <div className="mt-4">
              <Link to="/premium" className="btn-cyber">
                Suscribirme ahora
              </Link>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link to="/onboarding" className="btn-ghost">
            Volver al onboarding
          </Link>
          <Link to="/premium" className="btn-ghost">
            Ver planes premium
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
