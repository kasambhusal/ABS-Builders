"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";
import { useScrollEffect } from "@/lib/useScrollEffect";

const { process: p } = site;

export function Process() {
  const track = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  // Fills the line as the list scrolls from 70% of the viewport height up past 55%.
  useScrollEffect(() => {
    if (!track.current || !fill.current) return;
    const { top, height } = track.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = (0.7 * vh - top) / (0.15 * vh + height);
    fill.current.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
  });

  return (
    <section id="process" aria-labelledby="process-title" className="bg-light-mesh section-y relative overflow-hidden">
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={p.eyebrow} title={p.title} id="process-title" />
          <Reveal delay={200} className="mt-8 hidden lg:block">
            <div className="glass rounded-3xl p-6">
              <p className="font-display text-lg font-semibold text-navy-900">Start with step one</p>
              <p className="mt-2 text-sm text-ink/75">The first site visit and indicative estimate are free.</p>
              <ButtonLink href="/#contact" icon="arrow-right" className="mt-5 py-3! text-sm!">
                Request a site visit
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <ol ref={track} className="relative grid gap-5">
          <span aria-hidden className="absolute bottom-6 left-[1.7rem] top-6 w-0.5 rounded-full bg-navy-900/10 sm:left-[2.15rem]" />
          <span
            ref={fill}
            aria-hidden
            style={{ transform: "scaleY(0)" }}
            className="absolute bottom-6 left-[1.7rem] top-6 w-0.5 origin-top rounded-full bg-gradient-to-b from-navy-600 to-brand-500 sm:left-[2.15rem]"
          />
          {p.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i % 2 ? 60 : 0} className="relative pl-16 sm:pl-[5.2rem]">
              <span className="font-display absolute left-0 top-4 grid size-[3.4rem] place-items-center rounded-full bg-navy-900 text-lg font-semibold text-white shadow-[0_10px_30px_-8px_rgb(8_34_82/0.7)] ring-[6px] ring-[#f3f6fc] sm:size-[4.3rem] sm:text-xl">
                0{i + 1}
              </span>
              <div className="glass rounded-3xl p-5 sm:p-6">
                <h3 className="font-display text-lg font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80 sm:text-base">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
