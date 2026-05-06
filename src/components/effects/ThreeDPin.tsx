"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

const MAX_ROT = 14;

export function ThreeDPin({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${-y * MAX_ROT}deg`);
    el.style.setProperty("--ry", `${x * MAX_ROT}deg`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    setHover(false);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`group relative inline-flex items-center justify-center [transform-style:preserve-3d] ${className ?? ""}`}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative inline-flex items-center justify-center transition-transform duration-200"
        style={{
          transform:
            "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0px)",
        }}
      >
        {children}
        {hover && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              boxShadow:
                "0 0 0 1px var(--project-accent), 0 0 32px 0 var(--project-accent)",
              opacity: 0.6,
            }}
          />
        )}
      </div>
    </div>
  );
}
