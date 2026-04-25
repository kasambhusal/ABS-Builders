import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiPaths, getApiBase } from "@/lib/api";
import { COOKIE_ACCESS_TOKEN, COOKIE_USER } from "@/lib/cookies";
import type { AuthUser } from "@/types";

export async function POST(request: Request) {
  let body: { name?: string; password?: string };
  try {
    body = (await request.json()) as { name?: string; password?: string };
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const password = body.password;
  if (!name || !password) {
    return NextResponse.json(
      { message: "Name and password are required" },
      { status: 400 },
    );
  }

  const controller = new AbortController();
  const tid = setTimeout(() => controller.abort(), 12_000);
  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBase()}${apiPaths.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, password }),
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(tid);
  }

  const raw = await upstream.text();
  let data: Record<string, unknown> = {};
  if (raw) {
    try {
      data = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      /* ignore */
    }
  }

  if (!upstream.ok) {
    const message =
      typeof data.message === "string"
        ? data.message
        : upstream.status === 401
          ? "Invalid name or password"
          : "Login failed";
    return NextResponse.json({ message }, { status: upstream.status });
  }

  const envelope = data as {
    data?: { token?: string; user?: AuthUser };
    token?: string;
    user?: AuthUser;
  };
  const token = envelope.data?.token ?? envelope.token;
  const user = envelope.data?.user ?? envelope.user;

  if (!token || !user || typeof user.role !== "number") {
    return NextResponse.json(
      { message: "Unexpected response from authentication service" },
      { status: 502 },
    );
  }

  const minimal: AuthUser = {
    id: user.id,
    name: user.name,
    ...(typeof user.email === "string" && user.email
      ? { email: user.email }
      : {}),
    role: user.role as AuthUser["role"],
  };

  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 24 * 7;

  jar.set(COOKIE_ACCESS_TOKEN, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });
  jar.set(COOKIE_USER, JSON.stringify(minimal), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });

  return NextResponse.json({ ok: true, user: minimal });
}
