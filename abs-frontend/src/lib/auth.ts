import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_ACCESS_TOKEN, COOKIE_USER } from "./cookies";
import type { AuthUser, UserRole } from "@/types";

function parseUserCookie(raw: string | undefined): AuthUser | null {
  if (!raw) return null;
  try {
    const u = JSON.parse(raw) as AuthUser;
    if (typeof u.id === "number" && typeof u.role === "number") {
      return u;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const jar = await cookies();
  return parseUserCookie(jar.get(COOKIE_USER)?.value);
}

export async function getAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(COOKIE_ACCESS_TOKEN)?.value ?? null;
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === 1;
}

export async function requireDashboardUser(): Promise<AuthUser> {
  const token = await getAccessToken();
  const user = await getSessionUser();
  if (!token || !user) {
    redirect("/login");
  }
  return user;
}

export async function requireSuperAdmin(): Promise<AuthUser> {
  const user = await requireDashboardUser();
  if (!isSuperAdmin(user.role)) {
    redirect("/dashboard");
  }
  return user;
}
