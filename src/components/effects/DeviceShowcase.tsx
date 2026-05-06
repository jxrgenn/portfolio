"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type DeviceShowcaseProps = {
  desktopSrc: string;
  desktopAlt: string;
  mobileSrc: string;
  mobileAlt: string;
  /** Bottom strip URL pill (e.g. "gymapp.al/admin"). Optional. */
  url?: string;
  accent?: string;
};

/**
 * Two-device product mock — clean browser-window frame on the left and a
 * pre-mocked phone screenshot on the right. No fake hardware chrome, no
 * keyboard, no trackpad. Scroll drives a subtle parallax: browser drifts
 * up, phone drifts down, they meet as you pass through.
 */
export function DeviceShowcase({
  desktopSrc,
  desktopAlt,
  mobileSrc,
  mobileAlt,
  url,
  accent = "#84cc16",
}: DeviceShowcaseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const browserY = useTransform(scrollYProgress, [0, 1], [60, -80]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [-40, 90]);
  const browserRotate = useTransform(scrollYProgress, [0, 1], [-1.2, 1.2]);
  const phoneRotate = useTransform(scrollYProgress, [0, 1], [4, -2]);

  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-[1320px] px-4"
      style={{ perspective: "1600px" }}
    >
      {/* Floor accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%]"
        style={{
          background: `radial-gradient(ellipse 70% 100% at 50% 100%, ${accent}33 0%, transparent 70%)`,
        }}
      />

      <div className="relative grid grid-cols-12 items-end gap-4 md:gap-6">
        {/* Browser frame */}
        <motion.div
          className="relative col-span-12 md:col-span-9"
          style={{ y: browserY, rotate: browserRotate, transformStyle: "preserve-3d" }}
        >
          <div
            className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_60px_140px_-30px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)]"
            style={{ background: "#0b0f15" }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#0a0d12] px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-full bg-[#fb7185]" />
                <span className="size-3 rounded-full bg-[#fbbf24]" />
                <span className="size-3 rounded-full bg-[#34d399]" />
              </div>
              {url ? (
                <div className="ml-3 flex h-7 flex-1 max-w-md items-center justify-center rounded-md bg-white/[0.04] px-3 font-mono text-[11px] tracking-wide text-[var(--color-fg-subtle)]">
                  {url}
                </div>
              ) : (
                <div className="ml-3 h-7 flex-1 max-w-md rounded-md bg-white/[0.04]" />
              )}
              <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)] md:inline">
                desktop · admin
              </span>
            </div>
            {/* Screenshot — fixed aspect to keep proportions stable */}
            <div className="relative aspect-[16/10] w-full bg-[#050810]">
              <Image
                src={desktopSrc}
                alt={desktopAlt}
                fill
                sizes="(min-width: 768px) 75vw, 100vw"
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
          {/* Reflective floor sliver */}
          <div
            aria-hidden
            className="pointer-events-none mx-auto mt-1 h-6 w-[88%] rounded-full opacity-50 blur-2xl"
            style={{ background: `${accent}55` }}
          />
        </motion.div>

        {/* Phone — pre-mocked image already has the phone shape */}
        <motion.div
          className="relative col-span-12 -mt-32 self-end md:col-span-3 md:-ml-16 md:mt-0"
          style={{ y: phoneY, rotate: phoneRotate, transformStyle: "preserve-3d" }}
        >
          <div
            className="relative mx-auto w-full max-w-[260px] drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
            style={{ aspectRatio: "9/19" }}
          >
            <Image
              src={mobileSrc}
              alt={mobileAlt}
              fill
              sizes="260px"
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
