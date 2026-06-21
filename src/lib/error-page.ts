export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>MAGNETO — Error</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #040814; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; background: rgba(10,16,42,0.88); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #cbd5e1; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.75rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #a855f7; color: #fff; }
      .secondary { background: transparent; color: #f8fafc; border-color: rgba(255,255,255,0.15); }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>No se pudo cargar la página</h1>
      <p>Algo salió mal. Podés intentar de nuevo o volver al inicio.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Reintentar</button>
        <a class="secondary" href="/">Volver al inicio</a>
      </div>
    </div>
  </body>
</html>`;
}
