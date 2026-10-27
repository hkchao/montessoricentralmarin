"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { useContent } from "@/components/admin/ContentProvider";
import type { ImageContent } from "@/content/defaults";

const MAX_SIZE = 15 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

function fmtBytes(bytes: number) {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

function aspect(width: number, height: number) {
  const d = gcd(width, height);
  return `${width / d}:${height / d}`;
}

function readDimensions(file: File) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function uploadPath(file: File) {
  const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `images/${Date.now()}-${clean}`;
}

export function ImageReplaceDialog({ imageKey, onClose }: { imageKey: string; onClose: () => void }) {
  const { content, updateImage } = useContent();
  const image = content.images[imageKey];
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [dims, setDims] = useState<{ width: number; height: number }>();
  const [alt, setAlt] = useState(image.alt);
  const [status, setStatus] = useState("");

  const warnings =
    file && dims
      ? [
          file.type && file.type !== `image/${image.type === "jpg" ? "jpeg" : image.type}`
            ? `File type is ${file.type.replace("image/", "").toUpperCase()}, original was ${image.type.toUpperCase()}.`
            : "",
          dims.width !== image.width || dims.height !== image.height
            ? `Resolution is ${dims.width}x${dims.height}, original was ${image.width}x${image.height}.`
            : "",
          aspect(dims.width, dims.height) !== aspect(image.width, image.height)
            ? `Aspect ratio is ${aspect(dims.width, dims.height)}, original was ${aspect(image.width, image.height)}. It may crop differently.`
            : "",
          file.size !== image.bytes ? `File size is ${fmtBytes(file.size)}, original was ${fmtBytes(image.bytes)}.` : "",
        ].filter(Boolean)
      : [];

  async function choose(next: File | undefined) {
    setStatus("");
    setFile(undefined);
    setDims(undefined);
    if (!next) return;
    if (!ALLOWED.includes(next.type)) {
      setStatus("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (next.size > MAX_SIZE) {
      setStatus("Images must be 15 MB or smaller.");
      return;
    }
    setFile(next);
    setDims(await readDimensions(next));
  }

  async function save() {
    if (!file || !dims) return;
    setStatus("Uploading...");
    try {
      const blob = await upload(uploadPath(file), file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        clientPayload: JSON.stringify({ kind: "image", imageKey }),
        contentType: file.type,
      });
      const next: ImageContent = {
        ...image,
        src: blob.url,
        alt,
        width: dims.width,
        height: dims.height,
        type: file.type.replace("image/", "").replace("jpeg", "jpg"),
        bytes: file.size,
      };
      updateImage(imageKey, next);
      onClose();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Upload failed.");
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/65 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-cream p-6 text-ink shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker text-sun-deep">Replace image</p>
            <h2 className="font-display mt-2 text-2xl font-medium text-navy">{imageKey}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full px-3 py-1 text-sm font-semibold text-navy hover:bg-navy-tint">
            Close
          </button>
        </div>

        <div className="mt-5 rounded-2xl bg-white p-4 text-sm leading-relaxed text-muted">
          <p className="font-semibold text-navy">Original requirements</p>
          <p>
            {image.width}x{image.height} px, {aspect(image.width, image.height)}, {image.type.toUpperCase()}, {fmtBytes(image.bytes)}.
          </p>
          <p className="mt-2">New images keep the old crop/focus settings.</p>
        </div>

        <label className="mt-5 block text-sm font-semibold text-navy" htmlFor="image-alt">
          Screen-reader description
        </label>
        <input
          id="image-alt"
          value={alt}
          onChange={(event) => setAlt(event.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-sun/60"
        />

        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => void choose(event.currentTarget.files?.[0])}
        />
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="mt-5 inline-flex rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-navy-deep"
        >
          Choose image
        </button>

        {file && dims && (
          <div className="mt-4 rounded-2xl bg-sand p-4 text-sm">
            <p className="font-semibold text-navy">Selected: {file.name}</p>
            {warnings.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-muted">This image matches the original specs.</p>
            )}
          </div>
        )}

        {status && <p className="mt-4 text-sm font-semibold text-sun-deep">{status}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void save()}
            disabled={!file}
            className="rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
