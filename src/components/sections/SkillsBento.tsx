import { MagicCard } from "@/components/effects/MagicCard";

const SKILL_GROUPS = [
  {
    label: "Languages",
    accent: "rgba(34, 211, 238, 0.45)",
    text: "#22d3ee",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C", "AL", "SQL"],
  },
  {
    label: "Frontend",
    accent: "rgba(167, 139, 250, 0.45)",
    text: "#a78bfa",
    items: [
      "Next.js 16",
      "React 19",
      "React Native + Expo",
      "Tailwind 4",
      "shadcn/ui",
      "Three.js",
      "Framer Motion",
    ],
  },
  {
    label: "Backend",
    accent: "rgba(132, 204, 22, 0.45)",
    text: "#a3e635",
    items: [
      "Node.js + Express",
      "Java Spring Boot",
      "Python Flask",
      "Next.js routes",
      "Socket.io",
      "BullMQ",
    ],
  },
  {
    label: "Data",
    accent: "rgba(244, 114, 182, 0.45)",
    text: "#f472b6",
    items: [
      "PostgreSQL",
      "MongoDB",
      "SQLite",
      "Turso",
      "Supabase",
      "Prisma",
      "Drizzle",
      "Sequelize",
      "Mongoose",
      "Redis",
    ],
  },
  {
    label: "AI",
    accent: "rgba(251, 191, 36, 0.45)",
    text: "#fbbf24",
    items: [
      "Anthropic SDK",
      "OpenAI SDK",
      "Google Gemini SDK",
      "Tree-sitter",
      "fal.ai",
      "Whisper",
      "MCP",
    ],
  },
  {
    label: "Infra",
    accent: "rgba(251, 113, 133, 0.45)",
    text: "#fb7185",
    items: [
      "Docker",
      "Vercel",
      "Render",
      "GitHub Actions",
      "Playwright",
      "Vitest",
      "Remotion",
      "Puppeteer",
    ],
  },
  {
    label: "Microsoft",
    accent: "rgba(52, 211, 153, 0.45)",
    text: "#34d399",
    items: [
      "Dynamics 365 BC",
      "AL Language",
      "REST + OAuth2",
      "NAV → BC migrations",
    ],
  },
];

const COLSPAN: Record<number, string> = {
  0: "md:col-span-4",
  1: "md:col-span-4",
  2: "md:col-span-4",
  3: "md:col-span-6",
  4: "md:col-span-3",
  5: "md:col-span-3",
  6: "md:col-span-12",
};

export function SkillsBento() {
  return (
    <section className="relative border-t border-[var(--color-border)] px-6 py-28 md:px-10 md:py-36 lg:px-16">
      <div className="mx-auto max-w-[var(--container-screen)]">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
          Skills
        </p>
        <h2 className="mt-3 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] tracking-tight text-[var(--color-fg)]">
          What I work in.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
          {SKILL_GROUPS.map((g, i) => (
            <MagicCard
              key={g.label}
              glowColor={g.accent}
              className={`p-6 ${COLSPAN[i]}`}
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.18em]"
                style={{ color: g.text }}
              >
                {g.label}
              </p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-overlay)]/40 px-2 py-1 font-mono text-[11px] text-[var(--color-fg-muted)] backdrop-blur-sm"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
