import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ABS Builders — engineering and construction leadership in Kapilvastu, Rupandehi, and Nepal.",
  openGraph: {
    title: "About ABS Builders",
    description:
      "Engineering company Kapilvastu and infrastructure builders serving Nepal.",
    url: `${getSiteUrl()}/about`,
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold text-stone-900">About ABS Builders</h1>
      <p className="mt-6 text-lg leading-relaxed text-stone-600">
        We are a construction company in Nepal focused on structural integrity,
        clear communication, and schedules you can plan around. Our teams
        support civil and residential work — from house design in Nepal to
        larger infrastructure in Rupandehi and engineering coordination in
        Kapilvastu.
      </p>
      <p className="mt-4 leading-relaxed text-stone-600">
        Whether you are planning a new home or a civic-scale build, we align
        drawings, materials, and site execution so stakeholders see steady
        progress without surprises.
      </p>
    </article>
  );
}
