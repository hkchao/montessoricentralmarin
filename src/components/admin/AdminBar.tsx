"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition, type KeyboardEvent, type PointerEvent } from "react";
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

const selectCls =
  "cursor-pointer rounded-full border border-navy/20 bg-white py-1.5 pl-3 pr-8 font-semibold text-navy hover:bg-navy-tint focus:outline-none focus:ring-2 focus:ring-sun/60";

const iconBtnCls =
  "flex size-9 items-center justify-center rounded-full border border-navy/20 text-navy hover:bg-navy-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-sun/60";
const iconCls = "size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]";

const POS_KEY = "mscm-admin-bar-pos";
const POS_EVENT = "mscm-admin-bar-pos";
const EDGE = 8;

type Pos = { x: number; y: number };

function subscribePos(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(POS_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(POS_EVENT, onChange);
  };
}

function writePos(pos: Pos | null) {
  if (pos) localStorage.setItem(POS_KEY, JSON.stringify(pos));
  else localStorage.removeItem(POS_KEY);
  window.dispatchEvent(new Event(POS_EVENT));
}

function parsePos(raw: string | null): Pos | null {
  if (!raw) return null;
  try {
    const pos = JSON.parse(raw) as Pos;
    return Number.isFinite(pos.x) && Number.isFinite(pos.y) ? pos : null;
  } catch {
    return null;
  }
}

function clampPos(pos: Pos, el: HTMLElement): Pos {
  const { width, height } = el.getBoundingClientRect();
  return {
    x: Math.round(Math.max(EDGE, Math.min(pos.x, window.innerWidth - width - EDGE))),
    y: Math.round(Math.max(EDGE, Math.min(pos.y, window.innerHeight - height - EDGE))),
  };
}

export function AdminBar() {
  const { editing, status, changeCount, error, flush } = useContent();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const bar = useRef<HTMLDivElement>(null);
  const drag = useRef<{ dx: number; dy: number; pos: Pos; moved: boolean } | null>(null);
  const [dragPos, setDragPos] = useState<Pos | null>(null);
  const savedRaw = useSyncExternalStore(subscribePos, () => localStorage.getItem(POS_KEY), () => null);
  const savedPos = useMemo(() => parsePos(savedRaw), [savedRaw]);
  const pos = dragPos ?? savedPos;

  // Keep a moved bar on screen when the window shrinks or the bar grows (e.g. a longer status label).
  useEffect(() => {
    const el = bar.current;
    if (!el || !savedPos) return;
    const keepOnScreen = () => {
      const next = clampPos(savedPos, el);
      if (next.x !== savedPos.x || next.y !== savedPos.y) writePos(next);
    };
    keepOnScreen();
    const observer = new ResizeObserver(keepOnScreen);
    observer.observe(el);
    window.addEventListener("resize", keepOnScreen);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", keepOnScreen);
    };
  }, [savedPos, editing]);

  if (!editing) return null;

  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!bar.current || event.button !== 0) return;
    const rect = bar.current.getBoundingClientRect();
    drag.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, pos: { x: rect.left, y: rect.top }, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (!drag.current || !bar.current) return;
    const next = clampPos({ x: event.clientX - drag.current.dx, y: event.clientY - drag.current.dy }, bar.current);
    drag.current.pos = next;
    drag.current.moved = true;
    setDragPos(next);
  };

  const endDrag = () => {
    if (drag.current?.moved) writePos(drag.current.pos);
    drag.current = null;
    setDragPos(null);
  };

  const nudge = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 64 : 16;
    const delta = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[event.key];
    if (!delta || !bar.current) return;
    event.preventDefault();
    const rect = bar.current.getBoundingClientRect();
    writePos(clampPos({ x: rect.left + delta[0], y: rect.top + delta[1] }, bar.current));
  };

  const label =
    status === "saving"
      ? "Saving..."
      : status === "error"
        ? error || "Save failed"
        : changeCount
          ? `Draft saved - ${changeCount} change${changeCount === 1 ? "" : "s"}`
          : "No changes";

  return (
    <div
      ref={bar}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      className={`fixed z-[70] max-w-[calc(100vw-1rem)] rounded-3xl border border-line bg-white/95 p-3 text-sm shadow-lift backdrop-blur-md ${
        pos ? "" : "right-4 top-4"
      } ${dragPos ? "select-none shadow-2xl" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-label="Move admin bar. Use arrow keys, or double-click to reset."
          title="Drag to move. Double-click to reset."
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={() => writePos(null)}
          onKeyDown={nudge}
          className={`-ml-1 flex touch-none items-center rounded-full px-1.5 py-2 text-muted hover:bg-navy-tint hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sun/60 ${
            dragPos ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <svg aria-hidden viewBox="0 0 10 16" className="h-4 w-2.5 fill-current">
            {[3, 8, 13].flatMap((cy) => [2.5, 7.5].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.4} />))}
          </svg>
        </button>
        <span className="rounded-full bg-sand px-3 py-1.5 font-semibold text-navy">{label}</span>
        <label className="sr-only" htmlFor="admin-page">
          Page
        </label>
        <select
          id="admin-page"
          value={pages.some(([, href]) => href === pathname) ? pathname : ""}
          onChange={(event) => router.push(event.target.value)}
          className={selectCls}
        >
          {!pages.some(([, href]) => href === pathname) && <option value="">Choose page</option>}
          {pages.map(([label, href]) => (
            <option key={href} value={href}>
              {label}
            </option>
          ))}
        </select>
        <DevicePreview selectClassName={selectCls} />
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
          aria-label="Revert unpublished changes"
          title="Revert unpublished changes"
          className={iconBtnCls}
        >
          <svg aria-hidden viewBox="0 0 24 24" className={iconCls}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
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
          aria-label="Exit admin"
          title="Exit admin"
          className={iconBtnCls}
        >
          <svg aria-hidden viewBox="0 0 24 24" className={iconCls}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
