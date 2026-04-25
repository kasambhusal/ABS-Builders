"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { apiPaths } from "@/lib/api";
import { ApiError, privateFetch } from "@/lib/fetcher";
import type { ActionResult } from "@/actions/project.actions";

function mapApiError(e: unknown): ActionResult {
  if (e instanceof ApiError) {
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

export async function updateSiteDataAction(payload: Record<string, unknown>): Promise<ActionResult> {
  try {
    await privateFetch(apiPaths.privateSiteData, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    revalidateTag("site-data", "max");
    revalidatePath("/dashboard/site-data");
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}
