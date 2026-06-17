import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { getSaved, type HistoryItem } from "@/lib/storage";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/guardados")({
  head: () => ({
    meta: [
      { title: "Guardados · RIZZ.OS" },
      { name: "description", content: "Tus respuestas y frases favoritas, siempre a un toque." },
    ],
  }),
  component: Guardados,
});

function Guardados() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => setItems(getSaved()), []);
  return (
    <AppShell title="Guardados" subtitle="Tus favoritos rescatables.">
      {items.length === 0 ? (
        <div className="neon-card rounded-2xl p-8 text-center text-muted-foreground">
          <Bookmark className="h-6 w-6 mx-auto mb-2 text-primary" />
          Todavía no guardaste nada. Tocá el ícono de marcador en una respuesta.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="neon-card rounded-2xl p-4">
              <span className="pill">{i.title}</span>
              <p className="text-sm mt-2 whitespace-pre-wrap">{i.body}</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
