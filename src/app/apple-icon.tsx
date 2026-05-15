import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 30% 30%, #1a0e2c 0%, #0a0612 70%, #050208 100%)",
          color: "#f1f5f9",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 500,
            letterSpacing: -3,
            lineHeight: 1,
            display: "flex",
          }}
        >
          jh
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 14,
            letterSpacing: 4,
            color: "#7b8a99",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            display: "flex",
          }}
        >
          portfolio
        </div>
      </div>
    ),
    { ...size },
  );
}
