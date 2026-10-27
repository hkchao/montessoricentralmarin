"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/Button";
import { FullAddressText, PhoneLink } from "@/components/ContactBits";
import { T } from "@/components/T";
import { nav, primaryCta, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header
      className={`sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        open
          ? "border-line bg-cream"
          : scrolled
            ? "border-line bg-cream/90 shadow-[0_1px_0_rgb(20_36_94/0.04)] backdrop-blur-md"
            : "border-transparent bg-cream"
      }`}
    >
      <div className="site-wrap flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <Logo />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative whitespace-nowrap rounded-full px-3 py-2 text-[0.95rem] font-medium transition-colors hover:text-navy xl:px-3.5 ${
                      active ? "text-navy" : "text-ink/80"
                    }`}
                  >
                    <T k={`nav.${item.href.slice(1)}`} fallback={item.label} />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-sun transition-opacity ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <PhoneLink className="hidden whitespace-nowrap text-[0.95rem] font-semibold text-navy tabular-nums underline-offset-4 hover:underline xl:inline" />
          <ButtonLink href={primaryCta.href} className="whitespace-nowrap">
            <T k="cta.primary" fallback={primaryCta.label} />
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-full text-navy hover:bg-navy-tint lg:hidden"
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-3 h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </header>

      {/* Sibling of <header>: a fixed panel inside a blurred header would be clipped to the header's box. */}
      <div
        id="mobile-menu"
        className={`lg:hidden ${open ? "block" : "hidden"} fixed inset-x-0 top-[4.5rem] bottom-0 z-30 overflow-y-auto bg-cream`}
      >
        <nav aria-label="Mobile" className="site-wrap flex min-h-full flex-col pt-6 pb-24">
          <ul className="divide-y divide-line">
            <li>
              <Link href="/" onClick={close} className="block py-4 font-display text-2xl text-navy">
                <T k="nav.home" fallback="Home" />
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={close} className="block py-4 font-display text-2xl text-navy">
                  <T k={`nav.${item.href.slice(1)}`} fallback={item.label} />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href={primaryCta.href} size="lg" onClick={close}>
              <T k="cta.primary" fallback={primaryCta.label} />
            </ButtonLink>
            <PhoneLink
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy/25 px-6 py-3.5 text-base font-semibold text-navy hover:border-navy hover:bg-navy-tint"
              labelKey="contact.phone"
            />
          </div>
          <p className="mt-auto pt-10 text-sm text-muted">
            <FullAddressText />
            <br />
            <T k="contact.hours" fallback={site.hours} />
          </p>
        </nav>
      </div>
    </>
  );
}
