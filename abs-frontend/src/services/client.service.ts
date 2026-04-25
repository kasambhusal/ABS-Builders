import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, unwrapApi } from "@/lib/fetcher";
import type { ApiEnvelope, Client, Paginated } from "@/types";

export async function listPrivateClients(): Promise<Client[]> {
  const res = await privateFetch<ApiEnvelope<Client[] | Paginated<Client>>>(
    apiPaths.privateClients,
  );
  const data = unwrapApi(res);
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export async function getPrivateClient(id: number): Promise<Client | null> {
  try {
    const res = await privateFetch<ApiEnvelope<Client>>(
      apiPaths.privateClient(id),
    );
    return unwrapApi(res) ?? null;
  } catch {
    return null;
  }
}
