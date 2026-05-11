import { ImageResponse } from "next/og";

export const alt =
  "Contact Jurgen Halili — full-stack engineer in Kiel, Germany.";
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
            "radial-gradient(ellipse 1100px 700px at 30% 20%, #122118 0%, #060a08 60%, #03050a 100%)",
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
          jurgenhalili.dev / contact
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
              fontSize: 96,
              lineHeight: 1.0,
              color: "#f1f5f9",
              fontWeight: 600,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            Let&rsquo;s build.
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
            Available for full-time AI-focused full-stack roles and high-impact
            contracts. Replies within 48h.
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
                background: "#34d399",
                boxShadow: "0 0 16px #34d399",
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
              Kiel · CET / CEST
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
