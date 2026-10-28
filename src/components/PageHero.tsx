import type { CSSProperties, ReactNode } from "react";
import { EditableImage, ImageReplaceButton } from "@/components/admin/EditableImage";

export type HeroImage = {
  key?: string;
  mobileKey?: string;
  src: string;
  alt: string;
  /** CSS object-position — the subject's strongest landmark. Keep it in the open right half. */
  focal: string;
  /** Optional mobile override when a wide group needs a different crop than desktop. */
  focalMobile?: string;
  /** Optional portrait-friendlier crop used below the md breakpoint. */
  srcMobile?: string;
};

type Props = {
  kicker?: ReactNode;
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
  /** Optional content band under the lockup, still inside the banner (e.g. home awards). */
  below?: ReactNode;
};

/**
 * Site-wide banner frame.
 * - Height hugs the type lockup (padding-driven, no tall vw frames).
 * - Left-justified type → gradient scrubs in from the left (bottom on mobile).
 * - Photo/map + gradient live on a centered media plane capped at 1600px; navy fills beyond it.
 * - The site header floats over the banner in white, so the top scrim keeps nav readable.
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
  below,
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
            <>
              {(image.srcMobile || image.mobileKey) && (
                <EditableImage
                  imageKey={image.mobileKey ?? image.key ?? ""}
                  alt={image.alt}
                  controls={false}
                  fill
                  priority
                  sizes="(min-width: 768px) 1px, 100vw"
                  className="object-cover object-[var(--hero-focal-m)] md:hidden"
                  style={
                    {
                      "--hero-focal-m": image.focalMobile ?? "50% 40%",
                    } as CSSProperties
                  }
                />
              )}
              <EditableImage
                imageKey={image.key ?? image.mobileKey ?? ""}
                alt={image.alt}
                controls={false}
                fill
                priority
                sizes="(min-width: 1600px) 1600px, 100vw"
                className={`object-cover object-[var(--hero-focal)] ${
                  image.srcMobile || image.mobileKey ? "hidden md:block" : "object-[var(--hero-focal-m)] md:object-[var(--hero-focal)]"
                }`}
                style={
                  {
                    "--hero-focal": image.focal,
                    "--hero-focal-m": image.focalMobile ?? image.focal,
                  } as CSSProperties
                }
              />
            </>
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
              <div className="hero-scrim absolute inset-0 bg-navy-deep/45" />
              <div className="hero-scrim absolute inset-y-0 left-0 w-[55%] bg-[linear-gradient(to_right,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_92%,transparent)_42%,color-mix(in_srgb,var(--color-navy-deep)_45%,transparent)_72%,transparent_100%)]" />
              <div className="hero-scrim absolute inset-y-0 right-0 w-[28%] bg-[linear-gradient(to_left,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_70%,transparent)_55%,transparent_100%)]" />
              <div className="hero-scrim absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,var(--color-navy-deep),transparent)] md:h-36" />
              <div className="hero-scrim absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(to_top,var(--color-navy-deep),transparent)]" />
            </>
          ) : (
            <>
              {/* Mobile: type sits low, scrub rises from the bottom and clears the subject above. */}
              <div className="hero-scrim absolute inset-0 bg-[linear-gradient(to_top,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_94%,transparent)_38%,color-mix(in_srgb,var(--color-navy-deep)_55%,transparent)_52%,transparent_66%)] md:hidden" />
              {/* Desktop: strong under the left lockup column, fading out before the subject. */}
              <div className="hero-scrim absolute inset-0 hidden bg-[linear-gradient(to_right,var(--color-navy-deep)_0%,color-mix(in_srgb,var(--color-navy-deep)_94%,transparent)_26%,color-mix(in_srgb,var(--color-navy-deep)_62%,transparent)_46%,color-mix(in_srgb,var(--color-navy-deep)_12%,transparent)_64%,transparent_78%)] md:block" />
              {/* Ultrawide: dissolve the plane's right edge into the navy fill. */}
              <div className="absolute inset-y-0 right-0 hidden w-40 bg-[linear-gradient(to_left,var(--color-navy-deep),transparent)] min-[1600px]:block" />
              {/* Top scrim so the floating white nav stays readable. */}
              <div className="hero-scrim absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgb(12_23_65/0.55),transparent)] md:h-36" />
              {below && (
                <div className="hero-scrim absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgb(12_23_65/0.7),transparent)] md:h-48" />
              )}
            </>
          )}
        </div>
      )}

      <div
        className={`site-wrap relative ${
          media ? (home ? "pt-[68vw] sm:pt-[46vw]" : "pt-[58vw] sm:pt-[34vw]") : home ? "pt-14" : "pt-12"
        } ${
          // Extra top padding clears the fixed floating header that overlays the banner.
          home
            ? below
              ? "pb-12 md:pt-28 md:pb-14 lg:pt-32 lg:pb-16"
              : "pb-12 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24"
            : "pb-10 md:pt-28 md:pb-14 lg:pt-32 lg:pb-16"
        }`}
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
          {below && <div className="mt-8 md:mt-9 lg:mt-10">{below}</div>}
        </div>
      </div>

      {/* The media plane sits behind the text layer, so its replace buttons live up here, clear of the lockup. */}
      {image &&
        (image.mobileKey && image.key ? (
          <>
            <div className="absolute right-4 top-16 z-20 md:hidden">
              <ImageReplaceButton imageKey={image.mobileKey} label="Replace mobile banner image" />
            </div>
            <div className="absolute bottom-4 right-4 z-20 hidden md:block">
              <ImageReplaceButton imageKey={image.key} label="Replace desktop banner image" />
            </div>
          </>
        ) : (
          (image.key ?? image.mobileKey) && (
            <div className="absolute right-4 top-16 z-20 md:bottom-4 md:top-auto">
              <ImageReplaceButton imageKey={(image.key ?? image.mobileKey)!} label="Replace banner image" />
            </div>
          )
        ))}
    </section>
  );
}
