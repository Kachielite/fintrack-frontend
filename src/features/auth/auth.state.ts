import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import zustandStorage, { storage } from "@/core/common/storage/zustand-storage";
import { registerClearSession, registerUpdateToken } from "@/core/common/network/session-handler";
import { AuthUser, AuthSession } from "./auth.interface";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  onboardingComplete: boolean;
  setSession(session: AuthSession): void;
  clearSession(): void;
  setOnboardingComplete(): void;
  persistOnboardingComplete(): void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      onboardingComplete: false,

      setSession(session) {
        set({
          user: session.user,
          token: session.accessToken,
          refreshToken: session.refreshToken,
          onboardingComplete: session.user.onboardingComplete,
        });
      },

      clearSession() {
        set({
          user: null,
          token: null,
          refreshToken: null,
          onboardingComplete: false,
        });
      },

      setOnboardingComplete() {
        const { user } = get();
        set({
          onboardingComplete: true,
          user: user ? { ...user, onboardingComplete: true } : user,
        });
      },

      // Writes onboardingComplete to disk WITHOUT updating Zustand state,
      // so the navigator doesn't switch mid-flow (before the results screen).
      persistOnboardingComplete() {
        try {
          const raw = storage.getString("auth-store");
          if (raw) {
            const blob = JSON.parse(raw);
            blob.state.onboardingComplete = true;
            if (blob.state.user) blob.state.user.onboardingComplete = true;
            storage.set("auth-store", JSON.stringify(blob));
          }
        } catch {
          // fallback: just flip the state (will switch nav, but better than nothing)
          const { user } = get();
          set({
            onboardingComplete: true,
            user: user ? { ...user, onboardingComplete: true } : user,
          });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);

// Register callbacks so api-client can mutate auth state without circular import
registerClearSession(() => useAuthStore.getState().clearSession());
registerUpdateToken((token) => useAuthStore.setState({ token }));
