"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect } from "react";

/**
 * A faint warm spotlight that follows the pointer.
 * Uses multiply blend on the cream theme — gently deepens shadows beneath the
 * cursor rather than glowing on top.
 */
export function CursorSpotlight() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 150, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 150, damping: 22, mass: 0.4 });

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, [x, y]);

  const background = useMotionTemplate`radial-gradient(380px circle at ${sx}px ${sy}px, color-mix(in oklch, var(--color-accent) 22%, transparent), transparent 70%)`;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1] opacity-60"
      style={{
        background,
        mixBlendMode: "multiply",
      }}
    />
  );
}
