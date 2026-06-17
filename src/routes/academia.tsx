import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { GraduationCap, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/academia")({
  head: () => ({
    meta: [
      { title: "Academia · RIZZ.OS" },
      { name: "description", content: "Lecciones cortas y accionables para subir tu juego: openers, escalada, lectura de señales y cierre." },
    ],
  }),
  component: Academia,
});

const LESSONS = [
  { t: "Openers que no son '¿hola, cómo estás?'", d: "5 fórmulas que generan respuesta el 70% de las veces.", lvl: "Básico" },
  { t: "Cómo escalar sin sonar intenso", d: "El framework push-pull aplicado a chats.", lvl: "Intermedio" },
  { t: "Leer señales de interés real", d: "Patrones de respuesta, tiempos, emojis.", lvl: "Intermedio" },
  { t: "Cerrar para una cita en 6 mensajes", d: "Plantilla con bifurcaciones.", lvl: "Avanzado" },
  { t: "Manejar el ghosting", d: "Re-engagement messages que funcionan.", lvl: "Avanzado" },
];

function Academia() {
  return (
    <AppShell title="Academia" subtitle="Mini lecciones para subir de nivel.">
      <div className="space-y-3">
        {LESSONS.map((l, i) => (
          <button key={i} className="w-full text-left neon-card rounded-2xl p-4 flex items-center gap-3 hover:neon-glow transition">
            <div className="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{l.t}</div>
              <div className="text-xs text-muted-foreground">{l.d}</div>
            </div>
            <span className="pill">{l.lvl}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </AppShell>
  );
}
