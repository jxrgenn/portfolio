"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = [
  "rgba(34, 211, 238, 0.14)",
  "rgba(167, 139, 250, 0.14)",
  "rgba(244, 114, 182, 0.14)",
  "rgba(132, 204, 22, 0.14)",
  "rgba(251, 191, 36, 0.14)",
  "rgba(251, 113, 133, 0.14)",
];

type Box = { row: number; col: number; color: string; delay: number };

export function BackgroundBoxes({
  rows = 12,
  cols = 18,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  // Generate randomized boxes after mount so SSR + client hydration agree.
  const [boxes, setBoxes] = useState<Box[]>([]);
  useEffect(() => {
    const arr: Box[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() > 0.18) continue;
        arr.push({
          row: r,
          col: c,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          delay: Math.random() * 6,
        });
      }
    }
    setBoxes(arr);
  }, [rows, cols]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] ${className ?? ""}`}
    >
      <div
        className="grid h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            className="border border-white/[0.04]"
          />
        ))}
      </div>
      {boxes.map((b, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${(b.row / rows) * 100}%`,
            left: `${(b.col / cols) * 100}%`,
            width: `${100 / cols}%`,
            height: `${100 / rows}%`,
            background: b.color,
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            delay: b.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
