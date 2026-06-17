import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca · RIZZ.OS" },
      { name: "description", content: "Frameworks, plantillas y guías largas para dominar las apps de citas." },
    ],
  }),
  component: Biblioteca,
});

const DOCS = [
  { t: "Framework PUSH-PULL", d: "La estructura detrás del flirteo bien hecho." },
  { t: "Anatomía de un perfil top", d: "Checklist con ejemplos buenos y malos." },
  { t: "El mapa de la conversación", d: "De match a cita en 4 estaciones." },
  { t: "Cómo escribir tu bio", d: "Plantillas para Tinder, Bumble, Hinge." },
];

function Biblioteca() {
  return (
    <AppShell title="Biblioteca" subtitle="Lectura larga, conocimiento denso.">
      <div className="grid grid-cols-1 gap-3">
        {DOCS.map((d, i) => (
          <div key={i} className="neon-card rounded-2xl p-4">
            <h3 className="font-display text-lg">{d.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{d.d}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
