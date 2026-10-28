import Link from "next/link";
import { T } from "@/components/T";
import { site } from "@/lib/site";

type Props = {
  tone?: "light" | "dark";
  className?: string;
};

export function Logo({ tone = "dark", className = "" }: Props) {
  const text = tone === "dark" ? "text-navy" : "text-white";
  return (
    <Link
      href="/"
      className={`group inline-flex items-center ${className}`}
      aria-label={`${site.name} — home`}
    >
      <span className={`font-display whitespace-nowrap text-[1.05rem] font-semibold leading-[1.05] md:text-[1.2rem] ${text}`}>
        <T k="site.name" fallback="Montessori School of Central Marin" />
      </span>
    </Link>
  );
}
