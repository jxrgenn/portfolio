"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  CardBody,
  CardContainer,
  CardItem,
} from "@/components/effects/ThreeDCard";
import { Reveal } from "@/components/effects/Reveal";
import { projects, type Project } from "@/lib/projects";

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
    project.imageMode === "contain" ? "object-contain p-10" : "object-cover";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.06 + Math.floor(index / 3) * 0.04,
        ease: [0.2, 0.6, 0.2, 1],
      }}
    >
      <CardContainer
        containerClassName="!justify-stretch h-full"
        className="!h-full !w-full"
      >
        <CardBody
          className="group/card relative h-full w-full"
        >
          <Link
            href={`/projects/${project.slug}`}
            data-accent={project.slug}
            className="block h-full w-full"
            aria-label={`Read the ${project.title} case study`}
          >
            <div
              className="relative flex h-full min-h-[26rem] w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 group-hover/card:border-[var(--project-accent)] group-hover/card:shadow-[0_30px_70px_-25px_color-mix(in_oklch,var(--project-accent)_70%,transparent)]"
              style={
                {
                  "--project-accent": accent,
                } as React.CSSProperties
              }
            >
              {/* Image floats forward in 3D */}
              <CardItem
                translateZ={50}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-bg-overlay)]"
              >
                <Image
                  src={project.hero}
                  alt={project.heroAlt}
                  fill
                  sizes="(min-width: 1280px) 480px, (min-width: 768px) 50vw, 100vw"
                  className={`${objectClass} transition-transform duration-700 ease-out group-hover/card:scale-[1.04]`}
                />
                {/* Accent line at bottom of image */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                  }}
                />
              </CardItem>

              {/* Content layers — each at slightly different depth for parallax */}
              <div className="flex flex-1 flex-col gap-4 p-6">
                <CardItem
                  translateZ={30}
                  className="flex w-full items-center justify-between gap-3"
                >
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
                </CardItem>

                <CardItem
                  translateZ={45}
                  className="font-serif text-2xl leading-tight tracking-tight text-[var(--color-fg)]"
                  as="h3"
                >
                  {project.title}
                </CardItem>

                <CardItem
                  translateZ={20}
                  className="line-clamp-2 text-sm leading-relaxed text-[var(--color-fg-muted)]"
                  as="p"
                >
                  {project.tagline}
                </CardItem>

                <CardItem
                  translateZ={15}
                  className="flex flex-wrap gap-1.5"
                  as="ul"
                >
                  {project.stack.map((chip) => (
                    <li
                      key={chip}
                      className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-overlay)]/60 px-2 py-0.5 font-mono text-[10px] text-[var(--color-fg-muted)]"
                    >
                      {chip}
                    </li>
                  ))}
                </CardItem>

                <CardItem
                  translateZ={35}
                  className="mt-auto flex items-center gap-1.5 pt-2 font-mono text-xs uppercase tracking-wider text-[var(--project-accent)]"
                >
                  View case study
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
                </CardItem>
              </div>
            </div>
          </Link>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}

export function ProjectsThreeDGrid() {
  return (
    <section
      id="projects"
      className="relative overflow-hidden border-t border-[var(--color-border)] px-6 py-28 md:px-10 md:py-36 lg:px-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2"
        style={{
          background:
            "radial-gradient(ellipse 1100px 500px at 50% 0%, rgba(34,211,238,0.10) 0%, transparent 60%)",
        }}
      />

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
              Hover any tile to see it lift in 3D. Click for the architecture,
              the constraints, and the numbers.
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
