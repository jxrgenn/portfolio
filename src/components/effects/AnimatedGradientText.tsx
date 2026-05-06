"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RotatingGradientText({
  words,
  intervalMs = 2200,
  className,
}: {
  words: readonly string[];
  intervalMs?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, words.length]);

  return (
    <span className={`relative inline-block align-baseline ${className ?? ""}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[i]}
          initial={{ y: 12, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -12, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: [0.2, 0.6, 0.2, 1] }}
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6, #22d3ee)",
            backgroundSize: "300% 100%",
            animation: "shimmer 5s linear infinite",
          }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
