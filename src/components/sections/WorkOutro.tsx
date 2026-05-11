"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Milestone = {
  year: string;
  label: string;
  meta: readonly string[];
  accent: string;
  current?: boolean;
};

const MILESTONES: readonly Milestone[] = [
  {
    year: "2021",
    label: "Bachelor.",
    meta: ["Software Engineering", "Epoka, Tirana"],
    accent: "#8a85ff",
  },
  {
    year: "2023",
    label: "Interning.",
    meta: ["Spring Boot · Flask", "Intesa · BALFIN"],
    accent: "#7fcfff",
  },
  {
    year: "2024",
    label: "Solo.",
    meta: ["BSc · freelance", "MERN + BC/NAV"],
    accent: "#ffd178",
  },
  {
    year: "2025",
    label: "Experience.",
    meta: ["NextGen AI", "AI engineering"],
    accent: "#ff9272",
  },
  {
    year: "2026",
    label: "AI Developer.",
    meta: ["two tracks running", "end to end"],
    accent: "#c099ff",
    current: true,
  },
];

export function WorkOutro() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const linePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = linePathRef.current;
    if (!wrap || !line) return;

    const lineLen = line.getTotalLength();
    line.style.strokeDasharray = String(lineLen);
    line.style.strokeDashoffset = String(lineLen);

    const ctx = gsap.context(() => {
      gsap.from("[data-path-eyebrow]", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 78%", once: true },
      });
      gsap.from("[data-path-title]", {
        opacity: 0,
        y: 22,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
      });
      gsap.from("[data-path-lede]", {
        opacity: 0,
        y: 16,
        duration: 0.85,
        delay: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 72%", once: true },
      });
      gsap.from("[data-path-year]", {
        opacity: 0,
        y: 18,
        stagger: 0.1,
        duration: 0.85,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 68%", once: true },
      });
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1.9,
        delay: 0.35,
        ease: "power2.inOut",
        scrollTrigger: { trigger: wrap, start: "top 68%", once: true },
      });
      gsap.from("[data-path-dot]", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center center",
        stagger: 0.16,
        duration: 0.55,
        delay: 0.45,
        ease: "back.out(1.8)",
        scrollTrigger: { trigger: wrap, start: "top 68%", once: true },
      });
      gsap.from("[data-path-caption]", {
        opacity: 0,
        y: 10,
        stagger: 0.08,
        duration: 0.65,
        delay: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap, start: "top 68%", once: true },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  // Dot positions in viewBox space (5 dots at 10/30/50/70/90% of 1000-wide line).
  const dotXs = [100, 300, 500, 700, 900];

  return (
    <section
      ref={wrapRef}
      id="path"
      className="relative bg-[#070612] px-6 py-20 md:px-10 md:py-36 lg:px-16"
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

      <div className="relative mx-auto w-full max-w-6xl">
        <p
          data-path-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.85)" }}>02</span>
          &nbsp; / &nbsp;Path
        </p>

        <h2
          data-path-title
          className="mt-6 font-serif text-white"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(3rem, 8vw, 6.4rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0',
          }}
        >
          Five years.{" "}
          <span style={{ fontStyle: "italic", opacity: 0.55, fontWeight: 300 }}>
            And counting.
          </span>
        </h2>

        <p
          data-path-lede
          className="mt-7 max-w-xl font-sans leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.62)",
            fontWeight: 300,
            fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
          }}
        >
          Bachelor in Tirana. Two short internships. Freelance since 2024 — full-stack
          AI on one side, Microsoft Business Central on the other. Personal projects
          fill in between.
        </p>

        {/* === Timeline === */}
        <div className="mt-24">
          {/* Year row — desktop only */}
          <div className="hidden md:grid md:grid-cols-5">
            {MILESTONES.map((m) => (
              <div key={`y-${m.year}`} className="text-center">
                <span
                  data-path-year
                  className="inline-block font-serif"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    color: m.current
                      ? "var(--color-fg)"
                      : "rgba(255,255,255,0.95)",
                    fontSize: "clamp(2.4rem, 4vw, 3.4rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    fontStyle: m.current ? "italic" : "normal",
                    fontVariationSettings: m.current
                      ? '"opsz" 144, "SOFT" 30, "WONK" 0.4'
                      : '"opsz" 144, "SOFT" 0, "WONK" 0',
                  }}
                >
                  {m.year}
                </span>
              </div>
            ))}
          </div>

          {/* Spine + dots — desktop only */}
          <div
            className="relative mt-8 hidden h-3 w-full md:block"
            aria-hidden
          >
            <svg
              viewBox="0 0 1000 12"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="path-spine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8a85ff" stopOpacity="0.85" />
                  <stop offset="25%" stopColor="#7fcfff" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#ffd178" stopOpacity="0.85" />
                  <stop offset="75%" stopColor="#ff9272" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#c099ff" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              <path
                ref={linePathRef}
                d={`M ${dotXs[0]} 6 L ${dotXs[dotXs.length - 1]} 6`}
                stroke="url(#path-spine)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
              {MILESTONES.map((m, i) => (
                <g key={`dot-${m.year}`}>
                  <circle
                    data-path-dot
                    cx={dotXs[i]}
                    cy={6}
                    r="3.6"
                    fill={m.accent}
                    style={{
                      filter: `drop-shadow(0 0 6px ${m.accent})`,
                    }}
                  />
                  {m.current && (
                    <circle
                      cx={dotXs[i]}
                      cy={6}
                      r="3.6"
                      fill="none"
                      stroke={m.accent}
                      strokeWidth="0.8"
                      opacity="0.55"
                      style={{
                        transformOrigin: `${dotXs[i]}px 6px`,
                        animation: "path-dot-pulse 2.2s ease-in-out infinite",
                      }}
                    />
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Caption row — desktop only */}
          <div className="mt-8 hidden md:grid md:grid-cols-5 md:gap-x-4">
            {MILESTONES.map((m) => (
              <div
                key={`c-${m.year}`}
                data-path-caption
                className="text-center"
              >
                <p
                  className="font-serif"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "clamp(1.1rem, 1.4vw, 1.25rem)",
                    color: "rgba(255,255,255,0.94)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  {m.label}
                </p>
                <ul
                  className="mt-3 flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.20em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {m.meta.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile timeline — compact two-column stop list. */}
          <div className="relative md:hidden">
            {/* Vertical iridescent spine. */}
            <div
              aria-hidden
              className="pointer-events-none absolute w-[2px] rounded-full"
              style={{
                left: 9,
                top: 10,
                bottom: 10,
                background:
                  "linear-gradient(180deg, #8a85ff 0%, #7fcfff 28%, #ffd178 55%, #ff9272 80%, #c099ff 100%)",
                boxShadow: "0 0 14px -2px rgba(160,130,255,0.50)",
              }}
            />

            <ol className="flex flex-col gap-7">
              {MILESTONES.map((m) => (
                <li
                  key={`m-${m.year}`}
                  className="relative grid grid-cols-[20px_1fr] items-start gap-x-4"
                >
                  {/* Dot — sits on the spine. */}
                  <span
                    aria-hidden
                    className="relative mt-[6px] grid h-5 w-5 shrink-0 place-items-center"
                  >
                    {m.current && (
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `${m.accent}33`,
                          animation:
                            "status-pulse 2.2s ease-in-out infinite",
                        }}
                      />
                    )}
                    <span
                      aria-hidden
                      className="block h-3 w-3 rounded-full"
                      style={{
                        background: m.accent,
                        boxShadow: `0 0 10px ${m.accent}, 0 0 0 2.5px #070612`,
                      }}
                    />
                  </span>

                  <div className="flex flex-col gap-1">
                    {/* Year + label inline — wrap if narrow. */}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span
                        className="font-serif tabular-nums leading-none"
                        style={{
                          fontFamily:
                            "var(--font-fraunces), Georgia, serif",
                          color: m.current
                            ? "var(--color-fg)"
                            : "rgba(255,255,255,0.95)",
                          fontSize: "clamp(1.6rem, 7vw, 2rem)",
                          fontWeight: 400,
                          letterSpacing: "-0.035em",
                          fontStyle: m.current ? "italic" : "normal",
                          fontVariationSettings: m.current
                            ? '"opsz" 144, "SOFT" 30, "WONK" 0.4'
                            : '"opsz" 144, "SOFT" 0, "WONK" 0',
                        }}
                      >
                        {m.year}
                      </span>
                      <span
                        className="font-serif"
                        style={{
                          fontFamily:
                            "var(--font-fraunces), Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "clamp(1rem, 4.2vw, 1.15rem)",
                          color: "rgba(255,255,255,0.90)",
                          fontWeight: 400,
                          letterSpacing: "-0.005em",
                          lineHeight: 1.1,
                        }}
                      >
                        {m.label}
                      </span>
                    </div>

                    {/* Meta — single line with · separators. */}
                    <p
                      className="font-mono text-[10px] uppercase tracking-[0.20em]"
                      style={{ color: "rgba(255,255,255,0.48)", lineHeight: 1.5 }}
                    >
                      {m.meta.join(" · ")}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
