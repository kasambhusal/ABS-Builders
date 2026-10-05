import type { Metadata } from "next";
import { company, fullAddress } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${company.name} collects and uses the information you share through this website.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <section className="bg-light-mesh pb-24 pt-36 sm:pt-44">
      <div className="container-x max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">Legal</p>
        <h1 className="font-display mt-3 text-4xl font-semibold text-navy-900 sm:text-5xl">Privacy Policy</h1>
        <div className="glass mt-10 grid gap-6 rounded-[2rem] p-7 text-[0.97rem] leading-relaxed text-ink/90 sm:p-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-900">
          <p>This website is operated by {company.legalName}, {fullAddress()}. This policy explains what we do with the information you give us.</p>
          <div>
            <h2>What we collect</h2>
            <p className="mt-2">Only what you submit in the enquiry form: your name, phone number, optional email, district, service interest, budget range and project description.</p>
          </div>
          <div>
            <h2>How we use it</h2>
            <p className="mt-2">To respond to your enquiry, arrange a site visit and prepare an estimate. We do not sell your information or send marketing messages you did not ask for.</p>
          </div>
          <div>
            <h2>Third parties</h2>
            <p className="mt-2">The page may load an embedded Google Map and YouTube videos (via the privacy-enhanced youtube-nocookie.com domain). These services may set their own cookies once you interact with them.</p>
          </div>
          <div>
            <h2>Your choices</h2>
            <p className="mt-2">Contact us at <a className="font-semibold text-brand-600 underline" href={`mailto:${company.email}`}>{company.email}</a> or {company.phoneDisplay} to ask what we hold about you or to have it deleted.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
