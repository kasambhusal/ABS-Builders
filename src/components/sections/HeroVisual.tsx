"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import type { PointerEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { company, site } from "@/lib/site";

const { hero } = site;

function RotatingBadge() {
  const text = `${company.disciplines.join(" • ").toUpperCase()} • `;
  return (
    <div className="relative size-32 sm:size-36">
      <svg viewBox="0 0 160 160" className="absolute inset-0 size-full animate-[spin_26s_linear_infinite]" aria-hidden>
        <defs>
          <path id="badge-circle" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
        </defs>
        <text fontSize="10.4" fontWeight="600" textLength="386" lengthAdjust="spacing" fill="rgb(185 205 235)" className="font-sans">
          <textPath href="#badge-circle" startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[22%] overflow-hidden rounded-full bg-white shadow-[0_0_0_5px_rgb(255_255_255/0.18)]">
        <Image src="/images/logo.png" alt="" width={96} height={96} className="size-full object-cover" />
      </div>
    </div>
  );
}

export function HeroVisual() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });

  const rotateY = useTransform(sx, [-1, 1], [-7, 7]);
  const rotateX = useTransform(sy, [-1, 1], [5, -5]);
  const aX = useTransform(sx, [-1, 1], [-22, 22]);
  const aY = useTransform(sy, [-1, 1], [-16, 16]);
  const bX = useTransform(sx, [-1, 1], [30, -30]);
  const bY = useTransform(sy, [-1, 1], [22, -22]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="hero-in relative mx-auto h-[25rem] w-full max-w-[34rem] [perspective:1200px] sm:h-[32rem] lg:h-[35rem]"
      style={{ "--d": "450ms" } as React.CSSProperties}
    >
      {/* soft coloured glow behind the frame */}
      <div aria-hidden className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgb(58_98_174/0.55),transparent_70%)] blur-3xl" />

      {/* main framed photo */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="glass-dark absolute inset-x-[8%] inset-y-[7%] overflow-hidden rounded-[2.2rem] p-2.5 sm:rounded-[2.6rem] sm:p-3"
      >
        <div className="relative size-full overflow-hidden rounded-[1.7rem] sm:rounded-[2rem]">
          <Image
            src={hero.image}
            alt="Contemporary villa designed and built by ABS Builder's"
            fill
            priority
            sizes="(min-width: 1024px) 34rem, 90vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-navy-950/10" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/70">Featured build</p>
            <p className="font-display mt-1 text-lg font-semibold text-white sm:text-xl">{hero.liveProject.title}</p>
          </div>
        </div>
      </motion.div>

      {/* live project progress */}
      <motion.div style={{ x: aX, y: aY }} className="absolute -left-1 top-[14%] z-10 w-[13.5rem] sm:-left-6 sm:w-60">
        <div className="glass-panel animate-float rounded-3xl p-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-600 text-white">
              <Icon name="building" className="size-[1.15rem]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{hero.liveProject.title}</p>
              <p className="truncate text-xs text-navy-200">{hero.liveProject.location}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-navy-200">
            <span>{hero.liveProject.label}</span>
            <span className="font-semibold text-white">{hero.liveProject.progress}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hero.liveProject.progress}%` }}
              transition={{ duration: 1.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-navy-300 to-brand-400"
            />
          </div>
        </div>
      </motion.div>

      {/* rating */}
      <motion.div style={{ x: bX, y: bY }} className="absolute -right-1 bottom-[12%] z-10 sm:-right-5">
        <div className="glass-panel animate-float-slow rounded-3xl px-5 py-4 [animation-delay:-3s]">
          <div className="flex items-center gap-1 text-amber-300" aria-label={`${hero.rating.score} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" className="size-4" />
            ))}
          </div>
          <p className="font-display mt-1.5 text-2xl font-semibold text-white">
            {hero.rating.score}
            <span className="text-sm font-medium text-navy-300"> / 5</span>
          </p>
          <p className="mt-0.5 text-xs text-navy-200">{hero.rating.text}</p>
        </div>
      </motion.div>

      {/* rotating disciplines badge */}
      <motion.div style={{ x: bX, y: aY }} className="absolute -top-2 right-0 z-10 sm:-top-4 sm:-right-2">
        <div className="glass-panel animate-float rounded-full p-1.5 [animation-delay:-5s]">
          <RotatingBadge />
        </div>
      </motion.div>

      {/* trust chip */}
      <motion.div style={{ x: aX, y: bY }} className="absolute -bottom-1 left-[4%] z-10 hidden sm:block">
        <div className="glass-panel flex items-center gap-3 rounded-full py-2.5 pl-3 pr-5">
          <span className="grid size-9 place-items-center rounded-full bg-emerald-500/90 text-white">
            <Icon name="shield" className="size-[1.1rem]" />
          </span>
          <span className="text-sm font-medium text-white">Licensed engineers</span>
        </div>
      </motion.div>
    </div>
  );
}
