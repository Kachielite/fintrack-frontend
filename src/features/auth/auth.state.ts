import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/core/common/constants/storage-keys";
import { registerClearSession } from "@/core/common/network/session-handler";
import { AuthUser, AuthSession } from "./auth.interface";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  onboardingComplete: boolean;
  isLoading: boolean;
  setSession(session: AuthSession): void;
  clearSession(): void;
  setOnboardingComplete(): void;
  initSession(): Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  onboardingComplete: false,
  isLoading: true,

  setSession(session) {
    AsyncStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, session.accessToken);
    AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken);
    set({
      user: session.user,
      token: session.accessToken,
      refreshToken: session.refreshToken,
      onboardingComplete: session.user.onboardingComplete,
    });
  },

  clearSession() {
    AsyncStorage.multiRemove([
      STORAGE_KEYS.SESSION_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_PROFILE,
    ]);
    set({
      user: null,
      token: null,
      refreshToken: null,
      onboardingComplete: false,
    });
  },

  setOnboardingComplete() {
    set({ onboardingComplete: true });
  },

  async initSession() {
    set({ isLoading: true });
    try {
      const [token, refreshToken] = await AsyncStorage.multiGet([
        STORAGE_KEYS.SESSION_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
      ]);
      const accessToken = token[1];
      const storedRefreshToken = refreshToken[1];

      if (!accessToken) {
        set({ isLoading: false });
        return;
      }

      const profileRaw = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      const user: AuthUser | null = profileRaw ? JSON.parse(profileRaw) : null;

      set({
        token: accessToken,
        refreshToken: storedRefreshToken,
        user,
        onboardingComplete: user?.onboardingComplete ?? false,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },
}));

// Register clearSession so the api-client can trigger sign-out on 401 without circular import
registerClearSession(() => useAuthStore.getState().clearSession());
