"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneSection } from "@/components/scene/SceneSection";
import { GlassPane } from "@/components/scene/GlassPane";
import { SplitText } from "@/components/scene/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type YearEntry = {
  year: string;
  role: string;
  caption: string;
  projects: readonly string[];
};

const YEARS: readonly YearEntry[] = [
  {
    year: "2026",
    role: "Freelance full-stack engineer",
    caption: "Solo · independent",
    projects: ["KeepItUp", "Pilates Studio", "CleanSlate", "Ëndërrat e Mia"],
  },
  {
    year: "2025",
    role: "Freelance full-stack engineer",
    caption: "Solo · independent",
    projects: ["GymApp", "Social Command Center", "jiang-clips"],
  },
  {
    year: "2024",
    role: "Freelance + BC/NAV consultant",
    caption: "First freelance year · April → present",
    projects: ["Bohesh", "Kërçishta Garage", "BC/NAV migrations"],
  },
  {
    year: "2024",
    role: "BSc Software Engineering",
    caption: "Epoka University, Tirana — graduated",
    projects: [],
  },
] as const;

export function Experience() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-exp-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.from("[data-exp-headline] [data-exp-char]", {
        yPercent: 110,
        stagger: 0.10,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
      gsap.from("[data-exp-card]", {
        opacity: 0,
        y: 60,
        scale: 0.96,
        stagger: 0.12,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 60%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <SceneSection id="experience" backdrop="/scenes/backdrops/experience.jpg" tone="warm">
      <div ref={wrapRef} className="contents">
        <p
          data-exp-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.24em]"
          style={{ color: "var(--scene-ink-muted)" }}
        >
          <span style={{ color: "var(--scene-ink)" }}>03</span>
          &nbsp; / &nbsp;Experience
        </p>

        <h2
          data-exp-headline
          className="mt-6 overflow-hidden font-sans"
          style={{
            color: "var(--scene-ink)",
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
          }}
        >
          <SplitText
            text="Two years."
            dataAttr="data-exp-char"
            className="block overflow-hidden"
          />
        </h2>

        <p
          data-exp-headline
          className="mt-5 max-w-2xl font-sans text-lg leading-relaxed md:text-xl"
          style={{ color: "var(--scene-ink-muted)", fontWeight: 300 }}
        >
          From first freelance contract to AI-native products.
        </p>

        <div
          className="mt-16 flex-1"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 30%" }}
        >
          <div className="relative mx-auto max-w-3xl">
            {YEARS.map((y, i) => {
              const depth = i * 90;
              const blur = i === 0 ? 0 : Math.min(i * 1.4, 4.5);
              const opacity = Math.max(1 - i * 0.18, 0.50);
              const overlap = i === 0 ? 0 : -28;
              return (
                <GlassPane
                  key={`${y.year}-${i}`}
                  className="p-8 md:p-10"
                  style={{
                    marginTop: overlap,
                    transform: `translateZ(-${depth}px) rotateX(${i * 1.6}deg)`,
                    transformOrigin: "50% 0%",
                    filter: blur > 0 ? `blur(${blur}px)` : undefined,
                    opacity,
                    zIndex: YEARS.length - i,
                  }}
                  as="article"
                >
                  <div
                    data-exp-card
                    className="grid grid-cols-1 items-baseline gap-6 md:grid-cols-[140px_1fr]"
                  >
                    <div
                      className="font-sans"
                      style={{
                        color: "var(--scene-ink)",
                        fontWeight: 500,
                        fontSize: "clamp(2rem, 4vw, 3rem)",
                        letterSpacing: "-0.025em",
                        lineHeight: 1,
                      }}
                    >
                      {y.year}
                    </div>
                    <div>
                      <h3
                        className="font-sans"
                        style={{
                          color: "var(--scene-ink)",
                          fontWeight: 500,
                          fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {y.role}
                      </h3>
                      <p
                        className="mt-1 font-sans text-sm"
                        style={{ color: "var(--scene-ink-muted)", fontWeight: 300 }}
                      >
                        {y.caption}
                      </p>
                      {y.projects.length > 0 && (
                        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.16em]">
                          {y.projects.map((p) => (
                            <li
                              key={p}
                              style={{ color: "var(--scene-ink-subtle)" }}
                            >
                              <span
                                aria-hidden
                                style={{ color: "var(--scene-ink-muted)" }}
                              >
                                —{" "}
                              </span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </GlassPane>
              );
            })}
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
