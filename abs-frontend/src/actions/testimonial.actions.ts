"use server";

import { revalidatePath } from "next/cache";
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

export async function createTestimonialAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await privateFormFetch(apiPaths.privateTestimonials, formData, "POST");
    revalidatePath("/dashboard/testimonials");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function updateTestimonialAction(
  id: number,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await privateFormFetch(apiPaths.privateTestimonial(id), formData, "PUT");
    revalidatePath("/dashboard/testimonials");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function deleteTestimonialAction(id: number): Promise<ActionResult> {
  try {
    await privateFetch(apiPaths.privateTestimonial(id), { method: "DELETE" });
    revalidatePath("/dashboard/testimonials");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}
