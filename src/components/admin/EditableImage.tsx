"use client";

import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageReplaceDialog } from "@/components/admin/ImageReplaceDialog";
import { useContent } from "@/components/admin/ContentProvider";

type Props = Omit<ImageProps, "src" | "alt"> & {
  imageKey: string;
  alt?: string;
};

export function EditableImage({ imageKey, alt, className = "", ...props }: Props) {
  const { content, editing } = useContent();
  const [open, setOpen] = useState(false);
  const image = content.images[imageKey];

  return (
    <>
      <NextImage
        {...props}
        src={image.src}
        alt={alt ?? image.alt}
        className={className}
        {...(!props.fill ? { width: props.width ?? image.width, height: props.height ?? image.height } : {})}
      />
      {editing && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            setOpen(true);
          }}
          className="absolute inset-2 z-10 flex items-center justify-center rounded-2xl border border-dashed border-white/80 bg-navy/35 text-sm font-semibold text-white opacity-0 shadow-soft transition-opacity hover:opacity-100 focus:opacity-100"
        >
          Replace image
        </button>
      )}
      {open && <ImageReplaceDialog imageKey={imageKey} onClose={() => setOpen(false)} />}
    </>
  );
}
