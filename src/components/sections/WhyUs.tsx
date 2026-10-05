import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { company, site, telHref } from "@/lib/site";

const { whyUs: w } = site;

export function WhyUs() {
  return (
    <section id="why-us" aria-labelledby="why-title" className="bg-navy-mesh section-y relative isolate overflow-hidden">
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000,transparent)]" />
      <div className="container-x">
        <SectionHeading eyebrow={w.eyebrow} title={w.title} tone="dark" align="center" id="why-title" />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {w.items.map((it, i) => (
            <Reveal key={it.title} delay={(i % 3) * 90}>
              <SpotlightCard className="glass-dark group h-full rounded-[1.8rem] p-7 transition duration-500 hover:-translate-y-1" glow="rgb(95 132 198 / 0.28)">
                <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_14px_30px_-10px_rgb(209_26_42/0.9)] transition group-hover:scale-105 group-hover:-rotate-3">
                  <Icon name={it.icon as IconName} className="size-7" />
                </span>
                <h3 className="font-display mt-6 text-xl font-semibold text-white">{it.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-navy-200">{it.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <div className="glass-dark flex flex-col items-start justify-between gap-6 rounded-[2rem] p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="font-display text-2xl font-semibold text-white sm:text-[1.7rem]">Want to see a site in progress?</p>
              <p className="mt-2 text-navy-200">We&apos;re happy to take you to a live project — call us to arrange a visit.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={telHref} iconLeft="phone">
                {company.phoneDisplay}
              </ButtonLink>
              <ButtonLink href="/#contact" variant="glass" icon="arrow-right">
                Send an enquiry
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
