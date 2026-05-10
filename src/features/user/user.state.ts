import { create } from "zustand";
import { UserProfile } from "./user.interface";

interface UserState {
  profile: UserProfile | null;
  setProfile(profile: UserProfile): void;
  clearProfile(): void;
  updateProfile(partial: Partial<UserProfile>): void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
  updateProfile: (partial) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...partial } : null,
    })),
}));
