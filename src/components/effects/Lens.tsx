"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

export function Lens({
  children,
  zoom = 1.45,
  size = 200,
  className,
}: {
  children: ReactNode;
  zoom?: number;
  size?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };
  const onLeave = () => setPos((p) => ({ ...p, active: false }));

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden ${className ?? ""}`}
    >
      {children}
      {pos.active && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-30 rounded-full border border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.45)]"
          style={{
            width: size,
            height: size,
            left: pos.x - size / 2,
            top: pos.y - size / 2,
            backgroundImage: "inherit",
            backdropFilter: "blur(0px)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage: "var(--lens-bg)",
              backgroundPosition: `${-pos.x * zoom + size / 2}px ${-pos.y * zoom + size / 2}px`,
              backgroundSize: `${(ref.current?.clientWidth ?? 0) * zoom}px auto`,
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>
      )}
    </div>
  );
}
