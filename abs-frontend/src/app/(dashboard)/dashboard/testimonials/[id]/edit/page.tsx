import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/auth";
import { getPrivateTestimonial } from "@/services/testimonial.service";
import { TestimonialForm } from "@/components/forms/testimonial-form";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) notFound();
  const testimonial = await getPrivateTestimonial(num);
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          Edit testimonial
        </h1>
        <p className="text-sm text-stone-600">{testimonial.author}</p>
      </div>
      <TestimonialForm mode="edit" testimonial={testimonial} />
    </div>
  );
}
