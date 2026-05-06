import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  const objectClass =
    project.imageMode === "contain"
      ? "object-contain p-12"
      : "object-cover";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-overlay)]">
        <Image
          src={project.hero}
          alt={project.heroAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={`${objectClass} transition-opacity duration-150 group-hover:opacity-95`}
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-medium text-[var(--color-fg)]">
            {project.title}
          </h3>
          <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
            {project.year}
          </span>
        </div>
        <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
          {project.tagline}
        </p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.stack.map((chip) => (
            <li
              key={chip}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 font-mono text-xs text-[var(--color-fg-subtle)]"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
