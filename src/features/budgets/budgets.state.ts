import { create } from "zustand";
import { Budget } from "./budgets.interface";

interface BudgetsState {
  budgets: Budget[];
  setBudgets(budgets: Budget[]): void;
  addBudget(budget: Budget): void;
  updateBudget(budget: Budget): void;
  removeBudget(id: number): void;
}

export const useBudgetsStore = create<BudgetsState>((set) => ({
  budgets: [],
  setBudgets: (budgets) => set({ budgets }),
  addBudget: (budget) => set((s) => ({ budgets: [...s.budgets, budget] })),
  updateBudget: (budget) =>
    set((s) => ({
      budgets: s.budgets.map((b) => (b.id === budget.id ? budget : b)),
    })),
  removeBudget: (id) =>
    set((s) => ({ budgets: s.budgets.filter((b) => b.id !== id) })),
}));
