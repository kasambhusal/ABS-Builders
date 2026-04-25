import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { listPublicProjects } from "@/services/project.service";
import { listPublicBlogs } from "@/services/blog.service";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const [projects, blogs] = await Promise.all([
    listPublicProjects().catch(() => []),
    listPublicBlogs().catch(() => []),
  ]);

  const dynamic: MetadataRoute.Sitemap = [
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...blogs.map((b) => ({
      url: `${base}/blogs/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];

  return [...staticRoutes, ...dynamic];
}
