"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Tiny red dot following the cursor with spring delay (Rauno-style).
 * Hidden on touch / sub-md viewports.
 */
export function RedCursor() {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setCoords({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block"
      animate={{ x: coords.x - 6, y: coords.y - 6 }}
      transition={{ type: "spring", damping: 28, stiffness: 320, mass: 0.4 }}
    >
      <div
        className="size-3 rounded-full mix-blend-multiply"
        style={{
          background: "var(--color-accent)",
          boxShadow: "0 0 18px color-mix(in oklch, var(--color-accent) 35%, transparent)",
        }}
      />
    </motion.div>
  );
}
