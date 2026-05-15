import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0612 0%, #1a0e2c 50%, #0a0612 100%)",
          color: "#f1f5f9",
          fontFamily: "serif",
          fontWeight: 500,
          fontSize: 38,
          letterSpacing: -1,
        }}
      >
        jh
      </div>
    ),
    { ...size },
  );
}
