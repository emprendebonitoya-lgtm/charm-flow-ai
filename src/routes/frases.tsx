import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/frases")({
  head: () => ({
    meta: [
      { title: "Frases · RIZZ.OS" },
      { name: "description", content: "Banco de frases con rizz por categoría: openers, comebacks, halagos y cierres." },
    ],
  }),
  component: Frases,
});

const CATS = [
  {
    name: "Openers",
    items: [
      "Tu perfil está peligrosamente bien curado. ¿Es estrategia o talento natural?",
      "Necesito una segunda opinión: ¿pizza con piña, crimen o malentendido cultural?",
      "Vas a pensar que esto es un opener random, pero juro que tengo una teoría sobre vos.",
    ],
  },
  {
    name: "Comebacks",
    items: [
      "Cuidado, estás peligrosamente cerca de caerme bien.",
      "Eso fue tan tu estilo que ya lo sentí venir tres mensajes antes.",
    ],
  },
  {
    name: "Cierres",
    items: [
      "Esto ya pide café. ¿Jueves o viernes?",
      "Te debo una historia mejor en persona. ¿Cuándo?",
    ],
  },
];

function Frases() {
  return (
    <AppShell title="Frases" subtitle="Copiá, adaptá, mandá.">
      <div className="space-y-5">
        {CATS.map((c) => (
          <section key={c.name}>
            <div className="text-[11px] tracking-[0.25em] text-muted-foreground uppercase mb-2">
              {c.name}
            </div>
            <div className="space-y-2">
              {c.items.map((t, i) => (
                <div key={i} className="neon-card rounded-2xl p-3 flex items-start gap-2">
                  <p className="text-sm flex-1">{t}</p>
                  <button
                    onClick={() => { navigator.clipboard.writeText(t); toast.success("Copiado"); }}
                    className="p-2 rounded-lg hover:bg-primary/10"
                  >
                    <Copy className="h-4 w-4 text-primary" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
