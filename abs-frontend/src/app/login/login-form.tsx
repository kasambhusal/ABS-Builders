"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!name || !password) {
      toast({ variant: "error", title: "Enter name and password" });
      return;
    }
    startTransition(() => {
      startLoading("Signing in…");
      void (async () => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            message?: string;
          };
          if (!res.ok) {
            toast({
              variant: "error",
              title: data.message ?? "Login failed",
            });
            return;
          }
          toast({ variant: "success", title: "Welcome back" });
          const next = params.get("next");
          router.push(
            next && next.startsWith("/") && !next.startsWith("//")
              ? next
              : "/dashboard",
          );
          router.refresh();
        } finally {
          stopLoading();
        }
      })();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-sm space-y-4 rounded-2xl border border-stone-200 bg-white p-8 shadow-lg"
    >
      <div>
        <h1 className="text-xl font-semibold text-stone-900">ABS Builders</h1>
        <p className="mt-1 text-sm text-stone-500">Sign in to the dashboard</p>
      </div>
      <Input
        label="Name"
        name="name"
        type="text"
        required
        autoComplete="username"
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
      />
      <Button type="submit" className="w-full" disabled={pending}>
        Sign in
      </Button>
    </form>
  );
}
