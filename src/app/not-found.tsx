import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-navy-mesh relative grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[7rem] font-semibold leading-none text-gradient sm:text-[10rem]">404</p>
        <h1 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">This page isn&apos;t on our blueprint.</h1>
        <p className="mx-auto mt-3 max-w-md text-navy-200">The page you were looking for may have moved. Let&apos;s get you back to solid ground.</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/" icon="arrow-right">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
