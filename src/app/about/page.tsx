import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { TextGenerateEffect } from "@/components/effects/TextGenerateEffect";
import { TracingBeam } from "@/components/effects/TracingBeam";
import { MagicCard } from "@/components/effects/MagicCard";
import { TiltCard } from "@/components/effects/TiltCard";
import { NumberTicker } from "@/components/effects/NumberTicker";
import { BackgroundBoxes } from "@/components/effects/BackgroundBoxes";
import { BorderBeam } from "@/components/effects/BorderBeam";
import { IdentityMark } from "@/components/IdentityMark";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jurgen Halili — Tirana-based full-stack engineer with AI focus. MERN, Next.js, Anthropic + OpenAI + Gemini SDKs, Microsoft Business Central / AL.",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jurgen Halili",
  url: SITE_URL,
  email: "mailto:jurgenhalili1142@gmail.com",
  telephone: "+355685833333",
  jobTitle: "Full-stack engineer with AI focus",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tirana",
    addressCountry: "AL",
  },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "Epoka University" },
    { "@type": "EducationalOrganization", name: "Ismail Qemali High School" },
    { "@type": "EducationalOrganization", name: "CASA Bremen Sprachschule" },
  ],
  knowsLanguage: ["sq", "en", "de"],
  sameAs: ["https://www.linkedin.com/in/jurgen-halili-b227a6255"],
};

const lifeStats = [
  { value: "9", label: "production projects shipped" },
  { value: "23", label: "personal projects total" },
  { value: "5", label: "years engineering" },
  { value: "3", label: "languages spoken" },
  { value: "6", label: "deploy platforms used" },
  { value: "12", label: "model providers integrated" },
] as const;

const timeline = [
  {
    period: "Apr 2024 – Now",
    org: "Freelance Software Engineer",
    location: "Remote · Tirana",
    summary:
      "Two parallel tracks. Track 1 — AI-driven full-stack: 9 production projects across Next.js 16, RN + Expo, multi-provider LLM SDKs, agent runtimes, AI content pipelines, deploys to Vercel + Turso + Render. Track 2 — Microsoft Dynamics 365 / Business Central: AL extensions, REST/JSON/OAuth2 integrations, NAV → BC migrations, automated AL testing.",
    type: "work",
  },
  {
    period: "Aug – Sep 2023",
    org: "BALFIN Group",
    location: "Tirana, Albania",
    summary:
      "Software Developer (full-time intern). Backend in Python + Flask: built and optimized APIs, managed databases, debugged existing applications, owned query optimization and data integrity.",
    type: "work",
  },
  {
    period: "Jul – Aug 2023",
    org: "Intesa Sanpaolo Bank Albania",
    location: "Tirana, Albania",
    summary:
      "ICT Specialist (full-time intern), Development Office. Updated existing database systems, resolved IT issues across all branches. Stack: Java + Spring Boot, DBMS, data warehousing.",
    type: "work",
  },
  {
    period: "Oct 2021 – Jul 2024",
    org: "Epoka University",
    location: "Tirana · BSc Software Engineering",
    summary:
      "GPA 3.04, university honor list. Half-ride scholarship. Active in the Programmers Club and Google Developer Student Club. Holds a certificate for helping build Epoka's Database Management System.",
    type: "edu",
  },
  {
    period: "Jul – Oct 2022",
    org: "CASA Bremen Sprachschule",
    location: "Bremen, Germany · German A2",
    summary: "Completed the A2 level with 100/100 on the final test.",
    type: "edu",
  },
  {
    period: "Oct 2018 – Jun 2021",
    org: "Ismail Qemali High School",
    location: "Tirana · Diploma of Excellence",
    summary:
      "GPA 9.97. Physics & Mathematics olympiad finalist (twice each). Three years on the student senate.",
    type: "edu",
  },
];

const certs = [
  {
    issuer: "Anthropic (Skilljar)",
    title: "Introduction to Model Context Protocol",
    date: "2026-01-07",
    href: "https://verify.skilljar.com/c/3homeyjjfyyw",
    glow: "rgba(34, 211, 238, 0.45)",
  },
  {
    issuer: "Udemy (Ed Donner & Ligency)",
    title: "AI Engineer Agentic Track: The Complete Agent & MCP Course",
    date: "2025-12-08",
    href: null,
    note: "17 hours",
    glow: "rgba(167, 139, 250, 0.45)",
  },
];

const certsPlanned = [
  "DeepLearning.AI — Building Towards Computer Use with Anthropic",
  "DeepLearning.AI — MCP: Build Rich-Context AI Apps with Anthropic",
  "Hugging Face — AI Agents Course",
];

const skillGroups: { label: string; accent: string; items: string[] }[] = [
  {
    label: "Languages",
    accent: "rgba(34, 211, 238, 0.45)",
    items: ["TypeScript", "JavaScript", "Python", "Java", "C", "AL", "SQL"],
  },
  {
    label: "Frontend",
    accent: "rgba(167, 139, 250, 0.45)",
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
    items: [
      "Node.js + Express",
      "Java Spring Boot",
      "Python Flask",
      "Next.js Route Handlers",
      "Socket.io",
      "BullMQ",
    ],
  },
  {
    label: "Data",
    accent: "rgba(244, 114, 182, 0.45)",
    items: [
      "MongoDB",
      "PostgreSQL",
      "Prisma",
      "Drizzle",
      "Sequelize",
      "Mongoose",
      "Supabase + RLS",
      "Turso (libSQL)",
      "SQLite",
      "Redis",
    ],
  },
  {
    label: "AI",
    accent: "rgba(251, 191, 36, 0.45)",
    items: [
      "Anthropic SDK",
      "OpenAI SDK",
      "Google Gemini SDK",
      "Tree-sitter (multi-language AST)",
      "Whisper",
      "fal.ai (Flux)",
      "Model Context Protocol",
    ],
  },
  {
    label: "Infra & tooling",
    accent: "rgba(251, 113, 133, 0.45)",
    items: [
      "Docker + Docker Compose",
      "Vercel (serverless + edge)",
      "Render",
      "GitHub Actions",
      "Playwright (E2E)",
      "Vitest",
      "Jest",
      "Remotion",
      "Puppeteer",
    ],
  },
  {
    label: "Microsoft Dynamics 365",
    accent: "rgba(52, 211, 153, 0.45)",
    items: [
      "Business Central",
      "AL Language",
      "REST + OAuth2 integrations",
      "NAV → BC migrations",
    ],
  },
];

const languages = [
  { lang: "Albanian", level: "Native", value: 100 },
  { lang: "English", level: "Fluent", value: 92 },
  { lang: "German", level: "B1", value: 60 },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      {/* HERO with identity mark + bio */}
      <section className="relative isolate overflow-hidden border-b border-[var(--color-border)] px-6 pt-32 pb-24 md:px-10 md:pt-48 lg:px-16">
        <BackgroundBoxes />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3"
          style={{
            background:
              "radial-gradient(ellipse 900px 600px at 80% 0%, rgba(34, 211, 238, 0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[var(--container-screen)] gap-12 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
              About
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[var(--color-fg)] md:text-6xl">
              <TextGenerateEffect text="Hi, I'm Jurgen — full-stack engineer with AI focus." />
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
              I&rsquo;m based in Tirana, Albania. I build AI-driven full-stack
              products end-to-end — backends, web, native apps, and the agentic
              systems that connect them.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-fg-subtle)]">
              Across the nine projects on this site, the pattern is the same: I
              work solo from problem to production, treat AI as a first-class
              layer of the stack rather than an add-on, and keep shipping until
              the thing is real. Day job is freelance — MERN + Next.js for SMBs,
              and Microsoft Dynamics 365 / Business Central for companies
              migrating off NAV.
            </p>
          </div>
          <TiltCard intensity={0.6} className="mx-auto w-full max-w-md">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/40 backdrop-blur">
              <IdentityMark className="absolute inset-0" />
              <BorderBeam size={300} duration={10} />
            </div>
          </TiltCard>
        </div>
      </section>

      {/* LIFE STATS */}
      <section className="relative border-b border-[var(--color-border)] px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[var(--container-screen)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            By the numbers
          </p>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
            {lifeStats.map((s) => (
              <li key={s.label}>
                <p className="font-serif text-5xl tracking-tight text-[var(--color-fg)] md:text-6xl">
                  <NumberTicker value={s.value} />
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                  {s.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TIMELINE — TracingBeam */}
      <section className="relative px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[var(--container-content)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Timeline
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[var(--color-fg)] md:text-4xl">
            Work and education, in order.
          </h2>

          <TracingBeam className="mt-16">
            <div className="ml-2 max-w-[var(--container-prose)] space-y-12 md:ml-0">
              {timeline.map((t) => (
                <div key={t.org + t.period}>
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {t.period} ·{" "}
                    <span className="text-[var(--color-accent)]">
                      {t.type === "work" ? "Work" : "Education"}
                    </span>
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-[var(--color-fg)]">
                    {t.org}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-[var(--color-fg-subtle)]">
                    {t.location}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                    {t.summary}
                  </p>
                </div>
              ))}
            </div>
          </TracingBeam>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[var(--container-content)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Certifications
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {certs.map((cert) => (
              <li key={cert.title}>
                <MagicCard glowColor={cert.glow} className="p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {cert.issuer}
                  </p>
                  <h3 className="mt-3 font-serif text-xl leading-snug text-[var(--color-fg)]">
                    {cert.title}
                  </h3>
                  <p className="mt-3 font-mono text-xs text-[var(--color-fg-subtle)]">
                    {cert.date}
                    {cert.note ? ` · ${cert.note}` : ""}
                  </p>
                  {cert.href ? (
                    <a
                      href={cert.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-[var(--color-accent)] underline decoration-dotted underline-offset-4 hover:opacity-80"
                    >
                      Verify <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </MagicCard>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            In progress
          </p>
          <ul className="mt-3 space-y-2">
            {certsPlanned.map((p) => (
              <li
                key={p}
                className="font-mono text-xs text-[var(--color-fg-muted)]"
              >
                · {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SKILLS — Bento with category accents */}
      <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[var(--container-screen)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Skills
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-[var(--color-fg)] md:text-4xl">
            What I work in.
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
            {skillGroups.map((group, i) => (
              <MagicCard
                key={group.label}
                glowColor={group.accent}
                className={`p-6 ${
                  i === 0 || i === 3 ? "md:col-span-3" : i === 4 ? "md:col-span-3" : "md:col-span-3"
                }`}
              >
                <p
                  className="font-mono text-xs uppercase tracking-wider"
                  style={{ color: group.accent.replace(/0\.\d+\)/, "1)") }}
                >
                  {group.label}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-overlay)]/40 px-2 py-1 font-mono text-xs text-[var(--color-fg-muted)] backdrop-blur-sm"
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

      {/* LANGUAGES — proficiency bars */}
      <section className="relative border-t border-[var(--color-border)] px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto max-w-[var(--container-content)]">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Languages
          </p>
          <ul className="mt-10 space-y-6">
            {languages.map((l) => (
              <li key={l.lang}>
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-xl text-[var(--color-fg)]">
                    {l.lang}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                    {l.level}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${l.value}%`,
                      background:
                        "linear-gradient(90deg, #22d3ee, #a78bfa, #f472b6)",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
