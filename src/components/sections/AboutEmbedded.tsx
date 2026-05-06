import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { SectionMast } from "@/components/editorial/SectionMast";

const PORTRAIT_FILE = path.join(process.cwd(), "public", "portrait.jpg");
const HAS_PORTRAIT = (() => {
  try {
    return fs.existsSync(PORTRAIT_FILE);
  } catch {
    return false;
  }
})();

/**
 * Editorial About — two-column spread. Asymmetric body text on left,
 * portrait pinned right with a marginal note in the gutter.
 */
export function AboutEmbedded() {
  return (
    <section
      id="about"
      className="relative"
      style={{ background: "var(--color-bg-elevated)" }}
    >
      <SectionMast number="04" label="ABOUT" meta="the engineer behind the cases" />

      <div className="grid grid-cols-12 gap-6 px-6 py-24 md:gap-10 md:px-10 md:py-32 lg:px-16">
        {/* Body text (left, wide) */}
        <div className="col-span-12 md:col-span-7">
          <h2
            className="font-serif"
            style={{
              color: "var(--color-fg)",
              fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              fontWeight: 500,
            }}
          >
            <span style={{ fontStyle: "italic" }}>Albanian</span> engineer.
            <br />
            Epoka &rsquo;24.
            <br />
            <span style={{ color: "var(--color-accent)" }}>Freelance</span>{" "}
            since April.
          </h2>

          <div
            className="mt-10 space-y-6 font-serif"
            style={{
              color: "var(--color-fg)",
              fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)",
              lineHeight: 1.6,
            }}
          >
            <p>
              <span
                className="float-left mr-3 -mt-2 font-serif"
                style={{
                  color: "var(--color-accent)",
                  fontSize: "5rem",
                  lineHeight: 0.85,
                  fontWeight: 600,
                }}
              >
                T
              </span>
              wenty-two, based in Tirana. BSc in Software Engineering from
              Epoka, July 2024. Started freelancing the spring before
              graduating and haven&rsquo;t stopped — nine production projects
              in two years, every one of them built solo.
            </p>
            <p style={{ color: "var(--color-fg-muted)" }}>
              Two tracks pay the bills. AI-driven full-stack — Next.js, React
              Native, multi-provider LLM clients, agent runtimes — is the work
              I chase. Microsoft Dynamics 365 / Business Central / NAV
              migrations is the work that taught me how enterprise software
              actually fails.
            </p>
            <p style={{ color: "var(--color-fg-muted)" }}>
              Looking for a full-time AI-focused full-stack role. Remote, or
              anywhere I can get a visa.
            </p>
          </div>

          <div className="mt-12">
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
              The full story
              <span
                className="transition-transform group-hover:translate-x-1"
                style={{ color: "var(--color-accent)" }}
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Marginal note + portrait (right) */}
        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <p
            className="font-serif italic"
            style={{
              color: "var(--color-accent)",
              fontSize: 13,
              transform: "rotate(-1.5deg)",
              transformOrigin: "left center",
              borderLeft: "2px solid var(--color-accent)",
              paddingLeft: 12,
              marginBottom: 24,
            }}
          >
            marginalia: the only thing I pay for that
            <br />
            ships software is coffee in Tirana cafes.
          </p>

          <div
            className="relative aspect-[4/5] w-full overflow-hidden"
            style={{
              border: "2px solid var(--color-fg)",
              boxShadow: "8px 8px 0 0 var(--color-accent)",
            }}
          >
            {HAS_PORTRAIT ? (
              <Image
                src="/portrait.jpg"
                alt="Jurgen Halili"
                fill
                sizes="(min-width: 768px) 360px, 100vw"
                className="object-cover grayscale"
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, var(--color-bg-overlay) 0 8px, var(--color-bg-elevated) 8px 16px)",
                }}
              />
            )}
          </div>

          <p
            className="mt-3 text-center font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            Jurgen Halili — Tirana, Albania
          </p>
        </div>
      </div>
    </section>
  );
}
