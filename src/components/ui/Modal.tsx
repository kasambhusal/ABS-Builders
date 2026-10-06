"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  /** Tailwind max-width class for the panel. */
  size?: string;
  tone?: "light" | "dark";
}

/** Frosted-glass dialog: ESC / backdrop to close, focus trap, scroll lock, focus returns to the trigger. */
export function Modal({ open, onClose, label, children, size = "max-w-5xl", tone = "light" }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.dataset.lock = "true";
    panel.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab" && panel.current) {
        const focusable = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,iframe,[tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      delete document.body.dataset.lock;
      previous?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`glass animate-modal-in relative z-10 flex max-h-[94svh] w-full ${size} flex-col overflow-hidden rounded-t-[2rem] outline-none sm:rounded-[2rem] ${tone === "dark" ? "bg-navy-950!" : "bg-white/85!"}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full bg-navy-950/60 text-white backdrop-blur-md transition hover:bg-brand-600"
        >
          <Icon name="x" className="size-5" />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
