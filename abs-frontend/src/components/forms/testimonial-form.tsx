"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  createTestimonialAction,
  updateTestimonialAction,
} from "@/actions/testimonial.actions";
import type { ActionResult } from "@/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageField } from "@/components/forms/image-field";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@/types";

export function TestimonialForm({
  mode,
  testimonial,
}: {
  mode: "create" | "edit";
  testimonial?: Testimonial | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(
    async (prev, fd) => {
      if (mode === "create") return createTestimonialAction(prev, fd);
      if (!testimonial) return { ok: false, message: "Missing testimonial" };
      return updateTestimonialAction(testimonial.id, prev, fd);
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
        title:
          mode === "create" ? "Testimonial created" : "Testimonial updated",
      });
      router.push("/dashboard/testimonials");
      router.refresh();
    } else {
      toast({ variant: "error", title: state.message });
    }
  }, [state, mode, toast, router]);

  return (
    <form action={formAction} className="mx-auto max-w-xl space-y-5">
      <Input
        label="Author"
        name="author"
        required
        defaultValue={testimonial?.author}
      />
      <Input
        label="Role / title"
        name="role"
        defaultValue={testimonial?.role}
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-stone-700">
          Quote
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          required
          defaultValue={testimonial?.content}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>
      <Input
        label="Rating (1–5)"
        name="rating"
        type="number"
        min={1}
        max={5}
        defaultValue={testimonial?.rating ?? 5}
      />
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="featured"
          value="1"
          defaultChecked={testimonial?.featured === true}
          className="rounded border-stone-300"
        />
        Featured
      </label>
      <ImageField name="image" existingUrl={testimonial?.image_url} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {mode === "create" ? "Create testimonial" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard/testimonials")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
