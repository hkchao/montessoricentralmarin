import Link from "next/link";
import { PhoneLink } from "@/components/ContactBits";
import { T } from "@/components/T";
import { primaryCta, site } from "@/lib/site";

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 1 1 11 0c0 4-5.5 9-5.5 9Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8.5" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-cream/95 backdrop-blur-md md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2 px-3 py-2.5">
        <PhoneLink
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-navy/20 py-2.5 text-sm font-semibold text-navy"
          labelKey="mobile.call"
        />
        <a href={site.mapsHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1.5 rounded-full border border-navy/20 py-2.5 text-sm font-semibold text-navy">
          <PinIcon /> <T k="mobile.map" fallback="Map" />
        </a>
        <Link href={primaryCta.href} className="inline-flex items-center justify-center rounded-full bg-sun py-2.5 text-sm font-semibold text-navy-deep shadow-soft">
          <T k="cta.primary" fallback={primaryCta.label} />
        </Link>
      </div>
    </div>
  );
}
