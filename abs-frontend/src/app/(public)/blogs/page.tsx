import Link from "next/link";
import type { Metadata } from "next";
import { listPublicBlogs } from "@/services/blog.service";
import { getSiteUrl } from "@/lib/site";
import { formatDate } from "@/utils/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on construction company Nepal practices, engineering Kapilvastu, and infrastructure delivery.",
  openGraph: {
    title: "Blog | ABS Builders",
    url: `${getSiteUrl()}/blogs`,
  },
};

export default async function PublicBlogsPage() {
  const blogs = await listPublicBlogs().catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">Insights</h1>
      <p className="mt-2 text-stone-600">
        Updates from our team on house design Nepal and regional builds.
      </p>
      <ul className="mt-10 divide-y divide-stone-200">
        {blogs.length === 0 ? (
          <li className="py-8 text-sm text-stone-500">
            No articles published yet.
          </li>
        ) : (
          blogs.map((b) => (
            <li key={b.id} className="py-6">
              <Link
                href={`/blogs/${b.slug}`}
                className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
              >
                <h2 className="text-lg font-semibold text-stone-900 group-hover:underline">
                  {b.title}
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  {formatDate(b.created_at)}
                </p>
                {b.excerpt ? (
                  <p className="mt-2 text-sm text-stone-600">{b.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
