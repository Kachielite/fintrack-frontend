import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "toastify-react-native";
import Navigation from "@/core/navigation";
import { useThemeStore } from "@/core/common/state/theme.state";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
});

export default function App() {
  const loadSaved = useThemeStore((s) => s.loadSaved);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <ToastProvider />
    </QueryClientProvider>
  );
}
