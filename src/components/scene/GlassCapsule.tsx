import Link from "next/link";
import type { ReactNode } from "react";

export function GlassCapsule({
  href,
  children,
  className = "",
  external = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}) {
  if (external || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a
        href={href}
        className={`glass-capsule ${className}`}
        data-cursor-text={href.startsWith("mailto:") ? "Email" : "Open"}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`glass-capsule ${className}`} data-cursor-text="View">
      {children}
    </Link>
  );
}
