"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePasswordAction, updateProfileAction } from "@/actions/profile.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";

export function ProfileManagementForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [pendingProfile, startProfileTransition] = useTransition();
  const [pendingPassword, startPasswordTransition] = useTransition();

  function onProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();

    if (!name || !email) {
      toast({ variant: "error", title: "Name and email are required" });
      return;
    }

    startProfileTransition(() => {
      startLoading("Updating profile…");
      void (async () => {
        try {
          const r = await updateProfileAction({ name, email });
          if (r.ok) {
            toast({ variant: "success", title: "Profile updated" });
            router.refresh();
          } else {
            toast({
              variant: "error",
              title: r.message,
              description: r.fieldErrors
                ? Object.values(r.fieldErrors).join(" · ")
                : undefined,
            });
          }
        } finally {
          stopLoading();
        }
      })();
    });
  }

  function onPasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(e.currentTarget);
    const oldPassword = String(fd.get("old_password") ?? "");
    const newPassword = String(fd.get("new_password") ?? "");
    const confirmPassword = String(fd.get("confirm_password") ?? "");

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({ variant: "error", title: "Fill all password fields" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "error", title: "New password and confirm password must match" });
      return;
    }

    startPasswordTransition(() => {
      startLoading("Updating password…");
      void (async () => {
        try {
          const r = await updatePasswordAction({
            old_password: oldPassword,
            new_password: newPassword,
          });
          if (r.ok) {
            toast({ variant: "success", title: "Password updated" });
            form.reset();
          } else {
            toast({
              variant: "error",
              title: r.message,
              description: r.fieldErrors
                ? Object.values(r.fieldErrors).join(" · ")
                : undefined,
            });
          }
        } finally {
          stopLoading();
        }
      })();
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Edit profile</h2>
        <p className="mt-1 text-sm text-stone-600">
          Update your name and email used in dashboard login info.
        </p>
        <form onSubmit={onProfileSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              name="name"
              defaultValue={initialName}
              required
              autoComplete="name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              defaultValue={initialEmail}
              required
              autoComplete="email"
            />
          </div>
          <Button type="submit" disabled={pendingProfile}>
            Save profile
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Change password</h2>
        <p className="mt-1 text-sm text-stone-600">
          Use a strong password with letters, numbers, and symbols like @ # $ %.
        </p>
        <form onSubmit={onPasswordSubmit} className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Current password"
              name="old_password"
              type="password"
              required
              autoComplete="current-password"
            />
            <Input
              label="New password"
              name="new_password"
              type="password"
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              name="confirm_password"
              type="password"
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={pendingPassword}>
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
