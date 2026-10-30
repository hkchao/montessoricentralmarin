import "server-only";

import type { ContentPatch } from "@/lib/content";

export type GitSyncResult =
  | { status: "committed"; sha: string }
  | { status: "unchanged" | "skipped" }
  | { status: "failed"; error: string };

export const SNAPSHOT_PATH = "src/content/published.json";
export const UPLOADS_DIR = "public/uploads";

type TreeEntry = { path: string; mode: "100644"; type: "blob"; sha?: string | null; content?: string };

function config() {
  const token = process.env.GITHUB_SYNC_TOKEN;
  if (!token) return null;
  const owner = process.env.VERCEL_GIT_REPO_OWNER;
  const slug = process.env.VERCEL_GIT_REPO_SLUG;
  const repo = process.env.GITHUB_SYNC_REPO || (owner && slug ? `${owner}/${slug}` : "jedmelnik/montessoricentralmarin");
  const branch = process.env.GITHUB_SYNC_BRANCH || "main";
  return { token, repo, branch };
}

function isBlobUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

// Uploads keep their Blob pathname (docs/<timestamp>-<name>), so the git copy lives at public/uploads/docs/...
function uploadPath(url: string) {
  return `${UPLOADS_DIR}/${decodeURIComponent(new URL(url).pathname.replace(/^\/+/, ""))}`;
}

/** The published content with uploads pointed at their committed copies, so the snapshot stands alone. */
export function snapshotOf(patch: ContentPatch) {
  const uploads = new Map<string, string>();
  const local = (url: string) => {
    if (!isBlobUrl(url)) return url;
    const path = uploadPath(url);
    uploads.set(path, url);
    return path.replace(/^public/, "");
  };
  const docs = Object.fromEntries(
    Object.entries(patch.docs ?? {}).map(([key, doc]) => [key, { ...doc, href: local(doc.href) }]),
  );
  const images = Object.fromEntries(
    Object.entries(patch.images ?? {}).map(([key, image]) => [key, { ...image, src: local(image.src) }]),
  );
  const snapshot: ContentPatch = { text: patch.text ?? {}, docs, images };
  return { json: `${JSON.stringify(snapshot, null, 2)}\n`, uploads };
}

function describe(patch: ContentPatch) {
  const count = (part?: Record<string, unknown>) => Object.keys(part ?? {}).length;
  const parts = [
    [count(patch.text), "text"],
    [count(patch.docs), "PDF"],
    [count(patch.images), "image"],
  ] as const;
  const summary = parts
    .filter(([n]) => n)
    .map(([n, label]) => `${n} ${label}${n === 1 ? "" : "s"}`)
    .join(", ");
  return summary || "no changes";
}

async function gh<T>(cfg: NonNullable<ReturnType<typeof config>>, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`https://api.github.com/repos/${cfg.repo}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw Object.assign(new Error(`GitHub ${res.status}: ${body.slice(0, 200)}`), { status: res.status });
  }
  return (await res.json()) as T;
}

async function commitOnce(cfg: NonNullable<ReturnType<typeof config>>, published: ContentPatch, changes: ContentPatch) {
  const ref = await gh<{ object: { sha: string } }>(cfg, `/git/ref/heads/${cfg.branch}`);
  const parent = ref.object.sha;
  const commit = await gh<{ tree: { sha: string } }>(cfg, `/git/commits/${parent}`);
  const tree = await gh<{ tree: { path: string; type: string }[]; truncated: boolean }>(
    cfg,
    `/git/trees/${commit.tree.sha}?recursive=1`,
  );
  const existing = new Set(tree.tree.filter((item) => item.type === "blob").map((item) => item.path));

  const { json, uploads } = snapshotOf(published);
  const entries: TreeEntry[] = [{ path: SNAPSHOT_PATH, mode: "100644", type: "blob", content: json }];

  for (const [path, url] of uploads) {
    if (existing.has(path)) continue;
    const file = await fetch(url, { cache: "no-store" });
    if (!file.ok) throw new Error(`Unable to download ${url} (${file.status})`);
    const content = Buffer.from(await file.arrayBuffer()).toString("base64");
    const blob = await gh<{ sha: string }>(cfg, "/git/blobs", {
      method: "POST",
      body: JSON.stringify({ content, encoding: "base64" }),
    });
    entries.push({ path, mode: "100644", type: "blob", sha: blob.sha });
  }

  if (!tree.truncated) {
    for (const path of existing) {
      if (path.startsWith(`${UPLOADS_DIR}/`) && !uploads.has(path)) {
        entries.push({ path, mode: "100644", type: "blob", sha: null });
      }
    }
  }

  const nextTree = await gh<{ sha: string }>(cfg, "/git/trees", {
    method: "POST",
    body: JSON.stringify({ base_tree: commit.tree.sha, tree: entries }),
  });
  if (nextTree.sha === commit.tree.sha) return { status: "unchanged" } as const;

  const next = await gh<{ sha: string }>(cfg, "/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: `Admin publish: ${describe(changes)}`, tree: nextTree.sha, parents: [parent] }),
  });
  await gh(cfg, `/git/refs/heads/${cfg.branch}`, { method: "PATCH", body: JSON.stringify({ sha: next.sha }) });
  return { status: "committed", sha: next.sha } as const;
}

/** Commits the published content and its uploaded files to GitHub. Never throws. */
export async function commitPublished(published: ContentPatch, changes: ContentPatch): Promise<GitSyncResult> {
  const cfg = config();
  if (!cfg) return { status: "skipped" };
  try {
    try {
      return await commitOnce(cfg, published, changes);
    } catch (err) {
      // 422 on the ref update means someone pushed in between; rebuild on the new head once.
      if ((err as { status?: number }).status !== 422) throw err;
      return await commitOnce(cfg, published, changes);
    }
  } catch (err) {
    console.error("[git-sync] unable to commit published content", err);
    return { status: "failed", error: err instanceof Error ? err.message : "Unknown error" };
  }
}
