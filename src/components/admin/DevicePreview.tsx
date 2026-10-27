"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

const sizes = {
  Desktop: 1280,
  Tablet: 768,
  Phone: 390,
} as const;

export function DevicePreview() {
  const pathname = usePathname();
  const [mode, setMode] = useState<keyof typeof sizes | null>(null);

  return (
    <>
      <div className="flex gap-1">
        {(Object.keys(sizes) as (keyof typeof sizes)[]).map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setMode(label)}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy-tint"
          >
            {label}
          </button>
        ))}
      </div>
      {mode && (
        <div className="fixed inset-0 z-[75] bg-navy-deep/70 p-4">
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
              className="mx-auto h-full rounded-2xl border border-line bg-white"
              style={{ width: sizes[mode] }}
            />
          </div>
        </div>
      )}
    </>
  );
}
