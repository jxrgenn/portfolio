"use client";

import { useId, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import DottedMap from "dotted-map";

type Point = { lat: number; lng: number; label?: string };

export function WorldMap({
  dots = [],
  lineColor = "#22d3ee",
  pinColor = "#22d3ee",
}: {
  dots?: { start: Point; end: Point }[];
  lineColor?: string;
  pinColor?: string;
}) {
  const reactId = useId();
  const safeId = reactId.replace(/:/g, "");

  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: "#FFFFFF40",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, []);

  function projectPoint(lat: number, lng: number) {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  }

  function curvedPath(
    a: { x: number; y: number },
    b: { x: number; y: number },
  ) {
    const midX = (a.x + b.x) / 2;
    const midY = Math.min(a.y, b.y) - 50;
    return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
  }

  return (
    <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/30 backdrop-blur-sm">
      <Image
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        alt="World map showing dots for land masses"
        width={1056}
        height={528}
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        draggable={false}
        priority={false}
      />
      <svg
        viewBox="0 0 800 400"
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      >
        <defs>
          {dots.map((_, i) => (
            <linearGradient
              key={`grad-${safeId}-${i}`}
              id={`path-grad-${safeId}-${i}`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="6%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="94%" stopColor={lineColor} stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {dots.map((dot, i) => {
          const a = projectPoint(dot.start.lat, dot.start.lng);
          const b = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <motion.path
              key={`path-${i}`}
              d={curvedPath(a, b)}
              fill="none"
              stroke={`url(#path-grad-${safeId}-${i})`}
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.4 * i,
                ease: "easeOut",
              }}
            />
          );
        })}

        {dots.map((dot, i) => {
          const a = projectPoint(dot.start.lat, dot.start.lng);
          const b = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`pts-${i}`}>
              <circle cx={a.x} cy={a.y} r="2.5" fill={pinColor} />
              <circle cx={a.x} cy={a.y} r="2.5" fill={pinColor} opacity="0.5">
                <animate
                  attributeName="r"
                  from="2"
                  to="9"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.55"
                  to="0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx={b.x} cy={b.y} r="2" fill={pinColor} />
              <circle cx={b.x} cy={b.y} r="2" fill={pinColor} opacity="0.5">
                <animate
                  attributeName="r"
                  from="1.5"
                  to="6"
                  dur="2.2s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.4"
                  to="0"
                  dur="2.2s"
                  begin={`${i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
