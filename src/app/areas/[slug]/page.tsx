import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Contact } from "@/components/sections/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { breadcrumbSchema, businessSchema, faqSchema } from "@/lib/schema";
import { CATEGORY_LABEL, company, districts, projectsInDistrict, site, telHref } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return districts.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const d = districts.find((x) => x.slug === slug);
  if (!d) return {};
  const title = `Construction Company in ${d.name} | House Building, Architecture & Interiors`;
  const description = `${company.name} builds homes, commercial buildings and interiors across ${d.name} — ${d.towns.slice(0, 4).join(", ")} and nearby. Engineering, architectural design and turnkey interiors. Call ${company.phoneDisplay} for a free site visit.`;
  return {
    title,
    description,
    keywords: [`construction company ${d.name}`, `house construction ${d.name}`, `architect ${d.towns[0]}`, `interior designer ${d.towns[0]}`, `civil engineer ${d.name}`],
    alternates: { canonical: `/areas/${d.slug}` },
    openGraph: { title, description, url: `/areas/${d.slug}`, type: "website" },
  };
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const d = districts.find((x) => x.slug === slug);
  if (!d) notFound();

  const related = projectsInDistrict(d.name);
  const faqs = [
    { q: `Do you build houses and commercial buildings in ${d.name}?`, a: `Yes. ${company.name} designs and constructs homes, commercial buildings, institutional projects and interiors across ${d.name} District, including ${d.towns.join(", ")}.` },
    { q: `Is the site visit in ${d.name} free?`, a: `Yes. We visit your plot anywhere in ${d.name} at no charge, discuss your requirements and give you an indicative estimate before you commit to anything.` },
    { q: `Can you handle municipality approval in ${d.name}?`, a: `We prepare architectural and structural drawings and handle submission and follow-up with the local municipality on your behalf.` },
    ...site.faqs.slice(2, 4),
  ];

  return (
    <>
      <JsonLd data={businessSchema([d.name])} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: `${d.name}`, path: `/areas/${d.slug}` },
        ])}
      />

      <section className="bg-navy-mesh relative isolate overflow-hidden pb-24 pt-36 sm:pt-44">
        <div aria-hidden className="bg-blueprint-fine absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_20%,#000,transparent)]" />
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="text-sm text-navy-300">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white" aria-current="page">
                {d.name}
              </li>
            </ol>
          </nav>
          <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-300">{d.hub}</p>
          <h1 className="font-display mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
            Construction, architecture &amp; interiors in <span className="text-gradient">{d.name}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">{d.description}</p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {d.towns.map((t) => (
              <li key={t} className="glass-dark inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-white">
                <Icon name="map-pin" className="size-3.5 text-brand-300" /> {t}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#contact" icon="arrow-right">
              Request a site visit in {d.name}
            </ButtonLink>
            <ButtonLink href={telHref} variant="glass" iconLeft="phone">
              {company.phoneDisplay}
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-light-mesh section-y">
        <div className="container-x">
          <SectionHeading eyebrow={`Services in ${d.name}`} title={`What we offer in ${d.name}`} />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {site.services.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <article className="glass h-full rounded-[1.8rem] p-7">
                  <h3 className="font-display text-xl font-semibold text-navy-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/75">{s.description}</p>
                  <ul className="mt-5 grid gap-2.5 text-sm text-ink/90">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand-600" strokeWidth={2.6} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-navy-mesh section-y">
          <div className="container-x">
            <SectionHeading eyebrow="Projects" title={`Projects completed in ${d.name}`} tone="dark" />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 80}>
                  <Link href="/#projects" className="glass-dark group block overflow-hidden rounded-[1.8rem] transition hover:-translate-y-1">
                    <span className="relative block aspect-[4/3] overflow-hidden">
                      <Image src={p.images[0]} alt={`${p.title} in ${p.location}`} fill sizes="(min-width:1024px) 24rem, 94vw" className="object-cover transition duration-700 group-hover:scale-110" />
                    </span>
                    <span className="block p-5">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-300">{CATEGORY_LABEL[p.category]}</span>
                      <span className="font-display mt-1 block text-lg font-semibold text-white">{p.title}</span>
                      <span className="mt-1 block text-sm text-navy-200">{p.location}</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-light-mesh section-y">
        <div className="container-x max-w-4xl">
          <SectionHeading eyebrow="FAQ" title={`Questions about building in ${d.name}`} />
          <dl className="mt-10 grid gap-4">
            {faqs.map((f) => (
              <Reveal key={f.q}>
                <div className="glass rounded-3xl p-6">
                  <dt className="font-display text-base font-semibold text-navy-900">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/85 sm:text-base">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <Contact />
    </>
  );
}
