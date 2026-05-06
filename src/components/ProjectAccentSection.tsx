import type { ReactNode } from "react";

export function ProjectAccentSection({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <div data-accent={slug} className="relative">
      {children}
    </div>
  );
}
