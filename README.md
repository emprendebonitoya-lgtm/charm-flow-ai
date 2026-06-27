# MAGNETO - Carisma Operativo para el Hombre Moderno

MAGNETO es una aplicación de IA diseñada para hombres que quieren mejorar sus habilidades de carisma, seducción y comunicación. Utiliza inteligencia artificial para generar aperturas, rescatar chats, simular conversaciones y proporcionar educación continua.

## 🚀 Características Principales

### Módulos Core

- **Escáner**: Subí una foto de perfil y obtené 5-10 aperturas de alto impacto adaptadas a diferentes plataformas (Tinder, Bumble, Instagram, etc.)
- **SOS (Salvavidas)**: Rescatá chats que se enfriaron con líneas de recuperación efectivas
- **Simulador**: Entrená con 4 personalidades femeninas distintas (Valentina, Mía, Lucía, Camila) en chats simulados
- **Date Planner**: Planificá citas en 3 fases (apertura, conexión, cierre) con escenarios reales
- **Asistente**: Consultá al coach de carisma para preguntas específicas y estrategias

### Módulos Educativos

- **Academia**: 6 módulos con 30 lecciones sobre lenguaje corporal, conversación, mentalidad, citas, atracción y online dating
- **Biblioteca**: Píldoras de conocimiento organizadas por categorías (Mentalidad, Cuerpo, Citas, Conversación, Online)
- **Frases**: Banco de frases listas para copiar y pegar
- **Tu Día**: Misión diaria de 5 minutos para construir hábitos

### Sistema de Premium

- **Plan Gratis**: Escáner (3/día), SOS, Sim, Asistente, Date Planner, Frases y Feed con anuncios discretos
- **Premium**: Todo desbloqueado, sin anuncios, escaneos ilimitados, academia completa, biblioteca VIP

## 🛠️ Stack Tecnológico

- **Frontend**: React 19, TypeScript, Tailwind CSS 4
- **Framework**: TanStack Start (React Router + SSR)
- **UI Components**: Radix UI, shadcn/ui
- **Animaciones**: Framer Motion
- **Estado**: TanStack Query
- **Backend**: Supabase (autenticación), Stripe (pagos)
- **IA**: Groq API (Llama 3.3-70b) o Lovable AI Gateway
- **Build Tool**: Vite

## 📦 Instalación

1. **Clonar el repositorio**

```bash
git clone <tu-repo>
cd charm-flow-ai
```

2. **Instalar dependencias**

```bash
bun install
# o
npm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# IA (Groq API - gratuito)
GROQ_API_KEY=tu_api_key_aqui

# Opcional: Lovable AI Gateway
LOVABLE_API_KEY=tu_api_key_lovable

# Supabase (autenticación)
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key

# Stripe (pagos premium)
STRIPE_SECRET_KEY=tu_secret_key
STRIPE_PRICE_MONTHLY=tu_price_id_mensual
STRIPE_PRICE_ANNUAL=tu_price_id_anual
APP_URL=http://localhost:8080
VITE_SUPPORT_EMAIL=soporte@tu-dominio.com

# AdSense (publicidad)
VITE_ADSENSE_CLIENT=tu_client_id
VITE_ADSENSE_SLOT=tu_slot_id
```

4. **Ejecutar en desarrollo**

```bash
bun run dev
# o
npm run dev
```

5. **Build para producción**

```bash
bun run build
# o
npm run build
```

## 🎯 Uso de la IA

### Configuración de API Keys

**Opción 1: Groq API (Recomendado - Gratis)**

1. Registrate en [groq.com](https://groq.com)
2. Obten tu API key desde el dashboard
3. Configúrala en `GROQ_API_KEY`

**Opción 2: Lovable AI Gateway**

1. Si desplegás con Lovable, usa `LOVABLE_API_KEY`
2. La app tiene un fallback a respuestas predefinidas si no hay API key

### Modo Offline

La app funciona sin conexión usando respuestas predefinidas cuando no hay API key configurada.

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Assets estáticos (videos, imágenes)
├── components/      # Componentes reutilizables
│   ├── AppShell.tsx    # Layout principal
│   ├── AdBanner.tsx    # Banner de publicidad
│   └── ui/             # Componentes UI (shadcn)
├── hooks/           # Custom hooks
├── lib/             # Utilidades y funciones
│   ├── ai.functions.ts    # Funciones de IA
│   ├── storage.ts        # LocalStorage
│   ├── user.tsx          # Estado de usuario
│   ├── plans.ts          # Planes y precios
│   └── stripe.functions.ts # Integración Stripe
├── routes/          # Páginas de la app
│   ├── index.tsx         # Home
│   ├── landing.tsx       # Landing page
│   ├── escaner.tsx       # Escáner de perfiles
│   ├── sim.tsx           # Simulador
│   ├── ayuda.tsx         # Asistente
│   ├── academia.tsx      # Academia
│   ├── biblioteca.tsx    # Biblioteca
│   ├── premium.tsx       # Planes premium
│   └── ...
├── router.tsx       # Configuración de router
├── server.ts        # Server functions
└── styles.css       # Estilos globales
```

## 🔧 Configuración de Supabase

1. Crear un proyecto en [supabase.com](https://supabase.com)
2. Habilitar autenticación por email y Google
3. Copiar URL y Anon Key al `.env`
4. La app usa Supabase para:
   - Autenticación de usuarios
   - Sincronización de progreso premium
   - Guardado de historial

## 💳 Configuración de Stripe

1. Crear cuenta en [stripe.com](https://stripe.com)
2. Crear productos y precios para mensual y anual
3. Configurar webhooks para confirmar pagos
4. Copiar secret keys y price IDs al `.env`

### Checklist Producción (Premium sin desalineaciones)

1. Variables obligatorias en servidor:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_MONTHLY`
   - `STRIPE_PRICE_ANNUAL`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
2. Variable recomendada de soporte visible en legal:
   - `VITE_SUPPORT_EMAIL`
3. Endpoint webhook público activo:
   - `POST /api/stripe/webhook`
4. Eventos mínimos en Stripe Webhooks:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Probar en local con Stripe CLI:

```bash
stripe listen --forward-to localhost:8080/api/stripe/webhook
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

6. Verificar estado desde UI:
   - Abrir `/premium-debug`
   - Usar botón `Re-sync now` para forzar sincronización inmediata Stripe -> Supabase
   - Confirmar que el resultado pase a `Sincronizado`

7. Crear tabla de persistencia premium en Supabase:
   - Ejecutar la migración [supabase/migrations/20260625_create_billing_subscriptions.sql](supabase/migrations/20260625_create_billing_subscriptions.sql)
   - Si no usás Supabase CLI, podés pegar ese SQL en SQL Editor del dashboard y ejecutarlo una sola vez

## 🎨 Personalización

### Colores y Estilos

Los estilos usan Tailwind CSS con variables personalizadas en `styles.css`:

- Colores principales: fuchsia, violet, purple
- Efectos: glassmorphism, neon glow, gradientes
- Fuentes: Inter, Space Grotesk, Instrument Serif, Barlow

### Contenido Educativo

- Editar `src/routes/academia.tsx` para modificar lecciones
- Editar `src/routes/biblioteca.tsx` para modificar píldoras
- Editar `src/routes/frases.tsx` para modificar frases

## 🚀 Despliegue

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
netlify deploy --prod
```

### Docker

```bash
docker build -t magneto .
docker run -p 8080:8080 magneto
```

## 📊 Límites del Plan Gratis

- Escáner: 3 usos diarios
- Academia: 2 módulos (preview)
- Biblioteca: 4 píldoras (preview)
- Anuncios discretos en algunas páginas

## 🐛 Solución de Problemas

### La IA no responde

- Verifica que `GROQ_API_KEY` o `LOVABLE_API_KEY` estén configuradas
- La app usará respuestas predefinidas si no hay API key

### Error de Stripe

- Verifica que `STRIPE_SECRET_KEY` y los price IDs sean correctos
- Asegúrate de que `APP_URL` coincida con tu dominio

### Error de Supabase

- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sean correctos
- Habilita los providers de autenticación en el dashboard de Supabase

## 📝 Licencia

Este proyecto es propiedad privada. Todos los derechos reservados.

## 🤝 Contribuciones

Este es un proyecto privado. No se aceptan contribuciones externas en este momento.

## 📞 Soporte

Para soporte técnico, contacta al desarrollador principal.

---

**MAGNETO** - Carisma operativo para el hombre moderno. Magnetismo en código.
