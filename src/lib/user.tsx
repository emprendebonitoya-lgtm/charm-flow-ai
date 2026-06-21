import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
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

function applySessionMetadata(session: Session | null, setState: React.Dispatch<React.SetStateAction<UserState>>) {
  if (!session?.user) return;
  const meta = session.user.user_metadata ?? {};
  setState((current) => ({
    ...current,
    onboarded: current.onboarded || !!meta.onboarded,
    goal: current.goal ?? meta.goal,
    style: current.style ?? meta.style,
    isPremium: current.isPremium || !!meta.is_premium,
    plan: current.plan ?? (meta.plan === "annual" ? "annual" : meta.plan === "monthly" ? "monthly" : null),
  }));
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(loadSavedState);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured());

  useEffect(() => {
    try {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage failures
    }
  }, [state]);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setAuthUser(data.session?.user ?? null);
      applySessionMetadata(data.session, setState);
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      applySessionMetadata(session, setState);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

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
    void getSupabase()?.auth.updateUser({ data: { onboarded: true, goal, style } });
  };

  const skipOnboarding = () => {
    setState((current) => ({
      ...current,
      onboarded: true,
    }));
    void getSupabase()?.auth.updateUser({ data: { onboarded: true } });
  };

  const resetPremium = () => {
    setState(defaultState);
  };

  const signInWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no está configurado.");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no está configurado.");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const supabase = getSupabase();
    if (!supabase) throw new Error("Supabase no está configurado.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/login` },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) await supabase.auth.signOut();
    setAuthUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        state,
        authUser,
        authLoading,
        authConfigured: isSupabaseConfigured(),
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
