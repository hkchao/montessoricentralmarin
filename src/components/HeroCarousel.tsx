"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { EditableImage } from "@/components/admin/EditableImage";
import type { HeroImage } from "@/components/PageHero";

const INTERVAL_MS = 4500;

type Props = {
  slides: HeroImage[];
};

/**
 * Crossfading home-banner slides with bottom-right dots (desktop only).
 */
export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [slides.length, paused]);

  return (
    <>
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) => {
          const active = i === index;
          const hasMobile = Boolean(slide.srcMobile || slide.mobileKey);
          return (
            <div
              key={slide.key ?? slide.src}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              {hasMobile && (
                <div className="absolute inset-0 overflow-hidden md:hidden">
                  <div
                    className={
                      i === 1
                        ? "absolute inset-x-0 top-0 h-[90%]"
                        : i === 2
                          ? // 75px wider on both sides so the left focal shift can't reveal the navy frame.
                            "absolute -left-[75px] top-0 h-[calc(100%+100px)] w-[calc(100%+150px)]"
                          : i === 3
                            ? "absolute inset-0"
                            : "absolute inset-x-0 top-0 h-[calc(100%+100px)]"
                    }
                  >
                    <EditableImage
                      imageKey={slide.mobileKey ?? slide.key ?? ""}
                      alt={slide.alt}
                      controls={false}
                      fill
                      priority={i === 0}
                      sizes="(min-width: 768px) 1px, 100vw"
                      className="object-cover object-[var(--hero-focal-m)]"
                      style={
                        {
                          "--hero-focal-m": slide.focalMobile ?? "50% 40%",
                        } as CSSProperties
                      }
                    />
                  </div>
                </div>
              )}
              <EditableImage
                imageKey={slide.key ?? slide.mobileKey ?? ""}
                alt={slide.alt}
                controls={false}
                fill
                priority={i === 0}
                sizes="(min-width: 1600px) 1600px, 100vw"
                className={`object-cover object-[var(--hero-focal)] ${
                  hasMobile ? "hidden md:block" : "object-[var(--hero-focal-m)] md:object-[var(--hero-focal)]"
                }`}
                style={
                  {
                    "--hero-focal": slide.focal,
                    "--hero-focal-m": slide.focalMobile ?? slide.focal,
                  } as CSSProperties
                }
              />
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
        <div
          className="absolute bottom-6 right-6 z-20 hidden items-center gap-2 md:flex"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          {slides.map((slide, i) => (
            <button
              key={slide.key ?? slide.src}
              type="button"
              aria-label={`Show banner photo ${i + 1} of ${slides.length}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-[width,background-color] ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
