import { create } from "zustand";
import { IrisChatMessage } from "./iris.interface";

interface IrisState {
  isOpen: boolean;
  sessionId: number | null;
  messages: IrisChatMessage[];
  isSending: boolean;
  open(): void;
  close(): void;
  setSession(id: number): void;
  setMessages(msgs: IrisChatMessage[]): void;
  appendMessage(msg: IrisChatMessage): void;
  setIsSending(v: boolean): void;
  reset(): void;
}

export const useIrisStore = create<IrisState>((set) => ({
  isOpen: false,
  sessionId: null,
  messages: [],
  isSending: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setSession: (id) => set({ sessionId: id }),
  setMessages: (msgs) => set({ messages: msgs }),
  appendMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setIsSending: (v) => set({ isSending: v }),
  reset: () => set({ sessionId: null, messages: [], isSending: false }),
}));
