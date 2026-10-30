"use server";

import { del, list, put } from "@vercel/blob";
import { draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import {
  clearDraft,
  getDraftPatch,
  getPublishedContent,
  publishPatch,
  writeDraft,
  type ContentPatch,
} from "@/lib/content";
import {
  checkAdminPassword,
  clearAdminSession,
  hasAdminSession,
  setAdminSession,
} from "@/lib/admin-session";
import {
  defaultTourFromEmail,
  getTourMailSettings,
  getTourMailStatus,
  saveTourMailSettings,
  type TourMailStatus,
} from "@/lib/tour-mail";

export type LoginState = { error?: string };
export type TourMailActionResult = {
  ok: boolean;
  message: string;
  status?: TourMailStatus;
  errors?: Partial<Record<"toEmail" | "fromEmail" | "apiKey", string>>;
};

const RATE_LIMIT_PREFIX = "admin-login/";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const localAttempts = new Map<string, { count: number; until: number }>();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function clientKey() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || h.get("x-real-ip") || "local";
  return ip.replace(/[^a-zA-Z0-9_.:-]/g, "_");
}

async function readAttempts(key: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return localAttempts.get(key) ?? { count: 0, until: 0 };
  try {
    const pathname = `${RATE_LIMIT_PREFIX}${key}.json`;
    const result = await list({ prefix: pathname, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === pathname);
    if (!blob) return { count: 0, until: 0 };
    const res = await fetch(`${blob.url}?v=${blob.uploadedAt.getTime()}`, { cache: "no-store" });
    return (await res.json()) as { count: number; until: number };
  } catch {
    return { count: 0, until: 0 };
  }
}

async function writeAttempts(key: string, value: { count: number; until: number }) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    localAttempts.set(key, value);
    return;
  }
  await put(`${RATE_LIMIT_PREFIX}${key}.json`, JSON.stringify(value), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

async function clearAttempts(key: string) {
  localAttempts.delete(key);
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(`${RATE_LIMIT_PREFIX}${key}.json`);
  } catch {
    // Missing rate-limit files are fine.
  }
}

async function requireAdmin() {
  if (!(await hasAdminSession())) throw new Error("Not authorized.");
}

function clean(value: FormDataEntryValue | null, max = 500) {
  return (typeof value === "string" ? value : "").trim().slice(0, max);
}

function emailAddress(value: string) {
  return value.match(/<([^<>@\s]+@[^<>@\s]+\.[^<>@\s]+)>/)?.[1] ?? value;
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const key = await clientKey();
  const attempts = await readAttempts(key);
  const now = Date.now();
  if (attempts.count >= MAX_ATTEMPTS && attempts.until > now) {
    return { error: "Too many tries. Please wait 15 minutes and try again." };
  }

  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    const next = { count: attempts.until > now ? attempts.count + 1 : 1, until: now + WINDOW_MS };
    await writeAttempts(key, next);
    return { error: "That password did not work." };
  }

  await clearAttempts(key);
  await setAdminSession();
  const draft = await draftMode();
  draft.enable();
  redirect("/");
}

export async function logoutAction() {
  await clearAdminSession();
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}

export async function saveDraftAction(patch: ContentPatch) {
  await requireAdmin();
  await writeDraft(patch);
  return { ok: true };
}

export async function publishAction(patch: ContentPatch) {
  await requireAdmin();
  await publishPatch(patch);
  updateTag("content");
  return { ok: true };
}

export async function revertAction() {
  await requireAdmin();
  await clearDraft();
  return { ok: true };
}

export async function getPublishCountAction() {
  await requireAdmin();
  const draft = await getDraftPatch();
  return (
    Object.keys(draft.text ?? {}).length +
    Object.keys(draft.docs ?? {}).length +
    Object.keys(draft.images ?? {}).length
  );
}

export async function getPublishedEmailAction() {
  const content = await getPublishedContent();
  return content.text["contact.email"];
}

export async function getTourMailStatusAction() {
  await requireAdmin();
  const content = await getPublishedContent();
  return getTourMailStatus(content.text["contact.email"]);
}

export async function saveTourMailSettingsAction(formData: FormData): Promise<TourMailActionResult> {
  await requireAdmin();
  const content = await getPublishedContent();
  const fallbackToEmail = content.text["contact.email"];
  const toEmail = clean(formData.get("toEmail"), 200) || fallbackToEmail;
  const fromEmail = clean(formData.get("fromEmail"), 200) || defaultTourFromEmail();
  const apiKey = clean(formData.get("apiKey"), 500);
  const clearApiKey = clean(formData.get("clearApiKey")) === "on";
  const errors: TourMailActionResult["errors"] = {};

  if (!emailRe.test(toEmail)) errors.toEmail = "Enter a valid destination email.";
  if (!emailRe.test(emailAddress(fromEmail))) errors.fromEmail = "Enter a valid sender email or Name <email>.";
  if (apiKey && !apiKey.startsWith("re_")) errors.apiKey = "Resend API keys usually start with re_.";

  if (Object.keys(errors).length) {
    return {
      ok: false,
      message: "Please check the highlighted settings.",
      errors,
      status: await getTourMailStatus(fallbackToEmail),
    };
  }

  await saveTourMailSettings({ toEmail, fromEmail, apiKey, clearApiKey });
  return {
    ok: true,
    message: "Tour request settings saved.",
    status: await getTourMailStatus(fallbackToEmail),
  };
}

export async function sendTourMailTestAction(): Promise<TourMailActionResult> {
  await requireAdmin();
  const content = await getPublishedContent();
  const fallbackToEmail = content.text["contact.email"];
  const settings = await getTourMailSettings();
  const status = await getTourMailStatus(fallbackToEmail);
  const apiKey = settings.apiKey || process.env.RESEND_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      message: "Add a Resend API key before sending a test.",
      status,
      errors: { apiKey: "Missing API key." },
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: status.fromEmail,
        to: [status.toEmail],
        subject: "Test tour request email",
        text: [
          "This is a test from the Montessori School of Central Marin website admin settings.",
          "",
          "If you received this, Request a Tour email delivery is connected.",
        ].join("\n"),
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  } catch (err) {
    console.error("[admin] failed to send tour mail test", err);
    return {
      ok: false,
      message: "The test email could not be sent. Check the API key and verified sender.",
      status,
    };
  }

  return {
    ok: true,
    message: `Test email sent to ${status.toEmail}.`,
    status,
  };
}
