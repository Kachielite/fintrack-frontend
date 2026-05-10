import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastManager from "toastify-react-native";
import * as SplashScreen from "expo-splash-screen";
import Navigation from "@/core/navigation";
import { useThemeStore } from "@/core/common/state/theme.state";
import useLoadFonts from "@/core/common/hooks/use-load-fonts";

// Keep the OS splash screen visible until fonts are ready
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

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <ToastManager />
    </QueryClientProvider>
  );
}
