import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "@/core/navigation";
import { useThemeStore } from "@/core/common/state/theme.state";
import useLoadFonts from "@/core/common/hooks/use-load-fonts";
import { useAuthStore } from "@/features/auth/auth.state";

// Keep the OS splash screen visible until fonts and auth session are ready
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
});

export default function App() {
  const { loaded } = useLoadFonts();
  const loadSaved = useThemeStore((s) => s.loadSaved);
  const initSession = useAuthStore((s) => s.initSession);
  const isAuthLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  useEffect(() => {
    initSession();
  }, [initSession]);

  useEffect(() => {
    if (loaded && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAuthLoading]);

  if (!loaded || isAuthLoading) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Navigation />
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
