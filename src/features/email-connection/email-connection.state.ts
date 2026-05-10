import { create } from "zustand";
import { EmailConnection } from "./email-connection.interface";

interface EmailConnectionState {
  connections: EmailConnection[];
  setConnections(connections: EmailConnection[]): void;
  addConnection(connection: EmailConnection): void;
  updateConnection(connection: EmailConnection): void;
  removeConnection(id: number): void;
}

export const useEmailConnectionStore = create<EmailConnectionState>((set) => ({
  connections: [],
  setConnections: (connections) => set({ connections }),
  addConnection: (connection) =>
    set((s) => ({ connections: [...s.connections, connection] })),
  updateConnection: (connection) =>
    set((s) => ({
      connections: s.connections.map((c) =>
        c.id === connection.id ? connection : c,
      ),
    })),
  removeConnection: (id) =>
    set((s) => ({ connections: s.connections.filter((c) => c.id !== id) })),
}));
