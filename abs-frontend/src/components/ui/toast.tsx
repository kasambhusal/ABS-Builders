"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";

const ring: Record<string, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-4 z-[100] flex w-[min(100%,24rem)] -translate-x-1/2 flex-col gap-2 px-4"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto rounded-lg border px-4 py-3 shadow-lg",
            ring[t.variant],
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 text-xs opacity-90">{t.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="text-xs opacity-70 hover:opacity-100"
              onClick={() => dismiss(t.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
