"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export function TextGenerateEffect({
  text,
  className,
  delay = 0,
  duration = 0.04,
  asWords = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  asWords?: boolean;
}) {
  const tokens = useMemo(
    () => (asWords ? text.split(" ") : text.split("")),
    [text, asWords],
  );
  return (
    <span className={className}>
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            delay: delay + i * duration,
            duration: 0.5,
            ease: [0.2, 0.6, 0.2, 1],
          }}
          className="inline-block"
        >
          {token}
          {asWords && i < tokens.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
