// Editorial section masthead — three-column hairline-bordered row.
// Use at the top of every section so the whole site feels like one issue.

export function SectionMast({
  number,
  label,
  meta,
}: {
  number: string;
  label: string;
  meta?: string;
}) {
  return (
    <div className="relative w-full">
      <div
        className="border-t"
        style={{ borderColor: "var(--color-fg)", borderTopWidth: 2 }}
      />
      <div className="grid grid-cols-3 items-baseline px-6 py-3 md:px-10 lg:px-16">
        <p
          className="font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          § {number}
        </p>
        <p
          className="text-center font-serif tracking-[0.32em]"
          style={{ color: "var(--color-fg)", fontSize: 12 }}
        >
          {label.toUpperCase()}
        </p>
        <p
          className="text-right font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          {meta ?? ""}
        </p>
      </div>
      <div
        className="border-b"
        style={{ borderColor: "var(--color-fg)", borderBottomWidth: 1 }}
      />
    </div>
  );
}
