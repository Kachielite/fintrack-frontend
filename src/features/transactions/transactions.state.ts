import { create } from "zustand";
import { Transaction } from "./transactions.interface";

interface TransactionsState {
  selectedTransaction: Transaction | null;
  setSelectedTransaction(transaction: Transaction | null): void;
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  selectedTransaction: null,
  setSelectedTransaction: (transaction) =>
    set({ selectedTransaction: transaction }),
}));
