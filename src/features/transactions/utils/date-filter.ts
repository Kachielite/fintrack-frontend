import {
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { formatShort } from "@/core/common/utils/date";

export type DatePreset =
  | "all"
  | "today"
  | "week"
  | "month"
  | "3months"
  | "year";

export type DateFilter =
  | { kind: "preset"; preset: DatePreset }
  | { kind: "custom"; from: Date; to: Date };

export const DEFAULT_DATE_FILTER: DateFilter = {
  kind: "preset",
  preset: "all",
};

export const DATE_PRESETS: DatePreset[] = [
  "all",
  "today",
  "week",
  "month",
  "3months",
  "year",
];

export const DATE_PRESET_LABELS: Record<DatePreset, string> = {
  all: "All time",
  today: "Today",
  week: "This week",
  month: "This month",
  "3months": "Last 3 months",
  year: "This year",
};

/** Concrete from/to dates for a filter, recomputed relative to "now" for presets — null/null means unbounded. */
export function resolveDateRange(filter: DateFilter): {
  from: Date | null;
  to: Date | null;
} {
  if (filter.kind === "custom") return { from: filter.from, to: filter.to };

  const now = new Date();
  switch (filter.preset) {
    case "all":
      return { from: null, to: null };
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "week":
      return { from: startOfWeek(now), to: endOfDay(now) };
    case "month":
      return { from: startOfMonth(now), to: endOfDay(now) };
    case "3months":
      return { from: startOfDay(subMonths(now, 3)), to: endOfDay(now) };
    case "year":
      return { from: startOfYear(now), to: endOfDay(now) };
  }
}

export function dateFilterLabel(filter: DateFilter): string {
  if (filter.kind === "preset") return DATE_PRESET_LABELS[filter.preset];
  const sameDay = filter.from.toDateString() === filter.to.toDateString();
  return sameDay
    ? formatShort(filter.from)
    : `${formatShort(filter.from)} – ${formatShort(filter.to)}`;
}
