import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { company, districts, fullAddress, site, telHref } from "@/lib/site";

const SOCIAL: { key: keyof typeof company.social; icon: IconName; label: string }[] = [
  { key: "facebook", icon: "facebook", label: "Facebook" },
  { key: "instagram", icon: "instagram", label: "Instagram" },
  { key: "youtube", icon: "youtube", label: "YouTube" },
  { key: "tiktok", icon: "tiktok", label: "TikTok" },
  { key: "linkedin", icon: "linkedin", label: "LinkedIn" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const registrations = company.registrations.filter((r) => r.value);
  return (
    <footer className="relative overflow-hidden bg-navy-950 pb-28 pt-20 text-navy-200 md:pb-10">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(180deg,transparent,#000_30%,transparent)]" />
      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/images/logo.png" alt={`${company.name} logo`} width={56} height={56} className="size-14 rounded-full bg-white" />
              <span>
                <span className="font-display block text-lg font-bold tracking-wide text-white">{company.name.toUpperCase()}</span>
                <span className="block text-[0.62rem] font-medium uppercase tracking-[0.2em] text-navy-300">{company.tagline}</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-navy-300">{site.footer.blurb}</p>
            <div className="mt-6 flex gap-2.5">
              {SOCIAL.filter((s) => company.social[s.key]).map((s) => (
                <a
                  key={s.key}
                  href={company.social[s.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="glass-dark grid size-10 place-items-center rounded-full text-white transition hover:-translate-y-0.5 hover:bg-brand-600"
                >
                  <Icon name={s.icon} className="size-[1.1rem]" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Explore</h3>
            <ul className="mt-5 grid gap-3 text-sm">
              {[...site.nav, { label: "Our Process", href: "#process" }].map((n) => (
                <li key={n.href}>
                  <Link href={`/${n.href}`} className="transition hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Service areas</h3>
            <ul className="mt-5 grid gap-3 text-sm">
              {districts.map((d) => (
                <li key={d.slug}>
                  <Link href={`/areas/${d.slug}`} className="transition hover:text-white">
                    Construction in {d.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h3 className="font-display mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-white">Services</h3>
            <ul className="mt-5 grid gap-3 text-sm">
              {site.services.map((s) => (
                <li key={s.id}>
                  <Link href="/#services" className="transition hover:text-white">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-white">Contact</h3>
            <ul className="mt-5 grid gap-4 text-sm">
              <li className="flex gap-3">
                <Icon name="map-pin" className="mt-0.5 size-5 shrink-0 text-brand-300" />
                <a href={company.mapsLink} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  {fullAddress()}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 size-5 shrink-0 text-brand-300" />
                <a href={telHref} className="font-semibold text-white transition hover:text-brand-300">
                  {company.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 size-5 shrink-0 text-brand-300" />
                <a href={`mailto:${company.email}`} className="transition hover:text-white">
                  {company.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Icon name="clock" className="mt-0.5 size-5 shrink-0 text-brand-300" />
                <span>{company.hours.display}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8 text-xs text-navy-400">
          {registrations.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-x-8 gap-y-2">
              {registrations.map((r) => (
                <li key={r.label}>
                  {r.label}: <span className="font-medium text-navy-200">{r.value}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p>
              © {year} {site.footer.legal}
            </p>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
