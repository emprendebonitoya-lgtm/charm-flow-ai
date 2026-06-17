import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sun } from "lucide-react";

export const Route = createFileRoute("/tudia")({
  head: () => ({
    meta: [
      { title: "Tu Día · RIZZ.OS" },
      { name: "description", content: "Tu misión diaria de rizz: un reto pequeño para subir tu juego sin pensar." },
    ],
  }),
  component: TuDia,
});

const MISSIONS = [
  "Mandá un opener distinto a tus últimos 3 matches.",
  "Reactivá una conversación con una pregunta de 2 capas.",
  "Subí una foto nueva al perfil. Una que cuente historia.",
  "Practicá 5 minutos en el Sim antes de chatear de verdad.",
];

function TuDia() {
  const idx = new Date().getDate() % MISSIONS.length;
  return (
    <AppShell title="Tu Día" subtitle="Una misión, cinco minutos, mucho impacto.">
      <div className="neon-card rounded-2xl p-6 text-center">
        <Sun className="h-8 w-8 text-primary mx-auto mb-3" />
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Misión de hoy</div>
        <h2 className="font-display text-2xl mt-2">{MISSIONS[idx]}</h2>
      </div>
    </AppShell>
  );
}
