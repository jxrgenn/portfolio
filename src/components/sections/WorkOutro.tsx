"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function WorkOutro() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-outro-line]", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative flex min-h-[60svh] w-full items-center justify-center overflow-hidden bg-[#070612] px-6 py-24 md:px-10 lg:px-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 60%, rgba(160, 110, 255, 0.10), transparent 70%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p
          data-outro-line
          className="font-mono text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Two years · solo
        </p>
        <p
          data-outro-line
          className="mt-6 font-sans text-white"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(1.75rem, 4.4vw, 3.2rem)",
            fontWeight: 500,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
          }}
        >
          2024 → 2026 · eight shipped · still going.
        </p>
        <p
          data-outro-line
          className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed md:text-lg"
          style={{ color: "rgba(255,255,255,0.62)", fontWeight: 300 }}
        >
          Freelance from Tirana, then Kiel. Studied software engineering at Epoka. Now full-stack
          + AI-native, end to end.
        </p>
      </div>
    </section>
  );
}
