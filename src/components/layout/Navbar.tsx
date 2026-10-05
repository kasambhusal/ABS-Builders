"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { company, site, telHref, whatsappHref } from "@/lib/site";

const SECTION_IDS = site.nav.map((n) => n.href.slice(1));

export function Navbar() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: highlight the section under the viewport's centre line.
  useEffect(() => {
    const els = [...SECTION_IDS, "process"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (open) document.body.dataset.lock = "true";
    else delete document.body.dataset.lock;
    return () => {
      delete document.body.dataset.lock;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.nav
        aria-label="Primary"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 20, delay: 0.1 }}
        className={`glass-nav relative flex w-full max-w-6xl items-center justify-between gap-3 rounded-full py-2 pl-2.5 pr-2.5 transition-[background,box-shadow] duration-500 lg:pr-2 ${
          scrolled ? "bg-navy-950/90!" : ""
        }`}
      >
        <Link href="/" className="flex items-center gap-3 rounded-full pr-2" aria-label={`${company.name} — home`} onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="" width={44} height={44} priority className="size-10 rounded-full bg-white sm:size-11" />
          <span className="leading-tight">
            <span className="font-display block text-[0.95rem] font-bold tracking-wide text-white sm:text-base">{company.name.toUpperCase()}</span>
            <span className="hidden text-[0.58rem] font-medium uppercase tracking-[0.2em] text-navy-200 sm:block">{company.tagline}</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {site.nav.map((item) => {
            const id = item.href.slice(1);
            const isActive = active === id;
            return (
              <li key={item.href}>
                <Link
                  href={`/${item.href}`}
                  className={`relative block rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors ${
                    isActive ? "text-white" : "text-navy-100/80 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/14 ring-1 ring-inset ring-white/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={telHref}
            className="group hidden items-center gap-2 rounded-full bg-brand-600 py-2.5 pl-3.5 pr-4 text-sm font-semibold text-white shadow-[0_8px_24px_-8px_rgb(209_26_42/0.9)] transition hover:bg-brand-500 sm:inline-flex"
          >
            <Icon name="phone" className="size-4 transition-transform group-hover:rotate-12" />
            {company.phoneDisplay}
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-full bg-white/10 text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/20 lg:hidden"
          >
            <Icon name={open ? "x" : "menu"} className="size-5" />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="glass-nav absolute inset-x-0 top-[calc(100%+0.6rem)] origin-top rounded-[2rem] bg-navy-950/95! p-3 lg:hidden"
            >
              <ul className="grid gap-1">
                {site.nav.map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i + 0.05 }}>
                    <Link
                      href={`/${item.href}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium ${
                        active === item.href.slice(1) ? "bg-white/12 text-white" : "text-navy-100 hover:bg-white/8"
                      }`}
                    >
                      {item.label}
                      <Icon name="chevron-right" className="size-4 opacity-60" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <a href={telHref} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-white">
                  <Icon name="phone" className="size-4" /> Call now
                </a>
                <a
                  href={whatsappHref("Hello ABS Builder's, I'd like to discuss a project.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/12 py-3.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/15"
                >
                  <Icon name="whatsapp" className="size-4" /> WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}
