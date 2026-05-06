"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Counts up from 0 to `value` once on mount.
// If `value` is non-numeric (like "EN/SQ" or "Full"), renders as-is.
export function NumberTicker({
  value,
  className,
  durationMs = 1200,
}: {
  value: string;
  className?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const numeric = parseFloat(value);
  const isNumber = !isNaN(numeric) && isFinite(numeric);
  const suffix = isNumber ? value.replace(/^[\d.,+-]+/, "") : "";

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, {
    damping: 24,
    stiffness: 70,
    duration: durationMs,
  });

  // Initialize at target so static rendering shows the final number.
  const [display, setDisplay] = useState(
    isNumber ? formatNumber(numeric) : value,
  );

  useEffect(() => {
    if (!isNumber) return;
    motionVal.set(0);
    setDisplay("0");
    const t = setTimeout(() => {
      motionVal.set(numeric);
    }, 100);
    return () => clearTimeout(t);
  }, [isNumber, motionVal, numeric]);

  useEffect(() => {
    if (!isNumber) return;
    const unsubscribe = spring.on("change", (latest) => {
      const isInt = Number.isInteger(numeric);
      setDisplay(
        isInt ? Math.round(latest).toLocaleString() : latest.toFixed(1),
      );
    });
    return unsubscribe;
  }, [spring, isNumber, numeric]);

  return (
    <span ref={ref} className={className}>
      {isNumber ? `${display}${suffix}` : value}
    </span>
  );
}

function formatNumber(n: number): string {
  return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1);
}
