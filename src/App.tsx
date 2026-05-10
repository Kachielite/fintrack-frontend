import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "toastify-react-native";
import Navigation from "@/core/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
    mutations: { retry: 0 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <ToastProvider />
    </QueryClientProvider>
  );
}
