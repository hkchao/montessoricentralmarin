"use client";

import { useRef, useState, type ReactNode } from "react";
import { upload } from "@vercel/blob/client";
import { ButtonLink } from "@/components/Button";
import { useContent } from "@/components/admin/ContentProvider";

type ButtonProps = {
  docKey: string;
  children: ReactNode;
  variant?: "primary" | "navy" | "ghost" | "ghost-light" | "link";
  size?: "md" | "lg";
  className?: string;
};

function uploadPath(file: File) {
  const clean = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `docs/${Date.now()}-${clean}`;
}

function labelFromFileName(name: string) {
  return name.replace(/\.pdf$/i, "").replace(/_+/g, " ").replace(/\s+/g, " ").trim() || name;
}

export function DocLabel({ docKey }: { docKey: string }) {
  const { content } = useContent();
  return <>{content.docs[docKey]?.label}</>;
}

export function DocButton({ docKey, children, variant, size, className }: ButtonProps) {
  const { content, editing, updateDoc } = useContent();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const doc = content.docs[docKey];

  if (!editing) {
    return (
      <ButtonLink href={doc.href} variant={variant} size={size} className={className} download={doc.fileName}>
        {children}
      </ButtonLink>
    );
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => input.current?.click()}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-dashed border-sun bg-sun/10 px-5 py-2.5 font-semibold text-navy transition-colors hover:bg-sun/20 ${className ?? ""}`}
      >
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={async (event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (!file) return;
          if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setMessage("Please choose a PDF.");
            return;
          }
          if (file.size > 20 * 1024 * 1024) {
            setMessage("PDFs must be 20 MB or smaller.");
            return;
          }
          setMessage("Uploading...");
          try {
            const blob = await upload(uploadPath(file), file, {
              access: "public",
              handleUploadUrl: "/api/admin/upload",
              clientPayload: JSON.stringify({ kind: "doc", docKey }),
              contentType: "application/pdf",
            });
            updateDoc(docKey, { ...doc, href: blob.url, fileName: file.name, label: labelFromFileName(file.name) });
            setMessage("Replaced, unpublished.");
          } catch (err) {
            setMessage(err instanceof Error ? err.message : "Upload failed.");
          }
        }}
      />
      {message && <span className="text-xs font-semibold text-sun-deep">{message}</span>}
    </span>
  );
}

export function DocDownloadLink({
  docKey,
  children,
  className,
}: {
  docKey: string;
  children: ReactNode;
  className: string;
}) {
  const { content, editing, updateDoc } = useContent();
  const input = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const doc = content.docs[docKey];

  if (!editing) {
    return (
      <a href={doc.href} target="_blank" rel="noreferrer" download={doc.fileName} className={className}>
        {children}
      </a>
    );
  }

  return (
    <>
      <button type="button" onClick={() => input.current?.click()} className={className}>
        {children}
        {message && <span className="ml-3 text-xs text-sun-deep">{message}</span>}
      </button>
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={async (event) => {
          const file = event.currentTarget.files?.[0];
          event.currentTarget.value = "";
          if (!file) return;
          setMessage("Uploading...");
          try {
            const blob = await upload(uploadPath(file), file, {
              access: "public",
              handleUploadUrl: "/api/admin/upload",
              clientPayload: JSON.stringify({ kind: "doc", docKey }),
              contentType: "application/pdf",
            });
            updateDoc(docKey, { ...doc, href: blob.url, fileName: file.name, label: labelFromFileName(file.name) });
            setMessage("Replaced");
          } catch {
            setMessage("Upload failed");
          }
        }}
      />
    </>
  );
}
