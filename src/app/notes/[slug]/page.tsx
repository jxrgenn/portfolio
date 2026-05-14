import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNoteSlugs, getNote, type NoteSection } from "@/lib/notes";
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
      modifiedTime: note.dateModified ?? note.date,
      authors: ["Jurgen Halili"],
    },
  };
}

function SectionTable({
  table,
}: {
  table: NonNullable<NoteSection["table"]>;
}) {
  return (
    <figure className="mt-6 overflow-x-auto">
      {table.caption ? (
        <figcaption className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
          {table.caption}
        </figcaption>
      ) : null}
      <table className="w-full border-collapse border border-[var(--color-border)] text-sm">
        <thead>
          <tr className="bg-[var(--color-bg-elevated)]/50">
            {table.headers.map((h) => (
              <th
                key={h}
                className="border border-[var(--color-border)] px-3 py-2 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-subtle)]"
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
                  className="border border-[var(--color-border)] px-3 py-2 align-top text-[var(--color-fg-muted)]"
                  style={{ fontSize: "0.95rem", lineHeight: 1.5 }}
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
    dateModified: note.dateModified ?? note.date,
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
    ...(note.citations && note.citations.length > 0
      ? {
          citation: note.citations.map((c) => ({
            "@type": "CreativeWork",
            name: c.label,
            url: c.url,
          })),
        }
      : {}),
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

  const faqJsonLd = note.faq && note.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: note.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable='answer-box']", "h1"],
    },
  };

  // Split the pull quotes across the body — one after each ~third of sections.
  const pullQuotes = note.pullQuotes ?? [];
  const sectionsWithQuotes = note.sections.map((section, i) => {
    const quoteIdx =
      pullQuotes.length > 0 &&
      i > 0 &&
      i % Math.max(2, Math.ceil(note.sections.length / pullQuotes.length)) === 0
        ? Math.min(
            Math.floor(i / Math.ceil(note.sections.length / pullQuotes.length)) - 1,
            pullQuotes.length - 1,
          )
        : -1;
    return { section, quoteIdx };
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
      />

      <article className="relative mx-auto max-w-[var(--container-prose)] px-6 pb-32 pt-32 md:px-8 md:pt-44">
        <header className="border-b border-[var(--color-border)] pb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
            Notes · {note.date}
            {note.dateModified && note.dateModified !== note.date
              ? ` · updated ${note.dateModified}`
              : ""}
            {" · "}
            {note.readingMinutes} min read
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

          {/* Author micro-bio at top */}
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
            <Link
              href="/about"
              className="hover:text-[var(--color-accent)]"
            >
              By Jurgen Halili
            </Link>
            {" · "}
            Freelance full-stack engineer · Kiel, Germany
          </p>
        </header>

        {/* Answer box — front-loaded, the chunk that AI engines extract */}
        <div
          data-speakable="answer-box"
          className="mt-8 border-l-2 pl-5"
          style={{ borderColor: "var(--color-accent)" }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent)]">
            Answer
          </p>
          <p
            className="mt-3 text-[var(--color-fg)]"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1.1rem",
              lineHeight: 1.55,
              fontWeight: 400,
            }}
          >
            {note.answerBox}
          </p>
        </div>

        {/* Italic lede */}
        <p
          className="mt-10 font-serif text-[var(--color-fg-muted)]"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
            lineHeight: 1.5,
            fontStyle: "italic",
            fontWeight: 300,
          }}
        >
          {note.lede}
        </p>

        {/* Body sections, interleaved with pull quotes */}
        <div className="mt-10 space-y-12">
          {sectionsWithQuotes.map(({ section, quoteIdx }, i) => (
            <div key={i}>
              <section>
                {section.heading ? (
                  <h2
                    className="text-[var(--color-fg)]"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
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
                {section.table ? <SectionTable table={section.table} /> : null}
              </section>

              {quoteIdx >= 0 && pullQuotes[quoteIdx] ? (
                <blockquote
                  className="my-12 border-l-2 pl-6"
                  style={{ borderColor: "var(--color-accent)" }}
                >
                  <p
                    className="font-serif text-[var(--color-fg)]"
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: "clamp(1.25rem, 2vw, 1.55rem)",
                      fontStyle: "italic",
                      fontWeight: 400,
                      lineHeight: 1.35,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    &ldquo;{pullQuotes[quoteIdx].quote}&rdquo;
                  </p>
                  {pullQuotes[quoteIdx].attribution ? (
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
                      — {pullQuotes[quoteIdx].attribution}
                    </p>
                  ) : null}
                </blockquote>
              ) : null}
            </div>
          ))}
        </div>

        {/* FAQ block */}
        {note.faq && note.faq.length > 0 ? (
          <section className="mt-20 border-t border-[var(--color-border)] pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
              FAQ
            </p>
            <h2
              className="mt-3 text-[var(--color-fg)]"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
                fontWeight: 500,
                letterSpacing: "-0.012em",
              }}
            >
              Common questions
            </h2>
            <dl className="mt-8 space-y-8">
              {note.faq.map((item, i) => (
                <div key={i}>
                  <dt
                    className="text-[var(--color-fg)]"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1.05rem",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.q}
                  </dt>
                  <dd
                    className="mt-2 text-[var(--color-fg-muted)]"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "1rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {/* Sources */}
        {note.citations && note.citations.length > 0 ? (
          <section className="mt-16 border-t border-[var(--color-border)] pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
              Sources & further reading
            </p>
            <ul className="mt-6 space-y-3">
              {note.citations.map((c) => (
                <li
                  key={c.url}
                  className="text-sm text-[var(--color-fg-muted)]"
                  style={{ lineHeight: 1.55 }}
                >
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-[var(--color-accent)] underline decoration-dotted underline-offset-4 hover:opacity-80"
                  >
                    {c.label}
                  </a>
                  {c.relevance ? (
                    <span className="text-[var(--color-fg-subtle)]">
                      {" — "}
                      {c.relevance}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Author bio at bottom */}
        <section className="mt-20 border-t border-[var(--color-border)] pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-fg-subtle)]">
            About the author
          </p>
          <p
            className="mt-4 text-[var(--color-fg-muted)]"
            style={{ fontFamily: "var(--font-sans)", lineHeight: 1.65 }}
          >
            <Link
              href="/about"
              className="font-medium text-[var(--color-fg)] hover:text-[var(--color-accent)]"
            >
              Jurgen Halili
            </Link>
            {" "}is a freelance full-stack software engineer based in Kiel,
            Germany. AI-driven products end-to-end — agent runtimes,
            multi-LLM pipelines, React Native, Postgres. Microsoft Dynamics 365
            / Business Central on the other rail. Available for freelance
            contracts in Germany and remote-EU.{" "}
            <Link
              href="/"
              className="text-[var(--color-accent)] underline decoration-dotted underline-offset-4 hover:opacity-80"
            >
              See more work →
            </Link>
          </p>
        </section>

        {related ? (
          <footer className="mt-16 border-t border-[var(--color-border)] pt-10">
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
