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

export const getSaved = () => read<HistoryItem[]>(SAVED_KEY, []);
export const toggleSaved = (item: HistoryItem) => {
  const list = getSaved();
  const exists = list.find((x) => x.id === item.id);
  const next = exists ? list.filter((x) => x.id !== item.id) : [item, ...list];
  write(SAVED_KEY, next);
  return next;
};
export const isSaved = (id: string) => getSaved().some((x) => x.id === id);

export const getProfile = () => read<Profile>(PROFILE_KEY, { tone: "coqueto", lang: "es" });
export const setProfile = (p: Profile) => write(PROFILE_KEY, p);
