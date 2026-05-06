"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/effects/TiltCard";
import { BorderBeam } from "@/components/effects/BorderBeam";
import { Reveal } from "@/components/effects/Reveal";
import { projects, type Project } from "@/lib/projects";

const WireShape = dynamic(
  () => import("@/components/3d/WireShape").then((m) => m.WireShape),
  { ssr: false },
);

const ACCENT: Record<string, string> = {
  keepitup: "#22d3ee",
  "enderrat-e-mia": "#fbbf24",
  "gym-app": "#84cc16",
  "pilates-studio": "#fb7185",
  cleanslate: "#34d399",
  "social-command-center": "#818cf8",
  "jiang-clips": "#f472b6",
  bohesh: "#a78bfa",
  "kercishta-garage": "#fb923c",
};

function statusDotColor(status: Project["status"]) {
  if (status === "shipped") return "#22d3ee";
  if (status === "in-progress") return "#fbbf24";
  return "#a78bfa";
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const accent = ACCENT[project.slug] ?? "#22d3ee";
  const objectClass =
    project.imageMode === "contain" ? "object-contain p-12" : "object-cover";
  const cardRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    const imgWrap = imageWrapRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
    if (imgWrap) {
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      imgWrap.style.setProperty("--ix", `${dx * 8}px`);
      imgWrap.style.setProperty("--iy", `${dy * 8}px`);
    }
  }

  function onLeave() {
    const imgWrap = imageWrapRef.current;
    if (imgWrap) {
      imgWrap.style.setProperty("--ix", `0px`);
      imgWrap.style.setProperty("--iy", `0px`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.07 + Math.floor(index / 3) * 0.05,
        ease: [0.2, 0.6, 0.2, 1],
      }}
    >
      <Link
        href={`/projects/${project.slug}`}
        data-accent={project.slug}
        className="group block h-full"
        aria-label={`Read the ${project.title} case study`}
      >
        <TiltCard intensity={0.5} className="will-change-transform h-full">
          <article
            ref={cardRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 backdrop-blur-sm transition-[border-color,transform,box-shadow] duration-300 group-hover:-translate-y-1.5 group-hover:border-[var(--project-accent)] group-hover:shadow-[0_30px_70px_-30px_color-mix(in_oklch,var(--project-accent)_70%,transparent)]"
            style={
              {
                "--project-accent": accent,
              } as React.CSSProperties
            }
          >
            {/* Image area */}
            <div
              ref={imageWrapRef}
              className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-bg-overlay)]"
              style={
                {
                  "--ix": "0px",
                  "--iy": "0px",
                } as React.CSSProperties
              }
            >
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                style={{
                  transform:
                    "translate3d(var(--ix, 0px), var(--iy, 0px), 0)",
                  transition:
                    "transform 0.4s cubic-bezier(0.2,0.6,0.2,1)",
                }}
              >
                <Image
                  src={project.hero}
                  alt={project.heroAlt}
                  fill
                  sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
                  className={`${objectClass} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
                />
              </div>

              {/* Cursor spotlight overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(circle 320px at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, ${accent} 35%, transparent) 0%, transparent 60%)`,
                  mixBlendMode: "screen",
                }}
              />

              {/* Number badge */}
              <div className="absolute left-5 top-5 z-10 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg)]">
                <span
                  className="rounded-full px-2 py-0.5 backdrop-blur"
                  style={{
                    background: `color-mix(in oklch, ${accent} 25%, rgba(3,7,11,0.55))`,
                    border: `1px solid color-mix(in oklch, ${accent} 60%, transparent)`,
                  }}
                >
                  {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                </span>
              </div>

              {/* Accent line at bottom of image */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
                  <span
                    className="inline-block size-1.5 animate-pulse-soft rounded-full"
                    style={{ background: statusDotColor(project.status) }}
                  />
                  {project.status}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]">
                  {project.year}
                </span>
              </div>

              <h3 className="font-serif text-2xl leading-tight tracking-tight text-[var(--color-fg)]">
                {project.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {project.tagline}
              </p>

              <ul className="mt-1 flex flex-wrap gap-1.5">
                {project.stack.map((chip) => (
                  <li
                    key={chip}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-overlay)]/60 px-2 py-0.5 font-mono text-[10px] text-[var(--color-fg-muted)]"
                  >
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-center gap-1.5 pt-2 font-mono text-xs uppercase tracking-wider text-[var(--project-accent)]">
                View case study
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* BorderBeam — lights up only on hover */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            >
              <BorderBeam
                size={260}
                duration={6}
                colorFrom={accent}
                colorTo="#a78bfa"
              />
            </div>
          </article>
        </TiltCard>
      </Link>
    </motion.div>
  );
}

export function ProjectBentoGrid() {
  return (
    <section
      id="projects"
      className="relative px-6 py-28 md:px-10 md:py-36 lg:px-16"
    >
      {/* Decorative 3D wireframe in negative space */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-4 top-20 hidden h-44 w-44 opacity-70 md:block lg:right-12 lg:top-28 lg:h-56 lg:w-56"
      >
        <WireShape geometry="icosa" color="#22d3ee" speed={0.7} />
      </div>

      <div className="relative mx-auto max-w-[var(--container-screen)]">
        <Reveal>
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                Selected projects · 9 of 23
              </p>
              <h2 className="mt-3 font-serif text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] tracking-tight text-[var(--color-fg)]">
                Production builds, end-to-end.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--color-fg-muted)]">
              Every tile is shipped. Every case study has the architecture, the
              constraints, and the numbers.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
