import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  tone?: "cream" | "white" | "navy" | "sand";
  className?: string;
  children: ReactNode;
  /** Skip the scroll-reveal motion (e.g. for above-the-fold content). */
  still?: boolean;
};

const tones = {
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  navy: "bg-navy text-white",
} as const;

export function Section({ id, tone = "cream", className = "", children, still = false }: SectionProps) {
  return (
    <section id={id} className={`${tones[tone]} py-16 md:py-24 ${id ? "scroll-mt-28" : ""} ${className}`}>
      <div className={`site-wrap ${still ? "" : "reveal"}`}>{children}</div>
    </section>
  );
}

type HeadingProps = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
  className = "",
}: HeadingProps) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {kicker && <p className={`kicker ${tone === "dark" ? "text-sun-deep" : "text-sun"}`}>{kicker}</p>}
      <Tag
        className={`font-display mt-3 text-3xl font-medium text-balance leading-[1.08] sm:text-4xl ${
          tone === "dark" ? "text-navy" : "text-white"
        }`}
      >
        {title}
      </Tag>
      {lede && (
        <p className={`mt-4 text-[1.0625rem] leading-relaxed text-pretty ${tone === "dark" ? "text-muted" : "text-white/75"}`}>
          {lede}
        </p>
      )}
    </div>
  );
}
