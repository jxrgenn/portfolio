"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { CarouselScene } from "@/components/scene/CarouselScene";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SelectedWorkFallback = dynamic(
  () => import("./SelectedWork").then((m) => m.SelectedWork),
  { ssr: false },
);

const MobileCarousel = dynamic(
  () => import("./MobileCarousel").then((m) => m.MobileCarousel),
  { ssr: false },
);

// All projects, in order. CarouselScene also reads from projects.ts so the
// two stay in lockstep — any new project automatically gets a panel.
const FEATURED = projects;

const TOTAL = FEATURED.length;
const TX = String(TOTAL).padStart(2, "0");
// Section height scales with project count so each panel still gets ~80vh
// of scroll travel even as the list grows.
const SECTION_HEIGHT_VH = TOTAL * 80;

// Direction-aware metadata variants. dir = 1 forward, -1 backward.
// Forward: new enters from below, old exits up. Backward: flipped.
const CAROUSEL_META_VARIANTS = {
  enter: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? 14 : -14,
  }),
  center: { opacity: 1, y: 0 },
  exit: (dir: number) => ({
    opacity: 0,
    y: dir > 0 ? -10 : 10,
  }),
};

export function ProjectCarousel3D() {
  const [mode, setMode] = useState<
    "loading" | "carousel" | "mobile" | "reduce"
  >("loading");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const detect = () => {
      const reduce = reduceQuery.matches;
      const small = window.innerWidth < 768;
      setMode((prev) => {
        const next = reduce ? "reduce" : small ? "mobile" : "carousel";
        return prev === next ? prev : next;
      });
    };

    detect();

    // Re-detect on viewport / motion-preference change. resize is throttled
    // to one rAF so dragging the window doesn't fire detect() per pixel.
    let raf: number | null = null;
    const onResize = () => {
      if (raf !== null) return;
      raf = window.requestAnimationFrame(() => {
        detect();
        raf = null;
      });
    };
    reduceQuery.addEventListener("change", detect);
    window.addEventListener("resize", onResize);

    return () => {
      if (raf !== null) window.cancelAnimationFrame(raf);
      reduceQuery.removeEventListener("change", detect);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (mode === "reduce") return <SelectedWorkFallback />;
  if (mode === "mobile") return <MobileCarousel />;
  if (mode === "loading") {
    return <div id="work" style={{ minHeight: "100svh" }} aria-hidden />;
  }
  return <Carousel />;
}

function Carousel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  // Latest scroll direction (1 forward, -1 backward) — kept in a ref so
  // ScrollTrigger.onUpdate can write it every frame without re-rendering.
  const dirRef = useRef<1 | -1>(1);
  // Single state captured ATOMICALLY at the moment activeIndex changes — so
  // AnimatePresence sees `dir` and `index` in the same render pass.
  const [activeState, setActiveState] = useState<{
    index: number;
    dir: 1 | -1;
  }>({ index: 0, dir: 1 });
  const activeIndex = activeState.index;
  const activeDir = activeState.dir;
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.15,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        if (self.direction === 1 || self.direction === -1) {
          dirRef.current = self.direction;
        }
        const idx = Math.min(
          TOTAL - 1,
          Math.max(0, Math.round(self.progress * (TOTAL - 1))),
        );
        setActiveState((prev) =>
          prev.index === idx ? prev : { index: idx, dir: dirRef.current },
        );
      },
      onToggle: (self) => setActive(self.isActive),
    });

    // Canvas defaults to opacity 1 (set inline above). Was previously a
    // ScrollTrigger-driven fade-in starting at 0 — that trigger was racy on
    // mount (Lenis + ScrollTrigger timing) and left the panels permanently
    // invisible if the user scrolled past "top 50%" before it initialized.
    // No fade-in needed: the section is sticky, scroll naturally drives the
    // panel transitions; the section's bg already matches the page below it.
    return () => {
      trigger.kill();
    };
  }, []);

  const active_ = FEATURED[activeIndex];
  const ix = String(activeIndex + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="work"
      data-accent={active_.slug}
      className="relative bg-[#070612]"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
    >
      {/* Backwards-compat anchors so /#work-keepitup etc. still work */}
      {FEATURED.map((p) => (
        <span
          key={p.slug}
          id={`work-${p.slug}`}
          aria-hidden
          className="block"
          style={{ height: 0, scrollMarginTop: "0px" }}
        />
      ))}

      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Project-accent halo — radial glow that picks up the active project's
         * accent color, sitting behind the focal panel zone (right-of-center).
         * Cross-fades with section data-accent variable. */}
        <div
          aria-hidden
          key={active_.slug}
          className="pointer-events-none absolute inset-0 z-[1] animate-[fadeInHalo_900ms_ease-out]"
          style={{
            background:
              "radial-gradient(40% 55% at 68% 52%, var(--project-accent), transparent 65%)",
            opacity: 0.32,
            mixBlendMode: "screen",
          }}
        />
        {/* Left scrim — keeps text overlay legible against bleeding flank panels */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[5] hidden md:block"
          style={{
            width: "46%",
            background:
              "linear-gradient(to right, rgba(7,6,18,0.86) 0%, rgba(7,6,18,0.62) 38%, rgba(7,6,18,0.18) 78%, transparent 100%)",
          }}
        />
        <div
          ref={canvasWrapRef}
          className="absolute inset-0"
          style={{ opacity: 1, willChange: "opacity" }}
        >
          <Canvas
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            frameloop="always"
            camera={{ position: [0, 0, 5.2], fov: 32 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <CarouselScene progressRef={progressRef} />
          </Canvas>
        </div>

        {/* Top eyebrow + scrub indicator */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-start justify-between px-6 pt-10 md:px-12 md:pt-14 lg:px-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/70">
            <span style={{ color: "var(--project-accent, #fff)" }}>{ix}</span>
            &nbsp;/&nbsp; Selected work · {ix} of {TX}
          </p>
          <div className="flex items-center gap-2">
            {FEATURED.map((p, i) => (
              <span
                key={p.slug}
                aria-hidden
                className="block transition-all duration-300"
                style={{
                  width: i === activeIndex ? 22 : 6,
                  height: 4,
                  borderRadius: 9999,
                  background:
                    i === activeIndex
                      ? "var(--project-accent, #fff)"
                      : "rgba(255,255,255,0.30)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Project metadata overlay (left rail) */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-6 md:px-12 lg:px-20">
          <div className="pointer-events-auto w-full max-w-sm">
            <AnimatePresence mode="wait" custom={activeDir}>
              <motion.div
                key={active_.slug}
                custom={activeDir}
                variants={CAROUSEL_META_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.36, ease: [0.2, 0.6, 0.2, 1] }}
              >
                <h2
                  className="font-sans text-white"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(2.4rem, 5.6vw, 4.6rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.035em",
                    lineHeight: 1.0,
                  }}
                >
                  {active_.title}.
                </h2>

                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.22em]">
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>
                    {active_.year}
                  </span>
                  <span aria-hidden style={{ color: "var(--project-accent, #fff)" }}>
                    ·
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{ color: "rgba(255,255,255,0.70)" }}
                  >
                    <span
                      aria-hidden
                      className="block h-1.5 w-1.5 rounded-full"
                      style={{
                        background:
                          active_.status === "shipped"
                            ? "#67d99b"
                            : active_.status === "in-progress"
                            ? "#facc54"
                            : "#a9a4ff",
                        boxShadow:
                          active_.status === "shipped"
                            ? "0 0 8px rgba(103,217,155,0.5)"
                            : active_.status === "in-progress"
                            ? "0 0 8px rgba(250,204,84,0.5)"
                            : "0 0 8px rgba(169,164,255,0.5)",
                      }}
                    />
                    {active_.status.replace("-", " ")}
                  </span>
                </p>

                <p
                  className="mt-6 font-serif"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    color: "rgba(255,255,255,0.94)",
                    fontStyle: "italic",
                    fontWeight: 300,
                    fontSize: "clamp(1.25rem, 1.95vw, 1.65rem)",
                    lineHeight: 1.22,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {active_.tagline}
                </p>

                <div
                  className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {active_.stack.slice(0, 6).map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>

                <Link
                  href={`/projects/${active_.slug}`}
                  data-cursor-text="Open"
                  className="group mt-7 inline-flex items-center gap-2 font-sans text-sm text-white"
                  style={{
                    paddingBottom: 4,
                    borderBottom: "1px solid rgba(255,255,255,0.50)",
                  }}
                >
                  See the build
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                    style={{ color: "var(--project-accent, #fff)" }}
                  >
                    →
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom scroll hint, fades after first project */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500"
          style={{
            opacity: activeIndex === 0 ? 0.62 : 0,
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/70">
            Scroll
          </p>
        </div>
      </div>
    </section>
  );
}
