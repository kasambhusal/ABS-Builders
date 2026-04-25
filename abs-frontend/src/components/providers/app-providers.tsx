"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/hooks/use-toast";
import { LoadingProvider } from "@/hooks/use-loading";
import { ToastViewport } from "@/components/ui/toast";
import { GlobalLoadingOverlay } from "@/components/ui/global-loading-overlay";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <LoadingProvider>
        {children}
        <GlobalLoadingOverlay />
        <ToastViewport />
      </LoadingProvider>
    </ToastProvider>
  );
}
