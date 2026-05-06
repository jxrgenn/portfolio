"use client";

import { useEffect, useState } from "react";

export function SiteFooter() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setTime(fmt.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      className="relative z-10 mt-12 border-t px-6 py-10 md:px-10 lg:px-16"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-6">
        <div
          className="flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-fg-muted)" }}
        >
          <span
            className="block h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--color-success)",
              boxShadow: "0 0 8px var(--color-success)",
            }}
            aria-hidden
          />
          Kiel — {time || "—:—"} local
        </div>

        <p
          className="font-sans text-sm"
          style={{ color: "var(--color-fg-muted)" }}
        >
          © {new Date().getFullYear()} Jurgen Halili — built solo with R3F, GSAP, Lenis.
        </p>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-cursor-text="Top"
          className="font-sans text-[11px] uppercase tracking-[0.22em]"
          style={{
            color: "var(--color-fg-muted)",
            textDecoration: "underline",
            textUnderlineOffset: 4,
            textDecorationColor: "var(--color-accent)",
          }}
        >
          ↑ back to top
        </button>
      </div>
    </footer>
  );
}
