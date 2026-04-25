import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/auth";
import { getPrivateBlog } from "@/services/blog.service";
import { BlogForm } from "@/components/forms/blog-form";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) notFound();
  const blog = await getPrivateBlog(num);
  if (!blog) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Edit blog</h1>
        <p className="text-sm text-stone-600">{blog.title}</p>
      </div>
      <BlogForm mode="edit" blog={blog} />
    </div>
  );
}
