/**
 * Slowly drifting amber glow + film grain — adds depth on the black backdrop.
 */
export function AmbientBackground() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 18% 8%, color-mix(in oklch, var(--color-accent) 14%, transparent) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 90% 80%, color-mix(in oklch, var(--color-accent) 9%, transparent) 0%, transparent 60%)",
          backgroundSize: "180% 180%, 180% 180%",
          animation: "ambient-drift 38s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </>
  );
}
