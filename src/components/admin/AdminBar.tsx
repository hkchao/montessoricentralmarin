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

const fieldCls = "flex flex-col gap-1";
const fieldLabelCls = "pl-3 text-[0.65rem] font-semibold uppercase leading-none tracking-wider text-muted/80";

const selectCls =
  "cursor-pointer rounded-full border border-navy/20 bg-white py-1.5 pl-3 pr-8 font-semibold text-navy hover:bg-navy-tint focus:outline-none focus:ring-2 focus:ring-sun/60";

const iconBtnCls =
  "flex size-9 cursor-pointer items-center justify-center rounded-full border border-navy/20 text-navy hover:bg-navy-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-sun/60";
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
  const [dialog, setDialog] = useState<"revert" | "exit" | "help" | null>(null);
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

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    // Portaled dialogs bubble React events through the bar, so only start drags from the bar's own surface.
    if (!bar.current || event.button !== 0 || !bar.current.contains(target)) return;
    if (target.closest("button, select, input, a, [role=button]") && !target.closest("[data-drag-handle]")) return;
    const rect = bar.current.getBoundingClientRect();
    drag.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top, pos: { x: rect.left, y: rect.top }, moved: false };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !bar.current) return;
    if (!event.buttons) return endDrag();
    const next = clampPos({ x: event.clientX - drag.current.dx, y: event.clientY - drag.current.dy }, bar.current);
    if (!drag.current.moved) {
      if (Math.abs(next.x - drag.current.pos.x) + Math.abs(next.y - drag.current.pos.y) < 4) return;
      // Capture only once the pointer really moves, so plain clicks and double-clicks reach their targets.
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current.moved = true;
    }
    drag.current.pos = next;
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
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`fixed z-[70] max-w-[calc(100vw-1rem)] touch-none select-none rounded-3xl border border-line bg-white/95 p-3 text-sm shadow-lift backdrop-blur-md ${
        pos ? "" : "right-4 top-4"
      } ${dragPos ? "cursor-grabbing shadow-2xl" : "cursor-grab"}`}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <button
          type="button"
          data-drag-handle
          aria-label="Move admin bar. Use arrow keys, or double-click to reset."
          title="Drag to move. Double-click to reset."
          onDoubleClick={() => writePos(null)}
          onKeyDown={nudge}
          className={`-ml-1 flex items-center rounded-full px-1.5 py-1 text-muted hover:bg-navy-tint hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sun/60 ${
            dragPos ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <svg aria-hidden viewBox="0 0 10 16" className="h-4 w-2.5 fill-current">
            {[3, 8, 13].flatMap((cy) => [2.5, 7.5].map((cx) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={1.4} />))}
          </svg>
        </button>
        <h2 className="font-sans text-sm font-semibold leading-none text-navy">Admin Controls</h2>
        <span role="status" aria-live="polite" className="ml-1 flex items-center gap-1.5 text-xs text-muted">
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${
              status === "error" ? "bg-sun-deep" : status === "saving" ? "animate-pulse bg-sun" : changeCount ? "bg-sun" : "bg-sage"
            }`}
          />
          <span className={status === "error" ? "font-semibold text-sun-deep" : ""}>{label}</span>
        </span>
        <button
          type="button"
          onClick={() => setDialog("help")}
          aria-label="How to use admin mode"
          title="How to use admin mode"
          className="-my-1 ml-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-navy-tint hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sun/60"
        >
          <svg aria-hidden viewBox="0 0 24 24" className={iconCls}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
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
          className="-my-1 -mr-1 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted hover:bg-navy-tint hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-sun/60"
        >
          <svg aria-hidden viewBox="0 0 24 24" className={iconCls}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className={fieldCls}>
          <span className={fieldLabelCls}>Page</span>
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
        </label>
        <DevicePreview fieldClassName={fieldCls} labelClassName={fieldLabelCls} selectClassName={selectCls} />
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
          aria-disabled={!changeCount}
          onClick={() => {
            if (!changeCount || pending) return;
            if (window.confirm(`Publish ${changes}?`)) {
              startTransition(async () => {
                await flush();
                await publishAction();
                window.location.reload();
              });
            }
          }}
          title={changeCount ? `Publish ${changes} to the live site` : "Nothing to publish"}
          className="h-9 cursor-pointer rounded-full bg-sun px-4 font-semibold text-navy-deep hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:hover:brightness-100"
        >
          Publish
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
      {dialog === "help" && <HelpDialog onClose={() => setDialog(null)} />}
    </div>
  );
}

const dangerBtnCls =
  "rounded-full bg-sun-deep px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#a84f0f] disabled:opacity-60";

function HelpDialog({ onClose }: { onClose: () => void }) {
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-help-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/65 p-4"
    >
      <div className="w-full max-w-lg rounded-3xl bg-cream p-6 text-ink shadow-lift">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kicker text-sun-deep">Admin mode</p>
            <h2 id="admin-help-title" className="font-display mt-2 text-2xl font-medium text-navy">
              How to edit the site
            </h2>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm font-semibold text-navy hover:bg-navy-tint"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted">
          <p className="rounded-2xl bg-sun/20 px-4 py-3 font-medium text-navy">
            Admin mode does not let you add or remove whole sections. You can only edit the text and photos that are already on the page.
          </p>
          <ul className="list-disc space-y-2.5 pl-5">
            <li>
              <span className="font-semibold text-navy">Text:</span> click any highlighted wording on the page and type. Changes save to a draft as you go.
            </li>
            <li>
              <span className="font-semibold text-navy">Photos:</span> use the small image button on a photo to replace it. Keep a similar shape so the crop still fits.
            </li>
            <li>
              <span className="font-semibold text-navy">PDFs:</span> use the pencil or replace control on a document button to upload a new file.
            </li>
            <li>
              <span className="font-semibold text-navy">Page & Device:</span> jump between site pages, or preview phone, tablet, and desktop widths.
            </li>
            <li>
              <span className="font-semibold text-navy">Publish:</span> pushes your draft to the live site for everyone. Revert discards unpublished changes. Exit leaves admin mode.
            </li>
          </ul>
          <p>
            Visitors never see admin mode or your draft. Only this signed-in browser can edit until you publish.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-sun px-5 py-2.5 text-sm font-semibold text-navy-deep hover:brightness-95"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

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
