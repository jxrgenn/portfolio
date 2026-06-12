import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectAccentSection } from "@/components/ProjectAccentSection";
import { ProjectHeroCard } from "@/components/ProjectHeroCard";
import { ProjectGallery } from "@/components/ProjectGallery";
import { Stamp } from "@/components/editorial/Stamp";
import { SectionMast } from "@/components/editorial/SectionMast";
import { getImageMeta } from "@/lib/imageMeta";
import {
  getAllSlugs,
  getProject,
  projects,
  type ProjectShot,
  type ProjectStoryTable,
} from "@/lib/projects";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev").replace(/\/$/, "");

function shotsFromGallery(
  srcs: readonly string[],
  title: string,
): readonly ProjectShot[] {
  return srcs.map((src, i) => ({
    src,
    alt: `${title} — fig. ${String(i + 2).padStart(2, "0")}`,
  }));
}

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
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.title,
      description: project.tagline,
      type: "article",
      url: `/projects/${slug}`,
    },
  };
}

function isHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** http(s) URLs and site-relative paths (e.g. a PDF under /public) are linkable. */
function isLinkableHref(href: string): boolean {
  return isHttpUrl(href) || href.startsWith("/");
}

function StoryTable({ table }: { table: ProjectStoryTable }) {
  return (
    <figure className="mt-8 overflow-x-auto">
      {table.caption ? (
        <figcaption
          className="mb-3 font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
        >
          {table.caption}
        </figcaption>
      ) : null}
      <table
        className="w-full border-collapse border text-sm"
        style={{ borderColor: "var(--color-border)" }}
      >
        <thead>
          <tr style={{ background: "var(--color-bg-elevated)" }}>
            {table.headers.map((h) => (
              <th
                key={h}
                className="border px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-fg-subtle)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border px-3 py-2 align-top font-serif"
                  style={{
                    borderColor: "var(--color-border)",
                    color:
                      j === 0 ? "var(--color-fg)" : "var(--color-fg-muted)",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
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
  const heroMeta = await getImageMeta(project.hero);
  const heroWidth = heroMeta?.width ?? 1600;
  const heroHeight = heroMeta?.height ?? 1000;

  const projectUrl = `${SITE_URL}/projects/${slug}`;
  const datePublishedIso = `${project.year}-01-01`;
  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.tagline,
    abstract: project.pitch,
    text: project.essay,
    url: projectUrl,
    image: `${SITE_URL}${project.hero}`,
    inLanguage: "en",
    datePublished: datePublishedIso,
    dateCreated: String(project.year),
    dateModified: new Date().toISOString(),
    keywords: project.stack.join(", "),
    creativeWorkStatus: project.status,
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/about#person`,
      name: "Jurgen Halili",
      url: `${SITE_URL}/about`,
    },
    isPartOf: { "@type": "WebSite", url: SITE_URL, name: "Jurgen Halili" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${SITE_URL}/#cases`,
      },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  return (
    <ProjectAccentSection slug={project.slug}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
        <div className="mx-auto max-w-4xl">
          <ProjectHeroCard
            src={project.hero}
            alt={project.heroAlt}
            width={heroWidth}
            height={heroHeight}
            contain={project.imageMode === "contain"}
          />
          <p
            className="mt-3 font-serif italic"
            style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
          >
            fig. 01 — {project.heroAlt}
          </p>
        </div>
      </section>

      {/* === FILM === */}
      {project.video ? (
        <section className="px-6 pb-20 md:px-10 lg:px-16">
          <div className="mx-auto max-w-sm md:max-w-md">
            <video
              controls
              playsInline
              preload="metadata"
              poster={project.video.poster}
              className="w-full"
              style={{
                display: "block",
                border: "1px solid var(--color-border)",
                background: "#000",
              }}
            >
              <source src={project.video.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {project.video.caption ? (
              <p
                className="mt-3 font-serif italic"
                style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
              >
                film — {project.video.caption}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* === ESSAY === */}
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
          <div className="col-span-12 md:col-span-9">
            <p
              className="font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)",
                lineHeight: 1.42,
                letterSpacing: "-0.005em",
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
                {project.essay.charAt(0)}
              </span>
              {project.essay.slice(1)}
            </p>
          </div>
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
      {(() => {
        const shots: readonly ProjectShot[] =
          project.shots && project.shots.length > 0
            ? project.shots
            : shotsFromGallery(project.gallery ?? [], project.title);
        if (shots.length === 0) return null;
        return (
          <section
            className="border-y px-6 py-20 md:px-10 md:py-24 lg:px-16"
            style={{
              borderColor: "var(--color-fg)",
              background: "var(--color-bg-elevated)",
            }}
          >
            <div
              className="mx-auto max-w-5xl flex items-baseline justify-between border-b pb-3"
              style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
            >
              <h2
                className="font-serif"
                style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
              >
                <span style={{ fontStyle: "italic" }}>Gallery</span>
              </h2>
              <p
                className="font-serif italic"
                style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
              >
                {shots.length} {shots.length === 1 ? "frame" : "frames"}
              </p>
            </div>
            <div className="mt-12 md:mt-16">
              <ProjectGallery shots={shots} />
            </div>
          </section>
        );
      })()}

      {/* === STORY (long-form write-up) === */}
      {project.story ? (
        <section className="px-6 py-20 md:px-10 md:py-24 lg:px-16">
          <div
            className="flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-fg)", borderBottomWidth: 2 }}
          >
            <h2
              className="font-serif"
              style={{ color: "var(--color-fg)", fontSize: 22, fontWeight: 500 }}
            >
              <span style={{ fontStyle: "italic" }}>{project.story.title}</span>
            </h2>
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 13 }}
            >
              field notes
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-3xl">
            {project.story.sections.map((section, i) => (
              <div key={section.heading ?? i} className={i === 0 ? "" : "mt-14"}>
                {section.heading ? (
                  <h3
                    className="font-serif"
                    style={{
                      color: "var(--color-fg)",
                      fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.015em",
                      fontWeight: 500,
                    }}
                  >
                    {section.heading}
                  </h3>
                ) : null}
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="mt-5 font-serif"
                    style={{
                      color: "var(--color-fg-muted)",
                      fontSize: 17,
                      lineHeight: 1.65,
                    }}
                  >
                    {p}
                  </p>
                ))}
                {section.table ? <StoryTable table={section.table} /> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

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
                {isLinkableHref(link.href) ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel={isHttpUrl(link.href) ? "noopener noreferrer" : undefined}
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
