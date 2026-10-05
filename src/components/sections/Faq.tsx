"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, site, telHref } from "@/lib/site";

export function Faq() {
  const { faqSection: s, faqs } = site;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-light-mesh section-y relative overflow-hidden">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} id="faq-title" />
          <Reveal delay={200} className="mt-8">
            <ButtonLink href={telHref} iconLeft="phone" variant="ghost-dark">
              Call {company.phoneDisplay}
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="grid gap-3">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <Reveal as="li" key={f.q} delay={i * 50}>
                <div className={`glass rounded-3xl transition-shadow duration-500 ${on ? "shadow-[0_28px_50px_-26px_rgb(8_34_82/0.4)]" : ""}`}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-btn-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="font-display text-base font-semibold text-navy-900 sm:text-[1.05rem]">{f.q}</span>
                      <span className={`grid size-9 shrink-0 place-items-center rounded-full transition duration-300 ${on ? "rotate-180 bg-brand-600 text-white" : "bg-navy-900/8 text-navy-900"}`}>
                        <Icon name={on ? "minus" : "plus"} className="size-4" strokeWidth={2.4} />
                      </span>
                    </button>
                  </h3>
                  {/* Answers stay in the DOM (good for SEO); the grid-rows trick animates the height. */}
                  <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-ios)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-ink/85 sm:text-base">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
