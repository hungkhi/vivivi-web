import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface AuthStore {
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  user: null,
  isGuest: true,
  isLoading: true,
  error: null,

  initialize: async () => {
    const supabase = getSupabase();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isGuest: !session,
        isLoading: false,
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isGuest: !session,
        });
      });
    } catch {
      set({ isLoading: false, isGuest: true });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      isGuest: false,
      isLoading: false,
    });
  },

  signUpWithEmail: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    const supabase = getSupabase();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
    const { data: { session } } = await supabase.auth.getSession();
    set({
      session,
      user: session?.user ?? null,
      isGuest: !session,
      isLoading: false,
    });
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });
    if (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    const supabase = getSupabase();
    await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      isGuest: true,
      isLoading: false,
    });
  },
}));
