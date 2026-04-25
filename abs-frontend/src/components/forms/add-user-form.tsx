"use client";

import { useTransition } from "react";
import { createUserAction } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function AddUserForm() {
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const role = Number(fd.get("role") ?? 2);
    if (!name || !email || !password) {
      toast({ variant: "error", title: "Fill all required fields" });
      return;
    }
    startTransition(() => {
      startLoading("Creating user…");
      void (async () => {
        try {
          const r = await createUserAction({ name, email, password, role });
          if (r.ok) {
            toast({ variant: "success", title: "User created" });
            (e.target as HTMLFormElement).reset();
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

  return (
    <form
      onSubmit={onSubmit}
      className="mb-10 space-y-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-stone-900">Create user</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" name="name" required autoComplete="name" />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Select label="Role" name="role" defaultValue="2">
          <option value="2">Admin</option>
          <option value="1">Superadmin</option>
        </Select>
      </div>
      <Button type="submit" disabled={pending}>
        Create user
      </Button>
    </form>
  );
}
