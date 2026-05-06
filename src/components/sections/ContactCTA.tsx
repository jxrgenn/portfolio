import Link from "next/link";
import { SectionMast } from "@/components/editorial/SectionMast";

/**
 * Editorial postcard contact. "Send a dispatch back" framing, big serif
 * email, postage-stamp accent in the corner, signature line below.
 */
export function ContactCTA() {
  return (
    <section
      className="relative"
      style={{ background: "var(--color-bg-elevated)" }}
    >
      <SectionMast number="06" label="POSTCARD" meta="send a dispatch back" />

      <div className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div
          className="relative mx-auto grid max-w-5xl grid-cols-12 gap-6 p-8 md:p-14"
          style={{
            background: "var(--color-bg)",
            border: "2px solid var(--color-fg)",
            boxShadow: "10px 10px 0 0 var(--color-accent)",
          }}
        >
          {/* Postage stamp */}
          <div
            className="absolute -top-2 right-6 hidden md:block"
            style={{
              transform: "rotate(4deg)",
              border: "2px dashed var(--color-fg)",
              padding: "6px 10px",
              background: "var(--color-bg)",
            }}
          >
            <p
              className="text-center font-serif italic"
              style={{ color: "var(--color-accent)", fontSize: 12, fontWeight: 600 }}
            >
              Tirana
              <br />
              <span style={{ fontSize: 18, fontStyle: "normal", letterSpacing: "0.04em" }}>
                AL · 1001
              </span>
            </p>
          </div>

          {/* Body left column */}
          <div className="col-span-12 md:col-span-7">
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
            >
              Recto —
            </p>
            <h2
              className="mt-3 font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              <span style={{ fontStyle: "italic" }}>Email me.</span>
              <br />
              <span style={{ color: "var(--color-fg-muted)" }}>
                I respond within 48h.
              </span>
            </h2>
            <p
              className="mt-6 max-w-xl font-serif"
              style={{
                color: "var(--color-fg-muted)",
                fontSize: 16,
                lineHeight: 1.55,
              }}
            >
              Open to full-time AI-focused full-stack roles and contract work.
              Mention the role or scope in your first message and I&rsquo;ll
              come back the same day.
            </p>

            <a
              href="mailto:jurgenhalili1142@gmail.com"
              className="mt-10 block font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                textDecoration: "underline",
                textDecorationColor: "var(--color-accent)",
                textDecorationThickness: 2,
                textUnderlineOffset: 6,
              }}
            >
              jurgenhalili1142@gmail.com
            </a>

            <div
              className="mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-2 font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
            >
              <Link
                href="/contact"
                className="hover:text-[var(--color-accent)] transition-colors"
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  textUnderlineOffset: 4,
                }}
              >
                use the form
              </Link>
              <a
                href="https://www.linkedin.com/in/jurgen-halili-b227a6255"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors"
              >
                linkedin
              </a>
              <a
                href="https://github.com/jurgenhalili"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--color-accent)] transition-colors"
              >
                github
              </a>
            </div>
          </div>

          {/* Right column — address-block */}
          <div className="col-span-12 md:col-span-5 md:border-l md:pl-8" style={{ borderColor: "var(--color-fg)" }}>
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
            >
              From —
            </p>
            <p
              className="mt-3 font-serif"
              style={{ color: "var(--color-fg)", fontSize: 18, lineHeight: 1.4 }}
            >
              Jurgen Halili
              <br />
              Tirana, Albania
              <br />
              <span style={{ color: "var(--color-fg-muted)", fontStyle: "italic" }}>
                set in Fraunces
              </span>
            </p>

            <div
              className="mt-10 h-px"
              style={{ background: "var(--color-fg)", opacity: 0.3 }}
            />

            <p
              className="mt-6 font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              Looking for: full-time, AI-focused full-stack. Remote
              first; will travel for the right team.
            </p>

            {/* Signature */}
            <div className="mt-10">
              <p
                className="font-serif italic"
                style={{
                  color: "var(--color-fg)",
                  fontSize: 32,
                  letterSpacing: "0.01em",
                  transform: "rotate(-3deg)",
                  display: "inline-block",
                  borderBottom: "2px solid var(--color-fg)",
                  paddingBottom: 2,
                }}
              >
                Jurgen
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
