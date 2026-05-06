"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor — small dot that grows into a circle on interactive elements.
 * Replaces native cursor (cursor:none on html). On non-pointer devices, hidden.
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 38, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 38, mass: 0.4 });
  const [hovering, setHovering] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const matchPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(matchPointer.matches);
    const onChange = () => setEnabled(matchPointer.matches);
    matchPointer.addEventListener("change", onChange);
    return () => matchPointer.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        "a, button, [data-cursor='pointer'], [data-cursor-text]",
      ) as HTMLElement | null;
      if (interactive) {
        setHovering(true);
        const t = interactive.getAttribute("data-cursor-text");
        setText(t);
      } else {
        setHovering(false);
        setText(null);
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: hovering ? (text ? 80 : 56) : 28,
            height: hovering ? (text ? 80 : 56) : 28,
            borderWidth: hovering ? 1 : 1,
            backgroundColor: hovering
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.0)",
          }}
          transition={{ duration: 0.28, ease: [0.2, 0.6, 0.2, 1] }}
          className="flex items-center justify-center rounded-full"
          style={{
            borderColor: "white",
            borderStyle: "solid",
          }}
        >
          {text && (
            <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-white">
              {text}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: hovering ? 0 : 4,
            height: hovering ? 0 : 4,
            opacity: hovering ? 0 : 1,
          }}
          transition={{ duration: 0.18 }}
          className="rounded-full bg-white"
        />
      </motion.div>
    </>
  );
}
