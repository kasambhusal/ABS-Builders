import { company, districts, getSiteUrl, site, youtubeId, youtubeThumb } from "@/lib/site";

const abs = (path: string) => `${getSiteUrl()}${path}`;

export const socialLinks = () => Object.values(company.social).filter(Boolean);

export function businessSchema(areas = districts.map((d) => d.name)) {
  const a = company.address;
  return {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    "@id": abs("/#business"),
    name: company.name,
    legalName: company.legalName,
    url: abs("/"),
    logo: abs("/images/logo.png"),
    image: [abs("/images/logo.png"), abs(site.hero.image)],
    description: site.seo.description,
    slogan: company.tagline,
    telephone: company.phone,
    email: company.email,
    foundingDate: String(company.foundedYear),
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: a.street,
      addressLocality: a.city,
      addressRegion: a.province,
      postalCode: a.postalCode,
      addressCountry: a.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: company.geo.lat, longitude: company.geo.lng },
    areaServed: areas.map((name) => ({ "@type": "AdministrativeArea", name: `${name} District, ${company.address.province}, Nepal` })),
    openingHoursSpecification: company.hours.schema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: socialLinks(),
    knowsAbout: ["Construction", "Structural engineering", "Architectural design", "Interior design", "Civil infrastructure"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Construction, architecture and interior services",
      itemListElement: site.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, description: s.description, areaServed: areas },
      })),
    },
    contactPoint: [{ "@type": "ContactPoint", telephone: company.phone, contactType: "customer service", areaServed: "NP", availableLanguage: ["en", "ne"] }],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: abs("/"),
    name: company.name,
    inLanguage: "en",
    publisher: { "@id": abs("/#business") },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

/** VideoObject for the featured company video, or null until a YouTube link is added. */
export function videoSchema() {
  const v = site.featuredVideo;
  const id = youtubeId(v.youtubeUrl);
  if (!id) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: v.intro,
    thumbnailUrl: [youtubeThumb(id)],
    uploadDate: v.uploadDate,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
  };
}
