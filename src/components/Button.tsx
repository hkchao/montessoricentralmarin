import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "navy" | "ghost" | "ghost-light" | "link";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun active:translate-y-px";

const variants: Record<Variant, string> = {
  primary:
    "bg-sun text-navy-deep shadow-soft hover:bg-sun-deep hover:shadow-lift",
  navy: "bg-navy text-white shadow-soft hover:bg-navy-deep hover:shadow-lift",
  ghost:
    "border border-navy/25 text-navy hover:border-navy hover:bg-navy-tint",
  "ghost-light":
    "border border-white/40 text-white hover:border-white hover:bg-white/10",
  link: "text-navy underline-offset-4 hover:underline px-0",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.9375rem]",
  lg: "px-6 py-3.5 text-base",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonLinkProps) {
  const cls = `${base} ${variants[variant]} ${variant === "link" ? "" : sizes[size]} ${className}`;
  // Next.js <Link> is for App Router pages — static files need a plain <a>.
  const file = /\.(pdf|docx?|xlsx?|zip|png|jpe?g|webp|gif|svg)$/i.test(href);
  const external =
    file ||
    href.startsWith("http") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:");
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") || file ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
