"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CATEGORY_LABEL, districts, projects, site, telHref, type Category, type Project } from "@/lib/site";

type CategoryFilter = "all" | Category;

const CATEGORY_ORDER: Category[] = ["engineering", "architectural", "interiors"];

function Pill({ active, onClick, children, group }: { active: boolean; onClick: () => void; children: React.ReactNode; group: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-white" : "text-navy-900/75 hover:text-navy-900"}`}
    >
      {active && <motion.span layoutId={`pill-${group}`} className="absolute inset-0 rounded-full bg-navy-900 shadow-lg shadow-navy-900/30" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
      <span className="relative">{children}</span>
    </button>
  );
}

function ProjectDetail({ project, onClose, onStep }: { project: Project; onClose: () => void; onStep: (dir: 1 | -1) => void }) {
  const [index, setIndex] = useState(0);
  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 320);
  };

  const specs = [
    { icon: "ruler" as const, label: "Built-up area", value: project.area },
    { icon: "clock" as const, label: "Duration", value: project.duration },
    { icon: "calendar" as const, label: "Year", value: String(project.year) },
    { icon: "check" as const, label: "Status", value: project.status },
  ];

  return (
    <div className="grid md:grid-cols-[1.2fr_1fr]">
      <div className="bg-navy-950 p-3 sm:p-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
          <AnimatePresence mode="wait">
            <motion.div key={project.images[index]} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0">
              <Image src={project.images[index]} alt={`${project.title} — view ${index + 1}`} fill sizes="(min-width:768px) 40rem, 100vw" className="object-cover" priority />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
            <button type="button" onClick={() => onStep(-1)} aria-label="Previous project" className="glass-dark grid size-10 place-items-center rounded-full text-white transition hover:bg-white/20">
              <Icon name="chevron-left" className="size-5" />
            </button>
            <button type="button" onClick={() => onStep(1)} aria-label="Next project" className="glass-dark grid size-10 place-items-center rounded-full text-white transition hover:bg-white/20">
              <Icon name="chevron-right" className="size-5" />
            </button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {project.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show view ${i + 1}`}
              aria-current={i === index}
              className={`relative aspect-[4/3] overflow-hidden rounded-2xl ring-2 transition ${i === index ? "ring-brand-500" : "opacity-60 ring-transparent hover:opacity-100"}`}
            >
              <Image src={src} alt="" fill sizes="10rem" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-brand-600 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white">{CATEGORY_LABEL[project.category]}</span>
          <span className="rounded-full bg-navy-900/8 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-navy-900">{project.type}</span>
        </div>
        <h3 className="font-display mt-4 text-2xl font-semibold leading-tight text-navy-900 sm:text-3xl">{project.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/70">
          <Icon name="map-pin" className="size-4 text-brand-600" /> {project.location}
        </p>
        <p className="mt-5 text-sm leading-relaxed text-ink/85 sm:text-base">{project.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-3">
          {specs.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/70 p-3.5 ring-1 ring-navy-900/8">
              <dt className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink/60">
                <Icon name={s.icon} className="size-3.5" /> {s.label}
              </dt>
              <dd className="font-display mt-1 text-sm font-semibold text-navy-900">{s.value}</dd>
            </div>
          ))}
        </dl>

        <h4 className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/60">Scope of work</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {project.scope.map((s) => (
            <li key={s} className="rounded-full bg-navy-900/6 px-3 py-1.5 text-xs font-medium text-navy-900">
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#contact" onClick={goContact} className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500">
            Discuss a similar project <Icon name="arrow-right" className="size-4 transition group-hover:translate-x-1" />
          </a>
          <ButtonLink href={telHref} variant="glass-light" iconLeft="phone" className="px-5! py-3! text-sm!">
            Call
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const { projectsSection: s } = site;
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [district, setDistrict] = useState<string>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => projects.filter((p) => (category === "all" || p.category === category) && (district === "all" || p.district === district)),
    [category, district],
  );
  const current = projects.find((p) => p.slug === selected) ?? null;

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!selected) return;
      const list = filtered.length ? filtered : projects;
      const i = list.findIndex((p) => p.slug === selected);
      const next = list[(i + dir + list.length) % list.length];
      setSelected(next.slug);
    },
    [selected, filtered],
  );

  return (
    <section id="projects" aria-labelledby="projects-title" className="bg-light-mesh section-y relative overflow-hidden">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} id="projects-title" />
        </div>

        <Reveal className="mt-10">
          <LayoutGroup>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="glass no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5" role="group" aria-label="Filter by service">
                <Pill group="cat" active={category === "all"} onClick={() => setCategory("all")}>
                  All <span className="opacity-60">({projects.length})</span>
                </Pill>
                {CATEGORY_ORDER.map((c) => (
                  <Pill key={c} group="cat" active={category === c} onClick={() => setCategory(c)}>
                    {CATEGORY_LABEL[c]} <span className="opacity-60">({projects.filter((p) => p.category === c).length})</span>
                  </Pill>
                ))}
              </div>
              <div className="glass no-scrollbar -mx-1 flex max-w-full gap-1 overflow-x-auto rounded-full p-1.5" role="group" aria-label="Filter by district">
                <Pill group="dist" active={district === "all"} onClick={() => setDistrict("all")}>
                  All districts
                </Pill>
                {districts.map((d) => (
                  <Pill key={d.slug} group="dist" active={district === d.name} onClick={() => setDistrict(d.name)}>
                    {d.name}
                  </Pill>
                ))}
              </div>
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.ul layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(p.slug)}
                  aria-label={`View details of ${p.title}`}
                  className="glass group block w-full overflow-hidden rounded-[1.8rem] text-left transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_60px_-24px_rgb(8_34_82/0.45)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={`${p.title} — ${p.type.toLowerCase()} project in ${p.location}`}
                      fill
                      sizes="(min-width:1024px) 24rem, (min-width:640px) 50vw, 94vw"
                      className="object-cover transition duration-[1100ms] ease-out group-hover:scale-110"
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent opacity-80" />
                    <span className="glass-dark absolute left-4 top-4 rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">{CATEGORY_LABEL[p.category]}</span>
                    {p.status !== "Completed" && <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-navy-950">{p.status}</span>}
                    <span className="absolute bottom-4 right-4 grid size-11 translate-y-3 place-items-center rounded-full bg-white text-navy-900 opacity-0 shadow-xl transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <Icon name="expand" className="size-5" />
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-display text-lg font-semibold text-navy-900">{p.title}</h3>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink/70">
                      <Icon name="map-pin" className="size-4 shrink-0 text-brand-600" /> {p.location}
                    </p>
                    <p className="mt-4 flex items-center gap-3 border-t border-navy-900/8 pt-4 text-xs font-medium text-ink/70">
                      <span>{p.type}</span>
                      <span aria-hidden className="size-1 rounded-full bg-ink/30" />
                      <span>{p.area}</span>
                      <span aria-hidden className="size-1 rounded-full bg-ink/30" />
                      <span>{p.year}</span>
                    </p>
                  </div>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {filtered.length === 0 && (
          <p className="glass mt-10 rounded-3xl p-10 text-center text-ink/80">
            No projects match this filter yet — <button className="font-semibold text-brand-600 underline" onClick={() => { setCategory("all"); setDistrict("all"); }}>show all projects</button>.
          </p>
        )}
      </div>

      <Modal open={!!current} onClose={() => setSelected(null)} label={current ? `${current.title} project details` : "Project details"} size="max-w-6xl">
        {current && <ProjectDetail key={current.slug} project={current} onClose={() => setSelected(null)} onStep={step} />}
      </Modal>
    </section>
  );
}
