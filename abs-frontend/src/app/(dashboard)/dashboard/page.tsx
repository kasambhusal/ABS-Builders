import Link from "next/link";
import { ApiError } from "@/lib/fetcher";
import { listPrivateProjects } from "@/services/project.service";
import { listPrivateBlogs } from "@/services/blog.service";
import { listPrivateClients } from "@/services/client.service";
import { listPrivateTestimonials } from "@/services/testimonial.service";
import { listActivityRecords } from "@/services/record.service";
import { requireDashboardUser, isSuperAdmin } from "@/lib/auth";

async function safeCount(fn: () => Promise<unknown[] | { items: unknown[] }>) {
  try {
    const r = await fn();
    if (Array.isArray(r)) return r.length;
    return r.items.length;
  } catch (e) {
    if (e instanceof ApiError && e.status === 403) return "—";
    return 0;
  }
}

export default async function DashboardHomePage() {
  const user = await requireDashboardUser();

  async function recordCount() {
    try {
      const r = await listActivityRecords({ page: 1, pageSize: 500 });
      return r.total;
    } catch (e) {
      if (e instanceof ApiError && e.status === 403) return "—";
      return 0;
    }
  }

  const [projects, blogs, clients, testimonials, records] = await Promise.all([
    safeCount(() => listPrivateProjects()),
    safeCount(() => listPrivateBlogs()),
    safeCount(() => listPrivateClients()),
    safeCount(() => listPrivateTestimonials()),
    recordCount(),
  ]);

  const tiles = [
    { label: "Projects", value: projects, href: "/dashboard/projects" },
    { label: "Blogs", value: blogs, href: "/dashboard/blogs" },
    { label: "Clients", value: clients, href: "/dashboard/clients" },
    {
      label: "Testimonials",
      value: testimonials,
      href: "/dashboard/testimonials",
    },
    { label: "Recent records", value: records, href: "/dashboard/records" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Signed in as {user.name}. Manage content for the public site from
          here.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-sm font-medium text-stone-500">{t.label}</p>
            <p className="mt-2 text-3xl font-semibold text-stone-900">
              {t.value}
            </p>
          </Link>
        ))}
      </div>
      {isSuperAdmin(user.role) ? (
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/users"
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
          >
            Manage users
          </Link>
          <Link
            href="/dashboard/site-data"
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
          >
            Site data
          </Link>
        </div>
      ) : null}
    </div>
  );
}
