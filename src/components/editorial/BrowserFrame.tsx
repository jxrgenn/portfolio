import Image from "next/image";

/**
 * Clean browser-window frame — title bar with three traffic lights and an
 * optional URL pill, then the screenshot below. No fake hardware chrome.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  priority,
}: {
  src: string;
  alt: string;
  url?: string;
  priority?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-lg shadow-[0_30px_80px_-20px_rgba(26,24,21,0.35)]"
      style={{
        background: "#0b0f15",
        border: "1px solid color-mix(in oklch, var(--color-fg) 18%, transparent)",
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          background: "#0a0d12",
          borderBottom: "1px solid #ffffff10",
        }}
      >
        <span className="size-2.5 rounded-full" style={{ background: "#fb7185" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#fbbf24" }} />
        <span className="size-2.5 rounded-full" style={{ background: "#34d399" }} />
        {url ? (
          <div
            className="ml-3 flex h-6 max-w-md flex-1 items-center justify-center rounded font-serif italic"
            style={{
              background: "#ffffff08",
              color: "#ffffff80",
              fontSize: 11,
            }}
          >
            {url}
          </div>
        ) : (
          <div
            className="ml-3 h-6 max-w-md flex-1 rounded"
            style={{ background: "#ffffff08" }}
          />
        )}
      </div>
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover object-top"
          priority={priority}
        />
      </div>
    </div>
  );
}
