import { COLORS } from "@/core/common/constants/theme";

export function budgetStatusColor(
  status: "healthy" | "warning" | "over",
): string {
  switch (status) {
    case "healthy":
      return COLORS.success;
    case "warning":
      return COLORS.warning;
    case "over":
      return COLORS.error;
  }
}

export function categoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: "🍽️",
    transit: "🚌",
    utility: "⚡",
    subs: "📱",
    transfer: "💸",
    fun: "🎉",
    health: "❤️",
    other: "📦",
  };
  return icons[category] ?? "📦";
}

export function categoryColor(category: string): string {
  const map: Record<string, string> = {
    food: COLORS.categoryFood,
    transit: COLORS.categoryTransit,
    utility: COLORS.categoryUtility,
    subs: COLORS.categorySubs,
    transfer: COLORS.categoryTransfer,
    fun: COLORS.categoryFun,
    health: COLORS.categoryHealth,
    other: COLORS.categoryOther,
  };
  return map[category] ?? COLORS.categoryOther;
}
