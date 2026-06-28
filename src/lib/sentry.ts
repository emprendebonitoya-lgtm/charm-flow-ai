import * as Sentry from "@sentry/react";

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // 10% de las transacciones en producción
    replaysSessionSampleRate: 0.1, // 10% de las sesiones
    replaysOnErrorSampleRate: 1.0, // 100% de las sesiones con errores
    environment: import.meta.env.MODE,
    beforeSend(event) {
      // Filtrar errores sensibles
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.type === "ChunkLoadError") {
          // Ignorar errores de carga de chunks comunes en SPA
          return null;
        }
      }
      return event;
    },
  });
}

export { Sentry };
