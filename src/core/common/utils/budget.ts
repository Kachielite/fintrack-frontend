import { ThemeColors, CATEGORY_COLORS, FALLBACK_CATEGORY_COLOR } from "@/core/common/constants/theme";

export function budgetStatusColor(
  status: "healthy" | "warning" | "over",
  colors: ThemeColors,
): string {
  switch (status) {
    case "healthy":
      return colors.success;
    case "warning":
      return colors.warning;
    case "over":
      return colors.error;
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
  return CATEGORY_COLORS[category] ?? FALLBACK_CATEGORY_COLOR;
}
