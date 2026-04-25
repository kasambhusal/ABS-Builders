import Link from "next/link";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 border-b border-stone-200/80 bg-[#faf8f5]/95 backdrop-blur-sm",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-stone-900">
          ABS Builders
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
        >
          Staff login
        </Link>
      </div>
    </header>
  );
}
