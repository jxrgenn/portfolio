"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneSection } from "@/components/scene/SceneSection";
import { GlassCapsule } from "@/components/scene/GlassCapsule";
import { SplitText } from "@/components/scene/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EMAIL = "jurgenhalili1142@gmail.com";

const FOOTER_LINKS = [
  { label: "GitHub", value: "github.com/jurgenhalili", href: "https://github.com/jurgenhalili" },
  { label: "LinkedIn", value: "linkedin.com/in/jurgen-halili", href: "https://www.linkedin.com/in/jurgen-halili/" },
  { label: "Kiel", value: "Germany (UTC+2)", href: null as string | null },
] as const;

export function Contact() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-contact-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.from("[data-contact-headline] [data-contact-char]", {
        yPercent: 110,
        stagger: 0.11,
        duration: 0.95,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
      gsap.from("[data-contact-body], [data-contact-cta], [data-contact-footer]", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <SceneSection id="contact" backdrop="/scenes/backdrops/contact.jpg" tone="warm">
      <div ref={wrapRef} className="contents">
        <p
          data-contact-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.24em]"
          style={{ color: "var(--scene-ink-muted)" }}
        >
          <span style={{ color: "var(--scene-ink)" }}>04</span>
          &nbsp; / &nbsp;Contact
        </p>

        <h2
          data-contact-headline
          className="mt-8 overflow-hidden font-sans"
          style={{
            color: "var(--scene-ink)",
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(3.4rem, 11vw, 9rem)",
            fontWeight: 500,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
          }}
        >
          {["Let's build", "something good."].map((line, li) => (
            <SplitText
              key={li}
              text={line}
              dataAttr="data-contact-char"
              className="block overflow-hidden"
            />
          ))}
        </h2>

        <p
          data-contact-body
          className="mt-10 max-w-xl font-sans text-base leading-relaxed md:text-lg"
          style={{ color: "var(--scene-ink-muted)", fontWeight: 300 }}
        >
          Best by email — I read everything and reply within a day. Contracts,
          intros, and BC/NAV questions all welcome.
        </p>

        <div
          data-contact-cta
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <GlassCapsule href={`mailto:${EMAIL}`}>
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(255,255,255,0.7)",
                color: "var(--scene-ink)",
              }}
            >
              ↗
            </span>
            <span
              className="font-sans text-sm md:text-base"
              style={{ color: "var(--scene-ink)", fontWeight: 400 }}
            >
              {EMAIL}
            </span>
          </GlassCapsule>

          <button
            type="button"
            onClick={handleCopy}
            data-cursor-text="Copy"
            className="font-mono text-[11px] uppercase tracking-[0.22em] transition-colors"
            style={{
              color: copied ? "var(--scene-ink)" : "var(--scene-ink-muted)",
              borderBottom: "1px dashed currentColor",
              paddingBottom: 2,
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="flex-1" />

        <dl
          data-contact-footer
          className="mt-16 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-8"
          style={{
            borderTop: "1px solid rgba(80,40,10,0.20)",
            paddingTop: "1.75rem",
          }}
        >
          {FOOTER_LINKS.map((f) => (
            <div key={f.label}>
              <dt
                className="font-mono text-[10px] uppercase tracking-[0.22em]"
                style={{ color: "var(--scene-ink-subtle)" }}
              >
                {f.label}
              </dt>
              <dd
                className="mt-1.5 font-sans text-sm"
                style={{ color: "var(--scene-ink)" }}
              >
                {f.href ? (
                  <a
                    href={f.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-text="Open"
                    className="inline-flex items-center gap-1.5"
                  >
                    {f.value}
                    <span aria-hidden style={{ color: "var(--scene-ink-muted)" }}>
                      ↗
                    </span>
                  </a>
                ) : (
                  f.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </SceneSection>
  );
}
