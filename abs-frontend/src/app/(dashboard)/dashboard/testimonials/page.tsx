import Link from "next/link";
import { ApiError } from "@/lib/fetcher";
import { requireDashboardUser } from "@/lib/auth";
import { listPrivateTestimonials } from "@/services/testimonial.service";
import { TestimonialsTable } from "@/components/dashboard/testimonials-table";

export default async function DashboardTestimonialsPage() {
  await requireDashboardUser();
  const { rows: testimonials, error } = await listPrivateTestimonials().then(
    (rows) => ({ rows, error: null as string | null }),
    (e: unknown) => ({
      rows: [],
      error:
        e instanceof ApiError
          ? e.message
          : "Unable to load testimonials. Check API configuration.",
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">
            Testimonials
          </h1>
          <p className="text-sm text-stone-600">
            Social proof for the public homepage.
          </p>
        </div>
        <Link
          href="/dashboard/testimonials/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-900"
        >
          New testimonial
        </Link>
      </div>
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}
      <TestimonialsTable testimonials={testimonials} />
    </div>
  );
}
