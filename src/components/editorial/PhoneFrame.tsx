import Image from "next/image";

/**
 * Real CSS-rendered iPhone frame — black bezel, dynamic island, side buttons,
 * proper screen mask. The screen content is whatever Image you pass in. No
 * pre-mocked phone PNGs; the bezel is real markup so it stays sharp at any size.
 */
export function PhoneFrame({
  src,
  alt,
  maxWidth = 260,
}: {
  src: string;
  alt: string;
  maxWidth?: number;
}) {
  return (
    <div
      className="relative mx-auto w-full"
      style={{
        maxWidth,
        aspectRatio: "9 / 19",
        background: "#0a0908",
        borderRadius: 38,
        border: "2px solid #1a1815",
        padding: 8,
        boxShadow:
          "0 30px 60px -10px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 80,
          right: -3,
          width: 3,
          height: 60,
          background: "#1a1815",
          borderRadius: 2,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 110,
          left: -3,
          width: 3,
          height: 36,
          background: "#1a1815",
          borderRadius: 2,
        }}
      />
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 156,
          left: -3,
          width: 3,
          height: 60,
          background: "#1a1815",
          borderRadius: 2,
        }}
      />
      <div
        className="relative h-full w-full overflow-hidden"
        style={{ borderRadius: 30, background: "#000" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${maxWidth}px`}
          className="object-cover object-top"
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 78,
            height: 22,
            background: "#000",
            borderRadius: 999,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.04)",
          }}
        />
      </div>
    </div>
  );
}
