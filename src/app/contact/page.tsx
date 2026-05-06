import type { Metadata } from "next";
import { Mail, Linkedin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { TextGenerateEffect } from "@/components/effects/TextGenerateEffect";
import { RotatingGradientText } from "@/components/effects/AnimatedGradientText";
import { BackgroundBoxes } from "@/components/effects/BackgroundBoxes";
import { Globe } from "@/components/effects/Globe";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Jurgen Halili — full-stack engineer based in Tirana, Albania.",
};

const ROLES = [
  "agent runtimes",
  "AI dashboards",
  "native apps",
  "content engines",
  "the next thing",
] as const;

export default function ContactPage() {
  return (
    <>
      {/* Hero with split — copy + globe */}
      <section className="relative isolate overflow-hidden border-b border-[var(--color-border)] px-6 pt-32 pb-20 md:px-10 md:pt-44 lg:px-16">
        <BackgroundBoxes />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-2/3"
          style={{
            background:
              "radial-gradient(ellipse 800px 600px at 30% 0%, rgba(167,139,250,0.22) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[var(--container-screen)] gap-12 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
              Contact
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight text-[var(--color-fg)] md:text-6xl">
              <TextGenerateEffect text="Let's build" />
              <br />
              <RotatingGradientText words={ROLES} />
              <span>.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--color-fg-muted)]">
              I&rsquo;m available for full-time AI-focused full-stack roles and
              high-impact contracts. I respond within 48h, faster if you mention
              the role up front.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <Globe className="opacity-90" />
          </div>
        </div>
      </section>

      {/* Form + direct links */}
      <section className="relative px-6 py-24 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[var(--container-screen)] gap-16 md:grid-cols-[1.2fr_1fr]">
          <div className="order-2 md:order-1">
            <ContactForm />
          </div>
          <aside className="order-1 space-y-10 md:order-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                Direct
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-5 backdrop-blur-sm transition-colors hover:bg-[var(--color-bg-overlay)]/60">
                  <Mail className="mt-0.5 size-5 text-[var(--color-accent)]" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      Email
                    </p>
                    <a
                      href="mailto:jurgenhalili1142@gmail.com"
                      className="font-mono text-sm text-[var(--color-fg)] underline decoration-dotted underline-offset-4 hover:text-[var(--color-accent)]"
                    >
                      jurgenhalili1142@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 p-5 backdrop-blur-sm transition-colors hover:bg-[var(--color-bg-overlay)]/60">
                  <Linkedin className="mt-0.5 size-5 text-[var(--color-accent)]" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      LinkedIn
                    </p>
                    <a
                      href="https://www.linkedin.com/in/jurgen-halili-b227a6255"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm text-[var(--color-fg)] underline decoration-dotted underline-offset-4 hover:text-[var(--color-accent)]"
                    >
                      jurgen-halili
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                Where
              </p>
              <p className="mt-4 font-serif text-2xl text-[var(--color-fg)]">
                Tirana, Albania
              </p>
              <p className="mt-2 font-mono text-xs text-[var(--color-fg-subtle)]">
                CET / CEST · UTC+1 / +2
              </p>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-fg-muted)]">
                Working remote with EU and US-East teams. Open to relocation
                for the right role.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
