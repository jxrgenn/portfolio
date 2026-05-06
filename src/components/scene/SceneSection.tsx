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
}) {
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
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col px-6 py-24 md:px-10 md:py-32 lg:px-16">
        {children}
      </div>
    </section>
  );
}
