"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { projects, type Project } from "@/lib/projects";

const DEVICE_MOCKUPS: Record<string, string> = {
  keepitup: "/scenes/devices/keepitup.png",
  "gym-app": "/scenes/devices/gymapp.png",
  "pilates-studio": "/scenes/devices/pilates.png",
  cleanslate: "/scenes/devices/cleanslate.png",
  "enderrat-e-mia": "/scenes/devices/enderrat.png",
  "social-command-center": "/scenes/devices/socialcommand.png",
  "reel-farmer": "/scenes/devices/reelfarmer.png",
  dabei: "/scenes/devices/dabei.png",
  websites: "/scenes/devices/websites.png",
  "advance-al": "/scenes/devices/advanceal.png",
};

const TOTAL = projects.length;

export function MobileCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const panes = root.querySelectorAll<HTMLElement>("[data-pane-index]");
    if (!panes.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { idx: number; ratio: number } | null = null;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const idx = Number((e.target as HTMLElement).dataset.paneIndex);
          if (!best || e.intersectionRatio > best.ratio) {
            best = { idx, ratio: e.intersectionRatio };
          }
        }
        if (best && best.ratio >= 0.45) {
          setActiveIdx((prev) => (prev === best!.idx ? prev : best!.idx));
        }
      },
      { threshold: [0.3, 0.45, 0.6, 0.75] },
    );
    panes.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  const active = projects[activeIdx];
  const ix = String(activeIdx + 1).padStart(2, "0");
  const tx = String(TOTAL).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id="work"
      data-accent={active.slug}
      className="relative bg-[#070612]"
    >
      <div className="pointer-events-none sticky top-0 z-20 flex items-center justify-between px-5 pb-3 pt-6 backdrop-blur-md">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/75">
          <span style={{ color: "var(--project-accent, #fff)" }}>{ix}</span>
          &nbsp;/&nbsp; Selected work · {ix} of {tx}
        </p>
        <div className="flex items-center gap-1.5">
          {projects.map((p, i) => (
            <span
              key={p.slug}
              aria-hidden
              className="block transition-all duration-300"
              style={{
                width: i === activeIdx ? 18 : 5,
                height: 3,
                borderRadius: 9999,
                background:
                  i === activeIdx
                    ? "var(--project-accent, #fff)"
                    : "rgba(255,255,255,0.30)",
              }}
            />
          ))}
        </div>
      </div>

      {projects.map((p, i) => (
        <ProjectPane key={p.slug} project={p} index={i} />
      ))}
    </section>
  );
}

function ProjectPane({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const sp = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  });

  const mockupY = useTransform(sp, [0, 0.5, 1], ["10%", "0%", "-10%"]);
  const mockupScale = useTransform(sp, [0, 0.5, 1], [0.86, 1, 0.92]);
  const mockupRotate = useTransform(sp, [0, 0.5, 1], [4, 0, -4]);
  const mockupOpacity = useTransform(
    sp,
    [0, 0.18, 0.5, 0.82, 1],
    [0.15, 0.85, 1, 0.85, 0.15],
  );
  const titleY = useTransform(sp, [0, 0.4, 0.6, 1], ["32%", "0%", "0%", "-18%"]);
  const titleOpacity = useTransform(
    sp,
    [0.12, 0.4, 0.6, 0.88],
    [0, 1, 1, 0],
  );
  const haloOpacity = useTransform(sp, [0, 0.4, 0.6, 1], [0, 0.5, 0.5, 0]);

  const mockupSrc = DEVICE_MOCKUPS[project.slug] ?? project.hero;
  const ix = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={ref}
      data-pane-index={index}
      data-accent={project.slug}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: haloOpacity,
          background:
            "radial-gradient(60% 50% at 50% 38%, var(--project-accent), transparent 65%)",
          mixBlendMode: "screen",
        }}
      />

      <motion.div
        className="relative mx-auto mt-[12svh] aspect-[16/10] w-[92%]"
        style={{
          y: mockupY,
          scale: mockupScale,
          rotate: mockupRotate,
          opacity: mockupOpacity,
        }}
      >
        <Image
          src={mockupSrc}
          alt={project.heroAlt ?? `${project.title} device mockup`}
          fill
          sizes="92vw"
          className="object-contain drop-shadow-[0_24px_44px_rgba(0,0,0,0.55)]"
          priority={index < 2}
        />
      </motion.div>

      <motion.div
        style={{ y: titleY, opacity: titleOpacity }}
        className="relative z-10 mb-[10svh] mt-auto px-6"
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          <span style={{ color: "var(--project-accent, #fff)" }}>{ix}</span>
          &nbsp;·&nbsp;{project.year}
          <span
            aria-hidden
            className="mx-2 inline-block h-[3px] w-[3px] rounded-full align-middle"
            style={{ background: "rgba(255,255,255,0.4)" }}
          />
          {project.status.replace("-", " ")}
        </p>
        <h2
          className="mt-3 text-white"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(2.4rem, 12vw, 3.8rem)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.0,
          }}
        >
          {project.title}.
        </h2>
        <p
          className="mt-3 max-w-[28ch]"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            color: "rgba(255,255,255,0.94)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.05rem, 4.2vw, 1.3rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.012em",
          }}
        >
          {project.tagline}
        </p>
        <div
          className="mt-4 flex flex-wrap gap-x-2.5 gap-y-1 font-mono text-[9px] uppercase tracking-[0.18em]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {project.stack.slice(0, 3).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex items-center gap-2 font-sans text-sm text-white"
          style={{
            paddingBottom: 4,
            borderBottom: "1px solid rgba(255,255,255,0.50)",
          }}
        >
          See the build
          <span aria-hidden style={{ color: "var(--project-accent, #fff)" }}>
            →
          </span>
        </Link>
      </motion.div>
    </article>
  );
}
