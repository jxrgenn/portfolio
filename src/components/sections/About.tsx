"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneSection } from "@/components/scene/SceneSection";
import { GlassPane } from "@/components/scene/GlassPane";
import { TwoTracks } from "@/components/scene/TwoTracks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BIO_LINES = [
  "AI-native products on one rail — agents, pipelines, end-to-end systems.",
  "Microsoft Business Central / NAV migrations on the other — boring infra, real money.",
  "Studied software engineering at Epoka University, Tirana.",
  "I like systems small enough to hold in my head, end-to-end.",
];

const META = [
  ["Based", "Kiel, DE"],
  ["From", "Tirana, AL"],
  ["Languages", "SQ · EN · DE"],
  ["Open to", "AI roles · contracts"],
] as const;

export function About() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-about-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
      gsap.from("[data-about-headline]", {
        opacity: 0,
        y: 22,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
      });
      gsap.from("[data-about-portrait], [data-about-pane], [data-about-meta]", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 60%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <SceneSection
      id="about"
      backdrop="/scenes/backdrops/about.jpg"
      tone="warm"
      className="scene-bleed-top"
    >
      <div ref={wrapRef} className="contents">
        <p
          data-about-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.32em]"
          style={{ color: "var(--scene-ink-muted)" }}
        >
          <span style={{ color: "var(--scene-ink)" }}>04</span>
          &nbsp; / &nbsp;About
        </p>

        <h2
          data-about-headline
          className="mt-6 font-serif"
          style={{
            color: "var(--scene-ink)",
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2.8rem, 8vw, 6rem)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            lineHeight: 0.94,
          }}
        >
          Two{" "}
          <span style={{ fontStyle: "italic", opacity: 0.6, fontWeight: 300 }}>
            tracks.
          </span>
        </h2>

        <p
          data-about-headline
          className="mt-5 max-w-2xl font-sans text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--scene-ink-muted)", fontWeight: 300 }}
        >
          23, full-stack engineer. AI-native products and Microsoft Business
          Central / NAV migrations — end to end. Tirana → Kiel, freelance since
          April 2024.
        </p>

        <div data-about-tracks className="mt-12 mb-4 max-w-5xl">
          <TwoTracks />
        </div>

        <div className="mt-12 grid flex-1 grid-cols-1 items-center gap-12 md:grid-cols-[400px_1fr] md:gap-20">
          <div data-about-portrait>
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: "4 / 5",
                borderRadius: "16px",
                boxShadow:
                  "0 50px 120px -30px rgba(80, 40, 10, 0.35), 0 18px 36px -12px rgba(80, 40, 10, 0.20)",
                border: "1px solid rgba(255,255,255,0.65)",
                transform: "rotate(-1.2deg)",
                transformOrigin: "center center",
              }}
            >
              <Image
                src="/scenes/about/portrait.jpg"
                alt="Editorial portrait of Jurgen Halili"
                fill
                sizes="(min-width: 768px) 400px, 100vw"
                className="object-cover"
              />
            </div>
            <p
              className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ color: "var(--scene-ink-subtle)" }}
            >
              Jurgen Halili — Kiel, DE
            </p>
          </div>

          <div className="md:max-w-2xl">
            <GlassPane data-about-pane className="p-8 md:p-10" as="article">
              <ul className="space-y-5">
                {BIO_LINES.map((line, i) => (
                  <li
                    key={i}
                    className="font-sans leading-relaxed"
                    style={{
                      color: i === 0 ? "var(--scene-ink)" : "var(--scene-ink-muted)",
                      fontWeight: i === 0 ? 400 : 300,
                      fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                    }}
                  >
                    {line}
                  </li>
                ))}
              </ul>
            </GlassPane>

            <div data-about-pane className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
              <a
                href="/cv.pdf"
                download
                data-cursor-text="Download"
                className="inline-flex items-center gap-3 rounded-full px-5 py-3 font-sans text-sm font-medium transition-colors"
                style={{
                  background: "var(--scene-ink)",
                  color: "var(--scene-bg, #fff8ee)",
                }}
              >
                Download CV
                <span aria-hidden>↓</span>
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-text="View"
                className="font-sans text-sm transition-colors"
                style={{
                  color: "var(--scene-ink-muted)",
                  textDecoration: "underline",
                  textUnderlineOffset: 5,
                  textDecorationColor: "rgba(80,40,10,0.35)",
                }}
              >
                view in browser →
              </a>
            </div>

            <dl
              data-about-meta
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 font-sans text-sm sm:grid-cols-4"
              style={{
                borderTop: "1px solid rgba(80,40,10,0.18)",
                paddingTop: "1.75rem",
              }}
            >
              {META.map(([k, v]) => (
                <div key={k}>
                  <dt
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--scene-ink-subtle)" }}
                  >
                    {k}
                  </dt>
                  <dd className="mt-1.5" style={{ color: "var(--scene-ink)" }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
