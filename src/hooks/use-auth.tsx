import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  username: string;
  email: string | null;
  coins: number;
  total_spins: number;
  total_wins: number;
  biggest_win: number;
};

type Ctx = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).maybeSingle();
    if (data) {
      setProfile(data as Profile);
      return;
    }

    // Fallback: if the trigger didn't create the row, create it from the current user.
    const { data: userData } = await supabase.auth.getUser();
    const u = userData.user;
    if (!u) return;
    const username =
      (u.user_metadata?.username as string) ||
      u.email?.split("@")[0] ||
      `hrac_${uid.slice(0, 6)}`;
    const { data: inserted } = await supabase
      .from("profiles")
      .insert({ id: uid, username, email: u.email ?? null })
      .select("*")
      .maybeSingle();
    if (inserted) setProfile(inserted as Profile);
  };

  useEffect(() => {
    // CRITICAL: never `await` supabase calls inside onAuthStateChange —
    // supabase-js holds an auth lock across the callback, which deadlocks any
    // later `getSession()` (e.g. the attachSupabaseAuth bearer middleware
    // before every server function). Defer async work via setTimeout(0).
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const uid = s.user.id;
        setTimeout(() => {
          loadProfile(uid).finally(() => setLoading(false));
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const uid = data.session.user.id;
        loadProfile(uid).finally(() => setLoading(false));
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) await loadProfile(user.id);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthCtx.Provider value={{ user, session, profile, loading, refreshProfile, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}