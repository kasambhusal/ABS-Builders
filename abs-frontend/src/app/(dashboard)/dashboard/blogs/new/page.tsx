import { requireDashboardUser } from "@/lib/auth";
import { BlogForm } from "@/components/forms/blog-form";

export default async function NewBlogPage() {
  await requireDashboardUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">New blog</h1>
        <p className="text-sm text-stone-600">Draft or publish insights.</p>
      </div>
      <BlogForm mode="create" />
    </div>
  );
}
