"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

export type MarqueeItem = {
  src: string;
  alt: string;
  href: string;
  accent: string;
  title: string;
};

/**
 * Aceternity-style Three D Marquee — a tilted 3D plane of image tiles
 * arranged in 4 columns. Columns oscillate vertically at different speeds
 * in opposite directions. Each tile is a clickable Link to its deep dive.
 */
export function ThreeDMarquee({
  items,
  className,
  height = 820,
}: {
  items: MarqueeItem[];
  className?: string;
  height?: number;
}) {
  // Distribute into 4 columns
  const chunkSize = Math.ceil(items.length / 4);
  const cols = Array.from({ length: 4 }, (_, i) =>
    items.slice(i * chunkSize, i * chunkSize + chunkSize),
  );

  return (
    <div
      className={cn(
        "relative mx-auto block w-full overflow-hidden",
        className,
      )}
      style={{
        height,
        perspective: "1200px",
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div
          className="grid grid-cols-4 gap-8 [transform-style:preserve-3d]"
          style={{
            transform:
              "rotateX(50deg) rotateY(0deg) rotateZ(-42deg) scale(1.15)",
          }}
        >
          {cols.map((col, i) => (
            <motion.div
              key={`col-${i}`}
              animate={{ y: i % 2 === 0 ? [-60, 60] : [60, -60] }}
              transition={{
                duration: i % 2 === 0 ? 11 : 16,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="flex flex-col items-start gap-6"
            >
              {col.map((item, j) => (
                <Link
                  key={`${i}-${j}-${item.src}`}
                  href={item.href}
                  aria-label={`Open ${item.title} case study`}
                  className="group relative block w-[240px]"
                >
                  <motion.div
                    whileHover={{ y: -10, scale: 1.04 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-xl ring-1 ring-white/15 transition-shadow duration-300 hover:ring-white/40 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="240px"
                      className="object-cover"
                    />
                    {/* Title plate at bottom */}
                    <div
                      className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end p-2.5"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(3,7,11,0.92) 0%, rgba(3,7,11,0.4) 70%, transparent 100%)",
                      }}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span
                          className="font-serif text-[13px] font-medium leading-none text-white"
                          style={{
                            textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          className="size-1.5 shrink-0 rounded-full"
                          style={{
                            background: item.accent,
                            boxShadow: `0 0 8px ${item.accent}`,
                          }}
                        />
                      </div>
                    </div>
                    {/* Hover accent tint */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        boxShadow: `inset 0 0 60px ${item.accent}66`,
                      }}
                    />
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
