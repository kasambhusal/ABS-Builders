"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBlogAction, updateBlogAction } from "@/actions/blog.actions";
import type { ActionResult } from "@/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageField } from "@/components/forms/image-field";
import { useLoading } from "@/hooks/use-loading";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/utils/slug";
import type { Blog } from "@/types";

export function BlogForm({
  mode,
  blog,
}: {
  mode: "create" | "edit";
  blog?: Blog | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const slugRef = useRef<HTMLInputElement>(null);

  const [state, formAction, pending] = useActionState<
    ActionResult | undefined,
    FormData
  >(
    async (prev, fd) => {
      if (mode === "create") return createBlogAction(prev, fd);
      if (!blog) return { ok: false, message: "Missing blog" };
      return updateBlogAction(blog.id, prev, fd);
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
        title: mode === "create" ? "Blog created" : "Blog updated",
      });
      router.push("/dashboard/blogs");
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
        defaultValue={blog?.title}
        onChange={(e) => {
          if (!slugTouched && slugRef.current) {
            slugRef.current.value = slugify(e.target.value);
          }
        }}
      />
      <Input
        label="Slug"
        name="slug"
        required
        defaultValue={blog?.slug}
        ref={slugRef}
        onChange={() => setSlugTouched(true)}
      />
      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          name="published"
          value="1"
          defaultChecked={blog?.published === true}
          className="rounded border-stone-300"
        />
        Published
      </label>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="excerpt" className="text-sm font-medium text-stone-700">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={blog?.excerpt}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-stone-700">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          defaultValue={blog?.content}
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>
      <ImageField name="image" existingUrl={blog?.image_url} />
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {mode === "create" ? "Create blog" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/dashboard/blogs")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
