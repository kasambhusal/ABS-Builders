import { requireDashboardUser } from "@/lib/auth";
import { ProjectForm } from "@/components/forms/project-form";

export default async function NewProjectPage() {
  await requireDashboardUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">New project</h1>
        <p className="text-sm text-stone-600">
          Details sync to your REST API as JSON or multipart when an image is
          included.
        </p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
