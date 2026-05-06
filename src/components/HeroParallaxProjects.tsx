"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
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

function ProductCard({
  project,
  translate,
}: {
  project: Project;
  translate: MotionValue<number>;
}) {
  const accent = ACCENT[project.slug] ?? "#22d3ee";
  const objectClass =
    project.imageMode === "contain" ? "object-contain p-10" : "object-cover";

  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -16 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      data-accent={project.slug}
      className="group/card relative h-[20rem] w-[28rem] flex-shrink-0 md:h-[24rem] md:w-[32rem] lg:h-[28rem] lg:w-[40rem]"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block h-full w-full"
        aria-label={`Read the ${project.title} case study`}
      >
        <div
          className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/40 backdrop-blur-sm transition-[border-color,box-shadow] duration-300 group-hover/card:border-[var(--project-accent)] group-hover/card:shadow-[0_30px_70px_-20px_color-mix(in_oklch,var(--project-accent)_70%,transparent)]"
          style={
            {
              "--project-accent": accent,
            } as React.CSSProperties
          }
        >
          <Image
            src={project.hero}
            alt={project.heroAlt}
            fill
            sizes="(min-width: 1024px) 40rem, (min-width: 768px) 32rem, 28rem"
            className={`${objectClass} transition-transform duration-700 ease-out group-hover/card:scale-[1.04]`}
          />
          {/* Bottom gradient veil — appears on hover for legibility */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background:
                "linear-gradient(to top, rgba(3,7,11,0.92) 0%, rgba(3,7,11,0.55) 35%, transparent 60%)",
            }}
          />
          {/* Accent edge glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            }}
          />
        </div>

        {/* Hover overlay with project metadata */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 px-6 pb-6 opacity-0 transition-all duration-500 group-hover/card:translate-y-0 group-hover/card:opacity-100">
          <div className="mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)]">
            <span
              className="inline-block size-1.5 animate-pulse-soft rounded-full"
              style={{ background: statusDotColor(project.status) }}
            />
            {project.status}
            <span className="opacity-30">·</span>
            <span>{project.year}</span>
          </div>
          <h3 className="font-serif text-2xl leading-tight text-[var(--color-fg)] md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 max-w-[90%] text-sm leading-relaxed text-[var(--color-fg-muted)]">
            {project.tagline}
          </p>
          <div className="mt-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
            View case study
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function HeroParallaxProjects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sc = { stiffness: 220, damping: 28, mass: 0.6 };
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1100]),
    sc,
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1100]),
    sc,
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [16, 0]),
    sc,
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.18], [0.25, 1]),
    sc,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [22, 0]),
    sc,
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-680, 220]),
    sc,
  );

  // 3 rows of 3 projects each.
  const row1 = projects.slice(0, 3);
  const row2 = projects.slice(3, 6);
  const row3 = projects.slice(6, 9);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative h-[230vh] overflow-hidden border-t border-[var(--color-border)] py-32 antialiased"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Section header — sticks to top while parallax unfolds */}
      <div className="relative mx-auto max-w-[var(--container-screen)] px-6 md:px-10 lg:px-16">
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
          Selected projects · 9 of 23
        </p>
        <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-tight text-[var(--color-fg)]">
          Production builds, end-to-end.
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-fg-muted)] md:text-base">
          Every tile is shipped. Hover to read; click for the architecture, the
          constraints, and the numbers.
        </p>
      </div>

      {/* Parallax stage */}
      <motion.div
        style={{ rotateX, rotateZ, translateY, opacity }}
        className="relative mt-20"
      >
        <motion.div className="mb-16 flex flex-row-reverse space-x-reverse space-x-12 md:space-x-20">
          {row1.map((p) => (
            <ProductCard key={p.slug} project={p} translate={translateX} />
          ))}
        </motion.div>
        <motion.div className="mb-16 flex flex-row space-x-12 md:space-x-20">
          {row2.map((p) => (
            <ProductCard
              key={p.slug}
              project={p}
              translate={translateXReverse}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-12 md:space-x-20">
          {row3.map((p) => (
            <ProductCard key={p.slug} project={p} translate={translateX} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
