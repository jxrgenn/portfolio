"use client";

// Layered animated gradient ribbons — Aurora effect with vivid cyan/violet/pink.
// Three stacked layers move at different angles + speeds, blurred,
// with a subtle vignette so they fade into the dark base.

export function Aurora({
  className,
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {/* Cyan/violet flowing layer */}
      <div
        className="absolute -inset-[20%] animate-aurora blur-[70px] will-change-[background-position]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(110deg, rgba(34,211,238,0.85) 0%, rgba(34,211,238,0) 8%, rgba(167,139,250,0.85) 16%, rgba(167,139,250,0) 28%, rgba(34,211,238,0.7) 38%, rgba(34,211,238,0) 50%, rgba(167,139,250,0.65) 60%)",
          backgroundSize: "200% 200%",
          opacity: 0.6 * intensity,
          maskImage:
            "radial-gradient(ellipse at 30% 30%, black 25%, transparent 75%)",
        }}
      />
      {/* Pink counter-flow */}
      <div
        className="absolute -inset-[20%] animate-aurora blur-[80px] will-change-[background-position]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(60deg, rgba(244,114,182,0.7) 0%, rgba(244,114,182,0) 12%, rgba(34,211,238,0.6) 24%, rgba(34,211,238,0) 38%, rgba(167,139,250,0.55) 50%, rgba(167,139,250,0) 62%)",
          backgroundSize: "230% 230%",
          animationDirection: "reverse",
          animationDuration: "30s",
          opacity: 0.5 * intensity,
          mixBlendMode: "screen",
          maskImage:
            "radial-gradient(ellipse at 70% 60%, black 25%, transparent 75%)",
        }}
      />
      {/* Slow drifting glow base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 800px 500px at 25% 25%, rgba(34,211,238,0.18) 0%, transparent 60%), radial-gradient(ellipse 700px 400px at 75% 50%, rgba(167,139,250,0.18) 0%, transparent 60%)",
          opacity: intensity,
        }}
      />
      {/* Vignette + bottom fade so content reads cleanly */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(3,7,11,0.0) 0%, rgba(3,7,11,0.35) 55%, rgba(3,7,11,0.92) 100%)",
        }}
      />
    </div>
  );
}
