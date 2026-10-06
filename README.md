# ABS Builder's — Website

Engineering | Architectural | Interiors · Rupandehi · Kapilvastu · Nawalparasi · Dang

A single-page, SEO-optimised marketing site built with **Next.js (App Router)**, **React 19** and **Tailwind CSS 4**. It uses no animation library: all motion is CSS plus a few lines of code, so the page stays light on low-end phones. Every piece of content lives in **one JSON file** so you can update the site without touching code.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

Requires Node.js 18.18+ (20+ recommended).

## Change the content — `src/data/site.json`

| Section        | What it controls |
| -------------- | ---------------- |
| `company`      | Name, phone, WhatsApp, email, address, map link, hours, social links, and `registrations` (company / PAN / licence numbers, shown in the footer once filled in) |
| `seo`          | Site URL, page title, description, keywords |
| `hero`         | Headline, sub-heading, buttons, and the floating project / track-record cards |
| `credentials`  | The scrolling strip under the hero. **Keep only statements that are true for ABS** |
| `featuredVideo`| The large company video (see below) |
| `stats`        | The four animated counters |
| `about`        | Story, highlights, founder, collage images |
| `services`     | Engineering / Architectural / Interiors cards |
| `projects`     | Portfolio — add, remove or edit entries (`category`: `engineering`, `architectural`, `interiors`) |
| `transformations` | **Before & After** slider pairs |
| `process`, `whyUs`, `faqs` | Process steps, credibility cards, FAQ (FAQ also feeds Google rich results) |
| `testimonials` | **YouTube video testimonials** + written reviews |
| `areas`        | The four districts (towns, description, map position) — each gets its own SEO page at `/areas/<slug>` |

> **All names, numbers, photos, reviews and the office address in the file are dummy placeholders.** Replace them before launch. Leave any value empty (`""`) to hide it.
>
> **Every factual statement must be true for ABS Builder's before you publish**, in particular: Nepal Engineering Council registration, company/PAN/VAT registration, municipality approval, concrete-test records, milestone payments, the written warranty, delivery timelines and client quotes. The copy is deliberately specific and checkable; delete or reword anything that is not accurate for your company.

### Add the big company video
Paste the YouTube link into `featuredVideo.youtubeUrl`. The video loads only when the visitor scrolls near it, **starts muted when it is at least half on screen, pauses when it leaves the screen**, and will not restart if the visitor paused it themselves (a "Tap for sound" button lets them unmute; browsers do not allow autoplay with sound). It does not autoplay for visitors who have "reduce motion" turned on. Until a link is added the section is hidden on the live site.

### Add a YouTube testimonial
In `testimonials.videos`, paste the link into `youtubeUrl` — watch, `youtu.be`, shorts and embed links all work:

```json
{ "name": "Ramesh Gurung", "role": "Homeowner", "location": "Butwal", "project": "Lumbini Heights Villa",
  "quote": "They finished on schedule…", "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX" }
```
The video's own thumbnail is used automatically and the video plays in a privacy-friendly (`youtube-nocookie.com`) pop-up. Add `"keepPoster": true` to keep your own `poster` image instead.

### Add a Before & After pair
Add an item to `transformations.items` with `before` and `after` image paths. Use two photos taken from the **same angle** and with the same aspect ratio (3:2 works best).

### Replace the photos
Images live in `public/images/`. The current pictures are **illustrated placeholders**. Drop your real photos in and update the paths in `site.json` — e.g. `"/images/projects/my-villa-1.webp"`. Tips: use WebP/JPG, ~1600px wide, under ~300 KB. Next.js resizes and optimises them automatically.

The logo is `public/images/logo.png` (also used for the favicon in `src/app/icon.png`).

## Contact form delivery
The form posts to `/api/contact` (validation, spam honeypot, rate limit). Copy `.env.example` to `.env.local` and configure **one or both**:

* **Email (SMTP):** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`
* **Webhook:** `CONTACT_WEBHOOK_URL` (Slack, Discord, Zapier, Make, n8n…)

If neither is set in production, the form shows a friendly "call or WhatsApp us" fallback instead of silently dropping the enquiry. Also set `NEXT_PUBLIC_SITE_URL` to your real domain.

## SEO checklist (already built in)
Title/description/keywords · canonical URLs · Open Graph + Twitter card (auto-generated share image) · JSON-LD (`GeneralContractor`/`LocalBusiness` with service areas, `WebSite`, `FAQPage`, breadcrumbs) · `sitemap.xml` · `robots.txt` · web manifest · semantic headings · alt text · four local landing pages (`/areas/rupandehi`, `/kapilvastu`, `/nawalparasi`, `/dang`) · fast, statically-generated HTML.

After launch: add the site to **Google Search Console** (submit `/sitemap.xml`; set `GOOGLE_SITE_VERIFICATION` for the meta-tag method), create/claim your **Google Business Profile**, and put your real latitude/longitude and Google Maps embed URL in `company.geo` / `company.mapEmbedUrl`.

## Project structure
```
src/
  app/            layout, page, /areas/[slug], /privacy, api/contact, sitemap, robots, manifest, OG image
  components/     layout/ (navbar, footer, floating call buttons) · sections/ · ui/
  data/site.json  ← all editable content
  lib/            typed content loader, schema.org builders, form validation
public/images/    logo + photos
```

## Deploying
Works on Vercel (zero config), or any Node host: `npm run build && npm start`. Set the environment variables above on your host.
