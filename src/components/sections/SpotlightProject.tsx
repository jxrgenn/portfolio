"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { SectionMast } from "@/components/editorial/SectionMast";
import { BrowserFrame } from "@/components/editorial/BrowserFrame";
import { PhoneFrame } from "@/components/editorial/PhoneFrame";

const NOTES = [
  {
    num: "01",
    title: "Four deployables, one branding record",
    body: "Express + Postgres API, React + MUI receptionist dashboard, Expo member app that white-labels per gym at runtime, and a node-hid scanner-bridge service for the NFC turnstile.",
  },
  {
    num: "02",
    title: "Live occupancy across PM2 workers",
    body: "Socket.io with a Redis adapter — every cluster member sees the same number on the dashboard the instant a member taps in.",
  },
  {
    num: "03",
    title: "Ad pipeline shares the product code",
    body: "Remotion renders TikTok ads from the same React components used in the app. Marketing creative and product UI never drift.",
  },
] as const;

/**
 * Editorial spotlight — short pin (130vh), horizontal-sliding annotations.
 * Browser+phone are anchored; phone tilts on scroll. Section ends with a
 * clear handoff to the case study.
 */
export function SpotlightProject() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Each note occupies ~33% of the scroll progress, sliding from right to left.
  // Offsets: x slides 100vw → 0 → -100vw across its segment.
  const x1 = useTransform(scrollYProgress, [0.05, 0.22, 0.32, 0.42], [400, 0, 0, -400]);
  const o1 = useTransform(scrollYProgress, [0.05, 0.18, 0.36, 0.44], [0, 1, 1, 0]);
  const x2 = useTransform(scrollYProgress, [0.36, 0.5, 0.6, 0.7], [400, 0, 0, -400]);
  const o2 = useTransform(scrollYProgress, [0.36, 0.46, 0.62, 0.72], [0, 1, 1, 0]);
  const x3 = useTransform(scrollYProgress, [0.66, 0.78, 0.88, 0.98], [400, 0, 0, -400]);
  const o3 = useTransform(scrollYProgress, [0.66, 0.74, 0.92, 1.0], [0, 1, 1, 0.6]);

  // Phone tilts +/- 4 degrees as you scroll the segment.
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [4, -4]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const browserRotateY = useTransform(scrollYProgress, [0, 1], [0, -2]);

  // Devices subtly recede toward the end (handoff cue).
  const deviceScale = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.96]);
  const exitOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  const motions = [
    { x: x1, opacity: o1 },
    { x: x2, opacity: o2 },
    { x: x3, opacity: o3 },
  ];

  return (
    <section
      ref={ref}
      data-accent="gym-app"
      style={{ background: "var(--color-bg-elevated)", height: "130vh" }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col">
        <div style={{ paddingTop: 56 }}>
          <SectionMast number="02" label="SPOTLIGHT — GYMAPP" meta="shipped — 2025" />
        </div>

        <motion.div
          className="relative flex flex-1 items-center px-6 md:px-10 lg:px-16"
          style={{ scale: deviceScale }}
        >
          <div className="grid w-full grid-cols-12 items-center gap-8">
            {/* Annotations — horizontal slide */}
            <div className="relative col-span-12 h-[60vh] overflow-hidden md:col-span-5">
              {NOTES.map((note, i) => (
                <motion.div
                  key={note.num}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{ x: motions[i].x, opacity: motions[i].opacity }}
                >
                  <p
                    className="font-serif italic"
                    style={{
                      color: "var(--color-accent)",
                      fontSize: 14,
                      marginBottom: 8,
                    }}
                  >
                    Note {note.num}
                  </p>
                  <h3
                    className="font-serif"
                    style={{
                      color: "var(--color-fg)",
                      fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {note.title}
                  </h3>
                  <p
                    className="mt-5 font-serif"
                    style={{
                      color: "var(--color-fg-muted)",
                      fontSize: 16,
                      lineHeight: 1.55,
                      maxWidth: "32rem",
                    }}
                  >
                    {note.body}
                  </p>
                  <div
                    className="mt-6 h-[2px] w-12"
                    style={{ background: "var(--color-accent)" }}
                  />
                </motion.div>
              ))}

              {/* Exit handoff — appears as user reaches end of pin */}
              <motion.div
                className="absolute inset-0 flex flex-col justify-center"
                style={{ opacity: exitOpacity }}
              >
                <Link
                  href="/projects/gym-app"
                  className="group inline-flex items-baseline gap-2 self-start font-serif"
                  style={{
                    color: "var(--color-fg)",
                    borderBottom: "2px solid var(--color-fg)",
                    paddingBottom: 4,
                    fontSize: 18,
                  }}
                >
                  Read the full case study
                  <span
                    className="transition-transform group-hover:translate-x-1"
                    style={{ color: "var(--color-accent)" }}
                  >
                    →
                  </span>
                </Link>
                <p
                  className="mt-4 font-serif italic"
                  style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
                >
                  — Case 03 of 09
                </p>
              </motion.div>
            </div>

            {/* Devices */}
            <div className="relative col-span-12 md:col-span-7">
              <div className="grid grid-cols-12 items-end gap-3">
                <motion.div
                  className="col-span-9"
                  style={{ rotateY: browserRotateY }}
                >
                  <BrowserFrame
                    src="/captures/gymapp/dashboard-v2-home.png"
                    alt="GymApp admin dashboard"
                    url="gymapp.al/admin"
                    priority
                  />
                </motion.div>
                <motion.div
                  className="col-span-3 -ml-4 self-center"
                  style={{ rotate: phoneRotate, y: phoneY }}
                >
                  <PhoneFrame
                    src="/captures/gymapp/check-workout.png"
                    alt="GymApp Expo member app"
                    maxWidth={240}
                  />
                </motion.div>
              </div>

              <div className="mt-8 flex items-baseline justify-between">
                <p
                  className="font-serif italic"
                  style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
                >
                  fig. 02 — admin dashboard + Expo member app
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
