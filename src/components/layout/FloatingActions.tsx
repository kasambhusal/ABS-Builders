"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { telHref, whatsappHref } from "@/lib/site";

const WA_MESSAGE = "Hello ABS Builder's, I'd like to discuss a project.";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop / tablet: floating stack */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-center gap-3 md:flex">
        <button
          type="button"
          aria-label="Back to top"
          tabIndex={showTop ? 0 : -1}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`glass-nav grid size-11 place-items-center rounded-full text-white transition duration-300 hover:bg-navy-800 ${showTop ? "" : "pointer-events-none translate-y-2 opacity-0"}`}
        >
          <Icon name="arrow-up" className="size-5" />
        </button>
        <a
          href={whatsappHref(WA_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid size-13 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgb(37_211_102/0.8)] transition hover:scale-110"
        >
          <Icon name="whatsapp" className="size-6" />
        </a>
        <a
          href={telHref}
          aria-label="Call ABS Builder's"
          className="relative grid size-14 place-items-center rounded-full bg-brand-600 text-white shadow-[0_14px_34px_-8px_rgb(209_26_42/0.9)] transition hover:scale-110"
        >
          <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-brand-500/60" />
          <Icon name="phone" className="relative size-6" />
        </a>
      </div>

      {/* Mobile: thumb-reach dock */}
      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <div className="glass-nav grid grid-cols-[1fr_1fr_1.35fr] gap-1.5 rounded-[1.4rem] p-1.5">
          <a href={telHref} className="inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white active:bg-white/10">
            <Icon name="phone" className="size-4" /> Call
          </a>
          <a
            href={whatsappHref(WA_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white active:bg-white/10"
          >
            <Icon name="whatsapp" className="size-4 text-[#4ade80]" /> Chat
          </a>
          <Link href="/#contact" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3 text-sm font-semibold text-white">
            Free site visit <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
