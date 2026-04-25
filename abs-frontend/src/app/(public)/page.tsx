import Link from "next/link";
import { getCachedPublicSiteData } from "@/services/site-data.service";
import { listPublicProjects } from "@/services/project.service";
import { JsonLd } from "@/components/seo/json-ld";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const site = await getCachedPublicSiteData();
  const projects = await listPublicProjects({ pageSize: 3 }).catch(() => []);
  const base = getSiteUrl();

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: String(site.site_name ?? "ABS Builders"),
    description:
      "Construction company in Nepal — engineering in Kapilvastu, infrastructure in Rupandehi, residential design nationwide.",
    url: base,
    areaServed: ["Nepal", "Kapilvastu", "Rupandehi"],
    knowsAbout: [
      "Construction Company in Nepal",
      "Engineering Company Kapilvastu",
      "Infrastructure Builders Rupandehi",
      "House Design Nepal",
    ],
  };

  return (
    <>
      <JsonLd data={org} />
      <section className="border-b border-stone-200 bg-gradient-to-b from-[#faf8f5] to-[#f4f1eb] px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-stone-500">
            Build with confidence
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
            {String(site.tagline ?? "Trusted construction & engineering")}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            ABS Builders delivers residential and infrastructure projects with
            disciplined engineering — serving Kapilvastu, Rupandehi, and clients
            across Nepal who need dependable house design and delivery.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex rounded-lg bg-stone-800 px-6 py-3 text-sm font-medium text-stone-50 hover:bg-stone-900"
            >
              View projects
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-stone-900">
            Featured work
          </h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            All projects →
          </Link>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <li className="col-span-full rounded-xl border border-dashed border-stone-300 bg-white/60 px-6 py-12 text-center text-sm text-stone-500">
              Projects will appear here when your API returns data.
            </li>
          ) : (
            projects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="block rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="font-semibold text-stone-900">{p.title}</h3>
                  {p.location ? (
                    <p className="mt-1 text-sm text-stone-500">{p.location}</p>
                  ) : null}
                  {p.excerpt ? (
                    <p className="mt-3 line-clamp-3 text-sm text-stone-600">
                      {p.excerpt}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}
