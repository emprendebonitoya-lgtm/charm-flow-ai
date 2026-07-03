type AdKind = "banner" | "interstitial" | "rewarded";

type AdSessionState = {
  sessionStartedAt: number;
  lastSeenAt: number;
  impacts: number;
  interstitialLastAt: number | null;
};

const AD_POLICY_KEY = "magneto_ad_policy";
const SESSION_TTL_MS = 30 * 60 * 1000;
const INTERSTITIAL_COOLDOWN_MS = 8 * 60 * 1000;
const MAX_AD_IMPACTS_PER_SESSION = 2;

function now() {
  return Date.now();
}

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function defaultState(): AdSessionState {
  const timestamp = now();
  return {
    sessionStartedAt: timestamp,
    lastSeenAt: timestamp,
    impacts: 0,
    interstitialLastAt: null,
  };
}

function hasExpired(state: AdSessionState) {
  return now() - state.lastSeenAt > SESSION_TTL_MS;
}

function saveState(state: AdSessionState) {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(AD_POLICY_KEY, JSON.stringify(state));
  } catch {
    // ignore storage failures
  }
}

function loadState(): AdSessionState {
  const storage = getStorage();
  if (!storage) return defaultState();
  try {
    const raw = storage.getItem(AD_POLICY_KEY);
    if (!raw) {
      const state = defaultState();
      saveState(state);
      return state;
    }
    const parsed = JSON.parse(raw) as Partial<AdSessionState>;
    const merged: AdSessionState = {
      ...defaultState(),
      ...parsed,
      lastSeenAt: now(),
    };

    if (hasExpired(merged)) {
      const reset = defaultState();
      saveState(reset);
      return reset;
    }

    saveState(merged);
    return merged;
  } catch {
    const state = defaultState();
    saveState(state);
    return state;
  }
}

export function getAdPolicySnapshot() {
  const state = loadState();
  return {
    impacts: state.impacts,
    impactsRemaining: Math.max(0, MAX_AD_IMPACTS_PER_SESSION - state.impacts),
    interstitialCooldownRemainingMs: state.interstitialLastAt
      ? Math.max(0, INTERSTITIAL_COOLDOWN_MS - (now() - state.interstitialLastAt))
      : 0,
  };
}

export function canConsumeAd(kind: AdKind) {
  const state = loadState();

  if (state.impacts >= MAX_AD_IMPACTS_PER_SESSION) {
    return false;
  }

  if (kind === "interstitial" && state.interstitialLastAt) {
    if (now() - state.interstitialLastAt < INTERSTITIAL_COOLDOWN_MS) {
      return false;
    }
  }

  return true;
}

export function consumeAd(kind: AdKind) {
  if (!canConsumeAd(kind)) return false;

  const state = loadState();
  const next: AdSessionState = {
    ...state,
    impacts: state.impacts + 1,
    lastSeenAt: now(),
    interstitialLastAt: kind === "interstitial" ? now() : state.interstitialLastAt,
  };
  saveState(next);
  return true;
}
