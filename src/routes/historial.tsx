import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import { getHistory, clearHistory, removeHistoryItem, type HistoryItem } from "@/lib/storage";
import { History as HistoryIcon, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/historial")({
  head: () => ({
    meta: [
      { title: "Historial · MAGNETO" },
      { name: "description", content: "Todo lo que generaste con MAGNETO, ordenado por fecha." },
    ],
  }),
  component: Historial,
});

function Historial() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => setItems(getHistory()), []);

  const copyItem = async (body: string) => {
    try {
      await navigator.clipboard.writeText(body);
      toast.success("Copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar");
    }
  };

  const deleteItem = (id: string) => {
    setItems(removeHistoryItem(id));
    toast.success("Eliminado del historial");
  };

  return (
    <AppShell title="Historial" subtitle="Cada respuesta generada queda acá.">
      {items.length > 0 && (
        <div className="flex justify-end mb-3">
          <button
            onClick={() => { clearHistory(); setItems([]); toast.success("Historial limpiado"); }}
            className="text-xs text-muted-foreground inline-flex items-center gap-1 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" /> Limpiar todo
          </button>
        </div>
      )}
      {items.length === 0 ? (
        <div className="neon-card rounded-2xl p-8 text-center text-muted-foreground">
          <HistoryIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
          Sin historial todavía.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.id} className="neon-card rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="pill">{i.title}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(i.createdAt).toLocaleString("es-AR")}
                    </span>
                  </div>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{i.body}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => copyItem(i.body)}
                    aria-label="Copiar"
                    className="p-2 rounded-xl hover:bg-white/10 text-muted-foreground hover:text-foreground transition"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(i.id)}
                    aria-label="Eliminar"
                    className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}
