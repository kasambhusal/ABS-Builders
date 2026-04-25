"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiPaths } from "@/lib/api";
import { ApiError, privateFetch, privateFormFetch } from "@/lib/fetcher";
import type { ActionResult } from "@/actions/project.actions";

function mapApiError(e: unknown): ActionResult {
  if (e instanceof ApiError) {
    const body = e.body as { errors?: Record<string, string[]>; message?: string } | undefined;
    if (body?.errors) {
      const fieldErrors: Record<string, string> = {};
      for (const [k, v] of Object.entries(body.errors)) {
        fieldErrors[k] = v[0] ?? "Invalid";
      }
      return {
        ok: false,
        message: body.message ?? "Validation failed",
        fieldErrors,
      };
    }
    return {
      ok: false,
      message:
        e.status === 401
          ? "Session expired. Please sign in again."
          : e.message || "Request failed",
    };
  }
  return { ok: false, message: "Something went wrong" };
}

export async function createBlogAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await privateFormFetch(apiPaths.privateBlogs, formData, "POST");
    revalidateTag("blogs", "max");
    revalidatePath("/dashboard/blogs");
    revalidatePath("/blogs");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function updateBlogAction(
  id: number,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await privateFormFetch(apiPaths.privateBlog(id), formData, "PUT");
    revalidateTag("blogs", "max");
    revalidatePath("/dashboard/blogs");
    revalidatePath("/blogs");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function deleteBlogAction(id: number): Promise<ActionResult> {
  try {
    await privateFetch(apiPaths.privateBlog(id), { method: "DELETE" });
    revalidateTag("blogs", "max");
    revalidatePath("/dashboard/blogs");
    revalidatePath("/blogs");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}
