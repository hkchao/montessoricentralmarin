"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "@/components/admin/ContentProvider";

export function FieldTextDialog({ keys, label }: { keys: { key: string; label: string }[]; label?: string }) {
  const { content, editing, setText } = useContent();
  const [open, setOpen] = useState(false);
  if (!editing) return null;
  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        className="ml-2 rounded-full bg-sun/25 px-2 py-0.5 text-xs font-semibold text-navy hover:bg-sun/40"
        aria-label={`Edit ${label ?? "field text"}`}
      >
        pencil
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/65 p-4" onClick={(event) => event.stopPropagation()}>
            <div className="w-full max-w-lg rounded-3xl bg-cream p-6 shadow-lift">
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-2xl font-medium text-navy">Edit form text</h2>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full px-3 py-1 text-sm font-semibold text-navy hover:bg-navy-tint">
                  Close
                </button>
              </div>
              <div className="mt-5 space-y-4">
                {keys.map((item) => (
                  <label key={item.key} className="block text-sm font-semibold text-navy">
                    {item.label}
                    <textarea
                      value={content.text[item.key] ?? ""}
                      onChange={(event) => {
                        if (event.target.value.trim()) setText(item.key, event.target.value);
                      }}
                      rows={2}
                      className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm font-normal text-ink focus:border-navy focus:outline-none focus:ring-2 focus:ring-sun/60"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
