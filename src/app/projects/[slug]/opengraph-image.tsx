import { ImageResponse } from "next/og";
import { getProject, getAllSlugs } from "@/lib/projects";

export const alt = "Project — Jurgen Halili";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

const STATUS_COLOR: Record<string, string> = {
  shipped: "#22d3ee",
  "in-progress": "#fbbf24",
  prototype: "#a78bfa",
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  const title = project?.title ?? "Project";
  const tagline =
    project?.tagline ??
    "A featured build — full-stack, AI-focused, shipped end-to-end.";
  const year = project?.year?.toString() ?? "";
  const status = project?.status ?? "shipped";
  const statusColor = STATUS_COLOR[status] ?? "#22d3ee";
  const stack = project?.stack.slice(0, 3).join("  ·  ") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 1100px 700px at 18% 18%, #0a1822 0%, #050a10 65%, #03070b 100%)",
          color: "#e4eaf0",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7b8a99",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex" }}>Jurgen Halili</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: statusColor,
                boxShadow: `0 0 16px ${statusColor}`,
              }}
            />
            <div style={{ display: "flex" }}>
              {status} {year ? `· ${year}` : ""}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.05,
              color: "#f1f5f9",
              fontWeight: 600,
              letterSpacing: -1.5,
              display: "flex",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              lineHeight: 1.3,
              color: "#a3b1c0",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            {tagline}
          </div>
          {stack ? (
            <div
              style={{
                marginTop: 36,
                fontSize: 22,
                letterSpacing: 1.2,
                color: "#7b8a99",
                display: "flex",
              }}
            >
              {stack}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
