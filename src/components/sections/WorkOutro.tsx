"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      el.textContent = value;
      return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    el.textContent = `0${suffix}`;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);
  return <span ref={ref}>{value}</span>;
}

const SHIPPED = [
  "KeepItUp",
  "GymApp",
  "Pilates Studio",
  "CleanSlate",
  "Ëndërrat e Mia",
  "Social Command Center",
  "jiang-clips",
  "Kërçishta Garage",
];

const STATS = [
  { value: "8", label: "shipped" },
  { value: "2", label: "tracks" },
  { value: "1", label: "person" },
  { value: "100%", label: "solo" },
];

export function WorkOutro() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-outro-line]", {
        opacity: 0,
        y: 22,
        stagger: 0.09,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.from("[data-outro-stat]", {
        opacity: 0,
        y: 16,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Duplicate the marquee items so the loop appears seamless.
  const marquee = [...SHIPPED, ...SHIPPED];

  return (
    <section
      ref={wrapRef}
      className="relative flex min-h-[70svh] w-full flex-col justify-center overflow-hidden bg-[#070612] px-6 py-24 md:px-10 lg:px-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 50%, rgba(170, 130, 255, 0.12), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <p
          data-outro-line
          className="font-mono text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          2024 → 2026 · solo
        </p>
        <h2
          data-outro-line
          className="mt-7 font-sans text-white"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2rem, 5vw, 3.6rem)",
            fontWeight: 500,
            letterSpacing: "-0.030em",
            lineHeight: 1.05,
          }}
        >
          Eight shipped. Still going.
        </h2>
        <p
          data-outro-line
          className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed md:text-lg"
          style={{ color: "rgba(255,255,255,0.62)", fontWeight: 300 }}
        >
          Freelance from Tirana, then Kiel. Studied software engineering at Epoka.
          Two tracks: AI-native products and Microsoft Business Central / NAV — end to end.
        </p>

        {/* Stat strip */}
        <dl
          className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            padding: "1.75rem 0",
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} data-outro-stat className="text-center">
              <dt
                className="font-mono text-[10px] uppercase tracking-[0.24em]"
                style={{ color: "rgba(255,255,255,0.50)" }}
              >
                {s.label}
              </dt>
              <dd
                className="mt-2 font-sans tabular-nums text-white"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                <StatValue value={s.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Project-name marquee — full-bleed, slow drift */}
      <div
        aria-hidden
        className="pointer-events-none relative z-10 mt-14 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 60s linear infinite" }}
        >
          {marquee.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="mx-10 font-sans"
              style={{
                color: "rgba(255,255,255,0.18)",
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                fontWeight: 500,
                letterSpacing: "-0.025em",
              }}
            >
              {name}
              <span
                aria-hidden
                style={{ color: "rgba(160, 130, 255, 0.50)", marginLeft: "2.5rem" }}
              >
                ·
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
