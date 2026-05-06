import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid() {
  return (
    <section
      id="projects"
      className="border-t border-[var(--color-border)] px-6 py-32 md:px-10 md:py-48 lg:px-16"
    >
      <div className="mx-auto max-w-[var(--container-content)]">
        <header className="mb-16 flex items-end justify-between gap-8">
          <h2 className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
            Selected projects
          </h2>
          <span className="font-mono text-xs text-[var(--color-fg-subtle)]">
            {projects.length} / {projects.length}
          </span>
        </header>
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
