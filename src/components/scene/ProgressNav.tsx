"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Stop = {
  id: string;
  label: string;
};

const STOPS: readonly Stop[] = [
  { id: "work",    label: "Work" },
  { id: "about",   label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function ProgressNav() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const targets = STOPS.map((s) => document.getElementById(s.id)).filter(
      (n): n is HTMLElement => n !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (b.intersectionRatio - a.intersectionRatio) ||
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 md:block"
    >
      <ul className="flex flex-col gap-3">
        {STOPS.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li
              key={s.id}
              className="pointer-events-auto group flex items-center justify-end"
            >
              <span
                className="mr-3 font-mono text-[10px] uppercase tracking-[0.22em] opacity-0 transition-opacity duration-200 group-hover:opacity-90"
                style={{ color: "var(--color-fg)" }}
              >
                {s.label}
              </span>
              <Link
                href={`#${s.id}`}
                aria-label={`Jump to ${s.label}`}
                aria-current={isActive ? "true" : undefined}
                data-cursor-text="Jump"
                className="block transition-transform duration-300 ease-out"
                style={{
                  width: isActive ? 14 : 6,
                  height: 6,
                  borderRadius: 9999,
                  background: isActive
                    ? "var(--color-accent)"
                    : "rgba(255,255,255,0.45)",
                  boxShadow: isActive
                    ? "0 0 12px var(--color-accent-glow)"
                    : "0 0 0 1px rgba(0,0,0,0.10)",
                  transform: isActive ? "scale(1)" : "scale(1)",
                }}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
