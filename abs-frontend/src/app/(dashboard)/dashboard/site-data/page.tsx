import { ApiError } from "@/lib/fetcher";
import { getPrivateSiteData } from "@/services/site-data.service";
import { SiteDataForm } from "@/components/forms/site-data-form";
import type { SiteData } from "@/types";

export default async function SiteDataPage() {
  const { initial, error } = await getPrivateSiteData().then(
    (data) => ({ initial: data, error: null as string | null }),
    (e: unknown) => ({
      initial: {} as SiteData,
      error:
        e instanceof ApiError
          ? e.message
          : "Unable to load site data. Check API configuration.",
    }),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Site data</h1>
        <p className="text-sm text-stone-600">
          Global contact and branding fields (superadmin only). Updates
          revalidate cached public content.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </p>
      ) : null}
      <SiteDataForm initial={initial} />
    </div>
  );
}
