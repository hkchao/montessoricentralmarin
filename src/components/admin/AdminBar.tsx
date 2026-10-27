"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { logoutAction, publishAction, revertAction } from "@/app/admin/actions";
import { DevicePreview } from "@/components/admin/DevicePreview";
import { useContent } from "@/components/admin/ContentProvider";

const pages = [
  ["Home", "/"],
  ["Programs", "/programs"],
  ["Admissions", "/admissions"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function AdminBar() {
  const { editing, status, changeCount, error, flush } = useContent();
  const [, startTransition] = useTransition();
  const [preview] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("adminPreview") === "1",
  );

  if (!editing || preview) return null;

  const label =
    status === "saving"
      ? "Saving..."
      : status === "error"
        ? error || "Save failed"
        : changeCount
          ? `Draft saved - ${changeCount} change${changeCount === 1 ? "" : "s"}`
          : "No changes";

  return (
    <div className="fixed right-4 top-4 z-[70] max-w-[calc(100vw-2rem)] rounded-3xl border border-line bg-white/95 p-3 text-sm shadow-lift backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-sand px-3 py-1.5 font-semibold text-navy">{label}</span>
        <nav className="flex gap-1" aria-label="Admin page switcher">
          {pages.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-1.5 font-semibold text-muted hover:bg-navy-tint hover:text-navy">
              {label}
            </Link>
          ))}
        </nav>
        <DevicePreview />
        <button
          type="button"
          onClick={() => {
            if (!changeCount || window.confirm(`Revert ${changeCount} unpublished change${changeCount === 1 ? "" : "s"}?`)) {
              startTransition(async () => {
                await revertAction();
                window.location.reload();
              });
            }
          }}
          className="rounded-full border border-navy/20 px-3 py-1.5 font-semibold text-navy hover:bg-navy-tint"
        >
          Revert
        </button>
        <button
          type="button"
          disabled={!changeCount}
          onClick={() => {
            if (window.confirm(`Publish ${changeCount} change${changeCount === 1 ? "" : "s"}?`)) {
              startTransition(async () => {
                await flush();
                await publishAction();
                window.location.reload();
              });
            }
          }}
          className="rounded-full bg-sun px-3 py-1.5 font-semibold text-navy-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          Publish
        </button>
        <button
          type="button"
          onClick={() => {
            startTransition(async () => {
              await logoutAction();
            });
          }}
          className="rounded-full px-3 py-1.5 font-semibold text-muted hover:bg-navy-tint hover:text-navy"
        >
          Exit
        </button>
      </div>
    </div>
  );
}
