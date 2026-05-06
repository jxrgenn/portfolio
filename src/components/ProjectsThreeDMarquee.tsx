import { CaseFile, type CaseFileEntry } from "@/components/editorial/CaseFile";
import { SectionMast } from "@/components/editorial/SectionMast";
import { projects } from "@/lib/projects";

/**
 * Editorial cases section — the nine projects rendered as case-file rows.
 * (Component name preserved for backward-compat with imports; the visual
 * has nothing to do with the previous tilted marquee.)
 */
export function ProjectsThreeDMarquee() {
  const entries: CaseFileEntry[] = projects.map((p) => ({
    number: String(p.order).padStart(2, "0"),
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    status: p.status,
    metrics: p.metrics.slice(0, 3).map((m) => ({
      value: m.value,
      label: m.label.split("(")[0].split(",")[0].trim().toLowerCase(),
    })),
  }));

  return (
    <section id="cases" className="relative" style={{ background: "var(--color-bg)" }}>
      <SectionMast number="03" label="THE CASE FILES" meta="nine entries · 2024 → 2026" />

      <div className="px-6 md:px-10 lg:px-16">
        {/* Section opener — editorial intro */}
        <div className="grid grid-cols-12 gap-6 pt-20 pb-12">
          <div className="col-span-12 md:col-span-4">
            <p
              className="font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
            >
              Volume 01 — Selected projects
            </p>
            <h2
              className="mt-3 font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                fontWeight: 500,
              }}
            >
              <span style={{ fontStyle: "italic" }}>Nine</span> systems,
              <br />
              shipped solo.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <p
              className="font-serif"
              style={{
                color: "var(--color-fg)",
                fontSize: "clamp(1.05rem, 1.4vw, 1.25rem)",
                lineHeight: 1.55,
              }}
            >
              Each entry below is a case file with its own deep dive — the
              architecture, the constraints, the numbers. Click any title to
              open the full study.
            </p>
            <p
              className="mt-3 font-serif italic"
              style={{ color: "var(--color-fg-muted)", fontSize: 14 }}
            >
              Hover a case to see its mark.
            </p>
          </div>
        </div>

        {/* Case file rows */}
        <div>
          {entries.map((entry) => (
            <CaseFile key={entry.slug} entry={entry} />
          ))}
          <div
            className="border-t"
            style={{ borderColor: "var(--color-fg)", borderTopWidth: 2 }}
          />
        </div>
      </div>
    </section>
  );
}
