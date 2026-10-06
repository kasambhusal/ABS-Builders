import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { site } from "@/lib/site";

const ICONS: Record<string, IconName> = { engineering: "building", architectural: "compass", interiors: "sofa" };

export function Services() {
  const { servicesSection: s } = site;
  return (
    <section id="services" aria-labelledby="services-title" className="bg-navy-mesh section-y relative isolate overflow-hidden">
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]" />
      <div className="container-x">
        <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} tone="dark" id="services-title" />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {site.services.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 110} className="h-full">
              <SpotlightCard
                as="article"
                className="glass-dark group flex h-full flex-col overflow-hidden rounded-[2rem] transition duration-500 hover:-translate-y-1.5 hover:border-white/30"
                glow="rgb(236 72 86 / 0.16)"
              >
                <div id={`service-${svc.id}`} className="relative aspect-[16/11] overflow-hidden scroll-mt-28">
                  <Image
                    src={svc.image}
                    alt={`${svc.title} services by ABS Builder's`}
                    fill
                    sizes="(min-width:1024px) 26rem, (min-width:640px) 50vw, 92vw"
                    className="object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                  <span className="glass-dark absolute left-5 top-5 grid size-12 place-items-center rounded-2xl text-white">
                    <Icon name={ICONS[svc.id] ?? "building"} className="size-6" />
                  </span>
                  <span className="absolute right-5 top-5 font-display text-5xl font-semibold text-white/15">0{i + 1}</span>
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-300">{svc.kicker}</p>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-white">{svc.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-200">{svc.description}</p>
                  <ul className="mt-6 grid gap-2.5 text-sm text-navy-100">
                    {svc.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Icon name="check" className="mt-0.5 size-4 shrink-0 text-brand-400" strokeWidth={2.6} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/#contact"
                    className="mt-8 inline-flex items-center gap-2 pt-1 text-sm font-semibold text-white transition group-hover:gap-3.5"
                  >
                    Enquire about {svc.title.toLowerCase()} <Icon name="arrow-right" className="size-4" />
                  </Link>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
