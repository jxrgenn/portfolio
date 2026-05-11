"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type Tone = "warm" | "cool";

export function SceneSection({
  id,
  backdrop,
  tone,
  accent,
  className = "",
  children,
  priority = false,
  style,
  compact = false,
}: {
  id?: string;
  backdrop: string;
  tone: Tone;
  /** Optional data-accent slug to wire --project-accent for inner elements. */
  accent?: string;
  className?: string;
  children: ReactNode;
  priority?: boolean;
  style?: CSSProperties;
  /**
   * When true, skips the full-viewport min-height on mobile + uses tighter
   * vertical padding. Used by stacked scene lists (SelectedWork) so 6 projects
   * don't add up to 6 full viewport heights of scroll on a phone.
   */
  compact?: boolean;
}) {
  const innerHeightClass = compact
    ? "min-h-[60svh] md:min-h-[100svh]"
    : "min-h-[100svh]";
  const paddingClass = compact
    ? "py-16 md:py-32"
    : "py-20 md:py-32";
  return (
    <section
      id={id}
      data-scene-tone={tone}
      data-accent={accent}
      className={`scene-section ${className}`}
      style={style}
    >
      <Image
        src={backdrop}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        className="scene-backdrop"
      />
      <div className="scene-caustics" aria-hidden />
      <div
        className={`relative z-10 mx-auto flex w-full max-w-7xl flex-col px-6 ${paddingClass} md:px-10 lg:px-16 ${innerHeightClass}`}
      >
        {children}
      </div>
    </section>
  );
}
