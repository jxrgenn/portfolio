// Subtle paper grain — fixed, full-bleed, multiply-blended.
export function PaperGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] mix-blend-multiply"
      style={{
        backgroundImage:
          "radial-gradient(rgba(0,0,0,0.7) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.4) 1px, transparent 1px)",
        backgroundSize: "3px 3px, 5px 5px",
        backgroundPosition: "0 0, 1px 2px",
      }}
    />
  );
}
