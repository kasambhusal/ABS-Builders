"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@/types";

export function ProfileMenu({
  user,
  compact,
}: {
  user: AuthUser;
  compact?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  async function logout() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/logout", { method: "POST" });
        if (!res.ok) throw new Error("Logout failed");
        toast({ variant: "success", title: "Signed out" });
        router.push("/login");
        router.refresh();
      } catch {
        toast({ variant: "error", title: "Could not sign out" });
      }
    });
  }

  const roleLabel = user.role === 1 ? "Superadmin" : "Admin";

  return (
    <Dropdown
      align="right"
      trigger={
        <span
          className={
            compact
              ? "flex cursor-pointer items-center justify-center rounded-lg border border-stone-200 bg-white p-2 shadow-sm hover:bg-stone-50"
              : "flex max-w-[200px] cursor-pointer items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-left text-sm shadow-sm hover:bg-stone-50"
          }
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700">
            {user.name.slice(0, 2).toUpperCase()}
          </span>
          {!compact ? (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-stone-900">
                  {user.name}
                </span>
                <span className="block truncate text-xs text-stone-500">
                  {roleLabel}
                </span>
              </span>
              <svg className="h-4 w-4 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </>
          ) : null}
        </span>
      }
    >
      {user.email ? (
        <div className="border-b border-stone-100 px-3 py-2 text-xs text-stone-500">
          {user.email}
        </div>
      ) : null}
      <DropdownItem
        onClick={() => router.push("/dashboard/profile")}
      >
        Profile &amp; site management
      </DropdownItem>
      <DropdownItem destructive onClick={() => void logout()} disabled={pending}>
        {pending ? "Signing out…" : "Logout"}
      </DropdownItem>
    </Dropdown>
  );
}
