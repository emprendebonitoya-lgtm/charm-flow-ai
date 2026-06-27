import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos de Servicio · MAGNETO" },
      { name: "description", content: "Términos y condiciones de uso de MAGNETO." },
    ],
  }),
  component: TerminosPage,
});

function TerminosPage() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL ?? "soporte@magneto.app";

  return (
    <AppShell title="Términos de Servicio" subtitle="Versión inicial para salida comercial.">
      <div className="space-y-5">
        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed">
          <p>
            Al usar MAGNETO aceptás estos términos. El servicio ofrece herramientas de entrenamiento
            conversacional y contenido educativo. El usuario es responsable del uso que hace de las
            recomendaciones.
          </p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Suscripciones y facturación</h2>
          <p>
            Los planes premium se cobran por Stripe y se renuevan automáticamente según el ciclo
            contratado.
          </p>
          <p>
            La gestión de método de pago, cancelación y cambios de plan se hace desde el portal de
            facturación.
          </p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Cancelación y reembolsos</h2>
          <p>
            Podés cancelar la renovación automática en cualquier momento desde el portal de
            facturación.
          </p>
          <p>
            La cancelación evita futuros cobros y mantiene acceso premium hasta el final del período
            ya pagado.
          </p>
          <p>
            Los pedidos de reembolso se evalúan caso por caso por soporte según la normativa
            aplicable y el historial de uso.
          </p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Conducta y límites de uso</h2>
          <p>
            No está permitido usar la plataforma para acoso, fraude, suplantación, spam o
            actividades ilegales.
          </p>
          <p>MAGNETO puede suspender cuentas ante abuso o incumplimiento de estos términos.</p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Contacto</h2>
          <p>
            Si necesitás soporte de facturación o legal, escribinos a{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              {supportEmail}
            </a>
            .
          </p>
          <div className="pt-2">
            <Link to="/premium" className="btn-ghost">
              Volver a Premium
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
