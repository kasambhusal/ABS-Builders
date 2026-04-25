import { notFound } from "next/navigation";
import { requireDashboardUser } from "@/lib/auth";
import { getPrivateProject } from "@/services/project.service";
import { ProjectForm } from "@/components/forms/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) notFound();
  const project = await getPrivateProject(num);
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Edit project</h1>
        <p className="text-sm text-stone-600">{project.title}</p>
      </div>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
