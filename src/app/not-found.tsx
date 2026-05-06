import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TextGenerateEffect } from "@/components/effects/TextGenerateEffect";
import { BackgroundBoxes } from "@/components/effects/BackgroundBoxes";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] flex-1 flex-col items-center justify-center overflow-hidden px-6 py-24">
      <BackgroundBoxes />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 700px 500px at 50% 30%, rgba(244,114,182,0.18) 0%, transparent 60%)",
        }}
      />
      <p className="font-serif text-[10rem] leading-none tracking-tighter text-transparent md:text-[14rem]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #22d3ee, #a78bfa 50%, #f472b6)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        404
      </p>
      <h1 className="mt-2 max-w-2xl text-center font-serif text-3xl leading-tight text-[var(--color-fg)] md:text-5xl">
        <TextGenerateEffect text="I haven't built that one — yet." />
      </h1>
      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-bg-elevated)]/40 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-[var(--color-fg)] backdrop-blur transition-colors hover:bg-[var(--color-bg-overlay)]/60"
      >
        <ArrowLeft className="size-3.5" /> back home
      </Link>
    </section>
  );
}
