"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "./Icon";

interface CompareSliderProps {
  before: string;
  after: string;
  altBefore: string;
  altAfter: string;
}

/** Drag / swipe / arrow-key before-after comparison. Sweeps once on first view to hint at interactivity. */
export function CompareSlider({ before, after, altBefore, altAfter }: CompareSliderProps) {
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const touched = useRef(false);
  const [pos, setPos] = useState(50);

  const setFromX = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (touched.current) return;
        controls = animate(50, [50, 18, 82, 50], {
          duration: 2.8,
          ease: "easeInOut",
          delay: 0.4,
          onUpdate: (v) => !touched.current && setPos(v),
        });
      },
      { threshold: 0.55 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
    };
  }, []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    touched.current = true;
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromX(e.clientX);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromX(e.clientX);
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    touched.current = true;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label="Before and after comparison. Use left and right arrow keys to compare."
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      aria-valuetext={`${Math.round(pos)}% before`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      className="relative aspect-[4/3] w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[1.7rem] bg-navy-900 sm:aspect-[16/10] sm:rounded-[2rem]"
    >
      <Image src={after} alt={altAfter} fill sizes="(min-width:1024px) 60rem, 94vw" className="pointer-events-none object-cover" draggable={false} />
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt={altBefore} fill sizes="(min-width:1024px) 60rem, 94vw" className="object-cover" draggable={false} />
      </div>

      <span
        className="glass-dark pointer-events-none absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white transition-opacity"
        style={{ opacity: pos < 12 ? 0 : 1 }}
      >
        Before
      </span>
      <span
        className="pointer-events-none absolute right-4 top-4 rounded-full bg-brand-600 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white shadow-lg transition-opacity"
        style={{ opacity: pos > 88 ? 0 : 1 }}
      >
        After
      </span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgb(0_0_0/0.15),0_0_24px_rgb(255_255_255/0.6)]" style={{ left: `${pos}%` }}>
        <span className="glass-dark absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-0.5 rounded-full text-white ring-4 ring-white/30">
          <Icon name="chevron-left" className="size-4" strokeWidth={2.6} />
          <Icon name="chevron-right" className="size-4" strokeWidth={2.6} />
        </span>
      </div>
    </div>
  );
}
