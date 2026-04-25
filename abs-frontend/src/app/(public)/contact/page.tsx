import type { Metadata } from "next";
import { getCachedPublicSiteData } from "@/services/site-data.service";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ABS Builders — construction company Nepal, engineering Kapilvastu, infrastructure Rupandehi.",
  openGraph: {
    title: "Contact | ABS Builders",
    url: `${getSiteUrl()}/contact`,
  },
};

export default async function ContactPage() {
  const site = await getCachedPublicSiteData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">Contact</h1>
      <p className="mt-4 text-stone-600">
        Tell us about your timeline and site location — we respond to new
        enquiries during business hours.
      </p>
      <dl className="mt-10 space-y-4 text-sm">
        {site.phone ? (
          <div>
            <dt className="font-medium text-stone-900">Phone</dt>
            <dd className="text-stone-600">
              <a href={`tel:${String(site.phone).replace(/\s/g, "")}`}>
                {String(site.phone)}
              </a>
            </dd>
          </div>
        ) : null}
        {site.email ? (
          <div>
            <dt className="font-medium text-stone-900">Email</dt>
            <dd className="text-stone-600">
              <a href={`mailto:${site.email}`}>{String(site.email)}</a>
            </dd>
          </div>
        ) : null}
        {site.address ? (
          <div>
            <dt className="font-medium text-stone-900">Office</dt>
            <dd className="whitespace-pre-line text-stone-600">
              {String(site.address)}
            </dd>
          </div>
        ) : null}
      </dl>
      {!site.phone && !site.email && !site.address ? (
        <p className="mt-8 rounded-lg border border-stone-200 bg-white p-4 text-sm text-stone-500">
          Contact details are managed in the dashboard under Site Data
          (superadmin).
        </p>
      ) : null}
    </div>
  );
}
