import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { inquiryToText, validateInquiry, type Inquiry } from "@/lib/contact";

export const runtime = "nodejs";

// Best-effort per-IP throttle (resets on cold start). Pair with your host's WAF for heavy traffic.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_HITS;
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendEmail(i: Inquiry): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return false;
  const port = Number(SMTP_PORT || 465);
  const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  const rows = Object.entries({ Name: i.name, Phone: i.phone, Email: i.email || "—", District: i.district || "—", Service: i.service || "—", Budget: i.budget || "—" })
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#555"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  await transport.sendMail({
    from: CONTACT_FROM || SMTP_USER,
    to: CONTACT_TO,
    replyTo: i.email || undefined,
    subject: `New enquiry from ${i.name} (${i.district || "website"})`,
    text: inquiryToText(i),
    html: `<table>${rows}</table><p style="white-space:pre-wrap">${escapeHtml(i.message)}</p>`,
  });
  return true;
}

async function sendWebhook(i: Inquiry): Promise<boolean> {
  const url = process.env.CONTACT_WEBHOOK_URL;
  if (!url) return false;
  const text = inquiryToText(i);
  // `text` suits Slack/Mattermost, `content` suits Discord; the full record is included for Zapier/Make/n8n.
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, content: text.slice(0, 1900), ...i }) });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return true;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) return NextResponse.json({ ok: false, error: "Too many requests. Please call us instead." }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots move on.
  if (typeof (body as Record<string, unknown>)?.company_website === "string" && (body as Record<string, string>).company_website) {
    return NextResponse.json({ ok: true });
  }

  const { data, errors } = validateInquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const results = await Promise.allSettled([sendEmail(data), sendWebhook(data)]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value === true);
  results.forEach((r) => r.status === "rejected" && console.error("[contact] delivery failed:", r.reason));

  if (!delivered) {
    if (process.env.NODE_ENV !== "production") {
      console.log("\n[contact] No SMTP/webhook configured — enquiry logged only (dev):\n" + inquiryToText(data) + "\n");
      return NextResponse.json({ ok: true, dev: true });
    }
    // Never silently lose a lead: tell the form so it can offer WhatsApp / phone instead.
    console.error("[contact] enquiry NOT delivered (configure SMTP_* or CONTACT_WEBHOOK_URL):\n" + inquiryToText(data));
    return NextResponse.json({ ok: false, error: "We couldn't send your message online right now." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
