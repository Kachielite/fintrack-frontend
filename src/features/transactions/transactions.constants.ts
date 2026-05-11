import { CategoryType } from "./transactions.interface";

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  food: "Food & Dining",
  transit: "Transport",
  utility: "Utilities",
  subs: "Subscriptions",
  transfer: "Transfers",
  fun: "Entertainment",
  health: "Health",
  other: "Other",
};

export const CATEGORY_ICON_NAMES: Record<CategoryType, string> = {
  food: "restaurant-outline",
  transit: "car-outline",
  utility: "flash-outline",
  subs: "tv-outline",
  transfer: "swap-horizontal-outline",
  fun: "game-controller-outline",
  health: "heart-outline",
  other: "ellipsis-horizontal-outline",
};

export const ALL_CATEGORIES: CategoryType[] = [
  "food",
  "transit",
  "utility",
  "subs",
  "transfer",
  "fun",
  "health",
  "other",
];

