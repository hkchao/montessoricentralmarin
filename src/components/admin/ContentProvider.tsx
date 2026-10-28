"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  type ReactNode,
} from "react";
import { saveDraftAction } from "@/app/admin/actions";
import type { ContentPatch } from "@/lib/content";
import type { DocContent, ImageContent, SiteContent } from "@/content/defaults";

type Status = "idle" | "saving" | "saved" | "error";

type ContentContextValue = {
  content: SiteContent;
  published: SiteContent;
  editing: boolean;
  status: Status;
  changeCount: number;
  error?: string;
  setText: (key: string, value: string) => void;
  updateDoc: (key: string, doc: DocContent) => void;
  updateImage: (key: string, image: ImageContent) => void;
  undo: (kind: keyof ContentPatch, key: string) => void;
  flush: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

const noopSubscribe = () => () => {};

function diff(current: SiteContent, published: SiteContent): ContentPatch {
  const patch: ContentPatch = { text: {}, docs: {}, images: {} };
  for (const [key, value] of Object.entries(current.text)) {
    if (published.text[key] !== value) patch.text![key] = value;
  }
  for (const [key, value] of Object.entries(current.docs)) {
    if (JSON.stringify(published.docs[key]) !== JSON.stringify(value)) patch.docs![key] = value;
  }
  for (const [key, value] of Object.entries(current.images)) {
    if (JSON.stringify(published.images[key]) !== JSON.stringify(value)) patch.images![key] = value;
  }
  return patch;
}

function countPatch(patch: ContentPatch) {
  return (
    Object.keys(patch.text ?? {}).length +
    Object.keys(patch.docs ?? {}).length +
    Object.keys(patch.images ?? {}).length
  );
}

export function ContentProvider({
  children,
  content,
  published,
  editing,
}: {
  children: ReactNode;
  content: SiteContent;
  published: SiteContent;
  editing: boolean;
}) {
  const [state, setState] = useState(content);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const [, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(state);

  useEffect(() => {
    latest.current = state;
  }, [state]);

  // Outside admin edits, pick up new default keys from the server (e.g. hero slides).
  useEffect(() => {
    if (editing) return;
    setState(content);
  }, [content, editing]);

  const patch = useMemo(() => diff(state, published), [state, published]);
  const changeCount = countPatch(patch);

  const flush = useCallback(async () => {
    if (!editing) return;
    const next = diff(latest.current, published);
    setStatus("saving");
    setError(undefined);
    try {
      await saveDraftAction(next);
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unable to save.");
    }
  }, [editing, published]);

  const scheduleSave = useCallback(() => {
    if (!editing) return;
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      startTransition(() => {
        void flush();
      });
    }, 650);
  }, [editing, flush, startTransition]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const setText = useCallback(
    (key: string, value: string) => {
      setState((current) => ({ ...current, text: { ...current.text, [key]: value } }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const updateDoc = useCallback(
    (key: string, doc: DocContent) => {
      setState((current) => ({ ...current, docs: { ...current.docs, [key]: doc } }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const updateImage = useCallback(
    (key: string, image: ImageContent) => {
      setState((current) => ({ ...current, images: { ...current.images, [key]: image } }));
      scheduleSave();
    },
    [scheduleSave],
  );

  const undo = useCallback(
    (kind: keyof ContentPatch, key: string) => {
      setState((current) => ({
        ...current,
        [kind]: { ...current[kind], [key]: published[kind]?.[key] },
      }));
      scheduleSave();
    },
    [published, scheduleSave],
  );

  // Device-preview iframes show the draft exactly as visitors would, without editing chrome.
  const preview = useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("adminPreview") === "1",
    () => false,
  );

  // State is seeded once and outlives client navigations, so keys added since then come from the server props.
  const merged = useMemo<SiteContent>(
    () => ({
      text: { ...content.text, ...state.text },
      docs: { ...content.docs, ...state.docs },
      images: { ...content.images, ...state.images },
    }),
    [content, state],
  );

  const value: ContentContextValue = {
    content: merged,
    published,
    editing: editing && !preview,
    status,
    changeCount,
    error,
    setText,
    updateDoc,
    updateImage,
    undo,
    flush,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside ContentProvider");
  return ctx;
}

export function useText(key: string) {
  const { content } = useContent();
  return content.text[key] ?? "";
}
