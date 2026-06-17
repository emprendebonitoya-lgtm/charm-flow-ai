import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Feed · RIZZ.OS" },
      { name: "description", content: "Tips diarios, micro-historias y trucos virales sobre citas y conversación." },
    ],
  }),
  component: Feed,
});

const POSTS = [
  { tag: "TIP", t: "El 'segundo opener'", d: "Si no responde en 24h, mandá una sola frase que cambie el ángulo. No insistas en el primer tema." },
  { tag: "HISTORIA", t: "Me ghostearon, recuperé el match", d: "Una semana después usé el comeback de la lección 3 y arreglamos una cita." },
  { tag: "TRUCO", t: "Pregunta de 2 capas", d: "Hacé una pregunta concreta + una excusa para escalar. Triplica la tasa de respuesta." },
];

function Feed() {
  return (
    <AppShell title="Feed" subtitle="Algo nuevo cada día.">
      <div className="space-y-3">
        {POSTS.map((p, i) => (
          <article key={i} className="neon-card rounded-2xl p-4">
            <span className="pill">{p.tag}</span>
            <h3 className="font-display text-lg mt-2">{p.t}</h3>
            <p className="text-sm text-muted-foreground mt-1">{p.d}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
