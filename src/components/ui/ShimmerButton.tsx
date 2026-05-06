"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost";
};

function buttonClasses(variant: "primary" | "ghost", className?: string) {
  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-sm uppercase tracking-wider transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0";
  if (variant === "ghost") {
    return `${base} border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/40 text-[var(--color-fg)] backdrop-blur hover:bg-[var(--color-bg-overlay)]/60 ${className ?? ""}`;
  }
  return `${base} text-[var(--color-bg)] shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:shadow-[0_0_44px_rgba(34,211,238,0.55)] ${className ?? ""}`;
}

function Inner({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "primary" | "ghost";
}) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(110deg, rgba(34,211,238,1) 0%, rgba(167,139,250,1) 45%, rgba(244,114,182,1) 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 3s linear infinite",
          }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  );
}

export function ShimmerLink({
  href,
  children,
  className,
  variant = "primary",
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={buttonClasses(variant, className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

export function ShimmerButton({
  children,
  className,
  variant = "primary",
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={buttonClasses(variant, className)} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </button>
  );
}
