"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";

export function ProjectHeroCard({
  src,
  alt,
  objectClass,
}: {
  src: string;
  alt: string;
  objectClass: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
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

  const hx = useTransform(x, (v) => `${(v + 0.5) * 100}%`);
  const hy = useTransform(y, (v) => `${(v + 0.5) * 100}%`);
  const highlight = useMotionTemplate`radial-gradient(55% 55% at ${hx} ${hy}, rgba(255,255,255,0.18), transparent 65%)`;

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        border: "2px solid var(--color-fg)",
        background: "var(--color-bg-overlay)",
        boxShadow: "12px 12px 0 0 var(--project-accent)",
        willChange: "transform",
      }}
      onPointerMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1280px) 1200px, 100vw"
          className={objectClass}
          priority
        />
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: highlight }}
      />
    </motion.div>
  );
}
