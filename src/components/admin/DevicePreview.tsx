"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";

const sizes = {
  Desktop: 1280,
  Tablet: 768,
  Phone: 390,
} as const;

type Mode = keyof typeof sizes;

export function DevicePreview({ selectClassName }: { selectClassName: string }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode | null>(null);

  return (
    <>
      <label className="sr-only" htmlFor="admin-device">
        Device preview
      </label>
      <select
        id="admin-device"
        value={mode ?? ""}
        onChange={(event) => setMode((event.target.value || null) as Mode | null)}
        className={selectClassName}
      >
        <option value="">Full window</option>
        {(Object.keys(sizes) as Mode[]).map((label) => (
          <option key={label} value={label}>
            {label} ({sizes[label]}px)
          </option>
        ))}
      </select>
      {mode &&
        // Portaled out of the admin bar (its backdrop-filter traps fixed children) and kept below it (z-70) so the dropdown still works.
        createPortal(
          <div className="fixed inset-0 z-[65] bg-navy-deep/70 px-4 pb-4 pt-24">
            <div className="mx-auto flex h-full max-w-[1400px] flex-col rounded-3xl bg-cream p-4 shadow-lift">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-navy">
                  {mode} preview ({sizes[mode]}px)
                </p>
                <button type="button" onClick={() => setMode(null)} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
                  Close
                </button>
              </div>
              <iframe
                title={`${mode} preview`}
                src={`${pathname}?adminPreview=1`}
                className="mx-auto h-full max-w-full rounded-2xl border border-line bg-white"
                style={{ width: sizes[mode] }}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
