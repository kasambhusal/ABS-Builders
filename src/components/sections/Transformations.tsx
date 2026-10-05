"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { CompareSlider } from "@/components/ui/CompareSlider";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

const { transformations: t } = site;

export function Transformations() {
  const [active, setActive] = useState(0);
  const item = t.items[active];

  return (
    <section id="transformations" aria-labelledby="transformations-title" className="bg-navy-mesh section-y relative isolate overflow-hidden">
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_100%,#000,transparent)]" />
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} tone="dark" id="transformations-title" />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <Reveal>
            <div className="glass-dark rounded-[2.2rem] p-2.5 sm:p-3">
              <CompareSlider
                key={item.before}
                before={item.before}
                after={item.after}
                altBefore={`${item.title} — before`}
                altAfter={`${item.title} — after`}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-3 px-3 pb-3 pt-5 sm:flex-row sm:items-end sm:justify-between sm:px-4"
                >
                  <div>
                    <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">{item.title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm text-navy-200">{item.caption}</p>
                  </div>
                  <ul className="flex shrink-0 flex-wrap gap-2 text-xs font-medium text-white">
                    <li className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                      <Icon name="map-pin" className="size-3.5 text-brand-300" /> {item.location}
                    </li>
                    <li className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                      <Icon name="clock" className="size-3.5 text-brand-300" /> {item.duration}
                    </li>
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div role="group" aria-label="Choose a transformation" className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {t.items.map((it, i) => {
                const on = i === active;
                return (
                  <button
                    key={it.title}
                    aria-pressed={on}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`glass-dark group flex items-center gap-4 rounded-3xl p-3 text-left transition duration-300 ${on ? "border-brand-400/70! bg-white/12!" : "opacity-75 hover:opacity-100"}`}
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24 lg:size-20">
                      <Image src={it.after} alt="" fill sizes="6rem" className="object-cover transition duration-500 group-hover:scale-110" />
                      {on && <span aria-hidden className="absolute inset-0 ring-2 ring-inset ring-brand-400/80" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-300">0{i + 1}</span>
                      <span className="font-display mt-0.5 block text-sm font-semibold leading-snug text-white sm:text-base">{it.title}</span>
                      <span className="mt-1 block truncate text-xs text-navy-300">{it.location}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-5 flex items-center gap-2.5 px-2 text-sm text-navy-300">
              <Icon name="chevron-left" className="size-4" />
              Drag the handle or use arrow keys
              <Icon name="chevron-right" className="size-4" />
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
