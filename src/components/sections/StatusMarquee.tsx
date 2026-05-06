"use client";

const FACTS = [
  "tree-sitter ast",
  "rls-strict postgres",
  "multi-llm pipelines",
  "bullmq orchestration",
  "socket.io live state",
  "6 deploy targets",
  "microsoft bc / nav",
  "tirana, albania",
  "available for work",
];

export function StatusMarquee() {
  return (
    <section
      aria-hidden
      className="relative isolate overflow-hidden border-y py-5"
      style={{
        borderColor: "var(--color-border)",
        background: "color-mix(in oklch, var(--color-bg) 92%, transparent)",
      }}
    >
      <div className="flex w-max animate-marquee-x gap-12 whitespace-nowrap">
        {[...FACTS, ...FACTS, ...FACTS].map((fact, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em]"
            style={{ color: "var(--color-fg-muted)" }}
          >
            <span
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--color-accent)",
                boxShadow: "0 0 10px var(--color-accent)",
              }}
            />
            {fact}
          </span>
        ))}
      </div>
    </section>
  );
}
