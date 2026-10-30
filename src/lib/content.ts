import "server-only";

import { del, get, list, put } from "@vercel/blob";
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { defaultContent, type SiteContent } from "@/content/defaults";
import { hasAdminSession } from "@/lib/admin-session";

export type ContentPatch = Partial<{
  text: Record<string, string>;
  docs: SiteContent["docs"];
  images: SiteContent["images"];
}>;

// Blob reads lag behind overwrites of the same pathname, even uncached, so every save writes a new
// timestamped file and readers take the newest one in the folder.
const PUBLISHED_PREFIX = "content/published/";
const DRAFT_PREFIX = "content/draft/";
const LEGACY_PUBLISHED_PATH = "content/published.json";
const LEGACY_DRAFT_PATH = "content/draft.json";
const PUBLISHED_HISTORY = 5;

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

async function listVersions(prefix: string) {
  const result = await list({ prefix, limit: 1000 });
  return result.blobs.sort((a, b) => a.pathname.localeCompare(b.pathname));
}

async function readLatest(prefix: string): Promise<ContentPatch | null> {
  const newest = (await listVersions(prefix)).at(-1);
  if (!newest) return null;
  const res = await fetch(newest.url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Unable to read ${newest.pathname} (${res.status})`);
  return (await res.json()) as ContentPatch;
}

async function readLegacy(pathname: string): Promise<ContentPatch | null> {
  const result = await get(pathname, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return (await new Response(result.stream).json()) as ContentPatch;
}

async function writeVersion(prefix: string, patch: ContentPatch, keep: number) {
  const pathname = `${prefix}${String(Date.now()).padStart(15, "0")}.json`;
  await put(pathname, JSON.stringify(patch, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
  const older = (await listVersions(prefix)).filter((blob) => blob.pathname < pathname);
  const stale = older.slice(0, Math.max(0, older.length - (keep - 1)));
  if (stale.length) await del(stale.map((blob) => blob.url));
}

async function readPublishedPatch(): Promise<ContentPatch> {
  if (!hasBlobToken()) return {};
  return (await readLatest(PUBLISHED_PREFIX)) ?? (await readLegacy(LEGACY_PUBLISHED_PATH)) ?? {};
}

// Errors are thrown inside the cache so a failed read is never cached as the live site.
// Local dev servers never see the invalidation from a publish on Vercel, so they read fresh every time.
const getPublishedPatch =
  process.env.NODE_ENV === "development"
    ? readPublishedPatch
    : unstable_cache(readPublishedPatch, ["site-content"], { tags: ["content"] });

export async function getDraftPatch(): Promise<ContentPatch> {
  if (!hasBlobToken()) return {};
  try {
    return (await readLatest(DRAFT_PREFIX)) ?? {};
  } catch (err) {
    console.warn("[content] unable to read draft", err);
    return {};
  }
}

export async function getPublishedContent() {
  try {
    return mergeContent(defaultContent, await getPublishedPatch());
  } catch (err) {
    console.warn("[content] unable to read published content", err);
    return defaultContent;
  }
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
  await writeVersion(DRAFT_PREFIX, patch, 1);
}

export async function publishPatch(patch: ContentPatch) {
  if (!hasBlobToken()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }
  const next = mergeContent(await readPublishedPatch(), patch);
  await writeVersion(PUBLISHED_PREFIX, next, PUBLISHED_HISTORY);
  await clearDraft();
  await del([LEGACY_PUBLISHED_PATH, LEGACY_DRAFT_PATH]).catch(() => {});
  await cleanupUnreferencedUploads(next);
}

export async function clearDraft() {
  if (!hasBlobToken()) return;
  await writeVersion(DRAFT_PREFIX, {}, 1);
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
