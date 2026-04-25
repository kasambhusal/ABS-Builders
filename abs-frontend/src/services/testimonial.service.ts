import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, unwrapApi } from "@/lib/fetcher";
import type { ApiEnvelope, Paginated, Testimonial } from "@/types";

export async function listPrivateTestimonials(): Promise<Testimonial[]> {
  const res = await privateFetch<
    ApiEnvelope<Testimonial[] | Paginated<Testimonial>>
  >(apiPaths.privateTestimonials);
  const data = unwrapApi(res);
  if (Array.isArray(data)) return data;
  return data?.items ?? [];
}

export async function getPrivateTestimonial(
  id: number,
): Promise<Testimonial | null> {
  try {
    const res = await privateFetch<ApiEnvelope<Testimonial>>(
      apiPaths.privateTestimonial(id),
    );
    return unwrapApi(res) ?? null;
  } catch {
    return null;
  }
}
