import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { company, site } from "@/lib/site";

export function StatsBand() {
  const year = new Date().getFullYear();
  return (
    <section aria-label="ABS Builder's in numbers" className="relative z-10 -mt-24 sm:-mt-28">
      <div className="container-x">
        <Reveal>
          <dl className="glass grid grid-cols-2 overflow-hidden rounded-[2rem] lg:grid-cols-4">
            {site.stats.map((s, i) => (
              <div
                key={s.label}
                className={`relative flex flex-col px-6 py-8 text-center sm:py-10 ${i % 2 === 1 ? "border-l border-navy-900/8" : ""} ${i > 1 ? "border-t border-navy-900/8 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-navy-900/8" : ""}`}
              >
                <dt className="order-2 mt-3 text-xs font-medium uppercase tracking-[0.14em] text-ink/70 sm:text-[0.8rem]">{s.label}</dt>
                <dd className="order-1 font-display text-[2.6rem] font-semibold leading-none tracking-tight text-navy-900 sm:text-5xl">
                  <span className="text-gradient-brand">
                    <Counter value={"fromFoundedYear" in s && s.fromFoundedYear ? year - company.foundedYear : s.value} suffix={s.suffix} />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
