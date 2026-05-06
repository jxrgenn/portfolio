"use client";

import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import { SectionMast } from "@/components/editorial/SectionMast";

const Workshop3D = dynamic(
  () => import("@/components/editorial/Workshop3D").then((m) => m.Workshop3D),
  { ssr: false },
);

/**
 * The Workshop — between Cases and About. A single 3D set-piece.
 * Pinned for ~150vh; camera pans across the desk as user scrolls.
 */
export function WorkshopSection() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      progress.current = v;
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ background: "var(--color-bg)", height: "150vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div style={{ paddingTop: 56 }}>
          <SectionMast number="03b" label="THE WORKSHOP" meta="all nine on one desk" />
        </div>

        <div className="relative flex-1 overflow-hidden">
          {/* The 3D scene fills the section */}
          <Workshop3D progress={progress} className="absolute inset-0" />

          {/* Editorial overlay — kicker + body in lower-left corner */}
          <div className="pointer-events-none absolute inset-x-6 bottom-10 z-10 grid grid-cols-12 gap-6 md:inset-x-10 lg:inset-x-16">
            <div className="col-span-12 md:col-span-5">
              <p
                className="font-serif italic"
                style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
              >
                fig. 03 — the desk, scrolled across
              </p>
              <h2
                className="mt-3 font-serif"
                style={{
                  color: "var(--color-fg)",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  fontWeight: 500,
                }}
              >
                <span style={{ fontStyle: "italic" }}>Two years</span> of work,
                <br />
                spread out.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-5 md:col-start-8">
              <p
                className="font-serif"
                style={{
                  color: "var(--color-fg)",
                  fontSize: 16,
                  lineHeight: 1.55,
                }}
              >
                Each card is a real screenshot from a real production project.
                Five of them, laid out the way they actually live in my head —
                a desk with overlapping concerns, the coffee always to the
                right of the keyboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
