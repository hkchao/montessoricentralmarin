"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useContent } from "@/components/admin/ContentProvider";

type Props = {
  k: string;
  fallback?: string;
  multiline?: boolean;
  className?: string;
};

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function T({ k, fallback = "", multiline = false, className = "" }: Props) {
  const { content, published, editing, setText, undo } = useContent();
  const value = content.text[k] ?? fallback;
  const live = published.text[k] ?? fallback;
  const changed = value !== live;
  const ref = useRef<HTMLSpanElement>(null);
  // React must never re-render the editable span's children: rewriting the text node resets the caret
  // to the start after every keystroke. It renders the initial text once; later updates go through the effect.
  const [initialHtml] = useState(() => ({ __html: escapeHtml(value) }));

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.textContent !== value) el.textContent = value;
  }, [value, editing]);

  if (!editing) {
    return <>{multiline ? value.split("\n").map((line, i) => <span key={`${k}-${i}`}>{i > 0 && <br />}{line}</span>) : value}</>;
  }

  return (
    <span className={`group/edit relative inline ${className}`}>
      <span
        ref={ref}
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        spellCheck
        dangerouslySetInnerHTML={initialHtml}
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !multiline) event.preventDefault();
        }}
        onInput={(event) => {
          const next = event.currentTarget.innerText.replace(/\u00a0/g, " ");
          if (next.trim()) setText(k, next);
        }}
        onBlur={(event) => {
          const el = event.currentTarget;
          if (!el.innerText.trim()) el.textContent = value || live;
        }}
        className="cursor-text rounded outline outline-1 outline-transparent transition-colors hover:bg-sun/15 hover:outline-sun focus:bg-sun/10 focus:outline-2 focus:outline-sun"
        style={{ whiteSpace: multiline ? "pre-line" : "normal" } as CSSProperties}
      />
      {changed && (
        <button
          type="button"
          onClick={() => undo("text", k)}
          className="ml-1 hidden rounded-full bg-navy px-2 py-0.5 align-middle text-[0.65rem] font-semibold text-white shadow-soft group-hover/edit:inline-block focus:inline-block"
        >
          undo
        </button>
      )}
    </span>
  );
}
