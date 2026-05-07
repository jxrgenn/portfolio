import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectAccentSection } from "@/components/ProjectAccentSection";
import { ProjectHeroCard } from "@/components/ProjectHeroCard";
import { Stamp } from "@/components/editorial/Stamp";
import { SectionMast } from "@/components/editorial/SectionMast";
import { getAllSlugs, getProject, projects } from "@/lib/projects";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: "article",
    },
  };
}

function isHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;
  const caseNum = String(project.order).padStart(2, "0");
  const heroObjectClass =
    project.imageMode === "contain"
      ? "object-contain p-12 md:p-16"
      : "object-cover";

  return (
    <ProjectAccentSection slug={project.slug}>
      <SectionMast
        number={`Case ${caseNum}`}
        label={project.title.toUpperCase()}
        meta={`${project.status} — ${project.year}`}
      />

      {/* === HEAD === */}
      <header className="px-6 pt-20 pb-12 md:px-10 md:pt-28 md:pb-20 lg:px-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-2">
            <Link
              href="/#cases"
              className="font-serif italic transition-colors hover:text-[var(--color-accent)]"
              style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
            >
              ← all cases
            </Link>
            <p
              className="mt-12 font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              Case
            </p>
            <p
              className="font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(3rem, 5vw, 5rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                fontWeight: 500,
              }}
            >
              {caseNum}
            </p>
          </div>

          <div className="col-span-12 md:col-span-7">
            <h1
              className="font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(2.8rem, 6.5vw, 6rem)",
                lineHeight: 0.96,
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              {project.title}
            </h1>
            <p
              className="mt-6 max-w-2xl font-serif"
              style={{
                color: "var(--color-fg-muted)",
                fontSize: "clamp(1.2rem, 1.6vw, 1.5rem)",
                lineHeight: 1.4,
              }}
            >
              {project.tagline}
            </p>
          </div>

          <div className="col-span-12 flex items-start justify-end md:col-span-3">
            <Stamp status={project.status} />
          </div>
        </div>
      </header>

      {/* === HERO IMAGE === */}
      <section className="px-6 pb-20 md:px-10 lg:px-16">
        <ProjectHeroCard
          src={project.hero}
          alt={project.heroAlt}
          objectClass={heroObjectClass}
        />
        <p
          className="mt-3 font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          fig. 01 — {project.heroAlt}
        </p>
      </section>

      {/* === PITCH === */}
      <section
        className="border-y px-6 py-20 md:px-10 md:py-24 lg:px-16"
        style={{ borderColor: "var(--color-fg)", background: "var(--color-bg-elevated)" }}
      >
        <div className="grid grid-cols-12 gap-6">
          <p
            className="col-span-12 font-serif italic md:col-span-2"
            style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
          >
            The pitch
          </p>
          <p
            className="col-span-12 font-serif md:col-span-9"
            style={{
              color: "var(--color-fg)",
              fontSize: "clamp(1.4rem, 2.2vw, 2rem)",
              lineHeight: 1.32,
              letterSpacing: "-0.01em",
            }}
          >
            <span
              className="float-left mr-3 -mt-2 font-serif"
              style={{
                color: "var(--color-accent)",
                fontSize: "5rem",
                lineHeight: 0.85,
                fontWeight: 600,
              }}
            >
              {project.pitch.charAt(0)}
            </span>
            {project.pitch.slice(1)}
          </p>
        </div>
      </section>

      {/* === NUMBERS === */}
      <section className="px-6 py-20 md:px-10 md:py-24 lg:px-16">
        <div
          className="flex items-baseline justify-between border-b pb-3"
          style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
        >
          <h2
            className="font-serif"
            style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
          >
            <span style={{ fontStyle: "italic" }}>By the numbers</span>
          </h2>
          <p
            className="font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            {project.metrics.length} measurements
          </p>
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {project.metrics.slice(0, 6).map((m) => (
            <div key={m.label}>
              <dd
                className="font-serif"
                style={{
                  color: "var(--color-fg)",
                  fontSize: "clamp(2.4rem, 4vw, 4rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  fontWeight: 500,
                }}
              >
                {m.value}
              </dd>
              <dt
                className="mt-3 font-serif italic"
                style={{ color: "var(--color-fg-muted)", fontSize: 13, lineHeight: 1.3 }}
              >
                {m.label}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* === UNDER THE HOOD === */}
      <section
        className="border-y px-6 py-20 md:px-10 md:py-24 lg:px-16"
        style={{ borderColor: "var(--color-fg)", background: "var(--color-bg-elevated)" }}
      >
        <div
          className="flex items-baseline justify-between border-b pb-3"
          style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
        >
          <h2
            className="font-serif"
            style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
          >
            <span style={{ fontStyle: "italic" }}>Under the hood</span>
          </h2>
          <p
            className="font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            three notes
          </p>
        </div>
        <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-8">
          {project.underHood.map((entry, i) => (
            <article key={entry.path + entry.title} className="relative">
              <p
                className="font-serif italic"
                style={{ color: "var(--color-accent)", fontSize: 13 }}
              >
                Note 0{i + 1}
              </p>
              <h3
                className="mt-2 font-serif"
                style={{
                  color: "var(--color-fg)",
                  fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  fontWeight: 500,
                }}
              >
                {entry.title}
              </h3>
              <p
                className="mt-3 font-serif"
                style={{ color: "var(--color-fg-muted)", fontSize: 15, lineHeight: 1.55 }}
              >
                {entry.body}
              </p>
              <code
                className="mt-4 block font-mono"
                style={{
                  color: "var(--color-fg-subtle)",
                  fontSize: 11,
                  letterSpacing: "0.02em",
                }}
              >
                {entry.path}
              </code>
            </article>
          ))}
        </div>
      </section>

      {/* === STACK === */}
      <section className="px-6 py-20 md:px-10 md:py-24 lg:px-16">
        <div
          className="flex items-baseline justify-between border-b pb-3"
          style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
        >
          <h2
            className="font-serif"
            style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
          >
            <span style={{ fontStyle: "italic" }}>Stack</span>
          </h2>
          <p
            className="font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            {Object.keys(project.techStack).length} categories
          </p>
        </div>
        <dl className="mt-2">
          {Object.entries(project.techStack).map(([group, items]) => (
            <div
              key={group}
              className="grid grid-cols-12 gap-4 border-t py-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              <dt
                className="col-span-12 font-serif italic md:col-span-3"
                style={{ color: "var(--color-accent)", fontSize: 15 }}
              >
                {group}
              </dt>
              <dd
                className="col-span-12 font-serif md:col-span-9"
                style={{
                  color: "var(--color-fg)",
                  fontSize: 16,
                  lineHeight: 1.55,
                }}
              >
                {items?.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* === GALLERY === */}
      {project.gallery && project.gallery.length > 0 && (
        <section
          className="border-y px-6 py-20 md:px-10 md:py-24 lg:px-16"
          style={{ borderColor: "var(--color-fg)", background: "var(--color-bg-elevated)" }}
        >
          <div
            className="flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
          >
            <h2
              className="font-serif"
              style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
            >
              <span style={{ fontStyle: "italic" }}>More shots</span>
            </h2>
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              {project.gallery.length} {project.gallery.length === 1 ? "frame" : "frames"}
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {project.gallery.map((src, i) => {
              const isMobile = src.includes("mobile") || src.includes("check-");
              return (
                <figure key={src}>
                  <div
                    className={`relative w-full overflow-hidden ${
                      isMobile ? "aspect-[9/19]" : "aspect-[16/10]"
                    }`}
                    style={{
                      border: "2px solid var(--color-fg)",
                      background: isMobile ? "#000" : "var(--color-bg-overlay)",
                    }}
                  >
                    <Image
                      src={src}
                      alt={`${project.title} frame ${i + 2}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className={isMobile ? "object-contain" : "object-cover object-top"}
                    />
                  </div>
                  <figcaption
                    className="mt-2 font-serif italic"
                    style={{ color: "var(--color-fg-muted)", fontSize: 12 }}
                  >
                    fig. 0{i + 2}
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      )}

      {/* === LIFT QUOTE === */}
      <section className="px-6 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <p
            className="font-serif italic"
            style={{ color: "var(--color-accent)", fontSize: 14, marginBottom: 16 }}
          >
            In their own words
          </p>
          <p
            className="font-serif"
            style={{
              color: "var(--color-fg)",
              fontSize: "clamp(1.7rem, 3.4vw, 2.8rem)",
              lineHeight: 1.2,
              letterSpacing: "-0.015em",
            }}
          >
            <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>“</span>
            {project.liftQuote.replace(/^["']|["']$/g, "")}
            <span style={{ color: "var(--color-accent)", fontStyle: "italic" }}>”</span>
          </p>
          <p
            className="mt-6 font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 14, lineHeight: 1.55 }}
          >
            {project.timeline}
          </p>
        </div>
      </section>

      {/* === LINKS === */}
      {project.links.length > 0 && (
        <section
          className="border-y px-6 py-16 md:px-10 md:py-20 lg:px-16"
          style={{ borderColor: "var(--color-fg)", background: "var(--color-bg-elevated)" }}
        >
          <div
            className="flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
          >
            <h2
              className="font-serif"
              style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
            >
              <span style={{ fontStyle: "italic" }}>Links</span>
            </h2>
          </div>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {project.links.map((link) => (
              <li
                key={link.label + link.href}
                className="flex items-baseline gap-3 font-serif"
                style={{ color: "var(--color-fg)", fontSize: 15 }}
              >
                <span className="font-serif italic" style={{ color: "var(--color-fg-muted)" }}>
                  {link.label}
                </span>
                <span style={{ color: "var(--color-border)" }}>—</span>
                {isHttpUrl(link.href) ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--color-accent)",
                      textDecoration: "underline",
                      textDecorationStyle: "dotted",
                      textUnderlineOffset: 4,
                    }}
                  >
                    {link.href}
                  </a>
                ) : (
                  <span>{link.href}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* === PREV / NEXT === */}
      <nav
        aria-label="Project pagination"
        className="px-6 py-12 md:px-10 lg:px-16"
      >
        <div className="grid grid-cols-2 gap-6">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 15 }}
            >
              ← Case {String(prev.order).padStart(2, "0")} — {prev.title}
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="text-right font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 15 }}
            >
              Case {String(next.order).padStart(2, "0")} — {next.title} →
            </Link>
          ) : (
            <span aria-hidden />
          )}
        </div>
      </nav>
    </ProjectAccentSection>
  );
}
