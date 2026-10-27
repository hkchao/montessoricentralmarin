import "server-only";

import { del, list, put } from "@vercel/blob";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { defaultContent, type SiteContent } from "@/content/defaults";
import { hasAdminSession } from "@/lib/admin-session";

export type ContentPatch = Partial<{
  text: Record<string, string>;
  docs: SiteContent["docs"];
  images: SiteContent["images"];
}>;

const PUBLISHED_PATH = "content/published.json";
const DRAFT_PATH = "content/draft.json";

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function mergeContent(...parts: (SiteContent | ContentPatch | null | undefined)[]): SiteContent {
  return parts.reduce<SiteContent>(
    (acc, part) => ({
      text: { ...acc.text, ...(part?.text ?? {}) },
      docs: { ...acc.docs, ...(part?.docs ?? {}) },
      images: { ...acc.images, ...(part?.images ?? {}) },
    }),
    { text: {}, docs: {}, images: {} },
  );
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobToken()) return null;
  try {
    const result = await list({ prefix: pathname, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === pathname);
    if (!blob) return null;
    const res = await fetch(`${blob.url}?v=${blob.uploadedAt.getTime()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[content] unable to read ${pathname}`, err);
    return null;
  }
}

const getPublishedPatch = unstable_cache(
  async () => (await readBlobJson<ContentPatch>(PUBLISHED_PATH)) ?? {},
  ["site-content"],
  { tags: ["content"] },
);

export async function getDraftPatch() {
  return (await readBlobJson<ContentPatch>(DRAFT_PATH)) ?? {};
}

export async function getPublishedContent() {
  return mergeContent(defaultContent, await getPublishedPatch());
}

export async function getContent() {
  const published = await getPublishedContent();
  const draft = await draftMode();
  const editing = draft.isEnabled && (await hasAdminSession());
  const draftPatch = editing ? await getDraftPatch() : {};
  return {
    content: mergeContent(published, draftPatch),
    published,
    draft: draftPatch,
    editing,
  };
}

export async function writeDraft(patch: ContentPatch) {
  if (!hasBlobToken()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }
  const empty =
    !Object.keys(patch.text ?? {}).length &&
    !Object.keys(patch.docs ?? {}).length &&
    !Object.keys(patch.images ?? {}).length;
  if (empty) {
    await deleteDraft();
    return;
  }
  await put(DRAFT_PATH, JSON.stringify(patch, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export async function publishDraft() {
  if (!hasBlobToken()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }
  const publishedPatch = await getPublishedPatch();
  const draftPatch = await getDraftPatch();
  const next = mergeContent(publishedPatch as ContentPatch, draftPatch);
  await put(PUBLISHED_PATH, JSON.stringify(next, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
  await deleteDraft();
  await cleanupUnreferencedUploads(next);
}

export async function deleteDraft() {
  if (!hasBlobToken()) return;
  try {
    await del(DRAFT_PATH);
  } catch {
    // Missing drafts are fine.
  }
}

async function cleanupUnreferencedUploads(content: SiteContent) {
  if (!hasBlobToken()) return;
  const keep = new Set([
    ...Object.values(content.docs).map((doc) => doc.href),
    ...Object.values(content.images).map((image) => image.src),
  ]);
  for (const prefix of ["docs/", "images/"]) {
    const result = await list({ prefix, limit: 1000 });
    const unused = result.blobs.filter((blob) => !keep.has(blob.url)).map((blob) => blob.url);
    if (unused.length) await del(unused);
  }
}

export function textOf(content: SiteContent, key: string) {
  return content.text[key] ?? defaultContent.text[key] ?? "";
}

export function docOf(content: SiteContent, key: string) {
  return content.docs[key] ?? defaultContent.docs[key];
}

export function imageOf(content: SiteContent, key: string) {
  return content.images[key] ?? defaultContent.images[key];
}

export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.length === 10 ? `1${digits}` : digits;
  return normalized ? `tel:+${normalized}` : "tel:";
}

export function mailHref(email: string) {
  return `mailto:${email.trim()}`;
}

export function addressFull(content: SiteContent) {
  const street = textOf(content, "contact.address.street");
  const city = textOf(content, "contact.address.city");
  const state = textOf(content, "contact.address.state");
  const zip = textOf(content, "contact.address.zip");
  return `${street}, ${city}, ${state} ${zip}`;
}
