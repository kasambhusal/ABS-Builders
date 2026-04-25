import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { getSiteUrl } from "@/lib/site";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ABS Builders | Construction Company Nepal",
    template: "%s | ABS Builders",
  },
  description:
    "Construction company in Nepal — engineering Kapilvastu, infrastructure builders Rupandehi, and house design nationwide.",
  keywords: [
    "Construction Company in Nepal",
    "Engineering Company Kapilvastu",
    "Infrastructure Builders Rupandehi",
    "House Design Nepal",
  ],
  openGraph: {
    type: "website",
    locale: "en_NP",
    siteName: "ABS Builders",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#faf8f5]">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
