import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({ eyebrow, title, intro, tone = "light", align = "left", id }: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <Reveal>
        <p
          className={`inline-flex items-center gap-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-brand-300" : "text-brand-600"
          }`}
        >
          <span aria-hidden className={`h-px w-8 ${dark ? "bg-brand-300/70" : "bg-brand-600/60"}`} />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={80}>
        <h2
          id={id}
          className={`font-display mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.9rem] ${
            dark ? "text-white" : "text-navy-900"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={160}>
          <p className={`mt-5 text-pretty text-base leading-relaxed sm:text-lg ${dark ? "text-navy-200" : "text-ink/80"}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
