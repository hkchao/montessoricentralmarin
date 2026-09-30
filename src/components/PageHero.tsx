import Image from "next/image";
import type { ReactNode } from "react";

export type HeroImage = {
  src: string;
  alt: string;
  /** CSS object-position — the subject's strongest landmark. Keep it in the open right half. */
  focal: string;
};

type Props = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  image?: HeroImage;
  /**
   * Decorative map iframe (e.g. Google Maps embed). Mutually exclusive with `image`.
   * Not interactive — keep a real map lower on the page for directions.
   */
  mapSrc?: string;
  /** "home" = taller lockup + larger type; "page" = compact interior banner. */
  size?: "home" | "page";
  /** Render lede on small screens (default: hidden to keep mobile lean). */
  ledeOnMobile?: boolean;
};

/**
 * Site-wide banner frame.
 * - Height hugs the type lockup (padding-driven, no tall vw frames).
 * - Left-justified type → gradient scrubs in from the left (bottom on mobile).
 * - Photo/map + gradient live on a centered media plane capped at 1600px; navy fills beyond it.
 */
export function PageHero({
  kicker,
  title,
  lede,
  actions,
  image,
  mapSrc,
  size = "page",
  ledeOnMobile = false,
}: Props) {
  const home = size === "home";
  const media = Boolean(image || mapSrc);

  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white">
      {media && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 left-1/2 w-full -translate-x-1/2 overflow-hidden ${
            mapSrc ? "max-w-none" : "max-w-[1600px]"
          }`}
        >
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(min-width: 1600px) 1600px, 100vw"
              className="object-cover"
              style={{ objectPosition: image.focal }}
            />
          ) : (
            // Pin centered in the open half between the type lockup and the right edge.
            <iframe
              title=""
              src={mapSrc}
              tabIndex={-1}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute left-[68%] top-1/2 h-[140%] w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 border-0 opacity-90 contrast-[1.05] saturate-[0.85] md:left-[72%]"
            />
          )}
          {mapSrc ? (
            <>
              {/* Map: dissolve all edges into navy so the iframe never reads as a hard box. */}
              <div className="absolute inset-0 bg-navy-deep/45" />
              <div className="absolute inset-y-0 left-0 w-[55%] bg-[linear-gradient(to_right,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_92%,transparent)_42%,color-mix(in_srgb,var(--color-navy-deep)_45%,transparent)_72%,transparent_100%)]" />
              <div className="absolute inset-y-0 right-0 w-[28%] bg-[linear-gradient(to_left,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_70%,transparent)_55%,transparent_100%)]" />
              <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,var(--color-navy-deep),transparent)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,var(--color-navy-deep),transparent)]" />
            </>
          ) : (
            <>
              {/* Mobile: type sits low, scrub rises from the bottom and clears the subject above. */}
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_94%,transparent)_38%,color-mix(in_srgb,var(--color-navy-deep)_55%,transparent)_52%,transparent_66%)] md:hidden" />
              {/* Desktop: strong under the left lockup column, fading out before the subject. */}
              <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_94%,transparent)_26%,color-mix(in_srgb,var(--color-navy-deep)_62%,transparent)_46%,color-mix(in_srgb,var(--color-navy-deep)_12%,transparent)_64%,transparent_78%)] md:block" />
              {/* Ultrawide: dissolve the plane's right edge into the navy fill. */}
              <div className="absolute inset-y-0 right-0 hidden w-40 bg-[linear-gradient(to_left,var(--color-navy-deep),transparent)] min-[1600px]:block" />
              {/* Gentle top scrim keeps the header transition clean. */}
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,rgb(12_23_65/0.35),transparent)]" />
            </>
          )}
        </div>
      )}

      <div
        className={`site-wrap relative ${
          media ? (home ? "pt-[90vw] sm:pt-[46vw]" : "pt-[58vw] sm:pt-[34vw]") : home ? "pt-14" : "pt-12"
        } ${home ? "pb-12 md:py-24 lg:py-28" : "pb-10 md:py-16 lg:py-20"}`}
      >
        {/* Lockup width tracks the viewport so the type stops short of the subject (focal ≈ 66–72% x). */}
        <div className={`animate-rise ${home ? "max-w-xl xl:max-w-2xl" : "max-w-lg lg:max-w-xl xl:max-w-2xl"}`}>
          {kicker && <p className="kicker text-sun">{kicker}</p>}
          <h1
            className={`font-display mt-3 font-medium text-balance ${
              home
                ? "text-[2.5rem] leading-[1.02] sm:text-5xl lg:text-[3.75rem]"
                : "text-[2.125rem] leading-[1.05] sm:text-4xl lg:text-5xl"
            }`}
          >
            {title}
          </h1>
          {lede && (
            <p
              className={`mt-5 max-w-md text-pretty text-white/80 lg:max-w-xl ${home ? "text-lg leading-relaxed" : "text-[1.0625rem] leading-relaxed"} ${
                ledeOnMobile ? "block" : "hidden md:block"
              }`}
            >
              {lede}
            </p>
          )}
          {actions && <div className="mt-7 flex flex-wrap items-center gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
