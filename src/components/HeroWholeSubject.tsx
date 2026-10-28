"use client";

import { EditableImage } from "@/components/admin/EditableImage";
import { useContent } from "@/components/admin/ContentProvider";

type Props = {
  imageKey: string;
  alt: string;
  /** Subject's top and bottom edges as fractions of the photo height. */
  top: number;
  bottom: number;
};

/** lg+: the full subject band, banner-tall, centered in the open right half and feathered into the backdrop. */
export function HeroWholeSubject({ imageKey, alt, top, bottom }: Props) {
  const { content } = useContent();
  const { width, height } = content.images[imageKey];
  const band = bottom - top;

  return (
    <div
      className="absolute inset-y-0 left-[72%] hidden -translate-x-1/2 lg:block"
      style={{ aspectRatio: `${width} / ${height * band}` }}
    >
      <div className="absolute inset-x-0" style={{ top: `${(-top / band) * 100}%`, height: `${100 / band}%` }}>
        <EditableImage
          imageKey={imageKey}
          alt={alt}
          controls={false}
          fill
          priority
          sizes="(min-width: 1600px) 800px, 50vw"
          className="object-cover [mask-image:linear-gradient(to_right,transparent,black_16%,black_96%,transparent)]"
        />
      </div>
    </div>
  );
}
