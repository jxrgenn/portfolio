// Rotated red rubber-stamp mark — SHIPPED / IN PROGRESS / PROTOTYPE.

const LABELS: Record<string, string> = {
  shipped: "SHIPPED",
  "in-progress": "IN PROGRESS",
  prototype: "PROTOTYPE",
};

const ROT: Record<string, number> = {
  shipped: -8,
  "in-progress": 6,
  prototype: -3,
};

export function Stamp({ status }: { status: string }) {
  const label = LABELS[status] ?? status.toUpperCase();
  const rotate = ROT[status] ?? -4;
  return (
    <div
      className="relative inline-block font-serif"
      style={{
        transform: `rotate(${rotate}deg)`,
        border: "2px solid var(--color-accent)",
        color: "var(--color-accent)",
        padding: "8px 14px",
        fontWeight: 600,
        letterSpacing: "0.18em",
        fontSize: 12,
        opacity: 0.85,
      }}
    >
      {label}
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          border: "1px solid var(--color-accent)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}
