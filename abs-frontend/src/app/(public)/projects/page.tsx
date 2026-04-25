import Link from "next/link";
import type { Metadata } from "next";
import { listPublicProjects } from "@/services/project.service";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Infrastructure builders Rupandehi and residential projects — portfolio from ABS Builders, Nepal.",
  openGraph: {
    title: "Projects | ABS Builders",
    url: `${getSiteUrl()}/projects`,
  },
};

export default async function PublicProjectsPage() {
  const projects = await listPublicProjects().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">Projects</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Selected work across Nepal — engineering company Kapilvastu, house
        design Nepal, and infrastructure builders Rupandehi.
      </p>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.length === 0 ? (
          <li className="col-span-full rounded-xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center text-sm text-stone-500">
            No projects yet. Connect your API at{" "}
            <code className="rounded bg-stone-100 px-1">NEXT_PUBLIC_API_URL</code>.
          </li>
        ) : (
          projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/projects/${p.slug}`}
                className="block h-full rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <h2 className="text-lg font-semibold text-stone-900">
                  {p.title}
                </h2>
                {p.location ? (
                  <p className="mt-1 text-sm text-stone-500">{p.location}</p>
                ) : null}
                {p.excerpt ? (
                  <p className="mt-3 text-sm text-stone-600">{p.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
