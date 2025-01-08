import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  profile: any | null;
  isAdmin: boolean;
  setUser: (user: any) => void;
  setProfile: (profile: any) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAdmin: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile, isAdmin: profile?.role === 'admin' }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false });
  },
}));