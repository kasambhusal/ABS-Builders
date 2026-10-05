import { Icon } from "@/components/ui/Icon";
import { site } from "@/lib/site";

export function TrustMarquee() {
  const items = site.credentials;
  return (
    <section aria-label="Our credentials" className="overflow-hidden pb-4 pt-14 sm:pt-16">
      <div className="mask-fade-x">
        <ul className="flex w-max animate-marquee gap-4 motion-reduce:animate-none">
          {[...items, ...items].map((c, i) => (
            <li
              key={`${c}-${i}`}
              aria-hidden={i >= items.length}
              className="glass flex items-center gap-2.5 rounded-full py-2.5 pl-3 pr-5 text-sm font-medium whitespace-nowrap text-navy-900"
            >
              <span className="grid size-6 place-items-center rounded-full bg-brand-600 text-white">
                <Icon name="check" className="size-3.5" strokeWidth={3} />
              </span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
