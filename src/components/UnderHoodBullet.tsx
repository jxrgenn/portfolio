"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export function UnderHoodBullet({
  path,
  title,
  body,
}: {
  path: string;
  title: string;
  body: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border-b border-[var(--color-border)] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-start gap-3 py-4 text-left transition-colors hover:text-[var(--color-fg)]"
      >
        <ChevronRight
          className={`mt-1 size-4 shrink-0 text-[var(--color-fg-subtle)] transition-transform duration-150 ${
            open ? "rotate-90" : ""
          } motion-reduce:transition-none`}
          strokeWidth={1.5}
          aria-hidden
        />
        <span className="flex-1">
          <code className="font-mono text-sm text-[var(--color-accent)] underline decoration-dotted decoration-[var(--color-fg-subtle)] underline-offset-4">
            {path}
          </code>
          <span className="ml-2 text-base text-[var(--color-fg-muted)]">— {title}</span>
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 pl-7 text-base leading-relaxed text-[var(--color-fg-muted)]">
            {body}
          </p>
        </div>
      </div>
    </li>
  );
}
