"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ActivityData, Day } from "./LiveActivity";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function levelColor(level: number): string {
  if (level === 0) return "rgba(255,255,255,0.05)";
  if (level === 1) return "oklch(0.66 0.16 215 / 0.55)";
  if (level === 2) return "oklch(0.68 0.20 260 / 0.78)";
  if (level === 3) return "oklch(0.70 0.20 295 / 0.92)";
  return "oklch(0.74 0.22 25 / 0.98)";
}

function levelGlow(level: number): string {
  if (level === 0) return "transparent";
  if (level === 1) return "oklch(0.66 0.16 215 / 0.18)";
  if (level === 2) return "oklch(0.68 0.20 260 / 0.30)";
  if (level === 3) return "oklch(0.70 0.20 295 / 0.42)";
  return "oklch(0.74 0.22 25 / 0.56)";
}

function relativeNow(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function formatBusiest(d: Day | null): { label: string; sub: string } {
  if (!d) return { label: "—", sub: "" };
  const date = new Date(d.date + "T00:00:00");
  const label = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return {
    label,
    sub: `${d.count} ${d.count === 1 ? "push" : "pushes"}`,
  };
}

export function LiveActivityClient({ data }: { data: ActivityData }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [updatedLabel, setUpdatedLabel] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleHover = (i: number | null, el?: HTMLElement) => {
    setHovered(i);
    if (i === null || !el) {
      setTooltipPos(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTooltipPos({ x: r.left + r.width / 2, y: r.top });
  };

  // Update relative timestamp on mount, then every 30s.
  useEffect(() => {
    setUpdatedLabel(relativeNow(data.fetchedAt));
    const id = window.setInterval(
      () => setUpdatedLabel(relativeNow(data.fetchedAt)),
      30_000,
    );
    return () => window.clearInterval(id);
  }, [data.fetchedAt]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-live-eyebrow], [data-live-stamp]", {
        opacity: 0,
        y: 8,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 78%", once: true },
      });
      gsap.from("[data-live-title]", {
        opacity: 0,
        y: 22,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 76%", once: true },
      });
      gsap.from("[data-live-num]", {
        opacity: 0,
        y: 28,
        duration: 1.0,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      gsap.from("[data-live-lede]", {
        opacity: 0,
        y: 14,
        duration: 0.8,
        delay: 0.35,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      // Animate the heatmap as a single unit — animating 371 cells with a
      // staggered from() snaps them all to opacity 0 in one frame and then
      // race-restores them; on slower paths it can leave cells stuck dark.
      // One container fade-up is robust and visually equivalent.
      gsap.from("[data-live-heatmap]", {
        opacity: 0,
        y: 16,
        duration: 1.0,
        delay: 0.35,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 72%", once: true },
      });
      // Subtle left-to-right sweep on first reveal — purely cosmetic.
      gsap.fromTo(
        "[data-live-sweep]",
        { xPercent: -120, opacity: 0 },
        {
          xPercent: 120,
          opacity: 1,
          duration: 1.6,
          delay: 0.5,
          ease: "power2.inOut",
          scrollTrigger: { trigger: wrap, start: "top 72%", once: true },
          onComplete: () => {
            const el = document.querySelector(
              "[data-live-sweep]",
            ) as HTMLElement | null;
            if (el) el.style.opacity = "0";
          },
        },
      );
      gsap.from("[data-live-stat]", {
        opacity: 0,
        y: 14,
        stagger: 0.08,
        duration: 0.7,
        delay: 1.7,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 68%", once: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  // Heatmap geometry: cells laid out column-major, 7 rows × N weeks.
  // Days arrive sorted ascending. The first day defines column 0 row N (its day-of-week).
  const grid = useMemo(() => {
    const days = data.days;
    if (days.length === 0) {
      return { weeks: 0, monthLabels: [] as Array<{ week: number; name: string }> };
    }
    const firstDow = new Date(days[0].date + "T00:00:00").getDay(); // 0 = Sun
    const weeks = Math.ceil((days.length + firstDow) / 7);

    // Month labels: place above the first column where each month begins.
    const monthLabels: Array<{ week: number; name: string }> = [];
    let lastMonth = -1;
    days.forEach((d, i) => {
      const idx = i + firstDow; // grid index
      const week = Math.floor(idx / 7);
      const month = parseInt(d.date.slice(5, 7), 10) - 1;
      if (month !== lastMonth) {
        // Place the label only if we're at the very start of a new column,
        // otherwise the label crowds into the previous month's tail.
        if (idx % 7 <= 2) {
          monthLabels.push({ week, name: MONTH_NAMES[month] });
        }
        lastMonth = month;
      }
    });
    return { weeks, monthLabels, firstDow };
  }, [data.days]);

  const busiest = formatBusiest(data.busiest);
  const todayIndex = data.days.length - 1;

  return (
    <section
      ref={wrapRef}
      id="live"
      className="relative bg-[#070612] px-6 py-20 md:px-10 md:py-40 lg:px-16"
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
        }}
      />
      {/* Soft iridescent ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 78% 18%, rgba(160,130,255,0.10), transparent 70%), radial-gradient(38% 32% at 12% 82%, rgba(255,170,110,0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl">
        {/* === TOP ROW === */}
        <div className="flex items-start justify-between gap-6">
          <p
            data-live-eyebrow
            className="font-mono text-[11px] uppercase tracking-[0.32em]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            <span style={{ color: "rgba(255,255,255,0.85)" }}>03</span>
            &nbsp; / &nbsp;Live
          </p>

          <div
            data-live-stamp
            className="flex flex-col items-end gap-1 font-mono text-[9px] uppercase tracking-[0.20em] md:flex-row md:items-center md:gap-2 md:text-[10px] md:tracking-[0.22em]"
            style={{ color: "rgba(255,255,255,0.50)" }}
          >
            <span className="flex items-center gap-2">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(120, 220, 160, 0.55)",
                    animation: "status-pulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  aria-hidden
                  className="relative block h-1.5 w-1.5 rounded-full"
                  style={{
                    background: "#67d99b",
                    boxShadow: "0 0 8px rgba(103,217,155,0.55)",
                  }}
                />
              </span>
              <span suppressHydrationWarning>
                {updatedLabel ? `updated ${updatedLabel}` : "updating"}
              </span>
            </span>
            <span aria-hidden className="hidden opacity-50 md:inline">·</span>
            <a
              href="https://github.com/jxrgenn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              @jxrgenn
            </a>
          </div>
        </div>

        {/* === TITLE === */}
        <h2
          data-live-title
          className="mt-7 font-serif text-white"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(3rem, 8vw, 6.4rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
          }}
        >
          Currently{" "}
          <span style={{ fontStyle: "italic", opacity: 0.6, fontWeight: 300 }}>
            shipping.
          </span>
        </h2>

        {/* === BIG NUMBER + LEDE === */}
        <div className="mt-12 grid grid-cols-1 items-end gap-y-6 md:grid-cols-[auto_1fr] md:gap-x-12">
          <p
            data-live-num
            className="font-serif text-white tabular-nums"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(4.5rem, 12vw, 9.5rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.05em",
              fontWeight: 300,
              fontStyle: "italic",
            }}
          >
            {data.total.toLocaleString()}
          </p>

          <div data-live-lede className="max-w-md md:pb-3">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.28em]"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              contributions in the last year
            </p>
            <p
              className="mt-3 font-sans leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.72)",
                fontWeight: 300,
                fontSize: "clamp(0.95rem, 1.15vw, 1.05rem)",
              }}
            >
              Most code is private — clients, NDAs, in-progress builds. This is
              the rhythm anyway. Pulled from public + private contributions
              every hour.
            </p>
          </div>
        </div>

        {/* === HEATMAP — MOBILE COMPACT (last 17 weeks) === */}
        <div className="mt-12 md:hidden">
          <div
            data-live-heatmap
            className="relative"
            style={{ paddingLeft: 4 }}
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
              <span>17 weeks ago</span>
              <span>today</span>
            </div>
            <CompactMobileHeatmap
              days={data.days.slice(-7 * 17)}
              hovered={hovered}
              setHovered={setHovered}
              onHover={handleHover}
              todayIndexInFull={todayIndex}
              fullLength={data.days.length}
            />
            <div
              className="mt-3 flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              <span>less</span>
              {[0, 1, 2, 3, 4].map((l) => (
                <span
                  key={l}
                  aria-hidden
                  className="block h-2 w-2 rounded-[2px]"
                  style={{ background: levelColor(l) }}
                />
              ))}
              <span>more</span>
            </div>
          </div>
        </div>

        {/* === HEATMAP — DESKTOP FULL YEAR === */}
        <div className="mt-16 hidden -mx-6 overflow-x-auto px-6 pb-3 md:mx-0 md:block md:px-0">
          <div data-live-heatmap className="relative min-w-[920px]">
            {/* One-shot reveal sweep — light bar that travels across on first scroll-in. */}
            <span
              data-live-sweep
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10"
              style={{
                width: "12%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.10) 65%, transparent)",
                mixBlendMode: "screen",
                left: 0,
                opacity: 0,
              }}
            />
            {/* Month labels */}
            <div
              className="relative mb-2 ml-7 h-3.5 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              {grid.monthLabels.map((m, i) => (
                <span
                  key={`${m.name}-${i}`}
                  className="absolute"
                  style={{
                    left: `calc(${m.week} * (12px + 3px))`,
                  }}
                >
                  {m.name}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {/* Day-of-week labels */}
              <ul
                className="flex flex-col font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{
                  color: "rgba(255,255,255,0.32)",
                  rowGap: 3,
                  paddingTop: 0,
                }}
              >
                {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                  <li
                    key={i}
                    style={{ height: 12, lineHeight: "12px", width: 22 }}
                  >
                    {d}
                  </li>
                ))}
              </ul>

              {/* Cells grid */}
              <div
                className="relative"
                style={{
                  display: "grid",
                  gridTemplateRows: "repeat(7, 12px)",
                  gridTemplateColumns: `repeat(${grid.weeks}, 12px)`,
                  gridAutoFlow: "column",
                  columnGap: 3,
                  rowGap: 3,
                }}
              >
                {/* Empty cells before the first day to align day-of-week */}
                {Array.from({ length: grid.firstDow ?? 0 }).map((_, i) => (
                  <span
                    key={`pre-${i}`}
                    aria-hidden
                    className="rounded-[2px]"
                    style={{ background: "transparent" }}
                  />
                ))}

                {data.days.map((d, i) => {
                  const isToday = i === todayIndex;
                  return (
                    <button
                      key={d.date}
                      data-live-cell
                      type="button"
                      aria-label={`${d.count} contributions on ${d.date}`}
                      onMouseEnter={(e) => handleHover(i, e.currentTarget)}
                      onMouseLeave={() => handleHover(null)}
                      onFocus={(e) => handleHover(i, e.currentTarget)}
                      onBlur={() => handleHover(null)}
                      className="relative rounded-[2px] outline-none transition-transform duration-200 ease-out hover:z-20 hover:scale-[1.55] focus-visible:z-20 focus-visible:scale-[1.55]"
                      style={{
                        background: levelColor(d.level),
                        boxShadow:
                          d.level > 0
                            ? `0 0 10px -2px ${levelGlow(d.level)}`
                            : "inset 0 0 0 1px rgba(255,255,255,0.04)",
                        width: 12,
                        height: 12,
                        padding: 0,
                        border: 0,
                        cursor: "pointer",
                      }}
                    >
                      {isToday && d.level > 0 && (
                        <span
                          aria-hidden
                          className="absolute inset-0 rounded-[2px]"
                          style={{
                            boxShadow: `0 0 0 1.5px ${levelColor(d.level)}`,
                            animation:
                              "path-dot-pulse 2.4s ease-in-out infinite",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div
              className="ml-7 mt-3 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em]"
              style={{ color: "rgba(255,255,255,0.40)" }}
            >
              <span>less</span>
              {[0, 1, 2, 3, 4].map((l) => (
                <span
                  key={l}
                  aria-hidden
                  className="block h-2.5 w-2.5 rounded-[2px]"
                  style={{ background: levelColor(l) }}
                />
              ))}
              <span>more</span>
            </div>
          </div>
        </div>

        {/* === STATS === */}
        <dl
          className="mt-14 grid grid-cols-2 gap-y-10 border-t pt-8 md:grid-cols-4 md:gap-x-8"
          style={{ borderColor: "rgba(255,255,255,0.10)" }}
        >
          <Stat
            label="current streak"
            value={`${data.current}`}
            unit={data.current === 1 ? "day" : "days"}
          />
          <Stat
            label="longest streak"
            value={`${data.longest}`}
            unit={data.longest === 1 ? "day" : "days"}
          />
          <Stat
            label="busiest day"
            value={busiest.label}
            unit={busiest.sub}
            italic
          />
          <Stat
            label="total · year"
            value={data.total.toLocaleString()}
            unit="pushes"
          />
        </dl>

        {data.fallback && (
          <p
            className="mt-6 font-mono text-[9px] uppercase tracking-[0.24em]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            github contributions unreachable · showing static placeholder
          </p>
        )}
      </div>

      {/* Portal-rendered tooltip — escapes all overflow contexts so it never
       * clips against the heatmap's overflow-x-auto wrapper. */}
      {mounted && tooltipPos && hovered !== null && data.days[hovered] &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed z-[9999] whitespace-nowrap rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em]"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 8,
              transform: "translate(-50%, -100%)",
              background: "rgba(20,17,32,0.96)",
              color: "rgba(255,255,255,0.94)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            {data.days[hovered].count} on {data.days[hovered].date}
          </div>,
          document.body,
        )}
    </section>
  );
}

function CompactMobileHeatmap({
  days,
  hovered,
  setHovered,
  onHover,
  todayIndexInFull,
  fullLength,
}: {
  days: Day[];
  hovered: number | null;
  setHovered: (i: number | null) => void;
  onHover: (i: number | null, el?: HTMLElement) => void;
  todayIndexInFull: number;
  fullLength: number;
}) {
  if (days.length === 0) return null;
  const firstDow = new Date(days[0].date + "T00:00:00").getDay();
  const weeks = Math.ceil((days.length + firstDow) / 7);
  const offsetIndex = fullLength - days.length;

  return (
    <div className="flex gap-2">
      <ul
        className="flex flex-col font-mono text-[8px] uppercase tracking-[0.18em]"
        style={{ color: "rgba(255,255,255,0.32)", rowGap: 2 }}
      >
        {["", "M", "", "W", "", "F", ""].map((d, i) => (
          <li key={i} style={{ height: 11, lineHeight: "11px", width: 14 }}>
            {d}
          </li>
        ))}
      </ul>

      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(7, 11px)",
          gridTemplateColumns: `repeat(${weeks}, 11px)`,
          gridAutoFlow: "column",
          columnGap: 2,
          rowGap: 2,
        }}
      >
        {Array.from({ length: firstDow }).map((_, i) => (
          <span
            key={`pre-${i}`}
            aria-hidden
            style={{ background: "transparent" }}
          />
        ))}
        {days.map((d, i) => {
          const fullIdx = offsetIndex + i;
          const isToday = fullIdx === todayIndexInFull;
          return (
            <button
              key={d.date}
              type="button"
              aria-label={`${d.count} contributions on ${d.date}`}
              onTouchStart={(e) => onHover(fullIdx, e.currentTarget)}
              onTouchEnd={() => {
                window.setTimeout(() => onHover(null), 1400);
              }}
              onMouseEnter={(e) => onHover(fullIdx, e.currentTarget)}
              onMouseLeave={() => onHover(null)}
              className="relative rounded-[2px] outline-none"
              style={{
                background: levelColor(d.level),
                boxShadow:
                  d.level > 0
                    ? `0 0 8px -3px ${levelColor(d.level)}`
                    : "inset 0 0 0 1px rgba(255,255,255,0.04)",
                width: 11,
                height: 11,
                padding: 0,
                border: 0,
                cursor: "pointer",
              }}
            >
              {isToday && d.level > 0 && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[2px]"
                  style={{
                    boxShadow: `0 0 0 1.5px ${levelColor(d.level)}`,
                    animation: "path-dot-pulse 2.4s ease-in-out infinite",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  italic = false,
}: {
  label: string;
  value: string;
  unit: string;
  italic?: boolean;
}) {
  return (
    <div data-live-stat>
      <dt
        className="font-mono text-[10px] uppercase tracking-[0.24em]"
        style={{ color: "rgba(255,255,255,0.50)" }}
      >
        {label}
      </dt>
      <dd className="mt-2 flex items-baseline gap-2">
        <span
          className="font-serif text-white tabular-nums"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(1.85rem, 2.6vw, 2.4rem)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            fontStyle: italic ? "italic" : "normal",
            fontWeight: 400,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {unit}
          </span>
        )}
      </dd>
    </div>
  );
}
