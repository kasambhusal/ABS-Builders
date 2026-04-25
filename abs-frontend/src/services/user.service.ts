import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, unwrapApi } from "@/lib/fetcher";
import type { ApiEnvelope, AuthUser, Paginated } from "@/types";

export async function listPrivateUsers(): Promise<AuthUser[]> {
  const res = await privateFetch<
    ApiEnvelope<
      (AuthUser & { password?: string })[] | Paginated<AuthUser>
    >
  >(apiPaths.privateUsers);
  const data = unwrapApi(res);
  const items = Array.isArray(data) ? data : data?.items ?? [];
  return items.map((row) => {
    const u = { ...(row as AuthUser & { password?: string }) };
    delete u.password;
    return u as AuthUser;
  });
}
