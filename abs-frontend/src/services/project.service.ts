import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, publicFetch, unwrapApi } from "@/lib/fetcher";
import type { ApiEnvelope, Paginated, Project } from "@/types";

export async function listPublicProjects(params?: {
  page?: number;
  pageSize?: number;
}): Promise<Project[]> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const suffix = q.toString() ? `?${q}` : "";
  const res = await publicFetch<ApiEnvelope<Project[] | Paginated<Project>>>(
    `${apiPaths.publicProjects}${suffix}`,
    { next: { revalidate: 60, tags: ["projects"] } },
  );
  const data = unwrapApi(res);
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export async function getPublicProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const res = await publicFetch<ApiEnvelope<Project>>(
      apiPaths.publicProject(slug),
      { next: { revalidate: 120, tags: ["projects", `project-${slug}`] } },
    );
    return unwrapApi(res) ?? null;
  } catch {
    return null;
  }
}

export async function listPrivateProjects(): Promise<Project[]> {
  const res = await privateFetch<ApiEnvelope<Project[] | Paginated<Project>>>(
    apiPaths.privateProjects,
  );
  const data = unwrapApi(res);
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export async function getPrivateProject(id: number): Promise<Project | null> {
  try {
    const res = await privateFetch<ApiEnvelope<Project>>(
      apiPaths.privateProject(id),
    );
    return unwrapApi(res) ?? null;
  } catch {
    return null;
  }
}
