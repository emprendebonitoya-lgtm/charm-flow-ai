import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Plan = "monthly" | "annual";

type UserState = {
  isPremium: boolean;
  plan: Plan | null;
  onboarded: boolean;
  goal?: string;
  style?: string;
};

type UserContextValue = {
  state: UserState;
  subscribe: (plan: Plan) => void;
  completeOnboarding: (goal: string, style: string) => void;
  skipOnboarding: () => void;
  resetPremium: () => void;
};

const USER_STORAGE_KEY = "magneto_user_state";
const defaultState: UserState = {
  isPremium: false,
  plan: null,
  onboarded: false,
};

const UserContext = createContext<UserContextValue | null>(null);

function loadSavedState(): UserState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return defaultState;
    return JSON.parse(raw) as UserState;
  } catch {
    return defaultState;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(loadSavedState);

  useEffect(() => {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage failures
    }
  }, [state]);

  const subscribe = (plan: Plan) => {
    setState((current) => ({
      ...current,
      isPremium: true,
      plan,
    }));
  };

  const completeOnboarding = (goal: string, style: string) => {
    setState((current) => ({
      ...current,
      onboarded: true,
      goal,
      style,
    }));
  };

  const skipOnboarding = () => {
    setState((current) => ({
      ...current,
      onboarded: true,
    }));
  };

  const resetPremium = () => {
    setState(defaultState);
  };

  return (
    <UserContext.Provider value={{ state, subscribe, completeOnboarding, skipOnboarding, resetPremium }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
