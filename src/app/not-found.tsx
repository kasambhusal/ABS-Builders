import { ButtonLink } from "@/components/ui/Button";
import { company, telHref } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="bg-navy-mesh relative grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[7rem] font-semibold leading-none text-gradient sm:text-[10rem]">404</p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-navy-200">The address may be mistyped, or the page may have moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" icon="arrow-right">
            Back to home
          </ButtonLink>
          <ButtonLink href={telHref} variant="glass" iconLeft="phone">
            {company.phoneDisplay}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
