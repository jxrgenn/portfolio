type Groups = {
  Frontend?: readonly string[];
  Backend?: readonly string[];
  Data?: readonly string[];
  AI?: readonly string[];
  Infra?: readonly string[];
  Other?: readonly string[];
};

const order: (keyof Groups)[] = ["Frontend", "Backend", "Data", "AI", "Infra", "Other"];

export function StackChipGroup({ groups }: { groups: Groups }) {
  const entries = order
    .filter((key) => groups[key] && groups[key]!.length > 0)
    .map((key) => [key, groups[key]!] as const);

  return (
    <div className="space-y-6">
      {entries.map(([label, items]) => (
        <div key={label}>
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            {label}
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {items.map((chip) => (
              <li
                key={chip}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-1 font-mono text-xs text-[var(--color-fg-muted)]"
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
