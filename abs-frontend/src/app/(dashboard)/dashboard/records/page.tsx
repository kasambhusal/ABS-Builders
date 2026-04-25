import { ApiError } from "@/lib/fetcher";
import { requireDashboardUser } from "@/lib/auth";
import { listActivityRecords } from "@/services/record.service";
import { RecordsTable } from "@/components/dashboard/records-table";
import type { ActivityRecord } from "@/types";

export default async function DashboardRecordsPage() {
  await requireDashboardUser();
  const { items, error } = await listActivityRecords({
    page: 1,
    pageSize: 50,
  }).then(
    (r) => ({ items: r.items, error: null as string | null }),
    (e: unknown) => ({
      items: [] as ActivityRecord[],
      error:
        e instanceof ApiError
          ? e.message
          : "Unable to load activity. Check API configuration.",
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Records</h1>
        <p className="text-sm text-stone-600">
          Recent CMS activity from your API.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}
      <RecordsTable records={items} />
    </div>
  );
}
