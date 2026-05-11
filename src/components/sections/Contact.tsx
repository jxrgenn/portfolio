"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneSection } from "@/components/scene/SceneSection";
import { GlassCapsule } from "@/components/scene/GlassCapsule";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EMAIL = "jurgenhalili1142@gmail.com";

type FooterLink = {
  label: string;
  value: string;
  href: string | null;
  download?: boolean;
};

const FOOTER_LINKS: readonly FooterLink[] = [
  { label: "GitHub", value: "github.com/jxrgenn", href: "https://github.com/jxrgenn" },
  { label: "LinkedIn", value: "jurgen-halili", href: "https://www.linkedin.com/in/jurgen-halili-b227a6255" },
  { label: "Instagram", value: "instagram.com/jxrgenn", href: "https://instagram.com/jxrgenn" },
  { label: "CV", value: "download · pdf", href: "/cv.pdf", download: true },
];

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
      gsap.from("[data-contact-headline]", {
        opacity: 0,
        y: 26,
        duration: 1.05,
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
          className="font-mono text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "var(--scene-ink-muted)" }}
        >
          <span style={{ color: "var(--scene-ink)" }}>05</span>
          &nbsp; / &nbsp;Contact
        </p>

        <h2
          data-contact-headline
          className="mt-8 font-serif"
          style={{
            color: "var(--scene-ink)",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(3rem, 10vw, 7.5rem)",
            fontWeight: 400,
            letterSpacing: "-0.045em",
            lineHeight: 0.92,
          }}
        >
          <span className="block">Let&apos;s build</span>
          <span
            className="block"
            style={{ fontStyle: "italic", opacity: 0.6, fontWeight: 300 }}
          >
            something good.
          </span>
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
          data-contact-body
          className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.22em]"
          style={{ color: "var(--scene-ink-muted)" }}
        >
          <span className="relative inline-flex h-2 w-2 items-center justify-center">
            <span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(50, 180, 100, 0.55)",
                animation: "status-pulse 2s ease-in-out infinite",
              }}
            />
            <span
              aria-hidden
              className="relative block h-2 w-2 rounded-full"
              style={{
                background: "#2fa765",
                boxShadow: "0 0 10px rgba(50, 180, 100, 0.55)",
              }}
            />
          </span>
          <span style={{ color: "var(--scene-ink)" }}>Currently shipping</span>
          <span aria-hidden style={{ color: "var(--scene-ink-subtle)" }}>·</span>
          <span>Ëndërrat e Mia</span>
          <span aria-hidden style={{ color: "var(--scene-ink-subtle)" }}>·</span>
          <span>Open to AI roles, 2026</span>
        </div>

        <div
          data-contact-cta
          className="mt-8 flex flex-wrap items-center gap-4"
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
          className="mt-16 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:gap-x-6"
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
                    target={f.download ? undefined : "_blank"}
                    rel={f.download ? undefined : "noopener noreferrer"}
                    download={f.download}
                    data-cursor-text={f.download ? "Download" : "Open"}
                    className="inline-flex items-center gap-1.5"
                  >
                    {f.value}
                    <span aria-hidden style={{ color: "var(--scene-ink-muted)" }}>
                      {f.download ? "↓" : "↗"}
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
