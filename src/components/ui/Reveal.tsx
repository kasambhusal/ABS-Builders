"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger in ms. */
  delay?: number;
  /** Start offset in px. */
  y?: number;
  style?: CSSProperties;
}

/** Fades/blurs content in as it scrolls into view. Content stays visible without JS. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0, y, style }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--d": `${delay}ms`, ...(y !== undefined ? { "--reveal-y": `${y}px` } : {}), ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
