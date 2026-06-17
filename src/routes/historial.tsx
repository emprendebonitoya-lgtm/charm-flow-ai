import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { getHistory, clearHistory, type HistoryItem } from "@/lib/storage";
import { History as HistoryIcon, Trash2 } from "lucide-react";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: "Historial · RIZZ.OS" },
      { name: "description", content: "Todo lo que generaste con RIZZ.OS, ordenado por fecha." },
    ],
  }),
  component: Historial,
});

function Historial() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => setItems(getHistory()), []);
  return (
    <AppShell title="Historial" subtitle="Cada respuesta generada queda acá.">
      <div className="flex justify-end mb-3">
        <button
          onClick={() => { clearHistory(); setItems([]); }}
          className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" /> limpiar
        </button>
      </div>
      {items.length === 0 ? (
        <div className="neon-card rounded-2xl p-8 text-center text-muted-foreground">
          <HistoryIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
          Sin historial todavía.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="neon-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="pill">{i.title}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(i.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-2 whitespace-pre-wrap">{i.body}</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
