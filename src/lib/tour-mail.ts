import "server-only";

import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { list, put } from "@vercel/blob";
import { adminSecret } from "@/lib/admin-session";

const SETTINGS_PATH = "content/tour-mail.json";
const DEFAULT_FROM = "MSCM Website <onboarding@resend.dev>";

type EncryptedValue = {
  iv: string;
  tag: string;
  value: string;
};

type StoredTourMailSettings = {
  toEmail?: string;
  fromEmail?: string;
  encryptedApiKey?: EncryptedValue;
  apiKeyHint?: string;
  updatedAt?: string;
};

export type TourMailSettings = {
  toEmail?: string;
  fromEmail?: string;
  apiKey?: string;
  hasApiKey: boolean;
  apiKeyHint?: string;
  updatedAt?: string;
};

export type TourMailStatus = {
  toEmail: string;
  fromEmail: string;
  hasApiKey: boolean;
  apiKeyHint?: string;
  updatedAt?: string;
};

type SaveTourMailSettingsInput = {
  toEmail: string;
  fromEmail: string;
  apiKey?: string;
  clearApiKey?: boolean;
};

const localStore = globalThis as typeof globalThis & {
  __mscmTourMailSettings?: StoredTourMailSettings;
};

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function encryptionKey() {
  return createHash("sha256").update(adminSecret()).digest();
}

function encrypt(value: string): EncryptedValue {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64url"),
    tag: tag.toString("base64url"),
    value: encrypted.toString("base64url"),
  };
}

function decrypt(value: EncryptedValue) {
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(value.iv, "base64url"));
  decipher.setAuthTag(Buffer.from(value.tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(value.value, "base64url")), decipher.final()]).toString("utf8");
}

function keyHint(apiKey: string) {
  const trimmed = apiKey.trim();
  if (trimmed.length <= 8) return "saved";
  return `${trimmed.slice(0, 3)}...${trimmed.slice(-4)}`;
}

async function readStoredSettings(): Promise<StoredTourMailSettings> {
  if (!hasBlobToken()) return localStore.__mscmTourMailSettings ?? {};
  try {
    const result = await list({ prefix: SETTINGS_PATH, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === SETTINGS_PATH);
    if (!blob) return {};
    const res = await fetch(`${blob.url}?v=${blob.uploadedAt.getTime()}`, { cache: "no-store" });
    if (!res.ok) return {};
    return (await res.json()) as StoredTourMailSettings;
  } catch (err) {
    console.warn("[tour-mail] unable to read settings", err);
    return {};
  }
}

async function writeStoredSettings(settings: StoredTourMailSettings) {
  if (!hasBlobToken()) {
    localStore.__mscmTourMailSettings = settings;
    return;
  }
  await put(SETTINGS_PATH, JSON.stringify(settings, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

export async function getTourMailSettings(): Promise<TourMailSettings> {
  const stored = await readStoredSettings();
  let apiKey: string | undefined;
  if (stored.encryptedApiKey) {
    try {
      apiKey = decrypt(stored.encryptedApiKey);
    } catch (err) {
      console.error("[tour-mail] unable to decrypt API key", err);
    }
  }

  return {
    toEmail: stored.toEmail,
    fromEmail: stored.fromEmail,
    apiKey,
    hasApiKey: Boolean(apiKey),
    apiKeyHint: stored.apiKeyHint,
    updatedAt: stored.updatedAt,
  };
}

export async function getTourMailStatus(fallbackToEmail: string): Promise<TourMailStatus> {
  const settings = await getTourMailSettings();
  return {
    toEmail: settings.toEmail || process.env.CONTACT_TO_EMAIL || fallbackToEmail,
    fromEmail: settings.fromEmail || process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
    hasApiKey: settings.hasApiKey || Boolean(process.env.RESEND_API_KEY),
    apiKeyHint: settings.apiKeyHint ?? (process.env.RESEND_API_KEY ? "env" : undefined),
    updatedAt: settings.updatedAt,
  };
}

export async function saveTourMailSettings(input: SaveTourMailSettingsInput) {
  const existing = await readStoredSettings();
  const apiKey = input.apiKey?.trim();
  const next: StoredTourMailSettings = {
    toEmail: input.toEmail.trim(),
    fromEmail: input.fromEmail.trim(),
    encryptedApiKey: existing.encryptedApiKey,
    apiKeyHint: existing.apiKeyHint,
    updatedAt: new Date().toISOString(),
  };

  if (input.clearApiKey) {
    next.encryptedApiKey = undefined;
    next.apiKeyHint = undefined;
  } else if (apiKey) {
    next.encryptedApiKey = encrypt(apiKey);
    next.apiKeyHint = keyHint(apiKey);
  }

  await writeStoredSettings(next);
  return next;
}

export function defaultTourFromEmail() {
  return DEFAULT_FROM;
}
