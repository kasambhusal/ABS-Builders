"use client";

import { useCallback, type CSSProperties, type ElementType, type ReactNode, type PointerEvent } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** CSS colour for the glow, e.g. "rgb(255 255 255 / 0.2)". */
  glow?: string;
  style?: CSSProperties;
}

/** A card whose surface lights up under the cursor — the iOS "glass" feel. */
export function SpotlightCard({ children, className = "", as: Tag = "div", glow, style }: SpotlightCardProps) {
  const onMove = useCallback((e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }, []);

  return (
    <Tag
      onPointerMove={onMove}
      className={`spotlight ${className}`}
      style={{ ...(glow ? ({ "--spot": glow } as CSSProperties) : {}), ...style }}
    >
      {children}
    </Tag>
  );
}
