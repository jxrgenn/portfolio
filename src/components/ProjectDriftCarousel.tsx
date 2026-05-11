"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectShot } from "@/lib/projects";

export type ResolvedShot = ProjectShot & {
  device: "desktop" | "mobile";
  width: number;
  height: number;
};

const CARD_HEIGHT = 440; // px — fixed across mobile + desktop so the rail is uniform

function FrameCard({
  shot,
  isActive,
}: {
  shot: ResolvedShot;
  isActive: boolean;
}) {
  const isMobile = shot.device === "mobile";

  if (isMobile) {
    return (
      <div
        style={{
          height: CARD_HEIGHT,
          padding: 6,
          borderRadius: 36,
          background:
            "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
          boxShadow: isActive
            ? "0 28px 56px -22px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)"
            : "0 10px 22px -12px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
          transition: "box-shadow 280ms, transform 280ms, opacity 280ms",
          transform: isActive ? "scale(1)" : "scale(0.92)",
          opacity: isActive ? 1 : 0.65,
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            borderRadius: 30,
            overflow: "hidden",
            background: "var(--color-bg)",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: 6,
              transform: "translateX(-50%)",
              width: 60,
              height: 16,
              borderRadius: 999,
              background: "#0a0a0a",
              zIndex: 2,
            }}
          />
          <Image
            src={shot.src}
            alt={shot.alt ?? ""}
            width={shot.width}
            height={shot.height}
            sizes="220px"
            style={{ height: "100%", width: "auto", display: "block" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: CARD_HEIGHT,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-elevated)",
        boxShadow: isActive
          ? "0 24px 48px -24px rgba(0,0,0,0.5)"
          : "0 10px 22px -12px rgba(0,0,0,0.35)",
        transition: "box-shadow 280ms, transform 280ms, opacity 280ms",
        transform: isActive ? "scale(1)" : "scale(0.92)",
        opacity: isActive ? 1 : 0.65,
      }}
    >
      <div
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "0 14px",
          borderBottom: "1px solid var(--color-border)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%), var(--color-bg-overlay)",
          flexShrink: 0,
        }}
      >
        <span style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28c840" }} />
        </span>
        <span
          style={{
            flex: 1,
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "var(--color-fg-muted)",
            padding: "3px 10px",
            background: "var(--color-bg)",
            borderRadius: 4,
            border: "1px solid var(--color-border)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {shot.url ?? "—"}
        </span>
      </div>
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
        <Image
          src={shot.src}
          alt={shot.alt ?? ""}
          width={shot.width}
          height={shot.height}
          sizes="(min-width: 1024px) 720px, 90vw"
          style={{ height: "100%", width: "auto", display: "block" }}
        />
      </div>
    </div>
  );
}

export function ProjectDriftCarousel({ shots }: { shots: ResolvedShot[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const inViewRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const [active, setActive] = useState(0);

  const scrollToCard = useCallback((i: number) => {
    const card = cardsRef.current[i];
    if (!card) return;
    programmaticScrollRef.current = true;
    card.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 700);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setActive(i);
      scrollToCard(i);
    },
    [scrollToCard],
  );

  const next = useCallback(() => {
    setActive((current) => {
      const target = Math.min(shots.length - 1, current + 1);
      if (target !== current) scrollToCard(target);
      return target;
    });
  }, [shots.length, scrollToCard]);

  const prev = useCallback(() => {
    setActive((current) => {
      const target = Math.max(0, current - 1);
      if (target !== current) scrollToCard(target);
      return target;
    });
  }, [scrollToCard]);

  // Detect which card is most centered when the user scrolls/swipes manually.
  // Suppressed during programmatic scrolls so we don't fight ourselves.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame: number | null = null;
    const onScroll = () => {
      if (programmaticScrollRef.current) return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rail = track.getBoundingClientRect();
        const center = rail.left + rail.width / 2;
        let bestIdx = 0;
        let bestDist = Infinity;
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const r = card.getBoundingClientRect();
          const c = r.left + r.width / 2;
          const d = Math.abs(c - center);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        });
        setActive(bestIdx);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  // Keyboard navigation when carousel is in view.
  useEffect(() => {
    const root = trackRef.current?.parentElement;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [next, prev]);

  const focused = shots[active];
  if (!focused) return null;

  return (
    <div className="relative">
      {/* Header: figure number + caption + arrows, centered */}
      <div className="mx-auto mb-7 grid max-w-3xl grid-cols-[auto_1fr_auto] items-center gap-5 px-2">
        <button
          type="button"
          onClick={prev}
          disabled={active === 0}
          aria-label="Previous"
          className="grid h-11 w-11 place-items-center rounded-full border transition-all disabled:opacity-25 hover:border-[var(--color-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}
        >
          ←
        </button>
        <div className="min-h-[3.5rem] text-center">
          <p
            className="font-mono"
            style={{
              color: "var(--color-fg-subtle)",
              fontSize: 11,
              letterSpacing: "0.18em",
            }}
          >
            FIG. {String(active + 2).padStart(2, "0")} ·{" "}
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(shots.length).padStart(2, "0")}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={focused.src}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="mt-1.5 font-serif italic"
              style={{
                color: "var(--color-fg)",
                fontSize: 16,
                lineHeight: 1.45,
              }}
              aria-live="polite"
            >
              {focused.caption ?? focused.alt ?? "—"}
            </motion.p>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={next}
          disabled={active === shots.length - 1}
          aria-label="Next"
          className="grid h-11 w-11 place-items-center rounded-full border transition-all disabled:opacity-25 hover:border-[var(--color-fg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}
        >
          →
        </button>
      </div>

      {/* Rail — bleeds out of the section's horizontal padding */}
      <div
        ref={trackRef}
        className="-mx-6 flex gap-6 overflow-x-auto overflow-y-visible py-3 md:-mx-10 lg:-mx-16"
        style={{
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          scrollPaddingInline: "max(20px, calc(50% - 360px))",
          paddingInline: "max(20px, calc(50% - 360px))",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {shots.map((shot, i) => (
          <article
            key={shot.src}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="shrink-0"
            style={{
              scrollSnapAlign: "center",
              scrollSnapStop: "always",
            }}
          >
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to figure ${String(i + 2).padStart(2, "0")}`}
              className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-elevated)]"
              style={{ cursor: i === active ? "default" : "pointer" }}
            >
              <FrameCard shot={shot} isActive={i === active} />
            </button>
          </article>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {shots.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Jump to figure ${String(i + 2).padStart(2, "0")}`}
            aria-current={i === active}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === active ? 22 : 8,
              background:
                i === active
                  ? "var(--color-accent)"
                  : "var(--color-border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
