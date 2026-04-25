/** Strip HTML tags for safe plain-text display / API payloads */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

export function trimFields<T extends Record<string, unknown>>(obj: T): T {
  const out = { ...obj };
  for (const k of Object.keys(out)) {
    const v = out[k as keyof T];
    if (typeof v === "string") {
      (out as Record<string, unknown>)[k] = v.trim();
    }
  }
  return out;
}
