import { Insight } from "./insights.interface";

export function formatPeriodLabel(
  insight: Pick<Insight, "periodType" | "periodStart" | "periodEnd">,
): string | null {
  const { periodType, periodStart, periodEnd } = insight;
  if (!periodType || !periodStart) return null;

  if (periodType === "monthly") {
    const month = periodStart.toLocaleDateString("en-US", { month: "long" });
    return `${month} report`;
  }

  if (!periodEnd) return null;

  const startLabel = periodStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = periodStart.getMonth() === periodEnd.getMonth()
    ? periodEnd.toLocaleDateString("en-US", { day: "numeric" })
    : periodEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `Weekly · ${startLabel}–${endLabel}`;
}
