import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, site, telHref } from "@/lib/site";

const { about } = site;

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="bg-light-mesh section-y relative overflow-hidden">
      <div className="container-x grid items-start gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* collage */}
        <Reveal className="relative mx-auto w-full max-w-xl pb-10 lg:sticky lg:top-28 lg:mx-0">
          <div className="relative aspect-[4/4.4] w-[86%] overflow-hidden rounded-[2.2rem] shadow-[0_40px_80px_-30px_rgb(8_34_82/0.55)] ring-1 ring-navy-900/10">
            <Image src={about.image} alt="Architectural floor plan and elevation drawings prepared by ABS Builder's" fill sizes="(min-width:1024px) 30rem, 80vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-8 right-0 aspect-[4/3] w-[58%] overflow-hidden rounded-[1.8rem] border-[6px] border-white shadow-[0_30px_60px_-24px_rgb(8_34_82/0.6)]">
            <Image src={about.secondaryImage} alt="Reinforced concrete frame under construction with site crane" fill sizes="20rem" className="object-cover" />
          </div>
          <div className="glass animate-float absolute -left-3 top-[10%] rounded-3xl px-5 py-4 sm:-left-8">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-600">Established</p>
            <p className="font-display text-3xl font-semibold text-navy-900">{company.foundedYear}</p>
          </div>
          <div className="glass animate-float-slow absolute bottom-10 left-2 hidden items-center gap-3 rounded-full py-2.5 pl-3 pr-5 [animation-delay:-4s] sm:flex">
            <span className="grid size-9 place-items-center rounded-full bg-navy-900 text-white">
              <Icon name="hardhat" className="size-[1.1rem]" />
            </span>
            <span className="text-sm font-semibold text-navy-900">On-site engineers</span>
          </div>
        </Reveal>

        <div>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} id="about-title" />
          <div className="mt-7 grid gap-4 text-pretty text-base leading-relaxed text-ink/85 sm:text-[1.05rem]">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 80}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          <ul className="mt-9 grid gap-3">
            {about.highlights.map((h, i) => (
              <Reveal as="li" key={h.title} delay={i * 90}>
                <div className="glass flex items-start gap-4 rounded-3xl p-5">
                  <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-2xl bg-navy-900 text-white">
                    <Icon name="check" className="size-5" strokeWidth={2.6} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-navy-900">{h.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/75">{h.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={120} className="mt-9">
            <figure className="relative border-l-[3px] border-brand-600 pl-5">
              <blockquote className="font-display text-lg font-medium leading-snug text-navy-900 sm:text-xl">“{about.mission}”</blockquote>
              <figcaption className="mt-3 text-sm text-ink/70">
                <span className="font-semibold text-navy-900">{about.founder.name}</span> · {about.founder.role}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={160} className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/#contact" icon="arrow-right">
              Book a free consultation
            </ButtonLink>
            <ButtonLink href={telHref} variant="glass-light" iconLeft="phone">
              {company.phoneDisplay}
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
