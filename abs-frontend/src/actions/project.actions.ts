"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiPaths } from "@/lib/api";
import { ApiError, privateFetch, privateFormFetch } from "@/lib/fetcher";
export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

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

export async function createProjectAction(
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await privateFormFetch(apiPaths.privateProjects, formData, "POST");
    revalidateTag("projects", "max");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function updateProjectAction(
  id: number,
  _prev: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await privateFormFetch(
      apiPaths.privateProject(id),
      formData,
      "PUT",
    );
    revalidateTag("projects", "max");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function deleteProjectAction(id: number): Promise<ActionResult> {
  try {
    await privateFetch(apiPaths.privateProject(id), { method: "DELETE" });
    revalidateTag("projects", "max");
    revalidatePath("/dashboard/projects");
    revalidatePath("/projects");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}
