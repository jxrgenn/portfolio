"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let bindTimer: number | null = null;
    let onPointerMove: ((e: PointerEvent) => void) | null = null;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.7 })
        .from("[data-hero-char]", {
          y: "110%",
          opacity: 0,
          stagger: 0.025,
          duration: 1.0,
          ease: "power4.out",
        }, "<0.1")
        .from(subRef.current, { opacity: 0, y: 16, duration: 0.9 }, "<0.5")
        .from(ctaRef.current, { opacity: 0, y: 16, duration: 0.9 }, "<0.1");

      const axes = { soft: 100, wonk: 1 };
      const applyAxes = () => {
        if (headlineRef.current) {
          headlineRef.current.style.fontVariationSettings = `"opsz" 144, "SOFT" ${axes.soft.toFixed(2)}, "WONK" ${axes.wonk.toFixed(3)}`;
        }
      };
      applyAxes();
      gsap.to(axes, {
        soft: 0,
        wonk: 0,
        duration: 1.8,
        delay: 0.3,
        ease: "power3.out",
        onUpdate: applyAxes,
      });

      onPointerMove = (e: PointerEvent) => {
        if (!headlineRef.current) return;
        const rect = headlineRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const d = Math.min(1, Math.hypot(dx, dy));
        const proximity = 1 - d;
        const soft = Math.max(0, proximity * 28);
        const wonk = Math.max(0, proximity * 0.18);
        headlineRef.current.style.fontVariationSettings = `"opsz" 144, "SOFT" ${soft.toFixed(2)}, "WONK" ${wonk.toFixed(3)}`;
      };
      bindTimer = window.setTimeout(() => {
        if (onPointerMove) {
          window.addEventListener("pointermove", onPointerMove, { passive: true });
        }
      }, 2200);

      gsap.to("[data-hero-headline]", {
        yPercent: -22,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to("[data-hero-scroll-cue]", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "20% top",
          scrub: 0.4,
        },
      });
    }, sectionRef);

    return () => {
      if (bindTimer !== null) window.clearTimeout(bindTimer);
      if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-end overflow-hidden px-6 pt-32 pb-16 md:px-10 lg:px-16"
    >
      {/* Scroll cue — bottom-right, fades out as soon as the user scrolls */}
      <div
        data-hero-scroll-cue
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-10 z-10 hidden flex-col items-center gap-2 md:flex"
        style={{ color: "var(--color-fg-muted)" }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.32em]">scroll</span>
        <span
          className="block h-10 w-px"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-fg-muted), transparent)",
            animation: "float-y 3s ease-in-out infinite",
          }}
        />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <p
          data-hero-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.24em]"
          style={{ color: "var(--color-fg-muted)" }}
        >
          <span
            className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full"
            style={{
              background: "var(--color-success)",
              boxShadow: "0 0 10px var(--color-success)",
            }}
            aria-hidden
          />
          Kiel, Germany / Available 2026
        </p>

        <h1
          ref={headlineRef}
          data-hero-headline
          className="mt-8 font-serif"
          style={{
            color: "var(--color-fg)",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(4rem, 16vw, 14rem)",
            lineHeight: 0.86,
            letterSpacing: "-0.05em",
            fontWeight: 400,
            fontVariationSettings: '"opsz" 144, "SOFT" 100, "WONK" 1',
            textShadow: "0 2px 40px rgba(0,0,0,0.4)",
          }}
        >
          <span className="block overflow-hidden">
            {"Jurgen".split("").map((c, i) => (
              <span key={i} data-hero-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
          <span
            className="block overflow-hidden"
            style={{ fontStyle: "italic", fontWeight: 300 }}
          >
            {"Halili.".split("").map((c, i) => (
              <span key={i} data-hero-char className="inline-block">
                {c}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-12 grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_auto] md:gap-16">
          <div ref={subRef}>
            <p
              className="max-w-xl font-sans text-base leading-relaxed md:text-lg"
              style={{ color: "var(--color-fg)", fontWeight: 300, opacity: 0.85 }}
            >
              Solo full-stack engineer. AI-native products + Microsoft Business
              Central / NAV migrations, end-to-end — from agent runtime to React
              frontend to Postgres to deploy. Originally Tirana, currently Kiel.
            </p>
            <ul
              className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--color-fg-muted)" }}
            >
              <li>
                <span style={{ color: "var(--color-fg)" }}>8</span> shipped
              </li>
              <li aria-hidden style={{ color: "var(--color-accent)" }}>·</li>
              <li>
                <span style={{ color: "var(--color-fg)" }}>2</span> tracks
              </li>
              <li aria-hidden style={{ color: "var(--color-accent)" }}>·</li>
              <li>
                <span style={{ color: "var(--color-fg)" }}>2024 → 2026</span>
              </li>
              <li aria-hidden style={{ color: "var(--color-accent)" }}>·</li>
              <li>solo</li>
            </ul>
          </div>

          <div ref={ctaRef} className="flex items-center gap-6">
            <MagneticCTA href="#work">Selected work</MagneticCTA>
            <a
              href="mailto:jurgenhalili1142@gmail.com"
              data-cursor-text="Email"
              className="font-sans text-sm transition-colors"
              style={{
                color: "var(--color-fg)",
                textDecoration: "underline",
                textUnderlineOffset: 6,
                textDecorationColor: "var(--color-accent)",
              }}
            >
              say hi →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function MagneticCTA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      <Link
        href={href}
        data-cursor-text="View"
        className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-sans text-sm font-medium"
        style={{
          background: "var(--color-fg)",
          color: "var(--color-bg)",
        }}
      >
        {children}
        <span aria-hidden>↓</span>
      </Link>
    </motion.div>
  );
}
