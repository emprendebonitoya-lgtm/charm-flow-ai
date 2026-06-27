import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad · MAGNETO" },
      { name: "description", content: "Política de privacidad y tratamiento de datos de MAGNETO." },
    ],
  }),
  component: PrivacidadPage,
});

function PrivacidadPage() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL ?? "soporte@magneto.app";

  return (
    <AppShell title="Política de Privacidad" subtitle="Resumen de tratamiento de datos en MAGNETO.">
      <div className="space-y-5">
        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Datos que procesamos</h2>
          <p>
            Procesamos datos de cuenta (email/ID), actividad dentro de la app y datos de suscripción
            necesarios para facturación.
          </p>
          <p>
            Los pagos son procesados por Stripe. MAGNETO no almacena datos completos de tarjeta.
          </p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Uso de la información</h2>
          <p>
            Usamos tus datos para autenticarte, habilitar funciones premium, mejorar el producto y
            brindar soporte.
          </p>
          <p>No vendemos tus datos personales a terceros.</p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Conservación y seguridad</h2>
          <p>
            Aplicamos medidas razonables de seguridad y mantenemos datos el tiempo necesario para
            operación, soporte y cumplimiento legal.
          </p>
          <p>Podés solicitar baja de cuenta y eliminación de datos según normativa aplicable.</p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed space-y-3">
          <h2 className="text-white text-lg font-semibold">Facturación y proveedores</h2>
          <p>
            Stripe actúa como procesador de pagos para suscripciones. MAGNETO almacena solo datos
            mínimos de facturación para habilitar y sincronizar tu estado premium.
          </p>
          <p>
            Podés gestionar tu suscripción y métodos de pago desde el portal de facturación sin
            compartir datos sensibles de tarjeta dentro de MAGNETO.
          </p>
        </section>

        <section className="neon-card rounded-3xl p-6 text-sm text-[#E0E7FF]/85 leading-relaxed">
          <p>
            Para consultas de privacidad, escribinos a{" "}
            <a
              href={`mailto:${supportEmail}`}
              className="underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              {supportEmail}
            </a>
            .
          </p>
          <div className="pt-3">
            <Link to="/premium" className="btn-ghost">
              Volver a Premium
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
