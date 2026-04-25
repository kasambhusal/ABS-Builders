import "server-only";

import { apiPaths } from "@/lib/api";
import { privateFetch, publicFetch, unwrapApi } from "@/lib/fetcher";
import type { ApiEnvelope, SiteData } from "@/types";

export async function getCachedPublicSiteData(): Promise<SiteData> {
  try {
    const res = await publicFetch<ApiEnvelope<SiteData>>(
      apiPaths.publicSiteData,
      { next: { revalidate: 300, tags: ["site-data"] } },
    );
    return unwrapApi(res) ?? {};
  } catch {
    return {};
  }
}

export async function getPrivateSiteData(): Promise<SiteData> {
  const res = await privateFetch<ApiEnvelope<SiteData>>(
    apiPaths.publicSiteData,
  );
  return unwrapApi(res) ?? {};
}
