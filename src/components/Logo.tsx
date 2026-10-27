import Link from "next/link";
import { EditableImage } from "@/components/admin/EditableImage";
import { T } from "@/components/T";
import { site } from "@/lib/site";

type Props = {
  tone?: "light" | "dark";
  compact?: boolean;
  className?: string;
};

export function Logo({ tone = "dark", compact = false, className = "" }: Props) {
  const text = tone === "dark" ? "text-navy" : "text-white";
  const sub = tone === "dark" ? "text-muted" : "text-white/70";
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label={`${site.name} — home`}>
      {/* Original school mark (children in a circle). Source file is 86px; displayed ≤48px so it stays crisp. */}
      <span className="relative size-11 shrink-0 overflow-hidden rounded-full ring-1 ring-navy/10 md:size-12">
        <EditableImage
          imageKey="brand.logo"
          fill
          sizes="48px"
          className="object-cover"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display whitespace-nowrap text-[1.05rem] font-semibold leading-[1.05] md:text-[1.2rem] ${text}`}>
          <T k="site.name" fallback="Montessori School of Central Marin" />
        </span>
        {!compact && (
          <span className={`mt-1.5 hidden text-[0.7rem] font-medium tracking-wide xl:block ${sub}`}>
            <T k="site.tagline" fallback={site.tagline} />
          </span>
        )}
      </span>
    </Link>
  );
}
