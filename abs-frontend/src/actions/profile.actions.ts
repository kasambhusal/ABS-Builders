"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { apiPaths } from "@/lib/api";
import { requireDashboardUser } from "@/lib/auth";
import { COOKIE_USER } from "@/lib/cookies";
import { ApiError, privateFetch } from "@/lib/fetcher";
import type { ActionResult } from "@/actions/project.actions";

function mapApiError(e: unknown): ActionResult {
  if (e instanceof ApiError) {
    const body = e.body as
      | { errors?: Record<string, string[]>; message?: string }
      | undefined;
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

export async function updateProfileAction(input: {
  name: string;
  email: string;
}): Promise<ActionResult> {
  try {
    const user = await requireDashboardUser();
    await privateFetch(apiPaths.privateUser(user.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
      }),
    });

    const jar = await cookies();
    jar.set(
      COOKIE_USER,
      JSON.stringify({
        ...user,
        name: input.name,
        email: input.email,
      }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      },
    );

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard", "layout");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}

export async function updatePasswordAction(input: {
  old_password: string;
  new_password: string;
}): Promise<ActionResult> {
  try {
    const user = await requireDashboardUser();
    await privateFetch(apiPaths.privateUserPassword(user.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        old_password: input.old_password,
        new_password: input.new_password,
      }),
    });
    revalidatePath("/dashboard/profile");
    return { ok: true };
  } catch (e) {
    return mapApiError(e);
  }
}
