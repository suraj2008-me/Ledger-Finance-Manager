import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";

const APP_URL = (
  import.meta.env.VITE_APP_URL || window.location.origin
).replace(/\/$/, "");

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) {
      setProfile(data);
    } else {
      const { data: created } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          base_currency: "INR",
          theme: "light",
          full_name: "",
        })
        .select()
        .maybeSingle();
      setProfile(created ?? null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      loadProfile(data.session?.user?.id);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      loadProfile(s?.user?.id);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const signUp = (email, password, fullName) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${APP_URL}/login`,
      },
    });

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  const refreshProfile = () => loadProfile(session?.user?.id);

  const updateProfile = async (patch) => {
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", session.user.id)
      .select()
      .maybeSingle();
    if (!error) setProfile(data);
    return { data, error };
  };

  // Sends a password-recovery email with a link back to /reset-password.
  const resetPasswordForEmail = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${APP_URL}/reset-password`,
    });

  // Used both by the /reset-password recovery link flow and by the
  // "change password" form in Settings (after re-verifying the current one).
  const updatePassword = (password) =>
    supabase.auth.updateUser({ password });

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateProfile,
    resetPasswordForEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
