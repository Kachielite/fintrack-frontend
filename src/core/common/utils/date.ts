import {
  format,
  formatDistanceToNow,
  isToday as dfIsToday,
  isYesterday as dfIsYesterday,
  parseISO,
} from "date-fns";

function toDate(date: string | Date): Date {
  return typeof date === "string" ? parseISO(date) : date;
}

export function formatDate(date: string | Date): string {
  return format(toDate(date), "MMM d, yyyy");
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(toDate(date), { addSuffix: true });
}

export function formatShort(date: string | Date): string {
  return format(toDate(date), "d MMM");
}

export function formatTime(date: string | Date): string {
  return format(toDate(date), "HH:mm");
}

export function isToday(date: string | Date): boolean {
  return dfIsToday(toDate(date));
}

export function isYesterday(date: string | Date): boolean {
  return dfIsYesterday(toDate(date));
}

export function dateGroupLabel(date: string | Date): string {
  const d = toDate(date);
  if (dfIsToday(d)) return "TODAY";
  if (dfIsYesterday(d)) return "YESTERDAY";
  return formatShort(d);
}
