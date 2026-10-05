import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "glass" | "glass-light" | "ghost-dark";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_14px_34px_-12px_rgb(209_26_42/0.95)] hover:bg-brand-500 hover:shadow-[0_18px_40px_-10px_rgb(209_26_42/1)]",
  glass: "glass-dark text-white hover:bg-white/15",
  "glass-light": "glass text-navy-900 hover:bg-white/90",
  "ghost-dark": "bg-navy-900 text-white hover:bg-navy-800",
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: IconName;
  iconLeft?: IconName;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
}

/** Pill button with an iOS-style press + shine. Renders a Next <Link> for internal paths, <a> otherwise. */
export function ButtonLink({ href, children, variant = "primary", icon, iconLeft, external, className = "", ariaLabel }: ButtonLinkProps) {
  const cls = `group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-semibold transition duration-300 active:scale-[0.97] ${VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition duration-700 group-hover:translate-x-[420%] group-hover:opacity-100"
      />
      {iconLeft && <Icon name={iconLeft} className="relative size-[1.1rem]" />}
      <span className="relative">{children}</span>
      {icon && <Icon name={icon} className="relative size-[1.1rem] transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );
  if (external || /^(tel:|mailto:|https?:)/.test(href)) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {inner}
    </Link>
  );
}
