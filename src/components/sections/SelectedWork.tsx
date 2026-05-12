"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { SceneSection } from "@/components/scene/SceneSection";
import { SplitText } from "@/components/scene/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FeaturedProject = (typeof projects)[number];

type SceneTone = "warm" | "cool";

type SceneConfig = {
  slug: string;
  tone: SceneTone;
  backdrop: string;
  composite: string;
  alignment: "right" | "left";
  /** rgba color used as the screen-glow halo behind the composite */
  glow: string;
};

// Per-project styling (tone + backdrop + glow). Each entry is curated for the
// projects we have hand-tuned scenes for; new projects fall back to a neutral
// variant cycled by index. composite always uses project.hero so the carousel
// updates in lockstep with the case-study page.
type Variant = { tone: SceneTone; backdrop: string; glow: string };
const VARIANTS: Record<string, Variant> = {
  keepitup:                { tone: "cool", backdrop: "/scenes/backdrops/work-keepitup.jpg",      glow: "rgba(110, 200, 230, 0.42)" },
  "gym-app":               { tone: "cool", backdrop: "/scenes/backdrops/work-gymapp.jpg",        glow: "rgba(150, 220, 130, 0.40)" },
  "pilates-studio":        { tone: "warm", backdrop: "/scenes/backdrops/work-pilates.jpg",       glow: "rgba(255, 210, 200, 0.55)" },
  cleanslate:              { tone: "warm", backdrop: "/scenes/backdrops/work-cleanslate.jpg",    glow: "rgba(220, 235, 250, 0.55)" },
  "enderrat-e-mia":        { tone: "cool", backdrop: "/scenes/backdrops/work-enderrat.jpg",      glow: "rgba(255, 180, 140, 0.40)" },
  "social-command-center": { tone: "cool", backdrop: "/scenes/backdrops/work-socialcommand.jpg", glow: "rgba(220, 130, 220, 0.42)" },
};
const FALLBACK_BACKDROPS = [
  "/scenes/backdrops/work-keepitup.jpg",
  "/scenes/backdrops/work-pilates.jpg",
  "/scenes/backdrops/work-cleanslate.jpg",
  "/scenes/backdrops/work-gymapp.jpg",
];
const FALLBACK_GLOWS = [
  "rgba(180, 220, 200, 0.42)",
  "rgba(180, 140, 220, 0.42)",
  "rgba(255, 200, 130, 0.42)",
  "rgba(130, 180, 255, 0.42)",
];

// Map project slug → device-mockup PNG filename in /public/scenes/devices/.
// Each is a photoreal AI render of a laptop/iPad/iPhone in context, with
// the project's UI on the screen — generated via gen-missing-devices.sh.
const DEVICE_MOCKUPS: Record<string, string> = {
  keepitup: "/scenes/devices/keepitup.png",
  "gym-app": "/scenes/devices/gymapp.png",
  "pilates-studio": "/scenes/devices/pilates.png",
  cleanslate: "/scenes/devices/cleanslate.png",
  "enderrat-e-mia": "/scenes/devices/enderrat.png",
  "social-command-center": "/scenes/devices/socialcommand.png",
  "reel-farmer": "/scenes/devices/reelfarmer.png",
  bohesh: "/scenes/devices/bohesh.png",
  websites: "/scenes/devices/websites.png",
  "advance-al": "/scenes/devices/advanceal.png",
};

const SCENES: readonly SceneConfig[] = projects.map((p, i) => {
  const v = VARIANTS[p.slug];
  return {
    slug: p.slug,
    tone: v?.tone ?? (i % 2 === 0 ? "cool" : "warm"),
    backdrop: v?.backdrop ?? FALLBACK_BACKDROPS[i % FALLBACK_BACKDROPS.length],
    composite: DEVICE_MOCKUPS[p.slug] ?? p.hero, // device-framed mockup first, raw hero as fallback
    alignment: i % 2 === 0 ? "right" : "left",
    glow: v?.glow ?? FALLBACK_GLOWS[i % FALLBACK_GLOWS.length],
  };
});

export function SelectedWork() {
  return (
    <div id="work">
      {SCENES.map((scene, i) => {
        const project = projects.find((p) => p.slug === scene.slug);
        if (!project) return null;
        return (
          <ProjectScene
            key={scene.slug}
            project={project}
            scene={scene}
            index={i + 1}
            total={SCENES.length}
          />
        );
      })}
    </div>
  );
}

function ProjectScene({
  project,
  scene,
  index,
  total,
}: {
  project: FeaturedProject;
  scene: SceneConfig;
  index: number;
  total: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-scene-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });
      gsap.from("[data-scene-headline] [data-scene-char]", {
        yPercent: 110,
        stagger: 0.09,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 65%", once: true },
      });
      gsap.from("[data-scene-tagline], [data-scene-stack], [data-scene-cta]", {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 60%", once: true },
      });

      // Parallax scrub disabled on touch — Lenis + scrub-driven yPercent
      // double-smooths and feels jittery. Desktop with a real pointer keeps it.
      const supportsHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (supportsHover) {
        gsap.to("[data-scene-composite]", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
        gsap.to("[data-scene-headline]", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const ix = String(index).padStart(2, "0");
  const tx = String(total).padStart(2, "0");
  const flipped = scene.alignment === "left";

  return (
    <SceneSection
      id={`work-${scene.slug}`}
      backdrop={scene.backdrop}
      tone={scene.tone}
      accent={scene.slug}
      priority={index === 1}
      compact
      style={{ ["--scene-glow-color" as string]: scene.glow }}
    >
      <div
        ref={wrapRef}
        className="contents"
        data-composite-flip={flipped ? "true" : "false"}
      >
        <p
          data-scene-eyebrow
          className="font-mono text-[11px] uppercase tracking-[0.24em]"
          style={{ color: "var(--scene-ink-muted)" }}
        >
          <span style={{ color: "var(--project-accent, var(--scene-ink))" }}>
            {ix}
          </span>
          &nbsp; / &nbsp;Selected work &nbsp;·&nbsp; {ix} of {tx}
        </p>

        <div
          className={`mt-12 grid flex-1 grid-cols-1 items-center gap-12 md:mt-16 md:grid-cols-12 md:gap-16 ${flipped ? "md:[&>*:first-child]:order-2" : ""}`}
        >
          <div className="md:col-span-5">
            <h2
              data-scene-headline
              className="overflow-hidden font-sans"
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
                text={project.title + "."}
                dataAttr="data-scene-char"
                className="block overflow-hidden"
              />
            </h2>

            <p
              data-scene-tagline
              className="mt-6 max-w-md font-sans text-base leading-relaxed md:text-lg"
              style={{ color: "var(--scene-ink-muted)", fontWeight: 300 }}
            >
              {project.tagline}
            </p>

            <p
              data-scene-tagline
              className="mt-4 max-w-md font-sans text-sm leading-relaxed"
              style={{ color: "var(--scene-ink-subtle)", fontWeight: 300 }}
            >
              {project.pitch}
            </p>

            <div
              data-scene-stack
              className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em]"
              style={{ color: "var(--scene-ink-subtle)" }}
            >
              {project.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>

            <Link
              data-scene-cta
              href={`/projects/${project.slug}`}
              data-cursor-text="Open"
              className="read-case-link mt-8"
            >
              Read case study
              <span className="arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>

          <div className="md:col-span-7">
            <div data-scene-composite className="composite-frame w-full">
              <div
                className="composite-card relative aspect-[16/10] w-full"
                style={
                  flipped
                    ? ({
                        ["--composite-tilt-y" as string]: "2deg",
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <Image
                  src={scene.composite}
                  alt={project.heroAlt}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className="object-cover"
                  priority={index === 1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
