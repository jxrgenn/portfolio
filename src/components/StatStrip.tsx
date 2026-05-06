export function StatStrip({
  stats,
}: {
  stats: readonly { value: string; label: string }[];
}) {
  return (
    <ul className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <li key={stat.label}>
          <p className="font-mono text-2xl text-[var(--color-fg)]">
            {stat.value}
          </p>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {stat.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
