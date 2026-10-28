"use server";

import { getPublishedContent, textOf } from "@/lib/content";
import { defaultTourFromEmail, getTourMailSettings } from "@/lib/tour-mail";

export type TourFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
};

type Field = "parentName" | "email" | "phone" | "childAge" | "program" | "preferredTimes" | "message";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(v: FormDataEntryValue | null, max = 500) {
  return (typeof v === "string" ? v : "").trim().slice(0, max);
}

export async function submitTourRequest(_prev: TourFormState, formData: FormData): Promise<TourFormState> {
  const content = await getPublishedContent();
  const phone = textOf(content, "contact.phone");
  const email = textOf(content, "contact.email");
  // Honeypot — bots fill every field; humans never see this one.
  if (clean(formData.get("website"))) {
    return { status: "success", message: textOf(content, "form.success.message") };
  }

  const data = {
    parentName: clean(formData.get("parentName"), 120),
    email: clean(formData.get("email"), 200),
    phone: clean(formData.get("phone"), 40),
    childAge: clean(formData.get("childAge"), 60),
    program: clean(formData.get("program"), 60),
    preferredTimes: clean(formData.get("preferredTimes"), 200),
    message: clean(formData.get("message"), 2000),
  };

  const errors: TourFormState["errors"] = {};
  if (!data.parentName) errors.parentName = textOf(content, "form.error.parentName");
  if (!emailRe.test(data.email)) errors.email = textOf(content, "form.error.email");
  if (!data.childAge) errors.childAge = textOf(content, "form.error.childAge");
  if (Object.keys(errors).length) {
    return { status: "error", message: textOf(content, "form.error.generic"), errors };
  }

  const tourMail = await getTourMailSettings();
  const apiKey = tourMail.apiKey || process.env.RESEND_API_KEY;
  const to = tourMail.toEmail || process.env.CONTACT_TO_EMAIL || email;
  const from = tourMail.fromEmail || process.env.CONTACT_FROM_EMAIL || defaultTourFromEmail();

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY not set — tour request not delivered:", data);
    return {
      status: "error",
      message: textOf(content, "form.error.noApiKey").replace("{phone}", phone).replace("{email}", email),
    };
  }

  const text = [
    `New tour request from the website`,
    ``,
    `Parent / guardian: ${data.parentName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Child's age: ${data.childAge}`,
    `Program interest: ${data.program || "—"}`,
    `Preferred tour times: ${data.preferredTimes || "—"}`,
    ``,
    `Message:`,
    data.message || "—",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `Tour request — ${data.parentName} (child age ${data.childAge})`,
        text,
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("[contact] failed to send tour request", err);
    return {
      status: "error",
      message: textOf(content, "form.error.delivery").replace("{phone}", phone).replace("{email}", email),
    };
  }

  return {
    status: "success",
    message: textOf(content, "form.success.message"),
  };
}
