import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase";
import { isSupabaseConfigured } from "@/lib/plans";

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
  authUser: User | null;
  authLoading: boolean;
  authConfigured: boolean;
  subscribe: (plan: Plan) => void;
  completeOnboarding: (goal: string, style: string) => void;
  skipOnboarding: () => void;
  resetPremium: () => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
  const authConfigured = isSupabaseConfigured();
  const [state, setState] = useState<UserState>(loadSavedState);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(authConfigured);

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

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let active = true;

    const syncFromUser = (user: User | null) => {
      setAuthUser(user);
      const metadata = (user?.user_metadata ?? {}) as {
        is_premium?: boolean;
        plan?: Plan | null;
      };
      if (typeof metadata.is_premium === "boolean") {
        setState((current) => ({
          ...current,
          isPremium: metadata.is_premium ?? current.isPremium,
          plan: metadata.plan ?? current.plan,
        }));
      }
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        syncFromUser(data.session?.user ?? null);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      syncFromUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no configurado.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no configurado.");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no configurado.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <UserContext.Provider
      value={{
        state,
        authUser,
        authLoading,
        authConfigured,
        subscribe,
        completeOnboarding,
        skipOnboarding,
        resetPremium,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
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
