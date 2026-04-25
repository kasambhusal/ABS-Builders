"use client";

import { useLoading } from "@/hooks/use-loading";

export function GlobalLoadingOverlay() {
  const { isLoading, message } = useLoading();

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-stone-900/30 backdrop-blur-[2px]"
      role="status"
      aria-live="assertive"
      aria-busy="true"
    >
      <div className="flex min-w-[200px] flex-col items-center gap-3 rounded-xl border border-stone-200 bg-[#faf8f5] px-8 py-6 shadow-xl">
        <span
          className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700"
          aria-hidden
        />
        <p className="text-sm font-medium text-stone-800">{message}</p>
      </div>
    </div>
  );
}
