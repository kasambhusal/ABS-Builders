"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { districts, projectsInDistrict, site } from "@/lib/site";

const { areas: a } = site;

function MapBackdrop() {
  return (
    <svg aria-hidden viewBox="0 0 100 80" preserveAspectRatio="none" className="absolute inset-0 size-full">
      <defs>
        <pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
          <path d="M5 0H0V5" fill="none" stroke="rgb(255 255 255 / 0.06)" strokeWidth="0.15" />
        </pattern>
        <radialGradient id="map-glow" cx="0.5" cy="0.6" r="0.6">
          <stop offset="0" stopColor="#3a62ae" stopOpacity="0.45" />
          <stop offset="1" stopColor="#3a62ae" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100" height="80" fill="url(#map-grid)" />
      <rect width="100" height="80" fill="url(#map-glow)" />
      {/* hills / Churia range in the north */}
      <path d="M0 22 L8 15 L14 19 L24 8 L33 16 L42 10 L52 17 L63 9 L74 16 L84 11 L100 20 L100 0 L0 0 Z" fill="rgb(255 255 255 / 0.05)" />
      <path d="M0 30 L10 24 L20 28 L30 20 L40 27 L55 19 L70 26 L82 21 L100 28" fill="none" stroke="rgb(185 205 235 / 0.22)" strokeWidth="0.25" />
      {/* topographic rings */}
      {[10, 17, 24].map((r) => (
        <ellipse key={r} cx="46" cy="52" rx={r * 1.6} ry={r} fill="none" stroke="rgb(185 205 235 / 0.1)" strokeWidth="0.2" />
      ))}
      {/* East–West highway */}
      <path d="M-2 60 C 18 55, 30 62, 46 56 S 78 62, 102 58" fill="none" stroke="rgb(255 255 255 / 0.35)" strokeWidth="0.35" strokeDasharray="1.4 1.1" />
      {/* connectors to Dang */}
      <path d="M30 24 C 28 38, 24 46, 22 56" fill="none" stroke="rgb(236 72 86 / 0.45)" strokeWidth="0.3" strokeDasharray="0.8 0.8" />
      <path d="M30 24 C 38 36, 42 48, 46 56" fill="none" stroke="rgb(236 72 86 / 0.3)" strokeWidth="0.3" strokeDasharray="0.8 0.8" />
    </svg>
  );
}

export function Areas() {
  const [active, setActive] = useState(districts[0].slug);
  const district = districts.find((d) => d.slug === active) ?? districts[0];
  const related = projectsInDistrict(district.name);

  return (
    <section id="areas" aria-labelledby="areas-title" className="bg-navy-mesh section-y relative isolate overflow-hidden">
      <div className="container-x">
        <SectionHeading eyebrow={a.eyebrow} title={a.title} intro={a.intro} tone="dark" id="areas-title" />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <div className="glass-dark relative aspect-[5/4] overflow-hidden rounded-[2.2rem] sm:aspect-[5/3.6] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
              <MapBackdrop />
              <p className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-navy-200">Lumbini Province · schematic map</p>
              {districts.map((d) => {
                const on = d.slug === active;
                return (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => setActive(d.slug)}
                    aria-pressed={on}
                    aria-label={`Show ${d.name} district`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${d.map.x}%`, top: `${d.map.y}%` }}
                  >
                    <span className="relative flex items-center justify-center">
                      <span aria-hidden className={`absolute size-10 animate-pulse-ring rounded-full ${on ? "bg-brand-500/60" : "bg-white/30"}`} />
                      <span className={`relative grid size-9 place-items-center rounded-full ring-4 transition duration-300 sm:size-10 ${on ? "scale-110 bg-brand-600 text-white ring-brand-500/30" : "bg-white text-navy-900 ring-white/20 group-hover:scale-110"}`}>
                        <Icon name="map-pin" className="size-[1.1rem]" />
                      </span>
                    </span>
                    <span className={`glass-dark absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-white transition ${on ? "bg-brand-600/80!" : ""}`}>{d.name}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex h-full flex-col gap-4">
              <div className="glass-dark no-scrollbar flex gap-1 overflow-x-auto rounded-full p-1.5" role="group" aria-label="Choose a district">
                {districts.map((d) => (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => setActive(d.slug)}
                    aria-pressed={d.slug === active}
                    className={`flex-1 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${d.slug === active ? "bg-white text-navy-950" : "text-navy-100 hover:text-white"}`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <div key={district.slug} className="glass-dark animate-rise-in flex flex-1 flex-col rounded-[2.2rem] p-6 sm:p-8">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-brand-300">{district.hub}</p>
                  <h3 className="font-display mt-2 text-3xl font-semibold text-white">{district.name} District</h3>
                  <p className="mt-3 text-sm leading-relaxed text-navy-200 sm:text-base">{district.description}</p>

                  <h4 className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-300">Towns we serve</h4>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {district.towns.map((t) => (
                      <li key={t} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-inset ring-white/10">
                        {t}
                      </li>
                    ))}
                  </ul>

                  {related.length > 0 && (
                    <>
                      <h4 className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-navy-300">
                        {related.length} project{related.length > 1 ? "s" : ""} completed here
                      </h4>
                      <ul className="mt-3 grid grid-cols-3 gap-3">
                        {related.slice(0, 3).map((p) => (
                          <li key={p.slug}>
                            <Link href="/#projects" className="group block">
                              <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl">
                                <Image src={p.images[0]} alt={p.title} fill sizes="8rem" className="object-cover transition duration-500 group-hover:scale-110" />
                              </span>
                              <span className="mt-1.5 block truncate text-xs text-navy-200">{p.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <Link href={`/areas/${district.slug}`} className="group mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-white">
                    Construction services in {district.name}
                    <Icon name="arrow-right" className="size-4 transition group-hover:translate-x-1" />
                  </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
