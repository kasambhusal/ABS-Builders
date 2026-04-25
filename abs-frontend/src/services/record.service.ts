import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, unwrapApi } from "@/lib/fetcher";
import type { ActivityRecord, ApiEnvelope, Paginated } from "@/types";

export async function listActivityRecords(params?: {
  page?: number;
  pageSize?: number;
}): Promise<{ items: ActivityRecord[]; total: number }> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const suffix = q.toString() ? `?${q}` : "";
  const res = await privateFetch<
    ApiEnvelope<ActivityRecord[] | Paginated<ActivityRecord>>
  >(`${apiPaths.privateRecords}${suffix}`);
  const data = unwrapApi(res);
  if (Array.isArray(data)) {
    return { items: data, total: data.length };
  }
  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
  };
}
