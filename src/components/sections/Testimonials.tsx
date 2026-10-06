"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company, site, telHref, youtubeId, youtubeThumb, type VideoTestimonial } from "@/lib/site";

const { testimonials: t } = site;
const videos = t.videos as (VideoTestimonial & { keepPoster?: boolean })[];

function posterFor(v: VideoTestimonial & { keepPoster?: boolean }) {
  const id = youtubeId(v.youtubeUrl);
  return id && !v.keepPoster ? youtubeThumb(id) : v.poster;
}

function VideoCard({ v, big, onOpen }: { v: VideoTestimonial & { keepPoster?: boolean }; big?: boolean; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Play video testimonial from ${v.name}`}
      className={`group relative block w-full overflow-hidden rounded-[2rem] text-left shadow-[0_30px_60px_-30px_rgb(8_34_82/0.6)] ring-1 ring-navy-900/10 ${big ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[28rem]" : "aspect-[16/10]"}`}
    >
      <Image src={posterFor(v)} alt={`${v.name}, ${v.role} from ${v.location}`} fill sizes={big ? "(min-width:1024px) 40rem, 94vw" : "(min-width:1024px) 28rem, 94vw"} className="object-cover transition duration-[1200ms] group-hover:scale-105" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-navy-950/20" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-white/50" />
        <span className="glass-dark relative grid size-[4.5rem] place-items-center rounded-full text-white transition duration-300 group-hover:scale-110 group-hover:bg-brand-600 sm:size-20">
          <Icon name="play" className="ml-1 size-7" />
        </span>
      </span>
      <span className="glass-dark absolute inset-x-4 bottom-4 rounded-3xl p-4 sm:p-5">
        <span className="block text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">“{v.quote}”</span>
        <span className="mt-3 flex items-center justify-between gap-3">
          <span>
            <span className="font-display block text-sm font-semibold text-white">{v.name}</span>
            <span className="block text-xs text-navy-200">
              {v.role} · {v.location}
            </span>
          </span>
          <span className="hidden shrink-0 rounded-full bg-white/12 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-white sm:block">{v.project}</span>
        </span>
      </span>
    </button>
  );
}

function VideoPlayer({ v }: { v: VideoTestimonial }) {
  const id = youtubeId(v.youtubeUrl);
  return (
    <div className="bg-navy-950">
      {id ? (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={`${v.name} — client testimonial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="size-full"
          />
        </div>
      ) : (
        <div className="relative grid aspect-video w-full place-items-center overflow-hidden">
          <Image src={v.poster} alt="" fill sizes="60rem" className="object-cover opacity-40 blur-sm" />
          <div className="relative max-w-md px-6 text-center text-white">
            <p className="font-display text-xl font-semibold">Video not available yet</p>
            <p className="mt-2 text-sm text-navy-200">Call us and we can put you in touch with {v.name} directly.</p>
          </div>
        </div>
      )}
      <div className="bg-white/90 p-5 sm:p-6">
        <p className="font-display text-lg font-semibold text-navy-900">{v.name}</p>
        <p className="text-sm text-ink/70">
          {v.role} · {v.location} · {v.project}
        </p>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [playing, setPlaying] = useState<number | null>(null);
  const row = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * Math.min(row.current.clientWidth * 0.85, 420), behavior: "smooth" });

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-light-mesh section-y relative overflow-hidden">
      <div className="container-x">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="testimonials-title" />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <Reveal className="lg:row-span-2">
            <VideoCard v={videos[0]} big onOpen={() => setPlaying(0)} />
          </Reveal>
          {videos.slice(1).map((v, i) => (
            <Reveal key={v.name} delay={(i + 1) * 100}>
              <VideoCard v={v} onOpen={() => setPlaying(i + 1)} />
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex items-end justify-between gap-4">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold text-navy-900 sm:text-3xl">Written feedback</h3>
          </Reveal>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews" className="glass grid size-11 place-items-center rounded-full text-navy-900 transition hover:bg-white">
              <Icon name="chevron-left" className="size-5" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next reviews" className="glass grid size-11 place-items-center rounded-full text-navy-900 transition hover:bg-white">
              <Icon name="chevron-right" className="size-5" />
            </button>
          </div>
        </div>

        <ul ref={row} className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-1 [scroll-padding-inline:1rem]">
          {t.reviews.map((r) => (
            <li key={r.name} className="w-[85%] shrink-0 snap-start sm:w-[24rem]">
              <figure className="glass flex h-full flex-col rounded-[1.8rem] p-6 sm:p-7">
                <Icon name="quote" className="size-8 text-brand-600/70" />
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/90">{r.quote}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-navy-900/8 pt-5">
                  <span aria-hidden className="font-display grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-navy-700 to-navy-900 text-sm font-semibold text-white">
                    {r.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <span>
                    <span className="font-display block text-sm font-semibold text-navy-900">{r.name}</span>
                    <span className="block text-xs text-ink/65">
                      {r.role} · {r.location}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <Reveal className="mt-6 text-center text-sm text-ink/70">
          Past clients are happy to be contacted on request:{" "}
          <a href={telHref} className="font-semibold text-brand-600 underline decoration-brand-600/30 underline-offset-4 hover:decoration-brand-600">
            Call {company.phoneDisplay}
          </a>
          .
        </Reveal>
      </div>

      <Modal open={playing !== null} onClose={() => setPlaying(null)} label="Client video testimonial" size="max-w-4xl" tone="dark">
        {playing !== null && <VideoPlayer v={videos[playing]} />}
      </Modal>
    </section>
  );
}
