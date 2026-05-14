import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNoteSlugs, getNote } from "@/lib/notes";
import { getProject } from "@/lib/projects";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jurgenhalili.dev";

export async function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.description,
    keywords: [...note.keywords],
    alternates: { canonical: `/notes/${slug}` },
    openGraph: {
      title: note.title,
      description: note.description,
      type: "article",
      url: `/notes/${slug}`,
      publishedTime: note.date,
      authors: ["Jurgen Halili"],
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const related = note.relatedProject ? getProject(note.relatedProject) : null;
  const url = `${SITE_URL}/notes/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: note.title,
    description: note.description,
    inLanguage: "en",
    datePublished: note.date,
    dateModified: note.date,
    keywords: note.keywords.join(", "),
    url,
    mainEntityOfPage: url,
    author: { "@id": `${SITE_URL}/about#person` },
    publisher: { "@id": `${SITE_URL}/about#person` },
    isPartOf: {
      "@type": "WebSite",
      url: SITE_URL,
      name: "Jurgen Halili",
    },
    ...(related
      ? {
          mentions: {
            "@type": "CreativeWork",
            name: related.title,
            url: `${SITE_URL}/projects/${related.slug}`,
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="relative mx-auto max-w-[var(--container-prose)] px-6 pb-32 pt-32 md:px-8 md:pt-44">
        <header className="border-b border-[var(--color-border)] pb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
            Notes · {note.date} · {note.readingMinutes} min read
          </p>
          <h1
            className="mt-5 font-serif text-[var(--color-fg)]"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(2rem, 4.6vw, 3.4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            {note.title}
          </h1>
        </header>

        <p
          className="mt-12 font-serif text-[var(--color-fg-muted)]"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(1.2rem, 1.9vw, 1.4rem)",
            lineHeight: 1.45,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {note.lede}
        </p>

        <div className="mt-10 space-y-12">
          {note.sections.map((section, i) => (
            <section key={i}>
              {section.heading ? (
                <h2
                  className="text-[var(--color-fg)]"
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: "clamp(1.3rem, 2vw, 1.65rem)",
                    fontWeight: 500,
                    letterSpacing: "-0.012em",
                    lineHeight: 1.18,
                  }}
                >
                  {section.heading}
                </h2>
              ) : null}
              <div className={section.heading ? "mt-5 space-y-5" : "space-y-5"}>
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-[var(--color-fg-muted)]"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.0625rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {related ? (
          <footer className="mt-20 border-t border-[var(--color-border)] pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
              The project this is from
            </p>
            <Link
              href={`/projects/${related.slug}`}
              className="mt-3 inline-flex items-baseline gap-2 font-serif text-2xl text-[var(--color-fg)] hover:text-[var(--color-accent)]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                letterSpacing: "-0.012em",
              }}
            >
              {related.title}
              <span aria-hidden className="text-[var(--color-accent)]">→</span>
            </Link>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-fg-subtle)]">
              {related.tagline}
            </p>
          </footer>
        ) : null}
      </article>
    </>
  );
}
