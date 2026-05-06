import Link from "next/link";
import { SectionMast } from "@/components/editorial/SectionMast";

const EXPERIENCE = [
  {
    period: "Apr 2024 – Now",
    org: "Freelance Software Engineer",
    role: "AI-driven full-stack · Microsoft Dynamics 365 / Business Central",
    location: "Remote · Tirana, Albania",
    note:
      "Nine production projects: Next.js 16, React Native + Expo, multi-provider LLM SDKs, agent runtimes. NAV → BC migrations on the side.",
    current: true,
  },
  {
    period: "Aug – Sep 2023",
    org: "BALFIN Group",
    role: "Software Developer (full-time intern)",
    location: "Tirana",
    note: "Backend in Python + Flask. APIs, database management, debugging legacy.",
  },
  {
    period: "Jul – Aug 2023",
    org: "Intesa Sanpaolo Bank Albania",
    role: "ICT Specialist intern · Development Office",
    location: "Tirana",
    note: "Java + Spring Boot. DBMS + data warehousing across all branches.",
  },
] as const;

const EDUCATION = [
  {
    period: "Oct 2021 – Jul 2024",
    org: "Epoka University",
    role: "BSc Software Engineering",
    location: "Tirana",
    note: "GPA 3.04, honor list. Half-ride scholarship. Programmers Club + GDSC.",
  },
  {
    period: "Jul – Oct 2022",
    org: "CASA Bremen Sprachschule",
    role: "German A2",
    location: "Bremen",
    note: "100/100 final.",
  },
  {
    period: "Oct 2018 – Jun 2021",
    org: "Ismail Qemali High School",
    role: "Diploma of Excellence",
    location: "Tirana",
    note: "GPA 9.97. Physics & math olympiad finalist (×2). Senate (3 yrs).",
  },
] as const;

const SKILL_LINES = [
  {
    label: "Languages",
    items: "TypeScript, JavaScript, Python, Java, C, AL, SQL",
  },
  {
    label: "Frontend",
    items:
      "Next.js 16, React 19, React Native + Expo, Tailwind 4, shadcn/ui, Three.js, Framer Motion",
  },
  {
    label: "Backend",
    items:
      "Node.js + Express, Java Spring Boot, Python Flask, Socket.io, BullMQ + Redis",
  },
  {
    label: "Data",
    items:
      "PostgreSQL, MongoDB, SQLite, Turso, Supabase, Prisma, Drizzle, Sequelize, Mongoose",
  },
  {
    label: "AI",
    items:
      "Anthropic SDK, OpenAI SDK, Google Gemini SDK, Tree-sitter, fal.ai, Whisper, MCP",
  },
  {
    label: "Infra",
    items:
      "Docker, Vercel, Render, GitHub Actions, Playwright, Vitest, Remotion, Puppeteer",
  },
  {
    label: "Microsoft",
    items: "Dynamics 365 BC, AL Language, NAV → BC migrations",
  },
] as const;

function CVRow({
  entry,
  isFirst,
}: {
  entry: (typeof EXPERIENCE)[number] | (typeof EDUCATION)[number];
  isFirst?: boolean;
}) {
  return (
    <div
      className="grid grid-cols-12 gap-4 border-t py-7"
      style={{
        borderColor: "var(--color-border)",
        borderTopWidth: 1,
      }}
    >
      <div className="col-span-12 md:col-span-3">
        <p
          className="font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
        >
          {entry.period}
          {("current" in entry && entry.current) ? (
            <span
              className="ml-2 inline-block size-2 rounded-full align-middle"
              style={{ background: "var(--color-accent)" }}
            />
          ) : null}
        </p>
      </div>
      <div className="col-span-12 md:col-span-6">
        <h4
          className="font-serif"
          style={{
            color: "var(--color-fg)",
            fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)",
            fontWeight: 500,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          {entry.org}
        </h4>
        <p
          className="mt-1 font-serif"
          style={{ color: "var(--color-fg)", fontSize: 15 }}
        >
          {entry.role}
        </p>
        <p
          className="mt-2 font-serif"
          style={{ color: "var(--color-fg-muted)", fontSize: 14, lineHeight: 1.5 }}
        >
          {entry.note}
        </p>
      </div>
      <div className="col-span-12 md:col-span-3 md:text-right">
        <p
          className="font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          {entry.location}
        </p>
      </div>
    </div>
  );
}

/**
 * Editorial CV — typeset like a newspaper column. No mono pills, no glow
 * dots — just hairlines, italic dates, and a single accent dot for "current".
 */
export function CVSection() {
  return (
    <section
      className="relative"
      style={{ background: "var(--color-bg)" }}
    >
      <SectionMast number="05" label="CURRICULUM VITAE" meta="experience · education · skills" />

      <div className="px-6 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="grid grid-cols-12 gap-6">
          <h2
            className="col-span-12 font-serif md:col-span-7"
            style={{
              color: "var(--color-fg)",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            <span style={{ fontStyle: "italic" }}>Where I&rsquo;ve been,</span>
            <br />
            what I know.
          </h2>
        </div>

        {/* Experience */}
        <div className="mt-16">
          <div
            className="flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
          >
            <h3
              className="font-serif"
              style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
            >
              <span style={{ fontStyle: "italic" }}>Experience</span>
            </h3>
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              three positions
            </p>
          </div>
          {EXPERIENCE.map((e, i) => (
            <CVRow key={e.org} entry={e} isFirst={i === 0} />
          ))}
        </div>

        {/* Education */}
        <div className="mt-16">
          <div
            className="flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
          >
            <h3
              className="font-serif"
              style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
            >
              <span style={{ fontStyle: "italic" }}>Education</span>
            </h3>
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              three institutions
            </p>
          </div>
          {EDUCATION.map((e) => (
            <CVRow key={e.org} entry={e} />
          ))}
        </div>

        {/* Skills */}
        <div className="mt-16">
          <div
            className="flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
          >
            <h3
              className="font-serif"
              style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
            >
              <span style={{ fontStyle: "italic" }}>Tools of the trade</span>
            </h3>
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              seven categories
            </p>
          </div>

          <dl className="mt-2">
            {SKILL_LINES.map((s) => (
              <div
                key={s.label}
                className="grid grid-cols-12 gap-4 border-t py-5"
                style={{ borderColor: "var(--color-border)" }}
              >
                <dt
                  className="col-span-12 font-serif italic md:col-span-3"
                  style={{ color: "var(--color-accent)", fontSize: 15 }}
                >
                  {s.label}
                </dt>
                <dd
                  className="col-span-12 font-serif md:col-span-9"
                  style={{
                    color: "var(--color-fg)",
                    fontSize: 16,
                    lineHeight: 1.55,
                  }}
                >
                  {s.items}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 flex items-baseline justify-between">
          <Link
            href="/about"
            className="group inline-flex items-baseline gap-2 font-serif"
            style={{
              color: "var(--color-fg)",
              borderBottom: "2px solid var(--color-fg)",
              paddingBottom: 4,
              fontSize: 16,
            }}
          >
            Full CV with certifications
            <span
              className="transition-transform group-hover:translate-x-1"
              style={{ color: "var(--color-accent)" }}
            >
              →
            </span>
          </Link>
          <p
            className="hidden font-serif italic md:block"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            — page 05 ends —
          </p>
        </div>
      </div>
    </section>
  );
}
