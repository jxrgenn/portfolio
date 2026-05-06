"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";

export function TracingBeam({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 25%", "end 90%"],
  });

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight);
    }
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 0.85], [50, svgHeight]);
  const y2 = useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <div className="absolute -left-4 top-3 md:-left-20">
        <motion.div
          transition={{ duration: 0.2, delay: 0.5 }}
          animate={{
            boxShadow:
              scrollYProgress.get() > 0
                ? "none"
                : "rgba(34, 211, 238, 0.24) 0px 0px 16px 0px",
          }}
          className="ml-[27px] flex size-4 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg)] shadow-sm"
        >
          <div className="size-2 rounded-full border border-[var(--color-fg-subtle)] bg-[var(--project-accent)]" />
        </motion.div>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight}
          className="ml-4 block"
          aria-hidden
        >
          <motion.path
            d={`M 1 0 V ${svgHeight}`}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.25"
            transition={{ duration: 0.1 }}
          />
          <motion.path
            d={`M 1 0 V ${svgHeight}`}
            fill="none"
            stroke="url(#beam-gradient)"
            strokeWidth="1.25"
            transition={{ duration: 0.1 }}
          />
          <defs>
            <motion.linearGradient
              id="beam-gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1}
              y2={y2}
            >
              <stop stopColor="#22d3ee" stopOpacity="0" />
              <stop stopColor="#22d3ee" />
              <stop offset="0.325" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#f472b6" stopOpacity="0" />
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
