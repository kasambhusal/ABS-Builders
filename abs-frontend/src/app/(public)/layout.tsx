import Link from "next/link";
import { PublicNavbar } from "@/components/layout/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-stone-200 bg-[#f4f1eb] py-12 text-stone-600">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-semibold text-stone-900">ABS Builders</p>
            <p className="mt-1 text-sm">
              Construction &amp; engineering across Nepal.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/about" className="hover:text-stone-900">
              About
            </Link>
            <Link href="/projects" className="hover:text-stone-900">
              Projects
            </Link>
            <Link href="/blogs" className="hover:text-stone-900">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-stone-900">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
