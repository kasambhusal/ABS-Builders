"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createProjectAction,
  updateProjectAction,
} from "@/actions/project.actions";
import type { ActionResult } from "@/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ImageField } from "@/components/forms/image-field";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types";

export function ProjectForm({
  mode,
  project,
}: {
  mode: "create" | "edit";
  project?: Project | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(
    async (prev, fd) => {
      if (mode === "create") return createProjectAction(prev, fd);
      if (!project) return { ok: false, message: "Missing project" };
      return updateProjectAction(project.id, prev, fd);
    },
    undefined,
  );

  useEffect(() => {
    if (pending) {
      startLoading(mode === "create" ? "Saving…" : "Updating…");
    } else {
      stopLoading();
    }
  }, [pending, mode, startLoading, stopLoading]);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast({
        variant: "success",
        title: mode === "create" ? "Project created" : "Project updated",
      });
      router.push("/dashboard/projects");
      router.refresh();
    } else {
      toast({
        variant: "error",
        title: state.message,
        description: state.fieldErrors
          ? Object.values(state.fieldErrors).join(" · ")
          : undefined,
      });
    }
  }, [state, mode, toast, router]);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-5">
      <Input
        label="Title"
        name="title"
        required
        defaultValue={project?.title}
      />
      <Input
        label="Tags"
        name="tags"
        placeholder="Comma separated tags"
        defaultValue={project?.tags}
      />
      <Input
        label="Location"
        name="location"
        defaultValue={project?.location}
      />
      <Select label="Status" name="status" defaultValue={project?.status ?? "pending"}>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </Select>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={project?.description}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>
      <ImageField
        name="image"
        existingUrl={project?.image_url}
      />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {mode === "create" ? "Create project" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
