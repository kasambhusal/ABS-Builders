"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createClientAction,
  updateClientAction,
} from "@/actions/client.actions";
import type { ActionResult } from "@/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageField } from "@/components/forms/image-field";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";
import type { Client } from "@/types";

export function ClientForm({
  mode,
  client,
}: {
  mode: "create" | "edit";
  client?: Client | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(
    async (prev, fd) => {
      if (mode === "create") return createClientAction(prev, fd);
      if (!client) return { ok: false, message: "Missing client" };
      return updateClientAction(client.id, prev, fd);
    },
    undefined,
  );

  useEffect(() => {
    if (pending) startLoading(mode === "create" ? "Saving…" : "Updating…");
    else stopLoading();
  }, [pending, mode, startLoading, stopLoading]);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast({
        variant: "success",
        title: mode === "create" ? "Client added" : "Client updated",
      });
      router.push("/dashboard/clients");
      router.refresh();
    } else {
      toast({
        variant: "error",
        title: state.message,
      });
    }
  }, [state, mode, toast, router]);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-5">
      <Input label="Name" name="name" required defaultValue={client?.name} />
      <Input
        label="Website"
        name="url"
        type="url"
        placeholder="https://"
        defaultValue={client?.url}
      />
      <ImageField label="Logo" name="image" existingUrl={client?.image} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {mode === "create" ? "Add client" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard/clients")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
