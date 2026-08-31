import { create } from "zustand";

// Global state for the persistent bottom-nav "+" entry point. Lives here
// (rather than as screen-local state) because the trigger (the tab bar) and
// the sheets it opens are mounted once at the navigator root and must be
// reachable from every tab — mirrors the IrisFAB/IrisChatModal pattern in
// features/iris/iris.state.ts.
interface AddActionState {
  isChooserOpen: boolean;
  isImportOpen: boolean;
  openChooser: () => void;
  closeChooser: () => void;
  openImport: () => void;
  closeImport: () => void;
}

export const useAddActionStore = create<AddActionState>((set) => ({
  isChooserOpen: false,
  isImportOpen: false,
  openChooser: () => set({ isChooserOpen: true }),
  closeChooser: () => set({ isChooserOpen: false }),
  openImport: () => set({ isImportOpen: true }),
  closeImport: () => set({ isImportOpen: false }),
}));
