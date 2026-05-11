import { ImageResponse } from "next/og";

export const alt =
  "Jurgen Halili — full-stack engineer with AI focus. Kiel, Germany.";
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
            "radial-gradient(ellipse 1100px 700px at 18% 18%, #0a1822 0%, #050a10 65%, #03070b 100%)",
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
          jurgenhalili.dev
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
            Jurgen Halili
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 38,
              lineHeight: 1.25,
              color: "#a3b1c0",
              maxWidth: 980,
              display: "flex",
            }}
          >
            Full-stack engineer building AI-driven products end-to-end —
            agent runtimes, multi-LLM pipelines, native apps.
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
                background: "#22d3ee",
                boxShadow: "0 0 16px #22d3ee",
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
              Kiel, Germany
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
