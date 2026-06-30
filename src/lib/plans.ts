export const FREE_LIMITS = {
  scannerDaily: 3,
  scannerResults: 5,
  academiaModules: 2,
  bibliotecaPills: 4,
} as const;

export const PRICING = {
  monthly: { amount: 19, currency: "USD", label: "Mensual" },
  annual: { amount: 149, currency: "USD", label: "Anual" },
} as const;

export type PlanFeature = {
  id: string;
  name: string;
  free: string;
  premium: string;
  freeOk: boolean;
};

export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: "scanner",
    name: "Escáner IA",
    free: `${FREE_LIMITS.scannerDaily} escaneos/día · ${FREE_LIMITS.scannerResults} aperturas · anuncios opcionales`,
    premium: "Ilimitado · 10 aperturas · análisis estratégico",
    freeOk: true,
  },
  {
    id: "sos",
    name: "Salvavidas (SOS)",
    free: "Rescates ilimitados",
    premium: "Rescates ilimitados",
    freeOk: true,
  },
  {
    id: "sim",
    name: "Simulador",
    free: "4 personalidades · entrenamiento ilimitado",
    premium: "Igual + prioridad en mejoras futuras",
    freeOk: true,
  },
  {
    id: "assistant",
    name: "Asistente IA",
    free: "Chat ilimitado (con anuncios discretos)",
    premium: "Chat sin anuncios",
    freeOk: true,
  },
  {
    id: "date",
    name: "Date Planner",
    free: "Planes de cita completos",
    premium: "Igual + plantillas VIP futuras",
    freeOk: true,
  },
  {
    id: "frases",
    name: "Frases · Feed · Tu Día",
    free: "Acceso completo",
    premium: "Acceso completo",
    freeOk: true,
  },
  {
    id: "academia",
    name: "Academia",
    free: `${FREE_LIMITS.academiaModules} módulos de 6`,
    premium: "6 módulos · 30 lecciones",
    freeOk: true,
  },
  {
    id: "biblioteca",
    name: "Biblioteca Mindset",
    free: `${FREE_LIMITS.bibliotecaPills} píldoras · resto bloqueado`,
    premium: "Todas las píldoras desbloqueadas",
    freeOk: true,
  },
  {
    id: "ads",
    name: "Publicidad",
    free: "Anuncios en la app · ver ad = +1 escaneo extra",
    premium: "Sin anuncios",
    freeOk: true,
  },
  {
    id: "progress",
    name: "Progreso premium",
    free: "No incluido",
    premium: "Rachas, retos diarios y onboarding VIP",
    freeOk: false,
  },
];

export const FREE_MODULE_IDS = [
  "escaner",
  "sos",
  "sim",
  "ayuda",
  "date",
  "frases",
  "feed",
  "tudia",
  "guardados",
  "historial",
] as const;
export const PREMIUM_MODULE_IDS = [
  "academia-full",
  "biblioteca-full",
  "scanner-unlimited",
  "no-ads",
  "progress",
] as const;

function getPublicEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY" | "VITE_ADSENSE_CLIENT") {
  const viteValue = import.meta.env?.[name] as string | undefined;
  if (viteValue) return viteValue;
  if (typeof process !== "undefined" && process.env) {
    return process.env[name];
  }
  return undefined;
}

export function isSupabaseConfigured() {
  return !!(getPublicEnv("VITE_SUPABASE_URL") && getPublicEnv("VITE_SUPABASE_ANON_KEY"));
}

export function isAdSenseConfigured() {
  return !!getPublicEnv("VITE_ADSENSE_CLIENT");
}
