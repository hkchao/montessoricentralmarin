"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useContent } from "@/components/admin/ContentProvider";

type Props = {
  k: string;
  fallback?: string;
  multiline?: boolean;
  className?: string;
};

export function T({ k, fallback = "", multiline = false, className = "" }: Props) {
  const { content, published, editing, setText, undo } = useContent();
  const value = content.text[k] ?? fallback;
  const live = published.text[k] ?? fallback;
  const changed = value !== live;
  const [local, setLocal] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (document.activeElement !== ref.current) setLocal(value);
  }, [value]);

  if (!editing) {
    return <>{multiline ? local.split("\n").map((line, i) => <span key={`${k}-${i}`}>{i > 0 && <br />}{line}</span>) : local}</>;
  }

  return (
    <span className={`group/edit relative inline ${className}`}>
      <span
        ref={ref}
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        spellCheck
        onClick={(event) => {
          if (!event.metaKey && !event.ctrlKey) {
            event.preventDefault();
            event.stopPropagation();
            ref.current?.focus();
          }
        }}
        onInput={(event) => {
          const next = event.currentTarget.innerText.replace(/\u00a0/g, " ");
          setLocal(next);
          if (next.trim()) setText(k, next);
        }}
        onBlur={() => {
          if (!local.trim()) {
            setLocal(value || live);
            requestAnimationFrame(() => {
              if (ref.current) ref.current.innerText = value || live;
            });
          }
        }}
        className="rounded outline outline-1 outline-transparent transition-colors hover:bg-sun/15 hover:outline-sun focus:bg-white focus:outline-2 focus:outline-sun"
        style={{ whiteSpace: multiline ? "pre-line" : "normal" } as CSSProperties}
      >
        {local}
      </span>
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
