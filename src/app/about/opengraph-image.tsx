import { ImageResponse } from "next/og";

export const alt =
  "About Jurgen Halili — bio, work history, certifications, and skills.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse 1100px 700px at 80% 18%, #1a1228 0%, #0a0612 60%, #050308 100%)",
          color: "#e4eaf0",
          display: "flex",
          flexDirection: "column",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#7b8a99",
            display: "flex",
          }}
        >
          jurgenhalili.dev / about
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
              fontSize: 92,
              lineHeight: 1.0,
              color: "#f1f5f9",
              fontWeight: 600,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            About.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 36,
              lineHeight: 1.3,
              color: "#a3b1c0",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            Five years engineering. BSc Software Engineering. MERN + Next.js +
            Anthropic / OpenAI / Gemini SDKs. Microsoft Business Central on
            the other rail.
          </div>
          <div
            style={{
              marginTop: 36,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#a78bfa",
                boxShadow: "0 0 16px #a78bfa",
              }}
            />
            <div
              style={{
                fontSize: 22,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: "#7b8a99",
                display: "flex",
              }}
            >
              sq · en · de
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
