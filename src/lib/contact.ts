export interface Inquiry {
  name: string;
  phone: string;
  email: string;
  district: string;
  service: string;
  budget: string;
  message: string;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Shared by the form (instant feedback) and the API route (the real gatekeeper). */
export function validateInquiry(input: unknown): { data: Inquiry; errors: InquiryErrors } {
  const raw = (input ?? {}) as Record<string, unknown>;
  const data: Inquiry = {
    name: clean(raw.name, 80),
    phone: clean(raw.phone, 24),
    email: clean(raw.email, 120),
    district: clean(raw.district, 60),
    service: clean(raw.service, 80),
    budget: clean(raw.budget, 60),
    message: clean(raw.message, 2000),
  };
  const errors: InquiryErrors = {};
  if (data.name.length < 2) errors.name = "Please enter your name.";
  const digits = data.phone.replace(/\D/g, "");
  if (!/^[\d+\-\s()]+$/.test(data.phone) || digits.length < 7 || digits.length > 15) errors.phone = "Enter a valid phone number.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "Enter a valid email or leave it blank.";
  if (data.message.length < 10) errors.message = "Tell us a little about your project (at least 10 characters).";
  return { data, errors };
}

export function inquiryToText(i: Inquiry): string {
  return [
    `New website enquiry — ABS Builder's`,
    ``,
    `Name: ${i.name}`,
    `Phone: ${i.phone}`,
    `Email: ${i.email || "—"}`,
    `District: ${i.district || "—"}`,
    `Service: ${i.service || "—"}`,
    `Budget: ${i.budget || "—"}`,
    ``,
    `Message:`,
    i.message,
  ].join("\n");
}
