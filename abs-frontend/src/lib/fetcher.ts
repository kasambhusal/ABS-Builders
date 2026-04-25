import "server-only";

import { cookies } from "next/headers";
import { getApiBase } from "./api";
import { COOKIE_ACCESS_TOKEN } from "./cookies";
import type { ApiEnvelope } from "@/types";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type FetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

async function parseJson<T>(res: Response): Promise<T | undefined> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}

const DEFAULT_TIMEOUT_MS = 10_000;

function withTimeout(
  init: FetchOptions,
  ms: number,
): { init: RequestInit; clear: () => void } {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  return {
    init: { ...init, signal: controller.signal },
    clear: () => clearTimeout(t),
  };
}

export async function publicFetch<T>(
  path: string,
  init: FetchOptions = {},
): Promise<T> {
  const url = `${getApiBase()}${path}`;
  const { init: timedInit, clear } = withTimeout(init, DEFAULT_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      ...timedInit,
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
      cache: init.cache ?? "no-store",
    });
  } finally {
    clear();
  }

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new ApiError(
      typeof body === "object" && body && "message" in body
        ? String((body as { message?: string }).message)
        : res.statusText,
      res.status,
      body,
    );
  }

  return (await parseJson<T>(res)) as T;
}

export async function privateFetch<T>(
  path: string,
  init: FetchOptions = {},
): Promise<T> {
  const token = (await cookies()).get(COOKIE_ACCESS_TOKEN)?.value;
  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const url = `${getApiBase()}${path}`;
  const { init: timedInit, clear } = withTimeout(init, DEFAULT_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      ...timedInit,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
      cache: init.cache ?? "no-store",
    });
  } finally {
    clear();
  }

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new ApiError(
      typeof body === "object" && body && "message" in body
        ? String((body as { message?: string }).message)
        : res.statusText,
      res.status,
      body,
    );
  }

  return (await parseJson<T>(res)) as T;
}

export async function privateFormFetch<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" | "PATCH" = "POST",
): Promise<T> {
  const token = (await cookies()).get(COOKIE_ACCESS_TOKEN)?.value;
  if (!token) {
    throw new ApiError("Unauthorized", 401);
  }

  const url = `${getApiBase()}${path}`;
  const { init: timedInit, clear } = withTimeout({}, 60_000);
  let res: Response;
  try {
    res = await fetch(url, {
      ...timedInit,
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: "no-store",
    });
  } finally {
    clear();
  }

  if (!res.ok) {
    const body = await parseJson<unknown>(res);
    throw new ApiError(
      typeof body === "object" && body && "message" in body
        ? String((body as { message?: string }).message)
        : res.statusText,
      res.status,
      body,
    );
  }
  console.log(res);
  return (await parseJson<T>(res)) as T;
}

export function unwrapApi<T>(payload: ApiEnvelope<T> | T | undefined): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}
