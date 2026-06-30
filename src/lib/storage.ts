export type HistoryItem = {
  id: string;
  kind: "escaner" | "sos" | "sim" | "date" | "frase" | "bio";
  title: string;
  body: string;
  createdAt: number;
};

const HISTORY_KEY = "rizz_history_v1";
const SAVED_KEY = "rizz_saved_v1";
const PROFILE_KEY = "rizz_profile_v1";

export type Profile = {
  name?: string;
  gender?: "m" | "f" | "x";
  goal?: "ligar" | "relacion" | "amistad" | "reconquistar";
  tone?: "coqueto" | "gracioso" | "confiado" | "tierno";
  lang?: "es" | "en";
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const getHistory = () => read<HistoryItem[]>(HISTORY_KEY, []);
export const pushHistory = (item: Omit<HistoryItem, "id" | "createdAt">) => {
  const list = getHistory();
  const next: HistoryItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
  write(HISTORY_KEY, [next, ...list].slice(0, 200));
  return next;
};
export const clearHistory = () => write(HISTORY_KEY, []);
export const removeHistoryItem = (id: string) => {
  const next = getHistory().filter((x) => x.id !== id);
  write(HISTORY_KEY, next);
  return next;
};

export const getSaved = () => read<HistoryItem[]>(SAVED_KEY, []);
export const toggleSaved = (item: HistoryItem) => {
  const list = getSaved();
  const exists = list.find((x) => x.id === item.id);
  const next = exists ? list.filter((x) => x.id !== item.id) : [item, ...list];
  write(SAVED_KEY, next);
  return next;
};
export const isSaved = (id: string) => getSaved().some((x) => x.id === id);
export const removeSaved = (id: string) => {
  const next = getSaved().filter((x) => x.id !== id);
  write(SAVED_KEY, next);
  return next;
};

export const getProfile = () => read<Profile>(PROFILE_KEY, { tone: "coqueto", lang: "es" });
export const setProfile = (p: Profile) => write(PROFILE_KEY, p);

const PREMIUM_ONBOARDING_KEY = "magneto_premium_onboarding_v1";

type PremiumOnboardingProgress = {
  date: string;
  completed: Record<string, boolean>;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function defaultPremiumOnboardingProgress(): PremiumOnboardingProgress {
  return { date: getTodayKey(), completed: {} };
}

export const loadPremiumOnboardingProgress = () => {
  const progress = read<PremiumOnboardingProgress>(PREMIUM_ONBOARDING_KEY, defaultPremiumOnboardingProgress());
  if (progress.date !== getTodayKey()) return defaultPremiumOnboardingProgress();
  return progress;
};

export const savePremiumOnboardingProgress = (progress: PremiumOnboardingProgress) => write(PREMIUM_ONBOARDING_KEY, progress);

export const togglePremiumOnboardingTask = (id: string) => {
  const current = loadPremiumOnboardingProgress();
  const next = {
    date: getTodayKey(),
    completed: {
      ...current.completed,
      [id]: !current.completed[id],
    },
  };
  savePremiumOnboardingProgress(next);
  return next;
};

const PREMIUM_PROGRESS_HISTORY_KEY = "magneto_premium_progress_history_v1";

type PremiumProgressDay = {
  date: string;
  completed: number;
  total: number;
  tasks: string[];
};

export const loadPremiumProgressHistory = () => read<PremiumProgressDay[]>(PREMIUM_PROGRESS_HISTORY_KEY, []);

export const recordPremiumProgressDay = (completed: number, total: number, tasks: string[]) => {
  const today = getTodayKey();
  const history = loadPremiumProgressHistory();
  if (history[0]?.date === today) return history;
  const next: PremiumProgressDay[] = [
    { date: today, completed, total, tasks },
    ...history,
  ].slice(0, 30);
  write(PREMIUM_PROGRESS_HISTORY_KEY, next);
  return next;
};
