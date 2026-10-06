"use client";

import { useRef } from "react";
import { useScrollEffect } from "@/lib/useScrollEffect";

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useScrollEffect(() => {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, el.scrollTop / max) : 0})`;
  });

  return <div ref={bar} aria-hidden style={{ transform: "scaleX(0)" }} className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-navy-400 via-white to-brand-500" />;
}
