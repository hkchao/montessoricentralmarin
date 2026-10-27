"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageReplaceDialog } from "@/components/admin/ImageReplaceDialog";
import { useContent } from "@/components/admin/ContentProvider";

type Props = Omit<ImageProps, "src" | "alt"> & {
  imageKey: string;
  alt?: string;
  /** Set false when the caller renders its own ImageReplaceButton (e.g. hero images behind text). */
  controls?: boolean;
  controlsClassName?: string;
};

export function EditableImage({ imageKey, alt, className = "", controls = true, controlsClassName = "right-2 top-2", ...props }: Props) {
  const { content, editing } = useContent();
  const image = content.images[imageKey];
  const showControls = editing && controls;

  const img = (
    <NextImage
      {...props}
      src={image.src}
      alt={alt ?? image.alt}
      className={`${className} ${showControls ? "peer-hover:outline-2 peer-hover:-outline-offset-2 peer-hover:outline-sun" : ""}`}
      {...(!props.fill ? { width: props.width ?? image.width, height: props.height ?? image.height } : {})}
    />
  );

  if (!showControls) return img;

  const button = <ImageReplaceButton imageKey={imageKey} className={`absolute z-20 ${controlsClassName}`} />;

  // A fill image's parent is already positioned; fixed-size images get a wrapper so the button
  // anchors to the image instead of stretching over a distant positioned ancestor.
  return props.fill ? (
    <>
      {button}
      {img}
    </>
  ) : (
    <span className="relative inline-flex shrink-0 align-middle">
      {button}
      {img}
    </span>
  );
}

export function ImageReplaceButton({ imageKey, label = "Replace image", className = "" }: { imageKey: string; label?: string; className?: string }) {
  const { editing } = useContent();
  const [open, setOpen] = useState(false);
  if (!editing) return null;

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        className={`peer pointer-events-auto flex size-8 items-center justify-center rounded-full bg-white/90 text-navy shadow-soft ring-1 ring-navy/15 transition-colors hover:bg-sun focus:outline-none focus-visible:ring-2 focus-visible:ring-sun ${className}`}
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </button>
      {open && <ImageReplaceDialog imageKey={imageKey} onClose={() => setOpen(false)} />}
    </>
  );
}
