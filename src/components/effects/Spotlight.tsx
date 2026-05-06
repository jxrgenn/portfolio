"use client";

import { useEffect, useRef } from "react";

export function Spotlight({
  className,
  size = 600,
  color = "rgba(34, 211, 238, 0.18)",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={{
        background: `radial-gradient(${size}px circle at var(--mx, 50%) var(--my, 30%), ${color}, transparent 70%)`,
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
      }}
    />
  );
}
