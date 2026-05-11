import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "@/core/navigation";
import { useThemeStore } from "@/core/common/state/theme.state";
import useLoadFonts from "@/core/common/hooks/use-load-fonts";

// Keep the OS splash screen visible until fonts are ready.
// Auth state is hydrated synchronously from MMKV — no async wait needed.
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

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Navigation />
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
