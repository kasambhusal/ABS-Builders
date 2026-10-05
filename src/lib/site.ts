import data from "@/data/site.json";

export type Category = "engineering" | "architectural" | "interiors";

export interface Project {
  slug: string;
  title: string;
  category: Category;
  type: string;
  district: string;
  location: string;
  year: number;
  area: string;
  duration: string;
  status: string;
  summary: string;
  scope: string[];
  images: string[];
}

export interface District {
  slug: string;
  name: string;
  hub: string;
  towns: string[];
  description: string;
  map: { x: number; y: number };
}

export interface VideoTestimonial {
  name: string;
  role: string;
  location: string;
  project: string;
  quote: string;
  youtubeUrl: string;
  poster: string;
}

export const site = data;
export const company = data.company;
export const projects = data.projects as Project[];
export const districts = data.areas.districts as District[];

export const CATEGORY_LABEL: Record<Category, string> = {
  engineering: "Engineering",
  architectural: "Architectural",
  interiors: "Interiors",
};

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || data.seo.siteUrl;
  return raw.replace(/\/+$/, "");
}

export const telHref = `tel:${company.phone}`;

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${company.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function fullAddress(): string {
  const a = company.address;
  return `${a.street}, ${a.city}, ${a.district}, ${a.province}, ${a.country}`;
}

/** Accepts watch / youtu.be / shorts / embed / live links or a bare 11-char id. */
export function youtubeId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.slice(1).split("/")[0] || null;
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v) return v;
      const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/);
      if (m) return m[1];
    }
  } catch {
    /* not a URL */
  }
  return null;
}

export function youtubeThumb(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function projectsInDistrict(name: string): Project[] {
  return projects.filter((p) => p.district === name);
}
