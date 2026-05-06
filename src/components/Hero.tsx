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

  useEffect(() => {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh items-end overflow-hidden px-6 pt-32 pb-16 md:px-10 lg:px-16"
    >
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
          data-hero-headline
          className="mt-8 font-serif"
          style={{
            color: "var(--color-fg)",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(4rem, 16vw, 14rem)",
            lineHeight: 0.86,
            letterSpacing: "-0.05em",
            fontWeight: 400,
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
          <p
            ref={subRef}
            className="max-w-xl font-sans text-base leading-relaxed md:text-lg"
            style={{ color: "var(--color-fg)", fontWeight: 300, opacity: 0.85 }}
          >
            Solo full-stack engineer. AI-native products + Microsoft Business
            Central / NAV migrations, end-to-end — from agent runtime to React
            frontend to Postgres to deploy. Originally Tirana, currently Kiel.
          </p>

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
