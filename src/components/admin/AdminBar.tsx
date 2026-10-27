"use client";

import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, useTransition, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
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
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"revert" | "exit" | null>(null);
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
  const changes = `${changeCount} unpublished change${changeCount === 1 ? "" : "s"}`;

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
          onClick={() => setDialog("revert")}
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
            if (changeCount) {
              setDialog("exit");
              return;
            }
            startTransition(async () => {
              await flush();
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
      {dialog === "revert" && (
        <ConfirmDialog
          title={changeCount ? "Revert all unpublished changes?" : "Nothing to revert"}
          body={
            changeCount
              ? `This permanently discards ${changes} across all pages (text, PDFs, and images) and puts back what's live now. This can't be undone.`
              : "There are no unpublished changes. The site already matches what's live."
          }
          cancelLabel={changeCount ? "Cancel" : "OK"}
          pending={pending}
          onCancel={() => setDialog(null)}
        >
          {changeCount > 0 && (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                startTransition(async () => {
                  await revertAction();
                  window.location.reload();
                });
              }}
              className={dangerBtnCls}
            >
              {pending ? "Reverting..." : `Discard ${changes}`}
            </button>
          )}
        </ConfirmDialog>
      )}
      {dialog === "exit" && (
        <ConfirmDialog
          title="Exit with unpublished changes?"
          body={`You have ${changes} that visitors can't see yet. They stay saved as a draft for the next time you sign in, until you publish or revert them.`}
          cancelLabel="Keep editing"
          pending={pending}
          onCancel={() => setDialog(null)}
        >
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                await flush();
                await logoutAction();
              });
            }}
            className="rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy-tint disabled:opacity-60"
          >
            Exit without publishing
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                await flush();
                await publishAction();
                await logoutAction();
              });
            }}
            className="rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-navy-deep hover:bg-[#e5a92f] disabled:opacity-60"
          >
            {pending ? "Working..." : "Publish and exit"}
          </button>
        </ConfirmDialog>
      )}
    </div>
  );
}

const dangerBtnCls =
  "rounded-full bg-sun-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a84f0f] disabled:opacity-60";

function ConfirmDialog({
  title,
  body,
  cancelLabel,
  pending,
  onCancel,
  children,
}: {
  title: string;
  body: string;
  cancelLabel: string;
  pending: boolean;
  onCancel: () => void;
  children?: ReactNode;
}) {
  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="admin-confirm-title"
      aria-describedby="admin-confirm-body"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !pending) onCancel();
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/65 p-4"
    >
      <div className="w-full max-w-lg rounded-3xl bg-cream p-6 text-ink shadow-lift">
        <div className="flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sun/25 text-sun-deep">
            <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </span>
          <div>
            <h2 id="admin-confirm-title" className="font-display text-2xl font-medium text-navy">
              {title}
            </h2>
            <p id="admin-confirm-body" className="mt-2 text-sm leading-relaxed text-muted">
              {body}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            autoFocus
            disabled={pending}
            onClick={onCancel}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy hover:bg-navy-tint disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
