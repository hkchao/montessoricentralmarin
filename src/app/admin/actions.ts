"use server";

import { del, list, put } from "@vercel/blob";
import { draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import {
  deleteDraft,
  getDraftPatch,
  getPublishedContent,
  publishDraft,
  writeDraft,
  type ContentPatch,
} from "@/lib/content";
import {
  checkAdminPassword,
  clearAdminSession,
  hasAdminSession,
  setAdminSession,
} from "@/lib/admin-session";

export type LoginState = { error?: string };

const RATE_LIMIT_PREFIX = "admin-login/";
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const localAttempts = new Map<string, { count: number; until: number }>();

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

export async function publishAction() {
  await requireAdmin();
  await publishDraft();
  updateTag("content");
  return { ok: true };
}

export async function revertAction() {
  await requireAdmin();
  await deleteDraft();
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
