import { requireDashboardUser } from "@/lib/auth";
import { TestimonialForm } from "@/components/forms/testimonial-form";

export default async function NewTestimonialPage() {
  await requireDashboardUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          New testimonial
        </h1>
        <p className="text-sm text-stone-600">
          Short quotes with optional portrait.
        </p>
      </div>
      <TestimonialForm mode="create" />
    </div>
  );
}
