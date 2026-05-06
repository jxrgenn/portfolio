"use client";

export function BorderBeam({
  size = 200,
  duration = 12,
  delay = 0,
  colorFrom = "#22d3ee",
  colorTo = "#a78bfa",
}: {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] [mask:linear-gradient(transparent,transparent),linear-gradient(black,black)] [mask-clip:padding-box,border-box] [mask-composite:intersect]"
      style={{
        border: "1px solid transparent",
      }}
    >
      <div
        className="absolute aspect-square"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          animation: `border-beam ${duration}s linear ${delay}s infinite`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
          opacity: 0.7,
          filter: "blur(0.5px)",
        }}
      />
    </div>
  );
}
