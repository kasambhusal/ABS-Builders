import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { company, site } from "@/lib/site";
import { HeroVisual } from "./HeroVisual";

const { hero } = site;

const DISCIPLINE_ICONS: IconName[] = ["building", "compass", "sofa"];

function Words({ text, start }: { text: string; start: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="hero-in inline-block" style={{ "--d": `${start + i * 70}ms` } as React.CSSProperties}>
          {w}&nbsp;
        </span>
      ))}
    </>
  );
}

function HeroScene() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMax slice"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] w-full opacity-80"
    >
      <defs>
        <linearGradient id="road-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#264a91" stopOpacity="0.5" />
          <stop offset="1" stopColor="#3a62ae" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="fade-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* mountain ridgeline — the logo's skyline */}
      <path
        className="draw"
        style={{ "--len": 2600, "--d": "300ms" } as React.CSSProperties}
        d="M-20 400 L150 318 L240 350 L420 214 L520 276 L720 96 L900 268 L1020 216 L1180 312 L1300 262 L1460 346"
        fill="none"
        stroke="url(#fade-line)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        className="draw"
        style={{ "--len": 2600, "--d": "700ms" } as React.CSSProperties}
        d="M-20 440 L110 380 L300 410 L470 300 L640 360 L820 250 L1000 350 L1150 300 L1300 380 L1460 340"
        fill="none"
        stroke="rgb(185 205 235 / 0.22)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* bridge deck + piers */}
      <path
        className="draw"
        style={{ "--len": 1700, "--d": "1000ms" } as React.CSSProperties}
        d="M-30 470 Q 700 380 1470 450"
        fill="none"
        stroke="rgb(255 255 255 / 0.4)"
        strokeWidth="3"
      />
      {[140, 340, 540, 740, 940, 1140, 1340].map((x, i) => {
        const y = 470 - Math.sin((x / 1440) * Math.PI) * 55 + 10;
        return <line key={x} x1={x} y1={y} x2={x} y2={560} stroke="rgb(255 255 255 / 0.12)" strokeWidth="4" className="hero-in" style={{ "--d": `${1400 + i * 90}ms` } as React.CSSProperties} />;
      })}
      {/* road sweep + red accent, as in the logo */}
      <path d="M0 560 C 420 420 880 380 1440 410 L1440 560 Z" fill="url(#road-fill)" />
      <path d="M1010 560 C 1150 470 1290 430 1440 405 L1440 450 C 1320 480 1220 520 1150 560 Z" fill="#b50c1a" fillOpacity="0.42" />
    </svg>
  );
}

export function Hero() {
  const { before, highlight, after } = hero.headline;
  const beforeWords = before.split(" ").length;

  return (
    <section id="home" aria-labelledby="hero-title" className="bg-navy-mesh relative isolate overflow-hidden pb-44 pt-32 sm:pt-40 lg:pb-52">
      {/* animated blueprint grid */}
      <div
        aria-hidden
        className="bg-blueprint-fine absolute inset-0 -z-10 animate-grid opacity-70 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,#000,transparent)]"
      />
      <div aria-hidden className="absolute -right-40 top-10 -z-10 size-[34rem] rounded-full bg-brand-600/20 blur-[120px]" />
      <HeroScene />

      <div className="container-x relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
          <div>
            <p
              className="hero-in glass-dark inline-flex items-center gap-3 rounded-full py-2 pl-3 pr-5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-navy-100 sm:text-xs"
              style={{ "--d": "100ms" } as React.CSSProperties}
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-brand-400" />
                <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
              </span>
              {hero.eyebrow}
            </p>

            <h1
              id="hero-title"
              className="font-display mt-7 text-[clamp(2.3rem,5.2vw,4.15rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-white"
            >
              <Words text={before} start={250} />
              <span className="hero-in relative inline-block" style={{ "--d": `${250 + beforeWords * 70}ms` } as React.CSSProperties}>
                <span className="text-gradient">{highlight}</span>
                <svg aria-hidden viewBox="0 0 300 14" className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none">
                  <path
                    className="draw"
                    style={{ "--len": 320, "--d": "1300ms" } as React.CSSProperties}
                    d="M3 9 C 70 1, 150 1, 297 7"
                    fill="none"
                    stroke="#ec4856"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              <Words text={after} start={250 + (beforeWords + 1) * 70} />
            </h1>

            <p className="hero-in mt-7 max-w-xl text-pretty text-base leading-relaxed text-navy-200 sm:text-lg" style={{ "--d": "900ms" } as React.CSSProperties}>
              {hero.subheading}
            </p>

            <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={{ "--d": "1050ms" } as React.CSSProperties}>
              <ButtonLink href={`/${hero.primaryCta.href}`} icon="arrow-right">
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={`/${hero.secondaryCta.href}`} variant="glass">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>

            <ul className="hero-in mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-200" style={{ "--d": "1200ms" } as React.CSSProperties}>
              {hero.assurances.map((a) => (
                <li key={a} className="flex items-center gap-2">
                  <span className="grid size-5 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Icon name="check" className="size-3" strokeWidth={3} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          <HeroVisual />
        </div>

        {/* the three disciplines */}
        <ul
          className="hero-in glass-dark mt-16 grid divide-y divide-white/10 overflow-hidden rounded-[1.75rem] sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:mt-20"
          style={{ "--d": "1500ms" } as React.CSSProperties}
        >
          {site.services.map((s, i) => (
            <li key={s.id}>
              <Link
                href={`/#service-${s.id}`}
                className="group flex items-center gap-4 px-6 py-5 transition hover:bg-white/8"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/15 transition group-hover:bg-brand-600">
                  <Icon name={DISCIPLINE_ICONS[i]} className="size-6" />
                </span>
                <span className="min-w-0">
                  <span className="font-display block text-base font-semibold uppercase tracking-[0.14em] text-white">{s.title}</span>
                  <span className="block truncate text-xs text-navy-300">{s.kicker}</span>
                </span>
                <Icon name="arrow-up-right" className="ml-auto size-5 shrink-0 text-navy-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            </li>
          ))}
        </ul>
        <span className="sr-only">{company.tagline}</span>
      </div>
    </section>
  );
}
