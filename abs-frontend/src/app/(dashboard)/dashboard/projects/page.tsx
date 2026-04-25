import Link from "next/link";
import { ApiError } from "@/lib/fetcher";
import { requireDashboardUser } from "@/lib/auth";
import { listPrivateProjects } from "@/services/project.service";
import { ProjectsTable } from "@/components/dashboard/projects-table";

export default async function DashboardProjectsPage() {
  await requireDashboardUser();
  const { rows: projects, error } = await listPrivateProjects().then(
    (rows) => ({ rows, error: null as string | null }),
    (e: unknown) => ({
      rows: [],
      error:
        e instanceof ApiError
          ? e.message
          : "Unable to load projects. Check API configuration.",
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Projects</h1>
          <p className="text-sm text-stone-600">
            Create and manage portfolio projects for the public site.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-stone-50 transition-colors hover:bg-stone-900"
        >
          New project
        </Link>
      </div>
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}
      <ProjectsTable projects={projects} />
    </div>
  );
}
