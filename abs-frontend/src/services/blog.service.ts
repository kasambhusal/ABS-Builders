import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, publicFetch, unwrapApi } from "@/lib/fetcher";
import type { ApiEnvelope, Blog, Paginated } from "@/types";

export async function listPublicBlogs(params?: {
  page?: number;
  pageSize?: number;
}): Promise<Blog[]> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const suffix = q.toString() ? `?${q}` : "";
  const res = await publicFetch<ApiEnvelope<Blog[] | Paginated<Blog>>>(
    `${apiPaths.publicBlogs}${suffix}`,
    { next: { revalidate: 60, tags: ["blogs"] } },
  );
  const data = unwrapApi(res);
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export async function getPublicBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const res = await publicFetch<ApiEnvelope<Blog>>(
      apiPaths.publicBlog(slug),
      { next: { revalidate: 120, tags: ["blogs", `blog-${slug}`] } },
    );
    return unwrapApi(res) ?? null;
  } catch {
    return null;
  }
}

export async function listPrivateBlogs(): Promise<Blog[]> {
  const res = await privateFetch<ApiEnvelope<Blog[] | Paginated<Blog>>>(
    apiPaths.privateBlogs,
  );
  const data = unwrapApi(res);
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export async function getPrivateBlog(id: number): Promise<Blog | null> {
  try {
    const res = await privateFetch<ApiEnvelope<Blog>>(
      apiPaths.privateBlog(id),
    );
    return unwrapApi(res) ?? null;
  } catch {
    return null;
  }
}
