"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { Stamp } from "@/components/editorial/Stamp";

export type CaseFileMetric = { value: string; label: string };

export type CaseFileEntry = {
  number: string; // "01" .. "09"
  slug: string;
  title: string;
  tagline: string;
  status: "shipped" | "in-progress" | "prototype";
  metrics: CaseFileMetric[];
};

/**
 * Editorial case-file row — letterpress number, title with red ink underline
 * on hover, body tagline, metric ledger, rotated stamp on the right.
 * Whole row links to the project deep-dive.
 */
export function CaseFile({ entry }: { entry: CaseFileEntry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={`/projects/${entry.slug}`}
      data-accent={entry.slug}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative grid grid-cols-12 items-start gap-6 border-t py-12 transition-colors md:py-14"
      style={{
        borderColor: "var(--color-fg)",
        borderTopWidth: 2,
        color: "var(--color-fg)",
      }}
    >
      <div className="col-span-3 md:col-span-2">
        <p
          className="font-serif italic"
          style={{ color: "var(--color-fg-muted)", fontSize: 13, marginBottom: 4 }}
        >
          Case
        </p>
        <p
          className="font-serif"
          style={{
            color: "var(--color-fg)",
            fontSize: "clamp(3.5rem, 7vw, 6rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            fontWeight: 500,
          }}
        >
          {entry.number}
        </p>
      </div>

      <div className="col-span-9 md:col-span-7">
        <h3
          className="relative inline-block font-serif"
          style={{
            color: "var(--color-fg)",
            fontSize: "clamp(2rem, 3.4vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            fontWeight: 500,
          }}
        >
          {entry.title}
          <motion.span
            aria-hidden
            initial={false}
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.6, 0.2, 1] }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -6,
              height: 4,
              background: "var(--color-accent)",
              transformOrigin: "left center",
              borderRadius: 1,
            }}
          />
        </h3>
        <p
          className="mt-5 font-serif"
          style={{
            color: "var(--color-fg-muted)",
            fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)",
            lineHeight: 1.5,
            maxWidth: "36rem",
          }}
        >
          {entry.tagline}
        </p>

        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
          {entry.metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <dt
                className="font-serif italic"
                style={{ color: "var(--color-fg-muted)", fontSize: 12 }}
              >
                {m.label}
              </dt>
              <dd
                className="font-serif"
                style={{
                  color: "var(--color-fg)",
                  fontSize: "clamp(1.5rem, 2vw, 2rem)",
                  lineHeight: 1.05,
                  fontWeight: 500,
                }}
              >
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="col-span-12 flex justify-end md:col-span-3">
        <Stamp status={entry.status} />
      </div>
    </Link>
  );
}
