"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

export function ProjectHeroCard({
  src,
  alt,
  width,
  height,
  contain = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  contain?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [supportsHover, setSupportsHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5.5, -5.5]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-7.5, 7.5]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setSupportsHover(mq.matches);
    const onChange = () => setSupportsHover(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const hx = useTransform(x, (v) => `${(v + 0.5) * 100}%`);
  const hy = useTransform(y, (v) => `${(v + 0.5) * 100}%`);
  const highlight = useMotionTemplate`radial-gradient(55% 55% at ${hx} ${hy}, rgba(255,255,255,0.18), transparent 65%)`;

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        rotateX: supportsHover ? rotX : 0,
        rotateY: supportsHover ? rotY : 0,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        border: "2px solid var(--color-fg)",
        background: "var(--color-bg-overlay)",
        boxShadow: "12px 12px 0 0 var(--project-accent)",
        willChange: "transform",
      }}
      onPointerMove={
        supportsHover
          ? (e) => {
              const rect = ref.current?.getBoundingClientRect();
              if (!rect) return;
              x.set((e.clientX - rect.left) / rect.width - 0.5);
              y.set((e.clientY - rect.top) / rect.height - 0.5);
            }
          : undefined
      }
      onPointerLeave={
        supportsHover
          ? () => {
              x.set(0);
              y.set(0);
            }
          : undefined
      }
    >
      <div className={contain ? "relative aspect-[16/10] w-full" : "relative w-full"}>
        {contain ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1280px) 1024px, 100vw"
            className="object-contain p-12 md:p-16"
            priority
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 1280px) 1024px, 100vw"
            className="block h-auto w-full"
            priority
          />
        )}
      </div>
      {supportsHover && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: highlight }}
        />
      )}
    </motion.div>
  );
}
