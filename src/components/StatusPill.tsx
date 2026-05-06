import type { ProjectStatus } from "@/lib/projects";

const labels: Record<ProjectStatus, string> = {
  shipped: "shipped",
  "in-progress": "in progress",
  prototype: "prototype",
};

const colors: Record<ProjectStatus, string> = {
  shipped: "text-[var(--color-success)]",
  "in-progress": "text-[var(--color-warning)]",
  prototype: "text-[var(--color-fg-muted)]",
};

export function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-2 py-0.5 font-mono text-xs ${colors[status]}`}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-current opacity-80"
      />
      {labels[status]}
    </span>
  );
}
