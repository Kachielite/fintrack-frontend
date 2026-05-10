import { create } from "zustand";

interface InsightsState {
  unreadCount: number;
  setUnreadCount(count: number): void;
  decrementUnread(): void;
  clearUnread(): void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
  decrementUnread: () =>
    set((s) => ({ unreadCount: Math.max(0, s.unreadCount - 1) })),
  clearUnread: () => set({ unreadCount: 0 }),
}));
