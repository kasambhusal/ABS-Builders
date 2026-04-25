export function formatDate(
  value: string | number | Date | undefined,
  locale = "en-NP",
): string {
  if (value === undefined) return "—";
  const d = typeof value === "object" ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}
