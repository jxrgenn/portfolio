"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

// Photoreal Macbook with full body, keyboard outline, trackpad, hinge.
// Lid opens on scroll; whole assembly drifts up subtly. Optional mobile
// companion screenshot floats next to the laptop.

export function MacbookScroll({
  src,
  alt,
  title,
  caption,
  mobileSrc,
  mobileAlt,
  children,
}: {
  src: string;
  alt: string;
  title: React.ReactNode;
  caption?: React.ReactNode;
  mobileSrc?: string;
  mobileAlt?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 30%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [-22, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 1.02]);
  const translateY = useTransform(scrollYProgress, [0, 1], [40, -10]);
  const phoneX = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const phoneOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 1, 1]);

  return (
    <div
      ref={ref}
      className="relative mx-auto flex w-full max-w-[var(--container-screen)] flex-col items-center px-6 pt-24 pb-12 md:px-10 md:pt-32 lg:px-16"
    >
      {caption ? (
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
          {caption}
        </p>
      ) : null}
      <h2 className="text-balance text-center font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.02] tracking-tight text-[var(--color-fg)]">
        {title}
      </h2>

      <motion.div
        style={{ y: translateY, scale }}
        className="relative mt-12 w-full max-w-5xl"
      >
        <div
          className="relative mx-auto"
          style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
        >
          {/* ============== LAPTOP ============== */}
          <div className="relative mx-auto w-full max-w-4xl">
            {/* Lid */}
            <motion.div
              style={{
                rotateX,
                transformOrigin: "bottom center",
                transformStyle: "preserve-3d",
              }}
              className="relative mx-auto w-full"
            >
              {/* Aluminum lid back-panel + bezel frame */}
              <div
                className="relative overflow-hidden rounded-t-[20px] p-[10px] shadow-[0_30px_120px_-20px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.06)_inset]"
                style={{
                  background:
                    "linear-gradient(180deg, #2a2f37 0%, #1c2026 50%, #14181d 100%)",
                }}
              >
                {/* Inner bezel */}
                <div className="relative overflow-hidden rounded-[10px] bg-black p-[3px]">
                  {/* Camera notch */}
                  <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-3 w-20 -translate-x-1/2 rounded-b-md bg-black" />
                  <div className="pointer-events-none absolute left-1/2 top-1 z-30 size-1 -translate-x-1/2 rounded-full bg-[#202632] ring-1 ring-[#0a0d12]" />

                  {/* Screen */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-black">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 1024px, 100vw"
                      priority
                    />
                    {/* Subtle screen glare */}
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        backgroundImage:
                          "linear-gradient(140deg, rgba(255,255,255,0.07) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.04) 100%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hinge — thin dark strip between lid and base */}
            <div
              aria-hidden
              className="relative mx-auto h-[6px] w-full"
              style={{
                background:
                  "linear-gradient(180deg, #0a0d12 0%, #16191f 40%, #2a2f37 100%)",
              }}
            />

            {/* Base — silver aluminum body with keyboard + trackpad */}
            <div
              className="relative mx-auto w-[calc(100%+40px)] -ml-[20px] rounded-b-[18px] px-8 pt-3 pb-5"
              style={{
                background:
                  "linear-gradient(180deg, #2a2f37 0%, #20242b 30%, #181c22 100%)",
                boxShadow:
                  "0 30px 60px -20px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Keyboard area */}
              <div
                className="relative mx-auto mt-1 mb-3 grid w-full max-w-[88%] gap-[3px] rounded-md bg-[#0a0d12]/60 p-2"
                style={{
                  gridTemplateColumns: "repeat(15, minmax(0, 1fr))",
                  gridTemplateRows: "repeat(5, 14px)",
                }}
                aria-hidden
              >
                {Array.from({ length: 5 * 15 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[2px]"
                    style={{
                      background:
                        "linear-gradient(180deg, #1a1f27 0%, #0e1218 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.4)",
                    }}
                  />
                ))}
              </div>

              {/* Trackpad */}
              <div
                aria-hidden
                className="relative mx-auto mt-2 h-[56px] w-[44%] rounded-md"
                style={{
                  background:
                    "linear-gradient(180deg, #14181d 0%, #0c0f14 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.5)",
                }}
              />

              {/* Bottom edge accent */}
              <div
                aria-hidden
                className="mx-auto mt-3 h-[3px] w-[55%] rounded-md"
                style={{
                  background:
                    "linear-gradient(180deg, #1c2026 0%, #0a0d12 100%)",
                }}
              />
            </div>

            {/* Floor shadow */}
            <div
              aria-hidden
              className="mx-auto mt-2 h-10 w-[80%] rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.7),transparent_70%)] blur-md"
            />
          </div>

          {/* ============== PHONE — peer device next to laptop ==============
              The mobile capture is already a finished phone-on-dark mockup
              (check-workout.png), so we render it directly without adding
              our own bezel — avoids the phone-in-phone double frame issue. */}
          {mobileSrc ? (
            <motion.div
              style={{
                x: phoneX,
                opacity: phoneOpacity,
                filter:
                  "drop-shadow(0 30px 50px rgba(0,0,0,0.7)) drop-shadow(0 0 30px rgba(34,211,238,0.10))",
              }}
              className="pointer-events-none absolute right-[2%] bottom-[-4%] hidden w-[22%] lg:block xl:right-[3%] xl:w-[24%]"
            >
              <Image
                src={mobileSrc}
                alt={mobileAlt ?? alt}
                width={1080}
                height={1920}
                className="h-auto w-full"
                style={{
                  transform: "rotateY(-6deg) rotateZ(-1deg)",
                  transformOrigin: "bottom right",
                }}
                sizes="(min-width: 1280px) 320px, 280px"
              />
            </motion.div>
          ) : null}
        </div>
      </motion.div>

      {children ? <div className="relative mt-16 w-full">{children}</div> : null}
    </div>
  );
}
