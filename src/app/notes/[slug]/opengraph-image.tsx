import { ImageResponse } from "next/og";
import { getAllNoteSlugs, getNote } from "@/lib/notes";

export const alt = "Notes — Jurgen Halili";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);

  const title = note?.title ?? "Notes";
  const date = note?.date ?? "";
  const minutes = note?.readingMinutes ? `${note.readingMinutes} min read` : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 1100px 700px at 78% 22%, #1a1422 0%, #0a070f 60%, #03020a 100%)",
          color: "#e4eaf0",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "serif",
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
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex" }}>jurgenhalili.dev / notes</div>
          <div style={{ display: "flex", gap: 12 }}>
            {date ? <div style={{ display: "flex" }}>{date}</div> : null}
            {minutes ? (
              <>
                <div style={{ display: "flex", color: "#4a5562" }}>·</div>
                <div style={{ display: "flex" }}>{minutes}</div>
              </>
            ) : null}
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
              fontSize: 60,
              lineHeight: 1.1,
              color: "#f1f5f9",
              fontWeight: 500,
              letterSpacing: -1.2,
              display: "flex",
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 22,
              letterSpacing: 1.4,
              color: "#a3b1c0",
              display: "flex",
              fontFamily: "sans-serif",
              textTransform: "uppercase",
            }}
          >
            Jurgen Halili — notes
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
