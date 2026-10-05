import type { MetadataRoute } from "next";
import { company } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: company.name,
    short_name: company.shortName,
    description: `${company.name} — ${company.tagline}`,
    start_url: "/",
    display: "standalone",
    background_color: "#04122e",
    theme_color: "#082252",
    icons: [{ src: "/images/logo.png", sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
