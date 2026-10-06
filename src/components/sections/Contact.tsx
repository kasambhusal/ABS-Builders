"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { inquiryToText, validateInquiry, type InquiryErrors } from "@/lib/contact";
import { company, districts, fullAddress, site, telHref, whatsappHref } from "@/lib/site";

const { contact: c } = site;

type Status = "idle" | "sending" | "success" | "error";

function InfoCard({ icon, label, children, href, external }: { icon: IconName; label: string; children: ReactNode; href?: string; external?: boolean }) {
  const body = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/15 transition group-hover:bg-brand-600">
        <Icon name={icon} className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-navy-300">{label}</span>
        <span className="mt-0.5 block text-[0.95rem] font-medium text-white">{children}</span>
      </span>
    </>
  );
  const cls = "glass-dark group flex items-center gap-4 rounded-3xl p-4 transition duration-300 hover:bg-white/12";
  return href ? (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

const fieldCls = (err?: string) =>
  `w-full rounded-2xl border bg-white/80 px-4 py-3.5 text-[0.95rem] text-navy-900 outline-none transition placeholder:text-ink/40 focus:border-navy-500 focus:bg-white focus:ring-4 focus:ring-navy-500/15 ${err ? "border-brand-500" : "border-navy-900/10"}`;

function Field({ label, error, children, id }: { label: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-navy-900/80">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs font-medium text-brand-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [serverMsg, setServerMsg] = useState("");
  const [fallbackWa, setFallbackWa] = useState("");

  const readValues = () => Object.fromEntries(new FormData(form.current!).entries());

  const waLink = () => {
    const { data } = validateInquiry(readValues());
    const text = data.name || data.message ? inquiryToText(data).replace("New website enquiry — ABS Builder's", "Hello ABS Builder's,") : "Hello ABS Builder's, I'd like to discuss a project.";
    return whatsappHref(text);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const values = readValues();
    const { errors: errs } = validateInquiry(values);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.current?.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setServerMsg("");
    setFallbackWa(waLink());
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus("success");
        form.current?.reset();
      } else {
        if (json.errors) setErrors(json.errors);
        setServerMsg(json.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setServerMsg("We couldn't reach the server.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-navy-mesh section-y relative isolate overflow-hidden">
      <div aria-hidden className="bg-blueprint absolute inset-0 -z-10 opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_20%_20%,#000,transparent)]" />
      <div className="container-x grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={c.eyebrow} title={c.title} intro={c.intro} tone="dark" id="contact-title" />

          <div className="mt-10 grid gap-3">
            <Reveal>
              <InfoCard icon="phone" label="Call us" href={telHref}>
                <span className="font-display text-xl font-semibold tracking-wide">{company.phoneDisplay}</span>
              </InfoCard>
            </Reveal>
            <Reveal delay={60}>
              <InfoCard icon="whatsapp" label="WhatsApp" href={whatsappHref("Hello ABS Builder's, I'd like to discuss a project.")} external>
                Chat with our team
              </InfoCard>
            </Reveal>
            <Reveal delay={120}>
              <InfoCard icon="mail" label="Email" href={`mailto:${company.email}`}>
                {company.email}
              </InfoCard>
            </Reveal>
            <Reveal delay={180}>
              <InfoCard icon="map-pin" label="Office" href={company.mapsLink} external>
                {fullAddress()}
              </InfoCard>
            </Reveal>
            <Reveal delay={240}>
              <InfoCard icon="clock" label="Office hours">
                {company.hours.display}
              </InfoCard>
            </Reveal>
          </div>

          {company.mapEmbedUrl && (
            <Reveal delay={120} className="mt-6">
              <div className="glass-dark overflow-hidden rounded-[2rem] p-2">
                <iframe
                  title={`Map showing ${company.name} head office in ${company.address.city}`}
                  src={company.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-56 w-full rounded-[1.5rem] border-0 grayscale-[0.4] contrast-[1.05] sm:h-64"
                  allowFullScreen
                />
              </div>
            </Reveal>
          )}
        </div>

        <Reveal delay={100}>
          <div className="relative rounded-[2.2rem] bg-white/[0.97] p-6 shadow-[0_50px_100px_-40px_rgb(0_0_0/0.8)] backdrop-blur-2xl sm:p-9">
            <div aria-hidden className="pointer-events-none absolute -right-px -top-px h-28 w-28 rounded-tr-[2.2rem] bg-gradient-to-bl from-brand-600/15 to-transparent" />
            <h3 className="font-display text-2xl font-semibold text-navy-900">{c.formTitle}</h3>
            <p className="mt-1.5 text-sm text-ink/70">{c.formNote}</p>

            {status === "success" ? (
              <div className="animate-pop-in grid place-items-center py-14 text-center" role="status">
                <span className="grid size-20 place-items-center rounded-full bg-emerald-500 text-white shadow-[0_16px_40px_-10px_rgb(16_185_129/0.8)]">
                  <Icon name="check" className="size-10" strokeWidth={3} />
                </span>
                <p className="font-display mt-6 text-2xl font-semibold text-navy-900">Enquiry received</p>
                <p className="mt-2 max-w-sm text-ink/75">We will call you within one working day. For anything urgent, call {company.phoneDisplay}.</p>
                <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-brand-600 underline underline-offset-4">
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form ref={form} onSubmit={onSubmit} noValidate className="animate-fade-in mt-7 grid gap-4">
                  {/* honeypot — hidden from people, irresistible to bots */}
                  <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Company website
                      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="f-name" label="Full name *" error={errors.name}>
                      <input id="f-name" name="name" autoComplete="name" placeholder="Your name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "f-name-err" : undefined} className={fieldCls(errors.name)} />
                    </Field>
                    <Field id="f-phone" label="Phone / WhatsApp *" error={errors.phone}>
                      <input id="f-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98XXXXXXXX" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "f-phone-err" : undefined} className={fieldCls(errors.phone)} />
                    </Field>
                  </div>
                  <Field id="f-email" label="Email (optional)" error={errors.email}>
                    <input id="f-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-invalid={!!errors.email} className={fieldCls(errors.email)} />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field id="f-district" label="District">
                      <select id="f-district" name="district" defaultValue="" className={fieldCls()}>
                        <option value="">Select…</option>
                        {districts.map((d) => (
                          <option key={d.slug}>{d.name}</option>
                        ))}
                        <option>Other</option>
                      </select>
                    </Field>
                    <Field id="f-service" label="Service">
                      <select id="f-service" name="service" defaultValue="" className={fieldCls()}>
                        <option value="">Select…</option>
                        {c.services.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id="f-budget" label="Budget">
                      <select id="f-budget" name="budget" defaultValue="" className={fieldCls()}>
                        <option value="">Select…</option>
                        {c.budgets.map((b) => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field id="f-message" label="About your project *" error={errors.message}>
                    <textarea id="f-message" name="message" rows={4} placeholder="Plot size, location, what you'd like to build, timeline…" aria-invalid={!!errors.message} aria-describedby={errors.message ? "f-message-err" : undefined} className={`${fieldCls(errors.message)} resize-y`} />
                  </Field>

                  {status === "error" && (
                    <div className="animate-rise-in rounded-2xl border border-brand-500/30 bg-brand-500/8 p-4 text-sm text-brand-700" role="alert">
                      <p className="font-semibold">{serverMsg}</p>
                      <p className="mt-1 text-brand-700/90">
                        Please reach us directly:{" "}
                        <a className="font-semibold underline" href={telHref}>
                          call {company.phoneDisplay}
                        </a>{" "}
                        or{" "}
                        <a className="font-semibold underline" href={fallbackWa} target="_blank" rel="noopener noreferrer">
                          send on WhatsApp
                        </a>
                        .
                      </p>
                    </div>
                  )}

                  <div className="mt-1 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="group relative inline-flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-brand-600 px-7 py-4 text-[0.95rem] font-semibold text-white shadow-[0_16px_36px_-12px_rgb(209_26_42/0.9)] transition hover:bg-brand-500 active:scale-[0.98] disabled:opacity-70"
                    >
                      {status === "sending" ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…
                        </>
                      ) : (
                        <>
                          Send enquiry <Icon name="send" className="size-4 transition group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                    <a
                      href={whatsappHref("Hello ABS Builder's, I'd like to discuss a project.")}
                      onClick={(e) => {
                        e.currentTarget.href = waLink();
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-6 py-4 text-[0.95rem] font-semibold text-[#118a41] transition hover:bg-[#25D366]/20"
                    >
                      <Icon name="whatsapp" className="size-5" /> WhatsApp
                    </a>
                  </div>
                  <p className="text-center text-xs text-ink/55">
                    We use your details only to respond to this enquiry. See our{" "}
                    <a href="/privacy" className="underline underline-offset-2 hover:text-navy-900">
                      privacy policy
                    </a>
                    .
                  </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
