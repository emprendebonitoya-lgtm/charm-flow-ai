import { FREE_LIMITS } from "@/lib/plans";

const SCAN_USAGE_KEY = "magneto_scan_usage";
const MAX_FREE_SCANS = FREE_LIMITS.scannerDaily;

type ScanUsage = {
  date: string;
  used: number;
  bonus: number;
};

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function defaultUsage(): ScanUsage {
  return { date: getTodayDate(), used: 0, bonus: 0 };
}

export function loadScanUsage(): ScanUsage {
  if (typeof window === "undefined") return defaultUsage();
  try {
    const raw = window.localStorage.getItem(SCAN_USAGE_KEY);
    if (!raw) return defaultUsage();
    const parsed = JSON.parse(raw) as ScanUsage;
    if (parsed.date !== getTodayDate()) return defaultUsage();
    return { ...defaultUsage(), ...parsed };
  } catch {
    return defaultUsage();
  }
}

export function saveScanUsage(usage: ScanUsage) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SCAN_USAGE_KEY, JSON.stringify(usage));
  } catch {
    // ignore storage failures
  }
}

export function getAvailableScans(usage: ScanUsage, isPremium: boolean) {
  if (isPremium) return Number.POSITIVE_INFINITY;
  return Math.max(0, MAX_FREE_SCANS + usage.bonus - usage.used);
}

export function recordScan(usage: ScanUsage) {
  const next = { ...usage, used: usage.used + 1, date: getTodayDate() };
  saveScanUsage(next);
  return next;
}

export function claimAdBonus(usage: ScanUsage) {
  const next = { ...usage, bonus: usage.bonus + 1, date: getTodayDate() };
  saveScanUsage(next);
  return next;
}

export function getFreeScansText(usage: ScanUsage, isPremium: boolean) {
  if (isPremium) return "Escaneos ilimitados";
  return `${getAvailableScans(usage, false)} de ${MAX_FREE_SCANS} gratis hoy`;
}
